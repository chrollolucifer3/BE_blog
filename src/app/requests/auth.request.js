import Joi from "joi";
import { User, Author } from "../models";
import { MAX_STRING_SIZE, VALIDATE_PHONE_REGEX } from "@/configs";
import { AsyncValidate, FileUpload } from "@/utils/types";
import { comparePassword } from "@/utils/helpers";

export const login = Joi.object({
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({ email: value });
                    return user ? value : helpers.error("any.wrong");
                })
        ),
    password: Joi.string()
        .max(MAX_STRING_SIZE)
        .required()
        .label("Mật khẩu")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await User.findOne({ email: req.body.email });
                    return user && comparePassword(value, user.password) ? value : helpers.error("any.wrong");
                }
                )
        )
});

export const register = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
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
    confirmPassword: Joi.string().valid(Joi.ref("password")).required().label("Xác nhận mật khẩu"),
    // avatar: Joi.object({
    //     originalname: Joi.string().trim().required().label("Tên ảnh"),
    //     mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
    //         .required()
    //         .label("Định dạng ảnh"),
    //     buffer: Joi.binary().required().label("Ảnh đại diện"),
    // })
    //     .instance(FileUpload)
    //     .allow("")
    //     .label("Ảnh đại diện"),
    role: Joi.string().valid("admin", "super-admin").default("admin").label("Vai trò"),
    status: Joi.string().valid("active", "locked").default("active").label("Trạng thái"),
});

export const updateProfile = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).label("Họ và tên"),
    email: Joi.string()
        .trim()
        .lowercase()
        .email()
        .max(MAX_STRING_SIZE)
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const user = await User.findOne({ email: value, _id: { $ne: req.currentUser._id } });
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
                    const user = await User.findOne({ phone: value, _id: { $ne: req.currentUser._id } });
                    const author = await Author.findOne({ phone: value });
                    return !user && !author ? value : helpers.error("any.exists");
                }),
        ),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện")
});

export const changePassword = Joi.object({
    currentPassword: Joi.string()
        .required()
        .label("Mật khẩu cũ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, (req) =>
                    comparePassword(value, req.currentUser.password)
                        ? value
                        : helpers.message("{#label} không chính xác"),
                ),
        ),
    password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .required()
        .label("Mật khẩu mới"),
    confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref("password"))
        .label("Xác nhận mật khẩu"),
});

