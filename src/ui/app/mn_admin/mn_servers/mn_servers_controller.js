(function () {
  angular.module('mnServers', [
    'mnPoolDefault',
    'ui.router',
    'ui.bootstrap',
    'mnServersService',
    'mnHelper',
    'mnVerticalBar',
    'mnBarUsage',
    'mnServersListItemDetailsService',
    'mnFilters',
    'mnSortableTable',
    'mnServices',
    'mnSpinner',
    'ngMessages',
    'mnMemoryQuotaService',
    'mnIndexesService',
    'mnPromiseHelper',
    'mnGroupsService',
    'mnPoll',
    'mnPools'
  ]).controller('mnServersController', mnServersController)
    .filter("formatFailoverWarnings", formatFailoverWarnings);

  function formatFailoverWarnings() {
    return function (warning) {
      switch (warning) {
        case 'rebalanceNeeded': return 'Rebalance required, some data is not currently replicated!';
        case 'hardNodesNeeded': return 'At least two servers with the data service are required to provide replication!';
        case 'softNodesNeeded': return 'Additional active servers required to provide the desired number of replicas!';
        case 'softRebalanceNeeded': return 'Rebalance recommended, some data does not have the desired replicas configuration!';
      }
    };
  }

  function mnServersController($scope, $state, $uibModal, $q, $interval, mnMemoryQuotaService, mnIndexesService, $stateParams, $timeout, mnPoolDefault, mnPoll, mnServersService, mnHelper, mnGroupsService, mnPromiseHelper, mnPools) {
    var vm = this;
    vm.mnPoolDefault = mnPoolDefault.latestValue();

    vm.isServerGroupsDisabled = isServerGroupsDisabled;
    vm.isAddServerDisabled = isAddServerDisabled;
    vm.isRebalanceDisabled = isRebalanceDisabled;
    vm.stopRebalanceDisabled = stopRebalanceDisabled;
    vm.stopRecoveryDisabled = stopRecoveryDisabled;

    vm.isReAddPossible = isReAddPossible;
    vm.isNodeUnhealthy = isNodeUnhealthy;
    vm.showInactiveNodeHostname = showInactiveNodeHostname;
    vm.showActiveNodeHostname = showActiveNodeHostname;
    vm.showPendingRecoveryControls = showPendingRecoveryControls;
    vm.showPendingRemovalControls = showPendingRemovalControls;
    vm.showPendingAddControls = showPendingAddControls;
    vm.showFailedOverControls = showFailedOverControls;
    vm.isLastActiveData = isLastActiveData;
    vm.isDataDiskUsageAvailable = isDataDiskUsageAvailable;
    vm.couchDataSize = couchDataSize;
    vm.couchDiskUsage = couchDiskUsage;
    vm.getRebalanceProgress = getRebalanceProgress;
    vm.disableRemoveBtn = disableRemoveBtn;
    vm.isFailOverDisabled = isFailOverDisabled;
    vm.showRebalanceProgressPerItem = showRebalanceProgressPerItem;

    vm.getRamUsageConf = getRamUsageConf;
    vm.getSwapUsageConf = getSwapUsageConf;
    vm.getCpuUsageConf = getCpuUsageConf;

    vm.cancelEjectServer = cancelEjectServer;
    vm.cancelFailOverNode = cancelFailOverNode;
    vm.reAddNode = reAddNode;
    vm.failOverNode = failOverNode;
    vm.ejectServer = ejectServer;
    vm.stopRebalance = stopRebalance;
    vm.onStopRecovery = onStopRecovery;
    vm.postRebalance = postRebalance;
    vm.addServer = addServer;

    activate();

    function activate() {
      mnHelper.initializeDetailsHashObserver(vm, 'openedServers', 'app.admin.servers');
      mnPoll
        .start($scope, function () {
          return mnServersService.getServersState($stateParams.list);
        })
        .subscribe("mnServersState", vm)
        .keepIn("app.admin.servers", vm)
        .cancelOnScopeDestroy()
        .cycle();
    }

    var ramUsageConf = {};
    var swapUsageConf = {};
    var cpuUsageConf = {};

    function getRamUsageConf(node) {
      var total = node.memoryTotal;
      var free = node.memoryFree;
      var used = total - free;
      cpuUsageConf.exist = (total > 0) && _.isFinite(free);
      cpuUsageConf.height = used / total * 100;
      cpuUsageConf.top = 105 - used / total * 100;
      cpuUsageConf.value = used / total * 100;
      return cpuUsageConf;
    }
    function getSwapUsageConf(node) {
      var swapTotal = node.systemStats.swap_total;
      var swapUsed = node.systemStats.swap_used;
      swapUsageConf.exist = swapTotal > 0 && _.isFinite(swapUsed);
      swapUsageConf.height = swapUsed / swapTotal * 100;
      swapUsageConf.top = 105 - (swapUsed / swapTotal * 100);
      swapUsageConf.value = (swapUsed / swapTotal) * 100;
      return swapUsageConf;
    }
    function getCpuUsageConf(node) {
      var cpuRate = node.systemStats.cpu_utilization_rate;
      cpuUsageConf.exist = _.isFinite(cpuRate);
      cpuUsageConf.height = Math.floor(cpuRate * 100) / 100;
      cpuUsageConf.top = 105 - (Math.floor(cpuRate * 100) / 100);
      cpuUsageConf.value = Math.floor(cpuRate * 100) / 100;
      return cpuUsageConf;
    }
    function isFailOverDisabled() {
      return isLastActiveData() || vm.mnServersState.tasks.inRecoveryMode;
    }
    function disableRemoveBtn(node) {
      return isLastActiveData() || isActiveUnhealthy(node) || vm.mnServersState.tasks.inRecoveryMode;
    }
    function showFailedOverControls(node) {
      return !vm.mnServersState.tasks.inRebalance && !isNodeInactiveAdded(node) && !node.pendingEject;
    }
    function showPendingRemovalControls(node) {
      return !vm.mnServersState.tasks.inRebalance && !isNodeInactiveAdded(node) && node.pendingEject;
    }
    function isNodeInactiveAdded(node) {
      return node.clusterMembership === 'inactiveAdded';
    }
    function isNodeUnhealthy(node) {
      return node.status === 'unhealthy';
    }
    function isNodeInactiveFaied(node) {
      return node.clusterMembership === 'inactiveFailed';
    }
    function isReAddPossible(node) {
      return isNodeInactiveFaied(node) && !isNodeUnhealthy(node) && !vm.mnPoolDefault.value.isROAdminCreds;
    }
    function isLastActiveData() {
      return vm.mnServersState.nodes.reallyActiveData.length === 1;
    }
    function couchDataSize(node) {
      return node.interestingStats['couch_docs_data_size'] + node.interestingStats['couch_views_data_size'] + node.interestingStats['couch_spatial_data_size'];
    }
    function couchDiskUsage(node) {
      return node.interestingStats['couch_docs_actual_disk_size'] + node.interestingStats['couch_views_actual_disk_size'] + node.interestingStats['couch_spatial_disk_size']
    }
    function isDataDiskUsageAvailable(node) {
      return !!(couchDataSize(node) || couchDiskUsage(node));
    }
    function getRebalanceProgress(node) {
      return vm.mnServersState.tasks.tasksRebalance.perNode && vm.mnServersState.tasks.tasksRebalance.perNode[node.otpNode]
           ? vm.mnServersState.tasks.tasksRebalance.perNode[node.otpNode].progress : 0 ;
    }
    function isActiveUnhealthy(node) {
      return $state.params.type === "active" && isNodeUnhealthy(node);
    }
    function showPendingRecoveryControls(node) {
      return !vm.mnServersState.tasks.inRebalance && isNodeInactiveAdded(node) && node.recoveryType !== 'none'
    }
    function showInactiveNodeHostname(node) {
      return isNodeInactiveFaied(node) && !isNodeUnhealthy(node);
    }
    function showActiveNodeHostname(node) {
      return !isNodeInactiveFaied(node) && !isNodeUnhealthy(node);
    }
    function showRebalanceProgressPerItem() {
      return vm.mnServersState.tasks.inRebalance && vm.mnServersState.tasks.tasksRebalance.status === 'running';
    }
    function showPendingAddControls(node) {
      return !vm.mnServersState.tasks.inRebalance && isNodeInactiveAdded(node) && node.recoveryType === 'none';
    }
    function isServerGroupsDisabled() {
      return !vm.mnServersState || !vm.mnServersState.isGroupsAvailable || vm.mnPoolDefault.value.isROAdminCreds || !vm.mnPoolDefault.value.isEnterprise;
    }
    function isAddServerDisabled() {
      return !vm.mnServersState || vm.mnServersState.rebalancing || vm.mnPoolDefault.value.isROAdminCreds;
    }
    function isRebalanceDisabled() {
      return !vm.mnServersState || !vm.mnServersState.mayRebalance || vm.mnPoolDefault.value.isROAdminCreds;
    }
    function stopRebalanceDisabled() {
      return !vm.mnServersState || !vm.mnServersState.tasks.inRebalance || vm.mnPoolDefault.value.isROAdminCreds;
    }
    function stopRecoveryDisabled() {
      return !vm.mnServersState || !vm.mnServersState.tasks.inRecoveryMode || vm.mnPoolDefault.value.isROAdminCreds;
    }
    function addServer() {
      $uibModal.open({
        templateUrl: 'app/mn_admin/mn_servers/add_dialog/mn_servers_add_dialog.html',
        controller: 'mnServersAddDialogController as mnServersAddDialogController',
        resolve: {
          groups: function () {
            return mnPoolDefault.getFresh().then(function (poolDefault) {
              if (poolDefault.isGroupsAvailable) {
                return mnGroupsService.getGroups();
              }
            });
          }
        }
      });
    }
    function postRebalance() {
      mnPromiseHelper(vm, mnServersService.postRebalance(vm.mnServersState.nodes.allNodes))
        .onSuccess(function () {
          $state.go('app.admin.servers', {list: 'active'});
          vm.viewLoading = true;
        })
        .reloadState()
        .cancelOnScopeDestroy($scope);
    }
    function onStopRecovery() {
      mnPromiseHelper(vm, mnServersService.stopRecovery(vm.mnServersState.tasks.tasksRecovery.stopURI))
        .reloadState()
        .cancelOnScopeDestroy($scope);
    }
    function stopRebalance() {
      mnPromiseHelper(vm, mnServersService.stopRebalance())
        .cancelOnScopeDestroy($scope)
        .reloadState()
        .getPromise()
        .then(function (resp) {
          (resp === 400) && $uibModal.open({
            templateUrl: 'app/mn_admin/mn_servers/stop_rebalance_dialog/mn_servers_stop_rebalance_dialog.html',
            controller: 'mnServersStopRebalanceDialogController as mnServersStopRebalanceDialogController'
          });
        });
    }
    function ejectServer(node) {
      if (isNodeInactiveAdded(node)) {
        mnPromiseHelper(vm, mnServersService.ejectNode({otpNode: node.otpNode}))
          .showSpinner()
          .reloadState()
          .cancelOnScopeDestroy($scope);
        return;
      }

      var promise = $q.all([
        mnIndexesService.getIndexesState(),
        mnServersService.getNodes()
      ]).then(function (resp) {
        var nodes = resp[1];
        var indexStatus = resp[0];
        var warnings = {
          isLastIndex: mnMemoryQuotaService.isOnlyOneNodeWithService(nodes.allNodes, node.services, 'index'),
          isLastQuery: mnMemoryQuotaService.isOnlyOneNodeWithService(nodes.allNodes, node.services, 'n1ql'),
          isThereIndex: !!_.find(indexStatus.indexes, function (index) {
            return _.indexOf(index.hosts, node.hostname) > -1;
          }),
          isKv: _.indexOf(node.services, 'kv') > -1
        };
        if (_.some(_.values(warnings))) {
          $uibModal.open({
            templateUrl: 'app/mn_admin/mn_servers/eject_dialog/mn_servers_eject_dialog.html',
            controller: 'mnServersEjectDialogController as mnServersEjectDialogController',
            resolve: {
              warnings: function () {
                return warnings;
              },
              node: function () {
                return node;
              }
            }
          });
        } else {
          mnServersService.addToPendingEject(node);
          vm.viewLoading = true;
          mnHelper.reloadState();
        }
      });

      mnPromiseHelper(vm, promise).cancelOnScopeDestroy($scope);
    }
    function failOverNode(node) {
      $uibModal.open({
        templateUrl: 'app/mn_admin/mn_servers/failover_dialog/mn_servers_failover_dialog.html',
        controller: 'mnServersFailOverDialogController as mnServersFailOverDialogController',
        resolve: {
          node: function () {
            return node;
          }
        }
      });
    }
    function reAddNode(type, otpNode) {
      mnPromiseHelper($scope, mnServersService.reAddNode({
        otpNode: otpNode,
        recoveryType: type
      }))
      .reloadState()
      .cancelOnScopeDestroy($scope);
    }
    function cancelFailOverNode(otpNode) {
      mnPromiseHelper($scope, mnServersService.cancelFailOverNode({
        otpNode: otpNode
      }))
      .reloadState()
      .cancelOnScopeDestroy($scope);
    }
    function cancelEjectServer(node) {
      mnServersService.removeFromPendingEject(node);
      mnHelper.reloadState();
    }
  }
})();

