import keyboardNames from "./keyboards.names.js"
import read from "../utils/read.js"

const allCources = read("cources.json")

const result = []

for (let i = 0; i < allCources.length; i += 2) {
    const courcesArray = []

    if (allCources[i]) {
        courcesArray.push({
            text: allCources[i].name
        }, {
            text: allCources[i + 1].name
        })
    }

    result.push(courcesArray.filter(e => e))

}

result.push([{
    text: keyboardNames.back
}])


export default {
    menu: [
        [keyboardNames.aboutCources, keyboardNames.aboutUs],
        [keyboardNames.ourLocations],
    ],
    cources: result,
}