import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import BaseContoller from "../base/BaseController.js";
import SessionDAL from "../data-access-layer/SessionDAL.js";
import YandexS3 from "../services/YandexS3.js";

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
        const params = this.getDefaultQueryOptions(req);
        const history = await this.workouts.getHistory(params, req.user.user_id)
        const {totalCount} = await this.workouts.getTotalHistory(req.user.user_id);
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(history);
    }
}

export default WorkoutController;