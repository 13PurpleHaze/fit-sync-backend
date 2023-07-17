import fs from "fs";
import path from "path";

class Storage {
    static delete = async (name) => {
        const filePath = path.join(path.resolve(), '/src/storage', name);
        try {
            await fs.promises.unlink(filePath);
            console.log(`File has been deleted ${name}}`);
        } catch (error) {
            console.error(`Error: ${error.message}`);
        }
    }
}

export default Storage;