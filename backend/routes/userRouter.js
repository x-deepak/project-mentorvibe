const { Router } = require("express");
const { getUserDashboard, getFavorites } = require("../controllers/userController");

const userRouter = Router();

// Protected route for user dashboard
userRouter.get("/dashboard",  getUserDashboard);

userRouter.get("/favorites", getFavorites);

module.exports = userRouter;