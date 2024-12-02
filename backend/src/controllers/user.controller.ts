import { Request, Response } from "express";
import { User } from "../models/user.model";

// Get all products
const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to get all Users" });
  }
};

export default {
  getAllUsers,
};
