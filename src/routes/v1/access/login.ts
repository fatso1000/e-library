import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import crypto from "crypto";
import UserRepo from "../../../database/repository/UserRepo";
import { BadRequestError, AuthFailureError } from "../../../core/ApiError";
import KeystoreRepo from "../../../database/repository/KeystoreRepo";
import { createTokens } from "../../../auth/authUtils";
import validator from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";
import bcrypt from "bcrypt";
import _ from "lodash";

const router = express.Router();

export default router.post(
  "/basic",
  validator(schema.userCredential),
  asyncHandler(async (req, res) => {
    //   Verify if user exists in the database and if the user has password
    const user = await UserRepo.findByEmail(req.body.email);
    if (!user) throw new BadRequestError("User not registered");
    if (!user.password) throw new BadRequestError("Credential not set");

    // Verify if the password matches with the database
    const match = await bcrypt.compare(req.body.password, user.password);
    if (!match) throw new AuthFailureError("Authentication failure");

    // Create tokens 
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    // save the tokens in the database with the id of the user
    await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

    new SuccessResponse("Login Success", {
      user: _.pick(user, ["_id", "name", "roles", "profilePicUrl"]),
      tokens: tokens,
    }).send(res);
  })
);
