import UserDAL from "../data-layer/UserDAL.js";

class UserControlelr {
    user;
    constructor() {
        this.user = new UserDAL();
    }

    block = async (req, res) => {
        const user_id = req.params.id;
        await this.user.changeBlockStatus(user_id, true);
    }
    
    unblock = async (req, res) => {
        const user_id = req.params.id;
        await this.user.changeBlockStatus(user_id, false);
    }
}

export default UserControlelr;