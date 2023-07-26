import db from "../db.js";
import { BadRequest } from "../errors/BadRequest.js";
import BaseDAL from "../base/BaseDAL.js";

class WorkoutDAL extends BaseDAL {
    create = async (data) => {
        return await db.transaction(async trx => {
            const [workout] = await db('workouts')
                .insert({title: data.title, user_id: data.userId})
                .returning('*')
                .transacting(trx);
            
                data.exercises = Object.entries(data.exercises);
    
                const workoutExercises = await Promise.all(
                    data.exercises.map(async (exercise) => {
                      const [insertedExercise] = await db('workout_exercises')
                        .insert({ exercise_id: exercise[0], workout_id: workout.workout_id, reps: exercise[1] })
                        .returning('*')
                        .transacting(trx);
                      return insertedExercise;
                    })
                  );
            return { ...workout, exercises: workoutExercises };
        })
    }

    find = async (workoutId, userId) => {
        const [workout] = await this.get({
            filters: [{['workouts.workout_id']: workoutId}]
        });
        if(!workout) {
            throw new BadRequest(`There is no workout with id=${workoutId}`);
        }
        return workout;
    }

    get = async ({filters = [], sort = [], limit = 10, page = 1}) => {
        const query = db('workouts')
            .join('workout_exercises', 'workouts.workout_id', 'workout_exercises.workout_id')
            .join('exercises', 'exercises.exercise_id', 'workout_exercises.exercise_id')
            .select(
                'workouts.workout_id',
                'workouts.title',
                'workouts.user_id',
                'workouts.created_at',
                'workouts.updated_at',
                db.raw(`json_agg(
                            json_build_object(
                                'exercise_id', exercises.exercise_id,
                                'is_static', exercises.is_static,
                                'title', exercises.title,
                                'img', exercises.img,
                                'reps', workout_exercises.reps
                            )) filter (where exercises.exercise_id is not null) as exercises`)
            )
            .groupBy('workouts.workout_id');

        const workouts = await this.getPaginatedFilteredSorted(query, filters, sort, limit, page);
        return workouts;
    }

    update = async (workoutId, data) => {
        await this.find(workoutId, data.userId);
        await db.transaction(async trx => {
            const [workout] = await db('workouts')
                .where({workout_id: workoutId})
                .update({title: data.title, user_id: data.userId})
                .returning('*')
                .transacting(trx);
            
                if(!data.exercises) {
                    return;
                }

                await db('workout_exercises')
                    .where({workout_id: workoutId})
                    .del()
                    .transacting(trx);

                data.exercises = Object.entries(data.exercises);
                const workoutExercises = await Promise.all(
                    data.exercises.map(async (exercise) => {
                      const [insertedExercise] = await db('workout_exercises')
                        .insert({ exercise_id: exercise[0], workout_id: workout.workout_id, reps: exercise[1] })
                        .returning('*')
                        .transacting(trx);
                      return insertedExercise;
                    })
                  );
        })
    }

    delete = async (workoutId, userId) => {
        await this.find(workoutId, userId);
        await db.transaction(async trx => {
            await db('workout_exercises')
                .where({workout_id: workoutId})
                .del()
                .transacting(trx);

            await db('workouts')
                .where({workout_id: workoutId})
                .del()
                .transacting(trx);
        });    
    }

    getTotal = async () => {
        const [{count}] =  await db('workouts').count();
        return {totalCount: count};
    }

    getHistory = async ({filters = [], sort = [], limit = 10, page = 1}, userId) => {
        const query = db('session_users AS su')
          .join('sessions AS s', 's.session_id', '=', 'su.session_id')
          .join('workouts AS w', 's.workout_id', '=', 'w.workout_id')
          .join('user_exercises AS ue', function () {
            this.on('su.session_id', '=', 'ue.session_id').andOn('su.user_id', '=', 'ue.user_id');
          })
          .join('exercises AS e', 'ue.exercise_id', '=', 'e.exercise_id')
          .join('workout_exercises AS we', function () {
            this.on('w.workout_id', '=', 'we.workout_id').andOn('e.exercise_id', '=', 'we.exercise_id');
          })
          .where({
            'su.user_id': userId,
            'su.is_finished': true
          })
          .select(
            'su.session_id',
            'su.date_start',
            'su.date_end',
            'w.title',
            db.raw(
              `json_agg(json_build_object(
                'title', e.title, 
                'img', e.img,
                'user_reps', ue.reps, 
                'workout_reps', we.reps,
                'is_static', e.is_static
                )) AS exercises`
            )
          )
          .groupBy('su.session_id', 'w.title', 'su.date_start', 'su.date_end')
        const history = await this.getPaginatedFilteredSorted(query, filters, sort, limit, page);
        return history
    }

    getTotalHistory = async (userId) => {
        const [{count}] =  await db('session_users').where({user_id: userId, is_finished: true}).count();
        console.log(count);
        return {totalCount: count};
    }
}

export default WorkoutDAL;