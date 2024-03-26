const express = require("express");
const app = express();
const path = require("path");
const PORT = process.env.PORT || 3600;
const { logger } = require("./middleware/logEvents");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorHandler");
const corsOptions = require('./config/corsoption')

//custome-Middlewares:
app.use(logger);

//third-party-middleware
app.use(cors(corsOptions));

//middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//routes
app.use("/", express.static(path.join(__dirname, "./public")));
app.use("/", require("./routes/root"));
app.use("/employees", require("./routes/api/employees"));

app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 not found" });
  } else {
    res.send("404 not found");
  }
});

app.use(errorHandler);

//listening port
app.listen(PORT, () => console.log(`port running on ${PORT}`));
