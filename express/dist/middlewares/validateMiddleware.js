"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const clientError_1 = __importDefault(require("../errors/clientError"));
const ValidateMiddleware = (validationSchema) => {
    return (req, res, next) => {
        const body = req.body;
        const clientError = new clientError_1.default();
        const validationClass = (0, class_transformer_1.plainToInstance)(validationSchema, body);
        (0, class_validator_1.validate)(validationClass, {}).then((errors) => {
            if (errors.length > 0) {
                clientError.data = [];
                clientError.errors = errors.map((error) => {
                    return { [error.property]: Object.values(error.constraints) };
                });
                res.status(400).send(clientError);
            }
            else {
                next();
            }
        });
    };
};
exports.default = ValidateMiddleware;
