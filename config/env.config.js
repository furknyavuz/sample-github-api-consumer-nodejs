module.exports = {
    "port": process.env.PORT || 3000,
    "environment": "dev",
    "mongoDbUri": process.env.MONGODB_URI || "mongodb://localhost/github-consumer",
    "githubEndpoint": "https://api.github.com/graphql",
    "githubAccessToken": process.env.GITHUB_ACCESS_TOKEN
};
