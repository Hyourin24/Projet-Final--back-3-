import express from "express";
import { followUser, isFollowing, unfollowUser, getFollower, getFollowing, getFollowersByUserId, getFollowingByUserId } from "../controller/FollowerController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";

const router = express.Router();

router.post('/:abonne_id', verifyTokenMiddleware, followUser)
router.get('/:abonne_id/status', verifyTokenMiddleware, isFollowing) 
router.delete('/:abonne_id', verifyTokenMiddleware, unfollowUser)
router.get('/following', verifyTokenMiddleware, getFollowing)
router.get('/follower', verifyTokenMiddleware, getFollower)
router.get('/following/:id',  getFollowingByUserId)
router.get('/follower/:id',  getFollowersByUserId)

export default router