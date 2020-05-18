require("dotenv").config({ debug: process.env.DEBUG });

import express from "express";
import cors from "cors";
import routes from "./routes";

const port: number = parseInt(process.env.PORT || "") || 5000;

const app = express();

app.use(cors());
app.use(routes);

app.listen(port, () => console.log(`[server] Express is running at http://127.0.0.1:${process.env. port}`));
