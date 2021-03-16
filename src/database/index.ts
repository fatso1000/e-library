import mongoose, { ConnectOptions } from "mongoose";
import Logger from "../core/Logger";
import { DB, PORT } from "../config";

// CONNECTION STRING
// const DB_URI = `mongodb+srv://${DB.USER}:${encodeURIComponent(DB.PASSWORD)}@${
//   DB.HOST
// }:${DB.NAME}`;
const DB_URI = `mongodb+srv://${DB.USER}:${encodeURIComponent(
  DB.PASSWORD
)}@cluster0.laqyg.mongodb.net/${DB.NAME}?retryWrites=true&w=majority`;

const options: ConnectOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  autoIndex: true,
  poolSize: 10, // Maintain up to 10 socket connections
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0,
  connectTimeoutMS: 10000, // Give up initial connection after 10 secs
  socketTimeoutMS: 45000, // Close sockets after 45 secs of inactivity
};

Logger.debug(DB_URI);

// CREATE DATABASE CONNECTION
mongoose
  .connect(DB_URI, options)
  .then(() => {
    Logger.info(`Mongoose connection done`);
  })
  .catch((e) => {
    Logger.info("Mongoose connection error");
    Logger.error(e);
  });

// CONNECTION EVENTS
// Succesfully connected
mongoose.connection.on("connected", () => {
  Logger.info("Mongoose default connection open to " + DB_URI);
});

// If the connection throws an error
mongoose.connection.on("error", (err) => {
  Logger.error("Mongoose default connection error: " + err);
});

// When the connection is disconnected
mongoose.connection.on("disconnected", () => {
  Logger.info("Mongoose default connection disconnected");
});

// If the node process ends, close the Mongoose connection
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    Logger.info(
      "Mongoose default connection disconnected through app termination"
    );
    process.exit(0);
  });
});
