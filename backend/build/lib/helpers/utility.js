"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDateTime = void 0;
const getDate = function () {
    const date = new Date();
    if (date.getMonth() < 10) {
        return `${date.getFullYear()}-0${date.getMonth() + 1}-${date.getDate()}`;
    }
    else {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    }
};
const getTime = function () {
    const date = new Date();
    return `${date.getHours()}:${date.getMinutes()}`;
};
const getDateTime = function () {
    const date = new Date();
    return `${getDate()} ${getTime()}`;
};
exports.getDateTime = getDateTime;
//# sourceMappingURL=utility.js.map