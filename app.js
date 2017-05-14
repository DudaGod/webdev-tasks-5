'use strict';

const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');
// const config = require('config');
const bodyParser = require('body-parser');
const morgan = require('morgan');
// const errorHandler = require('error-handler');

const viewsDir = path.join(__dirname, 'server/bundles');
const publicDir = path.join(__dirname, 'static');



app
    .set('port', process.env.PORT || 3000)
    .set('views', viewsDir)
    .set('view engine', 'hbs')
    .use(morgan('dev'))
    .use(express.static(publicDir))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    /* eslint max-params: [2, 4] */
    .use((err, req, res, next) => {
        console.log(err);
        next();
    })
    .use((req, res, next) => {
        req.commonData = {
            meta: {
                charset: 'utf-8',
                description: 'ToDo service for all of your tasks'
            },
            page: {
                title: 'TODO-хи'
            },
            isProd: process.env.NODE_ENV === 'production'
        };
        next();
    });

require('./server/routes')(app);

hbs.registerPartials(path.join(__dirname, 'server/blocks'));

/*app
    .get('/', (req, res) => {
        res.send('Hello');
    });
app.get('*', res => res.sendStatus(404));*/

app.listen(app.get('port'),
    () => console.log(`Listening on port ${app.get('port')}`));


var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    historyApiFallback: true,
    proxy: {
        '*': 'http://localhost:3000'
    },
    stats: {
        colors: true
    }
}).listen(3001, 'localhost', function (err) {
    if (err) {
        console.log(err);
    }
    console.log('Listening at localhost:3001');
});
