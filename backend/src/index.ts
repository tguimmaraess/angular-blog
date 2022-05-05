import  express, {Application} from "express";
import http from "http";
import routes from "./routes/routes";
import cors from "./config/cors";
import {json, urlencoded} from "./config/body-request";

const app:Application = express();
const hostname = "127.0.0.1";
const PORT = process.env.PORT || 3000;

//Uses body parser
app.use(json);
app.use(urlencoded);

//Uses cors configuration
app.use(cors);

//All application routes
app.use("/", routes);

app.listen(PORT, (): void => {
  console.log("Server running at http://localhost:" + PORT + "/");
});
