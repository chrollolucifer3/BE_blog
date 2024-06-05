import { responseError, responseSuccess, getToken } from "@/utils/helpers";
import * as authService from "../services/auth.service";
import { resetPassword } from "../services/user.service";


export async function login(req, res) {
    const validLogin = await authService.checkValidLogin(req.body);

    if (validLogin) {
        return responseSuccess(res, authService.authToken(validLogin._id));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không đúng");
    }
}

export async function register(req, res) {
    const newUser = await authService.register(req.body);
    const result = authService.authToken(newUser._id);
    return responseSuccess(res, result, 201, "Đăng ký thành công");
}

export async function logout(req, res) {
    const token = getToken(req.headers);
    await authService.blockToken(token);
    return responseSuccess(res);
}

export async function me(req, res) {
    return responseSuccess(res, await authService.profile(req.currentUser._id));
}

export async function updateProfile(req, res) {
    await authService.updateProfile(req.currentUser, req.body);
    return responseSuccess(res, null, 201);
}

export async function changePassword(req, res) {
    console.log(req.body);
    await resetPassword(req.currentUser, req.body.password);
    return responseSuccess(res, null, 201);
}
