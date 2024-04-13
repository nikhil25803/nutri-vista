import mongoose from "mongoose";

export async function connectDB() {
  const databaseName = "NutriVista";
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${databaseName}`);
    const connection = mongoose.connection;

    connection.on("connected", () => {
      // console.log(`MongoDB Connected Successfully to ${databaseName}`);
    });

    connection.on("error", (err) => {
      process.exit(1);
    });
  } catch (error) {
    process.exit(1);
  }
}
