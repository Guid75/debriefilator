'use strict';

/**
 * @ngdoc function
 * @name debriefilatorApp.controller:SessionsCtrl
 * @description
 * # SessionsCtrl
 * Controller of the debriefilatorApp
 */
app.controller('SessionsCtrl', function ($rootScope, $scope, $modal, $state, Session, Note) {
	$scope.Session = Session;

	$scope.retros = Session.sessions;

	$scope.nextStep = function () {
		$rootScope.$broadcast('nextStep');
	};

	$scope.newRetro = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/newretro.html',
			controller: ['$scope', 'NotesLayout', function($scope, NotesLayout) {
				$scope.layouts = NotesLayout.all();
				$scope.session = {
					userName: '',
					sessionName: '',
					layout: $scope.layouts[0]
				};
				$scope.dismiss = function() {
					$scope.$dismiss();
				};

				$scope.save = function() {
					$scope.$close($scope.session);
				};

				$scope.clickCat = function(index) {
					$scope.session.layout = $scope.layouts[index];
				};
			}]
		});

		modalInstance.result.then(function (sessionCfg) {
			Session.add(sessionCfg).then(function(session) {
				Note.init().then(function () {
						$state.transitionTo('session', { sessionid: session.id }, { reload: true });
					});
			});
		});
	};

	$scope.joinRetro = function() {
		var modalInstance = $modal.open({
			templateUrl: 'partials/joinretro.html',
			controller: function($scope) {
				$scope.session = {
					sessionName: '',
					userName: ''
				};
				$scope.cancel = function() {
					$scope.$dismiss();
				};

				$scope.join = function() {
					$scope.$close($scope.session);
				};
			}
		});

		modalInstance.result.then(function (sessionCfg) {
			Session.join(sessionCfg)
				.then(function() {
					Note.init().then(function () {
						$state.transitionTo('session', sessionCfg.sessionName, { reload: true });
					});
				}, function() {
					// TODO: display an error
				});
		});
	};

	$scope.joinRetroById = function (id) {
		Session.join(id)
			.then(function (session) {
				Note.init().then(function () {
					$state.transitionTo('session', { sessionid: session.id }, { reload: true });
				});
			});
	};
});
