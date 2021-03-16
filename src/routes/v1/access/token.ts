import express from "express";
import { TokenRefreshResponse } from "../../../core/ApiResponse";
import { ProtectedRequest } from "app-request";
import { Types } from "mongoose";
import UserRepo from "../../../database/repository/UserRepo";
import { AuthFailureError } from "../../../core/ApiError";
import JWT from "../../../core/JWT";
import KeystoreRepo from "../../../database/repository/KeystoreRepo";
import crypto from "crypto";
import {
  createTokens,
  getAccessToken,
  validateTokenData,
} from "../../../auth/authUtils";
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";

const router = express.Router();

router.post(
  "/refresh",
  // VERIFY IF THE USER IS LOGGED IN, searches the jwt in req.HEADER
  validator(schema.auth, ValidationSource.HEADER),
  // VERIFY THE TOKEN
  validator(schema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res) => {
    // Obtain the accessToken from the headers and save in req.accessToken
    req.accessToken = getAccessToken(req.headers.authorization);

    // Decode the jwt token and validate it
    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    // Find a user with the 
    const user = await UserRepo.findById(
      new Types.ObjectId(accessTokenPayload.sub)
    );
    if (!user) throw new AuthFailureError("User not registered");
    req.user = user;

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub) {
      throw new AuthFailureError("Invalid access token");
    }

    const keystore = await KeystoreRepo.find(
      req.user._id,
      accessTokenPayload.prm,
      refreshTokenPayload.prm
    );

    if (!keystore) throw new AuthFailureError("Invalid Access Token");
    await KeystoreRepo.remove(keystore._id);

    const accessTokenKey = crypto.randomBytes(64).toString("hex");
    const refreshTokenKey = crypto.randomBytes(64).toString("hex");

    // @ts-ignore
    await KeystoreRepo.create(req.user_id, accessTokenKey, refreshTokenKey);
    const tokens = await createTokens(
      req.user,
      accessTokenKey,
      refreshTokenKey
    );

    new TokenRefreshResponse(
      "Token Issued",
      tokens.accessToken,
      tokens.refreshToken
    ).send(res);
  })
);

export default router;
