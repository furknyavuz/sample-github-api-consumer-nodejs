const RepositoryModel = require('../model/repository.model');

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
