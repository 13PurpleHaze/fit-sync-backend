import db from "../db.js";
import { BadRequest } from "../errors/BadRequest.js";
import BaseDAL from "../base/BaseDAL.js";

class ExerciseDAL extends BaseDAL {
    create = async (data) => {
        const [exercise] = await db('exercises').insert(data).returning('*');
        return exercise;
    }

    find = async (exerciseId) => {
        const [exercise] = await this.get({
            filters: [{exercise_id: exerciseId}]
        });
        if(!exercise) {
            throw new BadRequest(`There is no exercises with id=${exerciseId}`);
        }
        return exercise;
    }

    get = async ({filters = [], sort = [], limit = 10, page = 1}) => {
        const query = db('exercises');
        const exercises = await this.getPaginatedFilteredSorted(query, filters, sort, limit, page);
        return exercises;
    }

    update = async (exerciseId, data) => {
        await this.find(exerciseId);
        const [exercise] = await db('exercises').where({exercise_id: exerciseId}).update(data).returning('*');
        return exercise;
    }

    delete = async (exerciseId) => {
        await this.find(exerciseId);
        await db('exercises').where({exercise_id: exerciseId}).delete();
    }

    getTotal = async () => {
        const [{count}] =  await db('exercises').count();
        return {totalCount: count};
    }
}

export default ExerciseDAL;