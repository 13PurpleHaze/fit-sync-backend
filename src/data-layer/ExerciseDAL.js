import db from "../db.js";
import { BadRequest } from "../errors/BadRequest.js";

class ExerciseDAL {
    get = async () => {
        const exercises = await db('exercises');
        return exercises;
    }

    find = async (id) => {
        const exercise = await db('exercises').where({exercise_id: id}).first();
        if(!exercise) {
            throw new BadRequest('Incorrect id');
        }
        return exercise;
    }

    create = async (exercise) => {
        return await db('exercises').insert(exercise);
    }

    update = async (id, newExs) => {
        const exercise = await db('exercises').where({exercise_id: id});
        if(!exercise) {
            throw new BadRequest('Incorrect id');
        }
        return await db('exercises').where({exercise_id: id}).update(newExs);
    }

    delete = async (id) => {
        const exercise = await db('exercises').where({exercise_id: id});
        if(!exercise) {
            throw new BadRequest('Incorrect id');
        }
        return await db('exercises').where({exercise_id: id}).delete();
    }
}

export default ExerciseDAL;