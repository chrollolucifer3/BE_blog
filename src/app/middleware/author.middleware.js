import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";
import { Author } from "@/app/models";

export const checkAuthorId = async function (req, res, next) {
    const _id = req.body.author_id || req.params.id;
    if (isValidObjectId(_id)) {
        const author = await Author.findOne({ _id });
        if (author) {
            req.author = author;
            return next();
        }
    }

    return responseError(res, 404, "Tác giả không tồn tại hoặc đã bị xóa");
};

export const checkManyAuthorId = async function (req, res, next) {
    const authorIds = req.body.author_id;
    if (authorIds) {
        if (!Array.isArray(authorIds)) {
            return responseError(res, 400, "Tác giả truyền vào phải là một mảng");
        }
        for (const author_id of authorIds) {
            if (!isValidObjectId(author_id)) {
                return responseError(res, 400, "ID tác giả không hợp lệ");
            }
            const author = await Author.findById(author_id);
            if (!author) {
                return responseError(res, 400, `Tác giả với ID ${author_id} không tồn tại hoặc đã bị xóa`);
            }
        }
    }
    return next();
};
