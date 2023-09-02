const FilmsModel = require("../model/filmsModel");

class FilmsService {
  getAll = async () => {
    const result = await FilmsModel.find({});
    return result || null;
  };

  add = async (data) => {
    const newFilm = await FilmsModel.create({ ...data });
    return newFilm || null;
  };
}

module.exports = new FilmsService();
