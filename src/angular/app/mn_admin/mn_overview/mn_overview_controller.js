angular.module('mnOverview', [
  'mnOverviewService',
  'mnBarUsage',
  'mnPlot',
  'mnHelper',
  'mnServersService',
  'mnBucketsService',
  'mnPromiseHelper',
  'mnPoll'
]).controller('mnOverviewController',
  function ($scope, mnServersService, mnBucketsService, mnOverviewService, mnHelper, mnPoll, mnPromiseHelper) {

    mnPoll
      .start($scope, mnOverviewService.getStats, 3000)
      .subscribe("mnOverviewStats")
      .cancelOnScopeDestroy()
      .cycle();
    mnPoll
      .start($scope, mnOverviewService.getOverviewConfig, 3000)
      .subscribe("mnOverviewConfig")
      .cancelOnScopeDestroy()
      .cycle();

    mnPromiseHelper($scope, mnServersService.getNodes())
      .applyToScope("nodes")
      .cancelOnScopeDestroy();
    mnPromiseHelper($scope, mnBucketsService.getBucketsByType())
      .applyToScope("buckets")
      .cancelOnScopeDestroy();

  });