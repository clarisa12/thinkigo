function isEmpty(r) {
    return Object.keys(r).length === 0 ? true : false;
}

export const hasBody = (req, res, next) => {
    if (isEmpty(req.body)) {
        return res.status(400).json({
            success: false,
            error: "No POST data provided",
        });
    }

    next();
};
