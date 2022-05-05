"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const model_articles_1 = __importDefault(require("../models/model-articles"));
const express_validator_1 = require("express-validator");
exports.default = {
    createArticle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log((0, express_validator_1.body)('title'));
            (0, express_validator_1.body)('title').isLength({ min: 6 });
            (0, express_validator_1.body)('post').isLength({ min: 100 });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                console.log("error");
                res.json({ errors: errors.array() });
            }
            model_articles_1.default.createArticle(req, function (result) {
                if (result) {
                    res.json({ message: 'ok' });
                }
                else {
                    res.json({ message: 'Error' });
                }
            });
        });
    },
    getArticles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            model_articles_1.default.getArticles(req.query.id, function (dbResult) {
                if (dbResult) {
                    res.json({ result: dbResult, message: 'ok' });
                }
                else {
                    res.json({ message: 'Error' });
                }
            });
        });
    },
};
//# sourceMappingURL=controller-article.js.map