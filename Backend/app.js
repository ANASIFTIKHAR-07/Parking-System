import express, { json, urlencoded } from "express"
import cookieParser from "cookie-parser"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import helmet from "helmet"
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


app.use(mongoSanitize())
app.use(xss())
app.use(cookieParser());
app.use(urlencoded({limit: "16kb", extended: true}));
app.use(json({limit: "16kb"}));
app.use(helmet())




//  Routes Imports And Declaration
import adminRouter from "./routes/auth.routes.js"
import authRouter from "./routes/auth.routes.js";

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/admin", adminRouter)

export { app }