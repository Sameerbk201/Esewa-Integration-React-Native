const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const { mydb } = require("./model/db");

const port = 9000;
const app = express();

// using cors to all allow users
app.use(cors({ origin: "*" }));
// Use morgan middleware to log HTTP requests to the console
app.use(morgan("dev"));
// this will allow to handle json
app.use(express.json());

// Serve the built React app
// app.use(express.static(path.join(__dirname, "build")));
// Routes
/* User Route */
app.use("/api/esewa", require("./Routes/EsewaRoute"));

// Serve React app for any other routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build", "index.html"));
// });

// Catch-all route for non-existent routes
app.use((req, res) => {
  res.status(404).json({ status: false, error: "Route Not found" });
});

app.listen(port, () => {
  mydb;
  console.log(`[+] SERVER STARTED AT http://localhost:${port}`);
});
