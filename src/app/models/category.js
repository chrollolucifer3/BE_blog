import mongoose from "mongoose";
import { createModel } from "./base";

export const Category = createModel("Category", "categories", {
    name: {
        type: String,
    },
    description: {
        type: String,
    },
    posts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    }],
});