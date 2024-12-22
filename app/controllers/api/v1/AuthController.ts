import { Request, Response } from "express";
import { UserService } from "../../../services/UserService";
import { UserType } from "../../../models/UserModel";

const userService = new UserService();

export class AuthController {
    public static async register(req: Request, res: Response): Promise<Response> {
        try {
            const { username, email, password }: UserType = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Please provide a valid input"
                })
            }

            const userEmail = await userService.findUserByEmail(email);

            if (userEmail) {
                return res.status(400).json({
                    status: "Failed",
                    message: "Email already exists"
                })
            }

            const user = await userService.registerUser({
                username,
                email,
                password,
            });

            return res.status(201).json({
                status: "Success",
                message: "User successfully registered",
                data: user
            });
        } catch (error) {
            console.error("Internal Server Error:", error);
            return res.status(500).json({
                status: "Failed",
                message: 'Internal Server Error',
                error: error
            });
        }
    }

    public static async login(req: Request, res: Response): Promise<Response> {
        try {
            const { email, password } = req.body;

            const user = await userService.findUserByEmail(email);

            if (!user) {
                return res.status(404).json({
                    status: "Failed",
                    message: "Email not found"
                });
            }


            const isPasswordCorrect = await userService.verifyPassword(password, user.password as string);

            if (!isPasswordCorrect) {
                return res.status(401).json({ status: "Failed", message: "Wrong password" });
            }

            const token = await userService.generateToken(user);

            return res.status(200).json({
                status: "Success",
                message: "Login successful",
                data: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    token,
                    created_at: user.created_at,
                    updated_at: user.updated_at
                }
            })
        } catch (error) {
            return res.status(500).json({ status: "Failed", message: "Internal server error" })
        }
    }

    public static async getCurrentUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = await userService.checkUserFromToken(req.headers.authorization as string);
            return res.status(200).json({
                status: "Success",
                message: "User data retrieved successfully",
                data: user
            });
        } catch (error: any) {
            console.error("Get Current User Error:", error.message);
            return res.status(error.message === "No token provided" ? 401 : 404).json({
                status: "Failed",
                message: error.message
            });
        }
    }

    public static async updateUser(req: Request, res: Response): Promise<Response> {
        try {
            const user = await userService.checkUserFromToken(req.headers.authorization);

            if (!user) {
                res.status(404).json({ status: "Failed", message: "User not found" })
            }

            const { username, email } = req.body;

            const updatedUser = await userService.updateUser(user.id, {
                username: username || user.username,
                email: email || user.email,
            });

            return res.status(200).json({
                status: "Success",
                message: "User updated successfully",
                data: updatedUser
            });
        } catch (error: any) {
            console.error("Update User Error:", error.message);
            return res.status(error.message === "No token provided" ? 401 : 404).json({
                status: "Failed",
                message: error.message
            });
        }
    }

}