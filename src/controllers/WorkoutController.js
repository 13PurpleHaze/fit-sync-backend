import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import BaseContoller from "../base/BaseController.js";
import SessionDAL from "../data-access-layer/SessionDAL.js";
import YandexS3 from "../services/YandexS3.js";
import db from "../db.js";

class WorkoutController extends BaseContoller {
    constructor() {
        super();
        this.workouts = new WorkoutDAL();
        this.exercises = new ExerciseDAL();
        this.sessions = new SessionDAL();
        this.storage = new YandexS3();
    }

    create = async (req, res) => {
        const {
            title,
            exercises,
        } = req.body;
        const workout = await this.workouts.create({title, exercises, userId: req.user.user_id});
        res.status(201).json(workout);
    }

    find = async (req, res) => {
        const workoutId = req.params.id;
        const workout = await this.workouts.find(workoutId, req.user.user_id);
        res.status(200).json(workout);
    }

    get = async (req, res) => {
        const userId = req.user.user_id;
        const params = this.getDefaultQueryOptions(req);
        const workouts = await this.workouts.get(params);
        for(let workout of workouts) {
            const newExercises = await this.storage.get(workout.exercises);
            workout.exercises = newExercises;
        }
        const {totalCount} = await this.workouts.getTotal();
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(workouts);
    }

    update = async (req, res) => {
        const {
            title,
            exercises,
        } = req.body;
        await this.workouts.update(req.params.id, {title, exercises, userId: req.user.user_id});
        res.status(204).send();
    }

    delete = async (req, res) => {
        await this.workouts.delete(req.params.id, req.user.user_id);
        res.status(204).send();
    }

    getHistory = async (req, res) => {
        const data = await db.select(
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
          .from('session_users AS su')
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
            'su.user_id': 1,
            'su.is_finished': true
          })
          .groupBy('su.session_id', 'w.title', 'su.date_start', 'su.date_end')
          .orderBy('su.session_id');
        res.json(data);
    }
}

export default WorkoutController;