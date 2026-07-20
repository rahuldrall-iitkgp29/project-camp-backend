import express from "express";
import cors from "cors";

import cookieParser from "cookie-parser";

const app = express();

// basic configurations
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));

app.use(cookieParser());// now we have access to cookies in our request object and we can set cookies in our response object

//cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  }),
);

// import routes
import healthCheckRouter from "./routes/healthCheck_route.js";
import authRouter from "./routes/auth.route.js"

app.use("/api/v1/healthcheck", healthCheckRouter);
// we just add extra routing to our healthcheck
// from "/" to "/api/v1/healthcheck/" and if add smt further route in router lets say we make an another router there with "/insta" then its become "/api/v1/healthcheck/insta"

app.use("/api/v1/auth" , authRouter);

app.get("/", (req, res) => {
  res.send("this is the instagram page");
});

export default app;
