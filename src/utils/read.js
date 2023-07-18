import { readFileSync } from "fs"
import path from "path"


export default (fileName) => JSON.parse(readFileSync(path.join(process.cwd(), "src", "model", fileName), "utf-8"))