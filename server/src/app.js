const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const errorHandler = require("./middleware/error.middleware");

const app = express();

// =========================
// SECURITY
// =========================

app.use(helmet());

// =========================
// CORS
// =========================

app.use(
  cors({
    origin: [
      "http://localhost:5173", // Trailing slash hatai gayi hai
      "https://airbnb-clone-frontend-f237.onrender.com",
    ],
    credentials: true,
  }),
);

// =========================
// LOGGING
// =========================

app.use(morgan("dev"));

// =========================
// BODY PARSER
// =========================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// =========================
// COOKIES
// =========================

app.use(cookieParser());

// =========================
// API ROUTES
// =========================

app.use("/api/v1", routes);

// =========================
// GLOBAL ERROR HANDLER
// =========================

app.use(errorHandler);

module.exports = app;
