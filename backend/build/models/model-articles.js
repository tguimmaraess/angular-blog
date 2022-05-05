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
Object.defineProperty(exports, "__esModule", { value: true });
const mongo_connection_1 = require("../config/mongo-connection");
const bcrypt = require('bcrypt');
const COLLECTION_NAME = 'posts';
exports.default = {
    createArticle(req, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputPassword = req.body.password;
            const inputEmail = req.body.email;
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection(COLLECTION_NAME);
            console.log(req.body.date);
            const dbResult = yield user.insertOne({ title: req.body.title,
                post: req.body.article,
                date: new Date(req.body.date),
                author: [{
                        _id: new mongo_connection_1.ObjectId(req.body.id),
                        name: req.body.name,
                        email: req.body.email
                    }] });
            return func(dbResult);
        });
    },
    getArticles(id, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection(COLLECTION_NAME);
            const dbResult = yield user.find({ 'author._id': new mongo_connection_1.ObjectId(id) }).toArray();
            return func(dbResult);
        });
    }
};
//# sourceMappingURL=model-articles.js.map