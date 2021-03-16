import express from "express";
import crypto from "crypto";
import { BadRequestError } from "../../../core/ApiError";
import User from "../../../database/models/User";
import { createTokens } from "../../../auth/authUtils";
import validator from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";
import bcrypt from "bcrypt";
import _ from "lodash";
import { RoleCode } from "../../../database/models/Role";
import { RoleRequest } from "app-request";
import UserRepo from "../../../database/repository/UserRepo";
import { SuccessResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.post(
  "/basic",
  validator(schema.signup),
  asyncHandler(async (req: RoleRequest, res) => {
    //   Check if email is already registered
    const user = await UserRepo.findByEmail(req.body.email);
    if (user) throw new BadRequestError("User already registered");

    // Create the tokens, refresh token and the password hashed
    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    // Create the user in the database
    const { user: createdUser, keystore } = await UserRepo.create(
      {
        name: req.body.name,
        email: req.body.email,
        profilePicUrl: req.body.profilePicUrl,
        password: passwordHash,
      } as User,
    //   When use: {...} as User, means that the object is the type User
      accessTokenKey,
      refreshTokenKey,
      RoleCode.USER
    );

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey
    );
    new SuccessResponse("Signup Successful", {
      user: _.pick(createdUser, [
        "_id",
        "name",
        "email",
        "roles",
        "profilePicUrl",
      ]),
      tokens: tokens,
    }).send(res);
  })
);

export default router;
