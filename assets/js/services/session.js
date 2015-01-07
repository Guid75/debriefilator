'use strict';

/**
 * @ngdoc service
 * @name debriefilatorApp.session
 * @description
 * # session
 * Factory in the debriefilatorApp.
 */
app.factory('Session', function ($http) {
	var session;
	// Public API here
	return {
		current: function () {
			return session;
		},

		initCurrent: function (id, sessionCfg) {
			session = {
				id: id,
				name: sessionCfg.name,
				layout: sessionCfg.layout,
				notes: sessionCfg.notes
			};
			session.username = sessionCfg.userName ? sessionCfg.userName :'John Doe';
		},

		getUserName: function () {
			return this.current().username;
		},

		join: function (id) {
			return $http({
				method: 'GET',
				url: '/retro/' + id
				// TODO add a pool of users for the joining site
			}).then(function (result) {
				var retro = result.data;
				this.initCurrent(retro.id, {
					userName: retro.userName,
					name: retro.name,
					layout: retro.layout,
					notes: retro.notes
				});
				return session;
			}.bind(this));
		},

		list: function () {
			return $http({
				method: 'GET',
				url: '/retro'
			}).then(function (result) {
				return result.data;
			});
		},

		add: function (sessionCfg) {
			return $http({
				method: 'POST',
				url: '/retro/create',
				data: {
					name: sessionCfg.sessionName,
					layout: sessionCfg.layout
				}
			}).then(function (result) {
				this.initCurrent(result.data.id, sessionCfg);
				return session;
			}.bind(this));
		},

		delete: function (id) {
			return $http({
				method: 'DELETE',
				url: '/retro',
				data: {
					id: id
				}
			});
		}
	};
});
