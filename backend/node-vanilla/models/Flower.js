const { v4: uuidv4 } = require('uuid');

class Flower {
    constructor(nameBg, nameEng, filepath) {
        this.id = uuidv4();
        this.nameBg = nameBg;   
        this.nameEng = nameEng;   
        this.filepath = filepath;   
    }
}

module.exports = Flower;