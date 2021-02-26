/* eslint-disable prettier/prettier */
const AppError = require('./app-error');

const HandleDbCastError = err => {
    const message = `invalid ${err.path}: ${err.value}!`;
    return new AppError(message, 400);
};

const handleDbDuplicateFields = err => {
    const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message = `duplicate field value ${value}, please use another value!`;
    return new AppError(message, 400);
};

const handleDbValidationError = err => {
    const errors = Object.values(err.errors).map(value => value.message);

    const message = `invalid input data, ${errors.join(". ")}!`;
    return new AppError(message, 400);
};

const handleJWTError = err => {
    return new AppError("Invalid token!", 4041);
};

const handleJWTExpiredError = err => {
    return new AppError("Expired token!", 401);
};

const sendErrorDev = (err, req, res) => {
    // for API
    if (req.originalUrl.startsWith("/api")) {
        res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack
        });
    } else {
        // for RENDERED WEBSITE 

        // eslint-disable-next-line no-console
        console.error("ERROR!", err);

        res.status(err.statusCode).render("error", {
            title: "Something went wrong!",
            msg: err.message
        });
    }
};

const sendErrorProd = (err, req, res) => {
    // A) for API
    if (req.originalUrl.startsWith("/api")) {
        // Operational error
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message
            });
        }
        else {
            // Programming, Unknown error

            // eslint-disable-next-line no-console
            console.error("ERROR!", err);

            return res.status(500).json({
                status: "error",
                message: "Something went wrong!",
                msg: err.message,
                stack: err.stack
            });
        }
    } 
    else {
        // B) for RENDERED WEBSITE 

        // Operational error
        if (err.isOperational) {
            return res.status(err.statusCode).render("error", {
                title: "Something went wrong!",
                msg: err.message
            });
        }
        else {
            // Programming, Unknown error

            // eslint-disable-next-line no-console
            console.error("ERROR!", err);

            return res.status(err.statusCode).render("error", {
                title: "Something went wrong!",
                msg: "please try again later!"
            });
        }
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        // console.error(err);
        sendErrorDev(err, req, res);
    }
    else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;

        if (error.name === "CastError") error = HandleDbCastError(error);
        if (error.statusCode === 11000) error = handleDbDuplicateFields(error);
        if (error.name === "ValidationError") error = handleDbValidationError(error);
        if (error.name === "JsonWebTokenError") error = handleJWTError(error);
        if (error.name === "TokenExpiredError") error = handleJWTExpiredError(error);

        sendErrorProd(error, req, res);
    }
};