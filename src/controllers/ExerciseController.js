import ExerciseDAL from "../data-access-layer/ExerciseDAL.js";
import BaseContoller from "../base/BaseController.js";
import YandexS3 from "../services/YandexS3.js";
import { generateRandomName } from "../utils/generate-random-name.js";

class ExerciseController extends BaseContoller {
    constructor() {
        super();
        this.exercises = new ExerciseDAL();
        this.storage = new YandexS3();
    }

    create = async (req, res) => {
        const data = {
            title: req.body.title,
            is_static: req.body.is_static??false,
            img: req.file,
        }
        
        const imgName = generateRandomName();
        await this.storage.create(imgName, data.img);

        data.img = imgName;
        const exercise = await this.exercises.create(data);
        res.status(201).json(exercise);
    }

    get = async (req, res) => {
        const params = this.getDefaultQueryOptions(req);
        const exercises = await this.exercises.get(params);
        const {totalCount} = await this.exercises.getTotal();
        const newExercises = await this.storage.get(exercises);
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(newExercises);
    }

    find = async (req, res) => {
        const exerciseId = req.params.id;
        const exercise = await this.exercises.find(exerciseId);
        const newExercise = await this.storage.find(exercise);
        res.status(200).json(newExercise);
    }

    update = async (req, res) => {
        const data = { 
            title: req.body?.title,
            is_static: req.body?.is_static,
            img: req?.file,
        }
        const oldExercise = await this.exercises.find(req.params.id);
        if(data?.img) {
            const imgName = generateRandomName();
            await this.storage.update(oldExercise.img, imgName, data.img)
            data.img = imgName;
        }
        const exercise = await this.exercises.update(req.params.id, data);
        res.status(200).json(exercise);
    }

    delete = async (req, res) => {
        const exerciseId = Number(req.params.id);
        const exercise = await this.exercises.find(exerciseId);
        await this.storage.delete(exercise);
        await this.exercises.delete(exerciseId);
        res.status(204).send();
    }
}

export default ExerciseController;