import mongoose from "mongoose";

type ConnectinObject = {
  isConnected?: number;
};

const connection: ConnectinObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected successfully");
  } catch (error) {
    console.log("DB connection failed", error);

    process.exit(1); // exit gracefully
  }
}

export default dbConnect;
