import { isValidObjectId } from "mongoose";
import { responseError } from "@/utils/helpers";
import { User } from "@/app/models";

export const checkUserId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const user = await User.findOne({ _id });
        if (user) {
            if (user.status === "inactive") {
                return responseError(res, 404, "Tài khoản của bạn đã bị khóa!");
            }
            req.user = user;
            return next();
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};

export const checkUserLogin = async function (req, res, next) {
    const email = req.body.email;
    if (email) {
        const user = await User.findOne({ email: email });
        if (user) {
            if (user.status === "inactive") {
                return responseError(res, 404, "Tài khoản của bạn đã bị khóa!");
            }
            req.user = user;
            return next();
        }
    }
    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};

export const checkUserToken = async function (req, res, next) {
    const token = req.query.token;
    console.log(token);
    if (token) {
        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() },
        });
        if (user) {
            if (user.status === "inactive") {
                return responseError(res, 404, "Tài khoản của bạn đã bị khóa!");
            }
            if (token === user.resetPasswordToken) {
                if (user.resetPasswordExpires > Date.now()) {
                    req.user = user;
                    return next();
                }
            } else {
                return responseError(res, 404, "Token đã hết hạn!");
            }
        }
        return responseError(res, 404, "Token không tồn tại!");
    }
    return responseError(res, 404, "Token không tồn tại!");
};
