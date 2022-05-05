"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
exports.default = {
    userSignin(req, res) {
        (0, express_validator_1.body)('email').isEmail();
        (0, express_validator_1.body)('password').isLength({ min: 6 });
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            res.send('hello');
        }
    },
    updateUser(req, res) {
        (0, express_validator_1.body)('email').isEmail();
        (0, express_validator_1.body)('name').isLength({ min: 6 });
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() });
        }
    },
    getUser(req, res) {
    }
};
//# sourceMappingURL=controller-users.js.map