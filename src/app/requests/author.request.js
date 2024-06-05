import Joi from "joi";
import { Author, User } from "../models";
import { MAX_STRING_SIZE, VALIDATE_PHONE_REGEX } from "@/configs";
import { AsyncValidate, FileUpload } from "@/utils/types";
import { tryValidateOrDefault } from "@/utils/helpers";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    column: tryValidateOrDefault(Joi.valid("name", "email"), "name"),
    order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const createAuthor = Joi.object({
    name:
        Joi.string()
            .trim()
            .max(MAX_STRING_SIZE)
            .required()
            .label("Họ và tên"),
    email:
        Joi.string()
            .lowercase()
            .max(MAX_STRING_SIZE)
            .email()
            .required()
            .label("Email")
            .custom(
                (value, helpers) =>
                    new AsyncValidate(value, async function () {
                        const author = await Author.findOne({ email: value });
                        const user = await User.findOne({ email: value });
                        return !author && !user ? value : helpers.error("any.exists");
                    }),
            ),
    phone:
        Joi.string()
            .trim()
            .pattern(VALIDATE_PHONE_REGEX)
            .allow("")
            .label("Số điện thoại")
            .custom(
                (value, helpers) =>
                    new AsyncValidate(value, async function () {
                        const author = await Author.findOne({ phone: value });
                        const user = await User.findOne({ phone: value });
                        return !author && !user ? value : helpers.error("any.exists");
                    }),
            ),
    bio:
        Joi.string()
            .required()
            .label("Tiểu sử")
});

export const updateAuthor = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const authorId = req.params.id;
                    const author = await Author.findOne({ email: value, _id: { $ne: authorId } });
                    const user = await User.findOne({ email: value });
                    return !author && !user ? value : helpers.error("any.exists");
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
                    const authorId = req.params.id;
                    const author = await Author.findOne({ phone: value, _id: { $ne: authorId } });
                    const user = await User.findOne({ phone: value });
                    return !author && !user ? value : helpers.error("any.exists");
                }),
        ),
    bio:
        Joi.string()
            .label("Tiểu sử"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),
});