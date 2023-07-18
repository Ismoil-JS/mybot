import { writeFileSync } from "fs"
import { join } from "path"

export default (path, data) => {
    writeFileSync(join(process.cwd(), "src", "model", path), JSON.stringify(data))
}