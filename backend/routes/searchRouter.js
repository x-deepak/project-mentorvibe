

const { Router } = require("express");
const { getMentors } = require('../controllers/searchController');

const searchRouter = Router();


searchRouter.get("/", getMentors);


module.exports = searchRouter;