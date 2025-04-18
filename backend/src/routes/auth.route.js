import express from "express";
import { login, signup, logout, updateProfile, checkAuth, getAllUsers, getUserById, deleteUser } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

router.put("/update", protectRoute ,updateProfile);
router.get("/getAllUsers", protectRoute, getAllUsers)
router.get("/getUserById/:id", protectRoute, getUserById)
router.delete("/deleteUser/:id", protectRoute, deleteUser)

router.get("/check", protectRoute, checkAuth)

export default router;
