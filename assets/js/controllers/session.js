'use strict';

/**
 * @ngdoc function
 * @name debriefilatorApp.controller:SessionCtrl
 * @description
 * # SessionCtrl
 * Controller of the debriefilatorApp
 */
app.controller('SessionCtrl', function ($scope, Note, Session) {
	$scope.stepNo = 0;
	$scope.layout = Note.layout();

	$scope.messages = ['welcome to the chat'];

	$scope.session = Session.current();

	$scope.nextStep = function() {
		$scope.stepNo++;
	};
	$scope.getDirectLink = function() {
		return document.location.href;
	};

	$scope.$on('nextStep', function () {
		$scope.nextStep();
	});
});
