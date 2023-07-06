import ExerciseDAL from "../data-layer/ExerciseDAL.js";

class ExerciseController {
    constructor() {
        this.exercise = new ExerciseDAL();
    }

    get = async (req, res) => {
        const exercises = await this.exercise.get();
        res.json(exercises);
    }

    find = async (req, res) => {
        const id = Number(req.params.id);
        const exercise = await this.exercise.find(id);
        res.status(200).json(exercise);
    }

    create = async (req, res) => {
        const data = {
            title: req.body.title,
            is_static: req.body.is_static??false,
            img: req.file.filename,
        }
        console.log(data);
        const exercise = await this.exercise.create(data);
        res.status(201).json(exercise);
    }

    update = async (req, res) => {
        const data = { 
            title: req.body?.title,
            is_static: req.body?.is_static,
            img: req?.file?.filename,
        }
        console.log(data, req.file);
        await this.exercise.update(req.params.id, data);
        res.status(200).send();
    }

    delete = async (req, res) => {
        const id = Number(req.params.id);
        await this.exercise.delete(id);
        res.status(204).send();
    }
}

export default ExerciseController;