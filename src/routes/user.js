import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate, authorize } from "../app/middleware/common";

import * as userRequest from "../app/requests/user.request";
import * as userMiddleware from "../app/middleware/user.middleware";
import * as userController from "../app/controllers/user.controller";

const router = Router();

router.put(
    "/update-password",
    asyncHandler(userMiddleware.checkUserToken),
    asyncHandler(validate(userRequest.resetPassword)),
    asyncHandler(userController.updateNewPassword),
);

router.post(
    "/forgot-password",
    asyncHandler(userMiddleware.checkUserLogin),
    asyncHandler(userController.forgotPassword),
);

router.get(
    "/",
    asyncHandler(verifyToken),
    asyncHandler(validate(userRequest.readRoot)),
    asyncHandler(userController.readRoot)
);

router.get(
    "/:id",
    asyncHandler(verifyToken),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.readItem)
);

router.post(
    "/",
    asyncHandler(verifyToken),
    asyncHandler(authorize("super-admin")),
    asyncHandler(validate(userRequest.createItem)),
    asyncHandler(userController.createItem)
);

router.put(
    "/:id",
    asyncHandler(verifyToken),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.updateItem)),
    asyncHandler(userController.updateItem),
);

router.delete(
    "/:id",
    asyncHandler(verifyToken),
    asyncHandler(authorize("super-admin")),
    // asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.removeItem)
);

router.patch(
    "/:id/reset-password",
    asyncHandler(verifyToken),
    asyncHandler(authorize("super-admin")),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.resetPassword)),
    asyncHandler(userController.resetPassword),
);

router.post(
    "/:id/soft-delete",
    asyncHandler(verifyToken),
    asyncHandler(authorize("super-admin")),
    asyncHandler(userController.softDeleteUser),
);

router.post(
    "/:id/restore",
    asyncHandler(verifyToken),
    asyncHandler(authorize("super-admin")),
    asyncHandler(userController.restoreUser),
);

export default router;
