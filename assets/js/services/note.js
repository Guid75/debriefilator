'use strict';

/**
 * @ngdoc service
 * @name debriefilatorApp.note
 * @description
 * # note
 * Factory in the debriefilatorApp.
 */
app.factory('Note', function ($rootScope, $q, $http, Session, uuid4) {
	var
	privateNotes = [],
	publicNotes = [],
	curLayout;

	// $rootScope.$watch(function () {
	// 	return publicNotes;
	// }, function (newNotes, oldNotes) {
	//   // get all modifications
	// 	console.log('publicNotes modified');

	//   // console.log(newItems);
	//   // console.log(oldItems);
	// }, true);

	io.socket.on('note', function (obj) {
		var
		field,
		item,
		index;
		console.log('notification on notes', obj);
		switch (obj.verb) {
		case 'created':
			$rootScope.$apply(function () {
				publicNotes.push(obj.data);
			});
			break;
		case 'updated':
			$rootScope.$apply(function () {
				index = getNoteIndex(obj.id, 'public');
//				item = angular.copy(publicNotes[index]);
				item = publicNotes[index];
				for (field in obj.data) {
					item[field] = obj.data[field];
				}
				publicNotes[index] = item;
				console.log('updated');
			});
			break;
		case 'destroyed':
			$rootScope.$apply(function () {
				removeNote(obj.id, 'public');
			});
			break;
		}
	});

	function getNoteIndex(noteId, scope) {
		var
		i,
		notes = (scope === 'public' ? publicNotes : privateNotes);

		for (i = 0; i < notes.length; i++) {
			if (notes[i].id == noteId) {
				return i;
			}
		}
		return -1;
	}

	function getNote(noteId, scope) {
		var
		notes = (scope === 'public' ? publicNotes : privateNotes),
		index = getNoteIndex(noteId, scope);

		return (index >= 0 ? notes[getNoteIndex(noteId, scope)] : null);
	}

	// remove the note in internal structures
	function removeNote(noteId, scope) {
		var
		items = scope === 'public' ? publicNotes : privateNotes,
		index = getNoteIndex(noteId, scope);

		if (index < 0) {
			throw new Error('Note not found');
		}

		items.splice(index, 1);
	}

	function load() {
		return $q(function (resolve) {
			io.socket.get('/note', {
				retro: Session.current().id
			}, function (data) {
				// fill public notes with the session service ones
				angular.copy([], privateNotes);
				angular.copy(data || [], publicNotes);
				resolve();
			});
		});
	}

	return {
		init: function () {
			curLayout = Session.current().layout;
			return load();
		},

		layout: function() {
			return curLayout;
		},
		getNoteText: function(noteId, scope) {
			var note = getNote(noteId, scope);
			return note ? note.text : null;
		},
		getNoteScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			return note ? note.score : null;
		},
		add: function(column, text, scope) {
			switch (scope) {
			case 'public':
				return $http({
					method: 'POST',
					url: '/note/create',
					data: {
						text: text,
						score: 1,
						column: column,
						retro: Session.current().id
					}
				});
			case 'private':
				return $q(function(resolve) {
					var id = uuid4.generate();
					privateNotes.push({
						text: text,
						column: column,
						score: 1,
						id: id
					});
					resolve(id);
				});
			default:
				break;
			}
			throw new Error('Unknown scope: ' + scope);
			return null;
		},
		incrementScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			if (!note) {
				throw new Error('Unknown note');
			}
			switch (scope) {
			case 'public':
				return $http({
					method: 'PUT',
					url: '/note/' + noteId,
					data: {
						score: note.score + 1
					}
				}).then(function (result) {
					note.score = result.data.score;
				});
			case 'private':
				return $q(function (resolve) {
					note.score++;
					resolve(note.score);
				});
			default:
				return null;
			}
		},
		decrementScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			if (!note) {
				throw new Error('Unknown note');
			}
			if (note.score <= 1) {
				// ignore attempts to decrement a score equal to 1
				return $q(function (resolve) {
					resolve(note.score);
				});
			}
			switch (scope) {
			case 'public':
				return $http({
					method: 'PUT',
					url: '/note/' + noteId,
					data: {
						score: note.score - 1
					}
				}).then(function (result) {
					note.score = result.data.score;
				});
			case 'private':
				return $q(function (resolve) {
					note.score--;
					resolve(note.score);
				});
			default:
				return null;
			}
		},
		setText: function(noteId, scope, text) {
			var note = getNote(noteId, scope);
			if (!note) {
				throw new Error('Unknown note');
			}
			switch (scope) {
			case 'public':
				return $http({
					method: 'PUT',
					url: '/note/' + noteId,
					data: {
						text: text
					}
				});
			case 'private':
				return $q(function (resolve) {
					note.text = text;
					resolve(note.text);
				});
			default:
				break;
			}
		},
		delete: function(noteId, scope) {
			var
			note = getNote(noteId, scope);

			if (!note) {
				throw new Error('Trying to delete an unknown note');
			}

			// TODO check the parameters validity
			if (scope === 'public') {
				$http({
					method: 'DELETE',
					url: '/note/' + note.id
				});
			} else {
				removeNote(noteId, scope);
			}
		},
		list: function(scope) {
			switch (scope) {
			case 'private':
				return privateNotes;
			case 'public':
				return publicNotes;
			default:
				throw new Error('Unknown scope');
			}
		}
	};
});
