/*
Copyright 2020-Present Couchbase, Inc.

Use of this software is governed by the Business Source License included in
the file licenses/BSL-Couchbase.txt.  As of the Change Date specified in that
file, in accordance with the Business Source License, use of this software will
be governed by the Apache License, Version 2.0, included in the file
licenses/APL2.txt.
*/

import {Component, ChangeDetectionStrategy} from '@angular/core';
import {merge, fromEvent} from 'rxjs';
import {takeUntil, map, withLatestFrom, filter, switchMap,
        first, throttleTime, distinctUntilChanged} from 'rxjs/operators';

import {MnLifeCycleHooksToStream} from './mn.core.js';
import {MnPoolsService} from './mn.pools.service.js';
import {MnAdminService} from "./mn.admin.service.js";
import {MnWizardService} from './mn.wizard.service.js';
import template from "./mn.services.config.html";

export {MnServicesConfigComponent};

class MnServicesConfigComponent extends MnLifeCycleHooksToStream {
  static get annotations() { return [
    new Component({
      selector: "mn-services-config",
      template,
      inputs: [
        "group",
        "initDataStream",
        "isFlagEnabled",
        "isFieldEnabled"
      ],
      changeDetection: ChangeDetectionStrategy.OnPush
    })
  ]}

  static get parameters() { return [
    MnAdminService,
    MnPoolsService,
    MnWizardService
  ]}

  constructor(mnAdminService, mnPoolsService, mnWizardService) {
    super();
    this.postPoolsDefaultValidation = mnAdminService.stream.postPoolsDefaultValidation;
    this.postClusterInitHttp = mnWizardService.stream.postClusterInitHttp;
    this.isEnterprise = mnPoolsService.stream.isEnterprise;
    this.quotaServices = mnPoolsService.stream.quotaServices;
    this.mnServices = mnPoolsService.stream.mnServices;
    this.getServiceName = mnPoolsService.getServiceVisibleName;
    this.getServiceErrorName = mnPoolsService.getServiceQuotaName;
  }

  ngOnInit() {
    if (this.isFlagEnabled) {
      this.activateHotKeys();
    }
    if (!this.isFieldEnabled) {
      return;
    }
    this.focusFieldSubject =
      this.quotaServices.pipe(map(function (quotaServices) {
        return quotaServices.find(this.selectInitialFocus.bind(this))
      }.bind(this)))

    if (this.isFlagEnabled && this.isFieldEnabled) {
      this.total =
        merge(this.group.valueChanges, this.initDataStream)
        .pipe(withLatestFrom(this.quotaServices),
              map(this.calculateTotal.bind(this)));
    }
    if (this.isFlagEnabled) {
      this.quotaServices
        .pipe(first())
        .subscribe(function (services) {
          services.forEach(this.createToggleFieldStream.bind(this))
        }.bind(this));
    }

    this.group.valueChanges
      .pipe(throttleTime(500, undefined, {leading: true, trailing: true}),
            withLatestFrom(this.quotaServices),
            takeUntil(this.mnOnDestroy))
      .subscribe(this.validate.bind(this));

    this.initDataStream
      .subscribe((memoryQuota) => {
        this.group.get("field").patchValue(memoryQuota, {emitEvent: false})
      });
  }

  selectInitialFocus(service) {
    return this.group.value.field[service];
  }

  calculateTotal(source) {
    return source[1].reduce(this.getQuota.bind(this), -15872);
  }

  validate(source) {
    this.postPoolsDefaultValidation.post(
      source[1].reduce(this.packQuotas.bind(this), {}));
  }

  packQuotas(acc, name) {
    var service = this.getFlag(name);
    var keyName = name + 'MemoryQuota';
    switch (name) {
      case 'kv':
        keyName = 'memoryQuota';
        break;
      case 'n1ql':
        keyName = 'queryMemoryQuota';
        break;
    }
    if (!this.isFlagEnabled || (service && service.value)) {
      acc[keyName] = this.getField(name).value;
    }
    return acc;
  }

  getQuota(acc, name) {
    var flag = this.getFlag(name);
    var field = this.getField(name);
    return acc + (((!flag || flag.value) && Number(field.value)) || 0);
  }

  createToggleFieldStream(serviceGroupName) {
    var group = this.getFlag(serviceGroupName);
    if (group) {
      group.valueChanges
        .pipe(takeUntil(this.mnOnDestroy))
        .subscribe(this.toggleFields(serviceGroupName).bind(this));
    }
  }

  toggleFields(name) {
    return function () {
      this.getField(name)[this.getFlag(name).value ? "enable" : "disable"]({onlySelf: true});
    }
  }

  getFlag(name) {
    return this.group.get("flag." + name);
  }

  getField(name) {
    return this.group.get("field." + name);
  }

  activateHotKeys() {
    var altKey = merge(fromEvent(document, 'keyup'),
                       fromEvent(document, 'keydown'))
        .pipe(map(evt => evt.altKey),
              distinctUntilChanged());

    var isPressed = altKey.pipe(filter(isPressed => isPressed));
    var isNotPressed = altKey.pipe(filter(isPressed => !isPressed));

    isPressed
      .pipe(switchMap(() =>
                      this.group.get("flag").valueChanges.pipe(takeUntil(isNotPressed))),
            takeUntil(this.mnOnDestroy))
      .subscribe(flag => {
        let flags = this.group.get("flag").controls;
        let toggle = (Object.values(flag).filter(v => !v).length == 1);

        Object.keys(flag).forEach(key => {
          flags[key].setValue(!toggle, {onlySelf: true});
        });
      });
  }

}
