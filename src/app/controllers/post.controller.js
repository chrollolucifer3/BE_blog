import { responseSuccess } from "@/utils/helpers";
import * as postService from "../services/post.service";

export async function createPost(req, res) {
    await postService.createPost(req.body);
    return responseSuccess(res, null, 201);
}

export async function readRoot(req, res) {
    return responseSuccess(res, await postService.filter(req.query));
}

export async function detailPost(req, res) {
    return responseSuccess(res, await postService.getDetail(req.params.id));
}

export async function deletePost(req, res) {
    await postService.deletePost(req.params.id);
    responseSuccess(res, null, 201);
}

export async function updatePost(req, res) {
    await postService.updatePost(req.post, req.body);
    responseSuccess(res, null, 201);
}

export async function deleteCategoryId(req, res) {
    await postService.removeCategoryIdFromPost(req.post, req.body.categories);
    responseSuccess(res, null, 201);
}

export async function deleteManyPost(req, res) {
    await postService.deleteManyPost(req.body.post_id);
    responseSuccess(res, null, 201);
}

