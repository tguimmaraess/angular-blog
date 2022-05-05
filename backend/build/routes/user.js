"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const controller_user_1 = __importDefault(require("../controllers/controller-user"));
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.post('/user-signin', controller_user_1.default.userSignin);
router.get('/get-user', controller_user_1.default.getUser);
router.post('/update-user', controller_user_1.default.updateUser);
router.post('/create-account', controller_user_1.default.createAccount);
exports.default = router;
//# sourceMappingURL=user.js.map