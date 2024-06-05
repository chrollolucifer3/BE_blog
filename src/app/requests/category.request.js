import Joi from "joi";
// import { Category } from "../models";
import { MAX_STRING_SIZE } from "@/configs";
import { tryValidateOrDefault } from "@/utils/helpers";
// import { AsyncValidate } from "@/utils/types";

export const createCategory = Joi.object({
    name:
        Joi.string()
            .max(MAX_STRING_SIZE)
            .required()
            .label("Tên"),
    description:
        Joi.string()
            .max(MAX_STRING_SIZE)
            .required()
            .label("Mô tả")
});

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "name"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const updateCategory = Joi.object({
    name:
        Joi.string()
            .max(MAX_STRING_SIZE)
            .label("Tên"),
    description:
        Joi.string()
            .max(MAX_STRING_SIZE)
            .label("Mô tả")
});