import express from "express";
import { ProtectedRequest } from "app-request";
import { AuthFailureError } from "../core/ApiError";
import RoleRepo from "../database/repository/RoleRepo";
import asyncHandler from "../helpers/asyncHandler";

const router = express.Router();

export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    // IF NOT EXISTS USER ON THE http req
    if (!req.user || !req.user.roles || !req.currentRoleCode)
      throw new AuthFailureError("Permission denied");

    // FIND USER BY ROLE CODE
    const role = await RoleRepo.findByCode(req.currentRoleCode);
    if (!role) throw new AuthFailureError("Permission denied");

    // FILTER THE ROLES OF THE USER AND VERIFY IF EXISTS
    const validRoles = req.user.roles.filter(
      (userRole: any) => userRole._id.toHexString() === role._id.toHexString()
    );

    // IF NOT EXISTS VALID ROLES ON THE USER
    if (!validRoles || validRoles.length === 0)
      throw new AuthFailureError("Permission denied");

    return next();
  })
);
