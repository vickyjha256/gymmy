import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import router from "./common/routes";
import { errorHandler } from "./common/middleware/error.middleware";


const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(cookieParser());

app.use(express.json());


app.use(express.urlencoded({ extended: true }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/v1", router);


app.use(errorHandler);

export default app;