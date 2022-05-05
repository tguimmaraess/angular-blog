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
const model_users_1 = __importDefault(require("../models/model-users"));
const express_validator_1 = require("express-validator");
exports.default = {
    userSignin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, express_validator_1.body)('email').isEmail();
            (0, express_validator_1.body)('password').isLength({ min: 6 });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.json(errors.array());
            }
            const inputPassword = req.body.password;
            const inputEmail = req.body.email;
            model_users_1.default.userSignin(req, function (error, result, dbResult) {
                if (result) {
                    res.json({ result: dbResult, message: 'ok' });
                }
                else {
                    res.json({ message: 'Error. Check your email and password' });
                }
            });
        });
    },
    createAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, express_validator_1.body)('email').isEmail();
            (0, express_validator_1.body)('name').not().isEmpty();
            (0, express_validator_1.body)('password').isLength({ min: 6 });
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.json({ errors: errors.array() });
            }
            model_users_1.default.createAccount(req, function (error, result) {
                if (error) {
                    res.json({ message: 'Email address already exists. Please, choose a different one.' });
                }
                else {
                    if (result) {
                        res.json({ result: result, message: 'ok' });
                    }
                    else {
                        res.json({ message: 'error' });
                    }
                }
            });
        });
    },
    updateUser(req, res) {
        (0, express_validator_1.body)('email').isEmail();
        (0, express_validator_1.body)('name').isLength({ min: 6 });
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }
        model_users_1.default.updateUser(req, function (result) {
            if (result) {
                res.json({ result: result, message: 'ok' });
            }
            else {
                res.json({ message: 'error' });
            }
        });
    },
    getUser(req, res) {
        const id = req.query.id;
        model_users_1.default.getUser(id, function (result) {
            if (result) {
                res.json({ result: result, message: 'ok' });
            }
            else {
                res.json({ message: 'error' });
            }
        });
    }
};
//# sourceMappingURL=controller-user.js.map