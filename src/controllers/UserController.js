import BaseContoller from "../base/BaseController.js";
import UserDAL from "../data-access-layer/UserDAL.js";

class UserControlelr extends BaseContoller {
    constructor() {
        super();
        this.users = new UserDAL();
    }

    block = async (req, res) => {
        const userId = req.params.id;
        await this.users.changeBlockStatus(userId, false);
        res.status(204).send();
    }
    
    unblock = async (req, res) => {
        const userId = req.params.id;
        await this.users.changeBlockStatus(userId, true);
        res.status(204).send();
    }

    get = async (req, res) => {
        const params = this.getDefaultQueryOptions(req);
        const users = await this.users.get(params);
        const {totalCount} = await this.users.getTotal();
        res.setHeader('x-total-count', totalCount);
        res.status(200).json(users);
    }

    create = async (req, res) => {
        const {
            login,
            password,
            first_name,
            sur_name,
            age,
            gender,
        } = req.body;

        const user = await this.users.create({
            login,
            password,
            first_name,
            sur_name,
            age,
            gender,
        });
        
        res.status(201).json(user);
    }
}

export default UserControlelr;