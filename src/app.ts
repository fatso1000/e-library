import express, { Request, Response, NextFunction } from "express";
import Logger from "./core/Logger";
import cors from "cors";
import { CORS_URL, ENV } from "./config";
import "./database";
import { NotFoundError, ApiError, InternalError } from "./core/ApiError";
import routesV1 from "./routes/v1";

process.on("uncaughtException", (e) => {
  Logger.error(e);
});

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(
  express.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);
app.use(cors({ origin: CORS_URL, optionsSuccessStatus: 200 }));

// ROUTES
app.use("/v1", routesV1);

// CATCH 404 AND FORWARD TO ERROR HANDLER
app.use((req, res, next) => next(new NotFoundError()));

// MIDDLEWARE ERROR HANDLER
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ApiError) {
    ApiError.handle(err, res);
  } else {
    if (ENV === "development") {
      Logger.error(err);
      return res.status(500).send(err.message);
    }
    ApiError.handle(new InternalError(), res);
  }
});

export default app;
