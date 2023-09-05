const express = require("express");
const routes = require("./routes/index");
const cors = require("cors");
const AppError = require("./utils/appError");
const globalErrorHandling = require("./controller/ErrorController");
const app = express();
const http = require("http").createServer(app);

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://quranhadith.netlify.app",
      "https://quranhadith.netlify.app/",
    ],
    credentials: true,
  })
);

app.use("/v1", routes);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server❗❗`, 404));
});

app.use(globalErrorHandling);
module.exports = { app, http };
