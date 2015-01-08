'use strict';

/**
 * @ngdoc function
 * @name debriefilatorApp.controller:NotesCtrl
 * @description
 * # NotesCtrl
 * Controller of the debriefilatorApp
 */
app.controller('NotesCtrl', function ($scope, $rootScope, Note) {
	$scope.getWidthStyle = function() {
		return { width: (100 / $scope.$parent.layout.length) + "%" };
	};

	$scope.notes = Note.list($scope.notesScope);
	$scope.$watchCollection('notes', function (newL, oldL) {
//		console.log('$watchCollection');
	});
	$scope.$watch('notes', function() {
//		console.log('$watch');
	});

	$scope.addNote = function(column) {
		Note.add({
			column: column,
			text: 'Enter your remark here',
			scope: $scope.notesScope
		});
		// TOREDO : focus!
			// .then(function(noteId) {
			// 	$scope.notes.some(function(note) {
			// 		if (note.id === noteId) {
			// 			note.focusMe = 'true';
			// 			return true;
			// 		}
			// 		return false;
			// 	});
			// });
	};

	$scope.deleteNote = function(noteId) {
		Note.delete(noteId, $scope.notesScope);
	};

	$scope.incrementScore = function(noteId) {
		Note.incrementScore(noteId, $scope.notesScope);
	};

	$scope.decrementScore = function(noteId) {
		Note.decrementScore(noteId, $scope.notesScope);
	};

	$scope.setText = function (noteId, text) {
		Note.setText(noteId, $scope.notesScope, text);
	};

	$scope.$on('dropEvent', function(evt, dragged, dropped) {
		var dragData = dragged.split('/');
		var dragId = dragData[0];
		var dragColumn = dragData[1];
		var dragScope = dragData[2];
		var dropColumn = dropped.split('/')[0];
		var dropScope = dropped.split('/')[1];
		if (dropScope !== $scope.notesScope) {
			// TODO dropEvent should be raised here
			return;
		}

		Note.add({
			column: dropColumn,
			text: Note.getNoteText(dragId, dragScope),
			score: Note.getNoteScore(dragId, dragScope),
			scope: dropScope
		});

		Note.delete(dragId, dragScope);
        $scope.$apply();
    });
});
