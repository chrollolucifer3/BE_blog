import { Post } from "../models";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import { addPostToCategory, deletePostIdFromCategory } from "./category.service";


export async function createPost({ title, content, author_id, categories }) {

    const post = new Post({
        title: capitalizeFirstLetter(title),
        content,
        author_id,
        categories
    });
    
    await post.save();
    await addPostToCategory(categories, post._id);
}

export const deleteCategoryId = async (postIds, category_id) => {
    await Post.updateMany({ _id: { $in: postIds } }, { $pull: { categories: category_id } });
};

export const filter = async ({ q, page, per_page, field, sort_order }) => {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ title: q }] }),
    };

    const posts = (
        await Post.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
    ).map((post) => {
        return post;
    });

    const total = await Post.countDocuments(filter);
    return { total, page, per_page, posts };
};

export const getDetail = async (post_id) => {
    const post = await Post.findById(post_id);
    return post;
};

export const deletePost = async (post_id) => {
    const category_id = (await Post.findById(post_id)).categories.map(categories => categories._id);
    await deletePostIdFromCategory(category_id, post_id);
    await Post.deleteOne({ _id: post_id });
};

export const deletePostOfAuthor = async (authorId) => {
    const posts = await Post.find({ author_id: authorId });
    posts.forEach(async (post) => {
        const category_id = post.categories.map(categories => categories._id);
        await deletePostIdFromCategory(category_id, post._id);
    });
    await Post.deleteMany({ author_id: authorId });
};

export const deletePostOfManyAuthor = async (author_ids) => {
    for (const authorId of author_ids) {
        const posts = await Post.find({ author_id: authorId });
        posts.forEach(async (post) => {
            const category_id = post.categories.map(categories => categories._id);
            await deletePostIdFromCategory(category_id, post._id);
        });
    }
    await Post.deleteMany({ author_id: { $in: author_ids } });
};

export const updatePost = async (post, { title, content, author_id, categories }) => {
    post.title = title ? capitalizeFirstLetter(title) : post.title;
    post.content = content ? content : post.content;
    post.author_id = author_id ? author_id : post.author_id;
    if (categories) {
        // Dùng concat để nối hai mảng thành 1 mảng duy nhất
        const combinedCategories = post.categories.map(id => id.toString()).concat(categories);
        post.categories = [...new Set(combinedCategories)];
    }
    await post.save();
};

export const removeCategoryIdFromPost = async (post, category_id) => {
    post.categories = post.categories.filter((id) => id !== category_id);
    await deletePostIdFromCategory(category_id, post._id);
    await post.save();
};

export const deleteManyPost = async (post_ids) => {
    for (const post_id of post_ids) {
        const post = await Post.findById(post_id);
        await deletePostIdFromCategory(post.categories, post._id);
    }
    await Post.deleteMany({ _id: { $in: post_ids } });
};







