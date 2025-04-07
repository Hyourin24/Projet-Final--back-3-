import express from "express";
import { followUser, unfollowUser, getFollower, getFollowing } from "../controller/FollowerController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = express.Router();

router.post('/', verifyTokenMiddleware, followUser)
router.delete('/', verifyTokenMiddleware, unfollowUser)
router.get('/following', verifyTokenMiddleware, getFollowing)
router.get('/follower', verifyTokenMiddleware, getFollower)

export default router