import moment from "moment";
import multer from "multer";
import path from "path";
import { BadRequest } from "../errors/BadRequest.js";

const storage = multer.diskStorage({
    destination(req, file, cb) {
        const p = path.resolve('src/storage/');
        cb(null, p);
    },
    filename(req, file, cb) {
        cb(null, `${moment().format('DDMMYY-HHmmss-SSS')}-${file.originalname}`);
    }
})

const types = ['image/jpg', 'image/jpeg', 'image/svg+xml', 'image/png'];

const fileFilter = (req, file, cb) => {
    if (types.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequest('Wrong type of file. Support types: jpg, jpeg, png, svg'));
    }
}

const upload = multer({storage, fileFilter});

export default upload;