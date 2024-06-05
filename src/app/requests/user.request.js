import Joi from "joi";
import { User, Author } from "../models";
import { MAX_STRING_SIZE, VALIDATE_PHONE_REGEX } from "@/configs";
import { AsyncValidate } from "@/utils/types";
import { tryValidateOrDefault } from "@/utils/helpers";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    column: tryValidateOrDefault(Joi.valid("created_at", "name", "email"), "created_at"),
    order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({ email: value });
                    const author = await Author.findOne({ email: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({ phone: value });
                    const author = await Author.findOne({ phone: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    confirmPassword: Joi.string()
        .valid(Joi.ref("password"))
        .required()
        .label("Xác nhận mật khẩu")
        .messages({ "any.only": "{{#label}} không khớp" }),
    role: Joi.string().valid("admin", "super-admin").default("admin").label("Vai trò"),
    status: Joi.string().valid("active", "inactive").default("active").label("Trạng thái"),
});

export const updateItem = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const userId = req.params.id;
                    const user = await User.findOne({ email: value, _id: { $ne: userId } });
                    const author = await Author.findOne({ email: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const userId = req.params.id;
                    const user = await User.findOne({ phone: value, _id: { $ne: userId } });
                    const author = await Author.findOne({ phone: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
});

export const resetPassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().label("Xác nhận mật khẩu").messages({ "any.only": "{{#label}} không khớp" }),
});
