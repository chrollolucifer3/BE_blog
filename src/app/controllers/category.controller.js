import * as categoryService from "../services/category.service";
import { responseSuccess } from "@/utils/helpers";

export async function createCategory(req, res) {
    await categoryService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function detailCategory(req, res) {
    return responseSuccess(res, await categoryService.details(req.params.id));
}

export const readCategory = async (req, res) => {
    return responseSuccess(res, await categoryService.filter(req.query));
};

export const updateCategory = async (req, res) => {
    await categoryService.updateCategory(req.category, req.body);
    return responseSuccess(res, null, 201);
};

export const deleteCategory = async (req, res) => {
    await categoryService.deleteCategory(req.params.id);
    return responseSuccess(res, null, 201);
};

export const deleteManyCategory = async (req, res) => {
    await categoryService.deleteManyCategory(req.body.categories);
    return responseSuccess(res, null, 201);
};