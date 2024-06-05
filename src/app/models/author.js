
import { createModel } from "./base";

export const Author = createModel("Author", "authors", {
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
    phone: {
        type: String,
        default: "",
    },
    avatar: {
        type: String
    },
    bio: {
        type: String,
        required: true,
    }
});