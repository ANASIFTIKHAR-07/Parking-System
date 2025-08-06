import express, { json, urlencoded } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"



const app = express()

app.use(cors(
    {
        origin: process.env.CORS_ORIGIN,
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
        allowedHeaders: ["Content-Type", "Authorization"]
    }
))

app.use(cookieParser());
app.use(urlencoded({limit: "16kb", extended: true}));
app.use(json({limit: "16kb"}));




//  Routes Imports And Declaration

import authRouter from "./routes/auth.routes.js";
import vehicleRouter from "./routes/vehicle.routes.js"

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vechile", vehicleRouter);


export { app }