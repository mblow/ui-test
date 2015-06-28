angular.module('mnBuckets', [
  'mnHelper',
  'mnBucketsService',
  'ui.bootstrap',
  'mnBucketsDetailsDialogService',
  'mnBarUsage',
  'mnBucketsForm'
]).controller('mnBucketsController',
  function ($scope, buckets, mnBucketsService, mnHelper, $modal) {
    function applyBuckets(buckets) {
      $scope.buckets = buckets;
    }
    applyBuckets(buckets);

    $scope.addBucket = function () {
      mnBucketsService.getBucketsState().then(function (buckets) {
        applyBuckets(buckets);

        !buckets.creationWarnings.length && $modal.open({
          templateUrl: '/angular/app/mn_admin/mn_buckets/details_dialog/mn_buckets_details_dialog.html',
          controller: 'mnBucketsDetailsDialogController',
          resolve: {
            bucketConf: function (mnBucketsDetailsDialogService) {
              return mnBucketsDetailsDialogService.getNewBucketConf();
            },
            autoCompactionSettings: function (mnSettingsAutoCompactionService) {
              return mnSettingsAutoCompactionService.getAutoCompaction();
            }
          }
        });
      });
    };

    mnHelper.setupLongPolling({
      methodToCall: mnBucketsService.getBucketsState,
      scope: $scope,
      onUpdate: applyBuckets
    });
    mnHelper.cancelCurrentStateHttpOnScopeDestroy($scope);
  });