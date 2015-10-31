angular.module('mnIndexes', [
  'mnHelper',
  'mnIndexesService',
  'mnSortableTable',
  'mnPoll',
  'mnSpinner'
]).controller('mnIndexesController',
  function ($scope, mnIndexesService, mnHelper, mnPoll) {

    mnPoll
      .start($scope, mnIndexesService.getIndexesState)
      .subscribe("mnIndexesState")
      .keepIn("app.admin.indexes")
      .cancelOnScopeDestroy()
      .cycle();

    mnHelper.initializeDetailsHashObserver($scope, 'openedIndex', 'app.admin.indexes');

  });