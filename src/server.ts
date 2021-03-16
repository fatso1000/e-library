import Logger from "./core/Logger";
import { PORT } from "./config";
import app from "./app";

app
  .listen(PORT, () => {
    Logger.info(`Server running on port: ${PORT}`);
  })
  .on("error", (e) => Logger.error(e));
