const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
require("express-async-errors");
const { connectDB } = require("./db/connect");

const parkingRoute = require("./routes/parkingRoutes");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT;

app.get("/", (req, res) => {
  res.json({ msg: "welcome" });
});

app.use("/api/v1/parking", parkingRoute);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server running on port ${port}`);
    });
  } catch (error) {
    console.log(err);
  }
};

start();
