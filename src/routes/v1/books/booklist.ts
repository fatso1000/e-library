import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import { NoDataError, BadRequestError } from "../../../core/ApiError";
import BookRepo from "../../../database/repository/BookRepo";
import { Types } from "mongoose";
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from "./schema";
import asyncHandler from "../../../helpers/asyncHandler";
import User from "../../../database/models/User";

const router = express.Router();

router.get(
  "/tag/:tag",
  validator(schema.bookTag, ValidationSource.PARAM),
  validator(schema.pagination, ValidationSource.QUERY),
  asyncHandler(async (req, res) => {
    const books = await BookRepo.findByTagAndPaginated(
      req.params.tag,
      parseInt(req.query.pageNumber as string),
      parseInt(req.query.pageItemCount as string)
    );
  })
);
