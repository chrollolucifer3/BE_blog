
import { LINK_STATIC_URL } from "@/configs";
import { Author } from "../models";
import { FileUpload } from "@/utils/types";
import { capitalizeFirstLetter } from "@/utils/handlers/capitalize.handler";
import {deletePostOfAuthor, deletePostOfManyAuthor } from "../services/post.service";


export async function create({ name, email, phone, bio }) {
    const author = new Author({
        name: capitalizeFirstLetter(name),
        email,
        phone,
        bio
    });

    await author.save();
    return author;
}

export async function filter({ q, page, per_page, column, order }) {
    q = q ? { $regex: q, $options: "i" } : null;

    const filter = {
        ...(q && { $or: [{ name: q }, { email: q }, { phone: q }] }),
    };

    const authors = (
        await Author.find(filter)
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({ [column]: order })
    ).map((author) => {
        if(author.avatar) author.avatar = LINK_STATIC_URL + author.avatar;
        return author;
    });

    const total = await Author.countDocuments(filter);
    return { total, page, per_page, authors };
}

export async function details(author_id) {
    const author = await Author.findById(author_id);
    author.avatar = LINK_STATIC_URL + author.avatar;

    return author;
}

export async function update(author, { name, email, phone, bio, avatar }) {
    author.name = name ? capitalizeFirstLetter(name) : author.name;
    author.email = email ? email : author.email;
    author.phone = phone ? phone : author.phone;
    author.bio = bio ? bio : author.bio;

    if (avatar) {
        if (author.avatar) {
            FileUpload.remove(author.avatar);
        }
        avatar = avatar.save("images");
        author.avatar = avatar;
    }

    await author.save();
    return author;
}

export async function remove(author_id) {
    await deletePostOfAuthor(author_id);
    await Author.deleteOne({ _id: author_id });
}

export async function removeManyAuthor(author_ids) {
    await deletePostOfManyAuthor(author_ids);
    await Author.deleteMany({_id : {$in: author_ids}});
}

