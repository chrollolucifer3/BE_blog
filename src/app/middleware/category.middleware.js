import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";
import { Category } from "@/app/models";

export const checkCategoryId = async function (req, res, next) {
    const _id = req.params.id;
    if (isValidObjectId(_id)) {
        const category = await Category.findOne({ _id });
        if (category) {
            req.category = category;
            return next();
        }
    }
    return responseError(res, 404, "Danh mục không tồn tại hoặc đã bị xóa");
};

export const checkCategoryParentId = async function (req, res, next) {
    const categories = req.body.categories;
    if (categories) {
        if (!Array.isArray(categories)) {
            return responseError(res, 400, "Danh mục truyền vào phải là một mảng");
        }
        for (const category_id of categories) {
            if (!isValidObjectId(category_id)) {
                return responseError(res, 400, "ID danh mục không hợp lệ");
            }
            const category = await Category.findById(category_id);
            if (!category) {
                return responseError(res, 400, `Danh mục với ID ${category_id} không tồn tại hoặc đã bị xóa`);
            }
        }
    }
    return next();
};

