import mongoose from "mongoose";
import { appConfig } from "./appConfig";

const connectDatabase = async () => {
  try {
    await mongoose.connect(appConfig.MONGO_URI);
    console.info("Connected to database.🚀");
  } catch (error) {
    console.error("Error while connection to database.❎");
    // We need to do this to immediately stop the Node.js process if a database connection error occurs,
    // preventing the application from running in an unstable or unusable state.
    process.exit(1);
  }
};

export default connectDatabase;
