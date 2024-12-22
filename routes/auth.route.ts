import { Router } from "express";
import { AuthController } from "../app/controllers/api/v1/AuthController";

const router = Router();

router.get('/', AuthController.getCurrentUser);
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.put("/update", AuthController.updateUser);

export default router;