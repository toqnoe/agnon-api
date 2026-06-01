import app from "./app.js";
import env from "./config/env.js";
import logger from "./api/utils/logger.js";
import connectDB from "./config/database.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error(`Server startup failed. ${error.message}`);
    process.exit(1);
  }
};

startServer();
