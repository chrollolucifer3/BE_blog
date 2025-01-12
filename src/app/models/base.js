import { Schema, Types, model } from "mongoose";

export function createModel(name, collection, definition, options) {
    const schema = new Schema({ ...definition, deleted_at: { type: Date, default: "" } }, {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
        ...(options ? options : {}),
    });

    return model(name, schema, collection);
}

export const { ObjectId } = Types;
