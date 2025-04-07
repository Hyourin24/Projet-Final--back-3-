import express from "express";
import { createGod, modifyGod, deleteGod, getAllGod } from "../controller/GodController";
import { verifyTokenMiddleware } from "../middlewares/verifyToken";
import { isAdmin } from "../middlewares/verifyRole";


const router = express.Router();

router.post("/", verifyTokenMiddleware, isAdmin, createGod);
router.put("/:id", verifyTokenMiddleware, isAdmin, modifyGod);
router.delete("/:id", verifyTokenMiddleware, isAdmin, deleteGod);
router.get("/", getAllGod);

export default router;