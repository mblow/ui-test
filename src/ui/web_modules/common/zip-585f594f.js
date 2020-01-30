import{_ as t}from"./tslib.es6-1ce727b1.js";function e(t){return"function"==typeof t}var r=!1,n={Promise:void 0,set useDeprecatedSynchronousErrorHandling(t){t&&(new Error).stack;r=t},get useDeprecatedSynchronousErrorHandling(){return r}};function i(t){setTimeout((function(){throw t}),0)}var o={closed:!0,next:function(t){},error:function(t){if(n.useDeprecatedSynchronousErrorHandling)throw t;i(t)},complete:function(){}},s=function(){return Array.isArray||function(t){return t&&"number"==typeof t.length}}();function u(t){return null!==t&&"object"==typeof t}var c=function(){function t(t){return Error.call(this),this.message=t?t.length+" errors occurred during unsubscription:\n"+t.map((function(t,e){return e+1+") "+t.toString()})).join("\n  "):"",this.name="UnsubscriptionError",this.errors=t,this}return t.prototype=Object.create(Error.prototype),t}(),h=function(){function t(t){this.closed=!1,this._parentOrParents=null,this._subscriptions=null,t&&(this._unsubscribe=t)}return t.prototype.unsubscribe=function(){var r;if(!this.closed){var n=this._parentOrParents,i=this._unsubscribe,o=this._subscriptions;if(this.closed=!0,this._parentOrParents=null,this._subscriptions=null,n instanceof t)n.remove(this);else if(null!==n)for(var h=0;h<n.length;++h){n[h].remove(this)}if(e(i))try{i.call(this)}catch(t){r=t instanceof c?a(t.errors):[t]}if(s(o)){h=-1;for(var l=o.length;++h<l;){var p=o[h];if(u(p))try{p.unsubscribe()}catch(t){r=r||[],t instanceof c?r=r.concat(a(t.errors)):r.push(t)}}}if(r)throw new c(r)}},t.prototype.add=function(e){var r=e;if(!e)return t.EMPTY;switch(typeof e){case"function":r=new t(e);case"object":if(r===this||r.closed||"function"!=typeof r.unsubscribe)return r;if(this.closed)return r.unsubscribe(),r;if(!(r instanceof t)){var n=r;(r=new t)._subscriptions=[n]}break;default:throw new Error("unrecognized teardown "+e+" added to Subscription.")}var i=r._parentOrParents;if(null===i)r._parentOrParents=this;else if(i instanceof t){if(i===this)return r;r._parentOrParents=[i,this]}else{if(-1!==i.indexOf(this))return r;i.push(this)}var o=this._subscriptions;return null===o?this._subscriptions=[r]:o.push(r),r},t.prototype.remove=function(t){var e=this._subscriptions;if(e){var r=e.indexOf(t);-1!==r&&e.splice(r,1)}},t.EMPTY=function(t){return t.closed=!0,t}(new t),t}();function a(t){return t.reduce((function(t,e){return t.concat(e instanceof c?e.errors:e)}),[])}var l=function(){return"function"==typeof Symbol?Symbol("rxSubscriber"):"@@rxSubscriber_"+Math.random()}(),p=function(e){function r(t,n,i){var s=e.call(this)||this;switch(s.syncErrorValue=null,s.syncErrorThrown=!1,s.syncErrorThrowable=!1,s.isStopped=!1,arguments.length){case 0:s.destination=o;break;case 1:if(!t){s.destination=o;break}if("object"==typeof t){t instanceof r?(s.syncErrorThrowable=t.syncErrorThrowable,s.destination=t,t.add(s)):(s.syncErrorThrowable=!0,s.destination=new f(s,t));break}default:s.syncErrorThrowable=!0,s.destination=new f(s,t,n,i)}return s}return t(r,e),r.prototype[l]=function(){return this},r.create=function(t,e,n){var i=new r(t,e,n);return i.syncErrorThrowable=!1,i},r.prototype.next=function(t){this.isStopped||this._next(t)},r.prototype.error=function(t){this.isStopped||(this.isStopped=!0,this._error(t))},r.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},r.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this))},r.prototype._next=function(t){this.destination.next(t)},r.prototype._error=function(t){this.destination.error(t),this.unsubscribe()},r.prototype._complete=function(){this.destination.complete(),this.unsubscribe()},r.prototype._unsubscribeAndRecycle=function(){var t=this._parentOrParents;return this._parentOrParents=null,this.unsubscribe(),this.closed=!1,this.isStopped=!1,this._parentOrParents=t,this},r}(h),f=function(r){function s(t,n,i,s){var u,c=r.call(this)||this;c._parentSubscriber=t;var h=c;return e(n)?u=n:n&&(u=n.next,i=n.error,s=n.complete,n!==o&&(e((h=Object.create(n)).unsubscribe)&&c.add(h.unsubscribe.bind(h)),h.unsubscribe=c.unsubscribe.bind(c))),c._context=h,c._next=u,c._error=i,c._complete=s,c}return t(s,r),s.prototype.next=function(t){if(!this.isStopped&&this._next){var e=this._parentSubscriber;n.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?this.__tryOrSetError(e,this._next,t)&&this.unsubscribe():this.__tryOrUnsub(this._next,t)}},s.prototype.error=function(t){if(!this.isStopped){var e=this._parentSubscriber,r=n.useDeprecatedSynchronousErrorHandling;if(this._error)r&&e.syncErrorThrowable?(this.__tryOrSetError(e,this._error,t),this.unsubscribe()):(this.__tryOrUnsub(this._error,t),this.unsubscribe());else if(e.syncErrorThrowable)r?(e.syncErrorValue=t,e.syncErrorThrown=!0):i(t),this.unsubscribe();else{if(this.unsubscribe(),r)throw t;i(t)}}},s.prototype.complete=function(){var t=this;if(!this.isStopped){var e=this._parentSubscriber;if(this._complete){var r=function(){return t._complete.call(t._context)};n.useDeprecatedSynchronousErrorHandling&&e.syncErrorThrowable?(this.__tryOrSetError(e,r),this.unsubscribe()):(this.__tryOrUnsub(r),this.unsubscribe())}else this.unsubscribe()}},s.prototype.__tryOrUnsub=function(t,e){try{t.call(this._context,e)}catch(t){if(this.unsubscribe(),n.useDeprecatedSynchronousErrorHandling)throw t;i(t)}},s.prototype.__tryOrSetError=function(t,e,r){if(!n.useDeprecatedSynchronousErrorHandling)throw new Error("bad call");try{e.call(this._context,r)}catch(e){return n.useDeprecatedSynchronousErrorHandling?(t.syncErrorValue=e,t.syncErrorThrown=!0,!0):(i(e),!0)}return!1},s.prototype._unsubscribe=function(){var t=this._parentSubscriber;this._context=null,this._parentSubscriber=null,t.unsubscribe()},s}(p);function d(t){for(;t;){var e=t,r=e.closed,n=e.destination,i=e.isStopped;if(r||i)return!1;t=n&&n instanceof p?n:null}return!0}var b=function(){return"function"==typeof Symbol&&Symbol.observable||"@@observable"}();function y(){}function v(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return w(t)}function w(t){return t?1===t.length?t[0]:function(e){return t.reduce((function(t,e){return e(t)}),e)}:y}var _=function(){function t(t){this._isScalar=!1,t&&(this._subscribe=t)}return t.prototype.lift=function(e){var r=new t;return r.source=this,r.operator=e,r},t.prototype.subscribe=function(t,e,r){var i=this.operator,s=function(t,e,r){if(t){if(t instanceof p)return t;if(t[l])return t[l]()}return t||e||r?new p(t,e,r):new p(o)}(t,e,r);if(i?s.add(i.call(s,this.source)):s.add(this.source||n.useDeprecatedSynchronousErrorHandling&&!s.syncErrorThrowable?this._subscribe(s):this._trySubscribe(s)),n.useDeprecatedSynchronousErrorHandling&&s.syncErrorThrowable&&(s.syncErrorThrowable=!1,s.syncErrorThrown))throw s.syncErrorValue;return s},t.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(e){n.useDeprecatedSynchronousErrorHandling&&(t.syncErrorThrown=!0,t.syncErrorValue=e),d(t)?t.error(e):console.warn(e)}},t.prototype.forEach=function(t,e){var r=this;return new(e=m(e))((function(e,n){var i;i=r.subscribe((function(e){try{t(e)}catch(t){n(t),i&&i.unsubscribe()}}),n,e)}))},t.prototype._subscribe=function(t){var e=this.source;return e&&e.subscribe(t)},t.prototype[b]=function(){return this},t.prototype.pipe=function(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return 0===t.length?this:w(t)(this)},t.prototype.toPromise=function(t){var e=this;return new(t=m(t))((function(t,r){var n;e.subscribe((function(t){return n=t}),(function(t){return r(t)}),(function(){return t(n)}))}))},t.create=function(e){return new t(e)},t}();function m(t){if(t||(t=n.Promise||Promise),!t)throw new Error("no Promise impl found");return t}var g=function(){function t(){return Error.call(this),this.message="object unsubscribed",this.name="ObjectUnsubscribedError",this}return t.prototype=Object.create(Error.prototype),t}(),x=function(e){function r(t,r){var n=e.call(this)||this;return n.subject=t,n.subscriber=r,n.closed=!1,n}return t(r,e),r.prototype.unsubscribe=function(){if(!this.closed){this.closed=!0;var t=this.subject,e=t.observers;if(this.subject=null,e&&0!==e.length&&!t.isStopped&&!t.closed){var r=e.indexOf(this.subscriber);-1!==r&&e.splice(r,1)}}},r}(h),S=function(e){function r(t){var r=e.call(this,t)||this;return r.destination=t,r}return t(r,e),r}(p),E=function(e){function r(){var t=e.call(this)||this;return t.observers=[],t.closed=!1,t.isStopped=!1,t.hasError=!1,t.thrownError=null,t}return t(r,e),r.prototype[l]=function(){return new S(this)},r.prototype.lift=function(t){var e=new T(this,this);return e.operator=t,e},r.prototype.next=function(t){if(this.closed)throw new g;if(!this.isStopped)for(var e=this.observers,r=e.length,n=e.slice(),i=0;i<r;i++)n[i].next(t)},r.prototype.error=function(t){if(this.closed)throw new g;this.hasError=!0,this.thrownError=t,this.isStopped=!0;for(var e=this.observers,r=e.length,n=e.slice(),i=0;i<r;i++)n[i].error(t);this.observers.length=0},r.prototype.complete=function(){if(this.closed)throw new g;this.isStopped=!0;for(var t=this.observers,e=t.length,r=t.slice(),n=0;n<e;n++)r[n].complete();this.observers.length=0},r.prototype.unsubscribe=function(){this.isStopped=!0,this.closed=!0,this.observers=null},r.prototype._trySubscribe=function(t){if(this.closed)throw new g;return e.prototype._trySubscribe.call(this,t)},r.prototype._subscribe=function(t){if(this.closed)throw new g;return this.hasError?(t.error(this.thrownError),h.EMPTY):this.isStopped?(t.complete(),h.EMPTY):(this.observers.push(t),new x(this,t))},r.prototype.asObservable=function(){var t=new _;return t.source=this,t},r.create=function(t,e){return new T(t,e)},r}(_),T=function(e){function r(t,r){var n=e.call(this)||this;return n.destination=t,n.source=r,n}return t(r,e),r.prototype.next=function(t){var e=this.destination;e&&e.next&&e.next(t)},r.prototype.error=function(t){var e=this.destination;e&&e.error&&this.destination.error(t)},r.prototype.complete=function(){var t=this.destination;t&&t.complete&&this.destination.complete()},r.prototype._subscribe=function(t){return this.source?this.source.subscribe(t):h.EMPTY},r}(E);function I(){return function(t){return t.lift(new N(t))}}var N=function(){function t(t){this.connectable=t}return t.prototype.call=function(t,e){var r=this.connectable;r._refCount++;var n=new j(t,r),i=e.subscribe(n);return n.closed||(n.connection=r.connect()),i},t}(),j=function(e){function r(t,r){var n=e.call(this,t)||this;return n.connectable=r,n}return t(r,e),r.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var e=t._refCount;if(e<=0)this.connection=null;else if(t._refCount=e-1,e>1)this.connection=null;else{var r=this.connection,n=t._connection;this.connection=null,!n||r&&n!==r||n.unsubscribe()}}else this.connection=null},r}(p),C=function(e){function r(t,r){var n=e.call(this)||this;return n.source=t,n.subjectFactory=r,n._refCount=0,n._isComplete=!1,n}return t(r,e),r.prototype._subscribe=function(t){return this.getSubject().subscribe(t)},r.prototype.getSubject=function(){var t=this._subject;return t&&!t.isStopped||(this._subject=this.subjectFactory()),this._subject},r.prototype.connect=function(){var t=this._connection;return t||(this._isComplete=!1,(t=this._connection=new h).add(this.source.subscribe(new P(this.getSubject(),this))),t.closed&&(this._connection=null,t=h.EMPTY)),t},r.prototype.refCount=function(){return I()(this)},r}(_),O=function(){var t=C.prototype;return{operator:{value:null},_refCount:{value:0,writable:!0},_subject:{value:null,writable:!0},_connection:{value:null,writable:!0},_subscribe:{value:t._subscribe},_isComplete:{value:t._isComplete,writable:!0},getSubject:{value:t.getSubject},connect:{value:t.connect},refCount:{value:t.refCount}}}(),P=function(e){function r(t,r){var n=e.call(this,t)||this;return n.connectable=r,n}return t(r,e),r.prototype._error=function(t){this._unsubscribe(),e.prototype._error.call(this,t)},r.prototype._complete=function(){this.connectable._isComplete=!0,this._unsubscribe(),e.prototype._complete.call(this)},r.prototype._unsubscribe=function(){var t=this.connectable;if(t){this.connectable=null;var e=t._connection;t._refCount=0,t._subject=null,t._connection=null,e&&e.unsubscribe()}},r}(S);function k(t,e,r,n){return function(i){return i.lift(new A(t,e,r,n))}}var A=function(){function t(t,e,r,n){this.keySelector=t,this.elementSelector=e,this.durationSelector=r,this.subjectSelector=n}return t.prototype.call=function(t,e){return e.subscribe(new V(t,this.keySelector,this.elementSelector,this.durationSelector,this.subjectSelector))},t}(),V=function(e){function r(t,r,n,i,o){var s=e.call(this,t)||this;return s.keySelector=r,s.elementSelector=n,s.durationSelector=i,s.subjectSelector=o,s.groups=null,s.attemptedToUnsubscribe=!1,s.count=0,s}return t(r,e),r.prototype._next=function(t){var e;try{e=this.keySelector(t)}catch(t){return void this.error(t)}this._group(t,e)},r.prototype._group=function(t,e){var r=this.groups;r||(r=this.groups=new Map);var n,i=r.get(e);if(this.elementSelector)try{n=this.elementSelector(t)}catch(t){this.error(t)}else n=t;if(!i){i=this.subjectSelector?this.subjectSelector():new E,r.set(e,i);var o=new M(e,i,this);if(this.destination.next(o),this.durationSelector){var s=void 0;try{s=this.durationSelector(new M(e,i))}catch(t){return void this.error(t)}this.add(s.subscribe(new Y(e,i,this)))}}i.closed||i.next(n)},r.prototype._error=function(t){var e=this.groups;e&&(e.forEach((function(e,r){e.error(t)})),e.clear()),this.destination.error(t)},r.prototype._complete=function(){var t=this.groups;t&&(t.forEach((function(t,e){t.complete()})),t.clear()),this.destination.complete()},r.prototype.removeGroup=function(t){this.groups.delete(t)},r.prototype.unsubscribe=function(){this.closed||(this.attemptedToUnsubscribe=!0,0===this.count&&e.prototype.unsubscribe.call(this))},r}(p),Y=function(e){function r(t,r,n){var i=e.call(this,r)||this;return i.key=t,i.group=r,i.parent=n,i}return t(r,e),r.prototype._next=function(t){this.complete()},r.prototype._unsubscribe=function(){var t=this.parent,e=this.key;this.key=this.parent=null,t&&t.removeGroup(e)},r}(p),M=function(e){function r(t,r,n){var i=e.call(this)||this;return i.key=t,i.groupSubject=r,i.refCountSubscription=n,i}return t(r,e),r.prototype._subscribe=function(t){var e=new h,r=this.refCountSubscription,n=this.groupSubject;return r&&!r.closed&&e.add(new F(r)),e.add(n.subscribe(t)),e},r}(_),F=function(e){function r(t){var r=e.call(this)||this;return r.parent=t,t.count++,r}return t(r,e),r.prototype.unsubscribe=function(){var t=this.parent;t.closed||this.closed||(e.prototype.unsubscribe.call(this),t.count-=1,0===t.count&&t.attemptedToUnsubscribe&&t.unsubscribe())},r}(h),D=function(e){function r(t){var r=e.call(this)||this;return r._value=t,r}return t(r,e),Object.defineProperty(r.prototype,"value",{get:function(){return this.getValue()},enumerable:!0,configurable:!0}),r.prototype._subscribe=function(t){var r=e.prototype._subscribe.call(this,t);return r&&!r.closed&&t.next(this._value),r},r.prototype.getValue=function(){if(this.hasError)throw this.thrownError;if(this.closed)throw new g;return this._value},r.prototype.next=function(t){e.prototype.next.call(this,this._value=t)},r}(E),H=function(e){function r(t,r){var n=e.call(this,t,r)||this;return n.scheduler=t,n.work=r,n.pending=!1,n}return t(r,e),r.prototype.schedule=function(t,e){if(void 0===e&&(e=0),this.closed)return this;this.state=t;var r=this.id,n=this.scheduler;return null!=r&&(this.id=this.recycleAsyncId(n,r,e)),this.pending=!0,this.delay=e,this.id=this.id||this.requestAsyncId(n,this.id,e),this},r.prototype.requestAsyncId=function(t,e,r){return void 0===r&&(r=0),setInterval(t.flush.bind(t,this),r)},r.prototype.recycleAsyncId=function(t,e,r){if(void 0===r&&(r=0),null!==r&&this.delay===r&&!1===this.pending)return e;clearInterval(e)},r.prototype.execute=function(t,e){if(this.closed)return new Error("executing a cancelled action");this.pending=!1;var r=this._execute(t,e);if(r)return r;!1===this.pending&&null!=this.id&&(this.id=this.recycleAsyncId(this.scheduler,this.id,null))},r.prototype._execute=function(t,e){var r=!1,n=void 0;try{this.work(t)}catch(t){r=!0,n=!!t&&t||new Error(t)}if(r)return this.unsubscribe(),n},r.prototype._unsubscribe=function(){var t=this.id,e=this.scheduler,r=e.actions,n=r.indexOf(this);this.work=null,this.state=null,this.pending=!1,this.scheduler=null,-1!==n&&r.splice(n,1),null!=t&&(this.id=this.recycleAsyncId(e,t,null)),this.delay=null},r}(function(e){function r(t,r){return e.call(this)||this}return t(r,e),r.prototype.schedule=function(t,e){return this},r}(h)),R=function(e){function r(t,r){var n=e.call(this,t,r)||this;return n.scheduler=t,n.work=r,n}return t(r,e),r.prototype.schedule=function(t,r){return void 0===r&&(r=0),r>0?e.prototype.schedule.call(this,t,r):(this.delay=r,this.state=t,this.scheduler.flush(this),this)},r.prototype.execute=function(t,r){return r>0||this.closed?e.prototype.execute.call(this,t,r):this._execute(t,r)},r.prototype.requestAsyncId=function(t,r,n){return void 0===n&&(n=0),null!==n&&n>0||null===n&&this.delay>0?e.prototype.requestAsyncId.call(this,t,r,n):t.flush(this)},r}(H),U=function(){function t(e,r){void 0===r&&(r=t.now),this.SchedulerAction=e,this.now=r}return t.prototype.schedule=function(t,e,r){return void 0===e&&(e=0),new this.SchedulerAction(this,t).schedule(r,e)},t.now=function(){return Date.now()},t}(),q=function(e){function r(t,n){void 0===n&&(n=U.now);var i=e.call(this,t,(function(){return r.delegate&&r.delegate!==i?r.delegate.now():n()}))||this;return i.actions=[],i.active=!1,i.scheduled=void 0,i}return t(r,e),r.prototype.schedule=function(t,n,i){return void 0===n&&(n=0),r.delegate&&r.delegate!==this?r.delegate.schedule(t,n,i):e.prototype.schedule.call(this,t,n,i)},r.prototype.flush=function(t){var e=this.actions;if(this.active)e.push(t);else{var r;this.active=!0;do{if(r=t.execute(t.state,t.delay))break}while(t=e.shift());if(this.active=!1,r){for(;t=e.shift();)t.unsubscribe();throw r}}},r}(U),W=new(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t(r,e),r}(q))(R),G=new _((function(t){return t.complete()}));function z(t){return t?function(t){return new _((function(e){return t.schedule((function(){return e.complete()}))}))}(t):G}function B(t){return t&&"function"==typeof t.schedule}var J,K=function(t){return function(e){for(var r=0,n=t.length;r<n&&!e.closed;r++)e.next(t[r]);e.complete()}};function L(t,e){return new _((function(r){var n=new h,i=0;return n.add(e.schedule((function(){i!==t.length?(r.next(t[i++]),r.closed||n.add(this.schedule())):r.complete()}))),n}))}function Q(t,e){return e?L(t,e):new _(K(t))}function X(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=t[t.length-1];return B(r)?(t.pop(),L(t,r)):Q(t)}function Z(t,e){return new _(e?function(r){return e.schedule($,0,{error:t,subscriber:r})}:function(e){return e.error(t)})}function $(t){var e=t.error;t.subscriber.error(e)}J||(J={});var tt=function(){function t(t,e,r){this.kind=t,this.value=e,this.error=r,this.hasValue="N"===t}return t.prototype.observe=function(t){switch(this.kind){case"N":return t.next&&t.next(this.value);case"E":return t.error&&t.error(this.error);case"C":return t.complete&&t.complete()}},t.prototype.do=function(t,e,r){switch(this.kind){case"N":return t&&t(this.value);case"E":return e&&e(this.error);case"C":return r&&r()}},t.prototype.accept=function(t,e,r){return t&&"function"==typeof t.next?this.observe(t):this.do(t,e,r)},t.prototype.toObservable=function(){switch(this.kind){case"N":return X(this.value);case"E":return Z(this.error);case"C":return z()}throw new Error("unexpected notification kind value")},t.createNext=function(e){return void 0!==e?new t("N",e):t.undefinedValueNotification},t.createError=function(e){return new t("E",void 0,e)},t.createComplete=function(){return t.completeNotification},t.completeNotification=new t("C"),t.undefinedValueNotification=new t("N",void 0),t}();function et(t,e){return void 0===e&&(e=0),function(r){return r.lift(new rt(t,e))}}var rt=function(){function t(t,e){void 0===e&&(e=0),this.scheduler=t,this.delay=e}return t.prototype.call=function(t,e){return e.subscribe(new nt(t,this.scheduler,this.delay))},t}(),nt=function(e){function r(t,r,n){void 0===n&&(n=0);var i=e.call(this,t)||this;return i.scheduler=r,i.delay=n,i}return t(r,e),r.dispatch=function(t){var e=t.notification,r=t.destination;e.observe(r),this.unsubscribe()},r.prototype.scheduleMessage=function(t){this.destination.add(this.scheduler.schedule(r.dispatch,this.delay,new it(t,this.destination)))},r.prototype._next=function(t){this.scheduleMessage(tt.createNext(t))},r.prototype._error=function(t){this.scheduleMessage(tt.createError(t)),this.unsubscribe()},r.prototype._complete=function(){this.scheduleMessage(tt.createComplete()),this.unsubscribe()},r}(p),it=function(){return function(t,e){this.notification=t,this.destination=e}}(),ot=function(e){function r(t,r,n){void 0===t&&(t=Number.POSITIVE_INFINITY),void 0===r&&(r=Number.POSITIVE_INFINITY);var i=e.call(this)||this;return i.scheduler=n,i._events=[],i._infiniteTimeWindow=!1,i._bufferSize=t<1?1:t,i._windowTime=r<1?1:r,r===Number.POSITIVE_INFINITY?(i._infiniteTimeWindow=!0,i.next=i.nextInfiniteTimeWindow):i.next=i.nextTimeWindow,i}return t(r,e),r.prototype.nextInfiniteTimeWindow=function(t){var r=this._events;r.push(t),r.length>this._bufferSize&&r.shift(),e.prototype.next.call(this,t)},r.prototype.nextTimeWindow=function(t){this._events.push(new st(this._getNow(),t)),this._trimBufferThenGetEvents(),e.prototype.next.call(this,t)},r.prototype._subscribe=function(t){var e,r=this._infiniteTimeWindow,n=r?this._events:this._trimBufferThenGetEvents(),i=this.scheduler,o=n.length;if(this.closed)throw new g;if(this.isStopped||this.hasError?e=h.EMPTY:(this.observers.push(t),e=new x(this,t)),i&&t.add(t=new nt(t,i)),r)for(var s=0;s<o&&!t.closed;s++)t.next(n[s]);else for(s=0;s<o&&!t.closed;s++)t.next(n[s].value);return this.hasError?t.error(this.thrownError):this.isStopped&&t.complete(),e},r.prototype._getNow=function(){return(this.scheduler||W).now()},r.prototype._trimBufferThenGetEvents=function(){for(var t=this._getNow(),e=this._bufferSize,r=this._windowTime,n=this._events,i=n.length,o=0;o<i&&!(t-n[o].time<r);)o++;return i>e&&(o=Math.max(o,i-e)),o>0&&n.splice(0,o),n},r}(E),st=function(){return function(t,e){this.time=t,this.value=e}}(),ut=function(e){function r(){var t=null!==e&&e.apply(this,arguments)||this;return t.value=null,t.hasNext=!1,t.hasCompleted=!1,t}return t(r,e),r.prototype._subscribe=function(t){return this.hasError?(t.error(this.thrownError),h.EMPTY):this.hasCompleted&&this.hasNext?(t.next(this.value),t.complete(),h.EMPTY):e.prototype._subscribe.call(this,t)},r.prototype.next=function(t){this.hasCompleted||(this.value=t,this.hasNext=!0)},r.prototype.error=function(t){this.hasCompleted||e.prototype.error.call(this,t)},r.prototype.complete=function(){this.hasCompleted=!0,this.hasNext&&e.prototype.next.call(this,this.value),e.prototype.complete.call(this)},r}(E),ct=1,ht={};var at=function(t){var e=ct++;return ht[e]=t,Promise.resolve().then((function(){return function(t){var e=ht[t];e&&e()}(e)})),e},lt=function(t){delete ht[t]},pt=function(e){function r(t,r){var n=e.call(this,t,r)||this;return n.scheduler=t,n.work=r,n}return t(r,e),r.prototype.requestAsyncId=function(t,r,n){return void 0===n&&(n=0),null!==n&&n>0?e.prototype.requestAsyncId.call(this,t,r,n):(t.actions.push(this),t.scheduled||(t.scheduled=at(t.flush.bind(t,null))))},r.prototype.recycleAsyncId=function(t,r,n){if(void 0===n&&(n=0),null!==n&&n>0||null===n&&this.delay>0)return e.prototype.recycleAsyncId.call(this,t,r,n);0===t.actions.length&&(lt(r),t.scheduled=void 0)},r}(H),ft=new(function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t(r,e),r.prototype.flush=function(t){this.active=!0,this.scheduled=void 0;var e,r=this.actions,n=-1,i=r.length;t=t||r.shift();do{if(e=t.execute(t.state,t.delay))break}while(++n<i&&(t=r.shift()));if(this.active=!1,e){for(;++n<i&&(t=r.shift());)t.unsubscribe();throw e}},r}(q))(pt),dt=new q(H);function bt(t){return t}var yt=function(){function t(){return Error.call(this),this.message="argument out of range",this.name="ArgumentOutOfRangeError",this}return t.prototype=Object.create(Error.prototype),t}(),vt=function(){function t(){return Error.call(this),this.message="no elements in sequence",this.name="EmptyError",this}return t.prototype=Object.create(Error.prototype),t}(),wt=function(){function t(){return Error.call(this),this.message="Timeout has occurred",this.name="TimeoutError",this}return t.prototype=Object.create(Error.prototype),t}();function _t(t,e){return function(r){if("function"!=typeof t)throw new TypeError("argument is not a function. Are you looking for `mapTo()`?");return r.lift(new mt(t,e))}}var mt=function(){function t(t,e){this.project=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new gt(t,this.project,this.thisArg))},t}(),gt=function(e){function r(t,r,n){var i=e.call(this,t)||this;return i.project=r,i.count=0,i.thisArg=n||i,i}return t(r,e),r.prototype._next=function(t){var e;try{e=this.project.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}this.destination.next(e)},r}(p),xt=function(e){function r(){return null!==e&&e.apply(this,arguments)||this}return t(r,e),r.prototype.notifyNext=function(t,e,r,n,i){this.destination.next(e)},r.prototype.notifyError=function(t,e){this.destination.error(t)},r.prototype.notifyComplete=function(t){this.destination.complete()},r}(p),St=function(e){function r(t,r,n){var i=e.call(this)||this;return i.parent=t,i.outerValue=r,i.outerIndex=n,i.index=0,i}return t(r,e),r.prototype._next=function(t){this.parent.notifyNext(this.outerValue,t,this.outerIndex,this.index++,this)},r.prototype._error=function(t){this.parent.notifyError(t,this),this.unsubscribe()},r.prototype._complete=function(){this.parent.notifyComplete(this),this.unsubscribe()},r}(p);function Et(){return"function"==typeof Symbol&&Symbol.iterator?Symbol.iterator:"@@iterator"}var Tt=Et(),It=function(t){return t&&"number"==typeof t.length&&"function"!=typeof t};function Nt(t){return!!t&&"function"!=typeof t.subscribe&&"function"==typeof t.then}var jt=function(t){if(t&&"function"==typeof t[b])return n=t,function(t){var e=n[b]();if("function"!=typeof e.subscribe)throw new TypeError("Provided object does not correctly implement Symbol.observable");return e.subscribe(t)};if(It(t))return K(t);if(Nt(t))return r=t,function(t){return r.then((function(e){t.closed||(t.next(e),t.complete())}),(function(e){return t.error(e)})).then(null,i),t};if(t&&"function"==typeof t[Tt])return e=t,function(t){for(var r=e[Tt]();;){var n=r.next();if(n.done){t.complete();break}if(t.next(n.value),t.closed)break}return"function"==typeof r.return&&t.add((function(){r.return&&r.return()})),t};var e,r,n,o=u(t)?"an invalid object":"'"+t+"'";throw new TypeError("You provided "+o+" where a stream was expected. You can provide an Observable, Promise, Array, or Iterable.")};function Ct(t,e,r,n,i){if(void 0===i&&(i=new St(t,r,n)),!i.closed)return e instanceof _?e.subscribe(i):jt(e)(i)}var Ot={};function Pt(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=null,n=null;return B(t[t.length-1])&&(n=t.pop()),"function"==typeof t[t.length-1]&&(r=t.pop()),1===t.length&&s(t[0])&&(t=t[0]),Q(t,n).lift(new kt(r))}var kt=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new At(t,this.resultSelector))},t}(),At=function(e){function r(t,r){var n=e.call(this,t)||this;return n.resultSelector=r,n.active=0,n.values=[],n.observables=[],n}return t(r,e),r.prototype._next=function(t){this.values.push(Ot),this.observables.push(t)},r.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{this.active=e,this.toRespond=e;for(var r=0;r<e;r++){var n=t[r];this.add(Ct(this,n,n,r))}}},r.prototype.notifyComplete=function(t){0==(this.active-=1)&&this.destination.complete()},r.prototype.notifyNext=function(t,e,r,n,i){var o=this.values,s=o[r],u=this.toRespond?s===Ot?--this.toRespond:this.toRespond:0;o[r]=e,0===u&&(this.resultSelector?this._tryResultSelector(o):this.destination.next(o.slice()))},r.prototype._tryResultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(e)},r}(xt);function Vt(t,e){if(null!=t){if(function(t){return t&&"function"==typeof t[b]}(t))return function(t,e){return new _((function(r){var n=new h;return n.add(e.schedule((function(){var i=t[b]();n.add(i.subscribe({next:function(t){n.add(e.schedule((function(){return r.next(t)})))},error:function(t){n.add(e.schedule((function(){return r.error(t)})))},complete:function(){n.add(e.schedule((function(){return r.complete()})))}}))}))),n}))}(t,e);if(Nt(t))return function(t,e){return new _((function(r){var n=new h;return n.add(e.schedule((function(){return t.then((function(t){n.add(e.schedule((function(){r.next(t),n.add(e.schedule((function(){return r.complete()})))})))}),(function(t){n.add(e.schedule((function(){return r.error(t)})))}))}))),n}))}(t,e);if(It(t))return L(t,e);if(function(t){return t&&"function"==typeof t[Tt]}(t)||"string"==typeof t)return function(t,e){if(!t)throw new Error("Iterable cannot be null");return new _((function(r){var n,i=new h;return i.add((function(){n&&"function"==typeof n.return&&n.return()})),i.add(e.schedule((function(){n=t[Tt](),i.add(e.schedule((function(){if(!r.closed){var t,e;try{var i=n.next();t=i.value,e=i.done}catch(t){return void r.error(t)}e?r.complete():(r.next(t),this.schedule())}})))}))),i}))}(t,e)}throw new TypeError((null!==t&&typeof t||t)+" is not observable")}function Yt(t,e){return e?Vt(t,e):t instanceof _?t:new _(jt(t))}function Mt(t,e,r){return void 0===r&&(r=Number.POSITIVE_INFINITY),"function"==typeof e?function(n){return n.pipe(Mt((function(r,n){return Yt(t(r,n)).pipe(_t((function(t,i){return e(r,t,n,i)})))}),r))}:("number"==typeof e&&(r=e),function(e){return e.lift(new Ft(t,r))})}var Ft=function(){function t(t,e){void 0===e&&(e=Number.POSITIVE_INFINITY),this.project=t,this.concurrent=e}return t.prototype.call=function(t,e){return e.subscribe(new Dt(t,this.project,this.concurrent))},t}(),Dt=function(e){function r(t,r,n){void 0===n&&(n=Number.POSITIVE_INFINITY);var i=e.call(this,t)||this;return i.project=r,i.concurrent=n,i.hasCompleted=!1,i.buffer=[],i.active=0,i.index=0,i}return t(r,e),r.prototype._next=function(t){this.active<this.concurrent?this._tryNext(t):this.buffer.push(t)},r.prototype._tryNext=function(t){var e,r=this.index++;try{e=this.project(t,r)}catch(t){return void this.destination.error(t)}this.active++,this._innerSub(e,t,r)},r.prototype._innerSub=function(t,e,r){var n=new St(this,void 0,void 0);this.destination.add(n),Ct(this,t,e,r,n)},r.prototype._complete=function(){this.hasCompleted=!0,0===this.active&&0===this.buffer.length&&this.destination.complete(),this.unsubscribe()},r.prototype.notifyNext=function(t,e,r,n,i){this.destination.next(e)},r.prototype.notifyComplete=function(t){var e=this.buffer;this.remove(t),this.active--,e.length>0?this._next(e.shift()):0===this.active&&this.hasCompleted&&this.destination.complete()},r}(xt);function Ht(t){return void 0===t&&(t=Number.POSITIVE_INFINITY),Mt(bt,t)}function Rt(){return Ht(1)}function Ut(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];return Rt()(X.apply(void 0,t))}function qt(t){return new _((function(e){var r;try{r=t()}catch(t){return void e.error(t)}return(r?Yt(r):z()).subscribe(e)}))}function Wt(t){return!s(t)&&t-parseFloat(t)+1>=0}function Gt(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=Number.POSITIVE_INFINITY,n=null,i=t[t.length-1];return B(i)?(n=t.pop(),t.length>1&&"number"==typeof t[t.length-1]&&(r=t.pop())):"number"==typeof i&&(r=t.pop()),null===n&&1===t.length&&t[0]instanceof _?t[0]:Ht(r)(Q(t,n))}function zt(t,e){function r(){return!r.pred.apply(r.thisArg,arguments)}return r.pred=t,r.thisArg=e,r}function Bt(t,e){return function(r){return r.lift(new Jt(t,e))}}var Jt=function(){function t(t,e){this.predicate=t,this.thisArg=e}return t.prototype.call=function(t,e){return e.subscribe(new Kt(t,this.predicate,this.thisArg))},t}(),Kt=function(e){function r(t,r,n){var i=e.call(this,t)||this;return i.predicate=r,i.thisArg=n,i.count=0,i}return t(r,e),r.prototype._next=function(t){var e;try{e=this.predicate.call(this.thisArg,t,this.count++)}catch(t){return void this.destination.error(t)}e&&this.destination.next(t)},r}(p);function Lt(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];if(1===t.length){if(!s(t[0]))return t[0];t=t[0]}return Q(t,void 0).lift(new Qt)}var Qt=function(){function t(){}return t.prototype.call=function(t,e){return e.subscribe(new Xt(t))},t}(),Xt=function(e){function r(t){var r=e.call(this,t)||this;return r.hasFirst=!1,r.observables=[],r.subscriptions=[],r}return t(r,e),r.prototype._next=function(t){this.observables.push(t)},r.prototype._complete=function(){var t=this.observables,e=t.length;if(0===e)this.destination.complete();else{for(var r=0;r<e&&!this.hasFirst;r++){var n=t[r],i=Ct(this,n,n,r);this.subscriptions&&this.subscriptions.push(i),this.add(i)}this.observables=null}},r.prototype.notifyNext=function(t,e,r,n,i){if(!this.hasFirst){this.hasFirst=!0;for(var o=0;o<this.subscriptions.length;o++)if(o!==r){var s=this.subscriptions[o];s.unsubscribe(),this.remove(s)}this.subscriptions=null}this.destination.next(e)},r}(xt);function Zt(t,e,r){void 0===t&&(t=0);var n=-1;return Wt(e)?n=Number(e)<1?1:Number(e):B(e)&&(r=e),B(r)||(r=dt),new _((function(e){var i=Wt(t)?t:+t-r.now();return r.schedule($t,i,{index:0,period:n,subscriber:e})}))}function $t(t){var e=t.index,r=t.period,n=t.subscriber;if(n.next(e),!n.closed){if(-1===r)return n.complete();t.index=e+1,this.schedule(t,r)}}function te(){for(var t=[],e=0;e<arguments.length;e++)t[e]=arguments[e];var r=t[t.length-1];return"function"==typeof r&&t.pop(),Q(t,void 0).lift(new ee(r))}var ee=function(){function t(t){this.resultSelector=t}return t.prototype.call=function(t,e){return e.subscribe(new re(t,this.resultSelector))},t}(),re=function(e){function r(t,r,n){void 0===n&&(n=Object.create(null));var i=e.call(this,t)||this;return i.iterators=[],i.active=0,i.resultSelector="function"==typeof r?r:null,i.values=n,i}return t(r,e),r.prototype._next=function(t){var e=this.iterators;s(t)?e.push(new ie(t)):"function"==typeof t[Tt]?e.push(new ne(t[Tt]())):e.push(new oe(this.destination,this,t))},r.prototype._complete=function(){var t=this.iterators,e=t.length;if(this.unsubscribe(),0!==e){this.active=e;for(var r=0;r<e;r++){var n=t[r];if(n.stillUnsubscribed)this.destination.add(n.subscribe(n,r));else this.active--}}else this.destination.complete()},r.prototype.notifyInactive=function(){this.active--,0===this.active&&this.destination.complete()},r.prototype.checkIterators=function(){for(var t=this.iterators,e=t.length,r=this.destination,n=0;n<e;n++){if("function"==typeof(s=t[n]).hasValue&&!s.hasValue())return}var i=!1,o=[];for(n=0;n<e;n++){var s,u=(s=t[n]).next();if(s.hasCompleted()&&(i=!0),u.done)return void r.complete();o.push(u.value)}this.resultSelector?this._tryresultSelector(o):r.next(o),i&&r.complete()},r.prototype._tryresultSelector=function(t){var e;try{e=this.resultSelector.apply(this,t)}catch(t){return void this.destination.error(t)}this.destination.next(e)},r}(p),ne=function(){function t(t){this.iterator=t,this.nextResult=t.next()}return t.prototype.hasValue=function(){return!0},t.prototype.next=function(){var t=this.nextResult;return this.nextResult=this.iterator.next(),t},t.prototype.hasCompleted=function(){var t=this.nextResult;return t&&t.done},t}(),ie=function(){function t(t){this.array=t,this.index=0,this.length=0,this.length=t.length}return t.prototype[Tt]=function(){return this},t.prototype.next=function(t){var e=this.index++,r=this.array;return e<this.length?{value:r[e],done:!1}:{value:null,done:!0}},t.prototype.hasValue=function(){return this.array.length>this.index},t.prototype.hasCompleted=function(){return this.array.length===this.index},t}(),oe=function(e){function r(t,r,n){var i=e.call(this,t)||this;return i.parent=r,i.observable=n,i.stillUnsubscribed=!0,i.buffer=[],i.isComplete=!1,i}return t(r,e),r.prototype[Tt]=function(){return this},r.prototype.next=function(){var t=this.buffer;return 0===t.length&&this.isComplete?{value:null,done:!0}:{value:t.shift(),done:!1}},r.prototype.hasValue=function(){return this.buffer.length>0},r.prototype.hasCompleted=function(){return 0===this.buffer.length&&this.isComplete},r.prototype.notifyComplete=function(){this.buffer.length>0?(this.isComplete=!0,this.parent.notifyInactive()):this.destination.complete()},r.prototype.notifyNext=function(t,e,r,n,i){this.buffer.push(e),this.parent.checkIterators()},r.prototype.subscribe=function(t,e){return Ct(this,this.observable,this,e)},r}(xt);export{kt as $,H as A,D as B,C,vt as D,G as E,g as F,M as G,Pt as H,Ut as I,z as J,Gt as K,X as L,Lt as M,tt as N,_ as O,Z as P,Zt as Q,ot as R,h as S,wt as T,c as U,te as V,Vt as W,n as X,Ct as Y,xt as Z,St as _,q as a,Mt as a0,O as a1,I as a2,ee as a3,Rt as a4,k as a5,Ht as a6,et as a7,s as b,ut as c,d,u as e,Yt as f,e as g,bt as h,B as i,qt as j,Wt as k,dt as l,_t as m,y as n,Bt as o,zt as p,b as q,E as r,jt as s,ft as t,W as u,U as v,p as w,J as x,v as y,yt as z};
//# sourceMappingURL=zip-585f594f.js.map
