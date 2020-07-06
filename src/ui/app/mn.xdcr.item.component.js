import {Component, ChangeDetectionStrategy} from '/ui/web_modules/@angular/core.js'
import {NgbModal} from "/ui/web_modules/@ng-bootstrap/ng-bootstrap.js"
import {combineLatest, Subject} from "/ui/web_modules/rxjs.js";
import {pluck, map, shareReplay, takeUntil} from '/ui/web_modules/rxjs/operators.js';
import {UIRouter} from "/ui/web_modules/@uirouter/angular.js";
import {MnPermissions} from '/ui/app/ajs.upgraded.providers.js';

import {MnLifeCycleHooksToStream, DetailsHashObserver} from './mn.core.js';

import {MnXDCRService} from './mn.xdcr.service.js';
import {MnXDCRErrorsComponent} from "./mn.xdcr.errors.component.js";

export {MnXDCRItemComponent};

class MnXDCRItemComponent extends MnLifeCycleHooksToStream {
  static get annotations() { return [
    new Component({
      selector: "mn-xdcr-item",
      templateUrl: "app/mn.xdcr.item.html",
      changeDetection: ChangeDetectionStrategy.OnPush,
      inputs: [
        "item"
      ]
    })
  ]}

  static get parameters() { return [
    MnPermissions,
    UIRouter,
    MnXDCRService,
    NgbModal
  ]}

  constructor(mnPermissions, uiRouter, mnXDCRService, modalService) {
    super();

    var itemStream = this.mnOnChanges.pipe(pluck("item", "currentValue"));
    var humanStatus = itemStream.pipe(map(this.getStatus),
                                      shareReplay({refCount: true, bufferSize: 1}));
    var getStatusClass = v => v == 'replicating' ? 'dynamic_healthy' : 'dynamic_warmup';
    var getTargetBucket = v => v.target.split('buckets/')[1];

    var onShowErrorsReplication = new Subject();
    onShowErrorsReplication
      .pipe(takeUntil(this.mnOnDestroy))
      .subscribe(item => {
        var ref = modalService.open(MnXDCRErrorsComponent);
        ref.componentInstance.errors = item.errors;
      });

    this.humanStatus = humanStatus;
    this.statusClass = humanStatus.pipe(map(getStatusClass));
    this.toBucket = itemStream.pipe(map(getTargetBucket));
    this.uiRouter = uiRouter;
    this.permissions = mnPermissions.export;
    this.toCluster =
      combineLatest(
        itemStream,
        mnXDCRService.stream.getRemoteClustersByUUID)
      .pipe(map(this.getCluster.bind(this)));

    this.onShowErrorsReplication = onShowErrorsReplication;
  }

  ngOnInit() {
    var detailsHashObserver = new DetailsHashObserver(
      this.uiRouter, this, "xdcrDetails", this.item.id);
    var toggleClass = combineLatest(this.statusClass,
                                    detailsHashObserver.stream.isOpened);
    var sectionClass = toggleClass.pipe(map(([currentClass, isOpened]) =>
                                            isOpened ? currentClass : ""));
    var tableClass = toggleClass.pipe(map(([currentClass, isOpened]) =>
                                          isOpened ? ""  : currentClass));

    this.sectionClass = sectionClass;
    this.tableClass = tableClass;
    this.detailsHashObserver = detailsHashObserver;
  }

  getCluster(source) {
    if (!source[0]) {
      return;
    }
    var uuid = source[0].id.split("/")[0];
    var target = source[1][uuid][0];
    return  !target ? "unknown" : !target.deleted ? target.name : ("at " + target.hostname);
  }

  getStatus(row) {
    if (row.pauseRequested && row.status != 'paused') {
      return 'pausing';
    } else {
      switch (row.status) {
      case 'running': return 'replicating';
      case 'paused': return 'paused';
      default: return 'starting up';
      }
    }
  }
}
