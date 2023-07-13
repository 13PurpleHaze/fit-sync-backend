import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import BaseContoller from "../base/BaseController.js";

class ExerciseController extends BaseContoller {
    constructor() {
        super();
        this.exercises = new ExerciseDAL();
    }
    
    create = async (req, res) => {
        const data = {
            title: req.body.title,
            is_static: req.body.is_static??false,
            img: req.file.filename,
        }
        const exercise = await this.exercises.create(data);
        res.status(201).json(exercise);
    }

    get = async (req, res) => {
        const params = this.getDefaultQueryOptions(req);
        const exercises = await this.exercises.get(params);
        const {totalCount} = await this.exercises.getTotal();
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(exercises);
    }

    find = async (req, res) => {
        const exerciseId = req.params.id;
        const exercise = await this.exercises.find(exerciseId);
        res.status(200).json(exercise);
    }

    update = async (req, res) => {
        const data = { 
            title: req.body?.title,
            is_static: req.body?.is_static,
            img: req?.file?.filename,
        }
        const exercise = await this.exercises.update(req.params.id, data);
        res.status(200).json(exercise);
    }

    delete = async (req, res) => {
        const exerciseId = Number(req.params.id);
        await this.exercises.delete(exerciseId);
        res.status(204).send();
    }
}

export default ExerciseController;