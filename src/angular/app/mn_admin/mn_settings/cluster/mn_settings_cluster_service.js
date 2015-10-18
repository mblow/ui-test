angular.module('mnSettingsClusterService', [
  'mnHttp',
  'mnServersService',
  'mnPoolDefault',
  'mnMemoryQuotaService'
]).factory('mnSettingsClusterService',
  function (mnHttp, $q, mnServersService, mnPoolDefault, mnMemoryQuotaService) {
    var mnSettingsClusterService = {};


    mnSettingsClusterService.getDefaultCertificate = function () {
      return mnHttp({
        method: 'GET',
        url: '/pools/default/certificate'
      });
    };
    mnSettingsClusterService.regenerateCertificate = function () {
      return mnHttp({
        method: 'POST',
        url: '/controller/regenerateCertificate'
      });
    };
    mnSettingsClusterService.postPoolsDefault = function (memoryQuotaConfig, justValidate, clusterName) {
      var data = {
        memoryQuota: memoryQuotaConfig.memoryQuota === null ? "" : memoryQuotaConfig.memoryQuota,
        indexMemoryQuota: memoryQuotaConfig.indexMemoryQuota === null ? "" : memoryQuotaConfig.indexMemoryQuota,
        clusterName: clusterName
      }
      var config = {
        method: 'POST',
        url: '/pools/default',
        data: data
      };
      if (justValidate) {
        config.params = {
          just_validate: 1
        };
      }
      return mnHttp(config);
    };
    mnSettingsClusterService.getIndexSettings = function () {
      return mnHttp.get("/settings/indexes");
    };

    mnSettingsClusterService.postIndexSettings = function (data, justValidate) {
      var config = {
        method: 'POST',
        url: '/settings/indexes',
        data: data
      };
      if (justValidate) {
        config.params = {
          just_validate: 1
        };
      }
      return mnHttp(config);
    };

    function getInMegs(value) {
      return Math.floor(value / Math.Mi);
    }

    mnSettingsClusterService.getClusterState = function () {
      return mnPoolDefault.get().then(function (poolDefault) {
        var requests = [
          mnMemoryQuotaService.memoryQuotaConfig(true, false),
          mnSettingsClusterService.getIndexSettings()
        ];
        if (poolDefault.isEnterprise) {
          requests.push(mnSettingsClusterService.getDefaultCertificate())
        }
        return $q.all(requests).then(function (resp) {
          var certificate = (resp[2] && resp[2].data);
          var memoryQuotaConfig = resp[0];
          var indexSettings = resp[1].data;

          return {
            initialMemoryQuota: memoryQuotaConfig.indexMemoryQuota,
            clusterName: poolDefault.clusterName,
            memoryQuotaConfig: memoryQuotaConfig,
            certificate: certificate,
            indexSettings: indexSettings
          };
        });
      });
    };

    return mnSettingsClusterService;
});