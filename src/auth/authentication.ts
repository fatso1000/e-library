import express from "express";
import { ProtectedRequest } from "app-request";
import UserRepo from "../database/repository/UserRepo";
import {
  AuthFailureError,
  AccessTokenError,
  TokenExpiredError,
} from "../core/ApiError";
import JWT from "../core/JWT";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import { Types } from "mongoose";
import { getAccessToken, validateTokenData } from "./authUtils";
import validator, { ValidationSource } from "../helpers/validator";
import schema from "./schema";
import asyncHandler from "../helpers/asyncHandler";

const router = express.Router();

export default router.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      // VALIDATE THE JWT OBTAINED BEFORE
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      // FIND BY ID A USER WITH THE JWT
      const user = await UserRepo.findById(new Types.ObjectId(payload.sub));
      if (!user) throw new AuthFailureError("User not registered");
      // Save the user in the http req
      req.user = user;

      // FIND A USER BY KEY
      const keystore = await KeystoreRepo.findforKey(req.user._id, payload.prm);
      if (!keystore) throw new AuthFailureError("Invalid access token");
      // Save the keystore in the http req
      req.keystore = keystore;

      return next();
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new AccessTokenError(error.message);
      throw error;
    }
  })
);
