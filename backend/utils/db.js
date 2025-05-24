import mongoose from "mongoose";
function db() {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => {
      console.log("Connected to DB");
    })
    .catch((e) => {
      console.log("Error connecting DB => ", e);
    });
}
export default db;
