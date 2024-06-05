import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate, upload } from "@/app/middleware/common";

import * as authorMiddleware from "../app/middleware/author.middleware";
import * as authorController from "../app/controllers/author.controller";
import * as authorRequest from "../app/requests/author.request";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(authorRequest.readRoot)),
    asyncHandler(authorController.readAuthors)
);

router.post(
    "/",
    asyncHandler(validate(authorRequest.createAuthor)),
    asyncHandler(authorController.createAuthor)
);

router.get(
    "/:id",
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(authorController.detailsAuthors)
);

router.put (
    "/update/:id",
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(upload),
    asyncHandler(validate(authorRequest.updateAuthor)),
    asyncHandler(authorController.updateAuthor)
);

router.delete(
    "/delete-many",
    asyncHandler(authorMiddleware.checkManyAuthorId),
    asyncHandler(authorController.deleteManyAuthor)
);

router.delete(
    "/:id",
    asyncHandler(authorMiddleware.checkAuthorId),
    asyncHandler(authorController.deleteAuthor)
);

export default router;