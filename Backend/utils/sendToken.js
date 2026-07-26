const jwt = require("jsonwebtoken");

const sendToken = (user, statusCode, res) => {

    const token = user.getJWTToken();

    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "PRODUCTION" ? "none" : "lax",
        secure: process.env.NODE_ENV === "PRODUCTION",
    };

    res.cookie("jwt", token, cookieOptions);

    user.password = undefined;

    res.status(statusCode).json({
        success: true,
        token,
        data: { user },
    });
};

module.exports = sendToken;