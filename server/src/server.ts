import * as config from "./config";
import express from "express";
import morgan from "morgan";
import upload from "express-fileupload";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { accessLogStream } from "./generator";

import { connectToDB } from "./models/DB_connect";
import { addNewUser } from "./add_new_user";
import { saveImagesToDB } from "./add_images";

import { signupRouter } from "./routes/signup";
import { authRouter } from "./routes/authorization";
import { galleryRouter } from "./routes/gallery";
import { writeErrorLogs } from "./error_handler";

const PORT = 5000;
const app = express();

startServer();

app.use(passport.initialize());

app.use(morgan('tiny', { stream: accessLogStream }));

app.use("/", express.static(config.SCRIPTS_STATIC_PATH), express.static(config.SOURCES_STATIC_PATH));

app.use(express.json());

app.use("/", signupRouter);

app.use("/", authRouter);

app.use(upload());

app.use("/", galleryRouter);

app.use((req, res) => {
    res.redirect('http://localhost:5000/404.html');
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    if (err) {
        console.error(err.stack)
        writeErrorLogs(err.message, err.stack)
        res.status(500).send(err.message)
    }
})

async function startServer() {
    console.log('start server');
    
    await connectToDB();
    await addNewUser();
    await saveImagesToDB();

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
}
