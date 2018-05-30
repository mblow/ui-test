var mn = mn || {};
mn.services = mn.services || {};
mn.services.MnBuckets = (function () {
  "use strict";

  MnBucketsService.annotations = [
    new ng.core.Injectable()
  ];

  MnBucketsService.parameters = [
    ng.common.http.HttpClient,
    mn.services.MnAdmin
  ];

  MnBucketsService.prototype.get = get;
  MnBucketsService.prototype.getBucketRamGuageConfig = getBucketRamGuageConfig;
  MnBucketsService.prototype.getGuageConfig = getGuageConfig;

  return MnBucketsService;

  function MnBucketsService(http, mnAdminService) {
    this.http = http;
    this.stream = {};

    var bucketsUri =
        mnAdminService
        .stream
        .getPoolsDefault
        .pluck("buckets", "uri")
        .distinctUntilChanged();

    this.stream.bucketsWithTimer =
      bucketsUri
      .combineLatest(Rx.Observable.timer(0, 4000))
      .pluck("0")
      .switchMap(this.get.bind(this))
      .shareReplay(1);

    this.stream.buckets =
      bucketsUri
      .switchMap(this.get.bind(this))
      .shareReplay(1);

  }

  function get(url) {
    return this.http.get(url, {
      params: new ng.common.http.HttpParams()
        .set("basic_stats", true)
        .set("skipMap", true)
    });
  }

  function getBucketRamGuageConfig(ramSummary) {
    if (!ramSummary) {
      return;
    }
    var bucketRamGuageConfig = {};
    bucketRamGuageConfig.topRight = {
      name: 'cluster quota',
      value: ramSummary.total
    };

    bucketRamGuageConfig.items = [{
      name: 'other buckets',
      value: ramSummary.otherBuckets
    }, {
      name: 'this bucket',
      value: ramSummary.thisAlloc
    }];

    bucketRamGuageConfig.bottomLeft = {
      name: 'remaining',
      value: ramSummary.total - ramSummary.otherBuckets - ramSummary.thisAlloc
    };

    if (bucketRamGuageConfig.bottomLeft.value < 0) {
      bucketRamGuageConfig.items[1].value = ramSummary.total - ramSummary.otherBuckets;
      bucketRamGuageConfig.bottomLeft = {
        name: 'overcommitted',
        value: ramSummary.otherBuckets + ramSummary.thisAlloc - ramSummary.total
      };
      bucketRamGuageConfig.topLeft = {
        name: 'total allocated',
        value: ramSummary.otherBuckets + ramSummary.thisAlloc
      };
    }
    return bucketRamGuageConfig;
  }

  function getGuageConfig(summary) {
    var guageConfig = {};

    guageConfig.topRight = {
      name: 'total cluster storage',
      value: summary.total
    };
    guageConfig.items = [{
      name: 'other buckets',
      value: summary.otherBuckets
    }, {
      name: 'this bucket',
      value: summary.thisBucket
    }];

    guageConfig.bottomLeft = {
      name: 'remaining',
      value: summary.total - summary.otherData - summary.thisBucket - summary.otherBuckets
    };

    return guageConfig;
  }

})();
