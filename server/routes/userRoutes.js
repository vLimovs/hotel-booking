import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../configs/controllers/userController";

const userRouter = express.Router()

userRouter.get('/', protect, getUserData)
userRouter.post('/store-recent-search', protect, storeRecentSearchedCities)

export default userRouter