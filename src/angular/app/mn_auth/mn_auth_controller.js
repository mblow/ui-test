angular.module('mnAuth').controller('mnAuthController',
  function ($scope, mnAuthService) {
    $scope.loginFailed = false;

    function error() {
      $scope.loginFailed = true;
    }

    $scope.submit = function () {
      mnAuthService.login($scope.user).then(null, error);
    }
  });