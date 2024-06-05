import * as authorService from "../services/author.service";
import { responseSuccess } from "@/utils/helpers";

export async function createAuthor(req, res) {
    await authorService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function readAuthors(req, res) {
    return responseSuccess(res, await authorService.filter(req.query));
}

export async function detailsAuthors(req, res) {
    return responseSuccess(res, await authorService.details(req.params.id));
}

export async function updateAuthor(req, res) {
    await authorService.update(req.author, req.body);
    return responseSuccess(res, null, 201);
}

export async function deleteAuthor(req, res) {
    await authorService.remove(req.params.id);
    return responseSuccess(res, null, 201);
}

export async function deleteManyAuthor(req, res) {
    await authorService.removeManyAuthor(req.body.author_id);
    return responseSuccess(res, null, 201);
}

