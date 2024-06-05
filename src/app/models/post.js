import mongoose from "mongoose";
import { createModel } from "./base";

export const Post = createModel("Post", "posts", {
    title: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    author_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Author",
        // required: true
    },
    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
    }],
});