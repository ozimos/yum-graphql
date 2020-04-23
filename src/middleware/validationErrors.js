const validationErrors = (err, req, res, next) => {
    if (err.error && err.error.isJoi) {
        const message = {};
        err.error.details.forEach((elem) => {
            const key = elem.path[0] || 'error';
            message[key] = elem.message;
        });
        return res.status(400).json({
            message,
        });
    }
    return res.status(400).json({ message: err.message });
};

export default validationErrors;
