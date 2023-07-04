import db from "../db.js";

class ExerciseDAL {
    get = async () => {
        const exercises = await db('exercises');
        return exercises;
    }

    find = async (id) => {
        const exercise = await db('exercises').where({exercise_id: id});
        return exercise;
    }

    create = async (exercise) => {
        return await db('exercises').insert(exercise);
    }

    update = async (oldExs, newExs) => {
        return await db('exercises').where(oldExs).update(newExs);
    }

    delete = async (exercise) => {
        return await db('exercises').where(exercise).delete();
    }
}

export default ExerciseDAL;