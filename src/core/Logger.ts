import { createLogger, transports, format } from "winston";
import fs from "fs";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import { ENV, LOG_DIRECTORY } from "../config";

// !!THIS IS A LOGGER CREATED WITH WINSTON THAT IS A LOGGING LIBRARY!!

let dir = LOG_DIRECTORY;
if (!dir) dir = path.resolve("logs");

// CREATE DIRECTORY IF IT IS NOT PRESENT
if (!fs.existsSync(dir)) {
  // Create the directory if it does not exist
  fs.mkdirSync(dir);
}

const LOG_LEVEL = ENV === "development" ? "debug" : "warn";

const options = {
  file: {
    level: LOG_LEVEL,
    filename: dir + "/%DATE%.log",
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    timestamp: true,
    handleExceptions: true,
    humanReadableUnhandledException: true,
    prettyPrint: true,
    json: true,
    maxSize: "20m",
    colorize: true,
    maxFiles: "14d",
  },
};

export default createLogger({
  transports: [
    new transports.Console({
      level: LOG_LEVEL,
      format: format.combine(
        format.errors({ stack: true }),
        format.prettyPrint()
      ),
    }),
  ],
  exceptionHandlers: [new DailyRotateFile(options.file)],
  exitOnError: false, // do not exit on handled exceptions
});
