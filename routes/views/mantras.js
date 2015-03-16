var keystone = require('keystone');
var Mantra = keystone.list('Mantra');

exports = module.exports = function(req, res) {

    var view = new keystone.View(req, res),
        locals = res.locals;

    // locals.section is used to set the currently selected
    // item in the header navigation.
    locals.section = 'mantras';
    locals.data = {};

    view.on('init', function(next) {

        var q = Mantra.model.find();

        q.exec(function(err, posts) {
            var errMsg = null;
            var currCount = 0;
            if (err) {
                errMsg = err;
                console.error(errMsg);
            } else {
                posts.forEach(function (post) {
                    currCount += post.count;
                });
            }
            locals.data.currCount = errMsg? "Mantra count not available at this time" : currCount;
            next(err);
        });

    });

    // Render the view
    view.render('mantras');

};
