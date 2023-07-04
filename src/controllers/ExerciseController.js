import ExerciseDAL from "../data-layer/ExerciseDAL.js";

class ExerciseController {
    constructor() {
        this.exercise = new ExerciseDAL();
    }

    get = async (req, res) => {
        const exercises = await this.exercise.get();
        res.json(exercises);
    }

    find(req, res) {

    }

    create(req, res) {

    }

    update(req, res) {

    }

    delete(req, res) {

    }
}

export default ExerciseController;