

const { Router } = require("express");
const { getMentors, getMentor, getRatings } = require('../controllers/searchController');

const searchRouter = Router();


searchRouter.get("/", getMentors);
searchRouter.get("/mentor", getMentor);
searchRouter.get("/mentor/review", getRatings);


module.exports = searchRouter;