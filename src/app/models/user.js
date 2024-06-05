import { createModel } from "./base";

export const User = createModel("User", "users", {
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        default: "",
    },
    avatar: String,
    role: {
        type: String,
        default: "admin",
    },
    status: {
        type: String,
        default: "active",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});
