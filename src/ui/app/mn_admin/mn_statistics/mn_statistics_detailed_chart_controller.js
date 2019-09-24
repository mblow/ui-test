(function () {
  "use strict";

  angular
    .module("mnStatisticsNew")
    .controller("mnStatisticsDetailedChartController", mnStatisticsDetailedChartController)

  function mnStatisticsDetailedChartController(chart, $timeout, $state, items) {
    var vm = this;
    vm.chart = Object.assign({}, chart, {size: "extra"});

    vm.items = items;
    vm.onSelectZoom = onSelectZoom;
    vm.bucket = $state.params.scenarioBucket;
    vm.zoom = $state.params.scenarioZoom;
    vm.node = $state.params.statsHostname;

    function onSelectZoom() {
      vm.reloadChartDirective = true;
      $timeout(function () {
        vm.reloadChartDirective = false;
      });
    }

  }
})();
