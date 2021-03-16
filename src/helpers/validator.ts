import Joi from "@hapi/joi";
import { Request, Response, NextFunction } from "express";
import Logger from "../core/Logger";
import { BadRequestError } from "../core/ApiError";
import { Types } from "mongoose";

export enum ValidationSource {
  BODY = "body",
  HEADER = "headers",
  QUERY = "query",
  PARAM = "params",
}

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error("any.invalid");
    return value;
  }, "Object Id Validation");

export const JoiUrlEndpoint = () =>
  Joi.string().custom((value: string, helpers) => {
    if (value.includes("://")) return helpers.error("any.invalid");
    return value;
  }, "Url Endpoint Validation");

// NEW TYPE ON JOI
export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith("Bearer ")) return helpers.error("any.invalid");
    if (!value.split(" ")[1]) return helpers.error("any.invalid");
    return value;
  }, "Authorization Header Validation");

  // VERIFY IF THE DATA PROVIDED IS ACCEPTED BY JOI
export default (
  schema: Joi.ObjectSchema,
  source: ValidationSource = ValidationSource.BODY
) => (req: Request, res: Response, next: NextFunction) => {
  try {
    // VALIDATE THE DATA PROVIDED
    // VALIDATION SOURCE IS WHERE THE DATA IS PROVIDED, EG: BODY, HEADER, ETC.
    const { error } = schema.validate(req[source]);

    if (!error) return next();

    // ERROR MESSAGE IF SCHEMA IS NOT VALID
    const { details } = error;
    const message = details
      .map((i) => i.message.replace(/['"]+/g, ""))
      .join(",");
    Logger.error(message);

    next(new BadRequestError(message));
  } catch (error) {
    // ERROR MESSAGE IF AN ERROR OCCURS OUTSIDE SCHEMA
    next(error);
  }
};
