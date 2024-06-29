import express from "express";
import { getUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/Users.js";
import { verifyUser, adminOnly } from "../middlewares/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUsers);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', verifyUser, adminOnly, createUser);
router.patch('/users/:id', verifyUser, adminOnly, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);


router.post('/register/user', createUser);

export default router;