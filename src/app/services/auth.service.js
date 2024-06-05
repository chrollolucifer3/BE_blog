import moment from "moment";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { cache, JWT_EXPIRES_IN, LINK_STATIC_URL, TOKEN_TYPE } from "@/configs";
import { FileUpload } from "@/utils/types";
import { comparePassword, generatePassword, generateToken } from "@/utils/helpers";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";

export const tokenBlocklist = cache.create("token-block-list");

export async function checkValidLogin({ email, password }) {
    const user = await User.findOne({
        email: email,
        deleted_at: null,
    });

    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            return user;
        }
    }

    return false;
}

export function authToken(user_id) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, { user_id }, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    // console.log(access_token, expire_in);
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function register({ name, email, password, phone }) {
    const user = new User({
        name: capitalizeFirstLetter(name),
        email,
        phone,
        password: generatePassword(password),
    });

    return await user.save();
}

export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}

export async function profile(user_id) {
    const user = await User.findOne({ _id: user_id }, { password: 0 });
    if (user.avatar) {
        user.avatar = LINK_STATIC_URL + user.avatar;
    }

    return user;
}

export async function updateProfile(currentUser, { name, email, phone, avatar }) {
    currentUser.name = name ? capitalizeFirstLetter(name) : currentUser.name;
    currentUser.email = email ? email : currentUser.email;
    currentUser.phone = phone ? phone : currentUser.phone;
    if (avatar) {
        if (currentUser.avatar) {
            FileUpload.remove(currentUser.avatar);
        }
        avatar = avatar.save("images");
        currentUser.avatar = avatar;
    }

    return await currentUser.save();
}


