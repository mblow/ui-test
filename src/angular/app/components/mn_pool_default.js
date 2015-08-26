angular.module('mnPoolDefault', [
  'mnHttp',
  'mnPools'
]).factory('mnPoolDefault',
  function (mnHttp, $cacheFactory, $q, mnPools) {
    var mnPoolDefault = {};

    mnPoolDefault.get = function (params) {
      return $q.all([
        mnHttp(_.extend({
          method: 'GET',
          url: '/pools/default?waitChange=0',
          responseType: 'json',
          cache: true,
          timeout: 30000
        }, params)),
        mnPools.get()
      ]).then(function (resp) {
        var poolDefault = resp[0].data;
        var pools = resp[1]
        poolDefault.rebalancing = poolDefault.rebalanceStatus !== 'none';
        poolDefault.isGroupsAvailable = !!(pools.isEnterprise && poolDefault.serverGroupsUri);
        poolDefault.isKvNode =  _.indexOf(_.detect(poolDefault.nodes, function (n) {
          return n.thisNode;
        }).services, "kv") > -1;
        return poolDefault;
      });
    };

    mnPoolDefault.clearCache = function () {
      $cacheFactory.get('$http').remove('/pools/default?waitChange=0');
      return this;
    };

    mnPoolDefault.getFresh = function (params) {
      return mnPoolDefault.clearCache().get(params);
    };

    return mnPoolDefault;
  });
