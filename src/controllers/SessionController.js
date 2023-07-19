import SessionDAL from "../data-access-layer/SessionDAL.js";
import BaseContoller from "../base/BaseController.js";

class SessionController extends BaseContoller {
    constructor() {
        super();
        this.session = new SessionDAL();
    }

    create = async (req, res) => {
        const workoutId = req.params.id;
        const session = await this.session.create({workoutId});
        res.status(201).json(session);
    }


    getUsers = async (req, res) => {
        const sessionId = req.params.id;
        const users = await this.session.getUsers(sessionId);
        res.status(200).json(users);
    }
}

export default SessionController;