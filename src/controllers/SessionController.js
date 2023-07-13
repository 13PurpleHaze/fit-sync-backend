import SessionDAL from "../data-access-layer/SessionDAL.js";

class SessionController {
    constructor() {
        this.session = new SessionDAL();
    }

    create = async (req, res) => {
        const workoutId = req.params.id;
        const session = await this.session.create({workoutId});
        res.status(201).json(session);
    }
}

export default SessionController;