const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) {
        return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (apiKey !== process.env.API_KEY) {
        return res.status(403).json({
            success: false,
            message: "Invalid API Key",
        });
    }

    next();
}
module.exports = apiKeyMiddleware