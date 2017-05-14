'use strict';

exports.index = (req, res) => {
    res.render('index/index', req.commonData);
};

exports.error404 = (req, res) => res.sendStatus(404);
