import authRouter from "./auth";
import userRouter from "./user";
import authorRouter from "./author";
import categoryRouter from "./category";
import postRouter from "./post";

export default function route(app) {
    app.use("/auth", authRouter);
    app.use("/users", userRouter);
    app.use("/authors", authorRouter);
    app.use("/categories", categoryRouter);
    app.use("/posts", postRouter);
}
