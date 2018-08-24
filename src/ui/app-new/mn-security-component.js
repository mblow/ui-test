var mn = mn || {};
mn.components = mn.components || {};
mn.components.MnSecurity =
  (function (Rx) {
    "use strict";

    mn.helper.extends(MnSecurity, mn.helper.MnEventableComponent);

    MnSecurity.annotations = [
      new ng.core.Component({
        templateUrl: "app-new/mn-security.html"
      })
    ];

    MnSecurity.parameters = [
      mn.services.MnPermissions,
      mn.services.MnPools,
      mn.services.MnAdmin
    ];

    return MnSecurity;

    function MnSecurity(mnPermissionsService, mnPoolsService, mnAdminService) {
      mn.helper.MnEventableComponent.call(this);

      this.securityRead = mnPermissionsService.createPermissionStream("admin.security!read");
      this.isEnterprise = mnPoolsService.stream.isEnterprise;
      this.atLeast55 = mnAdminService.stream.compatVersion.pipe(Rx.operators.pluck("atLeast55"));
    }

  })(window.rxjs);


var mn = mn || {};
mn.modules = mn.modules || {};
mn.modules.MnSecurity =
  (function () {
    "use strict";

    MnSecurityModule.annotations = [
      new ng.core.NgModule({
        declarations: [
          mn.components.MnUserRoles,
          mn.components.MnUserRolesItem,
          mn.components.MnSearch,
          mn.components.MnSearchField,
          mn.components.MnRootCertificate,
          mn.components.MnLogRedaction
        ],
        imports: [
          window['@uirouter/angular'].UIRouterModule.forChild({
            states: [
              {
                name: "app.admin.security.userRoles",
                url: "/userRoles?openedUsers&startFrom&startFromDomain&{pageSize:int}",
                component: mn.components.MnUserRoles,
                params: {
                  openedUsers: {
                    array: true,
                    dynamic: true
                  },
                  startFrom: {
                    value: null,
                    dynamic: true
                  },
                  startFromDomain: {
                    value: null,
                    dynamic: true
                  },
                  pageSize: {
                    value: 10,
                    dynamic: true
                  }
                },
                // data: {
                //   compat: "atLeast50"
                // }
              }, {
                name: "app.admin.security.rootCertificate",
                url: "/rootCertificate",
                component: mn.components.MnRootCertificate,
                // data: {
                //   enterprise: true
                // }
              }, {
                name: "app.admin.security.logRedaction",
                url: "/redaction",
                component: mn.components.MnLogRedaction,
                // data: {
                // compat: "atLeast55",
                // enterprise: true
                // }
              }
            ]
          }),
          ng.forms.ReactiveFormsModule,
          mn.modules.MnShared,
          mn.modules.MnElementModule,
          mn.modules.MnPipesModule,
          ng.platformBrowser.BrowserModule,
          ngb.NgbModule,
          // ng.platformBrowser.animations.BrowserAnimationsModule
        ],
        providers: [
          mn.services.MnSecurity,
          mn.services.MnUserRoles
        ],
        entryComponents: [
          // mn.components.MnBucketsDialog
        ]
      })
    ];

    return MnSecurityModule;

    function MnSecurityModule() {
    }
  })();
