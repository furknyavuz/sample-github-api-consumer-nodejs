const RepositoryModel = require('../model/repository.model');
const Axios = require('axios');
const Config = require('../config/env.config');

const GITHUB_API_URL = Config.githubEndpoint;
const GITHUB_ACCESS_TOKEN = Config.githubAccessToken;

exports.insert = (req, res) => {
    RepositoryModel.create(req.body)
        .then((result) => {
            res.status(201).send({id: result._id});
        });
};

exports.findById = (req, res) => {
    RepositoryModel.findById(req.params.id)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.list = (req, res) => {

    RepositoryModel.list()
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.patchById = (req, res) => {

    RepositoryModel.patchById(req.params.id, req.body)
        .then(() => {
            res.status(204).send({});
        });
};

exports.deleteById = (req, res) => {

    RepositoryModel.deleteById(req.params.id, req.body)
        .then(() => {
            res.status(204).send({});
        });
};

// Cron job Update methods

async function updateDatabase(responseData, owner, name) {

    let createdAt = '';
    let resourcePath = '';
    let tagName = '';
    let releaseDescription = '';
    let homepageUrl = '';
    let repositoryDescription = '';
    let avatarUrl = '';

    if (responseData.repository.releases) {

        createdAt = responseData.repository.releases.nodes[0].createdAt;
        resourcePath = responseData.repository.releases.nodes[0].resourcePath;
        tagName = responseData.repository.releases.nodes[0].tagName;
        releaseDescription = responseData.repository.releases.nodes[0].description;
        homepageUrl = responseData.repository.homepageUrl;
        repositoryDescription = responseData.repository.description;

        if (responseData.organization && responseData.organization.avatarUrl) {
            avatarUrl = responseData.organization.avatarUrl;
        } else if (responseData.user && responseData.user.avatarUrl) {
            avatarUrl = responseData.user.avatarUrl;
        }

        const repositoryData = {
            owner: owner,
            name: name,
            createdAt: createdAt,
            resourcePath: resourcePath,
            tagName: tagName,
            releaseDescription: releaseDescription,
            homepageUrl: homepageUrl,
            repositoryDescription: repositoryDescription,
            avatarUrl: avatarUrl
        };

        await RepositoryModel.findByOwnerAndName(owner, name)
            .then((oldGitHubRelease) => {
                if (!oldGitHubRelease[0]) {
                    RepositoryModel.create(repositoryData);
                } else {
                    RepositoryModel.patchById(oldGitHubRelease[0].id, repositoryData);
                }
                console.log(`Updated latest release: http://github.com${repositoryData.resourcePath}`);
            });
    }
}

async function getLatestRelease(repository) {

    const owner = repository.owner;
    const name = repository.name;

    console.log(`Getting latest release for: http://github.com/${owner}/${name}`);

    const query = `
          query {
            organization(login: "${owner}") {
                avatarUrl
            }
            user(login: "${owner}") {
                avatarUrl
            }
            repository(owner: "${owner}", name: "${name}") {
                homepageUrl
                description 
                releases(first: 1, orderBy: {field: CREATED_AT, direction: DESC}) {
                    nodes {
                        createdAt
                        resourcePath
                        tagName
                        description
                    }
                }
            }
          }`;

    const jsonQuery = JSON.stringify({query});

    const headers = {
        'User-Agent': 'Release Tracker',
        'Authorization': `Bearer ${GITHUB_ACCESS_TOKEN}`
    };

    await Axios.post(GITHUB_API_URL, jsonQuery, {headers: headers}
    ).then((response) => {
        return updateDatabase(response.data.data, owner, name);
    });
}

async function asyncUpdate() {

    await RepositoryModel.list().then((array) => {
        const promises = array.map(getLatestRelease);

        return Promise.all(promises);
    });
}

exports.updateRepositories = async function update() {
    console.log('GitHub Repositories Update Started');

    await asyncUpdate().then(() => {
        console.log('GitHub Repositories Update Finished');
    });
};
