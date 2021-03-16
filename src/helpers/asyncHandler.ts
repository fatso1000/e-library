import { Request, Response, NextFunction } from "express";

// CONVERT THE VALUES INTO A FUNCTION PROMISIFIED
type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

// EXECUTE THE FUNCTION VIA CALLBACK
export default (execution: AsyncFunction) => (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  execution(req, res, next).catch(next);
};
