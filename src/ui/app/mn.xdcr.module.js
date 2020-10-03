import { NgModule } from "/ui/web_modules/@angular/core.js";
import { UIRouterModule } from "/ui/web_modules/@uirouter/angular.js";
import { ReactiveFormsModule } from "/ui/web_modules/@angular/forms.js";
import { NgbModule } from "/ui/web_modules/@ng-bootstrap/ng-bootstrap.js";

import { MnElementCraneModule } from "./mn.element.crane.js";
import { MnSharedModule } from './mn.shared.module.js';
import { MnInputFilterModule } from './mn.input.filter.module.js';

import { MnXDCRComponent } from "./mn.xdcr.component.js";
import { MnXDCRItemComponent } from "./mn.xdcr.item.component.js";
import { MnXDCRItemDetailsComponent,
         MnReplicationStatus } from "./mn.xdcr.item.details.component.js";
import { MnXDCRRefItemComponent } from "./mn.xdcr.ref.item.component.js";
import { MnXDCRService } from "./mn.xdcr.service.js";
import { MnBucketsService } from "./mn.buckets.service.js";
import { MnCollectionsService } from './mn.collections.service.js';

import { MnXDCRAddRefComponent } from "./mn.xdcr.add.ref.component.js";
import { MnXDCRAddRepComponent } from "./mn.xdcr.add.rep.component.js";
import { MnXDCRAddRepScopeComponent } from "./mn.xdcr.add.rep.scope.component.js";
import { MnXDCRAddRepMappingComponent } from "./mn.xdcr.add.rep.mapping.component.js";
import { MnXDCRDeleteRefComponent } from "./mn.xdcr.delete.ref.component.js";
import { MnXDCRDeleteRepComponent } from "./mn.xdcr.delete.rep.component.js";
import { MnXDCRFilterComponent } from "./mn.xdcr.filter.component.js";
import { MnXDCRSettingsComponent } from "./mn.xdcr.settings.component.js";
import { MnXDCREditRepComponent } from "./mn.xdcr.edit.rep.component.js";
import { MnXDCRErrorsComponent } from "./mn.xdcr.errors.component.js";

import { MnDetailStatsDirective } from "./ajs.upgraded.components.js";

let XDCRState = {
  url: '/replications',
  name: "app.admin.replications",
  data: {
    permissions: "cluster.tasks.read",
    title: "XDCR Replications"
  },
  params: {
    xdcrDetails: {
      array: true,
      dynamic: true
    }
  },
  views: {
    "main@app.admin": {
      component: MnXDCRComponent
    }
  }
};

let AddXDCRState = {
  name: "app.admin.replications.add",
  data: {
    permissions: "cluster.tasks.read",
    title: "Add Replication"
  },
  params: {
    scopesPage: {
      value: {page:1, size:5},
      type: 'json',
      dynamic: true
    },
  },
  views: {
    "main@app.admin": {
      component: MnXDCRAddRepComponent
    }
  }
};

export { MnXDCRModule };

class MnXDCRModule {
  static get annotations() { return [
    new NgModule({
      entryComponents: [
        MnXDCRAddRefComponent,
        MnXDCRDeleteRefComponent,
        MnXDCRDeleteRepComponent,
        MnXDCREditRepComponent,
        MnXDCRErrorsComponent
      ],
      declarations: [
        MnDetailStatsDirective,

        MnXDCRComponent,
        MnXDCRItemComponent,
        MnXDCRItemDetailsComponent,
        MnXDCRRefItemComponent,
        MnXDCRAddRefComponent,
        MnXDCRAddRepComponent,
        MnXDCRAddRepMappingComponent,
        MnXDCRAddRepScopeComponent,
        MnXDCRDeleteRefComponent,
        MnXDCRDeleteRepComponent,
        MnXDCREditRepComponent,
        MnXDCRSettingsComponent,
        MnXDCRFilterComponent,
        MnXDCRErrorsComponent,
        MnReplicationStatus
      ],
      imports: [
        MnInputFilterModule,
        NgbModule,
        MnElementCraneModule,
        ReactiveFormsModule,
        MnSharedModule,
        UIRouterModule.forChild({ states: [XDCRState, AddXDCRState] })
      ],
      providers: [
        MnXDCRService,
        MnBucketsService,
        MnCollectionsService
      ]
    })
  ]}
}
