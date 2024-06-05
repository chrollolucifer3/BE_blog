import { Router } from "express";
import { validate, verifyToken } from "../app/middleware/common";
import { asyncHandler } from "@/utils/handlers";

import * as postController from "../app/controllers/post.controller";
import * as postRequest from "../app/requests/post.request";
import * as postMiddleware from "../app/middleware/post.middleware";
import * as categoryMiddleware from "../app/middleware/category.middleware";
import { checkAuthorId } from "@/app/middleware/author.middleware";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(validate(postRequest.readRoot)),
    asyncHandler(postController.readRoot)
);

router.post(
    "/",
    asyncHandler(checkAuthorId),
    asyncHandler(categoryMiddleware.checkCategoryParentId),
    asyncHandler(validate(postRequest.createPost)),
    asyncHandler(postController.createPost)
);

router.get(
    "/:id",
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(postController.detailPost)
);

router.put(
    "/update/:id",
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(checkAuthorId),
    asyncHandler(categoryMiddleware.checkCategoryParentId),
    asyncHandler(validate(postRequest.updatePost)),
    asyncHandler(postController.updatePost)
);

router.post(
    "/delete-category/:id",
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(categoryMiddleware.checkCategoryParentId),
    asyncHandler(postController.deleteCategoryId)
);

router.delete(
    "/delete-many-post",
    asyncHandler(postMiddleware.checkManyPostId),
    asyncHandler(postController.deleteManyPost)
);

router.delete(
    "/:id",
    asyncHandler(postMiddleware.checkPostId),
    asyncHandler(postController.deletePost)
);

export default router;