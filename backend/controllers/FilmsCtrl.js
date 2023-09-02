const asyncHandler = require("express-async-handler");

const FilmsModel = require("../model/filmsModel");
const FilmsService = require("../services/FilmsService");
const HttpError = require("../helpers/HttpError")

class FilmsCtrl {
  add = asyncHandler(async (req, res) => {
    const { title, adult } = req.body;
    if (!title || !adult) {
      res.status(400);
      throw new Error("Provide all required fields");
    }
    const newFilm = await FilmsService.add({ ...req.body });

    if (newFilm) {
      return res.status(201).json({
        code: 201,
        data: newFilm,
      });
    }
      
    res.status(400).json({
      code: 400,
      message: "Unable to add film",
    });
  });

  getAll = asyncHandler(async (_, res) => {
    const result = await FilmsService.getAll();

    if (result) {
      return res.status(200).json({
        code: 200,
        qwantity: result.length,
        data: result,
      });
    }

    res.status(400).json({
      code: 400,
      message: "Unable to fetch films",
    });
  });

  getById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await FilmsModel.findById(id);
    if (!result) {
    //   res.status(404);
    // throw new Error(`Not found with id: ${id}`);
     throw HttpError(404, `Not found with id: ${id}`)
    }
    res.status(200).json({
      code: 200,
      data: result,
    });
  });

  updateById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { title, adult } = req.body;
    if (!title || !adult) {
      res.status(400);
      throw new Error("Provide all required fields");
    }

    const result = await FilmsModel.findByIdAndUpdate(
      id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!result) {
      res.status(404);
      throw new Error(`Not found with id: ${id}`);
    }

    res.status(200).json({
      code: 200,
      data: result,
    });
  });

  deleteById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const result = await FilmsModel.findByIdAndRemove(id);
    if (!result) {
      res.status(404);
      throw new Error(`Not found with id: ${id}`);
    }
    res.status(200).json({
      code: 200,
      message: `film with id: ${id} delete success`,
    });
  });
}

module.exports = new FilmsCtrl();
