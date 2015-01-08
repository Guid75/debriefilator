'use strict';

/**
 * @ngdoc function
 * @name debriefilatorApp.controller:NoteController
 * @description
 * # NoteController
 * Controller of the debriefilatorApp
 */
app.controller('NoteController', function ($scope, $timeout, Note) {
	var changePromise;

	// temp copy to allow buffered modification
	$scope.text = $scope.note.text;

	$scope.$watch('note.text', function (newNote) {
		$scope.text = newNote;
		console.log('note changed', newNote);
	});

	function applyText() {
		return $scope.text;
	}

	$scope.textChanged = function () {
		switch ($scope.notesScope) {
		case 'private':
			$scope.setText($scope.note.id, $scope.text);
			break;
		case 'public':
			if (changePromise) {
				$timeout.cancel(changePromise);
			}
			changePromise = $timeout(applyText, 1000);
			changePromise.then(function (v) {
				$scope.setText($scope.note.id, $scope.text);
			});
			break;
		default:
			break;
		}
	};
});
