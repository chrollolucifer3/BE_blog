import { User } from "../models";
import { LINK_STATIC_URL, APP_URL_CLIENT } from "@/configs";
import { generatePassword, generateURL, sendMail } from "@/utils/helpers";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import crypto from "crypto";

export async function create({ name, email, phone, password }) {
    const user = new User({
        name: capitalizeFirstLetter(name),
        email,
        phone,
        password: generatePassword(password),
    });
    await user.save();
    return user;
}

export async function filter({ q, page, per_page, column, order, status }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ name: q }, { email: q }, { phone: q }] }),
        ...(status && { status: status }),
    };

    const users = (
        await User.find(filter, { password: 0 })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [column]: order })
    ).map((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
        return user;
    });

    const total = await User.countDocuments(filter);
    return { total, page, per_page, status, users };
}

export async function details(userId) {
    const user = await User.findById(userId, { password: 0 });
    user.avatar = LINK_STATIC_URL + user.avatar;
    return user;
}

export async function update(user, { name, email, phone }) {
    user.name = name ? capitalizeFirstLetter(name) : user.name;
    user.email = email ? email : user.email;
    user.phone = phone ? phone : user.phone;
    await user.save();
    return user;
}

export async function resetPassword(user, password) {
    user.password = generatePassword(password);
    await user.save();
    return user;
}

export async function remove(id) {
    await User.deleteOne({ _id: id });
}

export async function softDeleteUser(id) {
    await User.updateOne({ _id: id }, { status: "inactive", deleted_at: new Date() });
}

export async function restoreUser(id) {
    await User.updateOne({ _id: id }, { status: "active", deleted_at: "" });
}

export async function forgotPassword(user) {
    const token = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = token;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 tiếng
    await user.save();

    const resetUrl = APP_URL_CLIENT + generateURL("/users/update-password", { token: token });
    const data = {
        resetUrl: resetUrl,
        name: user.name,
    };

    try {
        await sendMail(
            user.email,
            "Reset Password",
            "sendMail",
            data
        );
    } catch (error) {
        delete user.passwordResetToken;
        delete user.passwordResetExpires;
        await user.save();
    }
}

export async function updateNewPassword(user, password) {
    user.password = generatePassword(password);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();
    return user;
}