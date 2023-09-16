const FilmsModel = require("../model/filmsModel");

class FilmsService {
  getAll = async (owner, adult = null) => {
    const reqQuery = adult === null ? { owner } : { owner, adult };

    const result = await FilmsModel.find(reqQuery);
    return result || null;
  };

  add = async (data) => {
    const newFilm = await FilmsModel.create({ ...data });
    return newFilm || null;
  };
}

module.exports = new FilmsService();
