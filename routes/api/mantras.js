var async = require('async'),
    keystone = require('keystone');

var Mantra = keystone.list('Mantra');

exports.create = function(req, res) {
    var item = new Mantra.model(),
        data = (req.method == 'POST') ? req.body : req.query;
    data.ipAddress = req.ip;
    if (!(data.validate && data.validate.toLowerCase().trim() === "karmapa khyenno")) {
        return res.apiResponse ({
            mantras: {
                error:'Please try again, typing the two words below carefully.'
            }
        });
    }
    var handler = item.getUpdateHandler(req);
    handler.process(data, {
        flashErrors: true,
        fields: 'count,ipAddress',
        errorMessage: 'There was a problem submitting your mantra count:'
    }, function(err1) {
        if (err1) return res.apiError('error', err1);
        var resContent = {
            'submitted': item.count,
            'totalCount': 0,
            'messages': []
        };
        Mantra.model.find().exec(function(err2, posts) {
            if (err2) return res.apiError('error', 'problem querying for mantra posts: ' + err2);
            posts.forEach(function (post) {
                try {
                    if (NaN != parseInt(post.count)) {
                        resContent.totalCount += parseInt(post.count);
                    }
                } catch(err) {
                    console.error("bad record: " + err);
                }
            });
            res.apiResponse({
                mantras: resContent
            });
        });
    });
};
/**
 * List Mantras
 */
exports.list = function(req, res) {
    Mantra.model.find(function(err, items) {
        if (err) return res.apiError('database error', err);
        res.apiResponse({
            mantras: items
        });
    });
};
