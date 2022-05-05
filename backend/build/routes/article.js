"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_article_1 = __importDefault(require("../controllers/controller-article"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/create-article', controller_article_1.default.createArticle);
router.get('/get-articles', controller_article_1.default.getArticles);
exports.default = router;
//# sourceMappingURL=article.js.map