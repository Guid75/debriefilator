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
	privateItems = {},
	publicItems = {},
	curLayout;

  $rootScope.$watch(function () {
    return privateItems;
  }, function (newItems, oldItems) {
    // console.log(newItems);
    // console.log(oldItems);
  }, true);

	function getNote(noteId, scope) {
		var items = scope === 'public' ? publicItems : privateItems;

		for (var column in items) {
			var columnNotes = items[column];
			for (var i = 0; i < columnNotes.length; i++) {
				var note = columnNotes[i];
				if (note.id === noteId) {
					return note;
				}
			}
		}
		return null;
	}

	function getNoteIndex(noteId, scope) {
		var items = scope === 'public' ? publicItems : privateItems;

		for (var column in items) {
			var columnNotes = items[column];
			for (var i = 0; i < columnNotes.length; i++) {
				var note = columnNotes[i];
				if (note.id === noteId) {
					return i;
				}
			}
		}
		return -1;
	}

  return {
		init: function () {
			curLayout = Session.current().layout;
			// clear private notes
			curLayout.forEach(function(column) {
				privateItems[column.name] = [];
			});
			// fill public notes with the session service ones
			var notes = Session.current().notes;
      notes.forEach(function (note) {
        if (!publicItems[note.column]) {
          publicItems[note.column] = [];
        }
        publicItems[note.column].push(note);
      });
		},
		layout: function() {
			return curLayout;
		},
		getNoteId: function(column, index, scope) {
			var items = scope === 'public' ? publicItems : privateItems;
			return items[column][index].id;
		},
		getNoteText: function(noteId, scope) {
			var note = getNote(noteId, scope);
			if (note) {
				return note.text;
			}
			return null;
		},
		getNoteScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			if (note) {
				return note.score;
			}
			return null;
		},
		add: function(column, text, score, scope) {
			var items = scope === 'public' ? publicItems : privateItems;
			// TODO check the parameters validity

			if (scope === 'public') {
				return $http({
					method: 'POST',
          url: '/note/create',
					data: {
						text: text,
						score: score,
						column: column,
            retro: Session.current().id
					}
				}).then(function(result) {
					items[column].push({
						text: text,
						score: score,
            column: column,
						id: result.data.id
					});
					return result.data.id;
				});
			}
			return $q(function(resolve) {
				var id = uuid4.generate();
				items[column].push({
					text: text,
					score: score,
					id: id
				});
				resolve(id);
			});
		},
		incrementScore: function(column, noteId, scope) {
			var note = getNote(noteId, scope);
			note.score++;
		},
		decrementScore: function(column, noteId, scope) {
			var note = getNote(noteId, scope);
			if (note.score > 1) {
				note.score--;
			}
		},
		delete: function(column, noteId, scope) {
			var items = scope === 'public' ? publicItems : privateItems;
			var index = getNoteIndex(noteId, scope);
			if (index < 0) {
				// TODO raise an error
				return;
			}
			// TODO check the parameters validity
			if (scope === 'public') {
				var note = items[column][index];
				$http({
					method: 'POST',
					url: 'api/session/' + Session.current().id + '/note/remove/' + note.id
				}).then(function(// result
				) {
					items[column].splice(index, 1);
				});
			} else {
				items[column].splice(index, 1);
			}
		},
		list: function(column, scope) {
			var items = scope === 'public' ? publicItems : privateItems;
			// TODO check the parameters validity
			return items[column];
		}
  };
});
