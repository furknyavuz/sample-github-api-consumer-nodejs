module.exports = {
    "port": process.env.PORT || 3000,
    "environment": "dev",
    "mongoDbUri": process.env.MONGODB_URI || "mongodb://localhost/github-consumer"
};
