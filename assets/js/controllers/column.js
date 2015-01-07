'use strict';

/**
 * @ngdoc function
 * @name debriefilatorApp.controller:ColumnController
 * @description
 * # ColumnController
 * Controller of the debriefilatorApp
 */
app.controller('ColumnController', function ($scope, $rootScope, Note) {
	// $scope.notes = function(column) {
	// 	return Note.list(column, $scope.notesScope);
	// };

	// $scope.addNote = function(column) {
	// 	Note.add(column, 'Enter your remark here', $scope.notesScope)
	// 		.then(function(noteId) {
	// 			$scope.notes(column).some(function(note) {
	// 				if (note.id === noteId) {
	// 					note.focusMe = 'true';
	// 					return true;
	// 				}
	// 				return false;
	// 			});
	// 		});
	// };

	// $scope.deleteNote = function(noteId) {
	// 	Note.delete(noteId, $scope.notesScope);
	// };

	// $scope.incrementScore = function(noteId) {
	// 	Note.incrementScore(noteId, $scope.notesScope);
	// };

	// $scope.decrementScore = function(noteId) {
	// 	Note.decrementScore(noteId, $scope.notesScope);
	// };

	// $scope.setText = function (noteId, text) {
	// 	Note.setText(noteId, $scope.notesScope, text);
	// };

	// $scope.$on('dropEvent', function(evt, dragged, dropped) {
	// 	var dragData = dragged.split('/');
	// 	var dragId = dragData[0];
	// 	var dragColumn = dragData[1];
	// 	var dragScope = dragData[2];
	// 	var dropColumn = dropped.split('/')[0];
	// 	var dropScope = dropped.split('/')[1];
	// 	if (dropScope !== $scope.notesScope) {
	// 		// TODO dropEvent should be raised here
	// 		return;
	// 	}

	// 	Note.add(dropColumn,
	// 			 Note.getNoteText(dragId, dragScope),
	// 			 Note.getNoteScore(dragId, dragScope),
	// 			 dropScope);
	// 	Note.delete(dragColumn, dragId, dragScope);
    //     $scope.$apply();
    // });
});
