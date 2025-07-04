const { v4: uuidv4 } = require('uuid');

class Flower {
  constructor(nameBg, nameEng, nameLatin, filepath) {
    this.id = uuidv4();
    this.nameBg = nameBg;
    this.nameEng = nameEng;
    this.nameLatin = nameLatin;
    this.filepath = filepath;
  }
}

module.exports = Flower;
