"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("./config/cors"));
const body_request_1 = __importDefault(require("./config/body-request"));
const app = (0, express_1.default)();
var hostname = '127.0.0.1';
var PORT = process.env.PORT || 3000;
app.use(body_request_1.default);
app.use(cors_1.default);
app.use('/', routes_1.default);
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
//# sourceMappingURL=index.js.map