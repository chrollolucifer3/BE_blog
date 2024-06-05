import Joi from "joi";
// import { Post } from "../models";
import { tryValidateOrDefault } from "@/utils/helpers";

export const createPost = Joi.object({
    title: Joi.string().trim().required().label("Tên bài viết"),
    content: Joi.string().trim().required().label("Nội dung bài viết"),
    author_id: Joi.string().trim().required().label("ID tác giả"),
    categories: Joi.array().items(Joi.string().length(24).trim().required()).label("Danh mục"),
});

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), ""),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(Joi.valid("created_at", "title"), "created_at"),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
}).unknown(true);

export const updatePost = Joi.object({
    title: Joi.string().trim().label("Tên bài viết"),
    content: Joi.string().trim().label("Nội dung bài viết"),
    author_id: Joi.string().trim().label("ID tác giả"),
    categories: Joi.array().items(Joi.string().length(24).trim()).label("Danh mục"),
});

