// import { responseError } from "@/utils/helpers";
import { Category } from "../models";
import { deleteCategoryId } from "./post.service";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";

export async function create({ name, description }) {
    const category = new Category({
        name: capitalizeFirstLetter(name),
        description
    });
    await category.save();
    return category;
}

export const details = async (category_id) => {
    const category = await Category.findById(category_id);
    return category;
};

export const filter = async ({ q, page, per_page, field, sort_order }) => {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ name: q }] }),
    };

    const categories = (
        await Category.find(filter)
            .populate({
                path: "posts",
                select: "title author -_id",
                populate: {
                    path: "author_id",
                    select: "name -_id"
                }
            })
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [field]: sort_order })
    ).map((category) => {
        return category;
    });

    const total = await Category.countDocuments(filter);
    return { total, page, per_page, categories };
};

export const updateCategory = async (category, { name, description }) => {
    category.name = name ? capitalizeFirstLetter(name) : category.name;
    category.description = description ? description : category.description;

    await category.save();
    return category;
};

export const deleteCategory = async (category_id) => {
    const postIds = (await Category.findById(category_id)).posts.map(post => post._id);
    await deleteCategoryId(postIds, category_id);
    await Category.deleteOne({ _id: category_id });
};

export async function addPostToCategory(categoryId, postId) {
    for (const category_id of categoryId) {
        const category = await Category.findById(category_id);
        category.posts.push(postId);
        await category.save();
    }
}

export async function deletePostIdFromCategory(category_id, post_id) {
    await Category.updateMany({ _id: { $in: category_id } }, { $pull: { posts: post_id } });
}

export async function deleteManyCategory(category_id) {
    for (const id of category_id) {
        const category = await Category.findById(id);
        await deleteCategoryId(category.posts, id);
    }
    await Category.deleteMany({ _id: { $in: category_id } });
}
