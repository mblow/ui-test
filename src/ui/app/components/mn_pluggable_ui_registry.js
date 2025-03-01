/*
Copyright 2015-Present Couchbase, Inc.

Use of this software is governed by the Business Source License included in
the file licenses/BSL-Couchbase.txt.  As of the Change Date specified in that
file, in accordance with the Business Source License, use of this software will
be governed by the Apache License, Version 2.0, included in the file
licenses/APL2.txt.
*/

import angular from 'angular';
import _ from 'lodash';

let MnPluggableUiRegistry = 'mnPluggableUiRegistry';
export default MnPluggableUiRegistry;

angular
  .module(MnPluggableUiRegistry, [])
  .provider(MnPluggableUiRegistry, MnPluggableUiRegistryProvider)
  .factory('mnPluggableTabUtil', MnPluggableTabUtil)
  .directive('mnPluggableUiTabs', ["mnPluggableUiRegistry", "mnPluggableTabUtil", "$compile", MnPluggableUiTabs]);


function MnPluggableTabUtil() {

  return {
    getTabTemplate: getTabTemplate
  };

  function getTabTemplate(config, tabBarName) {
    return "<a " +
      "ng-show=\"" + config.ngShow +
      "\"class=\"" + (config.responsiveHide ? "resp-hide-sml " : "") +
      (tabBarName == "indexesTab" ? "pills" :
       "") +
      "\"ui-sref=\"" + config.state +
      (config.includedByState ?
       "\"ng-class=\"{currentnav: ('" + config.includedByState + "' | includedByState)}\"" :
       "\"ui-sref-active=\"currentnav\"") + ">" +
      config.name +
      "</a>";
  }

}


function MnPluggableUiTabs(mnPluggableUiRegistry, mnPluggableTabUtil, $compile) {
  return {
    link: link
  };

  function link($scope, $element, $attrs) {
    var pluggableUiConfigs = mnPluggableUiRegistry.getConfigsByTabBarName($attrs.mnTabBarName);
    if (!pluggableUiConfigs.length) {
      return;
    }
    pluggableUiConfigs = _.sortBy(pluggableUiConfigs, 'index');
    angular.forEach(pluggableUiConfigs, function (config) {
      config.ngShow = config.ngShow == undefined ? true : config.ngShow;
      if (config.after !== "buckets") {
        var targetTab = $element[0].querySelector("[mn-tab='" + config.after + "']");
        if (!targetTab) {
          throw new Error("There is no tab with mn-tab=" + config.after + " in " + $attrs.mnTabBarName);
        }
        let compiled = $compile(mnPluggableTabUtil.getTabTemplate(config, $attrs.mnTabBarName))($scope);
        angular.element(targetTab).after(compiled);
      } else {
        let compiled = $compile(mnPluggableTabUtil.getTabTemplate(config, $attrs.mnTabBarName))($scope);
        $element.append(compiled);
      }
    });
  }
}

function MnPluggableUiRegistryProvider() {
  var _configs = [];

  this.registerConfig = registerConfig;
  this.$get = mnPluggableUiRegistryFactory;

  /**
   * Registers a UI component config with the pluggable UI registry service so that the
   * component can be displayed in the UI.
   *
   * The pluggable UI framework understands the following attributes of the config:
   * 1) name - the name of the UI component to be registered. This is used appropriately
   *    in the UI when the component is displayed. For instance, if the component is
   *    rendered in a tab, the value of name will be used in the tab name.
   * 2) state - the name of the ui.router state for this component. When the time comes to
   *    render the component this is what is used to find it.
   * 3) plugIn - where the component plugs-in to the UI. Currently only 2 values are supported.
   *    If a value other than these 2 is specified, the component won't be displayed.
   *    a) 'adminTab' - to be used in the case that the pluggable component wishes to plug-in to
   *        global nav bar
   *    b) 'settingsTab' - to be used in the case that the pluggable component wishes to
   *        plug in to the the settings tab bar
   *
   * Any attributes beyond these are not understood and are ignored.
   * @param config
   */
  function registerConfig(config) {
    _configs.push(config);
  }

  function mnPluggableUiRegistryFactory() {

    return {
      getConfigs: getConfigs,
      getConfigsByTabBarName: getConfigsByTabBarName
    };

    /**
     * Returns a list of the registered plugabble UI configs.
     * @returns {Array}
     */
    function getConfigs() {
      return _configs;
    }
    function getConfigsByTabBarName(tabBarName) {
      return _.filter(_configs, {plugIn: tabBarName});
    }
  }
}
