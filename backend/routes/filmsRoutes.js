// Cannot GET /api/v1/films

const { Router } = require("express");

const filmsCtrl = require("../controllers/FilmsCtrl");
const validateId = require("../midllewares/validateId");
const rolesMidlleware = require("../midllewares/rolesMidlleware");
const authMidlleware = require("../midllewares/authMidlleware");

const filmsRouter = Router();

/* 
add film 
get all films
get one film
update film
delete film
*/

/* 
["ADMIN", "MODERATOR", "SEO", "USER", "NIKITA"]
*/

filmsRouter.post(
  "/films",
  authMidlleware,
  (req, res, next) => {
    console.log("runs Joi");
    next();
  },
  filmsCtrl.add
);

filmsRouter.get(
  "/films",
  authMidlleware,
  rolesMidlleware(["ADMIN", "MODERATOR", "USER"]),
  filmsCtrl.getAll
);

filmsRouter.get("/films/:id", validateId, filmsCtrl.getById);

filmsRouter.put("/films/:id", validateId, filmsCtrl.updateById);

filmsRouter.delete("/films/:id", validateId, filmsCtrl.deleteById);

module.exports = filmsRouter;
