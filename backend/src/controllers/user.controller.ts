// src/controllers/user.controller.ts
import { Request, Response } from "express";
import { User, IUser } from "../models/user.model";
import bcrypt from "bcrypt";

// Get all users
const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    console.error("Get Users Error:", err);
    res.status(500).json({ error: "Unable to get students" });
  }
};

// Get user by id
const getUserById = async (
  req: Request<{ id: string }>,
  res: Response
): Promise<void> => {
  try {
    const user = await User.findById(req.params);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get User By ID Error:", error);
    res.status(500).json({ error: `Unable to get the student` });
  }
};

// Register
const registerUser = async (
  req: Request<{}, {}, Omit<IUser, "matches" | "win" | "signUpDate" | "_id">>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ message: "Username and Password are required" });
      return;
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(409).json({ message: "Username already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: IUser = new User({
      username,
      password: hashedPassword,
      matches: 0,
      win: 0,
      signUpDate: new Date(),
    });

    await newUser.save();

    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    res.status(201).json(userToReturn);
  } catch (error) {
    console.error("Register User Error:", error);
    res.status(500).json({ error: "Unable to add student" });
  }
};

// Login
const loginUser = async (
  req: Request<{}, {}, Omit<IUser, "matches" | "win" | "signUpDate" | "_id">>,
  res: Response
): Promise<void> => {
  try {
    const { username, password } = req.body;
    console.log(req.body);

    if (!username || !password) {
      res.status(400).json({ message: "Username and password are required." });
      return;
    }

    const user = await User.findOne({ username });
    console.log(user);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(403).json({ message: "Passwords do not match" });
      return;
    }

    // const findUser = await User.findOne({ username, password });
    req.session!.isAuthenticated = true;
    req.session!.userId = user?._id.toString();

    res.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Profile
const userProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { userId }: any = req.session;
    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(user);
  } catch (error) {
    console.error("User Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Logout
const logoutUser = (req: Request, res: Response): void => {
  try {
    req.session = { isAuthenticated: false, userId: "" };
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout User Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update user
const updateUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      res.status(404).json({ error: `The student does not exist` });
    }
    res.status(200).json({ message: "Update user successfully" });
  } catch (err) {
    console.error("Failed to update user:", err);
    res.status(500).json({ error: `Unable to update the student` });
  }
};
// Delete user by id
const deleteUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404).json({ error: "The user does not exist" });
    }
    res.status(200).json({ message: "Delete the user", user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Unable to delete the user" });
  }
};

export default {
  getAllUsers,
  getUserById,
  registerUser,
  loginUser,
  userProfile,
  logoutUser,
};
