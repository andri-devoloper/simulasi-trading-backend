// require("dotenv").config();
const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
// require("dotenv").config();

const app = express();
const routes = require("./routes/routes");

app.use(cors());
app.use(express.json());
app.use("/api", routes);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports.handler = serverless(app);
