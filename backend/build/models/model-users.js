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
exports.default = {
    userSignin(req, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputPassword = req.body.password;
            const inputEmail = req.body.email;
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection("users");
            const dbResult = yield user.findOne({ email: inputEmail });
            if (dbResult) {
                bcrypt.compare(inputPassword, dbResult.password, function (error, result) {
                    return func(error, result, dbResult);
                });
            }
        });
    },
    createAccount(req, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const inputPassword = req.body.password;
            const inputEmail = req.body.email;
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection("users");
            const dbResult = yield user.findOne({ email: inputEmail });
            console.log(dbResult);
            if (dbResult !== null) {
                const error = true;
                return func(error, null);
            }
            else {
                bcrypt.genSalt(10, function (error, salt) {
                    bcrypt.hash(inputPassword, salt, function (error, hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            const dbResult = yield user.insertOne({ name: req.body.name, email: inputEmail, password: hash });
                            if (dbResult) {
                                return func(null, dbResult);
                            }
                        });
                    });
                });
            }
        });
    },
    updateUser(req, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection("users");
            const dbResult = yield user.updateOne({ _id: new mongo_connection_1.ObjectId(req.body.id) }, { $set: { name: req.body.name } });
            return func(dbResult);
        });
    },
    getUser(id, func) {
        return __awaiter(this, void 0, void 0, function* () {
            const database = yield (0, mongo_connection_1.connection)();
            const user = database.collection("users");
            const dbResult = yield user.findOne({ _id: new mongo_connection_1.ObjectId(id) });
            return func(dbResult);
        });
    }
};
//# sourceMappingURL=model-users.js.map