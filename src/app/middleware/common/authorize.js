const { responseError } = require("@/utils/helpers");

export const authorize = (role) => {
    return (req, res, next) => {
        if (role !== req.currentUser.role) {
            return responseError(res, 403, "Từ chối truy cập");
        }
        next();
    };
};