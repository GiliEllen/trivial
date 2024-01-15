import { Router } from "express";
import { User } from "./users.model";

export const router = Router();

router.post("/updateUserPoints", async (req, res) => {
  const { userId, points } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $inc: { points } },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User points updated successfully", user });
  } catch (error) {
    console.error("Error updating user points:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
