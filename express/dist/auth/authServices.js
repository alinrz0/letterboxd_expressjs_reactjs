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
exports.login = exports.signup = void 0;
const index_1 = require("./../utils/index");
const usersModel_1 = __importDefault(require("../models/usersModel"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const serverError_1 = __importDefault(require("../errors/serverError"));
const signup = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findOne({ where: { email: data.email } });
    if (user)
        throw new serverError_1.default(409, "User already exists");
    const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
    const newUser = yield usersModel_1.default.create(Object.assign(Object.assign({}, data), { password: hashedPassword }));
    const token = (0, index_1.encodeToken)({ id: newUser.id });
    return { token: `${token}` };
});
exports.signup = signup;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield usersModel_1.default.findOne({ where: { email: data.email } });
    if (!user)
        throw new serverError_1.default(404, "User not found");
    const compare = yield bcrypt_1.default.compare(data.password, user.password);
    if (!compare)
        throw new serverError_1.default(400, "Invalid credentials");
    const token = (0, index_1.encodeToken)({ id: user.id });
    return { token: `${token}` };
});
exports.login = login;
