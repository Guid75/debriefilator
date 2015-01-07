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
    // get all modifications


    // console.log(newItems);
    // console.log(oldItems);
  }, true);

  // gives a column and an index for a note
  function getNoteLocation(noteId, scope) {
    var
    notes,
		items = scope === 'public' ? publicItems : privateItems;

		for (var column in items) {
			notes = items[column];
			for (var i = 0; i < notes.length; i++) {
				if (notes[i].id === noteId) {
          return {
            column: column,
            index: i
          };
				}
			}
		}
    return null;
  }

	function getNote(noteId, scope) {
		var
    items = scope === 'public' ? publicItems : privateItems,
    location = getNoteLocation(noteId, scope);

    return (location ? items[location.column][location.index] : null);
	}

  // remove the note in internal structures
  function removeNote(noteId, scope) {
    var
		items = scope === 'public' ? publicItems : privateItems,
    location = getNoteLocation(noteId, scope);

    if (!location) {
      throw new Error('Note not found');
    }

    items[location.column].splice(location.index, 1);
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
          if (!items[column]) {
            // first note of the column
            items[column] = [];
          }
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
		incrementScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			note.score++;
		},
		decrementScore: function(noteId, scope) {
			var note = getNote(noteId, scope);
			if (note.score > 1) {
				note.score--;
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
				}).then(function() {
          removeNote(noteId, scope);
				});
			} else {
        removeNote(noteId, scope);
			}
		},
		list: function(column, scope) {
			var items = scope === 'public' ? publicItems : privateItems;
			// TODO check the parameters validity
			return items[column];
		}
  };
});
