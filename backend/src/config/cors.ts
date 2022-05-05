import cors from "cors";

const corsOptions = {
  origin: ["https://blog-ang.herokuapp.com", "http://localhost:4200", "http://localhost:4000"],
  allowedHeaders: ["Content-Type", "X-Skip-Interceptor"]
}

export default cors(corsOptions);
