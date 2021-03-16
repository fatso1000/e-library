import { Router } from "express";
import ApiKeyRepo from "../database/repository/ApiKeyRepo";
import { ForbiddenError } from "../core/ApiError";
import Logger from "../core/Logger";
import { PublicRequest } from "app-request";
import schema from "./schema";
import validator, { ValidationSource } from "../helpers/validator";
import asyncHandler from "../helpers/asyncHandler";

const router = Router();

// VERIFY IF EXISTS THE PARAMETER APIKEY IN THE HEADERS

export default router.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: PublicRequest, res: any, next: any) => {
    // @ts-ignore
    req.apiKey = req.headers["x-api-key"].toString();

    // VERIFY IF THE APIKEY EXISTS IN THE DATABASE
    const apiKey = await ApiKeyRepo.findByKey(req.apiKey);
    Logger.info(apiKey);

    // IF NOT EXISTS THROWS ERROR
    if (!apiKey) throw new ForbiddenError();
    return next();
  })
);
