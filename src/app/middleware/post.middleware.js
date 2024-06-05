import { Post } from "../models";
import { responseError } from "@/utils/helpers";
import { isValidObjectId } from "mongoose";

export const checkPostId = async function (req, res, next) {
    const _id = req.params.id;
    if (isValidObjectId(_id)) {
        const post = await Post.findOne({ _id });
        if (post) {
            req.post = post;
            return next();
        }
    }
    return responseError(res, 404, "Bài viết đã bị xóa hoặc không tồn tại hoặc đã bị xóa");
};

export const checkManyPostId = async function (req, res, next) {
    const post_ids = req.body.post_id;
    if (post_ids) {
        if (!Array.isArray(post_ids)) {
            return responseError(res, 400, "Bài viết truyền vào phải là một mảng");
        }
        for (const post_id of post_ids) {
            if (!isValidObjectId(post_id)) {
                return responseError(res, 400, "ID bài viết không hợp lệ");
            }
            const post = await Post.findById(post_id);
            if (!post) {
                return responseError(res, 400, `Bài viết với ID ${post_id} không tồn tại hoặc đã bị xóa`);
            }
        }
    }
    return next();
};