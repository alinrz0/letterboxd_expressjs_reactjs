"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const class_validator_1 = require("class-validator");
class SignupDto {
}
exports.default = SignupDto;
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Name is required." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Name cannot be empty." }),
    (0, class_validator_1.MaxLength)(20, { message: "Name must not exceed 20 characters." })
], SignupDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Email is required." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Email cannot be empty." }),
    (0, class_validator_1.IsEmail)({}, { message: "Email must be a valid email address." })
], SignupDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsDefined)({ message: "Password is required." }),
    (0, class_validator_1.IsNotEmpty)({ message: "Password cannot be empty." }),
    (0, class_validator_1.MinLength)(8, { message: "Password must be at least 8 characters long." })
], SignupDto.prototype, "password", void 0);
