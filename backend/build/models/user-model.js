"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const database = require('../config/database-connection');
const conn = database.connection;
exports.default = {
    userSignin(req, func) {
        conn.query(`SELECT * FROM administrators
                WHERE email = '${req.body.email}'
                AND password = '${req.body.password}'`, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                func(result, null);
            }
        });
    },
    updateUser(req, func) {
        conn.query(`UPDATE administrators SET
                email = '${req.body.email}',
                name = '${req.body.name}'
                WHERE id = ${req.body.id}`, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                return func(result, null);
            }
        });
    },
    getUser(req, func) {
        conn.query(`SELECT * FROM administrators WHERE id = ${req.query.id}`, function (error, result) {
            if (error) {
                throw error;
            }
            else {
                return func(result);
            }
        });
    }
};
//# sourceMappingURL=user-model.js.map