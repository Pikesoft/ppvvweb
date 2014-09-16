var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Participant Model
 * ==========
 */

var Participant = new keystone.List('Participant');

Participant.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true }
});

// Provide access to Keystone
Participant.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});


/**
 * Relationships
 */

Participant.relationship({ ref: 'Post', path: 'author' });


/**
 * Registration
 */

Participant.defaultColumns = 'name, email, isAdmin';
Participant.register();
