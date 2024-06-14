import express from "express";
import cors from "cors";
import session from "express-session";
import dotenv from "dotenv";
import db from "./config/Database.js";
import { siswaRouter, datasetRouter, utilsRouter, evalRouter } from "./routes/MainRoute.js";
import SequelizeStore from "connect-session-sequelize";
dotenv.config();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

const app = express();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({ // mengatur kredensial untuk request dari frontend
    credentials: true,
    origin: 'http://localhost:3000' // domain yang diizinkan untuk mengakses API
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/siswa", siswaRouter);
app.use("/api/dataset", datasetRouter);
app.use("/api/evaluation", evalRouter);
app.use("/api/utils", utilsRouter);

app.listen(process.env.APP_PORT, ()=> {
  console.log('Server up and running...');
});
