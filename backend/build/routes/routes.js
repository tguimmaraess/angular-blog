"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const user_1 = __importDefault(require("./user"));
const article_1 = __importDefault(require("./article"));
router.use(user_1.default);
router.use(article_1.default);
exports.default = router;
//# sourceMappingURL=routes.js.map