'use strict';

var password = require('password-hash-and-salt');
var q = require('q');

function UsersResource(models, Validator) {
	// TODO: Email confirmation.
	// TODO: Forgot my password.

	Validator.addResource({
		name: 'users',
		mode: 'create',
		rules: {
			email: ['requiredd', 'unique-email', 'no-white-space'],
			alias: ['required', 'unique-alias', 'no-white-space'],
			password: ['required', 'strong-password', 'no-white-space'],
			gw2Token: ['valid-gw2-token', 'no-white-space']
		}
	});

	Validator.addResource({
		name: 'users',
		mode: 'update',
		rules: {
			alias: ['required', 'unique-alias', 'no-white-space'],
			password: ['required', 'strong-password', 'no-white-space']
		}
	});

	Validator.addResource({
		name: 'users',
		mode: 'update-gw2-token',
		rules: {
			gw2Token: ['valid-gw2-token', 'no-white-space']
		}
	});

	UsersResource.prototype.create = function (user) {
		var defer = q.defer();

		var validator = Validator({
			resource: 'users',
			mode: 'create'
		});

		console.log(validator.validate);

		validator.validate(user)
			.then(function () {
				password(user.password).hash(function (error, hash) {
					if (error) {
						defer.reject(error);
					}

					user.passwordHash = hash;

					models.User
						.create(user)
						.then(defer.resolve, defer.reject);
				});
			}, defer.reject);

		return defer.promise;
	};

	UsersResource.prototype.update = function (user) {
		var defer = q.defer();

		var validator = new Validator({
			resource: 'users',
			mode: 'update'
		});

		validator.validate()

		models.User
			.update(user, { where: { alias: user.alias } })
			.then(function (e) {

			}, q.reject);

		var defer = q.defer();
	};

	UsersResource.prototype.updateGw2Token = function (alias, token) {
		var defer = q.defer();

		var validator = new Validator({
			resource: 'users',
			mode: 'update-gw2-token'
		});

		validator.validate(token)
			.then(function () {
				// update !
			}, defer.reject)
		
		return defer.promise;
	};

	UsersResource.prototype.sendActivationEmail = function (alias) {
		// TODO: Implement
	};
}

module.exports = UsersResource;