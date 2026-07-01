import mongoose from "mongoose";
import { appConfig } from "./appConfig";

/**
 * When MongoDB runs in Docker as a replica set, it often advertises an internal
 * hostname (e.g. container id) that the host cannot resolve. The driver would
 * then try `getaddrinfo` on that name and fail. `directConnection` keeps the
 * connection on the URI host (e.g. localhost). Not used for Atlas / SRV URIs.
 */
const shouldUseDirectConnection = (uri: string): boolean => {
  if (!uri.startsWith("mongodb://")) return false;
  return (
    uri.includes("localhost") ||
    uri.includes("127.0.0.1") ||
    uri.includes("host.docker.internal")
  );
};

const connectDatabase = async () => {
  try {
    const uri = appConfig.MONGO_URI;
    await mongoose.connect(uri, {
      ...(shouldUseDirectConnection(uri) ? { directConnection: true } : {}),
    });
    console.info("Connected to database.✅");
  } catch (_error) {
    console.error("Error while connection to database.❎");
    //? Immediately stop the Node.js process if a database connection error occurs, preventing the application from running in an unstable or unusable state.
    process.exit(1);
  }
};

export default connectDatabase;
