/*
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 *
 *  lastModified: 2012-07-28 11:00:34.918699
 * -->
 */

/*global require, __dirname*/
(function() {
    'use strict';

    var express = require('express');
    var fs      = require('fs');
    var jade    = require('jade');

    var app = express.createServer();

    var kOneYear = 31536000000;

    /*
     *
     */
    var config = {
        farFutureExpiration : {maxAge : kOneYear},

        api_v_0_1 : {
            VERSION_TIMESTAMP : '20120720135547909116'
        }
    };

    /*
     *
     */
    var route = {
        api_v_0_1 : {
            LOGIN     : '/api/v.0.1/login',
            UPDATE    : '/api/v.0.1/update',
            BEACON    : '/api/v.0.1/beacon',
            PARAMS    : '/api/v.0.1/params'
        }
    };

    /*
     *
     */
    var url = {
        api_v_0_1 : {
            BOOTSTRAP    : 'http://api.widget.www/api.v.0.1.js',
            UPDATE_IFRAME: 'http://api.widget.www/api/v.0.1/update'
        }
    };

    /*
     *
     */
    var template = {
        UPDATE       : 'update.jade',
        UPDATE_SCRIPT: 'js/update.jade',
        LOGIN_FORM   : 'login_form.jade'
    };

    /*
     *
     */
    var path = {
        STATIC_FILE : __dirname + '/static',
        VIEWS       : __dirname + '/views'
    };

    /*
     *
     */
    var parameter = {
        VERSION      : 'v',
        CALLBACK     : 'callback',
        PUBLISHER_ID : 'pubId',
        GUID         : 'guid'
    };

    /*
     *
     */
    var statusCode = {
        NO_DATA : 204
    };

    /*
     *
     */
    var encoding = {
        DEFAULT : 'utf8'
    };

    /*
     * A compiled Jade template function for the login form.
     */
    var createLoginForm = jade.compile(
        fs.readFileSync(
            path.VIEWS + '/' + template.LOGIN_FORM, encoding.DEFAULT
        )
    );

    /*
     * Make sure that the static assets have a far future expiration date.
     */
    app.use(
        express['static'](
            path.STATIC_FILE,
            config.farFutureExpiration
        )
    );

    /*
     *
     */
    var kNoData = statusCode.NO_DATA;

    /*
     * Set path to the views (template) directory
     */
    app.set('views', path.VIEWS);

    /**
     *
     */
    function setImmediateExpiresHeader(res) {
        res.header('Cache-Control', 'public, max-age=0, must-revalidate');
        res.header('Expires', new Date(Date.now()).toUTCString());
    }

    /**
     *
     */
    function setShortExpiresHeader(res) {
        var kOneMinute = 60;

        res.header('Cache-Control', 'public, max-age=' + kOneMinute);
        res.header('Expires',
            new Date(Date.now() + kOneMinute * 1000).toUTCString()
        );
    }

    /* #region API v.0.1 */

        /**
         *
         */
        function v_0_1(stuff) {
            return stuff.api_v_0_1;
        }

        /**
         *
         */
        app.get(v_0_1(route).LOGIN, function(req, res) {
            req = null;

            res.send('hello authentication');
        });

        /**
         *
         */
        app.get(v_0_1(route).PARAMS, function(req, res) {
            var callback    = req.param(parameter.CALLBACK);
            var publisherId = req.param(parameter.PUBLISHER_ID);
            var guid        = req.param(parameter.GUID);

            if (!callback) {
                res.send(kNoData);
            }

            if (!publisherId) {
                res.send(kNoData);
            }

            if (!guid) {
                res.send(kNoData);
            }

            // very primitive access control.
            if (publisherId !== '123456') {
                res.send(kNoData);

                return;
            }

            var result = {
                data : createLoginForm({guid : guid})
            };

            res.send(
                callback + '(' + JSON.stringify(result) + ');'
            );
        });

        /**
         * Updates the
         */
        app.get(v_0_1(route).UPDATE, function(req, res) {
            req = null;

            res.header('Content-Type', 'text/html');

            setImmediateExpiresHeader(res);

            res.render(template.UPDATE, {
                apiBootstrapUrl : v_0_1(url).BOOTSTRAP
            });
        });

        /**
         * Beacon to validate the cache of the JS API.
         */
        app.get(v_0_1(route).BEACON, function(req, res) {
            res.header('Content-Type', 'text/javascript');

            setShortExpiresHeader(res);

            var versionTimestamp = v_0_1(config).VERSION_TIMESTAMP;

            var requestedVersion = req.param(
                parameter.VERSION,
                versionTimestamp
            );

            if (requestedVersion !== versionTimestamp) {
                res.render(template.UPDATE_SCRIPT, {
                    iframeUrl : v_0_1(url).UPDATE_IFRAME
                });

                return;
            }

            res.send(kNoData);
        });

    /* #endregion */

    app.listen(80);
}());
