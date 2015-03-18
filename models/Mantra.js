var keystone = require('keystone'),
    Types = keystone.Field.Types;

/**
 * Mantra Model
 * =============
 */

var Mantra = new keystone.List('Mantra', {
    nocreate: true,
    noedit: true
});

Mantra.add({
    count: { type: Types.Number, required: true },
    ipAddress: { type: String, required: false },
    createdAt: { type: Date, default: Date.now }
});

Mantra.schema.pre('save', function(next) {
    this.wasNew = this.isNew;
    next();
});

Mantra.schema.post('save', function() {
    if (this.wasNew) {
        this.sendNotificationEmail();
    }
});

Mantra.schema.methods.sendNotificationEmail = function(callback) {

    var mantraMsg = this;

    keystone.list('Participant').model.find().where('isAdmin', true).exec(function(err, admins) {

        if (err) return callback(err);

        new keystone.Email('mantra-notification').send({
            to: admins,
            from: {
                name: 'Pikes Peak Vajra Vidya',
                email: 'dbeers@gmail.com'
            },
            subject: 'New Mantra submission',
            mantra: mantraMsg
        }, callback);

    });

}

Mantra.defaultSort = '-createdAt';
//Mantra.defaultColumns = 'name, email, enquiryType, createdAt';
Mantra.register();
