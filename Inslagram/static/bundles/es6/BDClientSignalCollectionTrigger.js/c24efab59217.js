__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'BDClientSignalCollectionTrigger'
      , n = 'bdc_end_timestamp'
      , l = 'bdc_event'
      , o = a(d[0]).uuid()
      , s = i(d[1]).get();
    let c, C, S = !1, D = null, B = 5;
    class T {
        static async startSignalCollection(n, D) {
            if (null != n && s.setSID(n.sid),
            !D && (c = n,
            r(d[2]).BDClientSignalLogger.setAsid(o),
            T.isBdChallengeCompletionPending())) {
                const n = a(d[0]).getEventFromStorage(l, t);
                if (n)
                    return void T.startChallengeBasedSignalCollection(n)
            }
            if (!S && null != n) {
                if (S = !0,
                i(d[3]).parseConfig(n),
                !s.isParsingDone())
                    return i(d[4]).logError(t, r(d[5]).OPERATIONS.PARSE_CONFIG_ERROR, {
                        config: JSON.stringify(n)
                    }),
                    void (S = !1);
                r(d[6]).BDHeartbeatSignalCollectionManager.startHeartbeatDelayed(),
                C = new Promise((n,l)=>{
                    try {
                        s.getClientReputationTier() !== i(d[7]).BENIGN_IGNORE && (s.getDynamicSignals().length > 0 && (r(d[8]).BDPeriodicSignalsCollectionManager.collectDynamicSignals(),
                        i(d[4]).logInfo(t, r(d[5]).OPERATIONS.DYNAMIC_SIGNAL_COLLECTION_STARTED, {
                            ts: Date.now().toString()
                        })),
                        s.getBiometricSignals().length > 0 && (r(d[8]).BDPeriodicSignalsCollectionManager.collectBiometricSignals(),
                        i(d[4]).logInfo(t, r(d[5]).OPERATIONS.BIOMETRIC_SIGNAL_COLLECTION_STARTED, {
                            ts: Date.now().toString()
                        }))),
                        n()
                    } catch (t) {
                        l(t)
                    }
                }
                ),
                s.getClientReputationTier() !== i(d[7]).BENIGN_IGNORE && (await C,
                await r(d[8]).BDPeriodicSignalsCollectionManager.startSignalPosting())
            }
            S && !r(d[6]).BDHeartbeatSignalCollectionManager.isHeartbeatStarted() && !r(d[6]).BDHeartbeatSignalCollectionManager.isHeartbeatDelayed() && B > 0 && (B -= 1,
            i(d[4]).logWarning(t, r(d[5]).OPERATIONS.TRY_RESTARTING_HB),
            r(d[6]).BDHeartbeatSignalCollectionManager.startHeartbeatDelayed())
        }
        static isBdChallengeCompletionPending() {
            return a(d[0]).getTimestampFromStorage(n, t) > Date.now()
        }
        static async handleBdChallenge(t) {
            T.persistBdChallengeEvent(t),
            await C,
            await r(d[8]).BDPeriodicSignalsCollectionManager.postSignals([i(d[9]).DYNAMIC, i(d[9]).BIOMETRIC, i(d[9]).STATIC]),
            T.stopSignalCollection(),
            T.stopBdChallengeBasedCollectionTimer(),
            r(d[8]).BDPeriodicSignalsCollectionManager.resetPeriodicCollectionTimestamp(),
            r(d[6]).BDHeartbeatSignalCollectionManager.resetHeartbeatCollectionTimestamp(),
            T.startChallengeBasedSignalCollection(t)
        }
        static async startChallengeBasedSignalCollection(l) {
            const o = T.getSignalCollectionConfig(l);
            r(d[2]).BDClientSignalLogger.setAsid(l.challenge_id),
            T.startSignalCollection(o, !0);
            const s = a(d[0]).getTimestampFromStorage(n, t) - Date.now();
            D = window.setTimeout(()=>{
                T.stopSignalCollection(),
                T.startSignalCollection(c, !1)
            }
            , s)
        }
        static getSignalCollectionConfig(t) {
            if (null != t.config && '' !== t.config) {
                const n = JSON.parse(t.config);
                return n.sid = s.sid,
                n.rt = s.getClientReputationTier(),
                n.getHeartbeatVersion = s.getHeartbeatVersion(),
                n
            }
            return r(d[10]).getBdChallengeDefaultConfig(s.sid, s.getClientReputationTier(), s.getHeartbeatVersion())
        }
        static persistBdChallengeEvent(o) {
            var s, c;
            const C = a(d[0]).getEventFromStorage(l, t)
              , S = a(d[0]).getTimestampFromStorage(n, t)
              , D = null != C && C.challenge_id === o.challenge_id
              , B = Date.now() + (null !== (s = null === (c = T.getSignalCollectionConfig(o)) || void 0 === c ? void 0 : c.ctw) && void 0 !== s ? s : r(d[10]).DEFAULT_BD_CHALLENGE_TIME_WINDOW_HOURS) * a(d[0]).MILLISECONDS_IN_HOUR;
            D || a(d[0]).setEventInStorage(o, l, t),
            D && 0 !== S || a(d[0]).setTimestampInStorage(B, n, t)
        }
        static stopSignalCollection() {
            r(d[6]).BDHeartbeatSignalCollectionManager.stopHeartbeat(),
            r(d[8]).BDPeriodicSignalsCollectionManager.stopDynamicSignalCollection(),
            r(d[8]).BDPeriodicSignalsCollectionManager.stopSignalPosting(),
            S = !1
        }
        static stopBdChallengeBasedCollectionTimer() {
            null != D && window.clearTimeout(D)
        }
        static resetStartedForTest() {
            S = !1
        }
    }
    e.BDClientSignalCollectionTrigger = T
}, 3407872, [3407873, 3407879, 3407921, 3407924, 3407874, 3407878, 3407926, 3407880, 3407927, 3407929, 3407931]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    function t(t, n, o) {
        const x = i(d[0]).getLocalStorage();
        if (!x)
            return void i(d[1]).logWarning(o, r(d[2]).OPERATIONS.GET_LOCAL_STORAGE_ERROR);
        const u = i(d[0]).setItemGuarded(x, n, t);
        null != u && i(d[1]).logWarning(o, r(d[2]).OPERATIONS.WEB_STORAGE, {
            error: u.message
        })
    }
    function n(t, n) {
        const o = i(d[0]).getLocalStorage();
        return o ? o.getItem(t) : (i(d[1]).logWarning(n, r(d[2]).OPERATIONS.GET_LOCAL_STORAGE_ERROR),
        null)
    }
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    e.MILLISECONDS_IN_HOUR = 36e5,
    e.uuid = function() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, t=>{
            const n = 16 * Math.random() | 0;
            return ('x' === t ? n : 3 & n | 8).toString(16)
        }
        )
    }
    ,
    e.setEventInStorage = function(n, o, x) {
        t(JSON.stringify(n), o, x)
    }
    ,
    e.setTimestampInStorage = function(n, o, x) {
        t(n.toString(), o, x)
    }
    ,
    e.getEventFromStorage = function(t, o) {
        const x = n(t, o);
        return null != x && '' !== x ? JSON.parse(x) : null
    }
    ,
    e.getTimestampFromStorage = function(t, o) {
        const x = n(t, o);
        if (null == x)
            return 0;
        const u = Number.parseInt(x, 10);
        return Number.isFinite(u) ? u : 0
    }
}, 3407873, [12517450, 3407874, 3407878]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const o = {
        logInfo(O, n, l, E) {
            o.log(O, i(d[0]).INFO, n, l, E)
        },
        logWarning(O, n, l, E) {
            o.log(O, i(d[0]).WARNING, n, l, E)
        },
        logError(O, n, l, E) {
            o.log(O, i(d[0]).ERROR, n, l, E)
        },
        log(O, n, l, E={}, t) {
            if (r(d[1]).coinflip(o.getFlipSamplingByOperation(l))) {
                if (null === E)
                    throw new Error('opeartion info null');
                E.source = O,
                i(d[2]).log(()=>({
                    operation: l,
                    level: n,
                    component: i(d[3]).IG_JS,
                    operation_info: E,
                    duration_us: t
                }))
            }
        },
        getFlipSamplingByOperation(o) {
            switch (o) {
            case r(d[4]).OPERATIONS.APPEND_SIGNAL:
            case r(d[4]).OPERATIONS.HB_COLLECTED:
            case r(d[4]).OPERATIONS.GET_LOCAL_STORAGE_ERROR:
            case r(d[4]).OPERATIONS.WEB_STORAGE:
            case r(d[4]).OPERATIONS.SIGNAL_NOT_IMPLEMENTED:
            case r(d[4]).OPERATIONS.BIOMETRIC_SIGNAL_COLLECTION_STARTED:
                return 1e3;
            default:
                return 1
            }
        }
    };
    var O = o;
    e.default = O
}, 3407874, [3407875, 12517454, 3407876, 3407877, 3407878]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = Object.freeze({
        INFO: 'info',
        WARNING: 'warning',
        ERROR: 'error'
    });
    e.default = t
}, 3407875, []);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const o = {
        falco: !0,
        pigeon: !1
    };
    e.default = class {
        static log(t) {
            r(d[0]).FalcoLogger.log('bd_operation', t(), {}, o)
        }
    }
}, 3407876, [12517438]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var S = Object.freeze({
        WEB_SIGNAL_COLLECTION: 'JS',
        ANDROID_SIGNAL_COLLECTION: 'Java',
        IOS_SIGNAL_COLLECTION: 'ObjC',
        SIGNAL_COLLECTION_SERVER_PROCESSING: 'SCSP',
        TRIGGER: 'TG',
        SESSION_STORE: 'SS',
        SCANNERS_FRAMEWORK: 'SF',
        RESEARCHER_STUDIO_SERVER_SIDE: 'RS',
        RESEARCHER_STUDIO_CLIENT_SIDE: 'RSJS',
        SIGNAL_COLLECTION_CONFIG: 'SCCFG',
        COLLECTION_TRIGGER_FB: 'CTFB',
        CLASSIFICATION_TRIGGER_FB: 'ClsTF',
        PASSIVE_SIGNALS_FB: 'PSFB',
        FB_ACTIVE_SIGNAL: 'FB_AS',
        IG_ACTIVE_SIGNAL: 'IG_AS',
        BD_STORE: 'ST',
        REPUTATION_HINTS_FB: 'RHF',
        FALCO_EVENT: 'FE',
        USERAGENT_PARSING: 'UA',
        FEATURE_LIMIT: 'FL',
        IG_JS: 'IG_JS'
    });
    e.default = S
}, 3407877, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    e.LEVELS = {
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info'
    },
    e.OPERATIONS = {
        KEY_NOT_FOUND: 'key_not_found',
        APPEND_SIGNAL: 'bd_append_signal',
        APPEND_SIGNAL_FAIL: 'bd_append_signal_fail',
        HB_COLLECTED: 'append_hb',
        HB_COLLECTION_FAILED: 'hb_collection_failed',
        BD_EXCEPTION: 'bd_exception',
        SIGNAL_NOT_IMPLEMENTED: 'signal_not_implemented',
        SIGNAL_VALUE_NULL: 'signal_value_null',
        EMPTY_SIGNAL_CONFIG: 'empty_signal_config',
        INVALID_BUFFER_SIZE: 'invalid_buffer_size',
        INVALID_DURATION: 'invalid_duration',
        SIGNAL_FLAGS_MISSING: 'signal_flags_missing',
        DYNAMIC_SIGNAL_COLLECTION_STARTED: 'dynamic_signal_collection_started',
        BIOMETRIC_SIGNAL_COLLECTION_STARTED: 'biometric_signal_collection_started',
        INVALID_GUID: 'invalid_guid',
        INVALID_LENGTH: 'invalid_length',
        GET_LOCAL_STORAGE_ERROR: 'get_local_storage_error',
        WEB_STORAGE: 'web_storage',
        PARSE_CONFIG_ERROR: 'parse_config_error',
        HB_START_FAILURE: 'hb_start_failure',
        HB_ALREADY_RUNNING: 'hb_already_running',
        TRY_RESTARTING_HB: 'try_restarting_hb',
        BANZAI_LOG_ERROR: 'banzai_log_error'
    },
    e.COMPONENT_NAME = 'JS'
}, 3407878, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'BDClientConfig';
    let n = null;
    var s = {
        get: ()=>(null == n && (n = new class {
            constructor() {
                this.reputationTier = i(d[0]).BENIGN_IGNORE,
                this.staticSignalBufferSize = 1,
                this.dynamicSignalBufferSize = 1,
                this.biometricSignalBufferSize = 1,
                this.staticSignals = [],
                this.dynamicSignals = [],
                this.biometricSignals = [],
                this.heartbeatSignal = new (i(d[1]))([],i(d[2]).HEARTBEAT_V2),
                this.bufferSizeBySignalIdMap = {},
                this.periodicCollectionIntervalMs = Number.MAX_SAFE_INTEGER,
                this.signalConfigGenerationTimeStampMs = 0,
                this.suspiciousTiersFlushDurationMs = Number.MAX_SAFE_INTEGER,
                this.allTiersFlushDurationMs = Number.MAX_SAFE_INTEGER,
                this.heartbeatIntervalMs = -1,
                this.parsingDone = !1,
                this.sid = -1,
                this.hbVersion = '',
                this.$BDClientConfig1 = 0,
                this.$BDClientConfig2 = 0,
                this.$BDClientConfig3 = 30,
                this.bufferSizeBySignalIdMap[i(d[2]).HEARTBEAT_V2] = 1
            }
            setClientReputationTier(t) {
                return this.reputationTier = t,
                this
            }
            getClientReputationTier() {
                return this.reputationTier
            }
            setStaticSignalBufferSize(n) {
                return n > 0 ? this.staticSignalBufferSize = n : i(d[3]).logError(t, r(d[4]).OPERATIONS.INVALID_BUFFER_SIZE, {
                    size: n.toString(),
                    type: 's'
                }),
                this
            }
            getStaticSignalBufferSize() {
                return this.staticSignalBufferSize
            }
            setDynamicSignalBufferSize(n) {
                return n > 1 ? this.dynamicSignalBufferSize = n : i(d[3]).logError(t, r(d[4]).OPERATIONS.INVALID_BUFFER_SIZE, {
                    size: n ? n.toString() : '0',
                    type: 'dbs'
                }),
                this
            }
            getDynamicSignalBufferSize() {
                return this.dynamicSignalBufferSize
            }
            setBiometricSignalBufferSize(n) {
                return n > 1 ? this.biometricSignalBufferSize = n : i(d[3]).logError(t, r(d[4]).OPERATIONS.INVALID_BUFFER_SIZE, {
                    size: n.toString(),
                    type: 'b'
                }),
                this
            }
            setSID(t) {
                return this.sid = t,
                this
            }
            getHeartbeatVersion() {
                return this.hbVersion
            }
            getBiometricSignalBufferSize() {
                return this.biometricSignalBufferSize
            }
            setConfigGenerationTimeStamp(t) {
                return this.signalConfigGenerationTimeStampMs = t,
                this
            }
            getConfigGenerationTimeStamp() {
                return this.signalConfigGenerationTimeStampMs
            }
            getHeartbeatIntervalMs() {
                return this.heartbeatIntervalMs
            }
            setAllTiersFlushDurationMinutes(n) {
                return n > 0 ? this.allTiersFlushDurationMs = 60 * n * 1e3 : i(d[3]).logError(t, r(d[4]).OPERATIONS.INVALID_DURATION, {
                    size: n.toString(),
                    type: 'fda'
                }),
                this
            }
            getAllTiersFlushDurationMs() {
                return this.allTiersFlushDurationMs
            }
            getFlushDurationByReputationTierMs() {
                return this.reputationTier === i(d[0]).BENIGN ? this.allTiersFlushDurationMs : this.suspiciousTiersFlushDurationMs
            }
            addMultipleSignalsToClientConfig(t) {
                return t.forEach(t=>this.addSignalToClientConfig(t)),
                this
            }
            addSignalToClientConfig(t) {
                const n = t.getSignalFlags()
                  , s = t.getSignalId();
                if (s === i(d[2]).HEARTBEAT)
                    return this;
                const l = new (i(d[1]))(n,s);
                return s === i(d[2]).HEARTBEAT_V2 ? (this.heartbeatSignal = l,
                this) : (n.includes(i(d[5]).DYNAMIC) ? n.includes(i(d[5]).BIOMETRIC) ? this.biometricSignals.push(l) : this.dynamicSignals.push(l) : this.staticSignals.push(l),
                t.getBufferSize() > 0 && (this.bufferSizeBySignalIdMap[t.getSignalId()] = t.getBufferSize()),
                this)
            }
            setPeriodicCollectionIntervalSeconds(n) {
                return n > 0 ? this.periodicCollectionIntervalMs = 1e3 * n : i(d[3]).logError(t, r(d[4]).OPERATIONS.INVALID_DURATION, {
                    size: n ? n.toString() : 'INF',
                    type: 'i'
                }),
                this
            }
            getPeriodicCollectionIntervalMs() {
                return this.periodicCollectionIntervalMs
            }
            getDynamicSignals() {
                return this.dynamicSignals
            }
            getStaticSignals() {
                return this.staticSignals
            }
            getBiometricSignals() {
                return this.biometricSignals
            }
            getHeartbeatSignal() {
                return this.heartbeatSignal
            }
            getBufferSizeBySignalId(t) {
                return this.bufferSizeBySignalIdMap[t]
            }
            setParsingDone(t) {
                this.parsingDone = t
            }
            isParsingDone() {
                return this.parsingDone
            }
            setHeartbeatConfig(t) {
                if (null != t) {
                    var n, s;
                    this.hbVersion = t.hbv,
                    this.heartbeatIntervalMs = 60 * t.hbi * 1e3,
                    this.$BDClientConfig1 = null !== (n = t.hbcbc) && void 0 !== n ? n : this.$BDClientConfig1,
                    this.$BDClientConfig2 = null !== (s = t.hbvbc) && void 0 !== s ? s : this.$BDClientConfig2,
                    this.$BDClientConfig3 = t.hbbi && t.hbbi > 0 ? t.hbbi : this.$BDClientConfig3
                }
                return this
            }
            getHeartbeatCriticalBurstCount() {
                return this.$BDClientConfig1
            }
            getHeartbeatVitalBurstCount() {
                return this.$BDClientConfig2
            }
            getHeartbeatBurstIntervalMs() {
                return 1e3 * this.$BDClientConfig3
            }
        }
        ),
        n)
    };
    e.default = s
}, 3407879, [3407880, 3407881, 3407892, 3407874, 3407878, 3407886]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var E = Object.freeze({
        BENIGN_IGNORE: 0,
        SUSPICIOUS: 1024,
        PARANOID: 2048,
        RANDOM_SAMPLE_DEPRECATED: 4096,
        BENIGN: 262144,
        EMPLOYEES: 524288
    });
    e.default = E
}, 3407880, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class {
        constructor(t, s) {
            this.signalFlags = t,
            this.signalType = s
        }
        getSignalCollector(t) {
            return this.canExecuteForReputationTier(t) ? i(d[0]).get(this.signalType) : null
        }
        canExecuteForReputationTier(t) {
            return this.signalType === i(d[1]).HEARTBEAT_V2 || this.signalFlags.includes(t)
        }
        getBufferConfig() {
            return i(d[2])[this.signalType]
        }
    }
    ;
    e.default = t
}, 3407881, [3407882, 3407892, 3407891]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = {
        get(t) {
            switch (t) {
            case 3e4:
                return i(d[0]).get();
            case 30001:
                return i(d[1]).get();
            case 30002:
                return i(d[2]).get();
            case 30003:
                return i(d[3]).get();
            case 30004:
                return i(d[4]).get();
            case 30005:
                return i(d[5]).get();
            case 30007:
                return i(d[6]).get();
            case 30008:
                return i(d[7]).get();
            case 30012:
                return i(d[8]).get();
            case 30013:
                return i(d[9]).get();
            case 30015:
                return i(d[10]).get();
            case 30018:
                return i(d[11]).get();
            case 30040:
                return i(d[12]).get();
            case 30093:
                return i(d[13]).get();
            case 30094:
                return i(d[14]).get();
            case 30095:
                return i(d[15]).get();
            case 30106:
                return i(d[16]).get();
            case 30107:
                return i(d[17]).get();
            case 38001:
                return i(d[18]).get();
            default:
                return
            }
        }
    };
    e.default = t
}, 3407882, [3407883, 3407893, 3407895, 3407896, 3407899, 3407901, 3407903, 3407905, 3407906, 3407907, 3407908, 3407909, 3407910, 3407911, 3407912, 3407913, 3407914, 3407917, 3407918]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).WEBDRIVER,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = !!navigator.webdriver;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),t)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407883, [3407884, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class extends a(d[0]).SignalValueTypeDef {
        constructor(t, s, u) {
            super(t, s, u, a(d[0]).VALUE_TYPES.BOOLEAN)
        }
    }
    ;
    e.default = t
}, 3407884, [3407885]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'SignalValueTypeDef'
      , l = 't'
      , n = 'ctx'
      , u = 'v'
      , s = 'e'
      , S = {
        NUMBER: 'NUMBER',
        STRING: 'STRING',
        BOOLEAN: 'BOOLEAN',
        CUSTOM_OBJECT: 'CUSTOM_OBJECT',
        INT_ARRAY: 'INT_ARRAY',
        TOUCH: 'TOUCH',
        MAP: 'MAP',
        LIST: 'LIST',
        SENSOR: 'SENSOR',
        ERROR: 'ERROR'
    };
    e.BD_VALUE = u,
    e.BD_ERROR = s,
    e.VALUE_TYPES = S,
    e.SignalValueTypeDef = class {
        constructor(t, l, n, u, s) {
            this.$SignalValueTypeDef1 = t,
            this.$SignalValueTypeDef2 = l,
            this.$SignalValueTypeDef3 = n,
            this.$SignalValueTypeDef4 = u,
            this.$SignalValueTypeDef5 = null != s ? s : 0
        }
        getTimeStampMS() {
            return this.$SignalValueTypeDef1
        }
        getSignalContext() {
            return this.$SignalValueTypeDef2
        }
        getSignalValue() {
            return this.$SignalValueTypeDef3
        }
        getSignalValueType() {
            return this.$SignalValueTypeDef4
        }
        isEqual(l, n) {
            if (null == l)
                return i(d[0]).logWarning(t, r(d[1]).OPERATIONS.SIGNAL_VALUE_NULL),
                !1;
            if (this.getSignalValueType() !== l.getSignalValueType())
                return !1;
            if (this.getSignalValueType() === S.ERROR && l.getSignalValueType() === S.ERROR)
                return this.equalValue(l);
            let u = !1;
            return n.has(i(d[2]).EQUAL_BY_VALUE) && (u = this.equalValue(l)),
            n.has(i(d[2]).EQUAL_BY_CONTEXT) && (u = u && null != this.getSignalContext() && null != l.getSignalContext() && this.getSignalContext().getSignalValueContextName() === l.getSignalContext().getSignalValueContextName()),
            n.has(i(d[2]).EQUAL_BY_TIMESTAMP) && (u = u && Math.abs(this.getTimeStampMS() - l.getTimeStampMS()) <= this.$SignalValueTypeDef5),
            u
        }
        equalValue(t) {
            if (this.isPrimitiveType())
                return this.getSignalValue() === t.getSignalValue();
            throw new Error('Must implement in the subclasses')
        }
        toJSON(t) {
            const u = {};
            return t && (u[l] = this.$SignalValueTypeDef1 / 1e3,
            null != this.$SignalValueTypeDef2 && (u[n] = this.$SignalValueTypeDef2)),
            null == this.$SignalValueTypeDef3 ? u[s] = new (a(d[3]).SignalErrorValueTypeDef)(i(d[4]).NULL) : this.addValueOrErrorToJSON(u),
            u
        }
        addValueOrErrorToJSON(t) {
            if (!this.isPrimitiveType())
                throw new Error('Must implement in the subclasses');
            t[u] = this.$SignalValueTypeDef3
        }
        isPrimitiveType() {
            switch (typeof this.$SignalValueTypeDef3) {
            case 'number':
            case 'boolean':
            case 'string':
                return !0;
            default:
                return !1
            }
        }
    }
}, 3407885, [3407874, 3407878, 3407886, 3407887, 3407888]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var E = Object.freeze({
        ACTIVE: 1,
        DYNAMIC: 2,
        BIOMETRIC: 4,
        DEPRECATED: 8,
        WEB: 16,
        IOS_NATIVE: 32,
        ANDROID_NATIVE: 64,
        EQUAL_BY_VALUE: 128,
        EQUAL_BY_CONTEXT: 256,
        EQUAL_BY_TIMESTAMP: 512,
        SUSPICIOUS_TIER: 1024,
        PARANOID_TIER: 2048,
        RANDOM_SAMPLE_TIER_DEPRECATED: 4096,
        BENIGN_TIER: 262144,
        EMPLOYEES_TIER: 524288,
        BUNDLE: 8192,
        ONSITE: 16384,
        OFFSITE: 32768,
        OFFSITE_SENSITIVE: 65536,
        SENSITIVE: 131072
    });
    e.default = E
}, 3407886, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'ec'
      , l = 'en'
      , o = 'es'
      , s = 500;
    e.SignalErrorValueTypeDef = class {
        constructor(t, l, o) {
            this.$SignalErrorValueTypeDef1 = t,
            this.$SignalErrorValueTypeDef2 = l,
            null != o && (this.$SignalErrorValueTypeDef3 = o.substr(0, s))
        }
        getErrorCode() {
            return this.$SignalErrorValueTypeDef1
        }
        getErrorName() {
            return this.$SignalErrorValueTypeDef2
        }
        getErrorDetails() {
            return this.$SignalErrorValueTypeDef3
        }
        isEqual(t) {
            return this.$SignalErrorValueTypeDef1 === t.getErrorCode() && this.$SignalErrorValueTypeDef3 === t.getErrorDetails() && this.$SignalErrorValueTypeDef2 === t.getErrorName()
        }
        toJSON() {
            const s = {};
            switch (s[t] = this.$SignalErrorValueTypeDef1,
            this.$SignalErrorValueTypeDef1) {
            case i(d[0]).UNKNOWN:
                s[l] = this.$SignalErrorValueTypeDef2,
                s[o] = this.$SignalErrorValueTypeDef3
            }
            return s
        }
    }
}, 3407887, [3407888]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var N = Object.freeze({
        UNKNOWN: 0,
        NO_PERMISSION: 1,
        NULL: 2,
        NOT_SUPPORTED: 3,
        NOT_IMPLEMENTED: 4
    });
    e.default = N
}, 3407888, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    class t {
        constructor(t) {
            this.signalType = t
        }
        executeSignalCollection() {
            throw new Error('Child class responsibility to implement executeSignalCollection')
        }
        async executeAsyncSignalCollection() {
            return await this.executeSignalCollection()
        }
        static getSanitizedURI() {
            const t = window.location.href
              , n = t.indexOf('?');
            return n < 0 ? t : t.substring(0, n)
        }
        getContext() {
            return new (i(d[0]))(t.getSanitizedURI())
        }
        throwIfNotInitialized() {
            if (!(this.signalType in i(d[1])))
                throw new Error('Signal is not intialized')
        }
    }
    var n = t;
    e.default = n
}, 3407889, [3407890, 3407891]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class {
        constructor(t) {
            this.cn = t
        }
        getSignalValueContextName() {
            return this.cn
        }
    }
    ;
    e.default = t
}, 3407890, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = {};
    e.default = t
}, 3407891, []);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var E = Object.freeze({
        TEST_SIGNAL: 0,
        SSL_FINGERPRINT: 1,
        HTTP_FINGERPRINT: 2,
        TCP_FINGERPRINT: 3,
        HTTP_PARAMS_FINGERPRINT: 4,
        TCP_FINGERPRINT_V2: 5,
        SRC_IP_ADDRESS: 50,
        USER_AGENT: 51,
        USER_AGENT_MD5: 52,
        CSRF_TOKEN: 53,
        ALITE_CONTROLLER: 54,
        REQUEST_INTERFACE: 55,
        GETISH_REQUEST: 56,
        REQUEST_METHOD: 57,
        GRAPHQL_QUERY_IDS: 58,
        RESTSERVER_METHOD: 59,
        GRAPH_API_PATH: 60,
        RELATIVE_SCRIPT_PATH: 61,
        DATR_COOKIE: 62,
        X_FORWARDED_FOR: 63,
        ASN: 64,
        DATR_COOKIE_INFO: 65,
        SAFETYNET_RESULT_STATUS: 90,
        MACHINE_ID_COOKIE: 200,
        VIEW_NAME: 201,
        APP_ID: 202,
        RLE_ENDPOINT_KEY: 203,
        RESPONSE_CONTENT_SIZE: 204,
        RESPONSE_CODE: 205,
        RATE_LIMITER_QUOTA: 206,
        CLOUD_HOSTING_SCORE: 207,
        MACHINE_ID_COOKIE_INFO: 208,
        RESPONSE_CONTENT_TYPE: 209,
        REQUEST_DATA: 210,
        DEVICE_IP_ADDRESSES: 10001,
        DEVICE_MAC_ADDRESSES: 10002,
        APP_MD5: 10003,
        APP_SHA1: 10004,
        APP_SHA256: 10005,
        APP_CERTIFICATES_HASHES: 10006,
        APP_SIZE: 10007,
        APP_LIFECYCLE_STATE_CHANGE: 10008,
        APP_FROSTING_BLOCK: 10009,
        APP_DEX_MD5: 10010,
        APP_CAMERA_STATE_CHANGE: 10011,
        WO_EVENT_ID: 10012,
        BATTERY_STATUS: 10050,
        BATTERY_LEVEL: 10051,
        BATTERY_PLUGGED_SOURCE: 10052,
        BATTERY_TEMPERATURE: 10053,
        BATTERY_HEALTH: 10054,
        BATTERY_PRESENT: 10055,
        BATTERY_CURRENT: 10056,
        BATTERY_CHARGE_COUNTER: 10057,
        BATTERY_ENERGY_COUNTER: 10058,
        BATTERY_EXTRA_LEVEL_AND_SCALE: 10059,
        BATTERY_TECHNOLOGY: 10060,
        BATTERY_VOLTAGE: 10061,
        BATTERY_LOW: 10062,
        DISPLAY_SIZE: 10100,
        DISPLAY_PPI: 10101,
        DISPLAY_DENSITY: 10102,
        DISPLAY_DENSITY_DPI: 10103,
        DISPLAY_SCALED_DENSITY: 10104,
        DISPLAY_BRIGHTNESS: 10105,
        IS_SCREEN_CAPTURED: 10106,
        DISPLAY_REAL_SIZE: 10107,
        APP_FIRST_INSTALL_TIME: 10200,
        APP_LAST_UPDATE_TIME: 10201,
        APP_VERSION_CODE: 10202,
        APP_VERSION_NAME: 10203,
        APP_PACKAGE_NAME: 10204,
        APP_BASE_REVISION_CODE: 10205,
        APP_ACTIVITIES: 10206,
        APP_ACTIVITIES_COUNT: 10207,
        APP_ACTIVITIES_SHA256: 10208,
        APP_SERVICES: 10209,
        APP_SERVICES_COUNT: 10210,
        APP_SERVICES_SHA256: 10211,
        APP_REQUESTED_PERMISSIONS: 10212,
        APP_REQUESTED_PERMISSIONS_COUNT: 10213,
        APP_REQUESTED_PERMISSIONS_SHA256: 10214,
        BUILD_CONFIG: 10250,
        DEVICE_FEATURES: 10300,
        APP_INSTALLER_PACKAGE_NAME: 10500,
        IS_SAFE_MODE: 10501,
        INSTALL_REASON: 10502,
        CAN_REQUEST_PACKAGE_INSTALLS: 10503,
        INSTANT_APP_COOKIE: 10504,
        APP_CONTENT_PROVIDERS: 10505,
        ALL_INSTALLED_PACKAGES: 10506,
        SYSTEM_INSTALLED_PACKAGES: 10507,
        UNINSTALLED_PACKAGES: 10508,
        PACKAGE_COMPONENTS_ENABLED: 10550,
        BUILD_BOARD: 10600,
        BUILD_BOOTLOADER: 10601,
        BUILD_BRAND: 10602,
        BUILD_DEVICE: 10603,
        BUILD_DISPLAY: 10604,
        BUILD_FINGERPRINT: 10605,
        BUILD_HARDWARE: 10606,
        BUILD_HOST: 10607,
        BUILD_ID: 10608,
        BUILD_MANUFACTURER: 10609,
        BUILD_MODEL: 10610,
        BUILD_PRODUCT: 10611,
        BUILD_RADIO_VERSION: 10612,
        BUILD_SERIAL: 10613,
        BUILD_SUPPORTED_ABIS: 10614,
        BUILD_TAGS: 10615,
        BUILD_TIME: 10616,
        BUILD_TYPE: 10617,
        BUILD_USER: 10618,
        IS_BUILD_CONSISTENT: 10619,
        BUILD_VERSION_CODENAME: 10650,
        BUILD_VERSION_RELEASE: 10651,
        BUILD_VERSION_SDK_INT: 10652,
        BUILD_VERSION_SECURITY_PATCH: 10653,
        BUILD_VERSION_BASE_OS: 10654,
        MOBILE_RX_BYTES: 10700,
        MOBILE_TX_BYTES: 10701,
        TOTAL_RX_BYTES: 10702,
        TOTAL_TX_BYTES: 10703,
        ANDROID_TOUCH_EVENT: 10800,
        ANDROID_TAP_GESTURE: 10801,
        ANDROID_FLING_GESTURE: 10802,
        ANDROID_SCROLL_GESTURE: 10803,
        ACCELEROMETER_SENSOR: 10810,
        GYROSCOPE_SENSOR: 10811,
        MAGNETOMETER_SENSOR: 10812,
        GEOMAGNETIC_ROTATION_SENSOR: 10813,
        ORIENTATION_SENSOR: 10814,
        PROXIMITY_SENSOR: 10815,
        STEP_DETECTOR_SENSOR: 10816,
        LIGHT_SENSOR: 10817,
        BAROMETER_SENSOR: 10818,
        AMBIENT_TEMPERATURE_SENSOR: 10819,
        RELATIVE_HUMIDITY_SENSOR: 10820,
        KEY_PRESS: 10850,
        DEVICE_TOTAL_MEMORY: 10880,
        CONFIGURATION_INFO_OPENGL_ES_VERSION: 10881,
        CONFIGURATION_INFO_INPUT_FEATURES: 10882,
        CONFIGURATION_INFO_KEYBOARD_TYPE: 10883,
        CONFIGURATION_INFO_NAVIGATION: 10884,
        CONFIGURATION_INFO_TOUCH_SCREEN: 10885,
        APP_PROCESS_INFO_IMPORTANCE: 10886,
        APP_PROCESS_PROCESS_NAME: 10887,
        IS_RUNNING_IN_TEST_HARNESS: 10888,
        IS_USER_A_MONKEY: 10889,
        LOCK_TASK_MODE_STATE: 10890,
        APP_INFO_FLAGS: 10900,
        APP_INFO_MIN_SDK_VERSION: 10901,
        APP_INFO_TARGET_SDK_VERSION: 10902,
        APP_INFO_SOURCE_DIR: 10903,
        APP_INFO_DATA_DIR: 10904,
        APP_INFO_NATIVE_LIBRARY_DIR: 10905,
        APP_INFO_PUBLIC_SOURCE_DIR: 10906,
        APP_INFO_DEVICE_PROTECTED_DATA_DIR: 10907,
        APP_INFO_PROCESS_NAME: 10908,
        APP_INFO_TASK_AFFINITY: 10909,
        APP_INFO_THEME: 10910,
        APP_INFO_CATEGORY: 10911,
        AUDIO_STREAMS_VOLUME: 10920,
        IS_MICROPHONE_MUTE: 10930,
        IS_MUSIC_ACTIVE: 10931,
        IS_SPEAKERPHONE_ON: 10932,
        IS_WIRED_HEADSET_ON_DEPRECATED: 10933,
        AUDIO_RINGER_MODE: 10934,
        AUDIO_DEVICES: 10935,
        SYSTEM_PROPERTIES: 10940,
        FILES_INFO: 10941,
        FILES_GREP: 10942,
        SETTINGS_GLOBAL: 10943,
        SETTINGS_SECURE: 10944,
        SETTINGS_SYSTEM: 10945,
        NETWORK_CAPABILITIES: 10946,
        TRANSPORT_CAPABILITIES: 10947,
        LINK_DOWNSTREAM_BANDWIDTH_KBPS: 10948,
        LINK_UPSTREAM_BANDWIDTH_KBPS: 10949,
        USB_MANAGER_ACTION_USB_STATE: 10950,
        USB_MANAGER_ACTION_USB_ACCESSORY: 10951,
        USB_MANAGER_ACTION_USB_DEVICE: 10952,
        BLUETOOTH_ADAPTER_ADDRESS: 10970,
        BLUETOOTH_ADAPTER_NAME: 10971,
        BLUETOOTH_PAIRED_DEVICES: 10972,
        IS_DEVICE_LOCKED: 10980,
        IS_DEVICE_SECURE: 10981,
        IS_KEYGUARD_LOCKED: 10982,
        IS_KEYGUARD_SECURE: 10983,
        IS_INTERACTIVE: 10990,
        IS_DEVICE_IDLE_MODE: 10991,
        IS_POWER_SAVE_MODE: 10992,
        SENSORS_LIST: 11e3,
        SYSTEM_ELAPSED_TIME: 11010,
        SYSTEM_UP_TIME: 11011,
        TIME_ZONE_ID: 11020,
        TIME_ZONE_RAW_OFFSET: 11021,
        TIME_ZONE_DISPLAY_NAME: 11022,
        LOCALE_LANGUAGE: 11030,
        LOCALE_COUNTRY: 11031,
        LOCALE_SCRIPT: 11032,
        LOCALE_VARIANT: 11033,
        JVM_RUNTIME_TOTAL_MEMORY: 11040,
        JVM_RUNTIME_AVAILABLE_PROCESSORS: 11041,
        TELEPHONY_DATA_NETWORK_TYPE: 11050,
        TELEPHONY_VOICE_NETWORK_TYPE: 11051,
        TELEPHONY_PHONE_TYPE: 11052,
        TELEPHONY_PHONE_COUNT: 11053,
        TELEPHONY_NETWORK_OPERATOR: 11054,
        TELEPHONY_NETWORK_OPERATOR_NAME: 11055,
        TELEPHONY_SIM_OPERATOR: 11056,
        TELEPHONY_SIM_OPERATOR_NAME: 11057,
        TELEPHONY_SIM_CARRIER_ID: 11058,
        TELEPHONY_SIM_COUNTRY_ISO: 11059,
        TELEPHONY_SIM_STATE: 11060,
        TELEPHONY_SIGNAL_STRENGTH_LEVEL: 11061,
        IS_MOBILE_DATA_ENABLED: 11062,
        WIFI_SSID: 11090,
        WIFI_BSSID: 11091,
        CAPTURE_DEVICES: 2e4,
        AUDIO_INPUT_PORTS: 20001,
        AUDIO_OUTPUT_PORTS: 20002,
        IS_OTHER_AUDIO_PLAYING: 20003,
        IS_SECONDARY_AUDIO_SHOULD_BE_SILENCED_HINT: 20004,
        SYSTEM_INFO: 20005,
        DEVICE_NAME: 20006,
        DEVICE_SYSTEM_NAME: 20007,
        DEVICE_SYSTEM_VERSION: 20008,
        DEVICE_MODEL: 20009,
        DEVICE_IDENTIFIER_FOR_VENDOR: 20010,
        DEVICE_ORIENTATION: 20020,
        DEVICE_BATTERY_MONITORING_ENABLED: 20030,
        DEVICE_BATTERY_STATE: 20031,
        DEVICE_BATTERY_LEVEL: 20032,
        DEVICE_PROXIMITY_MONITORING_ENABLED: 20040,
        DEVICE_PROXIMITY_STATE: 20041,
        PROCESS_ENVIRONMENT_VARS: 20050,
        PROCESS_ENVIRONMENT_VARS_COUNT: 20051,
        PROCESS_ENVIRONMENT_VARS_SHA256: 20052,
        PROCESS_ARGUMENTS: 20053,
        PROCESS_ID: 20054,
        PROCESS_NAME: 20055,
        PROCESS_HOST_NAME: 20056,
        PROCESS_OPERATING_SYSTEM_VERSION: 20057,
        PROCESS_OPERATING_SYSTEM_VERSION_STRING: 20058,
        PROCESS_PROCESSOR_COUNT: 20059,
        PROCESS_ACTIVE_PROCESSOR_COUNT: 20060,
        PROCESS_PHYSICAL_MEMORY: 20061,
        PROCESS_THERMAL_STATE: 20062,
        PROCESS_LOW_POWER_MODE_ENABLED: 20063,
        IS_TARGET_OS_SIMULATOR: 20070,
        IS_APP_BUNDLE_APP_STORE_SIGNED: 20071,
        APP_RUNTIME_STATE: 20080,
        IS_APP_IDLE_TIMER_DISABLED: 20081,
        IS_PROTECTED_DATA_AVAILABLE: 20082,
        IS_IGNORING_INTERACTION_EVENTS: 20083,
        APP_ICON_BADGE_NUMBER: 20084,
        BUNDLE_INFO_DICTIONARY: 20090,
        BUNDLE_INFO_DICTIONARY_COUNT: 20091,
        BUNDLE_INFO_DICTIONARY_SHA256: 20092,
        IOS_TOUCH_EVENT: 20100,
        IOS_TAP_GESTURE: 20101,
        IOS_SWIPE_GESTURE: 20102,
        IOS_PAN_GESTURE: 20103,
        IOS_LOCALE_IDENTIFIER: 20110,
        IOS_LOCALE_LANGUAGE_CODE: 20111,
        IOS_LOCALE_CALENDAR_IDENTIFIER: 20112,
        IOS_LOCALE_COUNTRY_CODE: 20113,
        TELEPHONY_CARRIER_NAME: 20120,
        TELEPHONY_ISO_COUNTRY_CODE: 20121,
        TELEPHONY_MOBILE_COUNTRY_CODE: 20122,
        TELEPHONY_MOBILE_NETWORK_CODE: 20123,
        IS_CARRIER_ALLOWS_VOIP: 20124,
        CELLULAR_DATA_ACCESS_RESTRICTED_STATE: 20125,
        IS_STEP_COUNTING_AVAILABLE: 20130,
        IS_DISTANCE_AVAILABLE: 20131,
        IS_FLOOR_COUNTING_AVAILABLE: 20132,
        IS_PACE_AVAILABLE: 20133,
        IS_CADENCE_AVAILABLE: 20134,
        IS_PEDOMETER_EVENT_TRACKING_AVAILABLE: 20135,
        IS_DEVICE_MOTION_AVAILABLE: 20140,
        IS_ACCELEROMETER_AVAILABLE: 20141,
        IS_GYRO_AVAILABLE: 20142,
        IS_MAGNETOMETER_AVAILABLE: 20143,
        IS_RELATIVE_ALTITUDE_AVAILABLE: 20150,
        IOS_PROXY_SETTINGS: 20160,
        IOS_NETWORK_INFO_DEPRECATED: 20170,
        IOS_NETWORK_INFO: 20171,
        LA_CONTEXT_CAN_EVALUATE_POLICIES: 20180,
        LA_CONTEXT_BIOMETRY_TYPE: 20181,
        LA_CONTEXT_TOUCH_ID_AUTHENTICATION_REUSE_DURATION: 20182,
        LA_CONTEXT_IS_CREDENTIAL_SET: 20183,
        IS_JAILBROKEN: 20190,
        IOS_FILES_INFO: 20191,
        IS_JAILBROKEN_INTERNAL: 20192,
        WEBDRIVER: 3e4,
        PLUGIN_COUNT: 30001,
        MIME_TYPE_COUNT: 30002,
        LANGUAGES: 30003,
        CONNECTION_RTT: 30004,
        WINDOW_OUTER_DIMENSION: 30005,
        WINDOW_CHROME: 30006,
        NOTIFICATION_PERMISSION: 30007,
        NAVIGATOR_NOTIFICATION_PERMISSION: 30008,
        FONTS: 30009,
        JS_FINGERPRINT: 30010,
        IS_DEV_TOOLS_OPEN: 30011,
        NAVIGATOR_VENDOR: 30012,
        NAVIGATOR_APP_VERSION: 30013,
        NAVIGATOR_ONLINE: 30014,
        NAVIGATOR_PLATFORM: 30015,
        NAVIGATOR_DO_NOT_TRACK: 30016,
        NAVIGATOR_PRODUCT_SUB: 30017,
        NAVIGATOR_HARDWARE_CONCURRENCY: 30018,
        NAVIGATOR_PLUGINS_FILE_EXTENSIONS: 30019,
        NAVIGATOR_PROPERTIES_COUNT: 30039,
        TIMEZONE_OFFSET: 30040,
        WINDOW_SCREEN_TOP: 30050,
        ALERT_TO_STRING_MD5: 30090,
        CONFIRM_TO_STRING_MD5: 30091,
        PROMPT_TO_STRING_MD5: 30092,
        NAVIGATOR_MAX_TOUCH_POINT: 30093,
        NAVIGATOR_USER_AGENT: 30094,
        HISTORY_LENGTH: 30095,
        KEY_DOWN_UP: 30100,
        MOUSE_POSITION: 30101,
        MOUSE_DOWN_UP: 30102,
        MOUSE_CLICK: 30103,
        SCROLL_POSITION: 30104,
        TYPING_INTERVAL: 30105,
        IS_MOUSE_PRESENT: 30106,
        IS_WEB_TOUCH: 30107,
        ADVERTISING_ID: 37263,
        HEARTBEAT: 38e3,
        HEARTBEAT_V2: 38001
    });
    e.default = E
}, 3407892, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).PLUGIN_COUNT,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = navigator.plugins ? navigator.plugins.length : -1;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),t)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407893, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class extends a(d[0]).SignalValueTypeDef {
        constructor(t, s, u) {
            super(t, s, u, a(d[0]).VALUE_TYPES.NUMBER)
        }
    }
    ;
    e.default = t
}, 3407894, [3407885]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).MIME_TYPE_COUNT,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = navigator.mimeTypes ? navigator.mimeTypes.length : -1;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),t)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407895, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[3]).LANGUAGES,
        get: ()=>(null == t && (t = new class extends (i(d[2])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = [].concat(navigator.languages);
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),new (i(d[1]))(t))
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407896, [3407897, 3407898, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var l = class extends a(d[0]).SignalValueTypeDef {
        constructor(l, t, u) {
            super(l, t, u, a(d[0]).VALUE_TYPES.CUSTOM_OBJECT)
        }
        equalValue(l) {
            return this.getSignalValue().isEqual(l.getSignalValue())
        }
        addValueOrErrorToJSON(l) {
            l[a(d[0]).BD_VALUE] = this.getSignalValue().toJSON()
        }
    }
    ;
    e.default = l
}, 3407897, [3407885]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    class t {
        constructor(t) {
            this.strings = [],
            this.strings = t
        }
        toJSON() {
            return this.strings
        }
        isEqual(s) {
            if (!(s instanceof t))
                return !1;
            if (s.strings === this.strings)
                return !0;
            if (s.strings.length !== this.strings.length)
                return !1;
            for (let t = 0; t < this.strings.length; t++)
                if (this.strings[t] !== s.strings[t])
                    return !1;
            return !0
        }
    }
    var s = t;
    e.default = s
}, 3407898, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[5]).CONNECTION_RTT,
        get: ()=>(null == t && (t = new class extends (i(d[4])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                var t;
                this.throwIfNotInitialized();
                let n;
                if (null != (null === (t = navigator.connection) || void 0 === t ? void 0 : t.rtt)) {
                    const t = navigator.connection.rtt;
                    n = new (i(d[0]))(Date.now(),this.getContext(),t)
                } else
                    n = new (i(d[1]))(Date.now(),this.getContext(),new (a(d[2]).SignalErrorValueTypeDef)(i(d[3]).NOT_SUPPORTED,'navigator.connection.rtt not supported'));
                return {
                    valueOrError: n
                }
            }
        }
        ),
        t)
    };
    var o = n;
    e.default = o
}, 3407899, [3407894, 3407900, 3407887, 3407888, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var l = class extends a(d[0]).SignalValueTypeDef {
        constructor(l, t, u) {
            super(l, t, u, a(d[0]).VALUE_TYPES.ERROR)
        }
        equalValue(l) {
            return this.getSignalValue().isEqual(l.getSignalValue())
        }
        addValueOrErrorToJSON(l) {
            l[a(d[0]).BD_ERROR] = this.getSignalValue().toJSON()
        }
    }
    ;
    e.default = l
}, 3407900, [3407885]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[3]).WINDOW_OUTER_DIMENSION,
        get: ()=>(null == t && (t = new class extends (i(d[2])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = window.outerHeight
                  , n = window.outerWidth;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),new (i(d[1]))(n,t))
                }
            }
        }
        ),
        t)
    };
    var o = n;
    e.default = o
}, 3407901, [3407897, 3407902, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    class t {
        constructor(t, h) {
            this.width = null,
            this.height = null,
            this.width = t,
            this.height = h
        }
        toJSON() {
            return {
                w: this.width,
                h: this.height
            }
        }
        isEqual(h) {
            return h instanceof t && (this.width === h.width && this.height === h.height)
        }
    }
    var h = t;
    e.default = h
}, 3407902, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[5]).NOTIFICATION_PERMISSION,
        get: ()=>(null == t && (t = new class extends (i(d[4])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                let t;
                return t = window.Notification ? new (i(d[0]))(Date.now(),this.getContext(),Notification.permission) : new (i(d[1]))(Date.now(),this.getContext(),new (a(d[2]).SignalErrorValueTypeDef)(i(d[3]).NOT_SUPPORTED,'Notification not supported')),
                {
                    valueOrError: t
                }
            }
        }
        ),
        t)
    };
    var o = n;
    e.default = o
}, 3407903, [3407904, 3407900, 3407887, 3407888, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class extends a(d[0]).SignalValueTypeDef {
        constructor(t, s, u) {
            super(t, s, u, a(d[0]).VALUE_TYPES.STRING)
        }
    }
    ;
    e.default = t
}, 3407904, [3407885]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[5]).NAVIGATOR_NOTIFICATION_PERMISSION,
        get: ()=>(null == t && (t = new class extends (i(d[4])) {
            constructor() {
                super(n.signalType)
            }
            async executeAsyncSignalCollection() {
                let t;
                try {
                    if (navigator.permissions) {
                        const n = await navigator.permissions.query({
                            name: 'notifications'
                        });
                        t = new (i(d[0]))(Date.now(),this.getContext(),n.state)
                    } else
                        t = new (i(d[1]))(Date.now(),this.getContext(),new (a(d[2]).SignalErrorValueTypeDef)(i(d[3]).NOT_SUPPORTED,'navigator.permissions not supported'))
                } catch (n) {
                    t = new (i(d[1]))(Date.now(),this.getContext(),new (a(d[2]).SignalErrorValueTypeDef)(i(d[3]).NOT_SUPPORTED,'notifications cannot be queried from navigator.permissions'))
                }
                return {
                    valueOrError: t
                }
            }
        }
        ),
        t)
    };
    var o = n;
    e.default = o
}, 3407905, [3407904, 3407900, 3407887, 3407888, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).NAVIGATOR_VENDOR,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                this.throwIfNotInitialized();
                const t = navigator.vendor;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),t)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407906, [3407904, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).NAVIGATOR_APP_VERSION,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                const t = navigator.appVersion;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),t)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407907, [3407904, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).NAVIGATOR_PLATFORM,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                return this.throwIfNotInitialized(),
                {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),navigator.platform)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407908, [3407904, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let n = null;
    const t = {
        signalType: i(d[2]).NAVIGATOR_HARDWARE_CONCURRENCY,
        get: ()=>(null == n && (n = new class extends (i(d[1])) {
            constructor() {
                super(t.signalType)
            }
            executeSignalCollection() {
                var n;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),null !== (n = navigator.hardwareConcurrency) && void 0 !== n ? n : 0)
                }
            }
        }
        ),
        n)
    };
    var l = t;
    e.default = l
}, 3407909, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).TIMEZONE_OFFSET,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                var t;
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),null !== (t = (new Date).getTimezoneOffset()) && void 0 !== t ? t : 999)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407910, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).NAVIGATOR_MAX_TOUCH_POINT,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),navigator.maxTouchPoints)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407911, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).NAVIGATOR_USER_AGENT,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),navigator.userAgent)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407912, [3407904, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[2]).HISTORY_LENGTH,
        get: ()=>(null == t && (t = new class extends (i(d[1])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),window.history ? window.history.length : 0)
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407913, [3407894, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const s = 36e5;
    let n = null;
    const t = {
        signalType: i(d[1]).IS_MOUSE_PRESENT,
        get: ()=>(null == n && (n = new class extends (i(d[0])) {
            constructor() {
                super(t.signalType, ['mousedown', 'mousemove'], s)
            }
        }
        ),
        n)
    };
    var l = t;
    e.default = l
}, 3407914, [3407915, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    e.default = class extends r(d[1]).BDBiometricSignalCollectorBase {
        constructor(t, s, n) {
            super(t),
            this.eventsToSubscribe = [],
            this.pauseTimeout = 36e5,
            this.eventsToSubscribe = s,
            this.pauseTimeout = n,
            this.handler = (t=>this.collectSignals(t))
        }
        listenForSignals() {
            this.collectSignals(),
            this.addListeners()
        }
        addListeners() {
            this.eventsToSubscribe.forEach(t=>{
                document.addEventListener(t, this.handler)
            }
            )
        }
        pauseListeners() {
            this.eventsToSubscribe.forEach(t=>{
                document.removeEventListener(t, this.handler)
            }
            ),
            window.setTimeout(()=>this.addListeners(), this.pauseTimeout)
        }
        collectSignals(t) {
            const s = null != t;
            s && this.pauseListeners();
            const n = new (i(d[0]))(Date.now(),this.getContext(),s)
              , o = {
                signalId: this.signalType,
                data: {
                    valueOrError: n
                }
            };
            window.dispatchEvent(new CustomEvent(r(d[1]).BIOMETRIC_SIGNAL_COLLECTED_EVENT_NAME,{
                detail: o
            }))
        }
    }
}, 3407915, [3407884, 3407916]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    e.BIOMETRIC_SIGNAL_COLLECTED_EVENT_NAME = 'biometric_signal_collected',
    e.BDBiometricSignalCollectorBase = class extends (i(d[0])) {
        listenForSignals() {
            throw new Error('Child class responsibility to implement listenForSignals')
        }
        executeSignalCollection() {
            throw new Error('executeAsyncSignalCollection and executeSignalCollection should not be called on biometric signals')
        }
    }
}, 3407916, [3407889]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 36e5;
    let n = null;
    const s = {
        signalType: i(d[1]).IS_WEB_TOUCH,
        get: ()=>(null == n && (n = new class extends (i(d[0])) {
            constructor() {
                super(s.signalType, ['touchstart', 'touchcancel'], t)
            }
        }
        ),
        n)
    };
    var c = s;
    e.default = c
}, 3407917, [3407915, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    let t = null;
    const n = {
        signalType: i(d[4]).HEARTBEAT_V2,
        get: ()=>(null == t && (t = new class extends (i(d[3])) {
            constructor() {
                super(n.signalType)
            }
            executeSignalCollection() {
                return {
                    valueOrError: new (i(d[0]))(Date.now(),this.getContext(),new (i(d[1]))(i(d[2]).get().getHeartbeatVersion()))
                }
            }
        }
        ),
        t)
    };
    var l = n;
    e.default = l
}, 3407918, [3407897, 3407919, 3407879, 3407889, 3407892]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class extends (i(d[0])) {
        constructor(t) {
            super(),
            this.id = '',
            this.id = t
        }
        toJSON() {
            return {
                f: this.isAppForeground,
                id: this.id
            }
        }
    }
    ;
    e.default = t
}, 3407919, [3407920]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = class {
        constructor() {
            this.isAppForeground = !0
        }
        toJSON() {
            return {
                f: this.isAppForeground
            }
        }
        isEqual(t) {
            return !1
        }
    }
    ;
    e.default = t
}, 3407920, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'BDClientSignalLogger'
      , n = i(d[0]).get();
    let s = '';
    class o {
        static setAsid(t) {
            s = t
        }
        static postSignalsHelper(t) {
            if (t.length <= 2)
                return !1;
            const c = n.getConfigGenerationTimeStamp()
              , l = n.getClientReputationTier()
              , u = o.encryptDataUsingAsid(t);
            return i(d[1]).log(()=>({
                asid: s,
                ct: c,
                rt: l,
                sjd: u,
                sid: n.sid
            })),
            !0
        }
        static getInitialVector(n) {
            if (16 !== n.length)
                return i(d[2]).logError(t, r(d[3]).OPERATIONS.INVALID_LENGTH),
                '';
            let s = '';
            for (let t = 0; t < 8; t++)
                s += String.fromCharCode(n.charCodeAt(t) ^ n.charCodeAt(8 + t));
            return s
        }
        static encryptDataUsingAsid(n) {
            if (36 !== s.length)
                return i(d[2]).logError(t, r(d[3]).OPERATIONS.INVALID_GUID),
                n;
            const c = s.slice(19, 23) + s.slice(24, 36)
              , l = o.getInitialVector(c)
              , u = new (i(d[4]))(c,'cbc');
            return u.base64Encode(u.encrypt(n, l))
        }
    }
    e.BDClientSignalLogger = o
}, 3407921, [3407879, 3407922, 3407874, 3407878, 3407923]);
__d(function(g, r, i, a, m, e, d) {
    "use strict";
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const o = {
        falco: !0,
        pigeon: !1
    };
    e.default = class {
        static log(c) {
            r(d[0]).FalcoLogger.log('bd_pdc_signals', c(), {}, o)
        }
    }
}, 3407922, [12517438]);
__d(function(g, r, i, a, m, e, d) {
    var t = function(o, h) {
        this.key = o,
        "ecb" !== h && "cbc" !== h || (this.mode = h),
        this.sBox0 = t.sBox0.slice(),
        this.sBox1 = t.sBox1.slice(),
        this.sBox2 = t.sBox2.slice(),
        this.sBox3 = t.sBox3.slice(),
        this.pArray = t.pArray.slice(),
        this.generateSubkeys(o)
    };
    t.prototype = {
        sBox0: null,
        sBox1: null,
        sBox2: null,
        sBox3: null,
        pArray: null,
        key: null,
        mode: "ecb",
        iv: "abc12345",
        keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
        encrypt: function(t, o) {
            if ("ecb" === this.mode)
                return this.encryptECB(t);
            if ("cbc" === this.mode)
                return this.encryptCBC(t, o);
            throw new Error("Неизвестный режим шифрования.")
        },
        decrypt: function(t, o) {
            if ("ecb" === this.mode)
                return this.decryptECB(t);
            if ("cbc" === this.mode)
                return this.decryptCBC(t, o);
            throw new Error("Неизвестный режим шифрования.")
        },
        encryptECB: function(t) {
            t = this.utf8Decode(t);
            for (var o = Math.ceil(t.length / 8), h = "", s = 0; s < o; s++) {
                var n = t.substr(8 * s, 8);
                if (n.length < 8)
                    for (var c = 8 - n.length; 0 < c--; )
                        n += "\0";
                var f, u, l = this.split64by32(n);
                f = l[0],
                u = l[1],
                f = (l = this.encipher(f, u))[0],
                u = l[1],
                h += this.num2block32(f) + this.num2block32(u)
            }
            return h
        },
        encryptCBC: function(t, o) {
            t = this.utf8Decode(t);
            var h, s, n, c = Math.ceil(t.length / 8);
            h = (n = this.split64by32(o))[0],
            s = n[1];
            for (var f = "", u = 0; u < c; u++) {
                var l = t.substr(8 * u, 8);
                if (l.length < 8)
                    for (var C = 8 - l.length; 0 < C--; )
                        l += "\0";
                var x, p, y;
                x = (y = this.split64by32(l))[0],
                p = y[1],
                x = this.xor(x, h),
                p = this.xor(p, s),
                h = x = (y = this.encipher(x, p))[0],
                s = p = y[1],
                f += this.num2block32(x) + this.num2block32(p)
            }
            return f
        },
        decryptECB: function(t) {
            for (var o = Math.ceil(t.length / 8), h = "", s = 0; s < o; s++) {
                var n = t.substr(8 * s, 8);
                if (n.length < 8)
                    throw new Error("Зашифрованная строка повреждена: длинна зашифрованной строки должна быть кратна 8 баыйтам.");
                var c, f, u;
                c = (u = this.split64by32(n))[0],
                f = u[1],
                c = (u = this.decipher(c, f))[0],
                f = u[1],
                h += this.num2block32(c) + this.num2block32(f)
            }
            return h = this.utf8Encode(h)
        },
        decryptCBC: function(t, o) {
            var h, s, n, c, f, u = Math.ceil(t.length / 8);
            h = (f = this.split64by32(o))[0],
            s = f[1];
            for (var l = "", C = 0; C < u; C++) {
                var x = t.substr(8 * C, 8);
                if (x.length < 8)
                    throw new Error("Зашифрованная строка повреждена: длинна зашифрованной строки должна быть кратна 8 байтам.");
                var p, y, b;
                n = p = (b = this.split64by32(x))[0],
                c = y = b[1],
                p = (b = this.decipher(p, y))[0],
                y = b[1],
                p = this.xor(p, h),
                y = this.xor(y, s),
                h = n,
                s = c,
                l += this.num2block32(p) + this.num2block32(y)
            }
            return l = this.utf8Encode(l)
        },
        F: function(t) {
            var o = t >>> 24
              , h = t << 8 >>> 24
              , s = t << 16 >>> 24
              , n = t << 24 >>> 24
              , c = this.addMod32(this.sBox0[o], this.sBox1[h]);
            return c = this.xor(c, this.sBox2[s]),
            c = this.addMod32(c, this.sBox3[n])
        },
        encipher: function(t, o) {
            for (var h, s = 0; s < 16; s++)
                h = t = this.xor(t, this.pArray[s]),
                t = o = this.xor(this.F(t), o),
                o = h;
            return h = t,
            t = o,
            o = h,
            o = this.xor(o, this.pArray[16]),
            t = this.xor(t, this.pArray[17]),
            [t, o]
        },
        decipher: function(t, o) {
            var h;
            h = t = this.xor(t, this.pArray[17]),
            t = o = this.xor(o, this.pArray[16]),
            o = h;
            for (var s = 15; s >= 0; s--)
                h = t,
                t = o,
                o = h,
                o = this.xor(this.F(t), o),
                t = this.xor(t, this.pArray[s]);
            return [t, o]
        },
        generateSubkeys: function(t) {
            var o, h, s = 0, n = 0;
            for (o = 0; o < 18; o++) {
                for (h = 4; h > 0; h--)
                    s = this.fixNegative(s << 8 | t.charCodeAt(n)),
                    n = (n + 1) % t.length;
                this.pArray[o] = this.xor(this.pArray[o], s),
                s = 0
            }
            var c = [0, 0];
            for (o = 0; o < 18; o += 2)
                c = this.encipher(c[0], c[1]),
                this.pArray[o] = c[0],
                this.pArray[o + 1] = c[1];
            for (o = 0; o < 256; o += 2)
                c = this.encipher(c[0], c[1]),
                this.sBox0[o] = c[0],
                this.sBox0[o + 1] = c[1];
            for (o = 0; o < 256; o += 2)
                c = this.encipher(c[0], c[1]),
                this.sBox1[o] = c[0],
                this.sBox1[o + 1] = c[1];
            for (o = 0; o < 256; o += 2)
                c = this.encipher(c[0], c[1]),
                this.sBox2[o] = c[0],
                this.sBox2[o + 1] = c[1];
            for (o = 0; o < 256; o += 2)
                c = this.encipher(c[0], c[1]),
                this.sBox3[o] = c[0],
                this.sBox3[o + 1] = c[1]
        },
        block32toNum: function(t) {
            return this.fixNegative(t.charCodeAt(0) << 24 | t.charCodeAt(1) << 16 | t.charCodeAt(2) << 8 | t.charCodeAt(3))
        },
        num2block32: function(t) {
            return String.fromCharCode(t >>> 24) + String.fromCharCode(t << 8 >>> 24) + String.fromCharCode(t << 16 >>> 24) + String.fromCharCode(t << 24 >>> 24)
        },
        xor: function(t, o) {
            return this.fixNegative(t ^ o)
        },
        addMod32: function(t, o) {
            return this.fixNegative(t + o | 0)
        },
        fixNegative: function(t) {
            return t >>> 0
        },
        split64by32: function(t) {
            var o = t.substring(0, 4)
              , h = t.substring(4, 8);
            return [this.block32toNum(o), this.block32toNum(h)]
        },
        utf8Decode: function(t) {
            for (var o = "", h = 0; h < t.length; h++) {
                var s = t.charCodeAt(h);
                s < 128 ? o += String.fromCharCode(s) : s > 127 && s < 2048 ? (o += String.fromCharCode(s >> 6 | 192),
                o += String.fromCharCode(63 & s | 128)) : (o += String.fromCharCode(s >> 12 | 224),
                o += String.fromCharCode(s >> 6 & 63 | 128),
                o += String.fromCharCode(63 & s | 128))
            }
            return o
        },
        utf8Encode: function(t) {
            for (var o = "", h = 0, s = 0, n = 0, c = 0; h < t.length; )
                (s = t.charCodeAt(h)) < 128 ? (o += String.fromCharCode(s),
                h++) : s > 191 && s < 224 ? (n = t.charCodeAt(h + 1),
                o += String.fromCharCode((31 & s) << 6 | 63 & n),
                h += 2) : (n = t.charCodeAt(h + 1),
                c = t.charCodeAt(h + 2),
                o += String.fromCharCode((15 & s) << 12 | (63 & n) << 6 | 63 & c),
                h += 3);
            return o
        },
        base64Encode: function(t) {
            for (var o, h, s, n, c, f, u, l = "", C = 0; C < t.length; )
                n = (o = t.charCodeAt(C++)) >> 2,
                c = (3 & o) << 4 | (h = t.charCodeAt(C++)) >> 4,
                f = (15 & h) << 2 | (s = t.charCodeAt(C++)) >> 6,
                u = 63 & s,
                isNaN(h) ? f = u = 64 : isNaN(s) && (u = 64),
                l = l + this.keyStr.charAt(n) + this.keyStr.charAt(c) + this.keyStr.charAt(f) + this.keyStr.charAt(u);
            return l
        },
        base64Decode: function(t) {
            var o, h, s, n, c, f, u = "", l = 0;
            for (t = t.replace(/[^A-Za-z0-9\+\/\=]/g, ""); l < t.length; )
                o = this.keyStr.indexOf(t.charAt(l++)) << 2 | (n = this.keyStr.indexOf(t.charAt(l++))) >> 4,
                h = (15 & n) << 4 | (c = this.keyStr.indexOf(t.charAt(l++))) >> 2,
                s = (3 & c) << 6 | (f = this.keyStr.indexOf(t.charAt(l++))),
                u += String.fromCharCode(o),
                64 != c && (u += String.fromCharCode(h)),
                64 != f && (u += String.fromCharCode(s));
            return u
        },
        trimZeros: function(t) {
            return t.replace(/\0+$/g, "")
        }
    },
    t.pArray = [608135816, 2242054355, 320440878, 57701188, 2752067618, 698298832, 137296536, 3964562569, 1160258022, 953160567, 3193202383, 887688300, 3232508343, 3380367581, 1065670069, 3041331479, 2450970073, 2306472731],
    t.sBox0 = [3509652390, 2564797868, 805139163, 3491422135, 3101798381, 1780907670, 3128725573, 4046225305, 614570311, 3012652279, 134345442, 2240740374, 1667834072, 1901547113, 2757295779, 4103290238, 227898511, 1921955416, 1904987480, 2182433518, 2069144605, 3260701109, 2620446009, 720527379, 3318853667, 677414384, 3393288472, 3101374703, 2390351024, 1614419982, 1822297739, 2954791486, 3608508353, 3174124327, 2024746970, 1432378464, 3864339955, 2857741204, 1464375394, 1676153920, 1439316330, 715854006, 3033291828, 289532110, 2706671279, 2087905683, 3018724369, 1668267050, 732546397, 1947742710, 3462151702, 2609353502, 2950085171, 1814351708, 2050118529, 680887927, 999245976, 1800124847, 3300911131, 1713906067, 1641548236, 4213287313, 1216130144, 1575780402, 4018429277, 3917837745, 3693486850, 3949271944, 596196993, 3549867205, 258830323, 2213823033, 772490370, 2760122372, 1774776394, 2652871518, 566650946, 4142492826, 1728879713, 2882767088, 1783734482, 3629395816, 2517608232, 2874225571, 1861159788, 326777828, 3124490320, 2130389656, 2716951837, 967770486, 1724537150, 2185432712, 2364442137, 1164943284, 2105845187, 998989502, 3765401048, 2244026483, 1075463327, 1455516326, 1322494562, 910128902, 469688178, 1117454909, 936433444, 3490320968, 3675253459, 1240580251, 122909385, 2157517691, 634681816, 4142456567, 3825094682, 3061402683, 2540495037, 79693498, 3249098678, 1084186820, 1583128258, 426386531, 1761308591, 1047286709, 322548459, 995290223, 1845252383, 2603652396, 3431023940, 2942221577, 3202600964, 3727903485, 1712269319, 422464435, 3234572375, 1170764815, 3523960633, 3117677531, 1434042557, 442511882, 3600875718, 1076654713, 1738483198, 4213154764, 2393238008, 3677496056, 1014306527, 4251020053, 793779912, 2902807211, 842905082, 4246964064, 1395751752, 1040244610, 2656851899, 3396308128, 445077038, 3742853595, 3577915638, 679411651, 2892444358, 2354009459, 1767581616, 3150600392, 3791627101, 3102740896, 284835224, 4246832056, 1258075500, 768725851, 2589189241, 3069724005, 3532540348, 1274779536, 3789419226, 2764799539, 1660621633, 3471099624, 4011903706, 913787905, 3497959166, 737222580, 2514213453, 2928710040, 3937242737, 1804850592, 3499020752, 2949064160, 2386320175, 2390070455, 2415321851, 4061277028, 2290661394, 2416832540, 1336762016, 1754252060, 3520065937, 3014181293, 791618072, 3188594551, 3933548030, 2332172193, 3852520463, 3043980520, 413987798, 3465142937, 3030929376, 4245938359, 2093235073, 3534596313, 375366246, 2157278981, 2479649556, 555357303, 3870105701, 2008414854, 3344188149, 4221384143, 3956125452, 2067696032, 3594591187, 2921233993, 2428461, 544322398, 577241275, 1471733935, 610547355, 4027169054, 1432588573, 1507829418, 2025931657, 3646575487, 545086370, 48609733, 2200306550, 1653985193, 298326376, 1316178497, 3007786442, 2064951626, 458293330, 2589141269, 3591329599, 3164325604, 727753846, 2179363840, 146436021, 1461446943, 4069977195, 705550613, 3059967265, 3887724982, 4281599278, 3313849956, 1404054877, 2845806497, 146425753, 1854211946],
    t.sBox1 = [1266315497, 3048417604, 3681880366, 3289982499, 290971e4, 1235738493, 2632868024, 2414719590, 3970600049, 1771706367, 1449415276, 3266420449, 422970021, 1963543593, 2690192192, 3826793022, 1062508698, 1531092325, 1804592342, 2583117782, 2714934279, 4024971509, 1294809318, 4028980673, 1289560198, 2221992742, 1669523910, 35572830, 157838143, 1052438473, 1016535060, 1802137761, 1753167236, 1386275462, 3080475397, 2857371447, 1040679964, 2145300060, 2390574316, 1461121720, 2956646967, 4031777805, 4028374788, 33600511, 2920084762, 1018524850, 629373528, 3691585981, 3515945977, 2091462646, 2486323059, 586499841, 988145025, 935516892, 3367335476, 2599673255, 2839830854, 265290510, 3972581182, 2759138881, 3795373465, 1005194799, 847297441, 406762289, 1314163512, 1332590856, 1866599683, 4127851711, 750260880, 613907577, 1450815602, 3165620655, 3734664991, 3650291728, 3012275730, 3704569646, 1427272223, 778793252, 1343938022, 2676280711, 2052605720, 1946737175, 3164576444, 3914038668, 3967478842, 3682934266, 1661551462, 3294938066, 4011595847, 840292616, 3712170807, 616741398, 312560963, 711312465, 1351876610, 322626781, 1910503582, 271666773, 2175563734, 1594956187, 70604529, 3617834859, 1007753275, 1495573769, 4069517037, 2549218298, 2663038764, 504708206, 2263041392, 3941167025, 2249088522, 1514023603, 1998579484, 1312622330, 694541497, 2582060303, 2151582166, 1382467621, 776784248, 2618340202, 3323268794, 2497899128, 2784771155, 503983604, 4076293799, 907881277, 423175695, 432175456, 1378068232, 4145222326, 3954048622, 3938656102, 3820766613, 2793130115, 2977904593, 26017576, 3274890735, 3194772133, 1700274565, 1756076034, 4006520079, 3677328699, 720338349, 1533947780, 354530856, 688349552, 3973924725, 1637815568, 332179504, 3949051286, 53804574, 2852348879, 3044236432, 1282449977, 3583942155, 3416972820, 4006381244, 1617046695, 2628476075, 3002303598, 1686838959, 431878346, 2686675385, 1700445008, 1080580658, 1009431731, 832498133, 3223435511, 2605976345, 2271191193, 2516031870, 1648197032, 4164389018, 2548247927, 300782431, 375919233, 238389289, 3353747414, 2531188641, 2019080857, 1475708069, 455242339, 2609103871, 448939670, 3451063019, 1395535956, 2413381860, 1841049896, 1491858159, 885456874, 4264095073, 4001119347, 1565136089, 3898914787, 1108368660, 540939232, 1173283510, 2745871338, 3681308437, 4207628240, 3343053890, 4016749493, 1699691293, 1103962373, 3625875870, 2256883143, 3830138730, 1031889488, 3479347698, 1535977030, 4236805024, 3251091107, 2132092099, 1774941330, 1199868427, 1452454533, 157007616, 2904115357, 342012276, 595725824, 1480756522, 206960106, 497939518, 591360097, 863170706, 2375253569, 3596610801, 1814182875, 2094937945, 3421402208, 1082520231, 3463918190, 2785509508, 435703966, 3908032597, 1641649973, 2842273706, 3305899714, 1510255612, 2148256476, 2655287854, 3276092548, 4258621189, 236887753, 3681803219, 274041037, 1734335097, 3815195456, 3317970021, 1899903192, 1026095262, 4050517792, 356393447, 2410691914, 3873677099, 3682840055],
    t.sBox2 = [3913112168, 2491498743, 4132185628, 2489919796, 1091903735, 1979897079, 3170134830, 3567386728, 3557303409, 857797738, 1136121015, 1342202287, 507115054, 2535736646, 337727348, 3213592640, 1301675037, 2528481711, 1895095763, 1721773893, 3216771564, 62756741, 2142006736, 835421444, 2531993523, 1442658625, 3659876326, 2882144922, 676362277, 1392781812, 170690266, 3921047035, 1759253602, 3611846912, 1745797284, 664899054, 1329594018, 3901205900, 3045908486, 2062866102, 2865634940, 3543621612, 3464012697, 1080764994, 553557557, 3656615353, 3996768171, 991055499, 499776247, 1265440854, 648242737, 3940784050, 980351604, 3713745714, 1749149687, 3396870395, 4211799374, 3640570775, 1161844396, 3125318951, 1431517754, 545492359, 4268468663, 3499529547, 1437099964, 2702547544, 3433638243, 2581715763, 2787789398, 1060185593, 1593081372, 2418618748, 4260947970, 69676912, 2159744348, 86519011, 2512459080, 3838209314, 1220612927, 3339683548, 133810670, 1090789135, 1078426020, 1569222167, 845107691, 3583754449, 4072456591, 1091646820, 628848692, 1613405280, 3757631651, 526609435, 236106946, 48312990, 2942717905, 3402727701, 1797494240, 859738849, 992217954, 4005476642, 2243076622, 3870952857, 3732016268, 765654824, 3490871365, 2511836413, 1685915746, 3888969200, 1414112111, 2273134842, 3281911079, 4080962846, 172450625, 2569994100, 980381355, 4109958455, 2819808352, 2716589560, 2568741196, 3681446669, 3329971472, 1835478071, 660984891, 3704678404, 4045999559, 3422617507, 3040415634, 1762651403, 1719377915, 3470491036, 2693910283, 3642056355, 3138596744, 1364962596, 2073328063, 1983633131, 926494387, 3423689081, 2150032023, 4096667949, 1749200295, 3328846651, 309677260, 2016342300, 1779581495, 3079819751, 111262694, 1274766160, 443224088, 298511866, 1025883608, 3806446537, 1145181785, 168956806, 3641502830, 3584813610, 1689216846, 3666258015, 3200248200, 1692713982, 2646376535, 4042768518, 1618508792, 1610833997, 3523052358, 4130873264, 2001055236, 3610705100, 2202168115, 4028541809, 2961195399, 1006657119, 2006996926, 3186142756, 1430667929, 3210227297, 1314452623, 4074634658, 4101304120, 2273951170, 1399257539, 3367210612, 3027628629, 1190975929, 2062231137, 2333990788, 2221543033, 2438960610, 1181637006, 548689776, 2362791313, 3372408396, 3104550113, 3145860560, 296247880, 1970579870, 3078560182, 3769228297, 1714227617, 3291629107, 3898220290, 166772364, 1251581989, 493813264, 448347421, 195405023, 2709975567, 677966185, 3703036547, 1463355134, 2715995803, 1338867538, 1343315457, 2802222074, 2684532164, 233230375, 2599980071, 2000651841, 3277868038, 1638401717, 4028070440, 3237316320, 6314154, 819756386, 300326615, 590932579, 1405279636, 3267499572, 3150704214, 2428286686, 3959192993, 3461946742, 1862657033, 1266418056, 963775037, 2089974820, 2263052895, 1917689273, 448879540, 3550394620, 3981727096, 150775221, 3627908307, 1303187396, 508620638, 2975983352, 2726630617, 1817252668, 1876281319, 1457606340, 908771278, 3720792119, 3617206836, 2455994898, 1729034894, 1080033504],
    t.sBox3 = [976866871, 3556439503, 2881648439, 1522871579, 1555064734, 1336096578, 3548522304, 2579274686, 3574697629, 3205460757, 3593280638, 3338716283, 3079412587, 564236357, 2993598910, 1781952180, 1464380207, 3163844217, 3332601554, 1699332808, 1393555694, 1183702653, 3581086237, 1288719814, 691649499, 2847557200, 2895455976, 3193889540, 2717570544, 1781354906, 1676643554, 2592534050, 3230253752, 1126444790, 2770207658, 2633158820, 2210423226, 2615765581, 2414155088, 3127139286, 673620729, 2805611233, 1269405062, 4015350505, 3341807571, 4149409754, 1057255273, 2012875353, 2162469141, 2276492801, 2601117357, 993977747, 3918593370, 2654263191, 753973209, 36408145, 2530585658, 25011837, 3520020182, 2088578344, 530523599, 2918365339, 1524020338, 1518925132, 3760827505, 3759777254, 1202760957, 3985898139, 3906192525, 674977740, 4174734889, 2031300136, 2019492241, 3983892565, 4153806404, 3822280332, 352677332, 2297720250, 60907813, 90501309, 3286998549, 1016092578, 2535922412, 2839152426, 457141659, 509813237, 4120667899, 652014361, 1966332200, 2975202805, 55981186, 2327461051, 676427537, 3255491064, 2882294119, 3433927263, 1307055953, 942726286, 933058658, 2468411793, 3933900994, 4215176142, 1361170020, 2001714738, 2830558078, 3274259782, 1222529897, 1679025792, 2729314320, 3714953764, 1770335741, 151462246, 3013232138, 1682292957, 1483529935, 471910574, 1539241949, 458788160, 3436315007, 1807016891, 3718408830, 978976581, 1043663428, 3165965781, 1927990952, 4200891579, 2372276910, 3208408903, 3533431907, 1412390302, 2931980059, 4132332400, 1947078029, 3881505623, 4168226417, 2941484381, 1077988104, 1320477388, 886195818, 18198404, 3786409e3, 2509781533, 112762804, 3463356488, 1866414978, 891333506, 18488651, 661792760, 1628790961, 3885187036, 3141171499, 876946877, 2693282273, 1372485963, 791857591, 2686433993, 3759982718, 3167212022, 3472953795, 2716379847, 445679433, 3561995674, 3504004811, 3574258232, 54117162, 3331405415, 2381918588, 3769707343, 4154350007, 1140177722, 4074052095, 668550556, 3214352940, 367459370, 261225585, 2610173221, 4209349473, 3468074219, 3265815641, 314222801, 3066103646, 3808782860, 282218597, 3406013506, 3773591054, 379116347, 1285071038, 846784868, 2669647154, 3771962079, 3550491691, 2305946142, 453669953, 1268987020, 3317592352, 3279303384, 3744833421, 2610507566, 3859509063, 266596637, 3847019092, 517658769, 3462560207, 3443424879, 370717030, 4247526661, 2224018117, 4143653529, 4112773975, 2788324899, 2477274417, 1456262402, 2901442914, 1517677493, 1846949527, 2295493580, 3734397586, 2176403920, 1280348187, 1908823572, 3871786941, 846861322, 1172426758, 3287448474, 3383383037, 1655181056, 3139813346, 901632758, 1897031941, 2986607138, 3066810236, 3447102507, 1393639104, 373351379, 950779232, 625454576, 3124240540, 4148612726, 2007998917, 544563296, 2244738638, 2330496472, 2058025392, 1291430526, 424198748, 50039436, 29584100, 3605783033, 2429876329, 2791104160, 1057563949, 3255363231, 3075367218, 3463963227, 1469046755, 985887462],
    m.exports = t
}, 3407923, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'BDServerConfig';
    var n = {
        parseConfig(n) {
            const s = [];
            try {
                const o = n.sc
                  , l = new Map(o.c);
                if (l.forEach((t,n)=>s.push(new (i(d[0]))(n,t))),
                0 === l.size)
                    return void i(d[1]).logError(t, r(d[2]).OPERATIONS.EMPTY_SIGNAL_CONFIG);
                i(d[3]).get().setClientReputationTier(n.rt).addMultipleSignalsToClientConfig(s).setPeriodicCollectionIntervalSeconds(n.i).setConfigGenerationTimeStamp(o.t).setAllTiersFlushDurationMinutes(n.fd).setStaticSignalBufferSize(n.sbs).setDynamicSignalBufferSize(n.dbs).setBiometricSignalBufferSize(n.bbs).setSID(n.sid).setHeartbeatConfig(n.hbc).setParsingDone(!0)
            } catch (n) {
                i(d[1]).logError(t, r(d[2]).OPERATIONS.PARSE_CONFIG_ERROR, {
                    e: n
                })
            }
        }
    };
    e.default = n
}, 3407924, [3407925, 3407874, 3407878, 3407879]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const s = 'BDServerSignalConfig';
    var t = class {
        constructor(s, t, l) {
            this.parsedSignalFlags = [],
            this.signalId = s,
            this.signalFlags = t,
            this.bufferSize = l
        }
        getSignalId() {
            return this.signalId
        }
        getSignalFlags() {
            return 0 === this.parsedSignalFlags.length && Object.keys(i(d[0])).forEach(s=>{
                (i(d[0])[s] & this.signalFlags) === i(d[0])[s] && this.parsedSignalFlags.push(i(d[0])[s])
            }
            ),
            0 === this.parsedSignalFlags.length && i(d[1]).logError(s, r(d[2]).OPERATIONS.SIGNAL_FLAGS_MISSING, {
                id: this.signalId.toString(),
                flags: this.signalFlags.toString()
            }),
            this.parsedSignalFlags
        }
        getBufferSize() {
            return null != this.bufferSize ? this.bufferSize : 0
        }
    }
    ;
    e.default = t
}, 3407925, [3407886, 3407874, 3407878]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'hb_timestamp'
      , l = 'BDHeartbeatSignalCollectionManager';
    let n = !1
      , o = !1
      , s = null
      , c = null
      , u = null;
    const H = i(d[0]).get();
    class b {
        static resetHeartbeatCollectionTimestamp() {
            a(d[1]).setTimestampInStorage(0, t, l)
        }
        static resetHeartbeatStarted() {
            n = !1,
            o = !1
        }
        static isHeartbeatStarted() {
            return n
        }
        static isHeartbeatDelayed() {
            return o
        }
        static startHeartbeatDelayed() {
            if (n || o)
                return;
            const s = a(d[1]).getTimestampFromStorage(t, l)
              , u = Date.now() - s;
            try {
                u >= H.getHeartbeatIntervalMs() ? b.startHeartbeat() : (c = window.setTimeout(()=>b.startHeartbeat(), H.getHeartbeatIntervalMs() - u),
                o = !0)
            } catch (t) {
                i(d[2]).logError(l, r(d[3]).OPERATIONS.HB_START_FAILURE, {
                    lastBeatSince: u.toString(),
                    hbi: H.getHeartbeatIntervalMs().toString(),
                    e: t
                })
            }
        }
        static startHeartbeat() {
            !n && H.getHeartbeatIntervalMs() > 0 && (b.collectHeartbeatRecursive(H.getHeartbeatCriticalBurstCount(), H.getHeartbeatVitalBurstCount()),
            null != s && (window.clearInterval(s),
            i(d[2]).logWarning(l, r(d[3]).OPERATIONS.HB_ALREADY_RUNNING)),
            s = window.setInterval(()=>b.collectHeartbeatRecursive(H.getHeartbeatCriticalBurstCount(), H.getHeartbeatVitalBurstCount()), H.getHeartbeatIntervalMs()),
            n = !0)
        }
        static stopHeartbeat() {
            null != u && window.clearTimeout(u),
            null != s && window.clearInterval(s),
            null != c && window.clearTimeout(c),
            b.resetHeartbeatStarted()
        }
        static collectHeartbeatRecursive(t, l) {
            t <= 0 && l <= 0 || (t > 0 && b.collectHeartbeat(),
            l > 0 && b.collectHeartbeat(),
            (t > 1 || l > 1) && (u = window.setTimeout(()=>b.collectHeartbeatRecursive(t - 1, l - 1), H.getHeartbeatBurstIntervalMs())))
        }
        static collectHeartbeat() {
            var n, o;
            const s = null === H || void 0 === H ? void 0 : null === (n = H.getHeartbeatSignal()) || void 0 === n ? void 0 : null === (o = n.getSignalCollector(H.getClientReputationTier())) || void 0 === o ? void 0 : o.executeSignalCollection();
            null != s ? (i(d[2]).logInfo(l, r(d[3]).OPERATIONS.HB_COLLECTED, {
                urgency: 'ig_default'
            }),
            b.postHeartbeat(s) && a(d[1]).setTimestampInStorage(Date.now(), t, l)) : i(d[2]).logError(l, r(d[3]).OPERATIONS.HB_COLLECTION_FAILED, {
                urgency: 'ig_default'
            })
        }
        static postHeartbeat(t) {
            const l = {};
            l[i(d[4]).HEARTBEAT_V2] = [null === t || void 0 === t ? void 0 : t.valueOrError];
            const n = JSON.stringify(l);
            return r(d[5]).BDClientSignalLogger.postSignalsHelper(n)
        }
    }
    e.HEARTBEAT_TIMESTAMP_STORAGE_KEY = t,
    e.BDHeartbeatSignalCollectionManager = b
}, 3407926, [3407879, 3407873, 3407874, 3407878, 3407892, 3407921]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const t = 'BDPeriodicSignalsCollectionManager'
      , l = 'signal_flush_timestamp';
    let n = null
      , s = null
      , o = null;
    const c = i(d[0]).get();
    class S {
        static resetPeriodicCollectionTimestamp() {
            a(d[1]).setTimestampInStorage(0, l, t)
        }
        static async startSignalPosting() {
            const s = a(d[1]).getTimestampFromStorage(l, t)
              , o = Date.now() - s;
            o >= c.getAllTiersFlushDurationMs() ? await S.postSignalsIntermittently() : n = window.setTimeout(()=>{
                S.postSignalsIntermittently()
            }
            , c.getAllTiersFlushDurationMs() - o)
        }
        static stopSignalPosting() {
            null != n && window.clearTimeout(n),
            null != s && window.clearInterval(s)
        }
        static async collectStaticSignals() {
            await S.collectSignalsOneTime(c.getStaticSignals())
        }
        static collectDynamicSignals() {
            S.stopDynamicSignalCollection(),
            o = window.setInterval(async()=>{
                await S.collectSignalsOneTime(c.getDynamicSignals())
            }
            , c.getPeriodicCollectionIntervalMs())
        }
        static collectBiometricSignals() {
            S.collectSignalsOneTime(c.getBiometricSignals())
        }
        static async postSignals(n) {
            await S.collectStaticSignals(),
            r(d[2]).BDClientSignalLogger.postSignalsHelper(a(d[3]).getSignalsAsJSONString(n)) && a(d[1]).setTimestampInStorage(Date.now(), l, t)
        }
        static stopDynamicSignalCollection() {
            null != o && (window.clearInterval(o),
            o = null)
        }
        static postSignalsIntermittently() {
            S.postSignals([i(d[4]).STATIC]),
            s = window.setInterval(()=>{
                S.postSignals([i(d[4]).STATIC, i(d[4]).DYNAMIC, i(d[4]).BIOMETRIC])
            }
            , c.getAllTiersFlushDurationMs())
        }
        static postBiometricSignals() {
            r(d[2]).BDClientSignalLogger.postSignalsHelper(a(d[3]).getSignalsAsJSONString([i(d[4]).BIOMETRIC])) && a(d[3]).clearBiometricSignals()
        }
        static async collectSignalsOneTime(t) {
            const l = c.getClientReputationTier();
            l !== i(d[5]).BENIGN_IGNORE && await i(d[6]).get().collectSignals(t, l)
        }
    }
    e.BDPeriodicSignalsCollectionManager = S
}, 3407927, [3407879, 3407873, 3407921, 3407928, 3407929, 3407880, 3407930]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    function n(n) {
        if (!(n in i(d[0])))
            throw new Error('Tried to clear signal buffer that was not intialized:');
        i(d[0])[n].values = []
    }
    function t(n) {
        return i(d[0])[n].values
    }
    function l(n) {
        const l = {};
        for (const o of n)
            o in i(d[0]) && (l[o] = t(o).map(n=>n.valueOrError));
        return l
    }
    function o(n) {
        const t = i(d[4]).get();
        let l = [];
        return n.forEach(n=>{
            switch (n) {
            case i(d[5]).STATIC:
                l = [...l, ...t.getStaticSignals()];
                break;
            case i(d[5]).DYNAMIC:
                l = [...l, ...t.getDynamicSignals()];
                break;
            case i(d[5]).BIOMETRIC:
                l = [...l, ...t.getBiometricSignals()]
            }
        }
        ),
        l.map(n=>n.signalType)
    }
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const s = 'BDSignalBuffer';
    e.initialize = function(n, t, l) {
        if (n in i(d[0]))
            return;
        let o = 1;
        void 0 !== t && (o = t),
        i(d[0])[n] = {
            values: [],
            max_buffer_size: o,
            signal_flags: null !== l && void 0 !== l ? l : []
        }
    }
    ,
    e.clearBuffer = n,
    e.appendSignal = function(n, t) {
        if (!(n in i(d[0])))
            throw i(d[2]).logError(s, r(d[3]).OPERATIONS.APPEND_SIGNAL_FAIL, {
                id: n.toString()
            }),
            new Error('Tried to append signal that was not intialized:');
        {
            const l = i(d[0])[n]
              , o = l.max_buffer_size;
            l.values.length >= o && (l.signal_flags.includes(i(d[1]).BIOMETRIC) || l.values.shift()),
            l.values.push(t),
            i(d[2]).logInfo(s, r(d[3]).OPERATIONS.APPEND_SIGNAL, {
                id: n.toString()
            })
        }
    }
    ,
    e.clearBiometricSignals = function() {
        i(d[4]).get().getBiometricSignals().forEach(t=>{
            t.signalType in i(d[0]) && n(t.signalType)
        }
        )
    }
    ,
    e.getLastSignalFormatBySignalId = function(n) {
        var t;
        const l = i(d[0])[n]
          , o = null === l || void 0 === l ? void 0 : null === (t = l.values) || void 0 === t ? void 0 : t.length;
        return null != o && o > 0 ? l.values[o - 1] : {
            valueOrError: void 0
        }
    }
    ,
    e.retrieveSignal = t,
    e.retrieveSignals = l,
    e.getSignalsAsJSONString = function(n) {
        const t = o(n);
        return JSON.stringify(l(t))
    }
    ,
    e._getSignalIdsByCollectionType = o
}, 3407928, [3407891, 3407886, 3407874, 3407878, 3407879, 3407929]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    var t = Object.freeze({
        STATIC: 0,
        DYNAMIC: 1,
        BIOMETRIC: 2
    });
    e.default = t
}, 3407929, []);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    const l = 'SignalCollectionManager';
    let n = null;
    const t = {
        get: ()=>(null == n && (n = new class {
            async collectSignals(l, n) {
                const t = [];
                l.forEach(l=>{
                    l.signalFlags.includes(i(d[0]).BIOMETRIC) ? this.$SignalCollectionManager1(l, n) : t.push(this.$SignalCollectionManager2(l, n))
                }
                ),
                await Promise.all(t)
            }
            isEqualToLastCollectedSignal(l, n) {
                const t = a(d[1]).getLastSignalFormatBySignalId(n.signalType);
                return null != t.valueOrError && l.isEqual(t.valueOrError, new Set(n.signalFlags))
            }
            getCircularBufferSize(l) {
                const n = i(d[2]).get()
                  , t = n.getBufferSizeBySignalId(l.signalType);
                return null != t && n.getBufferSizeBySignalId(l.signalType) > 0 ? t : l.signalFlags.includes(i(d[0]).DYNAMIC) ? l.signalFlags.includes(i(d[0]).BIOMETRIC) ? n.getBiometricSignalBufferSize() : n.getDynamicSignalBufferSize() : n.getStaticSignalBufferSize()
            }
            async $SignalCollectionManager2(n, t) {
                const s = n.getSignalCollector(t);
                if (null != s) {
                    null == n.getBufferConfig() && a(d[1]).initialize(n.signalType, this.getCircularBufferSize(n), n.signalFlags);
                    try {
                        const t = await s.executeAsyncSignalCollection();
                        t.valueOrError && !this.isEqualToLastCollectedSignal(t.valueOrError, n) && a(d[1]).appendSignal(n.signalType, t)
                    } catch (n) {
                        i(d[3]).logError(l, r(d[4]).OPERATIONS.BD_EXCEPTION, {
                            error: n
                        })
                    }
                }
            }
            $SignalCollectionManager1(l, n) {
                const t = l.getSignalCollector(n);
                null != t && t instanceof r(d[5]).BDBiometricSignalCollectorBase && (null == l.getBufferConfig() && a(d[1]).initialize(l.signalType, this.getCircularBufferSize(l), l.signalFlags),
                t.listenForSignals())
            }
        }
        ),
        n)
    };
    m.exports = t
}, 3407930, [3407886, 3407928, 3407879, 3407874, 3407878, 3407916]);
__d(function(g, r, i, a, m, e, d) {
    'use strict';
    Object.defineProperty(e, '__esModule', {
        value: !0
    });
    const b = 24;
    e.DEFAULT_BD_CHALLENGE_TIME_WINDOW_HOURS = b,
    e.getBdChallengeDefaultConfig = function(t, c, n) {
        return {
            bbs: 100,
            ctw: b,
            dbs: 100,
            fd: 30,
            hbc: {
                hbbi: 30,
                hbcbc: 2,
                hbi: 60,
                hbv: n,
                hbvbc: 0
            },
            i: 60,
            rt: c,
            sbs: 1,
            sc: {
                c: new Map([[3e4, 838801], [30001, 838801], [30002, 838801], [30003, 838801], [30004, 838801], [30005, 838801], [30006, 573585], [30007, 838801], [30008, 838801], [30009, 573585], [30010, 573585], [30012, 573585], [30015, 540817], [30018, 540817], [30040, 540817], [30100, 541591], [30101, 541591], [30102, 541591], [30103, 541591], [30104, 541591], [38e3, 541427], [38001, 806643]]),
                t: 1612206578
            },
            sid: t
        }
    }
}, 3407931, []);
