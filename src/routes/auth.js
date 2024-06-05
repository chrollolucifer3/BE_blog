import { Router } from "express";
import { asyncHandler } from "@/utils/handlers";
import { verifyToken, validate, upload } from "../app/middleware/common";

import * as authRequest from "../app/requests/auth.request";
import * as authController from "../app/controllers/auth.controller";
// import * as userMiddleware from "../app/middleware/user.middleware";

const router = Router();

router.post(
    "/login",
    // asyncHandler(userMiddleware.checkUserLogin),
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authController.login)
);

router.post(
    "/register",
    // asyncHandler(upload),
    asyncHandler(validate(authRequest.register)),
    asyncHandler(authController.register),
);

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(authController.logout)
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(authController.me)
);

router.put(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(upload),
    asyncHandler(validate(authRequest.updateProfile)),
    asyncHandler(authController.updateProfile),
);

router.put(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(validate(authRequest.changePassword)),
    asyncHandler(authController.changePassword),
);

export default router;
