import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { validate, verifyToken } from "../app/middleware/common";

import * as categoryController from "../app/controllers/category.controller";
import * as categoryRequest from "../app/requests/category.request";
import * as categoryMiddleware from "../app/middleware/category.middleware";


const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/",
    asyncHandler(validate(categoryRequest.createCategory)),
    asyncHandler(categoryController.createCategory)
);

router.get(
    "/:id",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.detailCategory)
);

router.get(
    "/",
    asyncHandler(validate(categoryRequest.readRoot)),
    asyncHandler(categoryController.readCategory)
);

router.put(
    "/update/:id",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(validate(categoryRequest.updateCategory)),
    asyncHandler(categoryController.updateCategory)
);

router.delete(
    "/delete-many",
    asyncHandler(categoryMiddleware.checkCategoryParentId),
    asyncHandler(categoryController.deleteManyCategory),
);

router.delete(
    "/:id",
    asyncHandler(categoryMiddleware.checkCategoryId),
    asyncHandler(categoryController.deleteCategory)
);

export default router;