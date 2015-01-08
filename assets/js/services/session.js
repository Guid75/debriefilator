'use strict';

/**
 * @ngdoc service
 * @name debriefilatorApp.session
 * @description
 * # session
 * Factory in the debriefilatorApp.
 */
app.factory('Session', function ($http, $q, $rootScope) {
	var
	sessions = [],
	currentSession;

	function getSessionIndex(id) {
		var
		i;

		for (i = 0; i < sessions.length; i++) {
			if (sessions[i].id == id) {
				return i;
			}
		}
		return -1;
	}

	function removeSession(id) {
		var
		index = getSessionIndex(id);

		if (index < 0) {
			throw new Error('Session not found');
		}

		sessions.splice(index, 1);
	}

	io.socket.on('retro', function (obj) {
		var
		field,
		item,
		index;
		switch (obj.verb) {
		case 'created':
			$rootScope.$apply(function () {
				sessions.push(obj.data);
			});
			break;
		case 'updated':
			$rootScope.$apply(function () {
				index = getSessionIndex(obj.id);
				item = sessions[index];
				for (field in obj.data) {
					item[field] = obj.data[field];
				}
				sessions[index] = item;
			});
			break;
		case 'destroyed':
			$rootScope.$apply(function () {
				removeSession(obj.id);
			});
			break;
		}
	});


	function list() {
		return $q(function (resolve) {
			io.socket.get('/retro', function (data) {
				resolve(data);
			});
		});
	}

	list().then(function (s) {
		angular.copy(s, sessions);
	});

	// Public API here
	return {
		current: function () {
			return currentSession;
		},

		initCurrent: function (id, sessionCfg) {
			currentSession = {
				id: id,
				name: sessionCfg.name,
				layout: sessionCfg.layout
			};
			currentSession.username = sessionCfg.userName ? sessionCfg.userName :'John Doe';
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
					layout: retro.layout
				});
				return currentSession;
			}.bind(this));
		},

		sessions: sessions,

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
				return currentSession;
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
