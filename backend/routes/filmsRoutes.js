// Cannot GET /api/v1/films

const { Router } = require("express");

const filmsCtrl = require("../controllers/FilmsCtrl");
const validateId = require("../midllewares/validateId");

const filmsRouter = Router();

/* 
add film 
get all films
get one film
update film
delete film
*/

filmsRouter.post(
  "/films",
  (req, res, next) => {
    console.log("runs Joi");
    next();
  },
  filmsCtrl.add
);

filmsRouter.get("/films", filmsCtrl.getAll);

filmsRouter.get("/films/:id", validateId, filmsCtrl.getById);

filmsRouter.put("/films/:id", validateId, filmsCtrl.updateById);

filmsRouter.delete("/films/:id", validateId, filmsCtrl.deleteById);

module.exports = filmsRouter;
