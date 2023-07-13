import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import WorkoutDAL from "../data-access-layer/WorkoutDAL.js";
import BaseContoller from "../base/BaseController.js";

class WorkoutController extends BaseContoller {
    constructor() {
        super();
        this.workouts = new WorkoutDAL();
        this.exercises = new ExerciseDAL();
    }

    create = async (req, res) => {
        const {
            title,
            exercises,
        } = req.body;
        const workout = await this.workouts.create({title, exercises, userId: 1});
        res.status(201).json(workout);
    }

    find = async (req, res) => {
        const workoutId = req.params.id;
        const workout = await this.workouts.find(workoutId);
        res.status(200).json(workout);
    }

    get = async (req, res) => {
        const userId = req.user.user_id;
        const params = this.getDefaultQueryOptions(req);
        console.log(params);
        const workouts = await this.workouts.get(params);
        const {totalCount} = await this.workouts.getTotal();
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(workouts);
    }


    getExercises = async (req, res) => {
        const workoutId = req.params.id;
        const [workout] = await this.workouts.get([{column: 'workouts.workout_id', operator: '=', value: workoutId }]);
        res.status(200).json(workout);
    } 

    update = async (req, res) => {
        const {
            title,
            exercises,
        } = req.body;
        await this.workouts.update(req.params.id, {title, exercises, userId: req.params.id});
        res.status(204).send();
    }

    delete = async (req, res) => {
        await this.workouts.delete(req.params.id, req.user.user_id);
        res.status(204).send();
    }
}

export default WorkoutController;