"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ServerError {
    constructor(status, message) {
        this.status = status;
        this.message = message;
    }
}
exports.default = ServerError;
