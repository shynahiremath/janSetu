import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateAccessToken, generateRefreshToken } from "../utils/generateToken.js";
import { fetchAgmarknetPrices } from "../services/dataGovIn.service.js";
export const register = asyncHandler(async (req, res) => {
  const { name, phone, password, role, farmLat, farmLng } = req.body;

  const existing = await User.findOne({ phone });
  if (existing) return res.status(400).json({ message: "Phone already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    phone,
    passwordHash,
    role: role || "farmer",
    farmLocation: {
      type: "Point",
      coordinates: [farmLng || 0, farmLat || 0],
    },
  });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

    res.status(201).json({
    accessToken,
    user: { id: user._id, name: user.name, role: user.role, farmLocation: user.farmLocation },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) return res.status(401).json({ message: "Invalid credentials" });

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

    res.json({
    accessToken,
    user: { id: user._id, name: user.name, role: user.role, farmLocation: user.farmLocation },
  });
});

export const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select("-passwordHash");
  res.json(user);
});