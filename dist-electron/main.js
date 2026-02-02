import Ac from "electron";
import Zt from "path";
import Xt from "fs";
import cl from "util";
function ol(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function fl(e) {
  if (Object.prototype.hasOwnProperty.call(e, "__esModule")) return e;
  var t = e.default;
  if (typeof t == "function") {
    var r = function a() {
      var n = !1;
      try {
        n = this instanceof a;
      } catch {
      }
      return n ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    r.prototype = t.prototype;
  } else r = {};
  return Object.defineProperty(r, "__esModule", { value: !0 }), Object.keys(e).forEach(function(a) {
    var n = Object.getOwnPropertyDescriptor(e, a);
    Object.defineProperty(r, a, n.get ? n : {
      enumerable: !0,
      get: function() {
        return e[a];
      }
    });
  }), r;
}
var Ws = {}, Na = {}, vn = { exports: {} };
function Nc(e) {
  throw new Error('Could not dynamically require "' + e + '". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.');
}
var Ca = {}, Hs;
function Et() {
  return Hs || (Hs = 1, Ca.getBooleanOption = (e, t) => {
    let r = !1;
    if (t in e && typeof (r = e[t]) != "boolean")
      throw new TypeError(`Expected the "${t}" option to be a boolean`);
    return r;
  }, Ca.cppdb = /* @__PURE__ */ Symbol(), Ca.inspect = /* @__PURE__ */ Symbol.for("nodejs.util.inspect.custom")), Ca;
}
var ai, Gs;
function Cc() {
  if (Gs) return ai;
  Gs = 1;
  const e = { value: "SqliteError", writable: !0, enumerable: !1, configurable: !0 };
  function t(r, a) {
    if (new.target !== t)
      return new t(r, a);
    if (typeof a != "string")
      throw new TypeError("Expected second argument to be a string");
    Error.call(this, r), e.value = "" + r, Object.defineProperty(this, "message", e), Error.captureStackTrace(this, t), this.code = a;
  }
  return Object.setPrototypeOf(t, Error), Object.setPrototypeOf(t.prototype, Error.prototype), Object.defineProperty(t.prototype, "name", e), ai = t, ai;
}
var gn = { exports: {} }, ni, Vs;
function ll() {
  if (Vs) return ni;
  Vs = 1;
  var e = Zt.sep || "/";
  ni = t;
  function t(r) {
    if (typeof r != "string" || r.length <= 7 || r.substring(0, 7) != "file://")
      throw new TypeError("must pass in a file:// URI to convert to a file path");
    var a = decodeURI(r.substring(7)), n = a.indexOf("/"), i = a.substring(0, n), s = a.substring(n + 1);
    return i == "localhost" && (i = ""), i && (i = e + e + i), s = s.replace(/^(.+)\|/, "$1:"), e == "\\" && (s = s.replace(/\//g, "\\")), /^.+\:/.test(s) || (s = e + s), i + s;
  }
  return ni;
}
var zs;
function ul() {
  return zs || (zs = 1, (function(e, t) {
    var r = Xt, a = Zt, n = ll(), i = a.join, s = a.dirname, c = r.accessSync && function(f) {
      try {
        r.accessSync(f);
      } catch {
        return !1;
      }
      return !0;
    } || r.existsSync || a.existsSync, o = {
      arrow: process.env.NODE_BINDINGS_ARROW || " → ",
      compiled: process.env.NODE_BINDINGS_COMPILED_DIR || "compiled",
      platform: process.platform,
      arch: process.arch,
      nodePreGyp: "node-v" + process.versions.modules + "-" + process.platform + "-" + process.arch,
      version: process.versions.node,
      bindings: "bindings.node",
      try: [
        // node-gyp's linked version in the "build" dir
        ["module_root", "build", "bindings"],
        // node-waf and gyp_addon (a.k.a node-gyp)
        ["module_root", "build", "Debug", "bindings"],
        ["module_root", "build", "Release", "bindings"],
        // Debug files, for development (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Debug", "bindings"],
        ["module_root", "Debug", "bindings"],
        // Release files, but manually compiled (legacy behavior, remove for node v0.9)
        ["module_root", "out", "Release", "bindings"],
        ["module_root", "Release", "bindings"],
        // Legacy from node-waf, node <= 0.4.x
        ["module_root", "build", "default", "bindings"],
        // Production "Release" buildtype binary (meh...)
        ["module_root", "compiled", "version", "platform", "arch", "bindings"],
        // node-qbs builds
        ["module_root", "addon-build", "release", "install-root", "bindings"],
        ["module_root", "addon-build", "debug", "install-root", "bindings"],
        ["module_root", "addon-build", "default", "install-root", "bindings"],
        // node-pre-gyp path ./lib/binding/{node_abi}-{platform}-{arch}
        ["module_root", "lib", "binding", "nodePreGyp", "bindings"]
      ]
    };
    function l(f) {
      typeof f == "string" ? f = { bindings: f } : f || (f = {}), Object.keys(o).map(function(E) {
        E in f || (f[E] = o[E]);
      }), f.module_root || (f.module_root = t.getRoot(t.getFileName())), a.extname(f.bindings) != ".node" && (f.bindings += ".node");
      for (var d = typeof __webpack_require__ == "function" ? __non_webpack_require__ : Nc, h = [], p = 0, m = f.try.length, x, u, v; p < m; p++) {
        x = i.apply(
          null,
          f.try[p].map(function(E) {
            return f[E] || E;
          })
        ), h.push(x);
        try {
          return u = f.path ? d.resolve(x) : d(x), f.path || (u.path = x), u;
        } catch (E) {
          if (E.code !== "MODULE_NOT_FOUND" && E.code !== "QUALIFIED_PATH_RESOLUTION_FAILED" && !/not find/i.test(E.message))
            throw E;
        }
      }
      throw v = new Error(
        `Could not locate the bindings file. Tried:
` + h.map(function(E) {
          return f.arrow + E;
        }).join(`
`)
      ), v.tries = h, v;
    }
    e.exports = t = l, t.getFileName = function(d) {
      var h = Error.prepareStackTrace, p = Error.stackTraceLimit, m = {}, x;
      Error.stackTraceLimit = 10, Error.prepareStackTrace = function(v, E) {
        for (var g = 0, y = E.length; g < y; g++)
          if (x = E[g].getFileName(), x !== __filename)
            if (d) {
              if (x !== d)
                return;
            } else
              return;
      }, Error.captureStackTrace(m), m.stack, Error.prepareStackTrace = h, Error.stackTraceLimit = p;
      var u = "file://";
      return x.indexOf(u) === 0 && (x = n(x)), x;
    }, t.getRoot = function(d) {
      for (var h = s(d), p; ; ) {
        if (h === "." && (h = process.cwd()), c(i(h, "package.json")) || c(i(h, "node_modules")))
          return h;
        if (p === h)
          throw new Error(
            'Could not find module root given file: "' + d + '". Do you have a `package.json` file? '
          );
        p = h, h = i(h, "..");
      }
    };
  })(gn, gn.exports)), gn.exports;
}
var pt = {}, Ys;
function hl() {
  if (Ys) return pt;
  Ys = 1;
  const { cppdb: e } = Et();
  return pt.prepare = function(r) {
    return this[e].prepare(r, this, !1);
  }, pt.exec = function(r) {
    return this[e].exec(r), this;
  }, pt.close = function() {
    return this[e].close(), this;
  }, pt.loadExtension = function(...r) {
    return this[e].loadExtension(...r), this;
  }, pt.defaultSafeIntegers = function(...r) {
    return this[e].defaultSafeIntegers(...r), this;
  }, pt.unsafeMode = function(...r) {
    return this[e].unsafeMode(...r), this;
  }, pt.getters = {
    name: {
      get: function() {
        return this[e].name;
      },
      enumerable: !0
    },
    open: {
      get: function() {
        return this[e].open;
      },
      enumerable: !0
    },
    inTransaction: {
      get: function() {
        return this[e].inTransaction;
      },
      enumerable: !0
    },
    readonly: {
      get: function() {
        return this[e].readonly;
      },
      enumerable: !0
    },
    memory: {
      get: function() {
        return this[e].memory;
      },
      enumerable: !0
    }
  }, pt;
}
var ii, js;
function dl() {
  if (js) return ii;
  js = 1;
  const { cppdb: e } = Et(), t = /* @__PURE__ */ new WeakMap();
  ii = function(i) {
    if (typeof i != "function") throw new TypeError("Expected first argument to be a function");
    const s = this[e], c = r(s, this), { apply: o } = Function.prototype, l = {
      default: { value: a(o, i, s, c.default) },
      deferred: { value: a(o, i, s, c.deferred) },
      immediate: { value: a(o, i, s, c.immediate) },
      exclusive: { value: a(o, i, s, c.exclusive) },
      database: { value: this, enumerable: !0 }
    };
    return Object.defineProperties(l.default.value, l), Object.defineProperties(l.deferred.value, l), Object.defineProperties(l.immediate.value, l), Object.defineProperties(l.exclusive.value, l), l.default.value;
  };
  const r = (n, i) => {
    let s = t.get(n);
    if (!s) {
      const c = {
        commit: n.prepare("COMMIT", i, !1),
        rollback: n.prepare("ROLLBACK", i, !1),
        savepoint: n.prepare("SAVEPOINT `	_bs3.	`", i, !1),
        release: n.prepare("RELEASE `	_bs3.	`", i, !1),
        rollbackTo: n.prepare("ROLLBACK TO `	_bs3.	`", i, !1)
      };
      t.set(n, s = {
        default: Object.assign({ begin: n.prepare("BEGIN", i, !1) }, c),
        deferred: Object.assign({ begin: n.prepare("BEGIN DEFERRED", i, !1) }, c),
        immediate: Object.assign({ begin: n.prepare("BEGIN IMMEDIATE", i, !1) }, c),
        exclusive: Object.assign({ begin: n.prepare("BEGIN EXCLUSIVE", i, !1) }, c)
      });
    }
    return s;
  }, a = (n, i, s, { begin: c, commit: o, rollback: l, savepoint: f, release: d, rollbackTo: h }) => function() {
    let m, x, u;
    s.inTransaction ? (m = f, x = d, u = h) : (m = c, x = o, u = l), m.run();
    try {
      const v = n.call(i, this, arguments);
      if (v && typeof v.then == "function")
        throw new TypeError("Transaction function cannot return a promise");
      return x.run(), v;
    } catch (v) {
      throw s.inTransaction && (u.run(), u !== l && x.run()), v;
    }
  };
  return ii;
}
var si, Ks;
function xl() {
  if (Ks) return si;
  Ks = 1;
  const { getBooleanOption: e, cppdb: t } = Et();
  return si = function(a, n) {
    if (n == null && (n = {}), typeof a != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof n != "object") throw new TypeError("Expected second argument to be an options object");
    const i = e(n, "simple"), s = this[t].prepare(`PRAGMA ${a}`, this, !0);
    return i ? s.pluck().get() : s.all();
  }, si;
}
var ci, qs;
function pl() {
  if (qs) return ci;
  qs = 1;
  const e = Xt, t = Zt, { promisify: r } = cl, { cppdb: a } = Et(), n = r(e.access);
  ci = async function(c, o) {
    if (o == null && (o = {}), typeof c != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof o != "object") throw new TypeError("Expected second argument to be an options object");
    c = c.trim();
    const l = "attached" in o ? o.attached : "main", f = "progress" in o ? o.progress : null;
    if (!c) throw new TypeError("Backup filename cannot be an empty string");
    if (c === ":memory:") throw new TypeError('Invalid backup filename ":memory:"');
    if (typeof l != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!l) throw new TypeError('The "attached" option cannot be an empty string');
    if (f != null && typeof f != "function") throw new TypeError('Expected the "progress" option to be a function');
    await n(t.dirname(c)).catch(() => {
      throw new TypeError("Cannot save backup because the directory does not exist");
    });
    const d = await n(c).then(() => !1, () => !0);
    return i(this[a].backup(this, l, c, d), f || null);
  };
  const i = (s, c) => {
    let o = 0, l = !0;
    return new Promise((f, d) => {
      setImmediate(function h() {
        try {
          const p = s.transfer(o);
          if (!p.remainingPages) {
            s.close(), f(p);
            return;
          }
          if (l && (l = !1, o = 100), c) {
            const m = c(p);
            if (m !== void 0)
              if (typeof m == "number" && m === m) o = Math.max(0, Math.min(2147483647, Math.round(m)));
              else throw new TypeError("Expected progress callback to return a number or undefined");
          }
          setImmediate(h);
        } catch (p) {
          s.close(), d(p);
        }
      });
    });
  };
  return ci;
}
var oi, $s;
function ml() {
  if ($s) return oi;
  $s = 1;
  const { cppdb: e } = Et();
  return oi = function(r) {
    if (r == null && (r = {}), typeof r != "object") throw new TypeError("Expected first argument to be an options object");
    const a = "attached" in r ? r.attached : "main";
    if (typeof a != "string") throw new TypeError('Expected the "attached" option to be a string');
    if (!a) throw new TypeError('The "attached" option cannot be an empty string');
    return this[e].serialize(a);
  }, oi;
}
var fi, Js;
function vl() {
  if (Js) return fi;
  Js = 1;
  const { getBooleanOption: e, cppdb: t } = Et();
  return fi = function(a, n, i) {
    if (n == null && (n = {}), typeof n == "function" && (i = n, n = {}), typeof a != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof i != "function") throw new TypeError("Expected last argument to be a function");
    if (typeof n != "object") throw new TypeError("Expected second argument to be an options object");
    if (!a) throw new TypeError("User-defined function name cannot be an empty string");
    const s = "safeIntegers" in n ? +e(n, "safeIntegers") : 2, c = e(n, "deterministic"), o = e(n, "directOnly"), l = e(n, "varargs");
    let f = -1;
    if (!l) {
      if (f = i.length, !Number.isInteger(f) || f < 0) throw new TypeError("Expected function.length to be a positive integer");
      if (f > 100) throw new RangeError("User-defined functions cannot have more than 100 arguments");
    }
    return this[t].function(i, a, f, s, c, o), this;
  }, fi;
}
var li, Zs;
function gl() {
  if (Zs) return li;
  Zs = 1;
  const { getBooleanOption: e, cppdb: t } = Et();
  li = function(i, s) {
    if (typeof i != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof s != "object" || s === null) throw new TypeError("Expected second argument to be an options object");
    if (!i) throw new TypeError("User-defined function name cannot be an empty string");
    const c = "start" in s ? s.start : null, o = r(s, "step", !0), l = r(s, "inverse", !1), f = r(s, "result", !1), d = "safeIntegers" in s ? +e(s, "safeIntegers") : 2, h = e(s, "deterministic"), p = e(s, "directOnly"), m = e(s, "varargs");
    let x = -1;
    if (!m && (x = Math.max(a(o), l ? a(l) : 0), x > 0 && (x -= 1), x > 100))
      throw new RangeError("User-defined functions cannot have more than 100 arguments");
    return this[t].aggregate(c, o, l, f, i, x, d, h, p), this;
  };
  const r = (n, i, s) => {
    const c = i in n ? n[i] : null;
    if (typeof c == "function") return c;
    if (c != null) throw new TypeError(`Expected the "${i}" option to be a function`);
    if (s) throw new TypeError(`Missing required option "${i}"`);
    return null;
  }, a = ({ length: n }) => {
    if (Number.isInteger(n) && n >= 0) return n;
    throw new TypeError("Expected function.length to be a positive integer");
  };
  return li;
}
var ui, Qs;
function El() {
  if (Qs) return ui;
  Qs = 1;
  const { cppdb: e } = Et();
  ui = function(p, m) {
    if (typeof p != "string") throw new TypeError("Expected first argument to be a string");
    if (!p) throw new TypeError("Virtual table module name cannot be an empty string");
    let x = !1;
    if (typeof m == "object" && m !== null)
      x = !0, m = d(r(m, "used", p));
    else {
      if (typeof m != "function") throw new TypeError("Expected second argument to be a function or a table definition object");
      m = t(m);
    }
    return this[e].table(m, p, x), this;
  };
  function t(h) {
    return function(m, x, u, ...v) {
      const E = {
        module: m,
        database: x,
        table: u
      }, g = o.call(h, E, v);
      if (typeof g != "object" || g === null)
        throw new TypeError(`Virtual table module "${m}" did not return a table definition object`);
      return r(g, "returned", m);
    };
  }
  function r(h, p, m) {
    if (!c.call(h, "rows"))
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition without a "rows" property`);
    if (!c.call(h, "columns"))
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition without a "columns" property`);
    const x = h.rows;
    if (typeof x != "function" || Object.getPrototypeOf(x) !== l)
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition with an invalid "rows" property (should be a generator function)`);
    let u = h.columns;
    if (!Array.isArray(u) || !(u = [...u]).every((N) => typeof N == "string"))
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition with an invalid "columns" property (should be an array of strings)`);
    if (u.length !== new Set(u).size)
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition with duplicate column names`);
    if (!u.length)
      throw new RangeError(`Virtual table module "${m}" ${p} a table definition with zero columns`);
    let v;
    if (c.call(h, "parameters")) {
      if (v = h.parameters, !Array.isArray(v) || !(v = [...v]).every((N) => typeof N == "string"))
        throw new TypeError(`Virtual table module "${m}" ${p} a table definition with an invalid "parameters" property (should be an array of strings)`);
    } else
      v = s(x);
    if (v.length !== new Set(v).size)
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition with duplicate parameter names`);
    if (v.length > 32)
      throw new RangeError(`Virtual table module "${m}" ${p} a table definition with more than the maximum number of 32 parameters`);
    for (const N of v)
      if (u.includes(N))
        throw new TypeError(`Virtual table module "${m}" ${p} a table definition with column "${N}" which was ambiguously defined as both a column and parameter`);
    let E = 2;
    if (c.call(h, "safeIntegers")) {
      const N = h.safeIntegers;
      if (typeof N != "boolean")
        throw new TypeError(`Virtual table module "${m}" ${p} a table definition with an invalid "safeIntegers" property (should be a boolean)`);
      E = +N;
    }
    let g = !1;
    if (c.call(h, "directOnly") && (g = h.directOnly, typeof g != "boolean"))
      throw new TypeError(`Virtual table module "${m}" ${p} a table definition with an invalid "directOnly" property (should be a boolean)`);
    return [
      `CREATE TABLE x(${[
        ...v.map(f).map((N) => `${N} HIDDEN`),
        ...u.map(f)
      ].join(", ")});`,
      a(x, new Map(u.map((N, A) => [N, v.length + A])), m),
      v,
      E,
      g
    ];
  }
  function a(h, p, m) {
    return function* (...u) {
      const v = u.map((E) => Buffer.isBuffer(E) ? Buffer.from(E) : E);
      for (let E = 0; E < p.size; ++E)
        v.push(null);
      for (const E of h(...u))
        if (Array.isArray(E))
          n(E, v, p.size, m), yield v;
        else if (typeof E == "object" && E !== null)
          i(E, v, p, m), yield v;
        else
          throw new TypeError(`Virtual table module "${m}" yielded something that isn't a valid row object`);
    };
  }
  function n(h, p, m, x) {
    if (h.length !== m)
      throw new TypeError(`Virtual table module "${x}" yielded a row with an incorrect number of columns`);
    const u = p.length - m;
    for (let v = 0; v < m; ++v)
      p[v + u] = h[v];
  }
  function i(h, p, m, x) {
    let u = 0;
    for (const v of Object.keys(h)) {
      const E = m.get(v);
      if (E === void 0)
        throw new TypeError(`Virtual table module "${x}" yielded a row with an undeclared column "${v}"`);
      p[E] = h[v], u += 1;
    }
    if (u !== m.size)
      throw new TypeError(`Virtual table module "${x}" yielded a row with missing columns`);
  }
  function s({ length: h }) {
    if (!Number.isInteger(h) || h < 0)
      throw new TypeError("Expected function.length to be a positive integer");
    const p = [];
    for (let m = 0; m < h; ++m)
      p.push(`$${m + 1}`);
    return p;
  }
  const { hasOwnProperty: c } = Object.prototype, { apply: o } = Function.prototype, l = Object.getPrototypeOf(function* () {
  }), f = (h) => `"${h.replace(/"/g, '""')}"`, d = (h) => () => h;
  return ui;
}
var hi, e0;
function _l() {
  if (e0) return hi;
  e0 = 1;
  const e = function() {
  };
  return hi = function(r, a) {
    return Object.assign(new e(), this);
  }, hi;
}
var di, r0;
function Tl() {
  if (r0) return di;
  r0 = 1;
  const e = Xt, t = Zt, r = Et(), a = Cc();
  let n;
  function i(c, o) {
    if (new.target == null)
      return new i(c, o);
    let l;
    if (Buffer.isBuffer(c) && (l = c, c = ":memory:"), c == null && (c = ""), o == null && (o = {}), typeof c != "string") throw new TypeError("Expected first argument to be a string");
    if (typeof o != "object") throw new TypeError("Expected second argument to be an options object");
    if ("readOnly" in o) throw new TypeError('Misspelled option "readOnly" should be "readonly"');
    if ("memory" in o) throw new TypeError('Option "memory" was removed in v7.0.0 (use ":memory:" filename instead)');
    const f = c.trim(), d = f === "" || f === ":memory:", h = r.getBooleanOption(o, "readonly"), p = r.getBooleanOption(o, "fileMustExist"), m = "timeout" in o ? o.timeout : 5e3, x = "verbose" in o ? o.verbose : null, u = "nativeBinding" in o ? o.nativeBinding : null;
    if (h && d && !l) throw new TypeError("In-memory/temporary databases cannot be readonly");
    if (!Number.isInteger(m) || m < 0) throw new TypeError('Expected the "timeout" option to be a positive integer');
    if (m > 2147483647) throw new RangeError('Option "timeout" cannot be greater than 2147483647');
    if (x != null && typeof x != "function") throw new TypeError('Expected the "verbose" option to be a function');
    if (u != null && typeof u != "string" && typeof u != "object") throw new TypeError('Expected the "nativeBinding" option to be a string or addon object');
    let v;
    if (u == null ? v = n || (n = ul()("better_sqlite3.node")) : typeof u == "string" ? v = (typeof __non_webpack_require__ == "function" ? __non_webpack_require__ : Nc)(t.resolve(u).replace(/(\.node)?$/, ".node")) : v = u, v.isInitialized || (v.setErrorConstructor(a), v.isInitialized = !0), !d && !f.startsWith("file:") && !e.existsSync(t.dirname(f)))
      throw new TypeError("Cannot open database because the directory does not exist");
    Object.defineProperties(this, {
      [r.cppdb]: { value: new v.Database(f, c, d, h, p, m, x || null, l || null) },
      ...s.getters
    });
  }
  const s = hl();
  return i.prototype.prepare = s.prepare, i.prototype.transaction = dl(), i.prototype.pragma = xl(), i.prototype.backup = pl(), i.prototype.serialize = ml(), i.prototype.function = vl(), i.prototype.aggregate = gl(), i.prototype.table = El(), i.prototype.loadExtension = s.loadExtension, i.prototype.exec = s.exec, i.prototype.close = s.close, i.prototype.defaultSafeIntegers = s.defaultSafeIntegers, i.prototype.unsafeMode = s.unsafeMode, i.prototype[r.inspect] = _l(), di = i, di;
}
var t0;
function wl() {
  return t0 || (t0 = 1, vn.exports = Tl(), vn.exports.SqliteError = Cc()), vn.exports;
}
var $r = {}, a0;
function yl() {
  if (a0) return $r;
  a0 = 1, Object.defineProperty($r, "__esModule", { value: !0 }), $r.DEFAULT_WAREHOUSE_ID = $r.getDatabasePath = $r.DATABASE_SCHEMA = $r.SCHEMA_VERSION = void 0, $r.SCHEMA_VERSION = "1.0.0", $r.DATABASE_SCHEMA = `
-- =====================================================
-- WAREHOUSE STRUCTURE
-- =====================================================

-- Warehouses (Main entity)
CREATE TABLE IF NOT EXISTS warehouses (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  country TEXT NOT NULL,
  surface REAL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  zone_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  manager TEXT,
  email TEXT,
  phone TEXT,
  status TEXT NOT NULL,
  opening_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Zones (Hierarchical: belongs to warehouse)
CREATE TABLE IF NOT EXISTS zones (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  surface REAL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  sector_count INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  temperature_min REAL,
  temperature_max REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- Sectors (Hierarchical: belongs to zone -> warehouse)
CREATE TABLE IF NOT EXISTS sectors (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  location_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE
);

-- Locations (Hierarchical: belongs to sector -> zone -> warehouse)
CREATE TABLE IF NOT EXISTS locations (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  zone_id TEXT NOT NULL,
  sector_id TEXT NOT NULL,
  code TEXT NOT NULL,
  type TEXT NOT NULL,
  capacity INTEGER,
  used_capacity INTEGER DEFAULT 0,
  product_count INTEGER DEFAULT 0,
  picker_count INTEGER DEFAULT 0,
  aisle TEXT,
  level INTEGER,
  position TEXT,
  barcode TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (zone_id) REFERENCES zones(id) ON DELETE CASCADE,
  FOREIGN KEY (sector_id) REFERENCES sectors(id) ON DELETE CASCADE
);

-- =====================================================
-- PRODUCTS & INVENTORY
-- =====================================================

-- Products (Catalog - global across all warehouses)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  sku TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  subcategory TEXT,
  brand TEXT,
  unit TEXT NOT NULL,
  weight REAL,
  volume REAL,
  min_stock INTEGER DEFAULT 0,
  max_stock INTEGER,
  reorder_point INTEGER,
  reorder_quantity INTEGER,
  cost_price REAL,
  selling_price REAL,
  supplier TEXT,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Inventory (Stock levels by product and location - CRITICAL TABLE)
CREATE TABLE IF NOT EXISTS inventory (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  location_id TEXT,
  quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  reserved_quantity INTEGER NOT NULL DEFAULT 0,
  last_received_at TEXT,
  last_shipped_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL,
  UNIQUE(warehouse_id, product_id, location_id)
);

-- =====================================================
-- SUPPLIERS
-- =====================================================

CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  country TEXT,
  payment_terms TEXT,
  lead_time_days INTEGER,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =====================================================
-- CUSTOMERS
-- =====================================================

CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  customer_code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  billing_address TEXT,
  shipping_address TEXT,
  city TEXT,
  country TEXT,
  customer_type TEXT,
  credit_limit REAL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- =====================================================
-- ORDERS (Sales orders)
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT,
  order_date TEXT NOT NULL,
  required_date TEXT NOT NULL,
  promised_date TEXT,
  shipped_date TEXT,
  delivered_date TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  total_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  tracking_number TEXT,
  carrier TEXT,
  notes TEXT,
  picker TEXT,
  packer TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_lines (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  picked_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- PURCHASE ORDERS
-- =====================================================

CREATE TABLE IF NOT EXISTS purchase_orders (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  purchase_order_number TEXT NOT NULL UNIQUE,
  order_date TEXT NOT NULL,
  expected_date TEXT,
  status TEXT NOT NULL,
  requested_by TEXT,
  total_amount REAL DEFAULT 0,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS purchase_order_lines (
  id TEXT PRIMARY KEY,
  purchase_order_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- PICKING OPERATIONS
-- =====================================================

CREATE TABLE IF NOT EXISTS pickings (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  order_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  picking_number TEXT NOT NULL,
  assigned_date TEXT NOT NULL,
  started_date TEXT,
  completed_date TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  total_quantity INTEGER DEFAULT 0,
  picked_quantity INTEGER DEFAULT 0,
  remaining_quantity INTEGER DEFAULT 0,
  picker TEXT,
  picker_id TEXT,
  equipment TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS picking_lines (
  id TEXT PRIMARY KEY,
  picking_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  location_code TEXT NOT NULL,
  zone_name TEXT,
  quantity INTEGER NOT NULL,
  picked_quantity INTEGER DEFAULT 0,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (picking_id) REFERENCES pickings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RECEIPTS (Supplier receipts)
-- =====================================================

CREATE TABLE IF NOT EXISTS receptions (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  supplier_id TEXT NOT NULL,
  supplier_name TEXT NOT NULL,
  reception_number TEXT NOT NULL,
  purchase_order_number TEXT,
  expected_date TEXT NOT NULL,
  received_date TEXT,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  total_quantity INTEGER DEFAULT 0,
  received_quantity INTEGER DEFAULT 0,
  rejected_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  carrier TEXT,
  tracking_number TEXT,
  dock_door TEXT,
  receiver TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (supplier_id) REFERENCES suppliers(id)
);

CREATE TABLE IF NOT EXISTS reception_lines (
  id TEXT PRIMARY KEY,
  reception_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  ordered_quantity INTEGER NOT NULL,
  received_quantity INTEGER DEFAULT 0,
  rejected_quantity INTEGER DEFAULT 0,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  reason TEXT,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (reception_id) REFERENCES receptions(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- RESTOCKING (Replenishment)
-- =====================================================

CREATE TABLE IF NOT EXISTS restockings (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  restocking_number TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  total_products INTEGER DEFAULT 0,
  restocked_products INTEGER DEFAULT 0,
  requester TEXT NOT NULL,
  assigned_to TEXT,
  requested_date TEXT NOT NULL,
  started_date TEXT,
  completed_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS restocking_lines (
  id TEXT PRIMARY KEY,
  restocking_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  source_location_id TEXT,
  destination_location_id TEXT,
  current_quantity INTEGER NOT NULL,
  target_quantity INTEGER NOT NULL,
  quantity_to_restock INTEGER NOT NULL,
  unit TEXT NOT NULL,
  status TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (restocking_id) REFERENCES restockings(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- RETURNS
-- =====================================================

CREATE TABLE IF NOT EXISTS returns (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT,
  order_number TEXT,
  return_number TEXT NOT NULL,
  customer_id TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  return_date TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT NOT NULL,
  reason TEXT NOT NULL,
  reason_label TEXT NOT NULL,
  total_quantity INTEGER DEFAULT 0,
  total_amount REAL DEFAULT 0,
  refunded_amount REAL DEFAULT 0,
  processor TEXT,
  completed_date TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS return_lines (
  id TEXT PRIMARY KEY,
  return_id TEXT NOT NULL,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price REAL NOT NULL,
  total_price REAL NOT NULL,
  condition TEXT NOT NULL,
  resolution TEXT NOT NULL,
  processed_by_user_id TEXT,
  started_at TEXT,
  completed_at TEXT,
  duration_ms INTEGER,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (return_id) REFERENCES returns(id) ON DELETE CASCADE,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- SHIPMENTS
-- =====================================================

CREATE TABLE IF NOT EXISTS shipments (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  order_id TEXT NOT NULL,
  shipment_number TEXT NOT NULL,
  shipment_date TEXT NOT NULL,
  carrier TEXT NOT NULL,
  tracking_number TEXT,
  status TEXT NOT NULL,
  shipping_address TEXT,
  shipping_city TEXT,
  shipping_country TEXT,
  estimated_delivery_date TEXT,
  actual_delivery_date TEXT,
  notes TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS shipment_lines (
  id TEXT PRIMARY KEY,
  shipment_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  FOREIGN KEY (shipment_id) REFERENCES shipments(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id)
);

-- =====================================================
-- MOVEMENTS (Historical stock movements)
-- =====================================================

CREATE TABLE IF NOT EXISTS movements (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  product_id TEXT NOT NULL,
  product_sku TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT NOT NULL,
  source_location_id TEXT,
  source_zone TEXT,
  source_location_code TEXT,
  destination_location_id TEXT,
  destination_zone TEXT,
  destination_location_code TEXT,
  quantity INTEGER NOT NULL,
  unit TEXT NOT NULL,
  movement_date TEXT NOT NULL,
  user TEXT,
  reason TEXT,
  lot TEXT,
  expiration_date TEXT,
  reference_type TEXT,
  reference_id TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (source_location_id) REFERENCES locations(id) ON DELETE SET NULL,
  FOREIGN KEY (destination_location_id) REFERENCES locations(id) ON DELETE SET NULL
);

-- =====================================================
-- USERS (Warehouse operators)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  warehouse_id TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  last_login_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- =====================================================
-- IMPORT HISTORY
-- =====================================================

CREATE TABLE IF NOT EXISTS import_history (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  warehouse_id TEXT NOT NULL,
  plugin_id TEXT NOT NULL,
  plugin_version TEXT NOT NULL,
  imported_at TEXT NOT NULL DEFAULT (datetime('now')),
  rows_processed INTEGER NOT NULL,
  status TEXT NOT NULL,
  file_name TEXT,
  file_size INTEGER,
  duration_ms INTEGER,
  error_message TEXT,
  FOREIGN KEY (warehouse_id) REFERENCES warehouses(id) ON DELETE CASCADE
);

-- =====================================================
-- INDEXES (Performance critical)
-- =====================================================

-- Warehouse indexes
CREATE INDEX IF NOT EXISTS idx_zones_warehouse ON zones(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_sectors_warehouse ON sectors(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_sectors_zone ON sectors(zone_id);
CREATE INDEX IF NOT EXISTS idx_locations_warehouse ON locations(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_locations_zone ON locations(zone_id);
CREATE INDEX IF NOT EXISTS idx_locations_sector ON locations(sector_id);

-- Product & Inventory indexes
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse ON inventory(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_location ON inventory(location_id);
CREATE INDEX IF NOT EXISTS idx_inventory_warehouse_product ON inventory(warehouse_id, product_id);

-- Order indexes
CREATE INDEX IF NOT EXISTS idx_orders_warehouse ON orders(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(order_date);
CREATE INDEX IF NOT EXISTS idx_order_lines_order ON order_lines(order_id);
CREATE INDEX IF NOT EXISTS idx_order_lines_product ON order_lines(product_id);

-- Picking indexes
CREATE INDEX IF NOT EXISTS idx_pickings_warehouse ON pickings(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_pickings_status ON pickings(status);
CREATE INDEX IF NOT EXISTS idx_pickings_order ON pickings(order_id);
CREATE INDEX IF NOT EXISTS idx_picking_lines_picking ON picking_lines(picking_id);
CREATE INDEX IF NOT EXISTS idx_picking_lines_user ON picking_lines(processed_by_user_id);

-- Reception indexes
CREATE INDEX IF NOT EXISTS idx_receptions_warehouse ON receptions(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_receptions_status ON receptions(status);
CREATE INDEX IF NOT EXISTS idx_reception_lines_reception ON reception_lines(reception_id);

-- Restocking indexes
CREATE INDEX IF NOT EXISTS idx_restockings_warehouse ON restockings(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_restockings_status ON restockings(status);
CREATE INDEX IF NOT EXISTS idx_restocking_lines_restocking ON restocking_lines(restocking_id);

-- Return indexes
CREATE INDEX IF NOT EXISTS idx_returns_warehouse ON returns(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_returns_status ON returns(status);
CREATE INDEX IF NOT EXISTS idx_return_lines_return ON return_lines(return_id);

-- Shipment indexes
CREATE INDEX IF NOT EXISTS idx_shipments_warehouse ON shipments(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_shipments_order ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipment_lines_shipment ON shipment_lines(shipment_id);

-- Movement indexes (CRITICAL for analytics)
CREATE INDEX IF NOT EXISTS idx_movements_warehouse ON movements(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_movements_product ON movements(product_id);
CREATE INDEX IF NOT EXISTS idx_movements_date ON movements(movement_date);
CREATE INDEX IF NOT EXISTS idx_movements_type ON movements(type);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse_product ON movements(warehouse_id, product_id);
CREATE INDEX IF NOT EXISTS idx_movements_warehouse_date ON movements(warehouse_id, movement_date);

-- User indexes
CREATE INDEX IF NOT EXISTS idx_users_warehouse ON users(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Import history indexes
CREATE INDEX IF NOT EXISTS idx_import_history_warehouse ON import_history(warehouse_id);
CREATE INDEX IF NOT EXISTS idx_import_history_date ON import_history(imported_at);
`;
  const e = (t) => Zt.join(t, "wareflow.db");
  return $r.getDatabasePath = e, $r.DEFAULT_WAREHOUSE_ID = "default", $r;
}
var n0;
function Gi() {
  return n0 || (n0 = 1, (function(e) {
    var t = Na && Na.__importDefault || function(x) {
      return x && x.__esModule ? x : { default: x };
    };
    Object.defineProperty(e, "__esModule", { value: !0 }), e.createWarehouse = e.getAllWarehouses = e.warehouseExists = e.getDatabaseStats = e.vacuumDatabase = e.getDatabaseFilePath = e.closeDatabase = e.initializeDatabase = e.getDatabase = void 0;
    const r = t(wl()), a = Ac, n = yl();
    let i = null;
    const s = () => {
      if (i)
        return i;
      const x = a.app.getPath("userData"), u = (0, n.getDatabasePath)(x);
      return i = new r.default(u), i.pragma("foreign_keys = ON"), i.pragma("journal_mode = WAL"), i;
    };
    e.getDatabase = s;
    const c = () => {
      const x = (0, e.getDatabase)();
      x.exec(n.DATABASE_SCHEMA);
      const u = x.prepare("PRAGMA schema_version").get();
      console.log(`Database initialized. Schema version: ${u.schema_version}, expected: ${n.SCHEMA_VERSION}`);
    };
    e.initializeDatabase = c;
    const o = () => {
      i && (i.close(), i = null);
    };
    e.closeDatabase = o;
    const l = () => {
      const x = a.app.getPath("userData");
      return (0, n.getDatabasePath)(x);
    };
    e.getDatabaseFilePath = l;
    const f = () => {
      (0, e.getDatabase)().exec("VACUUM");
    };
    e.vacuumDatabase = f;
    const d = () => {
      const x = (0, e.getDatabase)(), u = x.prepare("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table'").get(), v = x.prepare("SELECT page_count * page_size as size FROM pragma_page_count(), pragma_page_size()").get();
      return {
        tables: u.count,
        sizeBytes: v.size,
        sizeMB: Math.round(v.size / 1024 / 1024 * 100) / 100
      };
    };
    e.getDatabaseStats = d;
    const h = (x) => (0, e.getDatabase)().prepare("SELECT COUNT(*) as count FROM warehouses WHERE id = ?").get(x).count > 0;
    e.warehouseExists = h;
    const p = () => (0, e.getDatabase)().prepare("SELECT * FROM warehouses ORDER BY name").all();
    e.getAllWarehouses = p;
    const m = (x) => {
      const u = (0, e.getDatabase)();
      return u.prepare(`
    INSERT INTO warehouses (
      id, code, name, city, country, surface, capacity,
      manager, email, phone, status, opening_date
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(x.id, x.code, x.name, x.city, x.country, x.surface || null, x.capacity || null, x.manager || null, x.email || null, x.phone || null, "active"), u.prepare("SELECT * FROM warehouses WHERE id = ?").get(x.id);
    };
    e.createWarehouse = m;
  })(Na)), Na;
}
var Oe = {}, i0;
function Vi() {
  if (i0) return Oe;
  i0 = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.getDashboardKPIs = Oe.getImportHistory = Oe.getWarehousesWithKPIs = Oe.getSectorsByWarehouse = Oe.getZonesByWarehouse = Oe.getLocationsByWarehouse = Oe.getDeadStock = Oe.getProductMovementTotals = Oe.getOrdersByWarehouse = Oe.getLastMovementDate = Oe.getMovementsByWarehouse = Oe.getInventoryByWarehouse = Oe.getProductBySku = Oe.getProductById = Oe.getProductsByWarehouse = void 0;
  const e = Gi(), t = (u) => (0, e.getDatabase)().prepare(`
    SELECT DISTINCT
      p.id,
      p.sku,
      p.name,
      p.description,
      p.category,
      p.subcategory,
      p.brand,
      p.unit,
      p.weight,
      p.volume,
      p.min_stock,
      p.max_stock,
      p.reorder_point,
      p.reorder_quantity,
      p.cost_price,
      p.selling_price,
      p.supplier,
      p.status,
      i.quantity as current_quantity,
      i.available_quantity,
      i.reserved_quantity
    FROM products p
    LEFT JOIN inventory i ON p.id = i.product_id AND i.warehouse_id = ?
    WHERE EXISTS (
      SELECT 1 FROM inventory inv
      WHERE inv.product_id = p.id AND inv.warehouse_id = ?
    )
    ORDER BY p.name
  `).all(u, u);
  Oe.getProductsByWarehouse = t;
  const r = (u) => (0, e.getDatabase)().prepare("SELECT * FROM products WHERE id = ?").get(u);
  Oe.getProductById = r;
  const a = (u) => (0, e.getDatabase)().prepare("SELECT * FROM products WHERE sku = ?").get(u);
  Oe.getProductBySku = a;
  const n = (u) => {
    const v = (0, e.getDatabase)();
    let E = `
    SELECT
      i.id,
      i.warehouse_id,
      i.product_id,
      p.sku as product_sku,
      p.name as product_name,
      i.location_id,
      l.code as location_code,
      i.quantity,
      i.available_quantity,
      i.reserved_quantity,
      i.last_received_at,
      i.last_shipped_at
    FROM inventory i
    INNER JOIN products p ON i.product_id = p.id
    LEFT JOIN locations l ON i.location_id = l.id
    WHERE i.warehouse_id = ?
  `;
    const g = [u.warehouseId];
    return u.productId && (E += " AND i.product_id = ?", g.push(u.productId)), u.locationId && (E += " AND i.location_id = ?", g.push(u.locationId)), E += " ORDER BY p.name", v.prepare(E).all(...g);
  };
  Oe.getInventoryByWarehouse = n;
  const i = (u) => {
    const v = (0, e.getDatabase)();
    let E = "SELECT * FROM movements WHERE warehouse_id = ?";
    const g = [u.warehouseId];
    return u.productId && (E += " AND product_id = ?", g.push(u.productId)), u.type && (E += " AND type = ?", g.push(u.type)), u.dateFrom && (E += " AND movement_date >= ?", g.push(u.dateFrom)), u.dateTo && (E += " AND movement_date <= ?", g.push(u.dateTo)), E += " ORDER BY movement_date DESC", u.limit && (E += " LIMIT ?", g.push(u.limit)), v.prepare(E).all(...g);
  };
  Oe.getMovementsByWarehouse = i;
  const s = (u, v) => (0, e.getDatabase)().prepare("SELECT MAX(movement_date) as last_date FROM movements WHERE warehouse_id = ? AND product_id = ?").get(u, v).last_date;
  Oe.getLastMovementDate = s;
  const c = (u) => {
    const v = (0, e.getDatabase)();
    let E = "SELECT * FROM orders WHERE warehouse_id = ?";
    const g = [u.warehouseId];
    return u.status && (E += " AND status = ?", g.push(u.status)), E += " ORDER BY order_date DESC", u.limit && (E += " LIMIT ?", g.push(u.limit)), v.prepare(E).all(...g);
  };
  Oe.getOrdersByWarehouse = c;
  const o = (u, v, E, g) => {
    const y = (0, e.getDatabase)();
    let N = `
    SELECT
      m.product_id,
      p.sku,
      p.name,
      SUM(m.quantity) as total_quantity,
      COUNT(*) as movement_count
    FROM movements m
    INNER JOIN products p ON m.product_id = p.id
    WHERE m.warehouse_id = ? AND m.type = ?
  `;
    const A = [u, v];
    return E && (N += " AND m.movement_date >= ?", A.push(E)), g && (N += " AND m.movement_date <= ?", A.push(g)), N += " GROUP BY m.product_id ORDER BY total_quantity DESC", y.prepare(N).all(...A);
  };
  Oe.getProductMovementTotals = o;
  const l = (u, v = 90) => (0, e.getDatabase)().prepare(`
    SELECT
      p.id,
      p.sku,
      p.name,
      p.category,
      p.cost_price,
      i.quantity as current_quantity,
      MAX(m.movement_date) as last_movement_date,
      (julianday('now') - julianday(MAX(m.movement_date))) as days_since_last_move,
      (i.quantity * p.cost_price) as tied_capital
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    LEFT JOIN movements m ON p.id = m.product_id AND m.warehouse_id = i.warehouse_id
    WHERE i.warehouse_id = ? AND i.quantity > 0
    GROUP BY p.id
    HAVING days_since_last_move >= ?
    ORDER BY tied_capital DESC
  `).all(u, v);
  Oe.getDeadStock = l;
  const f = (u) => {
    const y = (0, e.getDatabase)().prepare(`
    SELECT DISTINCT
      l.id,
      l.code,
      l.type,
      l.capacity,
      l.used_capacity as usedCapacity,
      l.product_count as productCount,
      l.picker_count as pickerCount,
      l.aisle,
      l.level,
      l.position,
      l.barcode,
      l.status,
      l.updated_at as lastUpdated,
      z.id as zoneId,
      z.name as zoneName,
      z.code as zoneCode,
      s.id as sectorId,
      s.name as sectorName,
      s.code as sectorCode,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode,
      -- For each location, get products as JSON array
      (
        SELECT GROUP_CONCAT(
          json_object(
            'id', p.id,
            'sku', p.sku,
            'name', p.name,
            'quantity', i2.quantity
          ),
          '|'
        )
        FROM inventory i2
        JOIN products p ON i2.product_id = p.id
        WHERE i2.location_id = l.id AND i2.warehouse_id = ?
      ) as products_json
    FROM locations l
    LEFT JOIN zones z ON l.zone_id = z.id
    LEFT JOIN sectors s ON l.sector_id = s.id
    LEFT JOIN warehouses w ON l.warehouse_id = w.id
    WHERE l.warehouse_id = ?
    ORDER BY l.code
  `).all(u, u).map((b) => ({
      ...b,
      products: b.products_json ? b.products_json.split("|").map((K) => JSON.parse(K)) : []
    })), N = y.length, A = y.filter((b) => b.status === "available").length, w = y.filter((b) => b.status === "occupied").length, P = y.filter((b) => b.status === "blocked").length, L = y.filter((b) => b.status === "reserved").length, U = y.reduce((b, K) => b + (K.capacity || 0), 0), M = y.reduce((b, K) => b + (K.usedCapacity || 0), 0);
    return {
      kpis: {
        totalLocations: N,
        availableLocations: A,
        occupiedLocations: w,
        blockedLocations: P,
        reservedLocations: L,
        totalCapacity: U,
        usedCapacity: M,
        averageOccupancy: U > 0 ? M / U * 100 : 0
      },
      locations: y
    };
  };
  Oe.getLocationsByWarehouse = f;
  const d = (u) => {
    const g = (0, e.getDatabase)().prepare(`
    SELECT DISTINCT
      z.id,
      z.code,
      z.name,
      z.type,
      z.surface,
      z.capacity,
      z.used_capacity as usedCapacity,
      z.sector_count as sectorCount,
      z.location_count as locationCount,
      z.picker_count as pickerCount,
      z.temperature_min as temperatureMin,
      z.temperature_max as temperatureMax,
      z.status,
      z.updated_at as lastUpdated,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM zones z
    LEFT JOIN warehouses w ON z.warehouse_id = w.id
    WHERE z.warehouse_id = ?
    ORDER BY z.code
  `).all(u), y = g.length, N = g.filter((M) => M.status === "active").length, A = g.reduce((M, b) => M + (b.surface || 0), 0), w = g.reduce((M, b) => M + (b.capacity || 0), 0), P = g.reduce((M, b) => M + (b.usedCapacity || 0), 0), L = w > 0 ? P / w * 100 : 0, U = {};
    return g.forEach((M) => {
      U[M.type] = (U[M.type] || 0) + 1;
    }), {
      kpis: {
        totalZones: y,
        activeZones: N,
        totalSurface: A,
        totalCapacity: w,
        usedCapacity: P,
        averageOccupancy: L,
        zoneTypes: U
      },
      zones: g
    };
  };
  Oe.getZonesByWarehouse = d;
  const h = (u) => {
    const g = (0, e.getDatabase)().prepare(`
    SELECT DISTINCT
      s.id,
      s.code,
      s.name,
      s.type,
      s.capacity,
      s.used_capacity as usedCapacity,
      s.location_count as locationCount,
      s.picker_count as pickerCount,
      s.aisle,
      s.level,
      s.position,
      s.status,
      s.updated_at as lastUpdated,
      z.id as zoneId,
      z.name as zoneName,
      z.code as zoneCode,
      w.id as warehouseId,
      w.name as warehouseName,
      w.code as warehouseCode
    FROM sectors s
    LEFT JOIN zones z ON s.zone_id = z.id
    LEFT JOIN warehouses w ON s.warehouse_id = w.id
    WHERE s.warehouse_id = ?
    ORDER BY s.code
  `).all(u), y = g.length, N = g.filter((U) => U.status === "active").length, A = g.reduce((U, M) => U + (M.capacity || 0), 0), w = g.reduce((U, M) => U + (M.usedCapacity || 0), 0), P = A > 0 ? w / A * 100 : 0, L = {};
    return g.forEach((U) => {
      L[U.type] = (L[U.type] || 0) + 1;
    }), {
      kpis: {
        totalSectors: y,
        activeSectors: N,
        totalCapacity: A,
        usedCapacity: w,
        averageOccupancy: P,
        sectorTypes: L
      },
      sectors: g
    };
  };
  Oe.getSectorsByWarehouse = h;
  const p = () => {
    const E = (0, e.getDatabase)().prepare(`
    SELECT
      w.id,
      w.code,
      w.name,
      w.city,
      w.country,
      w.surface,
      w.capacity,
      w.used_capacity as usedCapacity,
      w.zone_count as zoneCount,
      w.picker_count as pickerCount,
      w.manager,
      w.email,
      w.phone,
      w.status,
      w.opening_date as openingDate,
      w.updated_at as lastUpdated
    FROM warehouses w
    ORDER BY w.name
  `).all(), g = E.length, y = E.filter((U) => U.status === "active").length, N = E.reduce((U, M) => U + (M.surface || 0), 0), A = E.reduce((U, M) => U + (M.capacity || 0), 0), w = E.reduce((U, M) => U + (M.usedCapacity || 0), 0), P = A > 0 ? w / A * 100 : 0, L = E.reduce((U, M) => U + (M.pickerCount || 0), 0);
    return {
      kpis: {
        totalWarehouses: g,
        activeWarehouses: y,
        totalSurface: N,
        totalCapacity: A,
        usedCapacity: w,
        averageOccupancy: P,
        trackedPickers: L
      },
      warehouses: E
    };
  };
  Oe.getWarehousesWithKPIs = p;
  const m = (u) => {
    const v = (0, e.getDatabase)();
    let E;
    return u ? (E = v.prepare(`
      SELECT
        ih.id,
        ih.warehouse_id as warehouseId,
        ih.plugin_id as pluginId,
        ih.plugin_version as pluginVersion,
        ih.imported_at as importedAt,
        ih.rows_processed as rowsProcessed,
        ih.status,
        ih.file_name as fileName,
        ih.file_size as fileSize,
        ih.duration_ms as durationMs,
        ih.error_message as errorMessage,
        w.name as warehouseName,
        w.code as warehouseCode
      FROM import_history ih
      LEFT JOIN warehouses w ON ih.warehouse_id = w.id
      WHERE ih.warehouse_id = ?
      ORDER BY ih.imported_at DESC
      LIMIT 50
    `), E.all(u)) : (E = v.prepare(`
      SELECT
        ih.id,
        ih.warehouse_id as warehouseId,
        ih.plugin_id as pluginId,
        ih.plugin_version as pluginVersion,
        ih.imported_at as importedAt,
        ih.rows_processed as rowsProcessed,
        ih.status,
        ih.file_name as fileName,
        ih.file_size as fileSize,
        ih.duration_ms as durationMs,
        ih.error_message as errorMessage,
        w.name as warehouseName,
        w.code as warehouseCode
      FROM import_history ih
      LEFT JOIN warehouses w ON ih.warehouse_id = w.id
      ORDER BY ih.imported_at DESC
      LIMIT 50
    `), E.all());
  };
  Oe.getImportHistory = m;
  const x = (u) => {
    const v = (0, e.getDatabase)();
    let E = u ? [u] : [];
    const y = v.prepare("SELECT COUNT(*) as count FROM products").get().count, A = v.prepare(`SELECT COUNT(*) as count FROM locations ${u ? "WHERE warehouse_id = ?" : ""}`).get(...E).count, P = v.prepare(`
    SELECT COUNT(DISTINCT p.id) as count
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    ${u ? "WHERE i.warehouse_id = ? AND" : "WHERE"}
      i.quantity < p.min_stock
  `).get(...E).count, U = v.prepare(`
    SELECT COUNT(*) as count
    FROM orders
    ${u ? "WHERE warehouse_id = ? AND" : "WHERE"}
      status IN ('pending', 'processing', 'picked')
  `).get(...E).count, b = v.prepare(`
    SELECT COUNT(*) as count
    FROM movements
    ${u ? "WHERE warehouse_id = ? AND" : "WHERE"}
      movement_date >= datetime('now', '-7 days')
  `).get(...E).count, se = v.prepare(`
    SELECT
      date(movement_date) as date,
      SUM(CASE WHEN type IN ('in', 'receipt') THEN quantity ELSE -quantity END) as stock
    FROM movements
    ${u ? "WHERE warehouse_id = ?" : "WHERE 1=1"}
      AND movement_date >= datetime('now', '-7 days')
    GROUP BY date(movement_date)
    ORDER BY date
  `).all(...E);
    let re = 0;
    const ue = se.map((J) => (re += J.stock, {
      date: new Date(J.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      stock: re
    })), Le = v.prepare(`
    SELECT
      type as movementType,
      COUNT(*) as movements
    FROM movements
    ${u ? "WHERE warehouse_id = ?" : "WHERE 1=1"}
      AND movement_date >= datetime('now', '-7 days')
    GROUP BY type
  `).all(...E), G = {
      in: "hsl(var(--chart))",
      inbound: "hsl(var(--chart))",
      receipt: "hsl(var(--chart))",
      out: "hsl(142, 76%, 36%)",
      outbound: "hsl(142, 76%, 36%)",
      shipment: "hsl(142, 76%, 36%)",
      transfer: "hsl(25, 95%, 53%)",
      adjustment: "hsl(25, 95%, 53%)"
    }, xe = Le.map((J) => ({
      movementType: J.movementType,
      movements: J.movements,
      fill: G[J.movementType] || "hsl(var(--muted))"
    })), O = v.prepare(`
    SELECT
      product_name as product,
      COUNT(*) as movements
    FROM movements
    ${u ? "WHERE warehouse_id = ?" : "WHERE 1=1"}
      AND movement_date >= datetime('now', '-30 days')
    GROUP BY product_name
    ORDER BY movements DESC
    LIMIT 5
  `).all(...E), R = v.prepare(`
    SELECT
      p.id,
      p.name as product,
      i.quantity as currentStock,
      p.min_stock as minStock,
      l.code as location,
      CASE
        WHEN i.quantity = 0 THEN 'critical'
        WHEN i.quantity < p.min_stock * 0.5 THEN 'critical'
        ELSE 'warning'
      END as severity
    FROM products p
    INNER JOIN inventory i ON p.id = i.product_id
    LEFT JOIN locations l ON i.location_id = l.id
    ${u ? "WHERE i.warehouse_id = ? AND" : "WHERE"}
      i.quantity < p.min_stock
    ORDER BY i.quantity ASC
    LIMIT 10
  `).all(...E), Y = v.prepare(`
    SELECT
      id,
      date(movement_date) as date,
      product_name as product,
      type,
      quantity as quantity,
      destination_location_code as "to",
      source_location_code as "from"
    FROM movements
    ${u ? "WHERE warehouse_id = ?" : "WHERE 1=1"}
    ORDER BY movement_date DESC
    LIMIT 10
  `).all(...E).map((J) => ({
      ...J,
      type: J.type.toLowerCase()
    }));
    return {
      kpis: {
        totalProducts: y,
        totalLocations: A,
        lowStockItems: P,
        activeOrders: U,
        movementsThisWeek: b
      },
      stockEvolution: ue,
      movementsByType: xe,
      topProducts: O,
      lowStockAlerts: R,
      recentMovements: Y
    };
  };
  return Oe.getDashboardKPIs = x, Oe;
}
var xi = {}, Oa = {}, s0;
function Sl() {
  if (s0) return Oa;
  s0 = 1, Object.defineProperty(Oa, "__esModule", { value: !0 }), Oa.genericExcelPlugin = void 0, Oa.genericExcelPlugin = {
    // Identification
    id: "generic-excel",
    name: "Generic Excel Plugin",
    version: "1.0.0",
    description: "Flexible import from any Excel format with manual column mapping",
    author: "Wareflow",
    // WMS compatibility
    wmsSystem: "Generic",
    supportedFormats: ["xlsx", "xls", "csv"],
    // Input schema - user defines this
    inputSchema: {
      sheets: [
        {
          name: "Products",
          required: !1,
          description: "Product catalog data",
          columns: [
            {
              name: "id",
              type: "string",
              required: !0,
              description: "Product unique identifier"
            },
            {
              name: "sku",
              type: "string",
              required: !0,
              description: "Product SKU"
            },
            {
              name: "name",
              type: "string",
              required: !0,
              description: "Product name"
            },
            {
              name: "category",
              type: "string",
              required: !1,
              description: "Product category"
            },
            {
              name: "unit",
              type: "string",
              required: !1,
              description: "Unit of measure"
            }
          ]
        },
        {
          name: "Inventory",
          required: !1,
          description: "Current inventory levels",
          columns: [
            {
              name: "product_id",
              type: "string",
              required: !0,
              description: "Product ID"
            },
            {
              name: "quantity",
              type: "number",
              required: !0,
              description: "Stock quantity"
            }
          ]
        },
        {
          name: "Movements",
          required: !1,
          description: "Stock movements history",
          columns: [
            {
              name: "product_id",
              type: "string",
              required: !0,
              description: "Product ID"
            },
            {
              name: "type",
              type: "string",
              required: !0,
              description: "Movement type (inbound/outbound/transfer/adjustment)"
            },
            {
              name: "quantity",
              type: "number",
              required: !0,
              description: "Movement quantity"
            },
            {
              name: "date",
              type: "date",
              required: !0,
              description: "Movement date"
            }
          ]
        }
      ]
    },
    /**
     * Validate WMS input data
     * Checks if required sheets exist and have valid structure
     */
    validate: (a) => {
      const n = [];
      return Object.keys(a.sheets).length === 0 && n.push({
        severity: "error",
        message: "No sheets found in Excel file",
        suggestion: "Ensure your Excel file contains at least one data sheet",
        canContinue: !1
      }), n;
    },
    /**
     * Transform WMS input data to normalized format
     * Generic implementation - user provides column mappings
     */
    transform: (a, n) => {
      const { warehouseId: i } = n, s = a.sheets.Products, c = [];
      if (s) {
        const { headers: h, rows: p } = s, m = new Map(h.map((x, u) => [x, u]));
        for (const x of p) {
          const u = x;
          c.push({
            id: e(u, m.get("id"), ""),
            sku: e(u, m.get("sku"), ""),
            name: e(u, m.get("name"), ""),
            description: e(u, m.get("description"), ""),
            category: e(u, m.get("category"), ""),
            subcategory: e(u, m.get("subcategory"), ""),
            brand: e(u, m.get("brand"), ""),
            unit: e(u, m.get("unit"), "ea"),
            weight: t(u, m.get("weight")),
            volume: t(u, m.get("volume")),
            minStock: t(u, m.get("min_stock")),
            maxStock: t(u, m.get("max_stock")),
            reorderPoint: t(u, m.get("reorder_point")),
            reorderQuantity: t(u, m.get("reorder_quantity")),
            costPrice: t(u, m.get("cost_price")),
            sellingPrice: t(u, m.get("selling_price")),
            supplier: e(u, m.get("supplier"), ""),
            status: e(u, m.get("status"), "") || "in_stock"
          });
        }
      }
      const o = a.sheets.Inventory, l = [];
      if (o) {
        const { headers: h, rows: p } = o, m = new Map(h.map((x, u) => [x, u]));
        for (const x of p) {
          const u = x, v = e(u, m.get("product_id"), "");
          v && l.push({
            warehouseId: i,
            productId: v,
            locationId: e(u, m.get("location_id"), ""),
            quantity: t(u, m.get("quantity")) || 0,
            availableQuantity: t(u, m.get("available_quantity")) || 0,
            reservedQuantity: t(u, m.get("reserved_quantity")) || 0
          });
        }
      }
      const f = a.sheets.Movements, d = [];
      if (f) {
        const { headers: h, rows: p } = f, m = new Map(h.map((x, u) => [x, u]));
        for (const x of p) {
          const u = x, v = r(u, m.get("date"));
          d.push({
            warehouseId: i,
            productId: e(u, m.get("product_id"), ""),
            productSku: "",
            productName: "",
            type: e(u, m.get("type"), ""),
            sourceLocationId: e(u, m.get("source_location_id"), ""),
            sourceZone: e(u, m.get("source_zone"), ""),
            sourceLocationCode: e(u, m.get("source_location_code"), ""),
            destinationLocationId: e(u, m.get("destination_location_id"), ""),
            destinationZone: e(u, m.get("destination_zone"), ""),
            destinationLocationCode: e(u, m.get("destination_location_code"), ""),
            quantity: t(u, m.get("quantity")) || 0,
            unit: "ea",
            movementDate: v || /* @__PURE__ */ new Date(),
            user: e(u, m.get("user"), ""),
            reason: e(u, m.get("reason"), "")
          });
        }
      }
      return {
        metadata: {
          warehouseId: i,
          importDate: /* @__PURE__ */ new Date(),
          pluginId: "generic-excel",
          pluginVersion: "1.0.0",
          wmsSystem: "Generic"
        },
        products: c,
        inventory: l,
        movements: d
      };
    }
  };
  function e(a, n, i) {
    if (n === void 0 || n < 0 || n >= a.length)
      return i;
    const s = a[n];
    return s ? String(s) : i;
  }
  function t(a, n) {
    if (n === void 0 || n < 0 || n >= a.length)
      return;
    const i = a[n];
    if (i == null)
      return;
    const s = Number(i);
    return isNaN(s) ? void 0 : s;
  }
  function r(a, n) {
    if (n === void 0 || n < 0 || n >= a.length)
      return;
    const i = a[n];
    if (i == null)
      return;
    if (i instanceof Date)
      return i;
    const s = String(i), c = new Date(s);
    return isNaN(c.getTime()) ? void 0 : c;
  }
  return Oa;
}
var Ia = {}, c0;
function kl() {
  if (c0) return Ia;
  c0 = 1, Object.defineProperty(Ia, "__esModule", { value: !0 }), Ia.mockDataGeneratorPlugin = void 0;
  const e = [
    "Electronics",
    "Clothing",
    "Food & Beverages",
    "Home & Garden",
    "Sports & Outdoors",
    "Tools & Hardware",
    "Health & Beauty",
    "Toys & Games",
    "Automotive",
    "Office Supplies"
  ], t = ["ea", "kg", "lb", "m", "l", "gal", "box", "pallet"];
  Ia.mockDataGeneratorPlugin = {
    // Identification
    id: "mock-data-generator",
    name: "Mock Data Generator",
    version: "1.0.0",
    description: "Generates realistic test data for development and testing",
    author: "Wareflow",
    // WMS compatibility
    wmsSystem: "Mock",
    supportedFormats: [],
    // No file input needed
    // Input schema - not applicable for mock generator
    inputSchema: {
      sheets: []
    },
    /**
     * Validate - always returns empty for mock generator
     */
    validate: () => [],
    /**
     * Transform - generates mock data
     */
    transform: (u, v) => {
      const { warehouseId: E } = v, g = r(E), y = a(E, g), N = n(E, g, y), A = i(50), w = s(E, A, N), P = c(E, A, N, 200);
      return {
        metadata: {
          warehouseId: E,
          importDate: /* @__PURE__ */ new Date(),
          pluginId: "mock-data-generator",
          pluginVersion: "1.0.0",
          wmsSystem: "Mock"
        },
        products: A,
        inventory: w,
        movements: P,
        locations: N,
        zones: g,
        sectors: y
      };
    }
  };
  function r(u) {
    const v = [], E = ["Storage Zone A", "Storage Zone B", "Storage Zone C", "Storage Zone D", "Storage Zone E"];
    for (let g = 0; g < 5; g++)
      v.push({
        id: `ZONE-${g + 1}`,
        warehouseId: u,
        code: `ZONE-${String(g + 1).padStart(3, "0")}`,
        name: E[g],
        type: "storage",
        surface: o(500, 2e3),
        capacity: o(1e3, 5e3),
        status: "active"
      });
    return v;
  }
  function a(u, v) {
    const E = [], g = ["PICKING", "STORAGE", "RECEPTION", "SHIPPING", "RESERVED"];
    let y = 0;
    for (const N of v)
      for (const A of g)
        y++, E.push({
          id: `SECTOR-${y}`,
          warehouseId: u,
          zoneId: N.id,
          code: `${N.code}-${A.substring(0, 3)}`,
          name: `${N.name} - ${A.charAt(0) + A.slice(1).toLowerCase()}`,
          type: A.toLowerCase(),
          capacity: o(200, 1e3),
          status: "active"
        });
    return E;
  }
  function n(u, v, E) {
    const g = [];
    let y = 0;
    for (let N = 0; N < v.length; N++) {
      const A = v[N];
      for (let w = 0; w < E.length; w++) {
        const P = E[w];
        if (P.zoneId === A.id)
          for (let L = 0; L < 2; L++) {
            y++;
            const U = `LOC-${String(y).padStart(2, "0")}`, M = String.fromCharCode(65 + N), b = w % 3 + 1, K = L + 1;
            let se;
            P.type === "reserved" ? se = "reserved" : P.type === "reception" ? se = Math.random() < 0.5 ? "occupied" : "available" : P.type === "storage" ? se = Math.random() < 0.7 ? "occupied" : "available" : se = "available";
            const re = o(50, 500), ue = se === "occupied" ? o(10, re) : 0, oe = se === "occupied" ? o(1, 5) : 0, Le = P.type === "picking" ? o(1, 3) : 0;
            g.push({
              id: U,
              code: `${M}-${b.toString().padStart(2, "0")}-${K.toString().padStart(2, "0")}`,
              type: P.type,
              capacity: re,
              usedCapacity: ue,
              productCount: oe,
              pickerCount: Le,
              aisle: M,
              level: b,
              position: K.toString(),
              barcode: `LOC-${U}`,
              status: se,
              zoneId: A.id,
              sectorId: P.id,
              warehouseId: u,
              updatedAt: /* @__PURE__ */ new Date()
            });
          }
      }
    }
    return g;
  }
  function i(u) {
    const v = [];
    for (let E = 0; E < u; E++) {
      const g = e[o(0, e.length - 1)], y = t[o(0, t.length - 1)], N = Math.random();
      let A, w;
      N < 0.2 ? (A = l(50, 500), w = o(50, 200)) : N < 0.5 ? (A = l(10, 100), w = o(20, 100)) : (A = l(1, 50), w = o(5, 50)), v.push({
        id: `PROD-${String(E + 1).padStart(4, "0")}`,
        sku: `SKU-${g.substring(0, 3).toUpperCase()}-${String(E + 1).padStart(4, "0")}`,
        name: `${g} Product ${E + 1}`,
        description: `High-quality ${g.toLowerCase()} product for various applications`,
        category: g,
        subcategory: d(g),
        brand: h(),
        unit: y,
        weight: l(0.1, 50),
        volume: l(0.01, 2),
        minStock: w,
        maxStock: w * o(2, 5),
        reorderPoint: Math.floor(w * 0.2),
        reorderQuantity: w,
        costPrice: A,
        sellingPrice: A * l(1.3, 2.5),
        supplier: p(),
        status: "in_stock"
      });
    }
    return v;
  }
  function s(u, v, E) {
    const g = [];
    for (const y of v) {
      const N = o(0, (y.maxStock || 100) * 2), A = E[o(0, E.length - 1)];
      g.push({
        warehouseId: u,
        productId: y.id,
        locationId: A.id,
        quantity: N,
        availableQuantity: Math.floor(N * l(0.7, 1)),
        reservedQuantity: Math.floor(N * l(0, 0.3))
      });
    }
    return g;
  }
  function c(u, v, E, g) {
    const y = [], N = /* @__PURE__ */ new Date(), A = new Date(N.getTime() - 2160 * 60 * 60 * 1e3);
    for (let w = 0; w < g; w++) {
      const P = v[o(0, v.length - 1)], L = f(A, N), U = Math.floor((N.getTime() - L.getTime()) / (1440 * 60 * 1e3));
      let M;
      U < 30 ? M = Math.random() < 0.7 ? "outbound" : "inbound" : U < 60 ? M = m() : M = Math.random() < 0.6 ? "inbound" : "transfer";
      const b = o(1, 100), K = E[o(0, E.length - 1)], se = E[o(0, E.length - 1)];
      y.push({
        warehouseId: u,
        productId: P.id,
        productSku: P.sku,
        productName: P.name,
        type: M,
        sourceLocationId: M === "outbound" ? K.id : void 0,
        sourceZone: M === "outbound" ? K.zoneId : void 0,
        sourceLocationCode: M === "outbound" ? K.code : void 0,
        destinationLocationId: M === "inbound" ? se.id : void 0,
        destinationZone: M === "inbound" ? se.zoneId : void 0,
        destinationLocationCode: M === "inbound" ? se.code : void 0,
        quantity: b,
        unit: P.unit,
        movementDate: L,
        user: `User-${o(1, 10)}`,
        reason: x(M)
      });
    }
    return y.sort((w, P) => w.movementDate.getTime() - P.movementDate.getTime());
  }
  function o(u, v) {
    return Math.floor(Math.random() * (v - u + 1)) + u;
  }
  function l(u, v) {
    return Math.round((Math.random() * (v - u) + u) * 100) / 100;
  }
  function f(u, v) {
    return new Date(u.getTime() + Math.random() * (v.getTime() - u.getTime()));
  }
  function d(u) {
    const E = {
      Electronics: ["Computers", "Phones", "Tablets", "Accessories", "Audio"],
      Clothing: ["Men", "Women", "Kids", "Shoes", "Accessories"],
      "Food & Beverages": ["Snacks", "Beverages", "Canned Goods", "Dairy", "Frozen"],
      "Home & Garden": ["Furniture", "Decor", "Kitchen", "Garden", "Tools"],
      "Sports & Outdoors": ["Fitness", "Outdoor", "Team Sports", "Water Sports", "Winter Sports"],
      "Tools & Hardware": ["Power Tools", "Hand Tools", "Hardware", "Safety", "Storage"],
      "Health & Beauty": ["Skincare", "Haircare", "Vitamins", "Personal Care", "Wellness"],
      "Toys & Games": ["Educational", "Outdoor", "Board Games", "Electronic", "Infant"],
      Automotive: ["Parts", "Accessories", "Tools", "Fluids", "Electronics"],
      "Office Supplies": ["Paper", "Writing", "Desk Accessories", "Filing", "Technology"]
    }[u] || ["General"];
    return E[o(0, E.length - 1)];
  }
  function h() {
    const u = [
      "TechPro",
      "HomeMaster",
      "QualityFirst",
      "PremiumBrand",
      "ValueLine",
      "EliteSeries",
      "Professional",
      "Standard",
      "Essential",
      "Ultra"
    ];
    return u[o(0, u.length - 1)];
  }
  function p() {
    const u = [
      "Global Supplies Inc",
      "Quality Distributors Ltd",
      "Premium Wholesalers",
      "International Trading Co",
      "Metro Supplies",
      "National Distribution",
      "WorldWide Logistics",
      "Prime Suppliers",
      "Atlantic Trading",
      "Pacific Imports"
    ];
    return u[o(0, u.length - 1)];
  }
  function m() {
    const u = ["inbound", "outbound", "transfer", "adjustment"];
    return u[o(0, u.length - 1)];
  }
  function x(u) {
    const E = {
      inbound: ["Purchase receipt", "Return", "Transfer in", "Correction"],
      outbound: ["Sale", "Transfer out", "Damage", "Expiration"],
      transfer: ["Location transfer", "Zone transfer", "Replenishment"],
      adjustment: ["Inventory count", "Damage correction", "System adjustment"]
    }[u] || ["Other"];
    return E[o(0, E.length - 1)];
  }
  return Ia;
}
var o0;
function Oc() {
  return o0 || (o0 = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.initializeDefaultPlugins = e.pluginExists = e.unregisterPlugin = e.registerPlugin = e.listPlugins = e.getPlugin = e.registry = void 0;
    const t = Sl(), r = kl();
    e.registry = {};
    const a = (l) => e.registry[l];
    e.getPlugin = a;
    const n = () => Object.values(e.registry);
    e.listPlugins = n;
    const i = (l) => {
      e.registry[l.id] = l;
    };
    e.registerPlugin = i;
    const s = (l) => {
      delete e.registry[l];
    };
    e.unregisterPlugin = s;
    const c = (l) => l in e.registry;
    e.pluginExists = c;
    const o = () => {
      (0, e.registerPlugin)(t.genericExcelPlugin), (0, e.registerPlugin)(r.mockDataGeneratorPlugin);
    };
    e.initializeDefaultPlugins = o;
  })(xi)), xi;
}
var Fr = {}, ur = {};
var Ya = {};
Ya.version = "0.18.5";
var Pr = 1200, zt = 1252, Fl = [874, 932, 936, 949, 950, 1250, 1251, 1252, 1253, 1254, 1255, 1256, 1257, 1258, 1e4], zi = {
  /*::[*/
  0: 1252,
  /* ANSI */
  /*::[*/
  1: 65001,
  /* DEFAULT */
  /*::[*/
  2: 65001,
  /* SYMBOL */
  /*::[*/
  77: 1e4,
  /* MAC */
  /*::[*/
  128: 932,
  /* SHIFTJIS */
  /*::[*/
  129: 949,
  /* HANGUL */
  /*::[*/
  130: 1361,
  /* JOHAB */
  /*::[*/
  134: 936,
  /* GB2312 */
  /*::[*/
  136: 950,
  /* CHINESEBIG5 */
  /*::[*/
  161: 1253,
  /* GREEK */
  /*::[*/
  162: 1254,
  /* TURKISH */
  /*::[*/
  163: 1258,
  /* VIETNAMESE */
  /*::[*/
  177: 1255,
  /* HEBREW */
  /*::[*/
  178: 1256,
  /* ARABIC */
  /*::[*/
  186: 1257,
  /* BALTIC */
  /*::[*/
  204: 1251,
  /* RUSSIAN */
  /*::[*/
  222: 874,
  /* THAI */
  /*::[*/
  238: 1250,
  /* EASTEUROPE */
  /*::[*/
  255: 1252,
  /* OEM */
  /*::[*/
  69: 6969
  /* MISC */
}, Gn = function(e) {
  Fl.indexOf(e) != -1 && (zt = zi[0] = e);
};
function Al() {
  Gn(1252);
}
var jr = function(e) {
  Pr = e, Gn(e);
};
function Vn() {
  jr(1200), Al();
}
function Cn(e) {
  for (var t = [], r = 0, a = e.length; r < a; ++r) t[r] = e.charCodeAt(r);
  return t;
}
function Nl(e) {
  for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r) + (e.charCodeAt(2 * r + 1) << 8));
  return t.join("");
}
function Ic(e) {
  for (var t = [], r = 0; r < e.length >> 1; ++r) t[r] = String.fromCharCode(e.charCodeAt(2 * r + 1) + (e.charCodeAt(2 * r) << 8));
  return t.join("");
}
var la = function(e) {
  var t = e.charCodeAt(0), r = e.charCodeAt(1);
  return t == 255 && r == 254 ? Nl(e.slice(2)) : t == 254 && r == 255 ? Ic(e.slice(2)) : t == 65279 ? e.slice(1) : e;
}, ba = function(t) {
  return String.fromCharCode(t);
}, Ii = function(t) {
  return String.fromCharCode(t);
}, Ce;
function Cl(e) {
  Ce = e, jr = function(t) {
    Pr = t, Gn(t);
  }, la = function(t) {
    return t.charCodeAt(0) === 255 && t.charCodeAt(1) === 254 ? Ce.utils.decode(1200, Cn(t.slice(2))) : t;
  }, ba = function(r) {
    return Pr === 1200 ? String.fromCharCode(r) : Ce.utils.decode(Pr, [r & 255, r >> 8])[0];
  }, Ii = function(r) {
    return Ce.utils.decode(zt, [r])[0];
  }, so();
}
var Ft = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
function ja(e) {
  for (var t = "", r = 0, a = 0, n = 0, i = 0, s = 0, c = 0, o = 0, l = 0; l < e.length; )
    r = e.charCodeAt(l++), i = r >> 2, a = e.charCodeAt(l++), s = (r & 3) << 4 | a >> 4, n = e.charCodeAt(l++), c = (a & 15) << 2 | n >> 6, o = n & 63, isNaN(a) ? c = o = 64 : isNaN(n) && (o = 64), t += Ft.charAt(i) + Ft.charAt(s) + Ft.charAt(c) + Ft.charAt(o);
  return t;
}
function Mr(e) {
  var t = "", r = 0, a = 0, n = 0, i = 0, s = 0, c = 0, o = 0;
  e = e.replace(/[^\w\+\/\=]/g, "");
  for (var l = 0; l < e.length; )
    i = Ft.indexOf(e.charAt(l++)), s = Ft.indexOf(e.charAt(l++)), r = i << 2 | s >> 4, t += String.fromCharCode(r), c = Ft.indexOf(e.charAt(l++)), a = (s & 15) << 4 | c >> 2, c !== 64 && (t += String.fromCharCode(a)), o = Ft.indexOf(e.charAt(l++)), n = (c & 3) << 6 | o, o !== 64 && (t += String.fromCharCode(n));
  return t;
}
var ye = /* @__PURE__ */ (function() {
  return typeof Buffer < "u" && typeof process < "u" && typeof process.versions < "u" && !!process.versions.node;
})(), _t = /* @__PURE__ */ (function() {
  if (typeof Buffer < "u") {
    var e = !Buffer.from;
    if (!e) try {
      Buffer.from("foo", "utf8");
    } catch {
      e = !0;
    }
    return e ? function(t, r) {
      return r ? new Buffer(t, r) : new Buffer(t);
    } : Buffer.from.bind(Buffer);
  }
  return function() {
  };
})();
function Ot(e) {
  return ye ? Buffer.alloc ? Buffer.alloc(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : new Array(e);
}
function f0(e) {
  return ye ? Buffer.allocUnsafe ? Buffer.allocUnsafe(e) : new Buffer(e) : typeof Uint8Array < "u" ? new Uint8Array(e) : new Array(e);
}
var Dr = function(t) {
  return ye ? _t(t, "binary") : t.split("").map(function(r) {
    return r.charCodeAt(0) & 255;
  });
};
function cn(e) {
  if (typeof ArrayBuffer > "u") return Dr(e);
  for (var t = new ArrayBuffer(e.length), r = new Uint8Array(t), a = 0; a != e.length; ++a) r[a] = e.charCodeAt(a) & 255;
  return t;
}
function Dt(e) {
  if (Array.isArray(e)) return e.map(function(a) {
    return String.fromCharCode(a);
  }).join("");
  for (var t = [], r = 0; r < e.length; ++r) t[r] = String.fromCharCode(e[r]);
  return t.join("");
}
function Ol(e) {
  if (typeof Uint8Array > "u") throw new Error("Unsupported");
  return new Uint8Array(e);
}
function Yi(e) {
  if (typeof ArrayBuffer > "u") throw new Error("Unsupported");
  if (e instanceof ArrayBuffer) return Yi(new Uint8Array(e));
  for (var t = new Array(e.length), r = 0; r < e.length; ++r) t[r] = e[r];
  return t;
}
var fr = ye ? function(e) {
  return Buffer.concat(e.map(function(t) {
    return Buffer.isBuffer(t) ? t : _t(t);
  }));
} : function(e) {
  if (typeof Uint8Array < "u") {
    var t = 0, r = 0;
    for (t = 0; t < e.length; ++t) r += e[t].length;
    var a = new Uint8Array(r), n = 0;
    for (t = 0, r = 0; t < e.length; r += n, ++t)
      if (n = e[t].length, e[t] instanceof Uint8Array) a.set(e[t], r);
      else {
        if (typeof e[t] == "string")
          throw "wtf";
        a.set(new Uint8Array(e[t]), r);
      }
    return a;
  }
  return [].concat.apply([], e.map(function(i) {
    return Array.isArray(i) ? i : [].slice.call(i);
  }));
};
function Il(e) {
  for (var t = [], r = 0, a = e.length + 250, n = Ot(e.length + 255), i = 0; i < e.length; ++i) {
    var s = e.charCodeAt(i);
    if (s < 128) n[r++] = s;
    else if (s < 2048)
      n[r++] = 192 | s >> 6 & 31, n[r++] = 128 | s & 63;
    else if (s >= 55296 && s < 57344) {
      s = (s & 1023) + 64;
      var c = e.charCodeAt(++i) & 1023;
      n[r++] = 240 | s >> 8 & 7, n[r++] = 128 | s >> 2 & 63, n[r++] = 128 | c >> 6 & 15 | (s & 3) << 4, n[r++] = 128 | c & 63;
    } else
      n[r++] = 224 | s >> 12 & 15, n[r++] = 128 | s >> 6 & 63, n[r++] = 128 | s & 63;
    r > a && (t.push(n.slice(0, r)), r = 0, n = Ot(65535), a = 65530);
  }
  return t.push(n.slice(0, r)), fr(t);
}
var Tr = /\u0000/g, Pa = /[\u0001-\u0006]/g;
function ha(e) {
  for (var t = "", r = e.length - 1; r >= 0; ) t += e.charAt(r--);
  return t;
}
function Qr(e, t) {
  var r = "" + e;
  return r.length >= t ? r : je("0", t - r.length) + r;
}
function ji(e, t) {
  var r = "" + e;
  return r.length >= t ? r : je(" ", t - r.length) + r;
}
function On(e, t) {
  var r = "" + e;
  return r.length >= t ? r : r + je(" ", t - r.length);
}
function Ll(e, t) {
  var r = "" + Math.round(e);
  return r.length >= t ? r : je("0", t - r.length) + r;
}
function Rl(e, t) {
  var r = "" + e;
  return r.length >= t ? r : je("0", t - r.length) + r;
}
var l0 = /* @__PURE__ */ Math.pow(2, 32);
function sa(e, t) {
  if (e > l0 || e < -l0) return Ll(e, t);
  var r = Math.round(e);
  return Rl(r, t);
}
function In(e, t) {
  return t = t || 0, e.length >= 7 + t && (e.charCodeAt(t) | 32) === 103 && (e.charCodeAt(t + 1) | 32) === 101 && (e.charCodeAt(t + 2) | 32) === 110 && (e.charCodeAt(t + 3) | 32) === 101 && (e.charCodeAt(t + 4) | 32) === 114 && (e.charCodeAt(t + 5) | 32) === 97 && (e.charCodeAt(t + 6) | 32) === 108;
}
var u0 = [
  ["Sun", "Sunday"],
  ["Mon", "Monday"],
  ["Tue", "Tuesday"],
  ["Wed", "Wednesday"],
  ["Thu", "Thursday"],
  ["Fri", "Friday"],
  ["Sat", "Saturday"]
], pi = [
  ["J", "Jan", "January"],
  ["F", "Feb", "February"],
  ["M", "Mar", "March"],
  ["A", "Apr", "April"],
  ["M", "May", "May"],
  ["J", "Jun", "June"],
  ["J", "Jul", "July"],
  ["A", "Aug", "August"],
  ["S", "Sep", "September"],
  ["O", "Oct", "October"],
  ["N", "Nov", "November"],
  ["D", "Dec", "December"]
];
function Dl(e) {
  return e || (e = {}), e[0] = "General", e[1] = "0", e[2] = "0.00", e[3] = "#,##0", e[4] = "#,##0.00", e[9] = "0%", e[10] = "0.00%", e[11] = "0.00E+00", e[12] = "# ?/?", e[13] = "# ??/??", e[14] = "m/d/yy", e[15] = "d-mmm-yy", e[16] = "d-mmm", e[17] = "mmm-yy", e[18] = "h:mm AM/PM", e[19] = "h:mm:ss AM/PM", e[20] = "h:mm", e[21] = "h:mm:ss", e[22] = "m/d/yy h:mm", e[37] = "#,##0 ;(#,##0)", e[38] = "#,##0 ;[Red](#,##0)", e[39] = "#,##0.00;(#,##0.00)", e[40] = "#,##0.00;[Red](#,##0.00)", e[45] = "mm:ss", e[46] = "[h]:mm:ss", e[47] = "mmss.0", e[48] = "##0.0E+0", e[49] = "@", e[56] = '"上午/下午 "hh"時"mm"分"ss"秒 "', e;
}
var pe = {
  0: "General",
  1: "0",
  2: "0.00",
  3: "#,##0",
  4: "#,##0.00",
  9: "0%",
  10: "0.00%",
  11: "0.00E+00",
  12: "# ?/?",
  13: "# ??/??",
  14: "m/d/yy",
  15: "d-mmm-yy",
  16: "d-mmm",
  17: "mmm-yy",
  18: "h:mm AM/PM",
  19: "h:mm:ss AM/PM",
  20: "h:mm",
  21: "h:mm:ss",
  22: "m/d/yy h:mm",
  37: "#,##0 ;(#,##0)",
  38: "#,##0 ;[Red](#,##0)",
  39: "#,##0.00;(#,##0.00)",
  40: "#,##0.00;[Red](#,##0.00)",
  45: "mm:ss",
  46: "[h]:mm:ss",
  47: "mmss.0",
  48: "##0.0E+0",
  49: "@",
  56: '"上午/下午 "hh"時"mm"分"ss"秒 "'
}, h0 = {
  5: 37,
  6: 38,
  7: 39,
  8: 40,
  //  5 -> 37 ...  8 -> 40
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  // 23 ->  0 ... 26 ->  0
  27: 14,
  28: 14,
  29: 14,
  30: 14,
  31: 14,
  // 27 -> 14 ... 31 -> 14
  50: 14,
  51: 14,
  52: 14,
  53: 14,
  54: 14,
  // 50 -> 14 ... 58 -> 14
  55: 14,
  56: 14,
  57: 14,
  58: 14,
  59: 1,
  60: 2,
  61: 3,
  62: 4,
  // 59 ->  1 ... 62 ->  4
  67: 9,
  68: 10,
  // 67 ->  9 ... 68 -> 10
  69: 12,
  70: 13,
  71: 14,
  // 69 -> 12 ... 71 -> 14
  72: 14,
  73: 15,
  74: 16,
  75: 17,
  // 72 -> 14 ... 75 -> 17
  76: 20,
  77: 21,
  78: 22,
  // 76 -> 20 ... 78 -> 22
  79: 45,
  80: 46,
  81: 47,
  // 79 -> 45 ... 81 -> 47
  82: 0
  // 82 ->  0 ... 65536 -> 0 (omitted)
}, bl = {
  //  5 -- Currency,   0 decimal, black negative
  5: '"$"#,##0_);\\("$"#,##0\\)',
  63: '"$"#,##0_);\\("$"#,##0\\)',
  //  6 -- Currency,   0 decimal, red   negative
  6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  //  7 -- Currency,   2 decimal, black negative
  7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  //  8 -- Currency,   2 decimal, red   negative
  8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  // 41 -- Accounting, 0 decimal, No Symbol
  41: '_(* #,##0_);_(* \\(#,##0\\);_(* "-"_);_(@_)',
  // 42 -- Accounting, 0 decimal, $  Symbol
  42: '_("$"* #,##0_);_("$"* \\(#,##0\\);_("$"* "-"_);_(@_)',
  // 43 -- Accounting, 2 decimal, No Symbol
  43: '_(* #,##0.00_);_(* \\(#,##0.00\\);_(* "-"??_);_(@_)',
  // 44 -- Accounting, 2 decimal, $  Symbol
  44: '_("$"* #,##0.00_);_("$"* \\(#,##0.00\\);_("$"* "-"??_);_(@_)'
};
function Ln(e, t, r) {
  for (var a = e < 0 ? -1 : 1, n = e * a, i = 0, s = 1, c = 0, o = 1, l = 0, f = 0, d = Math.floor(n); l < t && (d = Math.floor(n), c = d * s + i, f = d * l + o, !(n - d < 5e-8)); )
    n = 1 / (n - d), i = s, s = c, o = l, l = f;
  if (f > t && (l > t ? (f = o, c = i) : (f = l, c = s)), !r) return [0, a * c, f];
  var h = Math.floor(a * c / f);
  return [h, a * c - h * f, f];
}
function At(e, t, r) {
  if (e > 2958465 || e < 0) return null;
  var a = e | 0, n = Math.floor(86400 * (e - a)), i = 0, s = [], c = { D: a, T: n, u: 86400 * (e - a) - n, y: 0, m: 0, d: 0, H: 0, M: 0, S: 0, q: 0 };
  if (Math.abs(c.u) < 1e-6 && (c.u = 0), t && t.date1904 && (a += 1462), c.u > 0.9999 && (c.u = 0, ++n == 86400 && (c.T = n = 0, ++a, ++c.D)), a === 60)
    s = r ? [1317, 10, 29] : [1900, 2, 29], i = 3;
  else if (a === 0)
    s = r ? [1317, 8, 29] : [1900, 1, 0], i = 6;
  else {
    a > 60 && --a;
    var o = new Date(1900, 0, 1);
    o.setDate(o.getDate() + a - 1), s = [o.getFullYear(), o.getMonth() + 1, o.getDate()], i = o.getDay(), a < 60 && (i = (i + 6) % 7), r && (i = Wl(o, s));
  }
  return c.y = s[0], c.m = s[1], c.d = s[2], c.S = n % 60, n = Math.floor(n / 60), c.M = n % 60, n = Math.floor(n / 60), c.H = n, c.q = i, c;
}
var Lc = /* @__PURE__ */ new Date(1899, 11, 31, 0, 0, 0), Pl = /* @__PURE__ */ Lc.getTime(), Ml = /* @__PURE__ */ new Date(1900, 2, 1, 0, 0, 0);
function Rc(e, t) {
  var r = /* @__PURE__ */ e.getTime();
  return t ? r -= 1461 * 24 * 60 * 60 * 1e3 : e >= Ml && (r += 1440 * 60 * 1e3), (r - (Pl + (/* @__PURE__ */ e.getTimezoneOffset() - /* @__PURE__ */ Lc.getTimezoneOffset()) * 6e4)) / (1440 * 60 * 1e3);
}
function Ki(e) {
  return e.indexOf(".") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)$/, "$1");
}
function Bl(e) {
  return e.indexOf("E") == -1 ? e : e.replace(/(?:\.0*|(\.\d*[1-9])0+)[Ee]/, "$1E").replace(/(E[+-])(\d)$/, "$10$2");
}
function Ul(e) {
  var t = e < 0 ? 12 : 11, r = Ki(e.toFixed(12));
  return r.length <= t || (r = e.toPrecision(10), r.length <= t) ? r : e.toExponential(5);
}
function Xl(e) {
  var t = Ki(e.toFixed(11));
  return t.length > (e < 0 ? 12 : 11) || t === "0" || t === "-0" ? e.toPrecision(6) : t;
}
function Ka(e) {
  var t = Math.floor(Math.log(Math.abs(e)) * Math.LOG10E), r;
  return t >= -4 && t <= -1 ? r = e.toPrecision(10 + t) : Math.abs(t) <= 9 ? r = Ul(e) : t === 10 ? r = e.toFixed(10).substr(0, 12) : r = Xl(e), Ki(Bl(r.toUpperCase()));
}
function Yt(e, t) {
  switch (typeof e) {
    case "string":
      return e;
    case "boolean":
      return e ? "TRUE" : "FALSE";
    case "number":
      return (e | 0) === e ? e.toString(10) : Ka(e);
    case "undefined":
      return "";
    case "object":
      if (e == null) return "";
      if (e instanceof Date) return Br(14, Rc(e, t && t.date1904), t);
  }
  throw new Error("unsupported value in General format: " + e);
}
function Wl(e, t) {
  t[0] -= 581;
  var r = e.getDay();
  return e < 60 && (r = (r + 6) % 7), r;
}
function Hl(e, t, r, a) {
  var n = "", i = 0, s = 0, c = r.y, o, l = 0;
  switch (e) {
    case 98:
      c = r.y + 543;
    /* falls through */
    case 121:
      switch (t.length) {
        case 1:
        case 2:
          o = c % 100, l = 2;
          break;
        default:
          o = c % 1e4, l = 4;
          break;
      }
      break;
    case 109:
      switch (t.length) {
        case 1:
        case 2:
          o = r.m, l = t.length;
          break;
        case 3:
          return pi[r.m - 1][1];
        case 5:
          return pi[r.m - 1][0];
        default:
          return pi[r.m - 1][2];
      }
      break;
    case 100:
      switch (t.length) {
        case 1:
        case 2:
          o = r.d, l = t.length;
          break;
        case 3:
          return u0[r.q][0];
        default:
          return u0[r.q][1];
      }
      break;
    case 104:
      switch (t.length) {
        case 1:
        case 2:
          o = 1 + (r.H + 11) % 12, l = t.length;
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 72:
      switch (t.length) {
        case 1:
        case 2:
          o = r.H, l = t.length;
          break;
        default:
          throw "bad hour format: " + t;
      }
      break;
    case 77:
      switch (t.length) {
        case 1:
        case 2:
          o = r.M, l = t.length;
          break;
        default:
          throw "bad minute format: " + t;
      }
      break;
    case 115:
      if (t != "s" && t != "ss" && t != ".0" && t != ".00" && t != ".000") throw "bad second format: " + t;
      return r.u === 0 && (t == "s" || t == "ss") ? Qr(r.S, t.length) : (a >= 2 ? s = a === 3 ? 1e3 : 100 : s = a === 1 ? 10 : 1, i = Math.round(s * (r.S + r.u)), i >= 60 * s && (i = 0), t === "s" ? i === 0 ? "0" : "" + i / s : (n = Qr(i, 2 + a), t === "ss" ? n.substr(0, 2) : "." + n.substr(2, t.length - 1)));
    case 90:
      switch (t) {
        case "[h]":
        case "[hh]":
          o = r.D * 24 + r.H;
          break;
        case "[m]":
        case "[mm]":
          o = (r.D * 24 + r.H) * 60 + r.M;
          break;
        case "[s]":
        case "[ss]":
          o = ((r.D * 24 + r.H) * 60 + r.M) * 60 + Math.round(r.S + r.u);
          break;
        default:
          throw "bad abstime format: " + t;
      }
      l = t.length === 3 ? 1 : 2;
      break;
    case 101:
      o = c, l = 1;
      break;
  }
  var f = l > 0 ? Qr(o, l) : "";
  return f;
}
function Nt(e) {
  var t = 3;
  if (e.length <= t) return e;
  for (var r = e.length % t, a = e.substr(0, r); r != e.length; r += t) a += (a.length > 0 ? "," : "") + e.substr(r, t);
  return a;
}
var Dc = /%/g;
function Gl(e, t, r) {
  var a = t.replace(Dc, ""), n = t.length - a.length;
  return vt(e, a, r * Math.pow(10, 2 * n)) + je("%", n);
}
function Vl(e, t, r) {
  for (var a = t.length - 1; t.charCodeAt(a - 1) === 44; ) --a;
  return vt(e, t.substr(0, a), r / Math.pow(10, 3 * (t.length - a)));
}
function bc(e, t) {
  var r, a = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + bc(e, -t);
    var n = e.indexOf(".");
    n === -1 && (n = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % n;
    if (i < 0 && (i += n), r = (t / Math.pow(10, i)).toPrecision(a + 1 + (n + i) % n), r.indexOf("e") === -1) {
      var s = Math.floor(Math.log(t) * Math.LOG10E);
      for (r.indexOf(".") === -1 ? r = r.charAt(0) + "." + r.substr(1) + "E+" + (s - r.length + i) : r += "E+" + (s - i); r.substr(0, 2) === "0."; )
        r = r.charAt(0) + r.substr(2, n) + "." + r.substr(2 + n), r = r.replace(/^0+([1-9])/, "$1").replace(/^0+\./, "0.");
      r = r.replace(/\+-/, "-");
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(c, o, l, f) {
      return o + l + f.substr(0, (n + i) % n) + "." + f.substr(i) + "E";
    });
  } else r = t.toExponential(a);
  return e.match(/E\+00$/) && r.match(/e[+-]\d$/) && (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)), e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")), r.replace("e", "E");
}
var Pc = /# (\?+)( ?)\/( ?)(\d+)/;
function zl(e, t, r) {
  var a = parseInt(e[4], 10), n = Math.round(t * a), i = Math.floor(n / a), s = n - i * a, c = a;
  return r + (i === 0 ? "" : "" + i) + " " + (s === 0 ? je(" ", e[1].length + 1 + e[4].length) : ji(s, e[1].length) + e[2] + "/" + e[3] + Qr(c, e[4].length));
}
function Yl(e, t, r) {
  return r + (t === 0 ? "" : "" + t) + je(" ", e[1].length + 2 + e[4].length);
}
var Mc = /^#*0*\.([0#]+)/, Bc = /\).*[0#]/, Uc = /\(###\) ###\\?-####/;
function Ar(e) {
  for (var t = "", r, a = 0; a != e.length; ++a) switch (r = e.charCodeAt(a)) {
    case 35:
      break;
    case 63:
      t += " ";
      break;
    case 48:
      t += "0";
      break;
    default:
      t += String.fromCharCode(r);
  }
  return t;
}
function d0(e, t) {
  var r = Math.pow(10, t);
  return "" + Math.round(e * r) / r;
}
function x0(e, t) {
  var r = e - Math.floor(e), a = Math.pow(10, t);
  return t < ("" + Math.round(r * a)).length ? 0 : Math.round(r * a);
}
function jl(e, t) {
  return t < ("" + Math.round((e - Math.floor(e)) * Math.pow(10, t))).length ? 1 : 0;
}
function Kl(e) {
  return e < 2147483647 && e > -2147483648 ? "" + (e >= 0 ? e | 0 : e - 1 | 0) : "" + Math.floor(e);
}
function Hr(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(Bc)) {
    var a = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? Hr("n", a, r) : "(" + Hr("n", a, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return Vl(e, t, r);
  if (t.indexOf("%") !== -1) return Gl(e, t, r);
  if (t.indexOf("E") !== -1) return bc(t, r);
  if (t.charCodeAt(0) === 36) return "$" + Hr(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var n, i, s, c, o = Math.abs(r), l = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return l + sa(o, t.length);
  if (t.match(/^[#?]+$/))
    return n = sa(r, 0), n === "0" && (n = ""), n.length > t.length ? n : Ar(t.substr(0, t.length - n.length)) + n;
  if (i = t.match(Pc)) return zl(i, o, l);
  if (t.match(/^#+0+$/)) return l + sa(o, t.length - t.indexOf("0"));
  if (i = t.match(Mc))
    return n = d0(r, i[1].length).replace(/^([^\.]+)$/, "$1." + Ar(i[1])).replace(/\.$/, "." + Ar(i[1])).replace(/\.(\d*)$/, function(m, x) {
      return "." + x + je("0", Ar(
        /*::(*/
        i[1]
      ).length - x.length);
    }), t.indexOf("0.") !== -1 ? n : n.replace(/^0\./, ".");
  if (t = t.replace(/^#+([0.])/, "$1"), i = t.match(/^(0*)\.(#*)$/))
    return l + d0(o, i[2].length).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, i[1].length ? "0." : ".");
  if (i = t.match(/^#{1,3},##0(\.?)$/)) return l + Nt(sa(o, 0));
  if (i = t.match(/^#,##0\.([#0]*0)$/))
    return r < 0 ? "-" + Hr(e, t, -r) : Nt("" + (Math.floor(r) + jl(r, i[1].length))) + "." + Qr(x0(r, i[1].length), i[1].length);
  if (i = t.match(/^#,#*,#0/)) return Hr(e, t.replace(/^#,#*,/, ""), r);
  if (i = t.match(/^([0#]+)(\\?-([0#]+))+$/))
    return n = ha(Hr(e, t.replace(/[\\-]/g, ""), r)), s = 0, ha(ha(t.replace(/\\/g, "")).replace(/[0#]/g, function(m) {
      return s < n.length ? n.charAt(s++) : m === "0" ? "0" : "";
    }));
  if (t.match(Uc))
    return n = Hr(e, "##########", r), "(" + n.substr(0, 3) + ") " + n.substr(3, 3) + "-" + n.substr(6);
  var f = "";
  if (i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
    return s = Math.min(
      /*::String(*/
      i[4].length,
      7
    ), c = Ln(o, Math.pow(10, s) - 1, !1), n = "" + l, f = vt(
      "n",
      /*::String(*/
      i[1],
      c[1]
    ), f.charAt(f.length - 1) == " " && (f = f.substr(0, f.length - 1) + "0"), n += f + /*::String(*/
    i[2] + "/" + /*::String(*/
    i[3], f = On(c[2], s), f.length < i[4].length && (f = Ar(i[4].substr(i[4].length - f.length)) + f), n += f, n;
  if (i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
    return s = Math.min(Math.max(i[1].length, i[4].length), 7), c = Ln(o, Math.pow(10, s) - 1, !0), l + (c[0] || (c[1] ? "" : "0")) + " " + (c[1] ? ji(c[1], s) + i[2] + "/" + i[3] + On(c[2], s) : je(" ", 2 * s + 1 + i[2].length + i[3].length));
  if (i = t.match(/^[#0?]+$/))
    return n = sa(r, 0), t.length <= n.length ? n : Ar(t.substr(0, t.length - n.length)) + n;
  if (i = t.match(/^([#0?]+)\.([#0]+)$/)) {
    n = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1"), s = n.indexOf(".");
    var d = t.indexOf(".") - s, h = t.length - n.length - d;
    return Ar(t.substr(0, d) + n + t.substr(t.length - h));
  }
  if (i = t.match(/^00,000\.([#0]*0)$/))
    return s = x0(r, i[1].length), r < 0 ? "-" + Hr(e, t, -r) : Nt(Kl(r)).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(m) {
      return "00," + (m.length < 3 ? Qr(0, 3 - m.length) : "") + m;
    }) + "." + Qr(s, i[1].length);
  switch (t) {
    case "###,##0.00":
      return Hr(e, "#,##0.00", r);
    case "###,###":
    case "##,###":
    case "#,###":
      var p = Nt(sa(o, 0));
      return p !== "0" ? l + p : "";
    case "###,###.00":
      return Hr(e, "###,##0.00", r).replace(/^0\./, ".");
    case "#,###.00":
      return Hr(e, "#,##0.00", r).replace(/^0\./, ".");
  }
  throw new Error("unsupported format |" + t + "|");
}
function ql(e, t, r) {
  for (var a = t.length - 1; t.charCodeAt(a - 1) === 44; ) --a;
  return vt(e, t.substr(0, a), r / Math.pow(10, 3 * (t.length - a)));
}
function $l(e, t, r) {
  var a = t.replace(Dc, ""), n = t.length - a.length;
  return vt(e, a, r * Math.pow(10, 2 * n)) + je("%", n);
}
function Xc(e, t) {
  var r, a = e.indexOf("E") - e.indexOf(".") - 1;
  if (e.match(/^#+0.0E\+0$/)) {
    if (t == 0) return "0.0E+0";
    if (t < 0) return "-" + Xc(e, -t);
    var n = e.indexOf(".");
    n === -1 && (n = e.indexOf("E"));
    var i = Math.floor(Math.log(t) * Math.LOG10E) % n;
    if (i < 0 && (i += n), r = (t / Math.pow(10, i)).toPrecision(a + 1 + (n + i) % n), !r.match(/[Ee]/)) {
      var s = Math.floor(Math.log(t) * Math.LOG10E);
      r.indexOf(".") === -1 ? r = r.charAt(0) + "." + r.substr(1) + "E+" + (s - r.length + i) : r += "E+" + (s - i), r = r.replace(/\+-/, "-");
    }
    r = r.replace(/^([+-]?)(\d*)\.(\d*)[Ee]/, function(c, o, l, f) {
      return o + l + f.substr(0, (n + i) % n) + "." + f.substr(i) + "E";
    });
  } else r = t.toExponential(a);
  return e.match(/E\+00$/) && r.match(/e[+-]\d$/) && (r = r.substr(0, r.length - 1) + "0" + r.charAt(r.length - 1)), e.match(/E\-/) && r.match(/e\+/) && (r = r.replace(/e\+/, "e")), r.replace("e", "E");
}
function it(e, t, r) {
  if (e.charCodeAt(0) === 40 && !t.match(Bc)) {
    var a = t.replace(/\( */, "").replace(/ \)/, "").replace(/\)/, "");
    return r >= 0 ? it("n", a, r) : "(" + it("n", a, -r) + ")";
  }
  if (t.charCodeAt(t.length - 1) === 44) return ql(e, t, r);
  if (t.indexOf("%") !== -1) return $l(e, t, r);
  if (t.indexOf("E") !== -1) return Xc(t, r);
  if (t.charCodeAt(0) === 36) return "$" + it(e, t.substr(t.charAt(1) == " " ? 2 : 1), r);
  var n, i, s, c, o = Math.abs(r), l = r < 0 ? "-" : "";
  if (t.match(/^00+$/)) return l + Qr(o, t.length);
  if (t.match(/^[#?]+$/))
    return n = "" + r, r === 0 && (n = ""), n.length > t.length ? n : Ar(t.substr(0, t.length - n.length)) + n;
  if (i = t.match(Pc)) return Yl(i, o, l);
  if (t.match(/^#+0+$/)) return l + Qr(o, t.length - t.indexOf("0"));
  if (i = t.match(Mc))
    return n = ("" + r).replace(/^([^\.]+)$/, "$1." + Ar(i[1])).replace(/\.$/, "." + Ar(i[1])), n = n.replace(/\.(\d*)$/, function(m, x) {
      return "." + x + je("0", Ar(i[1]).length - x.length);
    }), t.indexOf("0.") !== -1 ? n : n.replace(/^0\./, ".");
  if (t = t.replace(/^#+([0.])/, "$1"), i = t.match(/^(0*)\.(#*)$/))
    return l + ("" + o).replace(/\.(\d*[1-9])0*$/, ".$1").replace(/^(-?\d*)$/, "$1.").replace(/^0\./, i[1].length ? "0." : ".");
  if (i = t.match(/^#{1,3},##0(\.?)$/)) return l + Nt("" + o);
  if (i = t.match(/^#,##0\.([#0]*0)$/))
    return r < 0 ? "-" + it(e, t, -r) : Nt("" + r) + "." + je("0", i[1].length);
  if (i = t.match(/^#,#*,#0/)) return it(e, t.replace(/^#,#*,/, ""), r);
  if (i = t.match(/^([0#]+)(\\?-([0#]+))+$/))
    return n = ha(it(e, t.replace(/[\\-]/g, ""), r)), s = 0, ha(ha(t.replace(/\\/g, "")).replace(/[0#]/g, function(m) {
      return s < n.length ? n.charAt(s++) : m === "0" ? "0" : "";
    }));
  if (t.match(Uc))
    return n = it(e, "##########", r), "(" + n.substr(0, 3) + ") " + n.substr(3, 3) + "-" + n.substr(6);
  var f = "";
  if (i = t.match(/^([#0?]+)( ?)\/( ?)([#0?]+)/))
    return s = Math.min(
      /*::String(*/
      i[4].length,
      7
    ), c = Ln(o, Math.pow(10, s) - 1, !1), n = "" + l, f = vt(
      "n",
      /*::String(*/
      i[1],
      c[1]
    ), f.charAt(f.length - 1) == " " && (f = f.substr(0, f.length - 1) + "0"), n += f + /*::String(*/
    i[2] + "/" + /*::String(*/
    i[3], f = On(c[2], s), f.length < i[4].length && (f = Ar(i[4].substr(i[4].length - f.length)) + f), n += f, n;
  if (i = t.match(/^# ([#0?]+)( ?)\/( ?)([#0?]+)/))
    return s = Math.min(Math.max(i[1].length, i[4].length), 7), c = Ln(o, Math.pow(10, s) - 1, !0), l + (c[0] || (c[1] ? "" : "0")) + " " + (c[1] ? ji(c[1], s) + i[2] + "/" + i[3] + On(c[2], s) : je(" ", 2 * s + 1 + i[2].length + i[3].length));
  if (i = t.match(/^[#0?]+$/))
    return n = "" + r, t.length <= n.length ? n : Ar(t.substr(0, t.length - n.length)) + n;
  if (i = t.match(/^([#0]+)\.([#0]+)$/)) {
    n = "" + r.toFixed(Math.min(i[2].length, 10)).replace(/([^0])0+$/, "$1"), s = n.indexOf(".");
    var d = t.indexOf(".") - s, h = t.length - n.length - d;
    return Ar(t.substr(0, d) + n + t.substr(t.length - h));
  }
  if (i = t.match(/^00,000\.([#0]*0)$/))
    return r < 0 ? "-" + it(e, t, -r) : Nt("" + r).replace(/^\d,\d{3}$/, "0$&").replace(/^\d*$/, function(m) {
      return "00," + (m.length < 3 ? Qr(0, 3 - m.length) : "") + m;
    }) + "." + Qr(0, i[1].length);
  switch (t) {
    case "###,###":
    case "##,###":
    case "#,###":
      var p = Nt("" + o);
      return p !== "0" ? l + p : "";
    default:
      if (t.match(/\.[0#?]*$/)) return it(e, t.slice(0, t.lastIndexOf(".")), r) + Ar(t.slice(t.lastIndexOf(".")));
  }
  throw new Error("unsupported format |" + t + "|");
}
function vt(e, t, r) {
  return (r | 0) === r ? it(e, t, r) : Hr(e, t, r);
}
function Jl(e) {
  for (var t = [], r = !1, a = 0, n = 0; a < e.length; ++a) switch (
    /*cc=*/
    e.charCodeAt(a)
  ) {
    case 34:
      r = !r;
      break;
    case 95:
    case 42:
    case 92:
      ++a;
      break;
    case 59:
      t[t.length] = e.substr(n, a - n), n = a + 1;
  }
  if (t[t.length] = e.substr(n), r === !0) throw new Error("Format |" + e + "| unterminated string ");
  return t;
}
var Wc = /\[[HhMmSs\u0E0A\u0E19\u0E17]*\]/;
function Qt(e) {
  for (var t = 0, r = "", a = ""; t < e.length; )
    switch (r = e.charAt(t)) {
      case "G":
        In(e, t) && (t += 6), t++;
        break;
      case '"':
        for (
          ;
          /*cc=*/
          e.charCodeAt(++t) !== 34 && t < e.length;
        )
          ;
        ++t;
        break;
      case "\\":
        t += 2;
        break;
      case "_":
        t += 2;
        break;
      case "@":
        ++t;
        break;
      case "B":
      case "b":
        if (e.charAt(t + 1) === "1" || e.charAt(t + 1) === "2") return !0;
      /* falls through */
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
      /* falls through */
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        return !0;
      case "A":
      case "a":
      case "上":
        if (e.substr(t, 3).toUpperCase() === "A/P" || e.substr(t, 5).toUpperCase() === "AM/PM" || e.substr(t, 5).toUpperCase() === "上午/下午") return !0;
        ++t;
        break;
      case "[":
        for (a = r; e.charAt(t++) !== "]" && t < e.length; ) a += e.charAt(t);
        if (a.match(Wc)) return !0;
        break;
      case ".":
      /* falls through */
      case "0":
      case "#":
        for (; t < e.length && ("0#?.,E+-%".indexOf(r = e.charAt(++t)) > -1 || r == "\\" && e.charAt(t + 1) == "-" && "0#".indexOf(e.charAt(t + 2)) > -1); )
          ;
        break;
      case "?":
        for (; e.charAt(++t) === r; )
          ;
        break;
      case "*":
        ++t, (e.charAt(t) == " " || e.charAt(t) == "*") && ++t;
        break;
      case "(":
      case ")":
        ++t;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (; t < e.length && "0123456789".indexOf(e.charAt(++t)) > -1; )
          ;
        break;
      case " ":
        ++t;
        break;
      default:
        ++t;
        break;
    }
  return !1;
}
function Zl(e, t, r, a) {
  for (var n = [], i = "", s = 0, c = "", o = "t", l, f, d, h = "H"; s < e.length; )
    switch (c = e.charAt(s)) {
      case "G":
        if (!In(e, s)) throw new Error("unrecognized character " + c + " in " + e);
        n[n.length] = { t: "G", v: "General" }, s += 7;
        break;
      case '"':
        for (i = ""; (d = e.charCodeAt(++s)) !== 34 && s < e.length; ) i += String.fromCharCode(d);
        n[n.length] = { t: "t", v: i }, ++s;
        break;
      case "\\":
        var p = e.charAt(++s), m = p === "(" || p === ")" ? p : "t";
        n[n.length] = { t: m, v: p }, ++s;
        break;
      case "_":
        n[n.length] = { t: "t", v: " " }, s += 2;
        break;
      case "@":
        n[n.length] = { t: "T", v: t }, ++s;
        break;
      case "B":
      case "b":
        if (e.charAt(s + 1) === "1" || e.charAt(s + 1) === "2") {
          if (l == null && (l = At(t, r, e.charAt(s + 1) === "2"), l == null))
            return "";
          n[n.length] = { t: "X", v: e.substr(s, 2) }, o = c, s += 2;
          break;
        }
      /* falls through */
      case "M":
      case "D":
      case "Y":
      case "H":
      case "S":
      case "E":
        c = c.toLowerCase();
      /* falls through */
      case "m":
      case "d":
      case "y":
      case "h":
      case "s":
      case "e":
      case "g":
        if (t < 0 || l == null && (l = At(t, r), l == null))
          return "";
        for (i = c; ++s < e.length && e.charAt(s).toLowerCase() === c; ) i += c;
        c === "m" && o.toLowerCase() === "h" && (c = "M"), c === "h" && (c = h), n[n.length] = { t: c, v: i }, o = c;
        break;
      case "A":
      case "a":
      case "上":
        var x = { t: c, v: c };
        if (l == null && (l = At(t, r)), e.substr(s, 3).toUpperCase() === "A/P" ? (l != null && (x.v = l.H >= 12 ? "P" : "A"), x.t = "T", h = "h", s += 3) : e.substr(s, 5).toUpperCase() === "AM/PM" ? (l != null && (x.v = l.H >= 12 ? "PM" : "AM"), x.t = "T", s += 5, h = "h") : e.substr(s, 5).toUpperCase() === "上午/下午" ? (l != null && (x.v = l.H >= 12 ? "下午" : "上午"), x.t = "T", s += 5, h = "h") : (x.t = "t", ++s), l == null && x.t === "T") return "";
        n[n.length] = x, o = c;
        break;
      case "[":
        for (i = c; e.charAt(s++) !== "]" && s < e.length; ) i += e.charAt(s);
        if (i.slice(-1) !== "]") throw 'unterminated "[" block: |' + i + "|";
        if (i.match(Wc)) {
          if (l == null && (l = At(t, r), l == null))
            return "";
          n[n.length] = { t: "Z", v: i.toLowerCase() }, o = i.charAt(1);
        } else i.indexOf("$") > -1 && (i = (i.match(/\$([^-\[\]]*)/) || [])[1] || "$", Qt(e) || (n[n.length] = { t: "t", v: i }));
        break;
      /* Numbers */
      case ".":
        if (l != null) {
          for (i = c; ++s < e.length && (c = e.charAt(s)) === "0"; ) i += c;
          n[n.length] = { t: "s", v: i };
          break;
        }
      /* falls through */
      case "0":
      case "#":
        for (i = c; ++s < e.length && "0#?.,E+-%".indexOf(c = e.charAt(s)) > -1; ) i += c;
        n[n.length] = { t: "n", v: i };
        break;
      case "?":
        for (i = c; e.charAt(++s) === c; ) i += c;
        n[n.length] = { t: c, v: i }, o = c;
        break;
      case "*":
        ++s, (e.charAt(s) == " " || e.charAt(s) == "*") && ++s;
        break;
      // **
      case "(":
      case ")":
        n[n.length] = { t: a === 1 ? "t" : c, v: c }, ++s;
        break;
      case "1":
      case "2":
      case "3":
      case "4":
      case "5":
      case "6":
      case "7":
      case "8":
      case "9":
        for (i = c; s < e.length && "0123456789".indexOf(e.charAt(++s)) > -1; ) i += e.charAt(s);
        n[n.length] = { t: "D", v: i };
        break;
      case " ":
        n[n.length] = { t: c, v: c }, ++s;
        break;
      case "$":
        n[n.length] = { t: "t", v: "$" }, ++s;
        break;
      default:
        if (",$-+/():!^&'~{}<>=€acfijklopqrtuvwxzP".indexOf(c) === -1) throw new Error("unrecognized character " + c + " in " + e);
        n[n.length] = { t: "t", v: c }, ++s;
        break;
    }
  var u = 0, v = 0, E;
  for (s = n.length - 1, o = "t"; s >= 0; --s)
    switch (n[s].t) {
      case "h":
      case "H":
        n[s].t = h, o = "h", u < 1 && (u = 1);
        break;
      case "s":
        (E = n[s].v.match(/\.0+$/)) && (v = Math.max(v, E[0].length - 1)), u < 3 && (u = 3);
      /* falls through */
      case "d":
      case "y":
      case "M":
      case "e":
        o = n[s].t;
        break;
      case "m":
        o === "s" && (n[s].t = "M", u < 2 && (u = 2));
        break;
      case "X":
        break;
      case "Z":
        u < 1 && n[s].v.match(/[Hh]/) && (u = 1), u < 2 && n[s].v.match(/[Mm]/) && (u = 2), u < 3 && n[s].v.match(/[Ss]/) && (u = 3);
    }
  switch (u) {
    case 0:
      break;
    case 1:
      l.u >= 0.5 && (l.u = 0, ++l.S), l.S >= 60 && (l.S = 0, ++l.M), l.M >= 60 && (l.M = 0, ++l.H);
      break;
    case 2:
      l.u >= 0.5 && (l.u = 0, ++l.S), l.S >= 60 && (l.S = 0, ++l.M);
      break;
  }
  var g = "", y;
  for (s = 0; s < n.length; ++s)
    switch (n[s].t) {
      case "t":
      case "T":
      case " ":
      case "D":
        break;
      case "X":
        n[s].v = "", n[s].t = ";";
        break;
      case "d":
      case "m":
      case "y":
      case "h":
      case "H":
      case "M":
      case "s":
      case "e":
      case "b":
      case "Z":
        n[s].v = Hl(n[s].t.charCodeAt(0), n[s].v, l, v), n[s].t = "t";
        break;
      case "n":
      case "?":
        for (y = s + 1; n[y] != null && ((c = n[y].t) === "?" || c === "D" || (c === " " || c === "t") && n[y + 1] != null && (n[y + 1].t === "?" || n[y + 1].t === "t" && n[y + 1].v === "/") || n[s].t === "(" && (c === " " || c === "n" || c === ")") || c === "t" && (n[y].v === "/" || n[y].v === " " && n[y + 1] != null && n[y + 1].t == "?")); )
          n[s].v += n[y].v, n[y] = { v: "", t: ";" }, ++y;
        g += n[s].v, s = y - 1;
        break;
      case "G":
        n[s].t = "t", n[s].v = Yt(t, r);
        break;
    }
  var N = "", A, w;
  if (g.length > 0) {
    g.charCodeAt(0) == 40 ? (A = t < 0 && g.charCodeAt(0) === 45 ? -t : t, w = vt("n", g, A)) : (A = t < 0 && a > 1 ? -t : t, w = vt("n", g, A), A < 0 && n[0] && n[0].t == "t" && (w = w.substr(1), n[0].v = "-" + n[0].v)), y = w.length - 1;
    var P = n.length;
    for (s = 0; s < n.length; ++s) if (n[s] != null && n[s].t != "t" && n[s].v.indexOf(".") > -1) {
      P = s;
      break;
    }
    var L = n.length;
    if (P === n.length && w.indexOf("E") === -1) {
      for (s = n.length - 1; s >= 0; --s)
        n[s] == null || "n?".indexOf(n[s].t) === -1 || (y >= n[s].v.length - 1 ? (y -= n[s].v.length, n[s].v = w.substr(y + 1, n[s].v.length)) : y < 0 ? n[s].v = "" : (n[s].v = w.substr(0, y + 1), y = -1), n[s].t = "t", L = s);
      y >= 0 && L < n.length && (n[L].v = w.substr(0, y + 1) + n[L].v);
    } else if (P !== n.length && w.indexOf("E") === -1) {
      for (y = w.indexOf(".") - 1, s = P; s >= 0; --s)
        if (!(n[s] == null || "n?".indexOf(n[s].t) === -1)) {
          for (f = n[s].v.indexOf(".") > -1 && s === P ? n[s].v.indexOf(".") - 1 : n[s].v.length - 1, N = n[s].v.substr(f + 1); f >= 0; --f)
            y >= 0 && (n[s].v.charAt(f) === "0" || n[s].v.charAt(f) === "#") && (N = w.charAt(y--) + N);
          n[s].v = N, n[s].t = "t", L = s;
        }
      for (y >= 0 && L < n.length && (n[L].v = w.substr(0, y + 1) + n[L].v), y = w.indexOf(".") + 1, s = P; s < n.length; ++s)
        if (!(n[s] == null || "n?(".indexOf(n[s].t) === -1 && s !== P)) {
          for (f = n[s].v.indexOf(".") > -1 && s === P ? n[s].v.indexOf(".") + 1 : 0, N = n[s].v.substr(0, f); f < n[s].v.length; ++f)
            y < w.length && (N += w.charAt(y++));
          n[s].v = N, n[s].t = "t", L = s;
        }
    }
  }
  for (s = 0; s < n.length; ++s) n[s] != null && "n?".indexOf(n[s].t) > -1 && (A = a > 1 && t < 0 && s > 0 && n[s - 1].v === "-" ? -t : t, n[s].v = vt(n[s].t, n[s].v, A), n[s].t = "t");
  var U = "";
  for (s = 0; s !== n.length; ++s) n[s] != null && (U += n[s].v);
  return U;
}
var p0 = /\[(=|>[=]?|<[>=]?)(-?\d+(?:\.\d*)?)\]/;
function m0(e, t) {
  if (t == null) return !1;
  var r = parseFloat(t[2]);
  switch (t[1]) {
    case "=":
      if (e == r) return !0;
      break;
    case ">":
      if (e > r) return !0;
      break;
    case "<":
      if (e < r) return !0;
      break;
    case "<>":
      if (e != r) return !0;
      break;
    case ">=":
      if (e >= r) return !0;
      break;
    case "<=":
      if (e <= r) return !0;
      break;
  }
  return !1;
}
function Ql(e, t) {
  var r = Jl(e), a = r.length, n = r[a - 1].indexOf("@");
  if (a < 4 && n > -1 && --a, r.length > 4) throw new Error("cannot find right format for |" + r.join("|") + "|");
  if (typeof t != "number") return [4, r.length === 4 || n > -1 ? r[r.length - 1] : "@"];
  switch (r.length) {
    case 1:
      r = n > -1 ? ["General", "General", "General", r[0]] : [r[0], r[0], r[0], "@"];
      break;
    case 2:
      r = n > -1 ? [r[0], r[0], r[0], r[1]] : [r[0], r[1], r[0], "@"];
      break;
    case 3:
      r = n > -1 ? [r[0], r[1], r[0], r[2]] : [r[0], r[1], r[2], "@"];
      break;
  }
  var i = t > 0 ? r[0] : t < 0 ? r[1] : r[2];
  if (r[0].indexOf("[") === -1 && r[1].indexOf("[") === -1) return [a, i];
  if (r[0].match(/\[[=<>]/) != null || r[1].match(/\[[=<>]/) != null) {
    var s = r[0].match(p0), c = r[1].match(p0);
    return m0(t, s) ? [a, r[0]] : m0(t, c) ? [a, r[1]] : [a, r[s != null && c != null ? 2 : 1]];
  }
  return [a, i];
}
function Br(e, t, r) {
  r == null && (r = {});
  var a = "";
  switch (typeof e) {
    case "string":
      e == "m/d/yy" && r.dateNF ? a = r.dateNF : a = e;
      break;
    case "number":
      e == 14 && r.dateNF ? a = r.dateNF : a = (r.table != null ? r.table : pe)[e], a == null && (a = r.table && r.table[h0[e]] || pe[h0[e]]), a == null && (a = bl[e] || "General");
      break;
  }
  if (In(a, 0)) return Yt(t, r);
  t instanceof Date && (t = Rc(t, r.date1904));
  var n = Ql(a, t);
  if (In(n[1])) return Yt(t, r);
  if (t === !0) t = "TRUE";
  else if (t === !1) t = "FALSE";
  else if (t === "" || t == null) return "";
  return Zl(n[1], t, r, n[0]);
}
function ot(e, t) {
  if (typeof t != "number") {
    t = +t || -1;
    for (var r = 0; r < 392; ++r) {
      if (pe[r] == null) {
        t < 0 && (t = r);
        continue;
      }
      if (pe[r] == e) {
        t = r;
        break;
      }
    }
    t < 0 && (t = 391);
  }
  return pe[t] = e, t;
}
function on(e) {
  for (var t = 0; t != 392; ++t)
    e[t] !== void 0 && ot(e[t], t);
}
function Ea() {
  pe = Dl();
}
var Hc = {
  format: Br,
  load: ot,
  _table: pe,
  load_table: on,
  parse_date_code: At,
  is_date: Qt,
  get_table: function() {
    return Hc._table = pe;
  }
}, eu = {
  5: '"$"#,##0_);\\("$"#,##0\\)',
  6: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  7: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  8: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  23: "General",
  24: "General",
  25: "General",
  26: "General",
  27: "m/d/yy",
  28: "m/d/yy",
  29: "m/d/yy",
  30: "m/d/yy",
  31: "m/d/yy",
  32: "h:mm:ss",
  33: "h:mm:ss",
  34: "h:mm:ss",
  35: "h:mm:ss",
  36: "m/d/yy",
  41: '_(* #,##0_);_(* (#,##0);_(* "-"_);_(@_)',
  42: '_("$"* #,##0_);_("$"* (#,##0);_("$"* "-"_);_(@_)',
  43: '_(* #,##0.00_);_(* (#,##0.00);_(* "-"??_);_(@_)',
  44: '_("$"* #,##0.00_);_("$"* (#,##0.00);_("$"* "-"??_);_(@_)',
  50: "m/d/yy",
  51: "m/d/yy",
  52: "m/d/yy",
  53: "m/d/yy",
  54: "m/d/yy",
  55: "m/d/yy",
  56: "m/d/yy",
  57: "m/d/yy",
  58: "m/d/yy",
  59: "0",
  60: "0.00",
  61: "#,##0",
  62: "#,##0.00",
  63: '"$"#,##0_);\\("$"#,##0\\)',
  64: '"$"#,##0_);[Red]\\("$"#,##0\\)',
  65: '"$"#,##0.00_);\\("$"#,##0.00\\)',
  66: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
  67: "0%",
  68: "0.00%",
  69: "# ?/?",
  70: "# ??/??",
  71: "m/d/yy",
  72: "m/d/yy",
  73: "d-mmm-yy",
  74: "d-mmm",
  75: "mmm-yy",
  76: "h:mm",
  77: "h:mm:ss",
  78: "m/d/yy h:mm",
  79: "mm:ss",
  80: "[h]:mm:ss",
  81: "mmss.0"
}, Gc = /[dD]+|[mM]+|[yYeE]+|[Hh]+|[Ss]+/g;
function ru(e) {
  var t = typeof e == "number" ? pe[e] : e;
  return t = t.replace(Gc, "(\\d+)"), new RegExp("^" + t + "$");
}
function tu(e, t, r) {
  var a = -1, n = -1, i = -1, s = -1, c = -1, o = -1;
  (t.match(Gc) || []).forEach(function(d, h) {
    var p = parseInt(r[h + 1], 10);
    switch (d.toLowerCase().charAt(0)) {
      case "y":
        a = p;
        break;
      case "d":
        i = p;
        break;
      case "h":
        s = p;
        break;
      case "s":
        o = p;
        break;
      case "m":
        s >= 0 ? c = p : n = p;
        break;
    }
  }), o >= 0 && c == -1 && n >= 0 && (c = n, n = -1);
  var l = ("" + (a >= 0 ? a : (/* @__PURE__ */ new Date()).getFullYear())).slice(-4) + "-" + ("00" + (n >= 1 ? n : 1)).slice(-2) + "-" + ("00" + (i >= 1 ? i : 1)).slice(-2);
  l.length == 7 && (l = "0" + l), l.length == 8 && (l = "20" + l);
  var f = ("00" + (s >= 0 ? s : 0)).slice(-2) + ":" + ("00" + (c >= 0 ? c : 0)).slice(-2) + ":" + ("00" + (o >= 0 ? o : 0)).slice(-2);
  return s == -1 && c == -1 && o == -1 ? l : a == -1 && n == -1 && i == -1 ? f : l + "T" + f;
}
var au = /* @__PURE__ */ (function() {
  var e = {};
  e.version = "1.2.0";
  function t() {
    for (var w = 0, P = new Array(256), L = 0; L != 256; ++L)
      w = L, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, w = w & 1 ? -306674912 ^ w >>> 1 : w >>> 1, P[L] = w;
    return typeof Int32Array < "u" ? new Int32Array(P) : P;
  }
  var r = t();
  function a(w) {
    var P = 0, L = 0, U = 0, M = typeof Int32Array < "u" ? new Int32Array(4096) : new Array(4096);
    for (U = 0; U != 256; ++U) M[U] = w[U];
    for (U = 0; U != 256; ++U)
      for (L = w[U], P = 256 + U; P < 4096; P += 256) L = M[P] = L >>> 8 ^ w[L & 255];
    var b = [];
    for (U = 1; U != 16; ++U) b[U - 1] = typeof Int32Array < "u" ? M.subarray(U * 256, U * 256 + 256) : M.slice(U * 256, U * 256 + 256);
    return b;
  }
  var n = a(r), i = n[0], s = n[1], c = n[2], o = n[3], l = n[4], f = n[5], d = n[6], h = n[7], p = n[8], m = n[9], x = n[10], u = n[11], v = n[12], E = n[13], g = n[14];
  function y(w, P) {
    for (var L = P ^ -1, U = 0, M = w.length; U < M; ) L = L >>> 8 ^ r[(L ^ w.charCodeAt(U++)) & 255];
    return ~L;
  }
  function N(w, P) {
    for (var L = P ^ -1, U = w.length - 15, M = 0; M < U; ) L = g[w[M++] ^ L & 255] ^ E[w[M++] ^ L >> 8 & 255] ^ v[w[M++] ^ L >> 16 & 255] ^ u[w[M++] ^ L >>> 24] ^ x[w[M++]] ^ m[w[M++]] ^ p[w[M++]] ^ h[w[M++]] ^ d[w[M++]] ^ f[w[M++]] ^ l[w[M++]] ^ o[w[M++]] ^ c[w[M++]] ^ s[w[M++]] ^ i[w[M++]] ^ r[w[M++]];
    for (U += 15; M < U; ) L = L >>> 8 ^ r[(L ^ w[M++]) & 255];
    return ~L;
  }
  function A(w, P) {
    for (var L = P ^ -1, U = 0, M = w.length, b = 0, K = 0; U < M; )
      b = w.charCodeAt(U++), b < 128 ? L = L >>> 8 ^ r[(L ^ b) & 255] : b < 2048 ? (L = L >>> 8 ^ r[(L ^ (192 | b >> 6 & 31)) & 255], L = L >>> 8 ^ r[(L ^ (128 | b & 63)) & 255]) : b >= 55296 && b < 57344 ? (b = (b & 1023) + 64, K = w.charCodeAt(U++) & 1023, L = L >>> 8 ^ r[(L ^ (240 | b >> 8 & 7)) & 255], L = L >>> 8 ^ r[(L ^ (128 | b >> 2 & 63)) & 255], L = L >>> 8 ^ r[(L ^ (128 | K >> 6 & 15 | (b & 3) << 4)) & 255], L = L >>> 8 ^ r[(L ^ (128 | K & 63)) & 255]) : (L = L >>> 8 ^ r[(L ^ (224 | b >> 12 & 15)) & 255], L = L >>> 8 ^ r[(L ^ (128 | b >> 6 & 63)) & 255], L = L >>> 8 ^ r[(L ^ (128 | b & 63)) & 255]);
    return ~L;
  }
  return e.table = r, e.bstr = y, e.buf = N, e.str = A, e;
})(), de = /* @__PURE__ */ (function() {
  var t = {};
  t.version = "1.2.1";
  function r(_, k) {
    for (var T = _.split("/"), S = k.split("/"), F = 0, C = 0, W = Math.min(T.length, S.length); F < W; ++F) {
      if (C = T[F].length - S[F].length) return C;
      if (T[F] != S[F]) return T[F] < S[F] ? -1 : 1;
    }
    return T.length - S.length;
  }
  function a(_) {
    if (_.charAt(_.length - 1) == "/") return _.slice(0, -1).indexOf("/") === -1 ? _ : a(_.slice(0, -1));
    var k = _.lastIndexOf("/");
    return k === -1 ? _ : _.slice(0, k + 1);
  }
  function n(_) {
    if (_.charAt(_.length - 1) == "/") return n(_.slice(0, -1));
    var k = _.lastIndexOf("/");
    return k === -1 ? _ : _.slice(k + 1);
  }
  function i(_, k) {
    typeof k == "string" && (k = new Date(k));
    var T = k.getHours();
    T = T << 6 | k.getMinutes(), T = T << 5 | k.getSeconds() >>> 1, _.write_shift(2, T);
    var S = k.getFullYear() - 1980;
    S = S << 4 | k.getMonth() + 1, S = S << 5 | k.getDate(), _.write_shift(2, S);
  }
  function s(_) {
    var k = _.read_shift(2) & 65535, T = _.read_shift(2) & 65535, S = /* @__PURE__ */ new Date(), F = T & 31;
    T >>>= 5;
    var C = T & 15;
    T >>>= 4, S.setMilliseconds(0), S.setFullYear(T + 1980), S.setMonth(C - 1), S.setDate(F);
    var W = k & 31;
    k >>>= 5;
    var j = k & 63;
    return k >>>= 6, S.setHours(k), S.setMinutes(j), S.setSeconds(W << 1), S;
  }
  function c(_) {
    dr(_, 0);
    for (var k = (
      /*::(*/
      {}
    ), T = 0; _.l <= _.length - 4; ) {
      var S = _.read_shift(2), F = _.read_shift(2), C = _.l + F, W = {};
      S === 21589 && (T = _.read_shift(1), T & 1 && (W.mtime = _.read_shift(4)), F > 5 && (T & 2 && (W.atime = _.read_shift(4)), T & 4 && (W.ctime = _.read_shift(4))), W.mtime && (W.mt = new Date(W.mtime * 1e3))), _.l = C, k[S] = W;
    }
    return k;
  }
  var o;
  function l() {
    return o || (o = {});
  }
  function f(_, k) {
    if (_[0] == 80 && _[1] == 75) return Xs(_, k);
    if ((_[0] | 32) == 109 && (_[1] | 32) == 105) return rl(_, k);
    if (_.length < 512) throw new Error("CFB file size " + _.length + " < 512");
    var T = 3, S = 512, F = 0, C = 0, W = 0, j = 0, X = 0, H = [], V = (
      /*::(*/
      _.slice(0, 512)
    );
    dr(V, 0);
    var Q = d(V);
    switch (T = Q[0], T) {
      case 3:
        S = 512;
        break;
      case 4:
        S = 4096;
        break;
      case 0:
        if (Q[1] == 0) return Xs(_, k);
      /* falls through */
      default:
        throw new Error("Major Version: Expected 3 or 4 saw " + T);
    }
    S !== 512 && (V = /*::(*/
    _.slice(0, S), dr(
      V,
      28
      /* blob.l */
    ));
    var ce = _.slice(0, S);
    h(V, T);
    var he = V.read_shift(4, "i");
    if (T === 3 && he !== 0) throw new Error("# Directory Sectors: Expected 0 saw " + he);
    V.l += 4, W = V.read_shift(4, "i"), V.l += 4, V.chk("00100000", "Mini Stream Cutoff Size: "), j = V.read_shift(4, "i"), F = V.read_shift(4, "i"), X = V.read_shift(4, "i"), C = V.read_shift(4, "i");
    for (var te = -1, le = 0; le < 109 && (te = V.read_shift(4, "i"), !(te < 0)); ++le)
      H[le] = te;
    var Ee = p(_, S);
    u(X, C, Ee, S, H);
    var Ve = E(Ee, W, H, S);
    Ve[W].name = "!Directory", F > 0 && j !== K && (Ve[j].name = "!MiniFAT"), Ve[H[0]].name = "!FAT", Ve.fat_addrs = H, Ve.ssz = S;
    var ze = {}, pr = [], ka = [], Fa = [];
    g(W, Ve, Ee, pr, F, ze, ka, j), m(ka, Fa, pr), pr.shift();
    var Aa = {
      FileIndex: ka,
      FullPaths: Fa
    };
    return k && k.raw && (Aa.raw = { header: ce, sectors: Ee }), Aa;
  }
  function d(_) {
    if (_[_.l] == 80 && _[_.l + 1] == 75) return [0, 0];
    _.chk(se, "Header Signature: "), _.l += 16;
    var k = _.read_shift(2, "u");
    return [_.read_shift(2, "u"), k];
  }
  function h(_, k) {
    var T = 9;
    switch (_.l += 2, T = _.read_shift(2)) {
      case 9:
        if (k != 3) throw new Error("Sector Shift: Expected 9 saw " + T);
        break;
      case 12:
        if (k != 4) throw new Error("Sector Shift: Expected 12 saw " + T);
        break;
      default:
        throw new Error("Sector Shift: Expected 9 or 12 saw " + T);
    }
    _.chk("0600", "Mini Sector Shift: "), _.chk("000000000000", "Reserved: ");
  }
  function p(_, k) {
    for (var T = Math.ceil(_.length / k) - 1, S = [], F = 1; F < T; ++F) S[F - 1] = _.slice(F * k, (F + 1) * k);
    return S[T - 1] = _.slice(T * k), S;
  }
  function m(_, k, T) {
    for (var S = 0, F = 0, C = 0, W = 0, j = 0, X = T.length, H = [], V = []; S < X; ++S)
      H[S] = V[S] = S, k[S] = T[S];
    for (; j < V.length; ++j)
      S = V[j], F = _[S].L, C = _[S].R, W = _[S].C, H[S] === S && (F !== -1 && H[F] !== F && (H[S] = H[F]), C !== -1 && H[C] !== C && (H[S] = H[C])), W !== -1 && (H[W] = S), F !== -1 && S != H[S] && (H[F] = H[S], V.lastIndexOf(F) < j && V.push(F)), C !== -1 && S != H[S] && (H[C] = H[S], V.lastIndexOf(C) < j && V.push(C));
    for (S = 1; S < X; ++S) H[S] === S && (C !== -1 && H[C] !== C ? H[S] = H[C] : F !== -1 && H[F] !== F && (H[S] = H[F]));
    for (S = 1; S < X; ++S)
      if (_[S].type !== 0) {
        if (j = S, j != H[j]) do
          j = H[j], k[S] = k[j] + "/" + k[S];
        while (j !== 0 && H[j] !== -1 && j != H[j]);
        H[S] = -1;
      }
    for (k[0] += "/", S = 1; S < X; ++S)
      _[S].type !== 2 && (k[S] += "/");
  }
  function x(_, k, T) {
    for (var S = _.start, F = _.size, C = [], W = S; T && F > 0 && W >= 0; )
      C.push(k.slice(W * b, W * b + b)), F -= b, W = Ut(T, W * 4);
    return C.length === 0 ? z(0) : fr(C).slice(0, _.size);
  }
  function u(_, k, T, S, F) {
    var C = K;
    if (_ === K) {
      if (k !== 0) throw new Error("DIFAT chain shorter than expected");
    } else if (_ !== -1) {
      var W = T[_], j = (S >>> 2) - 1;
      if (!W) return;
      for (var X = 0; X < j && (C = Ut(W, X * 4)) !== K; ++X)
        F.push(C);
      u(Ut(W, S - 4), k - 1, T, S, F);
    }
  }
  function v(_, k, T, S, F) {
    var C = [], W = [];
    F || (F = []);
    var j = S - 1, X = 0, H = 0;
    for (X = k; X >= 0; ) {
      F[X] = !0, C[C.length] = X, W.push(_[X]);
      var V = T[Math.floor(X * 4 / S)];
      if (H = X * 4 & j, S < 4 + H) throw new Error("FAT boundary crossed: " + X + " 4 " + S);
      if (!_[V]) break;
      X = Ut(_[V], H);
    }
    return { nodes: C, data: N0([W]) };
  }
  function E(_, k, T, S) {
    var F = _.length, C = [], W = [], j = [], X = [], H = S - 1, V = 0, Q = 0, ce = 0, he = 0;
    for (V = 0; V < F; ++V)
      if (j = [], ce = V + k, ce >= F && (ce -= F), !W[ce]) {
        X = [];
        var te = [];
        for (Q = ce; Q >= 0; ) {
          te[Q] = !0, W[Q] = !0, j[j.length] = Q, X.push(_[Q]);
          var le = T[Math.floor(Q * 4 / S)];
          if (he = Q * 4 & H, S < 4 + he) throw new Error("FAT boundary crossed: " + Q + " 4 " + S);
          if (!_[le] || (Q = Ut(_[le], he), te[Q])) break;
        }
        C[ce] = { nodes: j, data: N0([X]) };
      }
    return C;
  }
  function g(_, k, T, S, F, C, W, j) {
    for (var X = 0, H = S.length ? 2 : 0, V = k[_].data, Q = 0, ce = 0, he; Q < V.length; Q += 128) {
      var te = (
        /*::(*/
        V.slice(Q, Q + 128)
      );
      dr(te, 64), ce = te.read_shift(2), he = Kn(te, 0, ce - H), S.push(he);
      var le = {
        name: he,
        type: te.read_shift(1),
        color: te.read_shift(1),
        L: te.read_shift(4, "i"),
        R: te.read_shift(4, "i"),
        C: te.read_shift(4, "i"),
        clsid: te.read_shift(16),
        state: te.read_shift(4, "i"),
        start: 0,
        size: 0
      }, Ee = te.read_shift(2) + te.read_shift(2) + te.read_shift(2) + te.read_shift(2);
      Ee !== 0 && (le.ct = y(te, te.l - 8));
      var Ve = te.read_shift(2) + te.read_shift(2) + te.read_shift(2) + te.read_shift(2);
      Ve !== 0 && (le.mt = y(te, te.l - 8)), le.start = te.read_shift(4, "i"), le.size = te.read_shift(4, "i"), le.size < 0 && le.start < 0 && (le.size = le.type = 0, le.start = K, le.name = ""), le.type === 5 ? (X = le.start, F > 0 && X !== K && (k[X].name = "!StreamData")) : le.size >= 4096 ? (le.storage = "fat", k[le.start] === void 0 && (k[le.start] = v(T, le.start, k.fat_addrs, k.ssz)), k[le.start].name = le.name, le.content = k[le.start].data.slice(0, le.size)) : (le.storage = "minifat", le.size < 0 ? le.size = 0 : X !== K && le.start !== K && k[X] && (le.content = x(le, k[X].data, (k[j] || {}).data))), le.content && dr(le.content, 0), C[he] = le, W.push(le);
    }
  }
  function y(_, k) {
    return new Date((or(_, k + 4) / 1e7 * Math.pow(2, 32) + or(_, k) / 1e7 - 11644473600) * 1e3);
  }
  function N(_, k) {
    return l(), f(o.readFileSync(_), k);
  }
  function A(_, k) {
    var T = k && k.type;
    switch (T || ye && Buffer.isBuffer(_) && (T = "buffer"), T || "base64") {
      case "file":
        return N(_, k);
      case "base64":
        return f(Dr(Mr(_)), k);
      case "binary":
        return f(Dr(_), k);
    }
    return f(
      /*::typeof blob == 'string' ? new Buffer(blob, 'utf-8') : */
      _,
      k
    );
  }
  function w(_, k) {
    var T = k || {}, S = T.root || "Root Entry";
    if (_.FullPaths || (_.FullPaths = []), _.FileIndex || (_.FileIndex = []), _.FullPaths.length !== _.FileIndex.length) throw new Error("inconsistent CFB structure");
    _.FullPaths.length === 0 && (_.FullPaths[0] = S + "/", _.FileIndex[0] = { name: S, type: 5 }), T.CLSID && (_.FileIndex[0].clsid = T.CLSID), P(_);
  }
  function P(_) {
    var k = "Sh33tJ5";
    if (!de.find(_, "/" + k)) {
      var T = z(4);
      T[0] = 55, T[1] = T[3] = 50, T[2] = 54, _.FileIndex.push({ name: k, type: 2, content: T, size: 4, L: 69, R: 69, C: 69 }), _.FullPaths.push(_.FullPaths[0] + k), L(_);
    }
  }
  function L(_, k) {
    w(_);
    for (var T = !1, S = !1, F = _.FullPaths.length - 1; F >= 0; --F) {
      var C = _.FileIndex[F];
      switch (C.type) {
        case 0:
          S ? T = !0 : (_.FileIndex.pop(), _.FullPaths.pop());
          break;
        case 1:
        case 2:
        case 5:
          S = !0, isNaN(C.R * C.L * C.C) && (T = !0), C.R > -1 && C.L > -1 && C.R == C.L && (T = !0);
          break;
        default:
          T = !0;
          break;
      }
    }
    if (!(!T && !k)) {
      var W = new Date(1987, 1, 19), j = 0, X = Object.create ? /* @__PURE__ */ Object.create(null) : {}, H = [];
      for (F = 0; F < _.FullPaths.length; ++F)
        X[_.FullPaths[F]] = !0, _.FileIndex[F].type !== 0 && H.push([_.FullPaths[F], _.FileIndex[F]]);
      for (F = 0; F < H.length; ++F) {
        var V = a(H[F][0]);
        S = X[V], S || (H.push([V, {
          name: n(V).replace("/", ""),
          type: 1,
          clsid: ue,
          ct: W,
          mt: W,
          content: null
        }]), X[V] = !0);
      }
      for (H.sort(function(he, te) {
        return r(he[0], te[0]);
      }), _.FullPaths = [], _.FileIndex = [], F = 0; F < H.length; ++F)
        _.FullPaths[F] = H[F][0], _.FileIndex[F] = H[F][1];
      for (F = 0; F < H.length; ++F) {
        var Q = _.FileIndex[F], ce = _.FullPaths[F];
        if (Q.name = n(ce).replace("/", ""), Q.L = Q.R = Q.C = -(Q.color = 1), Q.size = Q.content ? Q.content.length : 0, Q.start = 0, Q.clsid = Q.clsid || ue, F === 0)
          Q.C = H.length > 1 ? 1 : -1, Q.size = 0, Q.type = 5;
        else if (ce.slice(-1) == "/") {
          for (j = F + 1; j < H.length && a(_.FullPaths[j]) != ce; ++j) ;
          for (Q.C = j >= H.length ? -1 : j, j = F + 1; j < H.length && a(_.FullPaths[j]) != a(ce); ++j) ;
          Q.R = j >= H.length ? -1 : j, Q.type = 1;
        } else
          a(_.FullPaths[F + 1] || "") == a(ce) && (Q.R = F + 1), Q.type = 2;
      }
    }
  }
  function U(_, k) {
    var T = k || {};
    if (T.fileType == "mad") return tl(_, T);
    if (L(_), T.fileType === "zip")
      return qf(_, T);
    var S = (function(he) {
      for (var te = 0, le = 0, Ee = 0; Ee < he.FileIndex.length; ++Ee) {
        var Ve = he.FileIndex[Ee];
        if (Ve.content) {
          var ze = Ve.content.length;
          ze > 0 && (ze < 4096 ? te += ze + 63 >> 6 : le += ze + 511 >> 9);
        }
      }
      for (var pr = he.FullPaths.length + 3 >> 2, ka = te + 7 >> 3, Fa = te + 127 >> 7, Aa = ka + le + pr + Fa, Bt = Aa + 127 >> 7, ti = Bt <= 109 ? 0 : Math.ceil((Bt - 109) / 127); Aa + Bt + ti + 127 >> 7 > Bt; ) ti = ++Bt <= 109 ? 0 : Math.ceil((Bt - 109) / 127);
      var xt = [1, ti, Bt, Fa, pr, le, te, 0];
      return he.FileIndex[0].size = te << 6, xt[7] = (he.FileIndex[0].start = xt[0] + xt[1] + xt[2] + xt[3] + xt[4] + xt[5]) + (xt[6] + 7 >> 3), xt;
    })(_), F = z(S[7] << 9), C = 0, W = 0;
    {
      for (C = 0; C < 8; ++C) F.write_shift(1, re[C]);
      for (C = 0; C < 8; ++C) F.write_shift(2, 0);
      for (F.write_shift(2, 62), F.write_shift(2, 3), F.write_shift(2, 65534), F.write_shift(2, 9), F.write_shift(2, 6), C = 0; C < 3; ++C) F.write_shift(2, 0);
      for (F.write_shift(4, 0), F.write_shift(4, S[2]), F.write_shift(4, S[0] + S[1] + S[2] + S[3] - 1), F.write_shift(4, 0), F.write_shift(4, 4096), F.write_shift(4, S[3] ? S[0] + S[1] + S[2] - 1 : K), F.write_shift(4, S[3]), F.write_shift(-4, S[1] ? S[0] - 1 : K), F.write_shift(4, S[1]), C = 0; C < 109; ++C) F.write_shift(-4, C < S[2] ? S[1] + C : -1);
    }
    if (S[1])
      for (W = 0; W < S[1]; ++W) {
        for (; C < 236 + W * 127; ++C) F.write_shift(-4, C < S[2] ? S[1] + C : -1);
        F.write_shift(-4, W === S[1] - 1 ? K : W + 1);
      }
    var j = function(he) {
      for (W += he; C < W - 1; ++C) F.write_shift(-4, C + 1);
      he && (++C, F.write_shift(-4, K));
    };
    for (W = C = 0, W += S[1]; C < W; ++C) F.write_shift(-4, oe.DIFSECT);
    for (W += S[2]; C < W; ++C) F.write_shift(-4, oe.FATSECT);
    j(S[3]), j(S[4]);
    for (var X = 0, H = 0, V = _.FileIndex[0]; X < _.FileIndex.length; ++X)
      V = _.FileIndex[X], V.content && (H = V.content.length, !(H < 4096) && (V.start = W, j(H + 511 >> 9)));
    for (j(S[6] + 7 >> 3); F.l & 511; ) F.write_shift(-4, oe.ENDOFCHAIN);
    for (W = C = 0, X = 0; X < _.FileIndex.length; ++X)
      V = _.FileIndex[X], V.content && (H = V.content.length, !(!H || H >= 4096) && (V.start = W, j(H + 63 >> 6)));
    for (; F.l & 511; ) F.write_shift(-4, oe.ENDOFCHAIN);
    for (C = 0; C < S[4] << 2; ++C) {
      var Q = _.FullPaths[C];
      if (!Q || Q.length === 0) {
        for (X = 0; X < 17; ++X) F.write_shift(4, 0);
        for (X = 0; X < 3; ++X) F.write_shift(4, -1);
        for (X = 0; X < 12; ++X) F.write_shift(4, 0);
        continue;
      }
      V = _.FileIndex[C], C === 0 && (V.start = V.size ? V.start - 1 : K);
      var ce = C === 0 && T.root || V.name;
      if (H = 2 * (ce.length + 1), F.write_shift(64, ce, "utf16le"), F.write_shift(2, H), F.write_shift(1, V.type), F.write_shift(1, V.color), F.write_shift(-4, V.L), F.write_shift(-4, V.R), F.write_shift(-4, V.C), V.clsid) F.write_shift(16, V.clsid, "hex");
      else for (X = 0; X < 4; ++X) F.write_shift(4, 0);
      F.write_shift(4, V.state || 0), F.write_shift(4, 0), F.write_shift(4, 0), F.write_shift(4, 0), F.write_shift(4, 0), F.write_shift(4, V.start), F.write_shift(4, V.size), F.write_shift(4, 0);
    }
    for (C = 1; C < _.FileIndex.length; ++C)
      if (V = _.FileIndex[C], V.size >= 4096)
        if (F.l = V.start + 1 << 9, ye && Buffer.isBuffer(V.content))
          V.content.copy(F, F.l, 0, V.size), F.l += V.size + 511 & -512;
        else {
          for (X = 0; X < V.size; ++X) F.write_shift(1, V.content[X]);
          for (; X & 511; ++X) F.write_shift(1, 0);
        }
    for (C = 1; C < _.FileIndex.length; ++C)
      if (V = _.FileIndex[C], V.size > 0 && V.size < 4096)
        if (ye && Buffer.isBuffer(V.content))
          V.content.copy(F, F.l, 0, V.size), F.l += V.size + 63 & -64;
        else {
          for (X = 0; X < V.size; ++X) F.write_shift(1, V.content[X]);
          for (; X & 63; ++X) F.write_shift(1, 0);
        }
    if (ye)
      F.l = F.length;
    else
      for (; F.l < F.length; ) F.write_shift(1, 0);
    return F;
  }
  function M(_, k) {
    var T = _.FullPaths.map(function(X) {
      return X.toUpperCase();
    }), S = T.map(function(X) {
      var H = X.split("/");
      return H[H.length - (X.slice(-1) == "/" ? 2 : 1)];
    }), F = !1;
    k.charCodeAt(0) === 47 ? (F = !0, k = T[0].slice(0, -1) + k) : F = k.indexOf("/") !== -1;
    var C = k.toUpperCase(), W = F === !0 ? T.indexOf(C) : S.indexOf(C);
    if (W !== -1) return _.FileIndex[W];
    var j = !C.match(Pa);
    for (C = C.replace(Tr, ""), j && (C = C.replace(Pa, "!")), W = 0; W < T.length; ++W)
      if ((j ? T[W].replace(Pa, "!") : T[W]).replace(Tr, "") == C || (j ? S[W].replace(Pa, "!") : S[W]).replace(Tr, "") == C) return _.FileIndex[W];
    return null;
  }
  var b = 64, K = -2, se = "d0cf11e0a1b11ae1", re = [208, 207, 17, 224, 161, 177, 26, 225], ue = "00000000000000000000000000000000", oe = {
    /* 2.1 Compund File Sector Numbers and Types */
    MAXREGSECT: -6,
    DIFSECT: -4,
    FATSECT: -3,
    ENDOFCHAIN: K,
    FREESECT: -1,
    /* 2.2 Compound File Header */
    HEADER_SIGNATURE: se,
    HEADER_MINOR_VERSION: "3e00",
    MAXREGSID: -6,
    NOSTREAM: -1,
    HEADER_CLSID: ue,
    /* 2.6.1 Compound File Directory Entry */
    EntryTypes: ["unknown", "storage", "stream", "lockbytes", "property", "root"]
  };
  function Le(_, k, T) {
    l();
    var S = U(_, T);
    o.writeFileSync(k, S);
  }
  function G(_) {
    for (var k = new Array(_.length), T = 0; T < _.length; ++T) k[T] = String.fromCharCode(_[T]);
    return k.join("");
  }
  function xe(_, k) {
    var T = U(_, k);
    switch (k && k.type || "buffer") {
      case "file":
        return l(), o.writeFileSync(k.filename, T), T;
      case "binary":
        return typeof T == "string" ? T : G(T);
      case "base64":
        return ja(typeof T == "string" ? T : G(T));
      case "buffer":
        if (ye) return Buffer.isBuffer(T) ? T : _t(T);
      /* falls through */
      case "array":
        return typeof T == "string" ? Dr(T) : T;
    }
    return T;
  }
  var ve;
  function O(_) {
    try {
      var k = _.InflateRaw, T = new k();
      if (T._processChunk(new Uint8Array([3, 0]), T._finishFlushFlag), T.bytesRead) ve = _;
      else throw new Error("zlib does not expose bytesRead");
    } catch (S) {
      console.error("cannot use native zlib: " + (S.message || S));
    }
  }
  function B(_, k) {
    if (!ve) return Bs(_, k);
    var T = ve.InflateRaw, S = new T(), F = S._processChunk(_.slice(_.l), S._finishFlushFlag);
    return _.l += S.bytesRead, F;
  }
  function R(_) {
    return ve ? ve.deflateRawSync(_) : Se(_);
  }
  var D = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15], Y = [3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258], J = [1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145, 8193, 12289, 16385, 24577];
  function ae(_) {
    var k = (_ << 1 | _ << 11) & 139536 | (_ << 5 | _ << 15) & 558144;
    return (k >> 16 | k >> 8 | k) & 255;
  }
  for (var ee = typeof Uint8Array < "u", Z = ee ? new Uint8Array(256) : [], we = 0; we < 256; ++we) Z[we] = ae(we);
  function I(_, k) {
    var T = Z[_ & 255];
    return k <= 8 ? T >>> 8 - k : (T = T << 8 | Z[_ >> 8 & 255], k <= 16 ? T >>> 16 - k : (T = T << 8 | Z[_ >> 16 & 255], T >>> 24 - k));
  }
  function Xe(_, k) {
    var T = k & 7, S = k >>> 3;
    return (_[S] | (T <= 6 ? 0 : _[S + 1] << 8)) >>> T & 3;
  }
  function Ne(_, k) {
    var T = k & 7, S = k >>> 3;
    return (_[S] | (T <= 5 ? 0 : _[S + 1] << 8)) >>> T & 7;
  }
  function Be(_, k) {
    var T = k & 7, S = k >>> 3;
    return (_[S] | (T <= 4 ? 0 : _[S + 1] << 8)) >>> T & 15;
  }
  function Fe(_, k) {
    var T = k & 7, S = k >>> 3;
    return (_[S] | (T <= 3 ? 0 : _[S + 1] << 8)) >>> T & 31;
  }
  function fe(_, k) {
    var T = k & 7, S = k >>> 3;
    return (_[S] | (T <= 1 ? 0 : _[S + 1] << 8)) >>> T & 127;
  }
  function Je(_, k, T) {
    var S = k & 7, F = k >>> 3, C = (1 << T) - 1, W = _[F] >>> S;
    return T < 8 - S || (W |= _[F + 1] << 8 - S, T < 16 - S) || (W |= _[F + 2] << 16 - S, T < 24 - S) || (W |= _[F + 3] << 24 - S), W & C;
  }
  function Ur(_, k, T) {
    var S = k & 7, F = k >>> 3;
    return S <= 5 ? _[F] |= (T & 7) << S : (_[F] |= T << S & 255, _[F + 1] = (T & 7) >> 8 - S), k + 3;
  }
  function tt(_, k, T) {
    var S = k & 7, F = k >>> 3;
    return T = (T & 1) << S, _[F] |= T, k + 1;
  }
  function ht(_, k, T) {
    var S = k & 7, F = k >>> 3;
    return T <<= S, _[F] |= T & 255, T >>>= 8, _[F + 1] = T, k + 8;
  }
  function ya(_, k, T) {
    var S = k & 7, F = k >>> 3;
    return T <<= S, _[F] |= T & 255, T >>>= 8, _[F + 1] = T & 255, _[F + 2] = T >>> 8, k + 16;
  }
  function yt(_, k) {
    var T = _.length, S = 2 * T > k ? 2 * T : k + 5, F = 0;
    if (T >= k) return _;
    if (ye) {
      var C = f0(S);
      if (_.copy) _.copy(C);
      else for (; F < _.length; ++F) C[F] = _[F];
      return C;
    } else if (ee) {
      var W = new Uint8Array(S);
      if (W.set) W.set(_);
      else for (; F < T; ++F) W[F] = _[F];
      return W;
    }
    return _.length = S, _;
  }
  function Lr(_) {
    for (var k = new Array(_), T = 0; T < _; ++T) k[T] = 0;
    return k;
  }
  function dt(_, k, T) {
    var S = 1, F = 0, C = 0, W = 0, j = 0, X = _.length, H = ee ? new Uint16Array(32) : Lr(32);
    for (C = 0; C < 32; ++C) H[C] = 0;
    for (C = X; C < T; ++C) _[C] = 0;
    X = _.length;
    var V = ee ? new Uint16Array(X) : Lr(X);
    for (C = 0; C < X; ++C)
      H[F = _[C]]++, S < F && (S = F), V[C] = 0;
    for (H[0] = 0, C = 1; C <= S; ++C) H[C + 16] = j = j + H[C - 1] << 1;
    for (C = 0; C < X; ++C)
      j = _[C], j != 0 && (V[C] = H[j + 16]++);
    var Q = 0;
    for (C = 0; C < X; ++C)
      if (Q = _[C], Q != 0)
        for (j = I(V[C], S) >> S - Q, W = (1 << S + 4 - Q) - 1; W >= 0; --W)
          k[j | W << Q] = Q & 15 | C << 4;
    return S;
  }
  var St = ee ? new Uint16Array(512) : Lr(512), Sa = ee ? new Uint16Array(32) : Lr(32);
  if (!ee) {
    for (var kr = 0; kr < 512; ++kr) St[kr] = 0;
    for (kr = 0; kr < 32; ++kr) Sa[kr] = 0;
  }
  (function() {
    for (var _ = [], k = 0; k < 32; k++) _.push(5);
    dt(_, Sa, 32);
    var T = [];
    for (k = 0; k <= 143; k++) T.push(8);
    for (; k <= 255; k++) T.push(9);
    for (; k <= 279; k++) T.push(7);
    for (; k <= 287; k++) T.push(8);
    dt(T, St, 288);
  })();
  var at = /* @__PURE__ */ (function() {
    for (var k = ee ? new Uint8Array(32768) : [], T = 0, S = 0; T < J.length - 1; ++T)
      for (; S < J[T + 1]; ++S) k[S] = T;
    for (; S < 32768; ++S) k[S] = 29;
    var F = ee ? new Uint8Array(259) : [];
    for (T = 0, S = 0; T < Y.length - 1; ++T)
      for (; S < Y[T + 1]; ++S) F[S] = T;
    function C(j, X) {
      for (var H = 0; H < j.length; ) {
        var V = Math.min(65535, j.length - H), Q = H + V == j.length;
        for (X.write_shift(1, +Q), X.write_shift(2, V), X.write_shift(2, ~V & 65535); V-- > 0; ) X[X.l++] = j[H++];
      }
      return X.l;
    }
    function W(j, X) {
      for (var H = 0, V = 0, Q = ee ? new Uint16Array(32768) : []; V < j.length; ) {
        var ce = (
          /* data.length - boff; */
          Math.min(65535, j.length - V)
        );
        if (ce < 10) {
          for (H = Ur(X, H, +(V + ce == j.length)), H & 7 && (H += 8 - (H & 7)), X.l = H / 8 | 0, X.write_shift(2, ce), X.write_shift(2, ~ce & 65535); ce-- > 0; ) X[X.l++] = j[V++];
          H = X.l * 8;
          continue;
        }
        H = Ur(X, H, +(V + ce == j.length) + 2);
        for (var he = 0; ce-- > 0; ) {
          var te = j[V];
          he = (he << 5 ^ te) & 32767;
          var le = -1, Ee = 0;
          if ((le = Q[he]) && (le |= V & -32768, le > V && (le -= 32768), le < V))
            for (; j[le + Ee] == j[V + Ee] && Ee < 250; ) ++Ee;
          if (Ee > 2) {
            te = F[Ee], te <= 22 ? H = ht(X, H, Z[te + 1] >> 1) - 1 : (ht(X, H, 3), H += 5, ht(X, H, Z[te - 23] >> 5), H += 3);
            var Ve = te < 8 ? 0 : te - 4 >> 2;
            Ve > 0 && (ya(X, H, Ee - Y[te]), H += Ve), te = k[V - le], H = ht(X, H, Z[te] >> 3), H -= 3;
            var ze = te < 4 ? 0 : te - 2 >> 1;
            ze > 0 && (ya(X, H, V - le - J[te]), H += ze);
            for (var pr = 0; pr < Ee; ++pr)
              Q[he] = V & 32767, he = (he << 5 ^ j[V]) & 32767, ++V;
            ce -= Ee - 1;
          } else
            te <= 143 ? te = te + 48 : H = tt(X, H, 1), H = ht(X, H, Z[te]), Q[he] = V & 32767, ++V;
        }
        H = ht(X, H, 0) - 1;
      }
      return X.l = (H + 7) / 8 | 0, X.l;
    }
    return function(X, H) {
      return X.length < 8 ? C(X, H) : W(X, H);
    };
  })();
  function Se(_) {
    var k = z(50 + Math.floor(_.length * 1.1)), T = at(_, k);
    return k.slice(0, T);
  }
  var Ze = ee ? new Uint16Array(32768) : Lr(32768), Xr = ee ? new Uint16Array(32768) : Lr(32768), nr = ee ? new Uint16Array(128) : Lr(128), Mt = 1, Ms = 1;
  function Yf(_, k) {
    var T = Fe(_, k) + 257;
    k += 5;
    var S = Fe(_, k) + 1;
    k += 5;
    var F = Be(_, k) + 4;
    k += 4;
    for (var C = 0, W = ee ? new Uint8Array(19) : Lr(19), j = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], X = 1, H = ee ? new Uint8Array(8) : Lr(8), V = ee ? new Uint8Array(8) : Lr(8), Q = W.length, ce = 0; ce < F; ++ce)
      W[D[ce]] = C = Ne(_, k), X < C && (X = C), H[C]++, k += 3;
    var he = 0;
    for (H[0] = 0, ce = 1; ce <= X; ++ce) V[ce] = he = he + H[ce - 1] << 1;
    for (ce = 0; ce < Q; ++ce) (he = W[ce]) != 0 && (j[ce] = V[he]++);
    var te = 0;
    for (ce = 0; ce < Q; ++ce)
      if (te = W[ce], te != 0) {
        he = Z[j[ce]] >> 8 - te;
        for (var le = (1 << 7 - te) - 1; le >= 0; --le) nr[he | le << te] = te & 7 | ce << 3;
      }
    var Ee = [];
    for (X = 1; Ee.length < T + S; )
      switch (he = nr[fe(_, k)], k += he & 7, he >>>= 3) {
        case 16:
          for (C = 3 + Xe(_, k), k += 2, he = Ee[Ee.length - 1]; C-- > 0; ) Ee.push(he);
          break;
        case 17:
          for (C = 3 + Ne(_, k), k += 3; C-- > 0; ) Ee.push(0);
          break;
        case 18:
          for (C = 11 + fe(_, k), k += 7; C-- > 0; ) Ee.push(0);
          break;
        default:
          Ee.push(he), X < he && (X = he);
          break;
      }
    var Ve = Ee.slice(0, T), ze = Ee.slice(T);
    for (ce = T; ce < 286; ++ce) Ve[ce] = 0;
    for (ce = S; ce < 30; ++ce) ze[ce] = 0;
    return Mt = dt(Ve, Ze, 286), Ms = dt(ze, Xr, 30), k;
  }
  function jf(_, k) {
    if (_[0] == 3 && !(_[1] & 3))
      return [Ot(k), 2];
    for (var T = 0, S = 0, F = f0(k || 1 << 18), C = 0, W = F.length >>> 0, j = 0, X = 0; (S & 1) == 0; ) {
      if (S = Ne(_, T), T += 3, S >>> 1)
        S >> 1 == 1 ? (j = 9, X = 5) : (T = Yf(_, T), j = Mt, X = Ms);
      else {
        T & 7 && (T += 8 - (T & 7));
        var H = _[T >>> 3] | _[(T >>> 3) + 1] << 8;
        if (T += 32, H > 0)
          for (!k && W < C + H && (F = yt(F, C + H), W = F.length); H-- > 0; )
            F[C++] = _[T >>> 3], T += 8;
        continue;
      }
      for (; ; ) {
        !k && W < C + 32767 && (F = yt(F, C + 32767), W = F.length);
        var V = Je(_, T, j), Q = S >>> 1 == 1 ? St[V] : Ze[V];
        if (T += Q & 15, Q >>>= 4, (Q >>> 8 & 255) === 0) F[C++] = Q;
        else {
          if (Q == 256) break;
          Q -= 257;
          var ce = Q < 8 ? 0 : Q - 4 >> 2;
          ce > 5 && (ce = 0);
          var he = C + Y[Q];
          ce > 0 && (he += Je(_, T, ce), T += ce), V = Je(_, T, X), Q = S >>> 1 == 1 ? Sa[V] : Xr[V], T += Q & 15, Q >>>= 4;
          var te = Q < 4 ? 0 : Q - 2 >> 1, le = J[Q];
          for (te > 0 && (le += Je(_, T, te), T += te), !k && W < he && (F = yt(F, he + 100), W = F.length); C < he; )
            F[C] = F[C - le], ++C;
        }
      }
    }
    return k ? [F, T + 7 >>> 3] : [F.slice(0, C), T + 7 >>> 3];
  }
  function Bs(_, k) {
    var T = _.slice(_.l || 0), S = jf(T, k);
    return _.l += S[1], S[0];
  }
  function Us(_, k) {
    if (_)
      typeof console < "u" && console.error(k);
    else throw new Error(k);
  }
  function Xs(_, k) {
    var T = (
      /*::(*/
      _
    );
    dr(T, 0);
    var S = [], F = [], C = {
      FileIndex: S,
      FullPaths: F
    };
    w(C, { root: k.root });
    for (var W = T.length - 4; (T[W] != 80 || T[W + 1] != 75 || T[W + 2] != 5 || T[W + 3] != 6) && W >= 0; ) --W;
    T.l = W + 4, T.l += 4;
    var j = T.read_shift(2);
    T.l += 6;
    var X = T.read_shift(4);
    for (T.l = X, W = 0; W < j; ++W) {
      T.l += 20;
      var H = T.read_shift(4), V = T.read_shift(4), Q = T.read_shift(2), ce = T.read_shift(2), he = T.read_shift(2);
      T.l += 8;
      var te = T.read_shift(4), le = c(
        /*::(*/
        T.slice(T.l + Q, T.l + Q + ce)
        /*:: :any)*/
      );
      T.l += Q + ce + he;
      var Ee = T.l;
      T.l = te + 4, Kf(T, H, V, C, le), T.l = Ee;
    }
    return C;
  }
  function Kf(_, k, T, S, F) {
    _.l += 2;
    var C = _.read_shift(2), W = _.read_shift(2), j = s(_);
    if (C & 8257) throw new Error("Unsupported ZIP encryption");
    for (var X = _.read_shift(4), H = _.read_shift(4), V = _.read_shift(4), Q = _.read_shift(2), ce = _.read_shift(2), he = "", te = 0; te < Q; ++te) he += String.fromCharCode(_[_.l++]);
    if (ce) {
      var le = c(
        /*::(*/
        _.slice(_.l, _.l + ce)
        /*:: :any)*/
      );
      (le[21589] || {}).mt && (j = le[21589].mt), ((F || {})[21589] || {}).mt && (j = F[21589].mt);
    }
    _.l += ce;
    var Ee = _.slice(_.l, _.l + H);
    switch (W) {
      case 8:
        Ee = B(_, V);
        break;
      case 0:
        break;
      // TODO: scan for magic number
      default:
        throw new Error("Unsupported ZIP Compression method " + W);
    }
    var Ve = !1;
    C & 8 && (X = _.read_shift(4), X == 134695760 && (X = _.read_shift(4), Ve = !0), H = _.read_shift(4), V = _.read_shift(4)), H != k && Us(Ve, "Bad compressed size: " + k + " != " + H), V != T && Us(Ve, "Bad uncompressed size: " + T + " != " + V), ri(S, he, Ee, { unsafe: !0, mt: j });
  }
  function qf(_, k) {
    var T = k || {}, S = [], F = [], C = z(1), W = T.compression ? 8 : 0, j = 0, X = 0, H = 0, V = 0, Q = 0, ce = _.FullPaths[0], he = ce, te = _.FileIndex[0], le = [], Ee = 0;
    for (X = 1; X < _.FullPaths.length; ++X)
      if (he = _.FullPaths[X].slice(ce.length), te = _.FileIndex[X], !(!te.size || !te.content || he == "Sh33tJ5")) {
        var Ve = V, ze = z(he.length);
        for (H = 0; H < he.length; ++H) ze.write_shift(1, he.charCodeAt(H) & 127);
        ze = ze.slice(0, ze.l), le[Q] = au.buf(
          /*::((*/
          te.content,
          0
        );
        var pr = te.content;
        W == 8 && (pr = R(pr)), C = z(30), C.write_shift(4, 67324752), C.write_shift(2, 20), C.write_shift(2, j), C.write_shift(2, W), te.mt ? i(C, te.mt) : C.write_shift(4, 0), C.write_shift(-4, le[Q]), C.write_shift(4, pr.length), C.write_shift(
          4,
          /*::(*/
          te.content.length
        ), C.write_shift(2, ze.length), C.write_shift(2, 0), V += C.length, S.push(C), V += ze.length, S.push(ze), V += pr.length, S.push(pr), C = z(46), C.write_shift(4, 33639248), C.write_shift(2, 0), C.write_shift(2, 20), C.write_shift(2, j), C.write_shift(2, W), C.write_shift(4, 0), C.write_shift(-4, le[Q]), C.write_shift(4, pr.length), C.write_shift(
          4,
          /*::(*/
          te.content.length
        ), C.write_shift(2, ze.length), C.write_shift(2, 0), C.write_shift(2, 0), C.write_shift(2, 0), C.write_shift(2, 0), C.write_shift(4, 0), C.write_shift(4, Ve), Ee += C.l, F.push(C), Ee += ze.length, F.push(ze), ++Q;
      }
    return C = z(22), C.write_shift(4, 101010256), C.write_shift(2, 0), C.write_shift(2, 0), C.write_shift(2, Q), C.write_shift(2, Q), C.write_shift(4, Ee), C.write_shift(4, V), C.write_shift(2, 0), fr([fr(S), fr(F), C]);
  }
  var mn = {
    htm: "text/html",
    xml: "text/xml",
    gif: "image/gif",
    jpg: "image/jpeg",
    png: "image/png",
    mso: "application/x-mso",
    thmx: "application/vnd.ms-officetheme",
    sh33tj5: "application/octet-stream"
  };
  function $f(_, k) {
    if (_.ctype) return _.ctype;
    var T = _.name || "", S = T.match(/\.([^\.]+)$/);
    return S && mn[S[1]] || k && (S = (T = k).match(/[\.\\]([^\.\\])+$/), S && mn[S[1]]) ? mn[S[1]] : "application/octet-stream";
  }
  function Jf(_) {
    for (var k = ja(_), T = [], S = 0; S < k.length; S += 76) T.push(k.slice(S, S + 76));
    return T.join(`\r
`) + `\r
`;
  }
  function Zf(_) {
    var k = _.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF=]/g, function(H) {
      var V = H.charCodeAt(0).toString(16).toUpperCase();
      return "=" + (V.length == 1 ? "0" + V : V);
    });
    k = k.replace(/ $/mg, "=20").replace(/\t$/mg, "=09"), k.charAt(0) == `
` && (k = "=0D" + k.slice(1)), k = k.replace(/\r(?!\n)/mg, "=0D").replace(/\n\n/mg, `
=0A`).replace(/([^\r\n])\n/mg, "$1=0A");
    for (var T = [], S = k.split(`\r
`), F = 0; F < S.length; ++F) {
      var C = S[F];
      if (C.length == 0) {
        T.push("");
        continue;
      }
      for (var W = 0; W < C.length; ) {
        var j = 76, X = C.slice(W, W + j);
        X.charAt(j - 1) == "=" ? j-- : X.charAt(j - 2) == "=" ? j -= 2 : X.charAt(j - 3) == "=" && (j -= 3), X = C.slice(W, W + j), W += j, W < C.length && (X += "="), T.push(X);
      }
    }
    return T.join(`\r
`);
  }
  function Qf(_) {
    for (var k = [], T = 0; T < _.length; ++T) {
      for (var S = _[T]; T <= _.length && S.charAt(S.length - 1) == "="; ) S = S.slice(0, S.length - 1) + _[++T];
      k.push(S);
    }
    for (var F = 0; F < k.length; ++F) k[F] = k[F].replace(/[=][0-9A-Fa-f]{2}/g, function(C) {
      return String.fromCharCode(parseInt(C.slice(1), 16));
    });
    return Dr(k.join(`\r
`));
  }
  function el(_, k, T) {
    for (var S = "", F = "", C = "", W, j = 0; j < 10; ++j) {
      var X = k[j];
      if (!X || X.match(/^\s*$/)) break;
      var H = X.match(/^(.*?):\s*([^\s].*)$/);
      if (H) switch (H[1].toLowerCase()) {
        case "content-location":
          S = H[2].trim();
          break;
        case "content-type":
          C = H[2].trim();
          break;
        case "content-transfer-encoding":
          F = H[2].trim();
          break;
      }
    }
    switch (++j, F.toLowerCase()) {
      case "base64":
        W = Dr(Mr(k.slice(j).join("")));
        break;
      case "quoted-printable":
        W = Qf(k.slice(j));
        break;
      default:
        throw new Error("Unsupported Content-Transfer-Encoding " + F);
    }
    var V = ri(_, S.slice(T.length), W, { unsafe: !0 });
    C && (V.ctype = C);
  }
  function rl(_, k) {
    if (G(_.slice(0, 13)).toLowerCase() != "mime-version:") throw new Error("Unsupported MAD header");
    var T = k && k.root || "", S = (ye && Buffer.isBuffer(_) ? _.toString("binary") : G(_)).split(`\r
`), F = 0, C = "";
    for (F = 0; F < S.length; ++F)
      if (C = S[F], !!/^Content-Location:/i.test(C) && (C = C.slice(C.indexOf("file")), T || (T = C.slice(0, C.lastIndexOf("/") + 1)), C.slice(0, T.length) != T))
        for (; T.length > 0 && (T = T.slice(0, T.length - 1), T = T.slice(0, T.lastIndexOf("/") + 1), C.slice(0, T.length) != T); )
          ;
    var W = (S[1] || "").match(/boundary="(.*?)"/);
    if (!W) throw new Error("MAD cannot find boundary");
    var j = "--" + (W[1] || ""), X = [], H = [], V = {
      FileIndex: X,
      FullPaths: H
    };
    w(V);
    var Q, ce = 0;
    for (F = 0; F < S.length; ++F) {
      var he = S[F];
      he !== j && he !== j + "--" || (ce++ && el(V, S.slice(Q, F), T), Q = F);
    }
    return V;
  }
  function tl(_, k) {
    var T = k || {}, S = T.boundary || "SheetJS";
    S = "------=" + S;
    for (var F = [
      "MIME-Version: 1.0",
      'Content-Type: multipart/related; boundary="' + S.slice(2) + '"',
      "",
      "",
      ""
    ], C = _.FullPaths[0], W = C, j = _.FileIndex[0], X = 1; X < _.FullPaths.length; ++X)
      if (W = _.FullPaths[X].slice(C.length), j = _.FileIndex[X], !(!j.size || !j.content || W == "Sh33tJ5")) {
        W = W.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7E-\xFF]/g, function(Ee) {
          return "_x" + Ee.charCodeAt(0).toString(16) + "_";
        }).replace(/[\u0080-\uFFFF]/g, function(Ee) {
          return "_u" + Ee.charCodeAt(0).toString(16) + "_";
        });
        for (var H = j.content, V = ye && Buffer.isBuffer(H) ? H.toString("binary") : G(H), Q = 0, ce = Math.min(1024, V.length), he = 0, te = 0; te <= ce; ++te) (he = V.charCodeAt(te)) >= 32 && he < 128 && ++Q;
        var le = Q >= ce * 4 / 5;
        F.push(S), F.push("Content-Location: " + (T.root || "file:///C:/SheetJS/") + W), F.push("Content-Transfer-Encoding: " + (le ? "quoted-printable" : "base64")), F.push("Content-Type: " + $f(j, W)), F.push(""), F.push(le ? Zf(V) : Jf(V));
      }
    return F.push(S + `--\r
`), F.join(`\r
`);
  }
  function al(_) {
    var k = {};
    return w(k, _), k;
  }
  function ri(_, k, T, S) {
    var F = S && S.unsafe;
    F || w(_);
    var C = !F && de.find(_, k);
    if (!C) {
      var W = _.FullPaths[0];
      k.slice(0, W.length) == W ? W = k : (W.slice(-1) != "/" && (W += "/"), W = (W + k).replace("//", "/")), C = { name: n(k), type: 2 }, _.FileIndex.push(C), _.FullPaths.push(W), F || de.utils.cfb_gc(_);
    }
    return C.content = T, C.size = T ? T.length : 0, S && (S.CLSID && (C.clsid = S.CLSID), S.mt && (C.mt = S.mt), S.ct && (C.ct = S.ct)), C;
  }
  function nl(_, k) {
    w(_);
    var T = de.find(_, k);
    if (T) {
      for (var S = 0; S < _.FileIndex.length; ++S) if (_.FileIndex[S] == T)
        return _.FileIndex.splice(S, 1), _.FullPaths.splice(S, 1), !0;
    }
    return !1;
  }
  function il(_, k, T) {
    w(_);
    var S = de.find(_, k);
    if (S) {
      for (var F = 0; F < _.FileIndex.length; ++F) if (_.FileIndex[F] == S)
        return _.FileIndex[F].name = n(T), _.FullPaths[F] = T, !0;
    }
    return !1;
  }
  function sl(_) {
    L(_, !0);
  }
  return t.find = M, t.read = A, t.parse = f, t.write = xe, t.writeFile = Le, t.utils = {
    cfb_new: al,
    cfb_add: ri,
    cfb_del: nl,
    cfb_mov: il,
    cfb_gc: sl,
    ReadShift: Ba,
    CheckField: co,
    prep_blob: dr,
    bconcat: fr,
    use_zlib: O,
    _deflateRaw: Se,
    _inflateRaw: Bs,
    consts: oe
  }, t;
})();
let Ct;
function nu(e) {
  Ct = e;
}
function iu(e) {
  return typeof e == "string" ? cn(e) : Array.isArray(e) ? Ol(e) : e;
}
function fn(e, t, r) {
  if (typeof Ct < "u" && Ct.writeFileSync) return r ? Ct.writeFileSync(e, t, r) : Ct.writeFileSync(e, t);
  if (typeof Deno < "u") {
    if (r && typeof t == "string") switch (r) {
      case "utf8":
        t = new TextEncoder(r).encode(t);
        break;
      case "binary":
        t = cn(t);
        break;
      /* TODO: binary equivalent */
      default:
        throw new Error("Unsupported encoding " + r);
    }
    return Deno.writeFileSync(e, t);
  }
  var a = r == "utf8" ? ct(t) : t;
  if (typeof IE_SaveFile < "u") return IE_SaveFile(a, e);
  if (typeof Blob < "u") {
    var n = new Blob([iu(a)], { type: "application/octet-stream" });
    if (typeof navigator < "u" && navigator.msSaveBlob) return navigator.msSaveBlob(n, e);
    if (typeof saveAs < "u") return saveAs(n, e);
    if (typeof URL < "u" && typeof document < "u" && document.createElement && URL.createObjectURL) {
      var i = URL.createObjectURL(n);
      if (typeof chrome == "object" && typeof (chrome.downloads || {}).download == "function")
        return URL.revokeObjectURL && typeof setTimeout < "u" && setTimeout(function() {
          URL.revokeObjectURL(i);
        }, 6e4), chrome.downloads.download({ url: i, filename: e, saveAs: !0 });
      var s = document.createElement("a");
      if (s.download != null)
        return s.download = e, s.href = i, document.body.appendChild(s), s.click(), document.body.removeChild(s), URL.revokeObjectURL && typeof setTimeout < "u" && setTimeout(function() {
          URL.revokeObjectURL(i);
        }, 6e4), i;
    }
  }
  if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u") try {
    var c = File(e);
    return c.open("w"), c.encoding = "binary", Array.isArray(t) && (t = Dt(t)), c.write(t), c.close(), t;
  } catch (o) {
    if (!o.message || !o.message.match(/onstruct/)) throw o;
  }
  throw new Error("cannot save file " + e);
}
function su(e) {
  if (typeof Ct < "u") return Ct.readFileSync(e);
  if (typeof Deno < "u") return Deno.readFileSync(e);
  if (typeof $ < "u" && typeof File < "u" && typeof Folder < "u") try {
    var t = File(e);
    t.open("r"), t.encoding = "binary";
    var r = t.read();
    return t.close(), r;
  } catch (a) {
    if (!a.message || !a.message.match(/onstruct/)) throw a;
  }
  throw new Error("Cannot access file " + e);
}
function $e(e) {
  for (var t = Object.keys(e), r = [], a = 0; a < t.length; ++a) Object.prototype.hasOwnProperty.call(e, t[a]) && r.push(t[a]);
  return r;
}
function v0(e, t) {
  for (var r = [], a = $e(e), n = 0; n !== a.length; ++n) r[e[a[n]][t]] == null && (r[e[a[n]][t]] = a[n]);
  return r;
}
function zn(e) {
  for (var t = [], r = $e(e), a = 0; a !== r.length; ++a) t[e[r[a]]] = r[a];
  return t;
}
function Yn(e) {
  for (var t = [], r = $e(e), a = 0; a !== r.length; ++a) t[e[r[a]]] = parseInt(r[a], 10);
  return t;
}
function cu(e) {
  for (var t = [], r = $e(e), a = 0; a !== r.length; ++a)
    t[e[r[a]]] == null && (t[e[r[a]]] = []), t[e[r[a]]].push(r[a]);
  return t;
}
var Rn = /* @__PURE__ */ new Date(1899, 11, 30, 0, 0, 0);
function sr(e, t) {
  var r = /* @__PURE__ */ e.getTime(), a = /* @__PURE__ */ Rn.getTime() + (/* @__PURE__ */ e.getTimezoneOffset() - /* @__PURE__ */ Rn.getTimezoneOffset()) * 6e4;
  return (r - a) / (1440 * 60 * 1e3);
}
var Vc = /* @__PURE__ */ new Date(), ou = /* @__PURE__ */ Rn.getTime() + (/* @__PURE__ */ Vc.getTimezoneOffset() - /* @__PURE__ */ Rn.getTimezoneOffset()) * 6e4, g0 = /* @__PURE__ */ Vc.getTimezoneOffset();
function jn(e) {
  var t = /* @__PURE__ */ new Date();
  return t.setTime(e * 24 * 60 * 60 * 1e3 + ou), t.getTimezoneOffset() !== g0 && t.setTime(t.getTime() + (t.getTimezoneOffset() - g0) * 6e4), t;
}
function fu(e) {
  var t = 0, r = 0, a = !1, n = e.match(/P([0-9\.]+Y)?([0-9\.]+M)?([0-9\.]+D)?T([0-9\.]+H)?([0-9\.]+M)?([0-9\.]+S)?/);
  if (!n) throw new Error("|" + e + "| is not an ISO8601 Duration");
  for (var i = 1; i != n.length; ++i)
    if (n[i]) {
      switch (r = 1, i > 3 && (a = !0), n[i].slice(n[i].length - 1)) {
        case "Y":
          throw new Error("Unsupported ISO Duration Field: " + n[i].slice(n[i].length - 1));
        case "D":
          r *= 24;
        /* falls through */
        case "H":
          r *= 60;
        /* falls through */
        case "M":
          if (a) r *= 60;
          else throw new Error("Unsupported ISO Duration Field: M");
      }
      t += r * parseInt(n[i], 10);
    }
  return t;
}
var E0 = /* @__PURE__ */ new Date("2017-02-19T19:06:09.000Z"), zc = /* @__PURE__ */ isNaN(/* @__PURE__ */ E0.getFullYear()) ? /* @__PURE__ */ new Date("2/19/17") : E0, lu = /* @__PURE__ */ zc.getFullYear() == 2017;
function Ge(e, t) {
  var r = new Date(e);
  if (lu)
    return t > 0 ? r.setTime(r.getTime() + r.getTimezoneOffset() * 60 * 1e3) : t < 0 && r.setTime(r.getTime() - r.getTimezoneOffset() * 60 * 1e3), r;
  if (e instanceof Date) return e;
  if (zc.getFullYear() == 1917 && !isNaN(r.getFullYear())) {
    var a = r.getFullYear();
    return e.indexOf("" + a) > -1 || r.setFullYear(r.getFullYear() + 100), r;
  }
  var n = e.match(/\d+/g) || ["2017", "2", "19", "0", "0", "0"], i = new Date(+n[0], +n[1] - 1, +n[2], +n[3] || 0, +n[4] || 0, +n[5] || 0);
  return e.indexOf("Z") > -1 && (i = new Date(i.getTime() - i.getTimezoneOffset() * 60 * 1e3)), i;
}
function jt(e, t) {
  if (ye && Buffer.isBuffer(e)) {
    if (t) {
      if (e[0] == 255 && e[1] == 254) return ct(e.slice(2).toString("utf16le"));
      if (e[1] == 254 && e[2] == 255) return ct(Ic(e.slice(2).toString("binary")));
    }
    return e.toString("binary");
  }
  if (typeof TextDecoder < "u") try {
    if (t) {
      if (e[0] == 255 && e[1] == 254) return ct(new TextDecoder("utf-16le").decode(e.slice(2)));
      if (e[0] == 254 && e[1] == 255) return ct(new TextDecoder("utf-16be").decode(e.slice(2)));
    }
    var r = {
      "€": "",
      "‚": "",
      ƒ: "",
      "„": "",
      "…": "",
      "†": "",
      "‡": "",
      "ˆ": "",
      "‰": "",
      Š: "",
      "‹": "",
      Œ: "",
      Ž: "",
      "‘": "",
      "’": "",
      "“": "",
      "”": "",
      "•": "",
      "–": "",
      "—": "",
      "˜": "",
      "™": "",
      š: "",
      "›": "",
      œ: "",
      ž: "",
      Ÿ: ""
    };
    return Array.isArray(e) && (e = new Uint8Array(e)), new TextDecoder("latin1").decode(e).replace(/[€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ]/g, function(i) {
      return r[i] || i;
    });
  } catch {
  }
  for (var a = [], n = 0; n != e.length; ++n) a.push(String.fromCharCode(e[n]));
  return a.join("");
}
function Ue(e) {
  if (typeof JSON < "u" && !Array.isArray(e)) return JSON.parse(JSON.stringify(e));
  if (typeof e != "object" || e == null) return e;
  if (e instanceof Date) return new Date(e.getTime());
  var t = {};
  for (var r in e) Object.prototype.hasOwnProperty.call(e, r) && (t[r] = Ue(e[r]));
  return t;
}
function je(e, t) {
  for (var r = ""; r.length < t; ) r += e;
  return r;
}
function et(e) {
  var t = Number(e);
  if (!isNaN(t)) return isFinite(t) ? t : NaN;
  if (!/\d/.test(e)) return t;
  var r = 1, a = e.replace(/([\d]),([\d])/g, "$1$2").replace(/[$]/g, "").replace(/[%]/g, function() {
    return r *= 100, "";
  });
  return !isNaN(t = Number(a)) || (a = a.replace(/[(](.*)[)]/, function(n, i) {
    return r = -r, i;
  }), !isNaN(t = Number(a))) ? t / r : t;
}
var uu = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
function ma(e) {
  var t = new Date(e), r = /* @__PURE__ */ new Date(NaN), a = t.getYear(), n = t.getMonth(), i = t.getDate();
  if (isNaN(i)) return r;
  var s = e.toLowerCase();
  if (s.match(/jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec/)) {
    if (s = s.replace(/[^a-z]/g, "").replace(/([^a-z]|^)[ap]m?([^a-z]|$)/, ""), s.length > 3 && uu.indexOf(s) == -1) return r;
  } else if (s.match(/[a-z]/)) return r;
  return a < 0 || a > 8099 ? r : (n > 0 || i > 1) && a != 101 ? t : e.match(/[^-0-9:,\/\\]/) ? r : t;
}
var hu = /* @__PURE__ */ (function() {
  var e = "abacaba".split(/(:?b)/i).length == 5;
  return function(r, a, n) {
    if (e || typeof a == "string") return r.split(a);
    for (var i = r.split(a), s = [i[0]], c = 1; c < i.length; ++c)
      s.push(n), s.push(i[c]);
    return s;
  };
})();
function Yc(e) {
  return e ? e.content && e.type ? jt(e.content, !0) : e.data ? la(e.data) : e.asNodeBuffer && ye ? la(e.asNodeBuffer().toString("binary")) : e.asBinary ? la(e.asBinary()) : e._data && e._data.getContent ? la(jt(Array.prototype.slice.call(e._data.getContent(), 0))) : null : null;
}
function jc(e) {
  if (!e) return null;
  if (e.data) return Cn(e.data);
  if (e.asNodeBuffer && ye) return e.asNodeBuffer();
  if (e._data && e._data.getContent) {
    var t = e._data.getContent();
    return typeof t == "string" ? Cn(t) : Array.prototype.slice.call(t);
  }
  return e.content && e.type ? e.content : null;
}
function du(e) {
  return e && e.name.slice(-4) === ".bin" ? jc(e) : Yc(e);
}
function zr(e, t) {
  for (var r = e.FullPaths || $e(e.files), a = t.toLowerCase().replace(/[\/]/g, "\\"), n = a.replace(/\\/g, "/"), i = 0; i < r.length; ++i) {
    var s = r[i].replace(/^Root Entry[\/]/, "").toLowerCase();
    if (a == s || n == s) return e.files ? e.files[r[i]] : e.FileIndex[i];
  }
  return null;
}
function qi(e, t) {
  var r = zr(e, t);
  if (r == null) throw new Error("Cannot find file " + t + " in zip");
  return r;
}
function tr(e, t, r) {
  if (!r) return du(qi(e, t));
  if (!t) return null;
  try {
    return tr(e, t);
  } catch {
    return null;
  }
}
function br(e, t, r) {
  if (!r) return Yc(qi(e, t));
  if (!t) return null;
  try {
    return br(e, t);
  } catch {
    return null;
  }
}
function xu(e, t, r) {
  return jc(qi(e, t));
}
function _0(e) {
  for (var t = e.FullPaths || $e(e.files), r = [], a = 0; a < t.length; ++a) t[a].slice(-1) != "/" && r.push(t[a].replace(/^Root Entry[\/]/, ""));
  return r.sort();
}
function Te(e, t, r) {
  if (e.FullPaths) {
    if (typeof r == "string") {
      var a;
      return ye ? a = _t(r) : a = Il(r), de.utils.cfb_add(e, t, a);
    }
    de.utils.cfb_add(e, t, r);
  } else e.file(t, r);
}
function $i() {
  return de.utils.cfb_new();
}
function Kc(e, t) {
  switch (t.type) {
    case "base64":
      return de.read(e, { type: "base64" });
    case "binary":
      return de.read(e, { type: "binary" });
    case "buffer":
    case "array":
      return de.read(e, { type: "buffer" });
  }
  throw new Error("Unrecognized type " + t.type);
}
function Ma(e, t) {
  if (e.charAt(0) == "/") return e.slice(1);
  var r = t.split("/");
  t.slice(-1) != "/" && r.pop();
  for (var a = e.split("/"); a.length !== 0; ) {
    var n = a.shift();
    n === ".." ? r.pop() : n !== "." && r.push(n);
  }
  return r.join("/");
}
var er = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\r
`, pu = /([^"\s?>\/]+)\s*=\s*((?:")([^"]*)(?:")|(?:')([^']*)(?:')|([^'">\s]+))/g, T0 = /<[\/\?]?[a-zA-Z0-9:_-]+(?:\s+[^"\s?>\/]+\s*=\s*(?:"[^"]*"|'[^']*'|[^'">\s=]+))*\s*[\/\?]?>/mg, mu = /<[^>]*>/g, Sr = /* @__PURE__ */ er.match(T0) ? T0 : mu, vu = /<\w*:/, gu = /<(\/?)\w+:/;
function ge(e, t, r) {
  for (var a = {}, n = 0, i = 0; n !== e.length && !((i = e.charCodeAt(n)) === 32 || i === 10 || i === 13); ++n) ;
  if (t || (a[0] = e.slice(0, n)), n === e.length) return a;
  var s = e.match(pu), c = 0, o = "", l = 0, f = "", d = "", h = 1;
  if (s) for (l = 0; l != s.length; ++l) {
    for (d = s[l], i = 0; i != d.length && d.charCodeAt(i) !== 61; ++i) ;
    for (f = d.slice(0, i).trim(); d.charCodeAt(i + 1) == 32; ) ++i;
    for (h = (n = d.charCodeAt(i + 1)) == 34 || n == 39 ? 1 : 0, o = d.slice(i + 1 + h, d.length - h), c = 0; c != f.length && f.charCodeAt(c) !== 58; ++c) ;
    if (c === f.length)
      f.indexOf("_") > 0 && (f = f.slice(0, f.indexOf("_"))), a[f] = o, a[f.toLowerCase()] = o;
    else {
      var p = (c === 5 && f.slice(0, 5) === "xmlns" ? "xmlns" : "") + f.slice(c + 1);
      if (a[p] && f.slice(c - 3, c) == "ext") continue;
      a[p] = o, a[p.toLowerCase()] = o;
    }
  }
  return a;
}
function lt(e) {
  return e.replace(gu, "<$1");
}
var qc = {
  "&quot;": '"',
  "&apos;": "'",
  "&gt;": ">",
  "&lt;": "<",
  "&amp;": "&"
}, Ji = /* @__PURE__ */ zn(qc), Ie = /* @__PURE__ */ (function() {
  var e = /&(?:quot|apos|gt|lt|amp|#x?([\da-fA-F]+));/ig, t = /_x([\da-fA-F]{4})_/ig;
  return function r(a) {
    var n = a + "", i = n.indexOf("<![CDATA[");
    if (i == -1) return n.replace(e, function(c, o) {
      return qc[c] || String.fromCharCode(parseInt(o, c.indexOf("x") > -1 ? 16 : 10)) || c;
    }).replace(t, function(c, o) {
      return String.fromCharCode(parseInt(o, 16));
    });
    var s = n.indexOf("]]>");
    return r(n.slice(0, i)) + n.slice(i + 9, s) + r(n.slice(s + 3));
  };
})(), Zi = /[&<>'"]/g, Eu = /[\u0000-\u0008\u000b-\u001f]/g;
function Pe(e) {
  var t = e + "";
  return t.replace(Zi, function(r) {
    return Ji[r];
  }).replace(Eu, function(r) {
    return "_x" + ("000" + r.charCodeAt(0).toString(16)).slice(-4) + "_";
  });
}
function w0(e) {
  return Pe(e).replace(/ /g, "_x0020_");
}
var $c = /[\u0000-\u001f]/g;
function Qi(e) {
  var t = e + "";
  return t.replace(Zi, function(r) {
    return Ji[r];
  }).replace(/\n/g, "<br/>").replace($c, function(r) {
    return "&#x" + ("000" + r.charCodeAt(0).toString(16)).slice(-4) + ";";
  });
}
function _u(e) {
  var t = e + "";
  return t.replace(Zi, function(r) {
    return Ji[r];
  }).replace($c, function(r) {
    return "&#x" + r.charCodeAt(0).toString(16).toUpperCase() + ";";
  });
}
var y0 = /* @__PURE__ */ (function() {
  var e = /&#(\d+);/g;
  function t(r, a) {
    return String.fromCharCode(parseInt(a, 10));
  }
  return function(a) {
    return a.replace(e, t);
  };
})();
function Tu(e) {
  return e.replace(/(\r\n|[\r\n])/g, "&#10;");
}
function We(e) {
  switch (e) {
    case 1:
    case !0:
    case "1":
    case "true":
    case "TRUE":
      return !0;
    /* case '0': case 'false': case 'FALSE':*/
    default:
      return !1;
  }
}
function mi(e) {
  for (var t = "", r = 0, a = 0, n = 0, i = 0, s = 0, c = 0; r < e.length; ) {
    if (a = e.charCodeAt(r++), a < 128) {
      t += String.fromCharCode(a);
      continue;
    }
    if (n = e.charCodeAt(r++), a > 191 && a < 224) {
      s = (a & 31) << 6, s |= n & 63, t += String.fromCharCode(s);
      continue;
    }
    if (i = e.charCodeAt(r++), a < 240) {
      t += String.fromCharCode((a & 15) << 12 | (n & 63) << 6 | i & 63);
      continue;
    }
    s = e.charCodeAt(r++), c = ((a & 7) << 18 | (n & 63) << 12 | (i & 63) << 6 | s & 63) - 65536, t += String.fromCharCode(55296 + (c >>> 10 & 1023)), t += String.fromCharCode(56320 + (c & 1023));
  }
  return t;
}
function S0(e) {
  var t = Ot(2 * e.length), r, a, n = 1, i = 0, s = 0, c;
  for (a = 0; a < e.length; a += n)
    n = 1, (c = e.charCodeAt(a)) < 128 ? r = c : c < 224 ? (r = (c & 31) * 64 + (e.charCodeAt(a + 1) & 63), n = 2) : c < 240 ? (r = (c & 15) * 4096 + (e.charCodeAt(a + 1) & 63) * 64 + (e.charCodeAt(a + 2) & 63), n = 3) : (n = 4, r = (c & 7) * 262144 + (e.charCodeAt(a + 1) & 63) * 4096 + (e.charCodeAt(a + 2) & 63) * 64 + (e.charCodeAt(a + 3) & 63), r -= 65536, s = 55296 + (r >>> 10 & 1023), r = 56320 + (r & 1023)), s !== 0 && (t[i++] = s & 255, t[i++] = s >>> 8, s = 0), t[i++] = r % 256, t[i++] = r >>> 8;
  return t.slice(0, i).toString("ucs2");
}
function k0(e) {
  return _t(e, "binary").toString("utf8");
}
var En = "foo bar bazâð£", Me = ye && (/* @__PURE__ */ k0(En) == /* @__PURE__ */ mi(En) && k0 || /* @__PURE__ */ S0(En) == /* @__PURE__ */ mi(En) && S0) || mi, ct = ye ? function(e) {
  return _t(e, "utf8").toString("binary");
} : function(e) {
  for (var t = [], r = 0, a = 0, n = 0; r < e.length; )
    switch (a = e.charCodeAt(r++), !0) {
      case a < 128:
        t.push(String.fromCharCode(a));
        break;
      case a < 2048:
        t.push(String.fromCharCode(192 + (a >> 6))), t.push(String.fromCharCode(128 + (a & 63)));
        break;
      case (a >= 55296 && a < 57344):
        a -= 55296, n = e.charCodeAt(r++) - 56320 + (a << 10), t.push(String.fromCharCode(240 + (n >> 18 & 7))), t.push(String.fromCharCode(144 + (n >> 12 & 63))), t.push(String.fromCharCode(128 + (n >> 6 & 63))), t.push(String.fromCharCode(128 + (n & 63)));
        break;
      default:
        t.push(String.fromCharCode(224 + (a >> 12))), t.push(String.fromCharCode(128 + (a >> 6 & 63))), t.push(String.fromCharCode(128 + (a & 63)));
    }
  return t.join("");
}, qa = /* @__PURE__ */ (function() {
  var e = {};
  return function(r, a) {
    var n = r + "|" + (a || "");
    return e[n] ? e[n] : e[n] = new RegExp("<(?:\\w+:)?" + r + '(?: xml:space="preserve")?(?:[^>]*)>([\\s\\S]*?)</(?:\\w+:)?' + r + ">", a || "");
  };
})(), Jc = /* @__PURE__ */ (function() {
  var e = [
    ["nbsp", " "],
    ["middot", "·"],
    ["quot", '"'],
    ["apos", "'"],
    ["gt", ">"],
    ["lt", "<"],
    ["amp", "&"]
  ].map(function(t) {
    return [new RegExp("&" + t[0] + ";", "ig"), t[1]];
  });
  return function(r) {
    for (var a = r.replace(/^[\t\n\r ]+/, "").replace(/[\t\n\r ]+$/, "").replace(/>\s+/g, ">").replace(/\s+</g, "<").replace(/[\t\n\r ]+/g, " ").replace(/<\s*[bB][rR]\s*\/?>/g, `
`).replace(/<[^>]*>/g, ""), n = 0; n < e.length; ++n) a = a.replace(e[n][0], e[n][1]);
    return a;
  };
})(), wu = /* @__PURE__ */ (function() {
  var e = {};
  return function(r) {
    return e[r] !== void 0 ? e[r] : e[r] = new RegExp("<(?:vt:)?" + r + ">([\\s\\S]*?)</(?:vt:)?" + r + ">", "g");
  };
})(), yu = /<\/?(?:vt:)?variant>/g, Su = /<(?:vt:)([^>]*)>([\s\S]*)</;
function F0(e, t) {
  var r = ge(e), a = e.match(wu(r.baseType)) || [], n = [];
  if (a.length != r.size) {
    if (t.WTF) throw new Error("unexpected vector length " + a.length + " != " + r.size);
    return n;
  }
  return a.forEach(function(i) {
    var s = i.replace(yu, "").match(Su);
    s && n.push({ v: Me(s[2]), t: s[1] });
  }), n;
}
var Zc = /(^\s|\s$|\n)/;
function xr(e, t) {
  return "<" + e + (t.match(Zc) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e + ">";
}
function $a(e) {
  return $e(e).map(function(t) {
    return " " + t + '="' + e[t] + '"';
  }).join("");
}
function ne(e, t, r) {
  return "<" + e + (r != null ? $a(r) : "") + (t != null ? (t.match(Zc) ? ' xml:space="preserve"' : "") + ">" + t + "</" + e : "/") + ">";
}
function Li(e, t) {
  try {
    return e.toISOString().replace(/\.\d*/, "");
  } catch (r) {
    if (t) throw r;
  }
  return "";
}
function ku(e, t) {
  switch (typeof e) {
    case "string":
      var r = ne("vt:lpwstr", Pe(e));
      return r = r.replace(/&quot;/g, "_x0022_"), r;
    case "number":
      return ne((e | 0) == e ? "vt:i4" : "vt:r8", Pe(String(e)));
    case "boolean":
      return ne("vt:bool", e ? "true" : "false");
  }
  if (e instanceof Date) return ne("vt:filetime", Li(e));
  throw new Error("Unable to serialize " + e);
}
function es(e) {
  if (ye && /*::typeof Buffer !== "undefined" && d != null && d instanceof Buffer &&*/
  Buffer.isBuffer(e)) return e.toString("utf8");
  if (typeof e == "string") return e;
  if (typeof Uint8Array < "u" && e instanceof Uint8Array) return Me(Dt(Yi(e)));
  throw new Error("Bad input format: expected Buffer or string");
}
var Ja = /<(\/?)([^\s?><!\/:]*:|)([^\s?<>:\/]+)(?:[\s?:\/][^>]*)?>/mg, ir = {
  CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/metadata/core-properties",
  CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/custom-properties",
  EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/extended-properties",
  CT: "http://schemas.openxmlformats.org/package/2006/content-types",
  RELS: "http://schemas.openxmlformats.org/package/2006/relationships",
  TCMNT: "http://schemas.microsoft.com/office/spreadsheetml/2018/threadedcomments",
  dc: "http://purl.org/dc/elements/1.1/",
  dcterms: "http://purl.org/dc/terms/",
  dcmitype: "http://purl.org/dc/dcmitype/",
  r: "http://schemas.openxmlformats.org/officeDocument/2006/relationships",
  vt: "http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes",
  xsi: "http://www.w3.org/2001/XMLSchema-instance",
  xsd: "http://www.w3.org/2001/XMLSchema"
}, ea = [
  "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
  "http://purl.oclc.org/ooxml/spreadsheetml/main",
  "http://schemas.microsoft.com/office/excel/2006/main",
  "http://schemas.microsoft.com/office/excel/2006/2"
], Rr = {
  o: "urn:schemas-microsoft-com:office:office",
  x: "urn:schemas-microsoft-com:office:excel",
  ss: "urn:schemas-microsoft-com:office:spreadsheet",
  dt: "uuid:C2F41010-65B3-11d1-A29F-00AA00C14882",
  mv: "http://macVmlSchemaUri",
  v: "urn:schemas-microsoft-com:vml",
  html: "http://www.w3.org/TR/REC-html40"
};
function Fu(e, t) {
  for (var r = 1 - 2 * (e[t + 7] >>> 7), a = ((e[t + 7] & 127) << 4) + (e[t + 6] >>> 4 & 15), n = e[t + 6] & 15, i = 5; i >= 0; --i) n = n * 256 + e[t + i];
  return a == 2047 ? n == 0 ? r * (1 / 0) : NaN : (a == 0 ? a = -1022 : (a -= 1023, n += Math.pow(2, 52)), r * Math.pow(2, a - 52) * n);
}
function Au(e, t, r) {
  var a = (t < 0 || 1 / t == -1 / 0 ? 1 : 0) << 7, n = 0, i = 0, s = a ? -t : t;
  isFinite(s) ? s == 0 ? n = i = 0 : (n = Math.floor(Math.log(s) / Math.LN2), i = s * Math.pow(2, 52 - n), n <= -1023 && (!isFinite(i) || i < Math.pow(2, 52)) ? n = -1022 : (i -= Math.pow(2, 52), n += 1023)) : (n = 2047, i = isNaN(t) ? 26985 : 0);
  for (var c = 0; c <= 5; ++c, i /= 256) e[r + c] = i & 255;
  e[r + 6] = (n & 15) << 4 | i & 15, e[r + 7] = n >> 4 | a;
}
var A0 = function(e) {
  for (var t = [], r = 10240, a = 0; a < e[0].length; ++a) if (e[0][a]) for (var n = 0, i = e[0][a].length; n < i; n += r) t.push.apply(t, e[0][a].slice(n, n + r));
  return t;
}, N0 = ye ? function(e) {
  return e[0].length > 0 && Buffer.isBuffer(e[0][0]) ? Buffer.concat(e[0].map(function(t) {
    return Buffer.isBuffer(t) ? t : _t(t);
  })) : A0(e);
} : A0, C0 = function(e, t, r) {
  for (var a = [], n = t; n < r; n += 2) a.push(String.fromCharCode(mt(e, n)));
  return a.join("").replace(Tr, "");
}, Kn = ye ? function(e, t, r) {
  return Buffer.isBuffer(e) ? e.toString("utf16le", t, r).replace(Tr, "") : C0(e, t, r);
} : C0, O0 = function(e, t, r) {
  for (var a = [], n = t; n < t + r; ++n) a.push(("0" + e[n].toString(16)).slice(-2));
  return a.join("");
}, Qc = ye ? function(e, t, r) {
  return Buffer.isBuffer(e) ? e.toString("hex", t, t + r) : O0(e, t, r);
} : O0, I0 = function(e, t, r) {
  for (var a = [], n = t; n < r; n++) a.push(String.fromCharCode(fa(e, n)));
  return a.join("");
}, _a = ye ? function(t, r, a) {
  return Buffer.isBuffer(t) ? t.toString("utf8", r, a) : I0(t, r, a);
} : I0, eo = function(e, t) {
  var r = or(e, t);
  return r > 0 ? _a(e, t + 4, t + 4 + r - 1) : "";
}, rs = eo, ro = function(e, t) {
  var r = or(e, t);
  return r > 0 ? _a(e, t + 4, t + 4 + r - 1) : "";
}, ts = ro, to = function(e, t) {
  var r = 2 * or(e, t);
  return r > 0 ? _a(e, t + 4, t + 4 + r - 1) : "";
}, as = to, ao = function(t, r) {
  var a = or(t, r);
  return a > 0 ? Kn(t, r + 4, r + 4 + a) : "";
}, ns = ao, no = function(e, t) {
  var r = or(e, t);
  return r > 0 ? _a(e, t + 4, t + 4 + r) : "";
}, is = no, io = function(e, t) {
  return Fu(e, t);
}, Dn = io, ss = function(t) {
  return Array.isArray(t) || typeof Uint8Array < "u" && t instanceof Uint8Array;
};
ye && (rs = function(t, r) {
  if (!Buffer.isBuffer(t)) return eo(t, r);
  var a = t.readUInt32LE(r);
  return a > 0 ? t.toString("utf8", r + 4, r + 4 + a - 1) : "";
}, ts = function(t, r) {
  if (!Buffer.isBuffer(t)) return ro(t, r);
  var a = t.readUInt32LE(r);
  return a > 0 ? t.toString("utf8", r + 4, r + 4 + a - 1) : "";
}, as = function(t, r) {
  if (!Buffer.isBuffer(t)) return to(t, r);
  var a = 2 * t.readUInt32LE(r);
  return t.toString("utf16le", r + 4, r + 4 + a - 1);
}, ns = function(t, r) {
  if (!Buffer.isBuffer(t)) return ao(t, r);
  var a = t.readUInt32LE(r);
  return t.toString("utf16le", r + 4, r + 4 + a);
}, is = function(t, r) {
  if (!Buffer.isBuffer(t)) return no(t, r);
  var a = t.readUInt32LE(r);
  return t.toString("utf8", r + 4, r + 4 + a);
}, Dn = function(t, r) {
  return Buffer.isBuffer(t) ? t.readDoubleLE(r) : io(t, r);
}, ss = function(t) {
  return Buffer.isBuffer(t) || Array.isArray(t) || typeof Uint8Array < "u" && t instanceof Uint8Array;
});
function so() {
  Kn = function(e, t, r) {
    return Ce.utils.decode(1200, e.slice(t, r)).replace(Tr, "");
  }, _a = function(e, t, r) {
    return Ce.utils.decode(65001, e.slice(t, r));
  }, rs = function(e, t) {
    var r = or(e, t);
    return r > 0 ? Ce.utils.decode(zt, e.slice(t + 4, t + 4 + r - 1)) : "";
  }, ts = function(e, t) {
    var r = or(e, t);
    return r > 0 ? Ce.utils.decode(Pr, e.slice(t + 4, t + 4 + r - 1)) : "";
  }, as = function(e, t) {
    var r = 2 * or(e, t);
    return r > 0 ? Ce.utils.decode(1200, e.slice(t + 4, t + 4 + r - 1)) : "";
  }, ns = function(e, t) {
    var r = or(e, t);
    return r > 0 ? Ce.utils.decode(1200, e.slice(t + 4, t + 4 + r)) : "";
  }, is = function(e, t) {
    var r = or(e, t);
    return r > 0 ? Ce.utils.decode(65001, e.slice(t + 4, t + 4 + r)) : "";
  };
}
typeof Ce < "u" && so();
var fa = function(e, t) {
  return e[t];
}, mt = function(e, t) {
  return e[t + 1] * 256 + e[t];
}, Nu = function(e, t) {
  var r = e[t + 1] * 256 + e[t];
  return r < 32768 ? r : (65535 - r + 1) * -1;
}, or = function(e, t) {
  return e[t + 3] * (1 << 24) + (e[t + 2] << 16) + (e[t + 1] << 8) + e[t];
}, Ut = function(e, t) {
  return e[t + 3] << 24 | e[t + 2] << 16 | e[t + 1] << 8 | e[t];
}, Cu = function(e, t) {
  return e[t] << 24 | e[t + 1] << 16 | e[t + 2] << 8 | e[t + 3];
};
function Ba(e, t) {
  var r = "", a, n, i = [], s, c, o, l;
  switch (t) {
    case "dbcs":
      if (l = this.l, ye && Buffer.isBuffer(this)) r = this.slice(this.l, this.l + 2 * e).toString("utf16le");
      else for (o = 0; o < e; ++o)
        r += String.fromCharCode(mt(this, l)), l += 2;
      e *= 2;
      break;
    case "utf8":
      r = _a(this, this.l, this.l + e);
      break;
    case "utf16le":
      e *= 2, r = Kn(this, this.l, this.l + e);
      break;
    case "wstr":
      if (typeof Ce < "u") r = Ce.utils.decode(Pr, this.slice(this.l, this.l + 2 * e));
      else return Ba.call(this, e, "dbcs");
      e = 2 * e;
      break;
    /* [MS-OLEDS] 2.1.4 LengthPrefixedAnsiString */
    case "lpstr-ansi":
      r = rs(this, this.l), e = 4 + or(this, this.l);
      break;
    case "lpstr-cp":
      r = ts(this, this.l), e = 4 + or(this, this.l);
      break;
    /* [MS-OLEDS] 2.1.5 LengthPrefixedUnicodeString */
    case "lpwstr":
      r = as(this, this.l), e = 4 + 2 * or(this, this.l);
      break;
    /* [MS-OFFCRYPTO] 2.1.2 Length-Prefixed Padded Unicode String (UNICODE-LP-P4) */
    case "lpp4":
      e = 4 + or(this, this.l), r = ns(this, this.l), e & 2 && (e += 2);
      break;
    /* [MS-OFFCRYPTO] 2.1.3 Length-Prefixed UTF-8 String (UTF-8-LP-P4) */
    case "8lpp4":
      e = 4 + or(this, this.l), r = is(this, this.l), e & 3 && (e += 4 - (e & 3));
      break;
    case "cstr":
      for (e = 0, r = ""; (s = fa(this, this.l + e++)) !== 0; ) i.push(ba(s));
      r = i.join("");
      break;
    case "_wstr":
      for (e = 0, r = ""; (s = mt(this, this.l + e)) !== 0; )
        i.push(ba(s)), e += 2;
      e += 2, r = i.join("");
      break;
    /* sbcs and dbcs support continue records in the SST way TODO codepages */
    case "dbcs-cont":
      for (r = "", l = this.l, o = 0; o < e; ++o) {
        if (this.lens && this.lens.indexOf(l) !== -1)
          return s = fa(this, l), this.l = l + 1, c = Ba.call(this, e - o, s ? "dbcs-cont" : "sbcs-cont"), i.join("") + c;
        i.push(ba(mt(this, l))), l += 2;
      }
      r = i.join(""), e *= 2;
      break;
    case "cpstr":
      if (typeof Ce < "u") {
        r = Ce.utils.decode(Pr, this.slice(this.l, this.l + e));
        break;
      }
    /* falls through */
    case "sbcs-cont":
      for (r = "", l = this.l, o = 0; o != e; ++o) {
        if (this.lens && this.lens.indexOf(l) !== -1)
          return s = fa(this, l), this.l = l + 1, c = Ba.call(this, e - o, s ? "dbcs-cont" : "sbcs-cont"), i.join("") + c;
        i.push(ba(fa(this, l))), l += 1;
      }
      r = i.join("");
      break;
    default:
      switch (e) {
        case 1:
          return a = fa(this, this.l), this.l++, a;
        case 2:
          return a = (t === "i" ? Nu : mt)(this, this.l), this.l += 2, a;
        case 4:
        case -4:
          return t === "i" || (this[this.l + 3] & 128) === 0 ? (a = (e > 0 ? Ut : Cu)(this, this.l), this.l += 4, a) : (n = or(this, this.l), this.l += 4, n);
        case 8:
        case -8:
          if (t === "f")
            return e == 8 ? n = Dn(this, this.l) : n = Dn([this[this.l + 7], this[this.l + 6], this[this.l + 5], this[this.l + 4], this[this.l + 3], this[this.l + 2], this[this.l + 1], this[this.l + 0]], 0), this.l += 8, n;
          e = 8;
        /* falls through */
        case 16:
          r = Qc(this, this.l, e);
          break;
      }
  }
  return this.l += e, r;
}
var Ou = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >>> 8 & 255, e[r + 2] = t >>> 16 & 255, e[r + 3] = t >>> 24 & 255;
}, Iu = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >> 8 & 255, e[r + 2] = t >> 16 & 255, e[r + 3] = t >> 24 & 255;
}, Lu = function(e, t, r) {
  e[r] = t & 255, e[r + 1] = t >>> 8 & 255;
};
function Ru(e, t, r) {
  var a = 0, n = 0;
  if (r === "dbcs") {
    for (n = 0; n != t.length; ++n) Lu(this, t.charCodeAt(n), this.l + 2 * n);
    a = 2 * t.length;
  } else if (r === "sbcs") {
    if (typeof Ce < "u" && zt == 874)
      for (n = 0; n != t.length; ++n) {
        var i = Ce.utils.encode(zt, t.charAt(n));
        this[this.l + n] = i[0];
      }
    else
      for (t = t.replace(/[^\x00-\x7F]/g, "_"), n = 0; n != t.length; ++n) this[this.l + n] = t.charCodeAt(n) & 255;
    a = t.length;
  } else if (r === "hex") {
    for (; n < e; ++n)
      this[this.l++] = parseInt(t.slice(2 * n, 2 * n + 2), 16) || 0;
    return this;
  } else if (r === "utf16le") {
    var s = Math.min(this.l + e, this.length);
    for (n = 0; n < Math.min(t.length, e); ++n) {
      var c = t.charCodeAt(n);
      this[this.l++] = c & 255, this[this.l++] = c >> 8;
    }
    for (; this.l < s; ) this[this.l++] = 0;
    return this;
  } else switch (e) {
    case 1:
      a = 1, this[this.l] = t & 255;
      break;
    case 2:
      a = 2, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255;
      break;
    case 3:
      a = 3, this[this.l] = t & 255, t >>>= 8, this[this.l + 1] = t & 255, t >>>= 8, this[this.l + 2] = t & 255;
      break;
    case 4:
      a = 4, Ou(this, t, this.l);
      break;
    case 8:
      if (a = 8, r === "f") {
        Au(this, t, this.l);
        break;
      }
    /* falls through */
    case 16:
      break;
    case -4:
      a = 4, Iu(this, t, this.l);
      break;
  }
  return this.l += a, this;
}
function co(e, t) {
  var r = Qc(this, this.l, e.length >> 1);
  if (r !== e) throw new Error(t + "Expected " + e + " saw " + r);
  this.l += e.length >> 1;
}
function dr(e, t) {
  e.l = t, e.read_shift = /*::(*/
  Ba, e.chk = co, e.write_shift = Ru;
}
function yr(e, t) {
  e.l += t;
}
function z(e) {
  var t = Ot(e);
  return dr(t, 0), t;
}
function Tt(e, t, r) {
  if (e) {
    var a, n, i;
    dr(e, e.l || 0);
    for (var s = e.length, c = 0, o = 0; e.l < s; ) {
      c = e.read_shift(1), c & 128 && (c = (c & 127) + ((e.read_shift(1) & 127) << 7));
      var l = an[c] || an[65535];
      for (a = e.read_shift(1), i = a & 127, n = 1; n < 4 && a & 128; ++n) i += ((a = e.read_shift(1)) & 127) << 7 * n;
      o = e.l + i;
      var f = l.f && l.f(e, i, r);
      if (e.l = o, t(f, l, c)) return;
    }
  }
}
function Ir() {
  var e = [], t = ye ? 256 : 2048, r = function(l) {
    var f = z(l);
    return dr(f, 0), f;
  }, a = r(t), n = function() {
    a && (a.length > a.l && (a = a.slice(0, a.l), a.l = a.length), a.length > 0 && e.push(a), a = null);
  }, i = function(l) {
    return a && l < a.length - a.l ? a : (n(), a = r(Math.max(l + 1, t)));
  }, s = function() {
    return n(), fr(e);
  }, c = function(l) {
    n(), a = l, a.l == null && (a.l = a.length), i(t);
  };
  return { next: i, push: c, end: s, _bufs: e };
}
function q(e, t, r, a) {
  var n = +t, i;
  if (!isNaN(n)) {
    a || (a = an[n].p || (r || []).length || 0), i = 1 + (n >= 128 ? 1 : 0) + 1, a >= 128 && ++i, a >= 16384 && ++i, a >= 2097152 && ++i;
    var s = e.next(i);
    n <= 127 ? s.write_shift(1, n) : (s.write_shift(1, (n & 127) + 128), s.write_shift(1, n >> 7));
    for (var c = 0; c != 4; ++c)
      if (a >= 128)
        s.write_shift(1, (a & 127) + 128), a >>= 7;
      else {
        s.write_shift(1, a);
        break;
      }
    /*:: length != null &&*/
    a > 0 && ss(r) && e.push(r);
  }
}
function Ua(e, t, r) {
  var a = Ue(e);
  if (t.s ? (a.cRel && (a.c += t.s.c), a.rRel && (a.r += t.s.r)) : (a.cRel && (a.c += t.c), a.rRel && (a.r += t.r)), !r || r.biff < 12) {
    for (; a.c >= 256; ) a.c -= 256;
    for (; a.r >= 65536; ) a.r -= 65536;
  }
  return a;
}
function L0(e, t, r) {
  var a = Ue(e);
  return a.s = Ua(a.s, t.s, r), a.e = Ua(a.e, t.s, r), a;
}
function Xa(e, t) {
  if (e.cRel && e.c < 0)
    for (e = Ue(e); e.c < 0; ) e.c += t > 8 ? 16384 : 256;
  if (e.rRel && e.r < 0)
    for (e = Ue(e); e.r < 0; ) e.r += t > 8 ? 1048576 : t > 5 ? 65536 : 16384;
  var r = me(e);
  return !e.cRel && e.cRel != null && (r = Pu(r)), !e.rRel && e.rRel != null && (r = Du(r)), r;
}
function vi(e, t) {
  return e.s.r == 0 && !e.s.rRel && e.e.r == (t.biff >= 12 ? 1048575 : t.biff >= 8 ? 65536 : 16384) && !e.e.rRel ? (e.s.cRel ? "" : "$") + He(e.s.c) + ":" + (e.e.cRel ? "" : "$") + He(e.e.c) : e.s.c == 0 && !e.s.cRel && e.e.c == (t.biff >= 12 ? 16383 : 255) && !e.e.cRel ? (e.s.rRel ? "" : "$") + Ke(e.s.r) + ":" + (e.e.rRel ? "" : "$") + Ke(e.e.r) : Xa(e.s, t.biff) + ":" + Xa(e.e, t.biff);
}
function cs(e) {
  return parseInt(bu(e), 10) - 1;
}
function Ke(e) {
  return "" + (e + 1);
}
function Du(e) {
  return e.replace(/([A-Z]|^)(\d+)$/, "$1$$$2");
}
function bu(e) {
  return e.replace(/\$(\d+)$/, "$1");
}
function os(e) {
  for (var t = Mu(e), r = 0, a = 0; a !== t.length; ++a) r = 26 * r + t.charCodeAt(a) - 64;
  return r - 1;
}
function He(e) {
  if (e < 0) throw new Error("invalid column " + e);
  var t = "";
  for (++e; e; e = Math.floor((e - 1) / 26)) t = String.fromCharCode((e - 1) % 26 + 65) + t;
  return t;
}
function Pu(e) {
  return e.replace(/^([A-Z])/, "$$$1");
}
function Mu(e) {
  return e.replace(/^\$([A-Z])/, "$1");
}
function Bu(e) {
  return e.replace(/(\$?[A-Z]*)(\$?\d*)/, "$1,$2").split(",");
}
function Ye(e) {
  for (var t = 0, r = 0, a = 0; a < e.length; ++a) {
    var n = e.charCodeAt(a);
    n >= 48 && n <= 57 ? t = 10 * t + (n - 48) : n >= 65 && n <= 90 && (r = 26 * r + (n - 64));
  }
  return { c: r - 1, r: t - 1 };
}
function me(e) {
  for (var t = e.c + 1, r = ""; t; t = (t - 1) / 26 | 0) r = String.fromCharCode((t - 1) % 26 + 65) + r;
  return r + (e.r + 1);
}
function Cr(e) {
  var t = e.indexOf(":");
  return t == -1 ? { s: Ye(e), e: Ye(e) } : { s: Ye(e.slice(0, t)), e: Ye(e.slice(t + 1)) };
}
function _e(e, t) {
  return typeof t > "u" || typeof t == "number" ? _e(e.s, e.e) : (typeof e != "string" && (e = me(e)), typeof t != "string" && (t = me(t)), e == t ? e : e + ":" + t);
}
function Ae(e) {
  var t = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } }, r = 0, a = 0, n = 0, i = e.length;
  for (r = 0; a < i && !((n = e.charCodeAt(a) - 64) < 1 || n > 26); ++a)
    r = 26 * r + n;
  for (t.s.c = --r, r = 0; a < i && !((n = e.charCodeAt(a) - 48) < 0 || n > 9); ++a)
    r = 10 * r + n;
  if (t.s.r = --r, a === i || n != 10)
    return t.e.c = t.s.c, t.e.r = t.s.r, t;
  for (++a, r = 0; a != i && !((n = e.charCodeAt(a) - 64) < 1 || n > 26); ++a)
    r = 26 * r + n;
  for (t.e.c = --r, r = 0; a != i && !((n = e.charCodeAt(a) - 48) < 0 || n > 9); ++a)
    r = 10 * r + n;
  return t.e.r = --r, t;
}
function R0(e, t) {
  var r = e.t == "d" && t instanceof Date;
  if (e.z != null) try {
    return e.w = Br(e.z, r ? sr(t) : t);
  } catch {
  }
  try {
    return e.w = Br((e.XF || {}).numFmtId || (r ? 14 : 0), r ? sr(t) : t);
  } catch {
    return "" + t;
  }
}
function ft(e, t, r) {
  return e == null || e.t == null || e.t == "z" ? "" : e.w !== void 0 ? e.w : (e.t == "d" && !e.z && r && r.dateNF && (e.z = r.dateNF), e.t == "e" ? wt[e.v] || e.v : t == null ? R0(e, e.v) : R0(e, t));
}
function bt(e, t) {
  var r = t && t.sheet ? t.sheet : "Sheet1", a = {};
  return a[r] = e, { SheetNames: [r], Sheets: a };
}
function oo(e, t, r) {
  var a = r || {}, n = e ? Array.isArray(e) : a.dense, i = e || (n ? [] : {}), s = 0, c = 0;
  if (i && a.origin != null) {
    if (typeof a.origin == "number") s = a.origin;
    else {
      var o = typeof a.origin == "string" ? Ye(a.origin) : a.origin;
      s = o.r, c = o.c;
    }
    i["!ref"] || (i["!ref"] = "A1:A1");
  }
  var l = { s: { c: 1e7, r: 1e7 }, e: { c: 0, r: 0 } };
  if (i["!ref"]) {
    var f = Ae(i["!ref"]);
    l.s.c = f.s.c, l.s.r = f.s.r, l.e.c = Math.max(l.e.c, f.e.c), l.e.r = Math.max(l.e.r, f.e.r), s == -1 && (l.e.r = s = f.e.r + 1);
  }
  for (var d = 0; d != t.length; ++d)
    if (t[d]) {
      if (!Array.isArray(t[d])) throw new Error("aoa_to_sheet expects an array of arrays");
      for (var h = 0; h != t[d].length; ++h)
        if (!(typeof t[d][h] > "u")) {
          var p = { v: t[d][h] }, m = s + d, x = c + h;
          if (l.s.r > m && (l.s.r = m), l.s.c > x && (l.s.c = x), l.e.r < m && (l.e.r = m), l.e.c < x && (l.e.c = x), t[d][h] && typeof t[d][h] == "object" && !Array.isArray(t[d][h]) && !(t[d][h] instanceof Date)) p = t[d][h];
          else if (Array.isArray(p.v) && (p.f = t[d][h][1], p.v = p.v[0]), p.v === null)
            if (p.f) p.t = "n";
            else if (a.nullError)
              p.t = "e", p.v = 0;
            else if (a.sheetStubs) p.t = "z";
            else continue;
          else typeof p.v == "number" ? p.t = "n" : typeof p.v == "boolean" ? p.t = "b" : p.v instanceof Date ? (p.z = a.dateNF || pe[14], a.cellDates ? (p.t = "d", p.w = Br(p.z, sr(p.v))) : (p.t = "n", p.v = sr(p.v), p.w = Br(p.z, p.v))) : p.t = "s";
          if (n)
            i[m] || (i[m] = []), i[m][x] && i[m][x].z && (p.z = i[m][x].z), i[m][x] = p;
          else {
            var u = me({ c: x, r: m });
            i[u] && i[u].z && (p.z = i[u].z), i[u] = p;
          }
        }
    }
  return l.s.c < 1e7 && (i["!ref"] = _e(l)), i;
}
function Ta(e, t) {
  return oo(null, e, t);
}
function Uu(e) {
  return e.read_shift(4, "i");
}
function rt(e, t) {
  return t || (t = z(4)), t.write_shift(4, e), t;
}
function wr(e) {
  var t = e.read_shift(4);
  return t === 0 ? "" : e.read_shift(t, "dbcs");
}
function lr(e, t) {
  var r = !1;
  return t == null && (r = !0, t = z(4 + 2 * e.length)), t.write_shift(4, e.length), e.length > 0 && t.write_shift(0, e, "dbcs"), r ? t.slice(0, t.l) : t;
}
function Xu(e) {
  return { ich: e.read_shift(2), ifnt: e.read_shift(2) };
}
function Wu(e, t) {
  return t || (t = z(4)), t.write_shift(2, 0), t.write_shift(2, 0), t;
}
function fs(e, t) {
  var r = e.l, a = e.read_shift(1), n = wr(e), i = [], s = { t: n, h: n };
  if ((a & 1) !== 0) {
    for (var c = e.read_shift(4), o = 0; o != c; ++o) i.push(Xu(e));
    s.r = i;
  } else s.r = [{ ich: 0, ifnt: 0 }];
  return e.l = r + t, s;
}
function Hu(e, t) {
  var r = !1;
  return t == null && (r = !0, t = z(15 + 4 * e.t.length)), t.write_shift(1, 0), lr(e.t, t), r ? t.slice(0, t.l) : t;
}
var Gu = fs;
function Vu(e, t) {
  var r = !1;
  return t == null && (r = !0, t = z(23 + 4 * e.t.length)), t.write_shift(1, 1), lr(e.t, t), t.write_shift(4, 1), Wu({}, t), r ? t.slice(0, t.l) : t;
}
function qr(e) {
  var t = e.read_shift(4), r = e.read_shift(2);
  return r += e.read_shift(1) << 16, e.l++, { c: t, iStyleRef: r };
}
function ra(e, t) {
  return t == null && (t = z(8)), t.write_shift(-4, e.c), t.write_shift(3, e.iStyleRef || e.s), t.write_shift(1, 0), t;
}
function ta(e) {
  var t = e.read_shift(2);
  return t += e.read_shift(1) << 16, e.l++, { c: -1, iStyleRef: t };
}
function aa(e, t) {
  return t == null && (t = z(4)), t.write_shift(3, e.iStyleRef || e.s), t.write_shift(1, 0), t;
}
var zu = wr, fo = lr;
function ls(e) {
  var t = e.read_shift(4);
  return t === 0 || t === 4294967295 ? "" : e.read_shift(t, "dbcs");
}
function bn(e, t) {
  var r = !1;
  return t == null && (r = !0, t = z(127)), t.write_shift(4, e.length > 0 ? e.length : 4294967295), e.length > 0 && t.write_shift(0, e, "dbcs"), r ? t.slice(0, t.l) : t;
}
var Yu = wr, Ri = ls, us = bn;
function hs(e) {
  var t = e.slice(e.l, e.l + 4), r = t[0] & 1, a = t[0] & 2;
  e.l += 4;
  var n = a === 0 ? Dn([0, 0, 0, 0, t[0] & 252, t[1], t[2], t[3]], 0) : Ut(t, 0) >> 2;
  return r ? n / 100 : n;
}
function lo(e, t) {
  t == null && (t = z(4));
  var r = 0, a = 0, n = e * 100;
  if (e == (e | 0) && e >= -536870912 && e < 1 << 29 ? a = 1 : n == (n | 0) && n >= -536870912 && n < 1 << 29 && (a = 1, r = 1), a) t.write_shift(-4, ((r ? n : e) << 2) + (r + 2));
  else throw new Error("unsupported RkNumber " + e);
}
function uo(e) {
  var t = { s: {}, e: {} };
  return t.s.r = e.read_shift(4), t.e.r = e.read_shift(4), t.s.c = e.read_shift(4), t.e.c = e.read_shift(4), t;
}
function ju(e, t) {
  return t || (t = z(16)), t.write_shift(4, e.s.r), t.write_shift(4, e.e.r), t.write_shift(4, e.s.c), t.write_shift(4, e.e.c), t;
}
var na = uo, wa = ju;
function _r(e) {
  if (e.length - e.l < 8) throw "XLS Xnum Buffer underflow";
  return e.read_shift(8, "f");
}
function Kt(e, t) {
  return (t || z(8)).write_shift(8, e, "f");
}
function Ku(e) {
  var t = {}, r = e.read_shift(1), a = r >>> 1, n = e.read_shift(1), i = e.read_shift(2, "i"), s = e.read_shift(1), c = e.read_shift(1), o = e.read_shift(1);
  switch (e.l++, a) {
    case 0:
      t.auto = 1;
      break;
    case 1:
      t.index = n;
      var l = Wt[n];
      l && (t.rgb = Qa(l));
      break;
    case 2:
      t.rgb = Qa([s, c, o]);
      break;
    case 3:
      t.theme = n;
      break;
  }
  return i != 0 && (t.tint = i > 0 ? i / 32767 : i / 32768), t;
}
function Pn(e, t) {
  if (t || (t = z(8)), !e || e.auto)
    return t.write_shift(4, 0), t.write_shift(4, 0), t;
  e.index != null ? (t.write_shift(1, 2), t.write_shift(1, e.index)) : e.theme != null ? (t.write_shift(1, 6), t.write_shift(1, e.theme)) : (t.write_shift(1, 5), t.write_shift(1, 0));
  var r = e.tint || 0;
  if (r > 0 ? r *= 32767 : r < 0 && (r *= 32768), t.write_shift(2, r), !e.rgb || e.theme != null)
    t.write_shift(2, 0), t.write_shift(1, 0), t.write_shift(1, 0);
  else {
    var a = e.rgb || "FFFFFF";
    typeof a == "number" && (a = ("000000" + a.toString(16)).slice(-6)), t.write_shift(1, parseInt(a.slice(0, 2), 16)), t.write_shift(1, parseInt(a.slice(2, 4), 16)), t.write_shift(1, parseInt(a.slice(4, 6), 16)), t.write_shift(1, 255);
  }
  return t;
}
function qu(e) {
  var t = e.read_shift(1);
  e.l++;
  var r = {
    fBold: t & 1,
    fItalic: t & 2,
    fUnderline: t & 4,
    fStrikeout: t & 8,
    fOutline: t & 16,
    fShadow: t & 32,
    fCondense: t & 64,
    fExtend: t & 128
  };
  return r;
}
function $u(e, t) {
  t || (t = z(2));
  var r = (e.italic ? 2 : 0) | (e.strike ? 8 : 0) | (e.outline ? 16 : 0) | (e.shadow ? 32 : 0) | (e.condense ? 64 : 0) | (e.extend ? 128 : 0);
  return t.write_shift(1, r), t.write_shift(1, 0), t;
}
function ho(e, t) {
  var r = { 2: "BITMAP", 3: "METAFILEPICT", 8: "DIB", 14: "ENHMETAFILE" }, a = e.read_shift(4);
  switch (a) {
    case 0:
      return "";
    case 4294967295:
    case 4294967294:
      return r[e.read_shift(4)] || "";
  }
  if (a > 400) throw new Error("Unsupported Clipboard: " + a.toString(16));
  return e.l -= 4, e.read_shift(0, t == 1 ? "lpstr" : "lpwstr");
}
function Ju(e) {
  return ho(e, 1);
}
function Zu(e) {
  return ho(e, 2);
}
var ds = 2, Or = 3, _n = 11, D0 = 12, Mn = 19, Tn = 64, Qu = 65, eh = 71, rh = 4108, th = 4126, cr = 80, xo = 81, ah = [cr, xo], Di = {
  /*::[*/
  1: { n: "CodePage", t: ds },
  /*::[*/
  2: { n: "Category", t: cr },
  /*::[*/
  3: { n: "PresentationFormat", t: cr },
  /*::[*/
  4: { n: "ByteCount", t: Or },
  /*::[*/
  5: { n: "LineCount", t: Or },
  /*::[*/
  6: { n: "ParagraphCount", t: Or },
  /*::[*/
  7: { n: "SlideCount", t: Or },
  /*::[*/
  8: { n: "NoteCount", t: Or },
  /*::[*/
  9: { n: "HiddenCount", t: Or },
  /*::[*/
  10: { n: "MultimediaClipCount", t: Or },
  /*::[*/
  11: { n: "ScaleCrop", t: _n },
  /*::[*/
  12: {
    n: "HeadingPairs",
    t: rh
    /* VT_VECTOR | VT_VARIANT */
  },
  /*::[*/
  13: {
    n: "TitlesOfParts",
    t: th
    /* VT_VECTOR | VT_LPSTR */
  },
  /*::[*/
  14: { n: "Manager", t: cr },
  /*::[*/
  15: { n: "Company", t: cr },
  /*::[*/
  16: { n: "LinksUpToDate", t: _n },
  /*::[*/
  17: { n: "CharacterCount", t: Or },
  /*::[*/
  19: { n: "SharedDoc", t: _n },
  /*::[*/
  22: { n: "HyperlinksChanged", t: _n },
  /*::[*/
  23: { n: "AppVersion", t: Or, p: "version" },
  /*::[*/
  24: { n: "DigSig", t: Qu },
  /*::[*/
  26: { n: "ContentType", t: cr },
  /*::[*/
  27: { n: "ContentStatus", t: cr },
  /*::[*/
  28: { n: "Language", t: cr },
  /*::[*/
  29: { n: "Version", t: cr },
  /*::[*/
  255: {},
  /* [MS-OLEPS] 2.18 */
  /*::[*/
  2147483648: { n: "Locale", t: Mn },
  /*::[*/
  2147483651: { n: "Behavior", t: Mn },
  /*::[*/
  1919054434: {}
}, bi = {
  /*::[*/
  1: { n: "CodePage", t: ds },
  /*::[*/
  2: { n: "Title", t: cr },
  /*::[*/
  3: { n: "Subject", t: cr },
  /*::[*/
  4: { n: "Author", t: cr },
  /*::[*/
  5: { n: "Keywords", t: cr },
  /*::[*/
  6: { n: "Comments", t: cr },
  /*::[*/
  7: { n: "Template", t: cr },
  /*::[*/
  8: { n: "LastAuthor", t: cr },
  /*::[*/
  9: { n: "RevNumber", t: cr },
  /*::[*/
  10: { n: "EditTime", t: Tn },
  /*::[*/
  11: { n: "LastPrinted", t: Tn },
  /*::[*/
  12: { n: "CreatedDate", t: Tn },
  /*::[*/
  13: { n: "ModifiedDate", t: Tn },
  /*::[*/
  14: { n: "PageCount", t: Or },
  /*::[*/
  15: { n: "WordCount", t: Or },
  /*::[*/
  16: { n: "CharCount", t: Or },
  /*::[*/
  17: { n: "Thumbnail", t: eh },
  /*::[*/
  18: { n: "Application", t: cr },
  /*::[*/
  19: { n: "DocSecurity", t: Or },
  /*::[*/
  255: {},
  /* [MS-OLEPS] 2.18 */
  /*::[*/
  2147483648: { n: "Locale", t: Mn },
  /*::[*/
  2147483651: { n: "Behavior", t: Mn },
  /*::[*/
  1919054434: {}
}, b0 = {
  /*::[*/
  1: "US",
  // United States
  /*::[*/
  2: "CA",
  // Canada
  /*::[*/
  3: "",
  // Latin America (except Brazil)
  /*::[*/
  7: "RU",
  // Russia
  /*::[*/
  20: "EG",
  // Egypt
  /*::[*/
  30: "GR",
  // Greece
  /*::[*/
  31: "NL",
  // Netherlands
  /*::[*/
  32: "BE",
  // Belgium
  /*::[*/
  33: "FR",
  // France
  /*::[*/
  34: "ES",
  // Spain
  /*::[*/
  36: "HU",
  // Hungary
  /*::[*/
  39: "IT",
  // Italy
  /*::[*/
  41: "CH",
  // Switzerland
  /*::[*/
  43: "AT",
  // Austria
  /*::[*/
  44: "GB",
  // United Kingdom
  /*::[*/
  45: "DK",
  // Denmark
  /*::[*/
  46: "SE",
  // Sweden
  /*::[*/
  47: "NO",
  // Norway
  /*::[*/
  48: "PL",
  // Poland
  /*::[*/
  49: "DE",
  // Germany
  /*::[*/
  52: "MX",
  // Mexico
  /*::[*/
  55: "BR",
  // Brazil
  /*::[*/
  61: "AU",
  // Australia
  /*::[*/
  64: "NZ",
  // New Zealand
  /*::[*/
  66: "TH",
  // Thailand
  /*::[*/
  81: "JP",
  // Japan
  /*::[*/
  82: "KR",
  // Korea
  /*::[*/
  84: "VN",
  // Viet Nam
  /*::[*/
  86: "CN",
  // China
  /*::[*/
  90: "TR",
  // Turkey
  /*::[*/
  105: "JS",
  // Ramastan
  /*::[*/
  213: "DZ",
  // Algeria
  /*::[*/
  216: "MA",
  // Morocco
  /*::[*/
  218: "LY",
  // Libya
  /*::[*/
  351: "PT",
  // Portugal
  /*::[*/
  354: "IS",
  // Iceland
  /*::[*/
  358: "FI",
  // Finland
  /*::[*/
  420: "CZ",
  // Czech Republic
  /*::[*/
  886: "TW",
  // Taiwan
  /*::[*/
  961: "LB",
  // Lebanon
  /*::[*/
  962: "JO",
  // Jordan
  /*::[*/
  963: "SY",
  // Syria
  /*::[*/
  964: "IQ",
  // Iraq
  /*::[*/
  965: "KW",
  // Kuwait
  /*::[*/
  966: "SA",
  // Saudi Arabia
  /*::[*/
  971: "AE",
  // United Arab Emirates
  /*::[*/
  972: "IL",
  // Israel
  /*::[*/
  974: "QA",
  // Qatar
  /*::[*/
  981: "IR",
  // Iran
  /*::[*/
  65535: "US"
  // United States
}, nh = [
  null,
  "solid",
  "mediumGray",
  "darkGray",
  "lightGray",
  "darkHorizontal",
  "darkVertical",
  "darkDown",
  "darkUp",
  "darkGrid",
  "darkTrellis",
  "lightHorizontal",
  "lightVertical",
  "lightDown",
  "lightUp",
  "lightGrid",
  "lightTrellis",
  "gray125",
  "gray0625"
];
function ih(e) {
  return e.map(function(t) {
    return [t >> 16 & 255, t >> 8 & 255, t & 255];
  });
}
var sh = /* @__PURE__ */ ih([
  /* Color Constants */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  /* Overridable Defaults */
  0,
  16777215,
  16711680,
  65280,
  255,
  16776960,
  16711935,
  65535,
  8388608,
  32768,
  128,
  8421376,
  8388736,
  32896,
  12632256,
  8421504,
  10066431,
  10040166,
  16777164,
  13434879,
  6684774,
  16744576,
  26316,
  13421823,
  128,
  16711935,
  16776960,
  65535,
  8388736,
  8388608,
  32896,
  255,
  52479,
  13434879,
  13434828,
  16777113,
  10079487,
  16751052,
  13408767,
  16764057,
  3368703,
  3394764,
  10079232,
  16763904,
  16750848,
  16737792,
  6710937,
  9868950,
  13158,
  3381606,
  13056,
  3355392,
  10040064,
  10040166,
  3355545,
  3355443,
  /* Other entries to appease BIFF8/12 */
  16777215,
  /* 0x40 icvForeground ?? */
  0,
  /* 0x41 icvBackground ?? */
  0,
  /* 0x42 icvFrame ?? */
  0,
  /* 0x43 icv3D ?? */
  0,
  /* 0x44 icv3DText ?? */
  0,
  /* 0x45 icv3DHilite ?? */
  0,
  /* 0x46 icv3DShadow ?? */
  0,
  /* 0x47 icvHilite ?? */
  0,
  /* 0x48 icvCtlText ?? */
  0,
  /* 0x49 icvCtlScrl ?? */
  0,
  /* 0x4A icvCtlInv ?? */
  0,
  /* 0x4B icvCtlBody ?? */
  0,
  /* 0x4C icvCtlFrame ?? */
  0,
  /* 0x4D icvCtlFore ?? */
  0,
  /* 0x4E icvCtlBack ?? */
  0,
  /* 0x4F icvCtlNeutral */
  0,
  /* 0x50 icvInfoBk ?? */
  0
  /* 0x51 icvInfoText ?? */
]), Wt = /* @__PURE__ */ Ue(sh), wt = {
  /*::[*/
  0: "#NULL!",
  /*::[*/
  7: "#DIV/0!",
  /*::[*/
  15: "#VALUE!",
  /*::[*/
  23: "#REF!",
  /*::[*/
  29: "#NAME?",
  /*::[*/
  36: "#NUM!",
  /*::[*/
  42: "#N/A",
  /*::[*/
  43: "#GETTING_DATA",
  /*::[*/
  255: "#WTF?"
}, po = {
  "#NULL!": 0,
  "#DIV/0!": 7,
  "#VALUE!": 15,
  "#REF!": 23,
  "#NAME?": 29,
  "#NUM!": 36,
  "#N/A": 42,
  "#GETTING_DATA": 43,
  "#WTF?": 255
}, Pi = {
  /* Workbook */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.macroEnabled.main+xml": "workbooks",
  "application/vnd.ms-excel.sheet.binary.macroEnabled.main": "workbooks",
  "application/vnd.ms-excel.addin.macroEnabled.main+xml": "workbooks",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml": "workbooks",
  /* Worksheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml": "sheets",
  "application/vnd.ms-excel.worksheet": "sheets",
  "application/vnd.ms-excel.binIndexWs": "TODO",
  /* Binary Index */
  /* Chartsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml": "charts",
  "application/vnd.ms-excel.chartsheet": "charts",
  /* Macrosheet */
  "application/vnd.ms-excel.macrosheet+xml": "macros",
  "application/vnd.ms-excel.macrosheet": "macros",
  "application/vnd.ms-excel.intlmacrosheet": "TODO",
  "application/vnd.ms-excel.binIndexMs": "TODO",
  /* Binary Index */
  /* Dialogsheet */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml": "dialogs",
  "application/vnd.ms-excel.dialogsheet": "dialogs",
  /* Shared Strings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml": "strs",
  "application/vnd.ms-excel.sharedStrings": "strs",
  /* Styles */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml": "styles",
  "application/vnd.ms-excel.styles": "styles",
  /* File Properties */
  "application/vnd.openxmlformats-package.core-properties+xml": "coreprops",
  "application/vnd.openxmlformats-officedocument.custom-properties+xml": "custprops",
  "application/vnd.openxmlformats-officedocument.extended-properties+xml": "extprops",
  /* Custom Data Properties */
  "application/vnd.openxmlformats-officedocument.customXmlProperties+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.customProperty": "TODO",
  /* Comments */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml": "comments",
  "application/vnd.ms-excel.comments": "comments",
  "application/vnd.ms-excel.threadedcomments+xml": "threadedcomments",
  "application/vnd.ms-excel.person+xml": "people",
  /* Metadata (Stock/Geography and Dynamic Array) */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml": "metadata",
  "application/vnd.ms-excel.sheetMetadata": "metadata",
  /* PivotTable */
  "application/vnd.ms-excel.pivotTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml": "TODO",
  /* Chart Objects */
  "application/vnd.openxmlformats-officedocument.drawingml.chart+xml": "TODO",
  /* Chart Colors */
  "application/vnd.ms-office.chartcolorstyle+xml": "TODO",
  /* Chart Style */
  "application/vnd.ms-office.chartstyle+xml": "TODO",
  /* Chart Advanced */
  "application/vnd.ms-office.chartex+xml": "TODO",
  /* Calculation Chain */
  "application/vnd.ms-excel.calcChain": "calcchains",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml": "calcchains",
  /* Printer Settings */
  "application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings": "TODO",
  /* ActiveX */
  "application/vnd.ms-office.activeX": "TODO",
  "application/vnd.ms-office.activeX+xml": "TODO",
  /* Custom Toolbars */
  "application/vnd.ms-excel.attachedToolbars": "TODO",
  /* External Data Connections */
  "application/vnd.ms-excel.connections": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml": "TODO",
  /* External Links */
  "application/vnd.ms-excel.externalLink": "links",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml": "links",
  /* PivotCache */
  "application/vnd.ms-excel.pivotCacheDefinition": "TODO",
  "application/vnd.ms-excel.pivotCacheRecords": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml": "TODO",
  /* Query Table */
  "application/vnd.ms-excel.queryTable": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml": "TODO",
  /* Shared Workbook */
  "application/vnd.ms-excel.userNames": "TODO",
  "application/vnd.ms-excel.revisionHeaders": "TODO",
  "application/vnd.ms-excel.revisionLog": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml": "TODO",
  /* Single Cell Table */
  "application/vnd.ms-excel.tableSingleCells": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml": "TODO",
  /* Slicer */
  "application/vnd.ms-excel.slicer": "TODO",
  "application/vnd.ms-excel.slicerCache": "TODO",
  "application/vnd.ms-excel.slicer+xml": "TODO",
  "application/vnd.ms-excel.slicerCache+xml": "TODO",
  /* Sort Map */
  "application/vnd.ms-excel.wsSortMap": "TODO",
  /* Table */
  "application/vnd.ms-excel.table": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml": "TODO",
  /* Themes */
  "application/vnd.openxmlformats-officedocument.theme+xml": "themes",
  /* Theme Override */
  "application/vnd.openxmlformats-officedocument.themeOverride+xml": "TODO",
  /* Timeline */
  "application/vnd.ms-excel.Timeline+xml": "TODO",
  /* verify */
  "application/vnd.ms-excel.TimelineCache+xml": "TODO",
  /* verify */
  /* VBA */
  "application/vnd.ms-office.vbaProject": "vba",
  "application/vnd.ms-office.vbaProjectSignature": "TODO",
  /* Volatile Dependencies */
  "application/vnd.ms-office.volatileDependencies": "TODO",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml": "TODO",
  /* Control Properties */
  "application/vnd.ms-excel.controlproperties+xml": "TODO",
  /* Data Model */
  "application/vnd.openxmlformats-officedocument.model+data": "TODO",
  /* Survey */
  "application/vnd.ms-excel.Survey+xml": "TODO",
  /* Drawing */
  "application/vnd.openxmlformats-officedocument.drawing+xml": "drawings",
  "application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml": "TODO",
  "application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml": "TODO",
  /* VML */
  "application/vnd.openxmlformats-officedocument.vmlDrawing": "TODO",
  "application/vnd.openxmlformats-package.relationships+xml": "rels",
  "application/vnd.openxmlformats-officedocument.oleObject": "TODO",
  /* Image */
  "image/png": "TODO",
  sheet: "js"
}, wn = {
  workbooks: {
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml",
    xlsm: "application/vnd.ms-excel.sheet.macroEnabled.main+xml",
    xlsb: "application/vnd.ms-excel.sheet.binary.macroEnabled.main",
    xlam: "application/vnd.ms-excel.addin.macroEnabled.main+xml",
    xltx: "application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml"
  },
  strs: {
    /* Shared Strings */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml",
    xlsb: "application/vnd.ms-excel.sharedStrings"
  },
  comments: {
    /* Comments */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml",
    xlsb: "application/vnd.ms-excel.comments"
  },
  sheets: {
    /* Worksheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml",
    xlsb: "application/vnd.ms-excel.worksheet"
  },
  charts: {
    /* Chartsheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml",
    xlsb: "application/vnd.ms-excel.chartsheet"
  },
  dialogs: {
    /* Dialogsheet */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml",
    xlsb: "application/vnd.ms-excel.dialogsheet"
  },
  macros: {
    /* Macrosheet (Excel 4.0 Macros) */
    xlsx: "application/vnd.ms-excel.macrosheet+xml",
    xlsb: "application/vnd.ms-excel.macrosheet"
  },
  metadata: {
    /* Metadata (Stock/Geography and Dynamic Array) */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml",
    xlsb: "application/vnd.ms-excel.sheetMetadata"
  },
  styles: {
    /* Styles */
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml",
    xlsb: "application/vnd.ms-excel.styles"
  }
};
function xs() {
  return {
    workbooks: [],
    sheets: [],
    charts: [],
    dialogs: [],
    macros: [],
    rels: [],
    strs: [],
    comments: [],
    threadedcomments: [],
    links: [],
    coreprops: [],
    extprops: [],
    custprops: [],
    themes: [],
    styles: [],
    calcchains: [],
    vba: [],
    drawings: [],
    metadata: [],
    people: [],
    TODO: [],
    xmlns: ""
  };
}
function ch(e) {
  var t = xs();
  if (!e || !e.match) return t;
  var r = {};
  if ((e.match(Sr) || []).forEach(function(a) {
    var n = ge(a);
    switch (n[0].replace(vu, "<")) {
      case "<?xml":
        break;
      case "<Types":
        t.xmlns = n["xmlns" + (n[0].match(/<(\w+):/) || ["", ""])[1]];
        break;
      case "<Default":
        r[n.Extension] = n.ContentType;
        break;
      case "<Override":
        t[Pi[n.ContentType]] !== void 0 && t[Pi[n.ContentType]].push(n.PartName);
        break;
    }
  }), t.xmlns !== ir.CT) throw new Error("Unknown Namespace: " + t.xmlns);
  return t.calcchain = t.calcchains.length > 0 ? t.calcchains[0] : "", t.sst = t.strs.length > 0 ? t.strs[0] : "", t.style = t.styles.length > 0 ? t.styles[0] : "", t.defaults = r, delete t.calcchains, t;
}
function mo(e, t) {
  var r = cu(Pi), a = [], n;
  a[a.length] = er, a[a.length] = ne("Types", null, {
    xmlns: ir.CT,
    "xmlns:xsd": ir.xsd,
    "xmlns:xsi": ir.xsi
  }), a = a.concat([
    ["xml", "application/xml"],
    ["bin", "application/vnd.ms-excel.sheet.binary.macroEnabled.main"],
    ["vml", "application/vnd.openxmlformats-officedocument.vmlDrawing"],
    ["data", "application/vnd.openxmlformats-officedocument.model+data"],
    /* from test files */
    ["bmp", "image/bmp"],
    ["png", "image/png"],
    ["gif", "image/gif"],
    ["emf", "image/x-emf"],
    ["wmf", "image/x-wmf"],
    ["jpg", "image/jpeg"],
    ["jpeg", "image/jpeg"],
    ["tif", "image/tiff"],
    ["tiff", "image/tiff"],
    ["pdf", "application/pdf"],
    ["rels", "application/vnd.openxmlformats-package.relationships+xml"]
  ].map(function(o) {
    return ne("Default", null, { Extension: o[0], ContentType: o[1] });
  }));
  var i = function(o) {
    e[o] && e[o].length > 0 && (n = e[o][0], a[a.length] = ne("Override", null, {
      PartName: (n[0] == "/" ? "" : "/") + n,
      ContentType: wn[o][t.bookType] || wn[o].xlsx
    }));
  }, s = function(o) {
    (e[o] || []).forEach(function(l) {
      a[a.length] = ne("Override", null, {
        PartName: (l[0] == "/" ? "" : "/") + l,
        ContentType: wn[o][t.bookType] || wn[o].xlsx
      });
    });
  }, c = function(o) {
    (e[o] || []).forEach(function(l) {
      a[a.length] = ne("Override", null, {
        PartName: (l[0] == "/" ? "" : "/") + l,
        ContentType: r[o][0]
      });
    });
  };
  return i("workbooks"), s("sheets"), s("charts"), c("themes"), ["strs", "styles"].forEach(i), ["coreprops", "extprops", "custprops"].forEach(c), c("vba"), c("comments"), c("threadedcomments"), c("drawings"), s("metadata"), c("people"), a.length > 2 && (a[a.length] = "</Types>", a[1] = a[1].replace("/>", ">")), a.join("");
}
var ke = {
  WB: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  SHEET: "http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument",
  HLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink",
  VML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/vmlDrawing",
  XPATH: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLinkPath",
  XMISS: "http://schemas.microsoft.com/office/2006/relationships/xlExternalLinkPath/xlPathMissing",
  XLINK: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/externalLink",
  CXML: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXml",
  CXMLP: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/customXmlProps",
  CMNT: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/comments",
  CORE_PROPS: "http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties",
  EXT_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties",
  CUST_PROPS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties",
  SST: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings",
  STY: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles",
  THEME: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme",
  CHART: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chart",
  CHARTEX: "http://schemas.microsoft.com/office/2014/relationships/chartEx",
  CS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/chartsheet",
  WS: [
    "http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet",
    "http://purl.oclc.org/ooxml/officeDocument/relationships/worksheet"
  ],
  DS: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/dialogsheet",
  MS: "http://schemas.microsoft.com/office/2006/relationships/xlMacrosheet",
  IMG: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/image",
  DRAW: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/drawing",
  XLMETA: "http://schemas.openxmlformats.org/officeDocument/2006/relationships/sheetMetadata",
  TCMNT: "http://schemas.microsoft.com/office/2017/10/relationships/threadedComment",
  PEOPLE: "http://schemas.microsoft.com/office/2017/10/relationships/person",
  VBA: "http://schemas.microsoft.com/office/2006/relationships/vbaProject"
};
function Za(e) {
  var t = e.lastIndexOf("/");
  return e.slice(0, t + 1) + "_rels/" + e.slice(t + 1) + ".rels";
}
function Wa(e, t) {
  var r = { "!id": {} };
  if (!e) return r;
  t.charAt(0) !== "/" && (t = "/" + t);
  var a = {};
  return (e.match(Sr) || []).forEach(function(n) {
    var i = ge(n);
    if (i[0] === "<Relationship") {
      var s = {};
      s.Type = i.Type, s.Target = i.Target, s.Id = i.Id, i.TargetMode && (s.TargetMode = i.TargetMode);
      var c = i.TargetMode === "External" ? i.Target : Ma(i.Target, t);
      r[c] = s, a[i.Id] = s;
    }
  }), r["!id"] = a, r;
}
function da(e) {
  var t = [er, ne("Relationships", null, {
    //'xmlns:ns0': XMLNS.RELS,
    xmlns: ir.RELS
  })];
  return $e(e["!id"]).forEach(function(r) {
    t[t.length] = ne("Relationship", null, e["!id"][r]);
  }), t.length > 2 && (t[t.length] = "</Relationships>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function be(e, t, r, a, n, i) {
  if (n || (n = {}), e["!id"] || (e["!id"] = {}), e["!idx"] || (e["!idx"] = 1), t < 0) for (t = e["!idx"]; e["!id"]["rId" + t]; ++t)
    ;
  if (e["!idx"] = t + 1, n.Id = "rId" + t, n.Type = a, n.Target = r, [ke.HLINK, ke.XPATH, ke.XMISS].indexOf(n.Type) > -1 && (n.TargetMode = "External"), e["!id"][n.Id]) throw new Error("Cannot rewrite rId " + t);
  return e["!id"][n.Id] = n, e[("/" + n.Target).replace("//", "/")] = n, t;
}
var oh = "application/vnd.oasis.opendocument.spreadsheet";
function fh(e, t) {
  for (var r = es(e), a, n; a = Ja.exec(r); ) switch (a[3]) {
    case "manifest":
      break;
    // 4.2 <manifest:manifest>
    case "file-entry":
      if (n = ge(a[0], !1), n.path == "/" && n.type !== oh) throw new Error("This OpenDocument is not a spreadsheet");
      break;
    case "encryption-data":
    // 4.4 <manifest:encryption-data>
    case "algorithm":
    // 4.5 <manifest:algorithm>
    case "start-key-generation":
    // 4.6 <manifest:start-key-generation>
    case "key-derivation":
      throw new Error("Unsupported ODS Encryption");
    default:
      if (t && t.WTF) throw a;
  }
}
function lh(e) {
  var t = [er];
  t.push(`<manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.2">
`), t.push(`  <manifest:file-entry manifest:full-path="/" manifest:version="1.2" manifest:media-type="application/vnd.oasis.opendocument.spreadsheet"/>
`);
  for (var r = 0; r < e.length; ++r) t.push('  <manifest:file-entry manifest:full-path="' + e[r][0] + '" manifest:media-type="' + e[r][1] + `"/>
`);
  return t.push("</manifest:manifest>"), t.join("");
}
function P0(e, t, r) {
  return [
    '  <rdf:Description rdf:about="' + e + `">
`,
    '    <rdf:type rdf:resource="http://docs.oasis-open.org/ns/office/1.2/meta/' + (r || "odf") + "#" + t + `"/>
`,
    `  </rdf:Description>
`
  ].join("");
}
function uh(e, t) {
  return [
    '  <rdf:Description rdf:about="' + e + `">
`,
    '    <ns0:hasPart xmlns:ns0="http://docs.oasis-open.org/ns/office/1.2/meta/pkg#" rdf:resource="' + t + `"/>
`,
    `  </rdf:Description>
`
  ].join("");
}
function hh(e) {
  var t = [er];
  t.push(`<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
`);
  for (var r = 0; r != e.length; ++r)
    t.push(P0(e[r][0], e[r][1])), t.push(uh("", e[r][0]));
  return t.push(P0("", "Document", "pkg")), t.push("</rdf:RDF>"), t.join("");
}
function vo() {
  return '<office:document-meta xmlns:office="urn:oasis:names:tc:opendocument:xmlns:office:1.0" xmlns:meta="urn:oasis:names:tc:opendocument:xmlns:meta:1.0" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:xlink="http://www.w3.org/1999/xlink" office:version="1.2"><office:meta><meta:generator>SheetJS ' + Ya.version + "</meta:generator></office:meta></office:document-meta>";
}
var Kr = [
  ["cp:category", "Category"],
  ["cp:contentStatus", "ContentStatus"],
  ["cp:keywords", "Keywords"],
  ["cp:lastModifiedBy", "LastAuthor"],
  ["cp:lastPrinted", "LastPrinted"],
  ["cp:revision", "RevNumber"],
  ["cp:version", "Version"],
  ["dc:creator", "Author"],
  ["dc:description", "Comments"],
  ["dc:identifier", "Identifier"],
  ["dc:language", "Language"],
  ["dc:subject", "Subject"],
  ["dc:title", "Title"],
  ["dcterms:created", "CreatedDate", "date"],
  ["dcterms:modified", "ModifiedDate", "date"]
], dh = /* @__PURE__ */ (function() {
  for (var e = new Array(Kr.length), t = 0; t < Kr.length; ++t) {
    var r = Kr[t], a = "(?:" + r[0].slice(0, r[0].indexOf(":")) + ":)" + r[0].slice(r[0].indexOf(":") + 1);
    e[t] = new RegExp("<" + a + "[^>]*>([\\s\\S]*?)</" + a + ">");
  }
  return e;
})();
function go(e) {
  var t = {};
  e = Me(e);
  for (var r = 0; r < Kr.length; ++r) {
    var a = Kr[r], n = e.match(dh[r]);
    n != null && n.length > 0 && (t[a[1]] = Ie(n[1])), a[2] === "date" && t[a[1]] && (t[a[1]] = Ge(t[a[1]]));
  }
  return t;
}
function gi(e, t, r, a, n) {
  n[e] != null || t == null || t === "" || (n[e] = t, t = Pe(t), a[a.length] = r ? ne(e, t, r) : xr(e, t));
}
function Eo(e, t) {
  var r = t || {}, a = [er, ne("cp:coreProperties", null, {
    //'xmlns': XMLNS.CORE_PROPS,
    "xmlns:cp": ir.CORE_PROPS,
    "xmlns:dc": ir.dc,
    "xmlns:dcterms": ir.dcterms,
    "xmlns:dcmitype": ir.dcmitype,
    "xmlns:xsi": ir.xsi
  })], n = {};
  if (!e && !r.Props) return a.join("");
  e && (e.CreatedDate != null && gi("dcterms:created", typeof e.CreatedDate == "string" ? e.CreatedDate : Li(e.CreatedDate, r.WTF), { "xsi:type": "dcterms:W3CDTF" }, a, n), e.ModifiedDate != null && gi("dcterms:modified", typeof e.ModifiedDate == "string" ? e.ModifiedDate : Li(e.ModifiedDate, r.WTF), { "xsi:type": "dcterms:W3CDTF" }, a, n));
  for (var i = 0; i != Kr.length; ++i) {
    var s = Kr[i], c = r.Props && r.Props[s[1]] != null ? r.Props[s[1]] : e ? e[s[1]] : null;
    c === !0 ? c = "1" : c === !1 ? c = "0" : typeof c == "number" && (c = String(c)), c != null && gi(s[0], c, null, a, n);
  }
  return a.length > 2 && (a[a.length] = "</cp:coreProperties>", a[1] = a[1].replace("/>", ">")), a.join("");
}
var Ht = [
  ["Application", "Application", "string"],
  ["AppVersion", "AppVersion", "string"],
  ["Company", "Company", "string"],
  ["DocSecurity", "DocSecurity", "string"],
  ["Manager", "Manager", "string"],
  ["HyperlinksChanged", "HyperlinksChanged", "bool"],
  ["SharedDoc", "SharedDoc", "bool"],
  ["LinksUpToDate", "LinksUpToDate", "bool"],
  ["ScaleCrop", "ScaleCrop", "bool"],
  ["HeadingPairs", "HeadingPairs", "raw"],
  ["TitlesOfParts", "TitlesOfParts", "raw"]
], _o = [
  "Worksheets",
  "SheetNames",
  "NamedRanges",
  "DefinedNames",
  "Chartsheets",
  "ChartNames"
];
function To(e, t, r, a) {
  var n = [];
  if (typeof e == "string") n = F0(e, a);
  else for (var i = 0; i < e.length; ++i) n = n.concat(e[i].map(function(f) {
    return { v: f };
  }));
  var s = typeof t == "string" ? F0(t, a).map(function(f) {
    return f.v;
  }) : t, c = 0, o = 0;
  if (s.length > 0) for (var l = 0; l !== n.length; l += 2) {
    switch (o = +n[l + 1].v, n[l].v) {
      case "Worksheets":
      case "工作表":
      case "Листы":
      case "أوراق العمل":
      case "ワークシート":
      case "גליונות עבודה":
      case "Arbeitsblätter":
      case "Çalışma Sayfaları":
      case "Feuilles de calcul":
      case "Fogli di lavoro":
      case "Folhas de cálculo":
      case "Planilhas":
      case "Regneark":
      case "Hojas de cálculo":
      case "Werkbladen":
        r.Worksheets = o, r.SheetNames = s.slice(c, c + o);
        break;
      case "Named Ranges":
      case "Rangos con nombre":
      case "名前付き一覧":
      case "Benannte Bereiche":
      case "Navngivne områder":
        r.NamedRanges = o, r.DefinedNames = s.slice(c, c + o);
        break;
      case "Charts":
      case "Diagramme":
        r.Chartsheets = o, r.ChartNames = s.slice(c, c + o);
        break;
    }
    c += o;
  }
}
function xh(e, t, r) {
  var a = {};
  return t || (t = {}), e = Me(e), Ht.forEach(function(n) {
    var i = (e.match(qa(n[0])) || [])[1];
    switch (n[2]) {
      case "string":
        i && (t[n[1]] = Ie(i));
        break;
      case "bool":
        t[n[1]] = i === "true";
        break;
      case "raw":
        var s = e.match(new RegExp("<" + n[0] + "[^>]*>([\\s\\S]*?)</" + n[0] + ">"));
        s && s.length > 0 && (a[n[1]] = s[1]);
        break;
    }
  }), a.HeadingPairs && a.TitlesOfParts && To(a.HeadingPairs, a.TitlesOfParts, t, r), t;
}
function wo(e) {
  var t = [], r = ne;
  return e || (e = {}), e.Application = "SheetJS", t[t.length] = er, t[t.length] = ne("Properties", null, {
    xmlns: ir.EXT_PROPS,
    "xmlns:vt": ir.vt
  }), Ht.forEach(function(a) {
    if (e[a[1]] !== void 0) {
      var n;
      switch (a[2]) {
        case "string":
          n = Pe(String(e[a[1]]));
          break;
        case "bool":
          n = e[a[1]] ? "true" : "false";
          break;
      }
      n !== void 0 && (t[t.length] = r(a[0], n));
    }
  }), t[t.length] = r("HeadingPairs", r("vt:vector", r("vt:variant", "<vt:lpstr>Worksheets</vt:lpstr>") + r("vt:variant", r("vt:i4", String(e.Worksheets))), { size: 2, baseType: "variant" })), t[t.length] = r("TitlesOfParts", r("vt:vector", e.SheetNames.map(function(a) {
    return "<vt:lpstr>" + Pe(a) + "</vt:lpstr>";
  }).join(""), { size: e.Worksheets, baseType: "lpstr" })), t.length > 2 && (t[t.length] = "</Properties>", t[1] = t[1].replace("/>", ">")), t.join("");
}
var ph = /<[^>]+>[^<]*/g;
function mh(e, t) {
  var r = {}, a = "", n = e.match(ph);
  if (n) for (var i = 0; i != n.length; ++i) {
    var s = n[i], c = ge(s);
    switch (c[0]) {
      case "<?xml":
        break;
      case "<Properties":
        break;
      case "<property":
        a = Ie(c.name);
        break;
      case "</property>":
        a = null;
        break;
      default:
        if (s.indexOf("<vt:") === 0) {
          var o = s.split(">"), l = o[0].slice(4), f = o[1];
          switch (l) {
            case "lpstr":
            case "bstr":
            case "lpwstr":
              r[a] = Ie(f);
              break;
            case "bool":
              r[a] = We(f);
              break;
            case "i1":
            case "i2":
            case "i4":
            case "i8":
            case "int":
            case "uint":
              r[a] = parseInt(f, 10);
              break;
            case "r4":
            case "r8":
            case "decimal":
              r[a] = parseFloat(f);
              break;
            case "filetime":
            case "date":
              r[a] = Ge(f);
              break;
            case "cy":
            case "error":
              r[a] = Ie(f);
              break;
            default:
              if (l.slice(-1) == "/") break;
              t.WTF && typeof console < "u" && console.warn("Unexpected", s, l, o);
          }
        } else if (s.slice(0, 2) !== "</") {
          if (t.WTF) throw new Error(s);
        }
    }
  }
  return r;
}
function yo(e) {
  var t = [er, ne("Properties", null, {
    xmlns: ir.CUST_PROPS,
    "xmlns:vt": ir.vt
  })];
  if (!e) return t.join("");
  var r = 1;
  return $e(e).forEach(function(n) {
    ++r, t[t.length] = ne("property", ku(e[n]), {
      fmtid: "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}",
      pid: r,
      name: Pe(n)
    });
  }), t.length > 2 && (t[t.length] = "</Properties>", t[1] = t[1].replace("/>", ">")), t.join("");
}
var Mi = {
  Title: "Title",
  Subject: "Subject",
  Author: "Author",
  Keywords: "Keywords",
  Comments: "Description",
  LastAuthor: "LastAuthor",
  RevNumber: "Revision",
  Application: "AppName",
  /* TotalTime: 'TotalTime', */
  LastPrinted: "LastPrinted",
  CreatedDate: "Created",
  ModifiedDate: "LastSaved",
  /* Pages */
  /* Words */
  /* Characters */
  Category: "Category",
  /* PresentationFormat */
  Manager: "Manager",
  Company: "Company",
  /* Guid */
  /* HyperlinkBase */
  /* Bytes */
  /* Lines */
  /* Paragraphs */
  /* CharactersWithSpaces */
  AppVersion: "Version",
  ContentStatus: "ContentStatus",
  /* NOTE: missing from schema */
  Identifier: "Identifier",
  /* NOTE: missing from schema */
  Language: "Language"
  /* NOTE: missing from schema */
}, Ei;
function vh(e, t, r) {
  Ei || (Ei = zn(Mi)), t = Ei[t] || t, e[t] = r;
}
function gh(e, t) {
  var r = [];
  return $e(Mi).map(function(a) {
    for (var n = 0; n < Kr.length; ++n) if (Kr[n][1] == a) return Kr[n];
    for (n = 0; n < Ht.length; ++n) if (Ht[n][1] == a) return Ht[n];
    throw a;
  }).forEach(function(a) {
    if (e[a[1]] != null) {
      var n = t && t.Props && t.Props[a[1]] != null ? t.Props[a[1]] : e[a[1]];
      a[2] === "date" && (n = new Date(n).toISOString().replace(/\.\d*Z/, "Z")), typeof n == "number" ? n = String(n) : n === !0 || n === !1 ? n = n ? "1" : "0" : n instanceof Date && (n = new Date(n).toISOString().replace(/\.\d*Z/, "")), r.push(xr(Mi[a[1]] || a[1], n));
    }
  }), ne("DocumentProperties", r.join(""), { xmlns: Rr.o });
}
function Eh(e, t) {
  var r = ["Worksheets", "SheetNames"], a = "CustomDocumentProperties", n = [];
  return e && $e(e).forEach(function(i) {
    if (Object.prototype.hasOwnProperty.call(e, i)) {
      for (var s = 0; s < Kr.length; ++s) if (i == Kr[s][1]) return;
      for (s = 0; s < Ht.length; ++s) if (i == Ht[s][1]) return;
      for (s = 0; s < r.length; ++s) if (i == r[s]) return;
      var c = e[i], o = "string";
      typeof c == "number" ? (o = "float", c = String(c)) : c === !0 || c === !1 ? (o = "boolean", c = c ? "1" : "0") : c = String(c), n.push(ne(w0(i), c, { "dt:dt": o }));
    }
  }), t && $e(t).forEach(function(i) {
    if (Object.prototype.hasOwnProperty.call(t, i) && !(e && Object.prototype.hasOwnProperty.call(e, i))) {
      var s = t[i], c = "string";
      typeof s == "number" ? (c = "float", s = String(s)) : s === !0 || s === !1 ? (c = "boolean", s = s ? "1" : "0") : s instanceof Date ? (c = "dateTime.tz", s = s.toISOString()) : s = String(s), n.push(ne(w0(i), s, { "dt:dt": c }));
    }
  }), "<" + a + ' xmlns="' + Rr.o + '">' + n.join("") + "</" + a + ">";
}
function ps(e) {
  var t = e.read_shift(4), r = e.read_shift(4);
  return new Date((r / 1e7 * Math.pow(2, 32) + t / 1e7 - 11644473600) * 1e3).toISOString().replace(/\.000/, "");
}
function _h(e) {
  var t = typeof e == "string" ? new Date(Date.parse(e)) : e, r = t.getTime() / 1e3 + 11644473600, a = r % Math.pow(2, 32), n = (r - a) / Math.pow(2, 32);
  a *= 1e7, n *= 1e7;
  var i = a / Math.pow(2, 32) | 0;
  i > 0 && (a = a % Math.pow(2, 32), n += i);
  var s = z(8);
  return s.write_shift(4, a), s.write_shift(4, n), s;
}
function So(e, t, r) {
  var a = e.l, n = e.read_shift(0, "lpstr-cp");
  if (r) for (; e.l - a & 3; ) ++e.l;
  return n;
}
function ko(e, t, r) {
  var a = e.read_shift(0, "lpwstr");
  return a;
}
function Fo(e, t, r) {
  return t === 31 ? ko(e) : So(e, t, r);
}
function Bi(e, t, r) {
  return Fo(e, t, r === !1 ? 0 : 4);
}
function Th(e, t) {
  if (!t) throw new Error("VtUnalignedString must have positive length");
  return Fo(e, t, 0);
}
function wh(e) {
  for (var t = e.read_shift(4), r = [], a = 0; a != t; ++a) {
    var n = e.l;
    r[a] = e.read_shift(0, "lpwstr").replace(Tr, ""), e.l - n & 2 && (e.l += 2);
  }
  return r;
}
function yh(e) {
  for (var t = e.read_shift(4), r = [], a = 0; a != t; ++a) r[a] = e.read_shift(0, "lpstr-cp").replace(Tr, "");
  return r;
}
function Sh(e) {
  var t = e.l, r = Bn(e, xo);
  e[e.l] == 0 && e[e.l + 1] == 0 && e.l - t & 2 && (e.l += 2);
  var a = Bn(e, Or);
  return [r, a];
}
function kh(e) {
  for (var t = e.read_shift(4), r = [], a = 0; a < t / 2; ++a) r.push(Sh(e));
  return r;
}
function M0(e, t) {
  for (var r = e.read_shift(4), a = {}, n = 0; n != r; ++n) {
    var i = e.read_shift(4), s = e.read_shift(4);
    a[i] = e.read_shift(s, t === 1200 ? "utf16le" : "utf8").replace(Tr, "").replace(Pa, "!"), t === 1200 && s % 2 && (e.l += 2);
  }
  return e.l & 3 && (e.l = e.l >> 3 << 2), a;
}
function Ao(e) {
  var t = e.read_shift(4), r = e.slice(e.l, e.l + t);
  return e.l += t, (t & 3) > 0 && (e.l += 4 - (t & 3) & 3), r;
}
function Fh(e) {
  var t = {};
  return t.Size = e.read_shift(4), e.l += t.Size + 3 - (t.Size - 1) % 4, t;
}
function Bn(e, t, r) {
  var a = e.read_shift(2), n, i = r || {};
  if (e.l += 2, t !== D0 && a !== t && ah.indexOf(t) === -1 && !((t & 65534) == 4126 && (a & 65534) == 4126))
    throw new Error("Expected type " + t + " saw " + a);
  switch (t === D0 ? a : t) {
    case 2:
      return n = e.read_shift(2, "i"), i.raw || (e.l += 2), n;
    case 3:
      return n = e.read_shift(4, "i"), n;
    case 11:
      return e.read_shift(4) !== 0;
    case 19:
      return n = e.read_shift(4), n;
    case 30:
      return So(e, a, 4).replace(Tr, "");
    case 31:
      return ko(e);
    case 64:
      return ps(e);
    case 65:
      return Ao(e);
    case 71:
      return Fh(e);
    case 80:
      return Bi(e, a, !i.raw).replace(Tr, "");
    case 81:
      return Th(
        e,
        a
        /*, 4*/
      ).replace(Tr, "");
    case 4108:
      return kh(e);
    case 4126:
    case 4127:
      return a == 4127 ? wh(e) : yh(e);
    default:
      throw new Error("TypedPropertyValue unrecognized type " + t + " " + a);
  }
}
function B0(e, t) {
  var r = z(4), a = z(4);
  switch (r.write_shift(4, e == 80 ? 31 : e), e) {
    case 3:
      a.write_shift(-4, t);
      break;
    case 5:
      a = z(8), a.write_shift(8, t, "f");
      break;
    case 11:
      a.write_shift(4, t ? 1 : 0);
      break;
    case 64:
      a = _h(t);
      break;
    case 31:
    case 80:
      for (a = z(4 + 2 * (t.length + 1) + (t.length % 2 ? 0 : 2)), a.write_shift(4, t.length + 1), a.write_shift(0, t, "dbcs"); a.l != a.length; ) a.write_shift(1, 0);
      break;
    default:
      throw new Error("TypedPropertyValue unrecognized type " + e + " " + t);
  }
  return fr([r, a]);
}
function U0(e, t) {
  var r = e.l, a = e.read_shift(4), n = e.read_shift(4), i = [], s = 0, c = 0, o = -1, l = {};
  for (s = 0; s != n; ++s) {
    var f = e.read_shift(4), d = e.read_shift(4);
    i[s] = [f, d + r];
  }
  i.sort(function(E, g) {
    return E[1] - g[1];
  });
  var h = {};
  for (s = 0; s != n; ++s) {
    if (e.l !== i[s][1]) {
      var p = !0;
      if (s > 0 && t) switch (t[i[s - 1][0]].t) {
        case 2:
          e.l + 2 === i[s][1] && (e.l += 2, p = !1);
          break;
        case 80:
          e.l <= i[s][1] && (e.l = i[s][1], p = !1);
          break;
        case 4108:
          e.l <= i[s][1] && (e.l = i[s][1], p = !1);
          break;
      }
      if ((!t || s == 0) && e.l <= i[s][1] && (p = !1, e.l = i[s][1]), p) throw new Error("Read Error: Expected address " + i[s][1] + " at " + e.l + " :" + s);
    }
    if (t) {
      var m = t[i[s][0]];
      if (h[m.n] = Bn(e, m.t, { raw: !0 }), m.p === "version" && (h[m.n] = String(h[m.n] >> 16) + "." + ("0000" + String(h[m.n] & 65535)).slice(-4)), m.n == "CodePage") switch (h[m.n]) {
        case 0:
          h[m.n] = 1252;
        /* falls through */
        case 874:
        case 932:
        case 936:
        case 949:
        case 950:
        case 1250:
        case 1251:
        case 1253:
        case 1254:
        case 1255:
        case 1256:
        case 1257:
        case 1258:
        case 1e4:
        case 1200:
        case 1201:
        case 1252:
        case 65e3:
        case -536:
        case 65001:
        case -535:
          jr(c = h[m.n] >>> 0 & 65535);
          break;
        default:
          throw new Error("Unsupported CodePage: " + h[m.n]);
      }
    } else if (i[s][0] === 1) {
      if (c = h.CodePage = Bn(e, ds), jr(c), o !== -1) {
        var x = e.l;
        e.l = i[o][1], l = M0(e, c), e.l = x;
      }
    } else if (i[s][0] === 0) {
      if (c === 0) {
        o = s, e.l = i[s + 1][1];
        continue;
      }
      l = M0(e, c);
    } else {
      var u = l[i[s][0]], v;
      switch (e[e.l]) {
        case 65:
          e.l += 4, v = Ao(e);
          break;
        case 30:
          e.l += 4, v = Bi(e, e[e.l - 4]).replace(/\u0000+$/, "");
          break;
        case 31:
          e.l += 4, v = Bi(e, e[e.l - 4]).replace(/\u0000+$/, "");
          break;
        case 3:
          e.l += 4, v = e.read_shift(4, "i");
          break;
        case 19:
          e.l += 4, v = e.read_shift(4);
          break;
        case 5:
          e.l += 4, v = e.read_shift(8, "f");
          break;
        case 11:
          e.l += 4, v = Qe(e, 4);
          break;
        case 64:
          e.l += 4, v = Ge(ps(e));
          break;
        default:
          throw new Error("unparsed value: " + e[e.l]);
      }
      h[u] = v;
    }
  }
  return e.l = r + a, h;
}
var No = ["CodePage", "Thumbnail", "_PID_LINKBASE", "_PID_HLINKS", "SystemIdentifier", "FMTID"];
function Ah(e) {
  switch (typeof e) {
    case "boolean":
      return 11;
    case "number":
      return (e | 0) == e ? 3 : 5;
    case "string":
      return 31;
    case "object":
      if (e instanceof Date) return 64;
      break;
  }
  return -1;
}
function X0(e, t, r) {
  var a = z(8), n = [], i = [], s = 8, c = 0, o = z(8), l = z(8);
  if (o.write_shift(4, 2), o.write_shift(4, 1200), l.write_shift(4, 1), i.push(o), n.push(l), s += 8 + o.length, !t) {
    l = z(8), l.write_shift(4, 0), n.unshift(l);
    var f = [z(4)];
    for (f[0].write_shift(4, e.length), c = 0; c < e.length; ++c) {
      var d = e[c][0];
      for (o = z(8 + 2 * (d.length + 1) + (d.length % 2 ? 0 : 2)), o.write_shift(4, c + 2), o.write_shift(4, d.length + 1), o.write_shift(0, d, "dbcs"); o.l != o.length; ) o.write_shift(1, 0);
      f.push(o);
    }
    o = fr(f), i.unshift(o), s += 8 + o.length;
  }
  for (c = 0; c < e.length; ++c)
    if (!(t && !t[e[c][0]]) && !(No.indexOf(e[c][0]) > -1 || _o.indexOf(e[c][0]) > -1) && e[c][1] != null) {
      var h = e[c][1], p = 0;
      if (t) {
        p = +t[e[c][0]];
        var m = r[p];
        if (m.p == "version" && typeof h == "string") {
          var x = h.split(".");
          h = (+x[0] << 16) + (+x[1] || 0);
        }
        o = B0(m.t, h);
      } else {
        var u = Ah(h);
        u == -1 && (u = 31, h = String(h)), o = B0(u, h);
      }
      i.push(o), l = z(8), l.write_shift(4, t ? p : 2 + c), n.push(l), s += 8 + o.length;
    }
  var v = 8 * (i.length + 1);
  for (c = 0; c < i.length; ++c)
    n[c].write_shift(4, v), v += i[c].length;
  return a.write_shift(4, s), a.write_shift(4, i.length), fr([a].concat(n).concat(i));
}
function W0(e, t, r) {
  var a = e.content;
  if (!a) return {};
  dr(a, 0);
  var n, i, s, c, o = 0;
  a.chk("feff", "Byte Order: "), a.read_shift(2);
  var l = a.read_shift(4), f = a.read_shift(16);
  if (f !== de.utils.consts.HEADER_CLSID && f !== r) throw new Error("Bad PropertySet CLSID " + f);
  if (n = a.read_shift(4), n !== 1 && n !== 2) throw new Error("Unrecognized #Sets: " + n);
  if (i = a.read_shift(16), c = a.read_shift(4), n === 1 && c !== a.l) throw new Error("Length mismatch: " + c + " !== " + a.l);
  n === 2 && (s = a.read_shift(16), o = a.read_shift(4));
  var d = U0(a, t), h = { SystemIdentifier: l };
  for (var p in d) h[p] = d[p];
  if (h.FMTID = i, n === 1) return h;
  if (o - a.l == 2 && (a.l += 2), a.l !== o) throw new Error("Length mismatch 2: " + a.l + " !== " + o);
  var m;
  try {
    m = U0(a, null);
  } catch {
  }
  for (p in m) h[p] = m[p];
  return h.FMTID = [i, s], h;
}
function H0(e, t, r, a, n, i) {
  var s = z(n ? 68 : 48), c = [s];
  s.write_shift(2, 65534), s.write_shift(2, 0), s.write_shift(4, 842412599), s.write_shift(16, de.utils.consts.HEADER_CLSID, "hex"), s.write_shift(4, n ? 2 : 1), s.write_shift(16, t, "hex"), s.write_shift(4, n ? 68 : 48);
  var o = X0(e, r, a);
  if (c.push(o), n) {
    var l = X0(n, null, null);
    s.write_shift(16, i, "hex"), s.write_shift(4, 68 + o.length), c.push(l);
  }
  return fr(c);
}
function kt(e, t) {
  return e.read_shift(t), null;
}
function Nh(e, t) {
  t || (t = z(e));
  for (var r = 0; r < e; ++r) t.write_shift(1, 0);
  return t;
}
function Ch(e, t, r) {
  for (var a = [], n = e.l + t; e.l < n; ) a.push(r(e, n - e.l));
  if (n !== e.l) throw new Error("Slurp error");
  return a;
}
function Qe(e, t) {
  return e.read_shift(t) === 1;
}
function Nr(e, t) {
  return t || (t = z(2)), t.write_shift(2, +!!e), t;
}
function ar(e) {
  return e.read_shift(2, "u");
}
function Yr(e, t) {
  return t || (t = z(2)), t.write_shift(2, e), t;
}
function Co(e, t) {
  return Ch(e, t, ar);
}
function Oh(e) {
  var t = e.read_shift(1), r = e.read_shift(1);
  return r === 1 ? t : t === 1;
}
function Oo(e, t, r) {
  return r || (r = z(2)), r.write_shift(1, t == "e" ? +e : +!!e), r.write_shift(1, t == "e" ? 1 : 0), r;
}
function ln(e, t, r) {
  var a = e.read_shift(r && r.biff >= 12 ? 2 : 1), n = "sbcs-cont", i = Pr;
  if (r && r.biff >= 8 && (Pr = 1200), !r || r.biff == 8) {
    var s = e.read_shift(1);
    s && (n = "dbcs-cont");
  } else r.biff == 12 && (n = "wstr");
  r.biff >= 2 && r.biff <= 5 && (n = "cpstr");
  var c = a ? e.read_shift(a, n) : "";
  return Pr = i, c;
}
function Ih(e) {
  var t = Pr;
  Pr = 1200;
  var r = e.read_shift(2), a = e.read_shift(1), n = a & 4, i = a & 8, s = 1 + (a & 1), c = 0, o, l = {};
  i && (c = e.read_shift(2)), n && (o = e.read_shift(4));
  var f = s == 2 ? "dbcs-cont" : "sbcs-cont", d = r === 0 ? "" : e.read_shift(r, f);
  return i && (e.l += 4 * c), n && (e.l += o), l.t = d, i || (l.raw = "<t>" + l.t + "</t>", l.r = l.t), Pr = t, l;
}
function Lh(e) {
  var t = e.t || "", r = z(3);
  r.write_shift(2, t.length), r.write_shift(1, 1);
  var a = z(2 * t.length);
  a.write_shift(2 * t.length, t, "utf16le");
  var n = [r, a];
  return fr(n);
}
function qt(e, t, r) {
  var a;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return e.read_shift(t, "cpstr");
    if (r.biff >= 12) return e.read_shift(t, "dbcs-cont");
  }
  var n = e.read_shift(1);
  return n === 0 ? a = e.read_shift(t, "sbcs-cont") : a = e.read_shift(t, "dbcs-cont"), a;
}
function un(e, t, r) {
  var a = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return a === 0 ? (e.l++, "") : qt(e, a, r);
}
function ia(e, t, r) {
  if (r.biff > 5) return un(e, t, r);
  var a = e.read_shift(1);
  return a === 0 ? (e.l++, "") : e.read_shift(a, r.biff <= 4 || !e.lens ? "cpstr" : "sbcs-cont");
}
function Io(e, t, r) {
  return r || (r = z(3 + 2 * e.length)), r.write_shift(2, e.length), r.write_shift(1, 1), r.write_shift(31, e, "utf16le"), r;
}
function Rh(e) {
  var t = e.read_shift(1);
  e.l++;
  var r = e.read_shift(2);
  return e.l += 2, [t, r];
}
function Dh(e) {
  var t = e.read_shift(4), r = e.l, a = !1;
  t > 24 && (e.l += t - 24, e.read_shift(16) === "795881f43b1d7f48af2c825dc4852763" && (a = !0), e.l = r);
  var n = e.read_shift((a ? t - 24 : t) >> 1, "utf16le").replace(Tr, "");
  return a && (e.l += 24), n;
}
function bh(e) {
  for (var t = e.read_shift(2), r = ""; t-- > 0; ) r += "../";
  var a = e.read_shift(0, "lpstr-ansi");
  if (e.l += 2, e.read_shift(2) != 57005) throw new Error("Bad FileMoniker");
  var n = e.read_shift(4);
  if (n === 0) return r + a.replace(/\\/g, "/");
  var i = e.read_shift(4);
  if (e.read_shift(2) != 3) throw new Error("Bad FileMoniker");
  var s = e.read_shift(i >> 1, "utf16le").replace(Tr, "");
  return r + s;
}
function Ph(e, t) {
  var r = e.read_shift(16);
  switch (r) {
    case "e0c9ea79f9bace118c8200aa004ba90b":
      return Dh(e);
    case "0303000000000000c000000000000046":
      return bh(e);
    default:
      throw new Error("Unsupported Moniker " + r);
  }
}
function yn(e) {
  var t = e.read_shift(4), r = t > 0 ? e.read_shift(t, "utf16le").replace(Tr, "") : "";
  return r;
}
function G0(e, t) {
  t || (t = z(6 + e.length * 2)), t.write_shift(4, 1 + e.length);
  for (var r = 0; r < e.length; ++r) t.write_shift(2, e.charCodeAt(r));
  return t.write_shift(2, 0), t;
}
function Mh(e, t) {
  var r = e.l + t, a = e.read_shift(4);
  if (a !== 2) throw new Error("Unrecognized streamVersion: " + a);
  var n = e.read_shift(2);
  e.l += 2;
  var i, s, c, o, l = "", f, d;
  n & 16 && (i = yn(e, r - e.l)), n & 128 && (s = yn(e, r - e.l)), (n & 257) === 257 && (c = yn(e, r - e.l)), (n & 257) === 1 && (o = Ph(e, r - e.l)), n & 8 && (l = yn(e, r - e.l)), n & 32 && (f = e.read_shift(16)), n & 64 && (d = ps(
    e
    /*, 8*/
  )), e.l = r;
  var h = s || c || o || "";
  h && l && (h += "#" + l), h || (h = "#" + l), n & 2 && h.charAt(0) == "/" && h.charAt(1) != "/" && (h = "file://" + h);
  var p = { Target: h };
  return f && (p.guid = f), d && (p.time = d), i && (p.Tooltip = i), p;
}
function Bh(e) {
  var t = z(512), r = 0, a = e.Target;
  a.slice(0, 7) == "file://" && (a = a.slice(7));
  var n = a.indexOf("#"), i = n > -1 ? 31 : 23;
  switch (a.charAt(0)) {
    case "#":
      i = 28;
      break;
    case ".":
      i &= -3;
      break;
  }
  t.write_shift(4, 2), t.write_shift(4, i);
  var s = [8, 6815827, 6619237, 4849780, 83];
  for (r = 0; r < s.length; ++r) t.write_shift(4, s[r]);
  if (i == 28)
    a = a.slice(1), G0(a, t);
  else if (i & 2) {
    for (s = "e0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), r = 0; r < s.length; ++r) t.write_shift(1, parseInt(s[r], 16));
    var c = n > -1 ? a.slice(0, n) : a;
    for (t.write_shift(4, 2 * (c.length + 1)), r = 0; r < c.length; ++r) t.write_shift(2, c.charCodeAt(r));
    t.write_shift(2, 0), i & 8 && G0(n > -1 ? a.slice(n + 1) : "", t);
  } else {
    for (s = "03 03 00 00 00 00 00 00 c0 00 00 00 00 00 00 46".split(" "), r = 0; r < s.length; ++r) t.write_shift(1, parseInt(s[r], 16));
    for (var o = 0; a.slice(o * 3, o * 3 + 3) == "../" || a.slice(o * 3, o * 3 + 3) == "..\\"; ) ++o;
    for (t.write_shift(2, o), t.write_shift(4, a.length - 3 * o + 1), r = 0; r < a.length - 3 * o; ++r) t.write_shift(1, a.charCodeAt(r + 3 * o) & 255);
    for (t.write_shift(1, 0), t.write_shift(2, 65535), t.write_shift(2, 57005), r = 0; r < 6; ++r) t.write_shift(4, 0);
  }
  return t.slice(0, t.l);
}
function Lo(e) {
  var t = e.read_shift(1), r = e.read_shift(1), a = e.read_shift(1), n = e.read_shift(1);
  return [t, r, a, n];
}
function Ro(e, t) {
  var r = Lo(e);
  return r[3] = 0, r;
}
function ut(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(2);
  return { r: t, c: r, ixfe: a };
}
function $t(e, t, r, a) {
  return a || (a = z(6)), a.write_shift(2, e), a.write_shift(2, t), a.write_shift(2, r || 0), a;
}
function Uh(e) {
  var t = e.read_shift(2), r = e.read_shift(2);
  return e.l += 8, { type: t, flags: r };
}
function Xh(e, t, r) {
  return t === 0 ? "" : ia(e, t, r);
}
function Wh(e, t, r) {
  var a = r.biff > 8 ? 4 : 2, n = e.read_shift(a), i = e.read_shift(a, "i"), s = e.read_shift(a, "i");
  return [n, i, s];
}
function Do(e) {
  var t = e.read_shift(2), r = hs(e);
  return [t, r];
}
function Hh(e, t, r) {
  e.l += 4, t -= 4;
  var a = e.l + t, n = ln(e, t, r), i = e.read_shift(2);
  if (a -= e.l, i !== a) throw new Error("Malformed AddinUdf: padding = " + a + " != " + i);
  return e.l += i, n;
}
function qn(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(2), n = e.read_shift(2);
  return { s: { c: a, r: t }, e: { c: n, r } };
}
function bo(e, t) {
  return t || (t = z(8)), t.write_shift(2, e.s.r), t.write_shift(2, e.e.r), t.write_shift(2, e.s.c), t.write_shift(2, e.e.c), t;
}
function Po(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(1), n = e.read_shift(1);
  return { s: { c: a, r: t }, e: { c: n, r } };
}
var Gh = Po;
function Mo(e) {
  e.l += 4;
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(2);
  return e.l += 12, [r, t, a];
}
function Vh(e) {
  var t = {};
  return e.l += 4, e.l += 16, t.fSharedNote = e.read_shift(2), e.l += 4, t;
}
function zh(e) {
  var t = {};
  return e.l += 4, e.cf = e.read_shift(2), t;
}
function mr(e) {
  e.l += 2, e.l += e.read_shift(2);
}
var Yh = {
  /*::[*/
  0: mr,
  /* FtEnd */
  /*::[*/
  4: mr,
  /* FtMacro */
  /*::[*/
  5: mr,
  /* FtButton */
  /*::[*/
  6: mr,
  /* FtGmo */
  /*::[*/
  7: zh,
  /* FtCf */
  /*::[*/
  8: mr,
  /* FtPioGrbit */
  /*::[*/
  9: mr,
  /* FtPictFmla */
  /*::[*/
  10: mr,
  /* FtCbls */
  /*::[*/
  11: mr,
  /* FtRbo */
  /*::[*/
  12: mr,
  /* FtSbs */
  /*::[*/
  13: Vh,
  /* FtNts */
  /*::[*/
  14: mr,
  /* FtSbsFmla */
  /*::[*/
  15: mr,
  /* FtGboData */
  /*::[*/
  16: mr,
  /* FtEdoData */
  /*::[*/
  17: mr,
  /* FtRboData */
  /*::[*/
  18: mr,
  /* FtCblsData */
  /*::[*/
  19: mr,
  /* FtLbsData */
  /*::[*/
  20: mr,
  /* FtCblsFmla */
  /*::[*/
  21: Mo
};
function jh(e, t) {
  for (var r = e.l + t, a = []; e.l < r; ) {
    var n = e.read_shift(2);
    e.l -= 2;
    try {
      a.push(Yh[n](e, r - e.l));
    } catch {
      return e.l = r, a;
    }
  }
  return e.l != r && (e.l = r), a;
}
function Sn(e, t) {
  var r = { BIFFVer: 0, dt: 0 };
  switch (r.BIFFVer = e.read_shift(2), t -= 2, t >= 2 && (r.dt = e.read_shift(2), e.l -= 2), r.BIFFVer) {
    case 1536:
    /* BIFF8 */
    case 1280:
    /* BIFF5 */
    case 1024:
    /* BIFF4 */
    case 768:
    /* BIFF3 */
    case 512:
    /* BIFF2 */
    case 2:
    case 7:
      break;
    default:
      if (t > 6) throw new Error("Unexpected BIFF Ver " + r.BIFFVer);
  }
  return e.read_shift(t), r;
}
function ms(e, t, r) {
  var a = 1536, n = 16;
  switch (r.bookType) {
    case "biff8":
      break;
    case "biff5":
      a = 1280, n = 8;
      break;
    case "biff4":
      a = 4, n = 6;
      break;
    case "biff3":
      a = 3, n = 6;
      break;
    case "biff2":
      a = 2, n = 4;
      break;
    case "xla":
      break;
    default:
      throw new Error("unsupported BIFF version");
  }
  var i = z(n);
  return i.write_shift(2, a), i.write_shift(2, t), n > 4 && i.write_shift(2, 29282), n > 6 && i.write_shift(2, 1997), n > 8 && (i.write_shift(2, 49161), i.write_shift(2, 1), i.write_shift(2, 1798), i.write_shift(2, 0)), i;
}
function Kh(e, t) {
  return t === 0 || e.read_shift(2), 1200;
}
function qh(e, t, r) {
  if (r.enc)
    return e.l += t, "";
  var a = e.l, n = ia(e, 0, r);
  return e.read_shift(t + a - e.l), n;
}
function $h(e, t) {
  var r = !t || t.biff == 8, a = z(r ? 112 : 54);
  for (a.write_shift(t.biff == 8 ? 2 : 1, 7), r && a.write_shift(1, 0), a.write_shift(4, 859007059), a.write_shift(4, 5458548 | (r ? 0 : 536870912)); a.l < a.length; ) a.write_shift(1, r ? 0 : 32);
  return a;
}
function Jh(e, t, r) {
  var a = r && r.biff == 8 || t == 2 ? e.read_shift(2) : (e.l += t, 0);
  return { fDialog: a & 16, fBelow: a & 64, fRight: a & 128 };
}
function Zh(e, t, r) {
  var a = e.read_shift(4), n = e.read_shift(1) & 3, i = e.read_shift(1);
  switch (i) {
    case 0:
      i = "Worksheet";
      break;
    case 1:
      i = "Macrosheet";
      break;
    case 2:
      i = "Chartsheet";
      break;
    case 6:
      i = "VBAModule";
      break;
  }
  var s = ln(e, 0, r);
  return s.length === 0 && (s = "Sheet1"), { pos: a, hs: n, dt: i, name: s };
}
function Qh(e, t) {
  var r = !t || t.biff >= 8 ? 2 : 1, a = z(8 + r * e.name.length);
  a.write_shift(4, e.pos), a.write_shift(1, e.hs || 0), a.write_shift(1, e.dt), a.write_shift(1, e.name.length), t.biff >= 8 && a.write_shift(1, 1), a.write_shift(r * e.name.length, e.name, t.biff < 8 ? "sbcs" : "utf16le");
  var n = a.slice(0, a.l);
  return n.l = a.l, n;
}
function ed(e, t) {
  for (var r = e.l + t, a = e.read_shift(4), n = e.read_shift(4), i = [], s = 0; s != n && e.l < r; ++s)
    i.push(Ih(e));
  return i.Count = a, i.Unique = n, i;
}
function rd(e, t) {
  var r = z(8);
  r.write_shift(4, e.Count), r.write_shift(4, e.Unique);
  for (var a = [], n = 0; n < e.length; ++n) a[n] = Lh(e[n]);
  var i = fr([r].concat(a));
  return i.parts = [r.length].concat(a.map(function(s) {
    return s.length;
  })), i;
}
function td(e, t) {
  var r = {};
  return r.dsst = e.read_shift(2), e.l += t - 2, r;
}
function ad(e) {
  var t = {};
  t.r = e.read_shift(2), t.c = e.read_shift(2), t.cnt = e.read_shift(2) - t.c;
  var r = e.read_shift(2);
  e.l += 4;
  var a = e.read_shift(1);
  return e.l += 3, a & 7 && (t.level = a & 7), a & 32 && (t.hidden = !0), a & 64 && (t.hpt = r / 20), t;
}
function nd(e) {
  var t = Uh(e);
  if (t.type != 2211) throw new Error("Invalid Future Record " + t.type);
  var r = e.read_shift(4);
  return r !== 0;
}
function id(e) {
  return e.read_shift(2), e.read_shift(4);
}
function V0(e, t, r) {
  var a = 0;
  r && r.biff == 2 || (a = e.read_shift(2));
  var n = e.read_shift(2);
  r && r.biff == 2 && (a = 1 - (n >> 15), n &= 32767);
  var i = { Unsynced: a & 1, DyZero: (a & 2) >> 1, ExAsc: (a & 4) >> 2, ExDsc: (a & 8) >> 3 };
  return [i, n];
}
function sd(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(2), n = e.read_shift(2), i = e.read_shift(2), s = e.read_shift(2), c = e.read_shift(2), o = e.read_shift(2), l = e.read_shift(2);
  return {
    Pos: [t, r],
    Dim: [a, n],
    Flags: i,
    CurTab: s,
    FirstTab: c,
    Selected: o,
    TabRatio: l
  };
}
function cd() {
  var e = z(18);
  return e.write_shift(2, 0), e.write_shift(2, 0), e.write_shift(2, 29280), e.write_shift(2, 17600), e.write_shift(2, 56), e.write_shift(2, 0), e.write_shift(2, 0), e.write_shift(2, 1), e.write_shift(2, 500), e;
}
function od(e, t, r) {
  if (r && r.biff >= 2 && r.biff < 5) return {};
  var a = e.read_shift(2);
  return { RTL: a & 64 };
}
function fd(e) {
  var t = z(18), r = 1718;
  return e && e.RTL && (r |= 64), t.write_shift(2, r), t.write_shift(4, 0), t.write_shift(4, 64), t.write_shift(4, 0), t.write_shift(4, 0), t;
}
function ld() {
}
function ud(e, t, r) {
  var a = {
    dyHeight: e.read_shift(2),
    fl: e.read_shift(2)
  };
  switch (r && r.biff || 8) {
    case 2:
      break;
    case 3:
    case 4:
      e.l += 2;
      break;
    default:
      e.l += 10;
      break;
  }
  return a.name = ln(e, 0, r), a;
}
function hd(e, t) {
  var r = e.name || "Arial", a = t && t.biff == 5, n = a ? 15 + r.length : 16 + 2 * r.length, i = z(n);
  return i.write_shift(2, e.sz * 20), i.write_shift(4, 0), i.write_shift(2, 400), i.write_shift(4, 0), i.write_shift(2, 0), i.write_shift(1, r.length), a || i.write_shift(1, 1), i.write_shift((a ? 1 : 2) * r.length, r, a ? "sbcs" : "utf16le"), i;
}
function dd(e) {
  var t = ut(e);
  return t.isst = e.read_shift(4), t;
}
function xd(e, t, r, a) {
  var n = z(10);
  return $t(e, t, a, n), n.write_shift(4, r), n;
}
function pd(e, t, r) {
  r.biffguess && r.biff == 2 && (r.biff = 5);
  var a = e.l + t, n = ut(e);
  r.biff == 2 && e.l++;
  var i = un(e, a - e.l, r);
  return n.val = i, n;
}
function md(e, t, r, a, n) {
  var i = !n || n.biff == 8, s = z(8 + +i + (1 + i) * r.length);
  return $t(e, t, a, s), s.write_shift(2, r.length), i && s.write_shift(1, 1), s.write_shift((1 + i) * r.length, r, i ? "utf16le" : "sbcs"), s;
}
function vd(e, t, r) {
  var a = e.read_shift(2), n = ia(e, 0, r);
  return [a, n];
}
function gd(e, t, r, a) {
  var n = r && r.biff == 5;
  a || (a = z(n ? 3 + t.length : 5 + 2 * t.length)), a.write_shift(2, e), a.write_shift(n ? 1 : 2, t.length), n || a.write_shift(1, 1), a.write_shift((n ? 1 : 2) * t.length, t, n ? "sbcs" : "utf16le");
  var i = a.length > a.l ? a.slice(0, a.l) : a;
  return i.l == null && (i.l = i.length), i;
}
var Ed = ia;
function z0(e, t, r) {
  var a = e.l + t, n = r.biff == 8 || !r.biff ? 4 : 2, i = e.read_shift(n), s = e.read_shift(n), c = e.read_shift(2), o = e.read_shift(2);
  return e.l = a, { s: { r: i, c }, e: { r: s, c: o } };
}
function _d(e, t) {
  var r = t.biff == 8 || !t.biff ? 4 : 2, a = z(2 * r + 6);
  return a.write_shift(r, e.s.r), a.write_shift(r, e.e.r + 1), a.write_shift(2, e.s.c), a.write_shift(2, e.e.c + 1), a.write_shift(2, 0), a;
}
function Td(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = Do(e);
  return { r: t, c: r, ixfe: a[0], rknum: a[1] };
}
function wd(e, t) {
  for (var r = e.l + t - 2, a = e.read_shift(2), n = e.read_shift(2), i = []; e.l < r; ) i.push(Do(e));
  if (e.l !== r) throw new Error("MulRK read error");
  var s = e.read_shift(2);
  if (i.length != s - n + 1) throw new Error("MulRK length mismatch");
  return { r: a, c: n, C: s, rkrec: i };
}
function yd(e, t) {
  for (var r = e.l + t - 2, a = e.read_shift(2), n = e.read_shift(2), i = []; e.l < r; ) i.push(e.read_shift(2));
  if (e.l !== r) throw new Error("MulBlank read error");
  var s = e.read_shift(2);
  if (i.length != s - n + 1) throw new Error("MulBlank length mismatch");
  return { r: a, c: n, C: s, ixfe: i };
}
function Sd(e, t, r, a) {
  var n = {}, i = e.read_shift(4), s = e.read_shift(4), c = e.read_shift(4), o = e.read_shift(2);
  return n.patternType = nh[c >> 26], a.cellStyles && (n.alc = i & 7, n.fWrap = i >> 3 & 1, n.alcV = i >> 4 & 7, n.fJustLast = i >> 7 & 1, n.trot = i >> 8 & 255, n.cIndent = i >> 16 & 15, n.fShrinkToFit = i >> 20 & 1, n.iReadOrder = i >> 22 & 2, n.fAtrNum = i >> 26 & 1, n.fAtrFnt = i >> 27 & 1, n.fAtrAlc = i >> 28 & 1, n.fAtrBdr = i >> 29 & 1, n.fAtrPat = i >> 30 & 1, n.fAtrProt = i >> 31 & 1, n.dgLeft = s & 15, n.dgRight = s >> 4 & 15, n.dgTop = s >> 8 & 15, n.dgBottom = s >> 12 & 15, n.icvLeft = s >> 16 & 127, n.icvRight = s >> 23 & 127, n.grbitDiag = s >> 30 & 3, n.icvTop = c & 127, n.icvBottom = c >> 7 & 127, n.icvDiag = c >> 14 & 127, n.dgDiag = c >> 21 & 15, n.icvFore = o & 127, n.icvBack = o >> 7 & 127, n.fsxButton = o >> 14 & 1), n;
}
function kd(e, t, r) {
  var a = {};
  return a.ifnt = e.read_shift(2), a.numFmtId = e.read_shift(2), a.flags = e.read_shift(2), a.fStyle = a.flags >> 2 & 1, t -= 6, a.data = Sd(e, t, a.fStyle, r), a;
}
function Y0(e, t, r, a) {
  var n = r && r.biff == 5;
  a || (a = z(n ? 16 : 20)), a.write_shift(2, 0), e.style ? (a.write_shift(2, e.numFmtId || 0), a.write_shift(2, 65524)) : (a.write_shift(2, e.numFmtId || 0), a.write_shift(2, t << 4));
  var i = 0;
  return e.numFmtId > 0 && n && (i |= 1024), a.write_shift(4, i), a.write_shift(4, 0), n || a.write_shift(4, 0), a.write_shift(2, 0), a;
}
function Fd(e) {
  e.l += 4;
  var t = [e.read_shift(2), e.read_shift(2)];
  if (t[0] !== 0 && t[0]--, t[1] !== 0 && t[1]--, t[0] > 7 || t[1] > 7) throw new Error("Bad Gutters: " + t.join("|"));
  return t;
}
function Ad(e) {
  var t = z(8);
  return t.write_shift(4, 0), t.write_shift(2, 0), t.write_shift(2, 0), t;
}
function j0(e, t, r) {
  var a = ut(e);
  (r.biff == 2 || t == 9) && ++e.l;
  var n = Oh(e);
  return a.val = n, a.t = n === !0 || n === !1 ? "b" : "e", a;
}
function Nd(e, t, r, a, n, i) {
  var s = z(8);
  return $t(e, t, a, s), Oo(r, i, s), s;
}
function Cd(e, t, r) {
  r.biffguess && r.biff == 2 && (r.biff = 5);
  var a = ut(e), n = _r(e);
  return a.val = n, a;
}
function Od(e, t, r, a) {
  var n = z(14);
  return $t(e, t, a, n), Kt(r, n), n;
}
var K0 = Xh;
function Id(e, t, r) {
  var a = e.l + t, n = e.read_shift(2), i = e.read_shift(2);
  if (r.sbcch = i, i == 1025 || i == 14849) return [i, n];
  if (i < 1 || i > 255) throw new Error("Unexpected SupBook type: " + i);
  for (var s = qt(e, i), c = []; a > e.l; ) c.push(un(e));
  return [i, n, s, c];
}
function q0(e, t, r) {
  var a = e.read_shift(2), n, i = {
    fBuiltIn: a & 1,
    fWantAdvise: a >>> 1 & 1,
    fWantPict: a >>> 2 & 1,
    fOle: a >>> 3 & 1,
    fOleLink: a >>> 4 & 1,
    cf: a >>> 5 & 1023,
    fIcon: a >>> 15 & 1
  };
  return r.sbcch === 14849 && (n = Hh(e, t - 2, r)), i.body = n || e.read_shift(t - 2), typeof n == "string" && (i.Name = n), i;
}
var Ld = [
  "_xlnm.Consolidate_Area",
  "_xlnm.Auto_Open",
  "_xlnm.Auto_Close",
  "_xlnm.Extract",
  "_xlnm.Database",
  "_xlnm.Criteria",
  "_xlnm.Print_Area",
  "_xlnm.Print_Titles",
  "_xlnm.Recorder",
  "_xlnm.Data_Form",
  "_xlnm.Auto_Activate",
  "_xlnm.Auto_Deactivate",
  "_xlnm.Sheet_Title",
  "_xlnm._FilterDatabase"
];
function $0(e, t, r) {
  var a = e.l + t, n = e.read_shift(2), i = e.read_shift(1), s = e.read_shift(1), c = e.read_shift(r && r.biff == 2 ? 1 : 2), o = 0;
  (!r || r.biff >= 5) && (r.biff != 5 && (e.l += 2), o = e.read_shift(2), r.biff == 5 && (e.l += 2), e.l += 4);
  var l = qt(e, s, r);
  n & 32 && (l = Ld[l.charCodeAt(0)]);
  var f = a - e.l;
  r && r.biff == 2 && --f;
  var d = a == e.l || c === 0 || !(f > 0) ? [] : jm(e, f, r, c);
  return {
    chKey: i,
    Name: l,
    itab: o,
    rgce: d
  };
}
function Bo(e, t, r) {
  if (r.biff < 8) return Rd(e, t, r);
  for (var a = [], n = e.l + t, i = e.read_shift(r.biff > 8 ? 4 : 2); i-- !== 0; ) a.push(Wh(e, r.biff > 8 ? 12 : 6, r));
  if (e.l != n) throw new Error("Bad ExternSheet: " + e.l + " != " + n);
  return a;
}
function Rd(e, t, r) {
  e[e.l + 1] == 3 && e[e.l]++;
  var a = ln(e, t, r);
  return a.charCodeAt(0) == 3 ? a.slice(1) : a;
}
function Dd(e, t, r) {
  if (r.biff < 8) {
    e.l += t;
    return;
  }
  var a = e.read_shift(2), n = e.read_shift(2), i = qt(e, a, r), s = qt(e, n, r);
  return [i, s];
}
function bd(e, t, r) {
  var a = Po(e);
  e.l++;
  var n = e.read_shift(1);
  return t -= 8, [Km(e, t, r), n, a];
}
function J0(e, t, r) {
  var a = Gh(e);
  switch (r.biff) {
    case 2:
      e.l++, t -= 7;
      break;
    case 3:
    case 4:
      e.l += 2, t -= 8;
      break;
    default:
      e.l += 6, t -= 12;
  }
  return [a, zm(e, t, r)];
}
function Pd(e) {
  var t = e.read_shift(4) !== 0, r = e.read_shift(4) !== 0, a = e.read_shift(4);
  return [t, r, a];
}
function Md(e, t, r) {
  if (!(r.biff < 8)) {
    var a = e.read_shift(2), n = e.read_shift(2), i = e.read_shift(2), s = e.read_shift(2), c = ia(e, 0, r);
    return r.biff < 8 && e.read_shift(1), [{ r: a, c: n }, c, s, i];
  }
}
function Bd(e, t, r) {
  return Md(e, t, r);
}
function Ud(e, t) {
  for (var r = [], a = e.read_shift(2); a--; ) r.push(qn(e));
  return r;
}
function Xd(e) {
  var t = z(2 + e.length * 8);
  t.write_shift(2, e.length);
  for (var r = 0; r < e.length; ++r) bo(e[r], t);
  return t;
}
function Wd(e, t, r) {
  if (r && r.biff < 8) return Gd(e, t, r);
  var a = Mo(e), n = jh(e, t - 22, a[1]);
  return { cmo: a, ft: n };
}
var Hd = {
  8: function(e, t) {
    var r = e.l + t;
    e.l += 10;
    var a = e.read_shift(2);
    e.l += 4, e.l += 2, e.l += 2, e.l += 2, e.l += 4;
    var n = e.read_shift(1);
    return e.l += n, e.l = r, { fmt: a };
  }
};
function Gd(e, t, r) {
  e.l += 4;
  var a = e.read_shift(2), n = e.read_shift(2), i = e.read_shift(2);
  e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 2, e.l += 6, t -= 36;
  var s = [];
  return s.push((Hd[a] || yr)(e, t, r)), { cmo: [n, a, i], ft: s };
}
function Vd(e, t, r) {
  var a = e.l, n = "";
  try {
    e.l += 4;
    var i = (r.lastobj || { cmo: [0, 0] }).cmo[1], s;
    [0, 5, 7, 11, 12, 14].indexOf(i) == -1 ? e.l += 6 : s = Rh(e, 6, r);
    var c = e.read_shift(2);
    e.read_shift(2), ar(e, 2);
    var o = e.read_shift(2);
    e.l += o;
    for (var l = 1; l < e.lens.length - 1; ++l) {
      if (e.l - a != e.lens[l]) throw new Error("TxO: bad continue record");
      var f = e[e.l], d = qt(e, e.lens[l + 1] - e.lens[l] - 1);
      if (n += d, n.length >= (f ? c : 2 * c)) break;
    }
    if (n.length !== c && n.length !== c * 2)
      throw new Error("cchText: " + c + " != " + n.length);
    return e.l = a + t, { t: n };
  } catch {
    return e.l = a + t, { t: n };
  }
}
function zd(e, t) {
  var r = qn(e);
  e.l += 16;
  var a = Mh(e, t - 24);
  return [r, a];
}
function Yd(e) {
  var t = z(24), r = Ye(e[0]);
  t.write_shift(2, r.r), t.write_shift(2, r.r), t.write_shift(2, r.c), t.write_shift(2, r.c);
  for (var a = "d0 c9 ea 79 f9 ba ce 11 8c 82 00 aa 00 4b a9 0b".split(" "), n = 0; n < 16; ++n) t.write_shift(1, parseInt(a[n], 16));
  return fr([t, Bh(e[1])]);
}
function jd(e, t) {
  e.read_shift(2);
  var r = qn(e), a = e.read_shift((t - 10) / 2, "dbcs-cont");
  return a = a.replace(Tr, ""), [r, a];
}
function Kd(e) {
  var t = e[1].Tooltip, r = z(10 + 2 * (t.length + 1));
  r.write_shift(2, 2048);
  var a = Ye(e[0]);
  r.write_shift(2, a.r), r.write_shift(2, a.r), r.write_shift(2, a.c), r.write_shift(2, a.c);
  for (var n = 0; n < t.length; ++n) r.write_shift(2, t.charCodeAt(n));
  return r.write_shift(2, 0), r;
}
function qd(e) {
  var t = [0, 0], r;
  return r = e.read_shift(2), t[0] = b0[r] || r, r = e.read_shift(2), t[1] = b0[r] || r, t;
}
function $d(e) {
  return e || (e = z(4)), e.write_shift(2, 1), e.write_shift(2, 1), e;
}
function Jd(e) {
  for (var t = e.read_shift(2), r = []; t-- > 0; ) r.push(Ro(e));
  return r;
}
function Zd(e) {
  for (var t = e.read_shift(2), r = []; t-- > 0; ) r.push(Ro(e));
  return r;
}
function Qd(e) {
  e.l += 2;
  var t = { cxfs: 0, crc: 0 };
  return t.cxfs = e.read_shift(2), t.crc = e.read_shift(4), t;
}
function Uo(e, t, r) {
  if (!r.cellStyles) return yr(e, t);
  var a = r && r.biff >= 12 ? 4 : 2, n = e.read_shift(a), i = e.read_shift(a), s = e.read_shift(a), c = e.read_shift(a), o = e.read_shift(2);
  a == 2 && (e.l += 2);
  var l = { s: n, e: i, w: s, ixfe: c, flags: o };
  return (r.biff >= 5 || !r.biff) && (l.level = o >> 8 & 7), l;
}
function e1(e, t) {
  var r = z(12);
  r.write_shift(2, t), r.write_shift(2, t), r.write_shift(2, e.width * 256), r.write_shift(2, 0);
  var a = 0;
  return e.hidden && (a |= 1), r.write_shift(1, a), a = e.level || 0, r.write_shift(1, a), r.write_shift(2, 0), r;
}
function r1(e, t) {
  var r = {};
  return t < 32 || (e.l += 16, r.header = _r(e), r.footer = _r(e), e.l += 2), r;
}
function t1(e, t, r) {
  var a = { area: !1 };
  if (r.biff != 5)
    return e.l += t, a;
  var n = e.read_shift(1);
  return e.l += 3, n & 16 && (a.area = !0), a;
}
function a1(e) {
  for (var t = z(2 * e), r = 0; r < e; ++r) t.write_shift(2, r + 1);
  return t;
}
var n1 = ut, i1 = Co, s1 = un;
function c1(e) {
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(4), n = { fmt: t, env: r, len: a, data: e.slice(e.l, e.l + a) };
  return e.l += a, n;
}
function o1(e, t, r) {
  r.biffguess && r.biff == 5 && (r.biff = 2);
  var a = ut(e);
  ++e.l;
  var n = ia(e, t - 7, r);
  return a.t = "str", a.val = n, a;
}
function f1(e) {
  var t = ut(e);
  ++e.l;
  var r = _r(e);
  return t.t = "n", t.val = r, t;
}
function l1(e, t, r) {
  var a = z(15);
  return pn(a, e, t), a.write_shift(8, r, "f"), a;
}
function u1(e) {
  var t = ut(e);
  ++e.l;
  var r = e.read_shift(2);
  return t.t = "n", t.val = r, t;
}
function h1(e, t, r) {
  var a = z(9);
  return pn(a, e, t), a.write_shift(2, r), a;
}
function d1(e) {
  var t = e.read_shift(1);
  return t === 0 ? (e.l++, "") : e.read_shift(t, "sbcs-cont");
}
function x1(e, t) {
  e.l += 6, e.l += 2, e.l += 1, e.l += 3, e.l += 1, e.l += t - 13;
}
function p1(e, t, r) {
  var a = e.l + t, n = ut(e), i = e.read_shift(2), s = qt(e, i, r);
  return e.l = a, n.t = "str", n.val = s, n;
}
var m1 = [2, 3, 48, 49, 131, 139, 140, 245], Ui = /* @__PURE__ */ (function() {
  var e = {
    /* Code Pages Supported by Visual FoxPro */
    /*::[*/
    1: 437,
    /*::[*/
    2: 850,
    /*::[*/
    3: 1252,
    /*::[*/
    4: 1e4,
    /*::[*/
    100: 852,
    /*::[*/
    101: 866,
    /*::[*/
    102: 865,
    /*::[*/
    103: 861,
    /*::[*/
    104: 895,
    /*::[*/
    105: 620,
    /*::[*/
    106: 737,
    /*::[*/
    107: 857,
    /*::[*/
    120: 950,
    /*::[*/
    121: 949,
    /*::[*/
    122: 936,
    /*::[*/
    123: 932,
    /*::[*/
    124: 874,
    /*::[*/
    125: 1255,
    /*::[*/
    126: 1256,
    /*::[*/
    150: 10007,
    /*::[*/
    151: 10029,
    /*::[*/
    152: 10006,
    /*::[*/
    200: 1250,
    /*::[*/
    201: 1251,
    /*::[*/
    202: 1254,
    /*::[*/
    203: 1253,
    /* shapefile DBF extension */
    /*::[*/
    0: 20127,
    /*::[*/
    8: 865,
    /*::[*/
    9: 437,
    /*::[*/
    10: 850,
    /*::[*/
    11: 437,
    /*::[*/
    13: 437,
    /*::[*/
    14: 850,
    /*::[*/
    15: 437,
    /*::[*/
    16: 850,
    /*::[*/
    17: 437,
    /*::[*/
    18: 850,
    /*::[*/
    19: 932,
    /*::[*/
    20: 850,
    /*::[*/
    21: 437,
    /*::[*/
    22: 850,
    /*::[*/
    23: 865,
    /*::[*/
    24: 437,
    /*::[*/
    25: 437,
    /*::[*/
    26: 850,
    /*::[*/
    27: 437,
    /*::[*/
    28: 863,
    /*::[*/
    29: 850,
    /*::[*/
    31: 852,
    /*::[*/
    34: 852,
    /*::[*/
    35: 852,
    /*::[*/
    36: 860,
    /*::[*/
    37: 850,
    /*::[*/
    38: 866,
    /*::[*/
    55: 850,
    /*::[*/
    64: 852,
    /*::[*/
    77: 936,
    /*::[*/
    78: 949,
    /*::[*/
    79: 950,
    /*::[*/
    80: 874,
    /*::[*/
    87: 1252,
    /*::[*/
    88: 1252,
    /*::[*/
    89: 1252,
    /*::[*/
    108: 863,
    /*::[*/
    134: 737,
    /*::[*/
    135: 852,
    /*::[*/
    136: 857,
    /*::[*/
    204: 1257,
    /*::[*/
    255: 16969
  }, t = zn({
    /*::[*/
    1: 437,
    /*::[*/
    2: 850,
    /*::[*/
    3: 1252,
    /*::[*/
    4: 1e4,
    /*::[*/
    100: 852,
    /*::[*/
    101: 866,
    /*::[*/
    102: 865,
    /*::[*/
    103: 861,
    /*::[*/
    104: 895,
    /*::[*/
    105: 620,
    /*::[*/
    106: 737,
    /*::[*/
    107: 857,
    /*::[*/
    120: 950,
    /*::[*/
    121: 949,
    /*::[*/
    122: 936,
    /*::[*/
    123: 932,
    /*::[*/
    124: 874,
    /*::[*/
    125: 1255,
    /*::[*/
    126: 1256,
    /*::[*/
    150: 10007,
    /*::[*/
    151: 10029,
    /*::[*/
    152: 10006,
    /*::[*/
    200: 1250,
    /*::[*/
    201: 1251,
    /*::[*/
    202: 1254,
    /*::[*/
    203: 1253,
    /*::[*/
    0: 20127
  });
  function r(c, o) {
    var l = [], f = Ot(1);
    switch (o.type) {
      case "base64":
        f = Dr(Mr(c));
        break;
      case "binary":
        f = Dr(c);
        break;
      case "buffer":
      case "array":
        f = c;
        break;
    }
    dr(f, 0);
    var d = f.read_shift(1), h = !!(d & 136), p = !1, m = !1;
    switch (d) {
      case 2:
        break;
      // dBASE II
      case 3:
        break;
      // dBASE III
      case 48:
        p = !0, h = !0;
        break;
      // VFP
      case 49:
        p = !0, h = !0;
        break;
      // VFP with autoincrement
      // 0x43 dBASE IV SQL table files
      // 0x63 dBASE IV SQL system files
      case 131:
        break;
      // dBASE III with memo
      case 139:
        break;
      // dBASE IV with memo
      case 140:
        m = !0;
        break;
      // dBASE Level 7 with memo
      // case 0xCB dBASE IV SQL table files with memo
      case 245:
        break;
      // FoxPro 2.x with memo
      // case 0xFB FoxBASE
      default:
        throw new Error("DBF Unsupported Version: " + d.toString(16));
    }
    var x = 0, u = 521;
    d == 2 && (x = f.read_shift(2)), f.l += 3, d != 2 && (x = f.read_shift(4)), x > 1048576 && (x = 1e6), d != 2 && (u = f.read_shift(2));
    var v = f.read_shift(2), E = o.codepage || 1252;
    d != 2 && (f.l += 16, f.read_shift(1), f[f.l] !== 0 && (E = e[f[f.l]]), f.l += 1, f.l += 2), m && (f.l += 36);
    for (var g = [], y = {}, N = Math.min(f.length, d == 2 ? 521 : u - 10 - (p ? 264 : 0)), A = m ? 32 : 11; f.l < N && f[f.l] != 13; )
      switch (y = {}, y.name = Ce.utils.decode(E, f.slice(f.l, f.l + A)).replace(/[\u0000\r\n].*$/g, ""), f.l += A, y.type = String.fromCharCode(f.read_shift(1)), d != 2 && !m && (y.offset = f.read_shift(4)), y.len = f.read_shift(1), d == 2 && (y.offset = f.read_shift(2)), y.dec = f.read_shift(1), y.name.length && g.push(y), d != 2 && (f.l += m ? 13 : 14), y.type) {
        case "B":
          (!p || y.len != 8) && o.WTF && console.log("Skipping " + y.name + ":" + y.type);
          break;
        case "G":
        // General (FoxPro and dBASE L7)
        case "P":
          o.WTF && console.log("Skipping " + y.name + ":" + y.type);
          break;
        case "+":
        // Autoincrement (dBASE L7 only)
        case "0":
        // _NullFlags (VFP only)
        case "@":
        // Timestamp (dBASE L7 only)
        case "C":
        // Character (dBASE II)
        case "D":
        // Date (dBASE III)
        case "F":
        // Float (dBASE IV)
        case "I":
        // Long (VFP and dBASE L7)
        case "L":
        // Logical (dBASE II)
        case "M":
        // Memo (dBASE III)
        case "N":
        // Number (dBASE II)
        case "O":
        // Double (dBASE L7 only)
        case "T":
        // Datetime (VFP only)
        case "Y":
          break;
        default:
          throw new Error("Unknown Field Type: " + y.type);
      }
    if (f[f.l] !== 13 && (f.l = u - 1), f.read_shift(1) !== 13) throw new Error("DBF Terminator not found " + f.l + " " + f[f.l]);
    f.l = u;
    var w = 0, P = 0;
    for (l[0] = [], P = 0; P != g.length; ++P) l[0][P] = g[P].name;
    for (; x-- > 0; ) {
      if (f[f.l] === 42) {
        f.l += v;
        continue;
      }
      for (++f.l, l[++w] = [], P = 0, P = 0; P != g.length; ++P) {
        var L = f.slice(f.l, f.l + g[P].len);
        f.l += g[P].len, dr(L, 0);
        var U = Ce.utils.decode(E, L);
        switch (g[P].type) {
          case "C":
            U.trim().length && (l[w][P] = U.replace(/\s+$/, ""));
            break;
          case "D":
            U.length === 8 ? l[w][P] = new Date(+U.slice(0, 4), +U.slice(4, 6) - 1, +U.slice(6, 8)) : l[w][P] = U;
            break;
          case "F":
            l[w][P] = parseFloat(U.trim());
            break;
          case "+":
          case "I":
            l[w][P] = m ? L.read_shift(-4, "i") ^ 2147483648 : L.read_shift(4, "i");
            break;
          case "L":
            switch (U.trim().toUpperCase()) {
              case "Y":
              case "T":
                l[w][P] = !0;
                break;
              case "N":
              case "F":
                l[w][P] = !1;
                break;
              case "":
              case "?":
                break;
              default:
                throw new Error("DBF Unrecognized L:|" + U + "|");
            }
            break;
          case "M":
            if (!h) throw new Error("DBF Unexpected MEMO for type " + d.toString(16));
            l[w][P] = "##MEMO##" + (m ? parseInt(U.trim(), 10) : L.read_shift(4));
            break;
          case "N":
            U = U.replace(/\u0000/g, "").trim(), U && U != "." && (l[w][P] = +U || 0);
            break;
          case "@":
            l[w][P] = new Date(L.read_shift(-8, "f") - 621356832e5);
            break;
          case "T":
            l[w][P] = new Date((L.read_shift(4) - 2440588) * 864e5 + L.read_shift(4));
            break;
          case "Y":
            l[w][P] = L.read_shift(4, "i") / 1e4 + L.read_shift(4, "i") / 1e4 * Math.pow(2, 32);
            break;
          case "O":
            l[w][P] = -L.read_shift(-8, "f");
            break;
          case "B":
            if (p && g[P].len == 8) {
              l[w][P] = L.read_shift(8, "f");
              break;
            }
          /* falls through */
          case "G":
          case "P":
            L.l += g[P].len;
            break;
          case "0":
            if (g[P].name === "_NullFlags") break;
          /* falls through */
          default:
            throw new Error("DBF Unsupported data type " + g[P].type);
        }
      }
    }
    if (d != 2 && f.l < f.length && f[f.l++] != 26) throw new Error("DBF EOF Marker missing " + (f.l - 1) + " of " + f.length + " " + f[f.l - 1].toString(16));
    return o && o.sheetRows && (l = l.slice(0, o.sheetRows)), o.DBF = g, l;
  }
  function a(c, o) {
    var l = o || {};
    l.dateNF || (l.dateNF = "yyyymmdd");
    var f = Ta(r(c, l), l);
    return f["!cols"] = l.DBF.map(function(d) {
      return {
        wch: d.len,
        DBF: d
      };
    }), delete l.DBF, f;
  }
  function n(c, o) {
    try {
      return bt(a(c, o), o);
    } catch (l) {
      if (o && o.WTF) throw l;
    }
    return { SheetNames: [], Sheets: {} };
  }
  var i = { B: 8, C: 250, L: 1, D: 8, "?": 0, "": 0 };
  function s(c, o) {
    var l = o || {};
    if (+l.codepage >= 0 && jr(+l.codepage), l.type == "string") throw new Error("Cannot write DBF to JS string");
    var f = Ir(), d = Hn(c, { header: 1, raw: !0, cellDates: !0 }), h = d[0], p = d.slice(1), m = c["!cols"] || [], x = 0, u = 0, v = 0, E = 1;
    for (x = 0; x < h.length; ++x) {
      if (((m[x] || {}).DBF || {}).name) {
        h[x] = m[x].DBF.name, ++v;
        continue;
      }
      if (h[x] != null) {
        if (++v, typeof h[x] == "number" && (h[x] = h[x].toString(10)), typeof h[x] != "string") throw new Error("DBF Invalid column name " + h[x] + " |" + typeof h[x] + "|");
        if (h.indexOf(h[x]) !== x) {
          for (u = 0; u < 1024; ++u)
            if (h.indexOf(h[x] + "_" + u) == -1) {
              h[x] += "_" + u;
              break;
            }
        }
      }
    }
    var g = Ae(c["!ref"]), y = [], N = [], A = [];
    for (x = 0; x <= g.e.c - g.s.c; ++x) {
      var w = "", P = "", L = 0, U = [];
      for (u = 0; u < p.length; ++u)
        p[u][x] != null && U.push(p[u][x]);
      if (U.length == 0 || h[x] == null) {
        y[x] = "?";
        continue;
      }
      for (u = 0; u < U.length; ++u) {
        switch (typeof U[u]) {
          /* TODO: check if L2 compat is desired */
          case "number":
            P = "B";
            break;
          case "string":
            P = "C";
            break;
          case "boolean":
            P = "L";
            break;
          case "object":
            P = U[u] instanceof Date ? "D" : "C";
            break;
          default:
            P = "C";
        }
        L = Math.max(L, String(U[u]).length), w = w && w != P ? "C" : P;
      }
      L > 250 && (L = 250), P = ((m[x] || {}).DBF || {}).type, P == "C" && m[x].DBF.len > L && (L = m[x].DBF.len), w == "B" && P == "N" && (w = "N", A[x] = m[x].DBF.dec, L = m[x].DBF.len), N[x] = w == "C" || P == "N" ? L : i[w] || 0, E += N[x], y[x] = w;
    }
    var M = f.next(32);
    for (M.write_shift(4, 318902576), M.write_shift(4, p.length), M.write_shift(2, 296 + 32 * v), M.write_shift(2, E), x = 0; x < 4; ++x) M.write_shift(4, 0);
    for (M.write_shift(4, 0 | (+t[
      /*::String(*/
      zt
      /*::)*/
    ] || 3) << 8), x = 0, u = 0; x < h.length; ++x)
      if (h[x] != null) {
        var b = f.next(32), K = (h[x].slice(-10) + "\0\0\0\0\0\0\0\0\0\0\0").slice(0, 11);
        b.write_shift(1, K, "sbcs"), b.write_shift(1, y[x] == "?" ? "C" : y[x], "sbcs"), b.write_shift(4, u), b.write_shift(1, N[x] || i[y[x]] || 0), b.write_shift(1, A[x] || 0), b.write_shift(1, 2), b.write_shift(4, 0), b.write_shift(1, 0), b.write_shift(4, 0), b.write_shift(4, 0), u += N[x] || i[y[x]] || 0;
      }
    var se = f.next(264);
    for (se.write_shift(4, 13), x = 0; x < 65; ++x) se.write_shift(4, 0);
    for (x = 0; x < p.length; ++x) {
      var re = f.next(E);
      for (re.write_shift(1, 0), u = 0; u < h.length; ++u)
        if (h[u] != null)
          switch (y[u]) {
            case "L":
              re.write_shift(1, p[x][u] == null ? 63 : p[x][u] ? 84 : 70);
              break;
            case "B":
              re.write_shift(8, p[x][u] || 0, "f");
              break;
            case "N":
              var ue = "0";
              for (typeof p[x][u] == "number" && (ue = p[x][u].toFixed(A[u] || 0)), v = 0; v < N[u] - ue.length; ++v) re.write_shift(1, 32);
              re.write_shift(1, ue, "sbcs");
              break;
            case "D":
              p[x][u] ? (re.write_shift(4, ("0000" + p[x][u].getFullYear()).slice(-4), "sbcs"), re.write_shift(2, ("00" + (p[x][u].getMonth() + 1)).slice(-2), "sbcs"), re.write_shift(2, ("00" + p[x][u].getDate()).slice(-2), "sbcs")) : re.write_shift(8, "00000000", "sbcs");
              break;
            case "C":
              var oe = String(p[x][u] != null ? p[x][u] : "").slice(0, N[u]);
              for (re.write_shift(1, oe, "sbcs"), v = 0; v < N[u] - oe.length; ++v) re.write_shift(1, 32);
              break;
          }
    }
    return f.next(1).write_shift(1, 26), f.end();
  }
  return {
    to_workbook: n,
    to_sheet: a,
    from_sheet: s
  };
})(), Xo = /* @__PURE__ */ (function() {
  var e = {
    AA: "À",
    BA: "Á",
    CA: "Â",
    DA: 195,
    HA: "Ä",
    JA: 197,
    AE: "È",
    BE: "É",
    CE: "Ê",
    HE: "Ë",
    AI: "Ì",
    BI: "Í",
    CI: "Î",
    HI: "Ï",
    AO: "Ò",
    BO: "Ó",
    CO: "Ô",
    DO: 213,
    HO: "Ö",
    AU: "Ù",
    BU: "Ú",
    CU: "Û",
    HU: "Ü",
    Aa: "à",
    Ba: "á",
    Ca: "â",
    Da: 227,
    Ha: "ä",
    Ja: 229,
    Ae: "è",
    Be: "é",
    Ce: "ê",
    He: "ë",
    Ai: "ì",
    Bi: "í",
    Ci: "î",
    Hi: "ï",
    Ao: "ò",
    Bo: "ó",
    Co: "ô",
    Do: 245,
    Ho: "ö",
    Au: "ù",
    Bu: "ú",
    Cu: "û",
    Hu: "ü",
    KC: "Ç",
    Kc: "ç",
    q: "æ",
    z: "œ",
    a: "Æ",
    j: "Œ",
    DN: 209,
    Dn: 241,
    Hy: 255,
    S: 169,
    c: 170,
    R: 174,
    "B ": 180,
    /*::[*/
    0: 176,
    /*::[*/
    1: 177,
    /*::[*/
    2: 178,
    /*::[*/
    3: 179,
    /*::[*/
    5: 181,
    /*::[*/
    6: 182,
    /*::[*/
    7: 183,
    Q: 185,
    k: 186,
    b: 208,
    i: 216,
    l: 222,
    s: 240,
    y: 248,
    "!": 161,
    '"': 162,
    "#": 163,
    "(": 164,
    "%": 165,
    "'": 167,
    "H ": 168,
    "+": 171,
    ";": 187,
    "<": 188,
    "=": 189,
    ">": 190,
    "?": 191,
    "{": 223
  }, t = new RegExp("\x1BN(" + $e(e).join("|").replace(/\|\|\|/, "|\\||").replace(/([?()+])/g, "\\$1") + "|\\|)", "gm"), r = function(h, p) {
    var m = e[p];
    return typeof m == "number" ? Ii(m) : m;
  }, a = function(h, p, m) {
    var x = p.charCodeAt(0) - 32 << 4 | m.charCodeAt(0) - 48;
    return x == 59 ? h : Ii(x);
  };
  e["|"] = 254;
  function n(h, p) {
    switch (p.type) {
      case "base64":
        return i(Mr(h), p);
      case "binary":
        return i(h, p);
      case "buffer":
        return i(ye && Buffer.isBuffer(h) ? h.toString("binary") : Dt(h), p);
      case "array":
        return i(jt(h), p);
    }
    throw new Error("Unrecognized type " + p.type);
  }
  function i(h, p) {
    var m = h.split(/[\n\r]+/), x = -1, u = -1, v = 0, E = 0, g = [], y = [], N = null, A = {}, w = [], P = [], L = [], U = 0, M;
    for (+p.codepage >= 0 && jr(+p.codepage); v !== m.length; ++v) {
      U = 0;
      var b = m[v].trim().replace(/\x1B([\x20-\x2F])([\x30-\x3F])/g, a).replace(t, r), K = b.replace(/;;/g, "\0").split(";").map(function(D) {
        return D.replace(/\u0000/g, ";");
      }), se = K[0], re;
      if (b.length > 0) switch (se) {
        case "ID":
          break;
        /* header */
        case "E":
          break;
        /* EOF */
        case "B":
          break;
        /* dimensions */
        case "O":
          break;
        /* options? */
        case "W":
          break;
        /* window? */
        case "P":
          K[1].charAt(0) == "P" && y.push(b.slice(3).replace(/;;/g, ";"));
          break;
        case "C":
          var ue = !1, oe = !1, Le = !1, G = !1, xe = -1, ve = -1;
          for (E = 1; E < K.length; ++E) switch (K[E].charAt(0)) {
            case "A":
              break;
            // TODO: comment
            case "X":
              u = parseInt(K[E].slice(1)) - 1, oe = !0;
              break;
            case "Y":
              for (x = parseInt(K[E].slice(1)) - 1, oe || (u = 0), M = g.length; M <= x; ++M) g[M] = [];
              break;
            case "K":
              re = K[E].slice(1), re.charAt(0) === '"' ? re = re.slice(1, re.length - 1) : re === "TRUE" ? re = !0 : re === "FALSE" ? re = !1 : isNaN(et(re)) ? isNaN(ma(re).getDate()) || (re = Ge(re)) : (re = et(re), N !== null && Qt(N) && (re = jn(re))), typeof Ce < "u" && typeof re == "string" && (p || {}).type != "string" && (p || {}).codepage && (re = Ce.utils.decode(p.codepage, re)), ue = !0;
              break;
            case "E":
              G = !0;
              var O = xa(K[E].slice(1), { r: x, c: u });
              g[x][u] = [g[x][u], O];
              break;
            case "S":
              Le = !0, g[x][u] = [g[x][u], "S5S"];
              break;
            case "G":
              break;
            // unknown
            case "R":
              xe = parseInt(K[E].slice(1)) - 1;
              break;
            case "C":
              ve = parseInt(K[E].slice(1)) - 1;
              break;
            default:
              if (p && p.WTF) throw new Error("SYLK bad record " + b);
          }
          if (ue && (g[x][u] && g[x][u].length == 2 ? g[x][u][0] = re : g[x][u] = re, N = null), Le) {
            if (G) throw new Error("SYLK shared formula cannot have own formula");
            var B = xe > -1 && g[xe][ve];
            if (!B || !B[1]) throw new Error("SYLK shared formula cannot find base");
            g[x][u][1] = nf(B[1], { r: x - xe, c: u - ve });
          }
          break;
        case "F":
          var R = 0;
          for (E = 1; E < K.length; ++E) switch (K[E].charAt(0)) {
            case "X":
              u = parseInt(K[E].slice(1)) - 1, ++R;
              break;
            case "Y":
              for (x = parseInt(K[E].slice(1)) - 1, M = g.length; M <= x; ++M) g[M] = [];
              break;
            case "M":
              U = parseInt(K[E].slice(1)) / 20;
              break;
            case "F":
              break;
            /* ??? */
            case "G":
              break;
            /* hide grid */
            case "P":
              N = y[parseInt(K[E].slice(1))];
              break;
            case "S":
              break;
            /* cell style */
            case "D":
              break;
            /* column */
            case "N":
              break;
            /* font */
            case "W":
              for (L = K[E].slice(1).split(" "), M = parseInt(L[0], 10); M <= parseInt(L[1], 10); ++M)
                U = parseInt(L[2], 10), P[M - 1] = U === 0 ? { hidden: !0 } : { wch: U }, It(P[M - 1]);
              break;
            case "C":
              u = parseInt(K[E].slice(1)) - 1, P[u] || (P[u] = {});
              break;
            case "R":
              x = parseInt(K[E].slice(1)) - 1, w[x] || (w[x] = {}), U > 0 ? (w[x].hpt = U, w[x].hpx = ga(U)) : U === 0 && (w[x].hidden = !0);
              break;
            default:
              if (p && p.WTF) throw new Error("SYLK bad record " + b);
          }
          R < 1 && (N = null);
          break;
        default:
          if (p && p.WTF) throw new Error("SYLK bad record " + b);
      }
    }
    return w.length > 0 && (A["!rows"] = w), P.length > 0 && (A["!cols"] = P), p && p.sheetRows && (g = g.slice(0, p.sheetRows)), [g, A];
  }
  function s(h, p) {
    var m = n(h, p), x = m[0], u = m[1], v = Ta(x, p);
    return $e(u).forEach(function(E) {
      v[E] = u[E];
    }), v;
  }
  function c(h, p) {
    return bt(s(h, p), p);
  }
  function o(h, p, m, x) {
    var u = "C;Y" + (m + 1) + ";X" + (x + 1) + ";K";
    switch (h.t) {
      case "n":
        u += h.v || 0, h.f && !h.F && (u += ";E" + ws(h.f, { r: m, c: x }));
        break;
      case "b":
        u += h.v ? "TRUE" : "FALSE";
        break;
      case "e":
        u += h.w || h.v;
        break;
      case "d":
        u += '"' + (h.w || h.v) + '"';
        break;
      case "s":
        u += '"' + h.v.replace(/"/g, "").replace(/;/g, ";;") + '"';
        break;
    }
    return u;
  }
  function l(h, p) {
    p.forEach(function(m, x) {
      var u = "F;W" + (x + 1) + " " + (x + 1) + " ";
      m.hidden ? u += "0" : (typeof m.width == "number" && !m.wpx && (m.wpx = en(m.width)), typeof m.wpx == "number" && !m.wch && (m.wch = rn(m.wpx)), typeof m.wch == "number" && (u += Math.round(m.wch))), u.charAt(u.length - 1) != " " && h.push(u);
    });
  }
  function f(h, p) {
    p.forEach(function(m, x) {
      var u = "F;";
      m.hidden ? u += "M0;" : m.hpt ? u += "M" + 20 * m.hpt + ";" : m.hpx && (u += "M" + 20 * tn(m.hpx) + ";"), u.length > 2 && h.push(u + "R" + (x + 1));
    });
  }
  function d(h, p) {
    var m = ["ID;PWXL;N;E"], x = [], u = Ae(h["!ref"]), v, E = Array.isArray(h), g = `\r
`;
    m.push("P;PGeneral"), m.push("F;P0;DG0G8;M255"), h["!cols"] && l(m, h["!cols"]), h["!rows"] && f(m, h["!rows"]), m.push("B;Y" + (u.e.r - u.s.r + 1) + ";X" + (u.e.c - u.s.c + 1) + ";D" + [u.s.c, u.s.r, u.e.c, u.e.r].join(" "));
    for (var y = u.s.r; y <= u.e.r; ++y)
      for (var N = u.s.c; N <= u.e.c; ++N) {
        var A = me({ r: y, c: N });
        v = E ? (h[y] || [])[N] : h[A], !(!v || v.v == null && (!v.f || v.F)) && x.push(o(v, h, y, N));
      }
    return m.join(g) + g + x.join(g) + g + "E" + g;
  }
  return {
    to_workbook: c,
    to_sheet: s,
    from_sheet: d
  };
})(), Wo = /* @__PURE__ */ (function() {
  function e(i, s) {
    switch (s.type) {
      case "base64":
        return t(Mr(i), s);
      case "binary":
        return t(i, s);
      case "buffer":
        return t(ye && Buffer.isBuffer(i) ? i.toString("binary") : Dt(i), s);
      case "array":
        return t(jt(i), s);
    }
    throw new Error("Unrecognized type " + s.type);
  }
  function t(i, s) {
    for (var c = i.split(`
`), o = -1, l = -1, f = 0, d = []; f !== c.length; ++f) {
      if (c[f].trim() === "BOT") {
        d[++o] = [], l = 0;
        continue;
      }
      if (!(o < 0)) {
        var h = c[f].trim().split(","), p = h[0], m = h[1];
        ++f;
        for (var x = c[f] || ""; (x.match(/["]/g) || []).length & 1 && f < c.length - 1; ) x += `
` + c[++f];
        switch (x = x.trim(), +p) {
          case -1:
            if (x === "BOT") {
              d[++o] = [], l = 0;
              continue;
            } else if (x !== "EOD") throw new Error("Unrecognized DIF special command " + x);
            break;
          case 0:
            x === "TRUE" ? d[o][l] = !0 : x === "FALSE" ? d[o][l] = !1 : isNaN(et(m)) ? isNaN(ma(m).getDate()) ? d[o][l] = m : d[o][l] = Ge(m) : d[o][l] = et(m), ++l;
            break;
          case 1:
            x = x.slice(1, x.length - 1), x = x.replace(/""/g, '"'), x && x.match(/^=".*"$/) && (x = x.slice(2, -1)), d[o][l++] = x !== "" ? x : null;
            break;
        }
        if (x === "EOD") break;
      }
    }
    return s && s.sheetRows && (d = d.slice(0, s.sheetRows)), d;
  }
  function r(i, s) {
    return Ta(e(i, s), s);
  }
  function a(i, s) {
    return bt(r(i, s), s);
  }
  var n = /* @__PURE__ */ (function() {
    var i = function(o, l, f, d, h) {
      o.push(l), o.push(f + "," + d), o.push('"' + h.replace(/"/g, '""') + '"');
    }, s = function(o, l, f, d) {
      o.push(l + "," + f), o.push(l == 1 ? '"' + d.replace(/"/g, '""') + '"' : d);
    };
    return function(o) {
      var l = [], f = Ae(o["!ref"]), d, h = Array.isArray(o);
      i(l, "TABLE", 0, 1, "sheetjs"), i(l, "VECTORS", 0, f.e.r - f.s.r + 1, ""), i(l, "TUPLES", 0, f.e.c - f.s.c + 1, ""), i(l, "DATA", 0, 0, "");
      for (var p = f.s.r; p <= f.e.r; ++p) {
        s(l, -1, 0, "BOT");
        for (var m = f.s.c; m <= f.e.c; ++m) {
          var x = me({ r: p, c: m });
          if (d = h ? (o[p] || [])[m] : o[x], !d) {
            s(l, 1, 0, "");
            continue;
          }
          switch (d.t) {
            case "n":
              var u = d.w;
              !u && d.v != null && (u = d.v), u == null ? d.f && !d.F ? s(l, 1, 0, "=" + d.f) : s(l, 1, 0, "") : s(l, 0, u, "V");
              break;
            case "b":
              s(l, 0, d.v ? 1 : 0, d.v ? "TRUE" : "FALSE");
              break;
            case "s":
              s(l, 1, 0, isNaN(d.v) ? d.v : '="' + d.v + '"');
              break;
            case "d":
              d.w || (d.w = Br(d.z || pe[14], sr(Ge(d.v)))), s(l, 0, d.w, "V");
              break;
            default:
              s(l, 1, 0, "");
          }
        }
      }
      s(l, -1, 0, "EOD");
      var v = `\r
`, E = l.join(v);
      return E;
    };
  })();
  return {
    to_workbook: a,
    to_sheet: r,
    from_sheet: n
  };
})(), Ho = /* @__PURE__ */ (function() {
  function e(d) {
    return d.replace(/\\b/g, "\\").replace(/\\c/g, ":").replace(/\\n/g, `
`);
  }
  function t(d) {
    return d.replace(/\\/g, "\\b").replace(/:/g, "\\c").replace(/\n/g, "\\n");
  }
  function r(d, h) {
    for (var p = d.split(`
`), m = -1, x = -1, u = 0, v = []; u !== p.length; ++u) {
      var E = p[u].trim().split(":");
      if (E[0] === "cell") {
        var g = Ye(E[1]);
        if (v.length <= g.r) for (m = v.length; m <= g.r; ++m) v[m] || (v[m] = []);
        switch (m = g.r, x = g.c, E[2]) {
          case "t":
            v[m][x] = e(E[3]);
            break;
          case "v":
            v[m][x] = +E[3];
            break;
          case "vtf":
            var y = E[E.length - 1];
          /* falls through */
          case "vtc":
            E[3] === "nl" ? v[m][x] = !!+E[4] : v[m][x] = +E[4], E[2] == "vtf" && (v[m][x] = [v[m][x], y]);
        }
      }
    }
    return h && h.sheetRows && (v = v.slice(0, h.sheetRows)), v;
  }
  function a(d, h) {
    return Ta(r(d, h), h);
  }
  function n(d, h) {
    return bt(a(d, h), h);
  }
  var i = [
    "socialcalc:version:1.5",
    "MIME-Version: 1.0",
    "Content-Type: multipart/mixed; boundary=SocialCalcSpreadsheetControlSave"
  ].join(`
`), s = [
    "--SocialCalcSpreadsheetControlSave",
    "Content-type: text/plain; charset=UTF-8"
  ].join(`
`) + `
`, c = [
    "# SocialCalc Spreadsheet Control Save",
    "part:sheet"
  ].join(`
`), o = "--SocialCalcSpreadsheetControlSave--";
  function l(d) {
    if (!d || !d["!ref"]) return "";
    for (var h = [], p = [], m, x = "", u = Cr(d["!ref"]), v = Array.isArray(d), E = u.s.r; E <= u.e.r; ++E)
      for (var g = u.s.c; g <= u.e.c; ++g)
        if (x = me({ r: E, c: g }), m = v ? (d[E] || [])[g] : d[x], !(!m || m.v == null || m.t === "z")) {
          switch (p = ["cell", x, "t"], m.t) {
            case "s":
            case "str":
              p.push(t(m.v));
              break;
            case "n":
              m.f ? (p[2] = "vtf", p[3] = "n", p[4] = m.v, p[5] = t(m.f)) : (p[2] = "v", p[3] = m.v);
              break;
            case "b":
              p[2] = "vt" + (m.f ? "f" : "c"), p[3] = "nl", p[4] = m.v ? "1" : "0", p[5] = t(m.f || (m.v ? "TRUE" : "FALSE"));
              break;
            case "d":
              var y = sr(Ge(m.v));
              p[2] = "vtc", p[3] = "nd", p[4] = "" + y, p[5] = m.w || Br(m.z || pe[14], y);
              break;
            case "e":
              continue;
          }
          h.push(p.join(":"));
        }
    return h.push("sheet:c:" + (u.e.c - u.s.c + 1) + ":r:" + (u.e.r - u.s.r + 1) + ":tvf:1"), h.push("valueformat:1:text-wiki"), h.join(`
`);
  }
  function f(d) {
    return [i, s, c, s, l(d), o].join(`
`);
  }
  return {
    to_workbook: n,
    to_sheet: a,
    from_sheet: f
  };
})(), va = /* @__PURE__ */ (function() {
  function e(f, d, h, p, m) {
    m.raw ? d[h][p] = f : f === "" || (f === "TRUE" ? d[h][p] = !0 : f === "FALSE" ? d[h][p] = !1 : isNaN(et(f)) ? isNaN(ma(f).getDate()) ? d[h][p] = f : d[h][p] = Ge(f) : d[h][p] = et(f));
  }
  function t(f, d) {
    var h = d || {}, p = [];
    if (!f || f.length === 0) return p;
    for (var m = f.split(/[\r\n]/), x = m.length - 1; x >= 0 && m[x].length === 0; ) --x;
    for (var u = 10, v = 0, E = 0; E <= x; ++E)
      v = m[E].indexOf(" "), v == -1 ? v = m[E].length : v++, u = Math.max(u, v);
    for (E = 0; E <= x; ++E) {
      p[E] = [];
      var g = 0;
      for (e(m[E].slice(0, u).trim(), p, E, g, h), g = 1; g <= (m[E].length - u) / 10 + 1; ++g)
        e(m[E].slice(u + (g - 1) * 10, u + g * 10).trim(), p, E, g, h);
    }
    return h.sheetRows && (p = p.slice(0, h.sheetRows)), p;
  }
  var r = {
    /*::[*/
    44: ",",
    /*::[*/
    9: "	",
    /*::[*/
    59: ";",
    /*::[*/
    124: "|"
  }, a = {
    /*::[*/
    44: 3,
    /*::[*/
    9: 2,
    /*::[*/
    59: 1,
    /*::[*/
    124: 0
  };
  function n(f) {
    for (var d = {}, h = !1, p = 0, m = 0; p < f.length; ++p)
      (m = f.charCodeAt(p)) == 34 ? h = !h : !h && m in r && (d[m] = (d[m] || 0) + 1);
    m = [];
    for (p in d) Object.prototype.hasOwnProperty.call(d, p) && m.push([d[p], p]);
    if (!m.length) {
      d = a;
      for (p in d) Object.prototype.hasOwnProperty.call(d, p) && m.push([d[p], p]);
    }
    return m.sort(function(x, u) {
      return x[0] - u[0] || a[x[1]] - a[u[1]];
    }), r[m.pop()[1]] || 44;
  }
  function i(f, d) {
    var h = d || {}, p = "", m = h.dense ? [] : {}, x = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
    f.slice(0, 4) == "sep=" ? f.charCodeAt(5) == 13 && f.charCodeAt(6) == 10 ? (p = f.charAt(4), f = f.slice(7)) : f.charCodeAt(5) == 13 || f.charCodeAt(5) == 10 ? (p = f.charAt(4), f = f.slice(6)) : p = n(f.slice(0, 1024)) : h && h.FS ? p = h.FS : p = n(f.slice(0, 1024));
    var u = 0, v = 0, E = 0, g = 0, y = 0, N = p.charCodeAt(0), A = !1, w = 0, P = f.charCodeAt(0);
    f = f.replace(/\r\n/mg, `
`);
    var L = h.dateNF != null ? ru(h.dateNF) : null;
    function U() {
      var M = f.slice(g, y), b = {};
      if (M.charAt(0) == '"' && M.charAt(M.length - 1) == '"' && (M = M.slice(1, -1).replace(/""/g, '"')), M.length === 0) b.t = "z";
      else if (h.raw)
        b.t = "s", b.v = M;
      else if (M.trim().length === 0)
        b.t = "s", b.v = M;
      else if (M.charCodeAt(0) == 61)
        M.charCodeAt(1) == 34 && M.charCodeAt(M.length - 1) == 34 ? (b.t = "s", b.v = M.slice(2, -1).replace(/""/g, '"')) : Ip(M) ? (b.t = "n", b.f = M.slice(1)) : (b.t = "s", b.v = M);
      else if (M == "TRUE")
        b.t = "b", b.v = !0;
      else if (M == "FALSE")
        b.t = "b", b.v = !1;
      else if (!isNaN(E = et(M)))
        b.t = "n", h.cellText !== !1 && (b.w = M), b.v = E;
      else if (!isNaN(ma(M).getDate()) || L && M.match(L)) {
        b.z = h.dateNF || pe[14];
        var K = 0;
        L && M.match(L) && (M = tu(M, h.dateNF, M.match(L) || []), K = 1), h.cellDates ? (b.t = "d", b.v = Ge(M, K)) : (b.t = "n", b.v = sr(Ge(M, K))), h.cellText !== !1 && (b.w = Br(b.z, b.v instanceof Date ? sr(b.v) : b.v)), h.cellNF || delete b.z;
      } else
        b.t = "s", b.v = M;
      if (b.t == "z" || (h.dense ? (m[u] || (m[u] = []), m[u][v] = b) : m[me({ c: v, r: u })] = b), g = y + 1, P = f.charCodeAt(g), x.e.c < v && (x.e.c = v), x.e.r < u && (x.e.r = u), w == N) ++v;
      else if (v = 0, ++u, h.sheetRows && h.sheetRows <= u) return !0;
    }
    e: for (; y < f.length; ++y) switch (w = f.charCodeAt(y)) {
      case 34:
        P === 34 && (A = !A);
        break;
      case N:
      case 10:
      case 13:
        if (!A && U()) break e;
        break;
    }
    return y - g > 0 && U(), m["!ref"] = _e(x), m;
  }
  function s(f, d) {
    return !(d && d.PRN) || d.FS || f.slice(0, 4) == "sep=" || f.indexOf("	") >= 0 || f.indexOf(",") >= 0 || f.indexOf(";") >= 0 ? i(f, d) : Ta(t(f, d), d);
  }
  function c(f, d) {
    var h = "", p = d.type == "string" ? [0, 0, 0, 0] : Is(f, d);
    switch (d.type) {
      case "base64":
        h = Mr(f);
        break;
      case "binary":
        h = f;
        break;
      case "buffer":
        d.codepage == 65001 ? h = f.toString("utf8") : d.codepage && typeof Ce < "u" ? h = Ce.utils.decode(d.codepage, f) : h = ye && Buffer.isBuffer(f) ? f.toString("binary") : Dt(f);
        break;
      case "array":
        h = jt(f);
        break;
      case "string":
        h = f;
        break;
      default:
        throw new Error("Unrecognized type " + d.type);
    }
    return p[0] == 239 && p[1] == 187 && p[2] == 191 ? h = Me(h.slice(3)) : d.type != "string" && d.type != "buffer" && d.codepage == 65001 ? h = Me(h) : d.type == "binary" && typeof Ce < "u" && d.codepage && (h = Ce.utils.decode(d.codepage, Ce.utils.encode(28591, h))), h.slice(0, 19) == "socialcalc:version:" ? Ho.to_sheet(d.type == "string" ? h : Me(h), d) : s(h, d);
  }
  function o(f, d) {
    return bt(c(f, d), d);
  }
  function l(f) {
    for (var d = [], h = Ae(f["!ref"]), p, m = Array.isArray(f), x = h.s.r; x <= h.e.r; ++x) {
      for (var u = [], v = h.s.c; v <= h.e.c; ++v) {
        var E = me({ r: x, c: v });
        if (p = m ? (f[x] || [])[v] : f[E], !p || p.v == null) {
          u.push("          ");
          continue;
        }
        for (var g = (p.w || (ft(p), p.w) || "").slice(0, 10); g.length < 10; ) g += " ";
        u.push(g + (v === 0 ? " " : ""));
      }
      d.push(u.join(""));
    }
    return d.join(`
`);
  }
  return {
    to_workbook: o,
    to_sheet: c,
    from_sheet: l
  };
})();
function v1(e, t) {
  var r = t || {}, a = !!r.WTF;
  r.WTF = !0;
  try {
    var n = Xo.to_workbook(e, r);
    return r.WTF = a, n;
  } catch (i) {
    if (r.WTF = a, !i.message.match(/SYLK bad record ID/) && a) throw i;
    return va.to_workbook(e, t);
  }
}
var Gt = /* @__PURE__ */ (function() {
  function e(O, B, R) {
    if (O) {
      dr(O, O.l || 0);
      for (var D = R.Enum || xe; O.l < O.length; ) {
        var Y = O.read_shift(2), J = D[Y] || D[65535], ae = O.read_shift(2), ee = O.l + ae, Z = J.f && J.f(O, ae, R);
        if (O.l = ee, B(Z, J, Y)) return;
      }
    }
  }
  function t(O, B) {
    switch (B.type) {
      case "base64":
        return r(Dr(Mr(O)), B);
      case "binary":
        return r(Dr(O), B);
      case "buffer":
      case "array":
        return r(O, B);
    }
    throw "Unsupported type " + B.type;
  }
  function r(O, B) {
    if (!O) return O;
    var R = B || {}, D = R.dense ? [] : {}, Y = "Sheet1", J = "", ae = 0, ee = {}, Z = [], we = [], I = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, Xe = R.sheetRows || 0;
    if (O[2] == 0 && (O[3] == 8 || O[3] == 9) && O.length >= 16 && O[14] == 5 && O[15] === 108)
      throw new Error("Unsupported Works 3 for Mac file");
    if (O[2] == 2)
      R.Enum = xe, e(O, function(fe, Je, Ur) {
        switch (Ur) {
          case 0:
            R.vers = fe, fe >= 4096 && (R.qpro = !0);
            break;
          case 6:
            I = fe;
            break;
          /* RANGE */
          case 204:
            fe && (J = fe);
            break;
          /* SHEETNAMECS */
          case 222:
            J = fe;
            break;
          /* SHEETNAMELP */
          case 15:
          /* LABEL */
          case 51:
            R.qpro || (fe[1].v = fe[1].v.slice(1));
          /* falls through */
          case 13:
          /* INTEGER */
          case 14:
          /* NUMBER */
          case 16:
            Ur == 14 && (fe[2] & 112) == 112 && (fe[2] & 15) > 1 && (fe[2] & 15) < 15 && (fe[1].z = R.dateNF || pe[14], R.cellDates && (fe[1].t = "d", fe[1].v = jn(fe[1].v))), R.qpro && fe[3] > ae && (D["!ref"] = _e(I), ee[Y] = D, Z.push(Y), D = R.dense ? [] : {}, I = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, ae = fe[3], Y = J || "Sheet" + (ae + 1), J = "");
            var tt = R.dense ? (D[fe[0].r] || [])[fe[0].c] : D[me(fe[0])];
            if (tt) {
              tt.t = fe[1].t, tt.v = fe[1].v, fe[1].z != null && (tt.z = fe[1].z), fe[1].f != null && (tt.f = fe[1].f);
              break;
            }
            R.dense ? (D[fe[0].r] || (D[fe[0].r] = []), D[fe[0].r][fe[0].c] = fe[1]) : D[me(fe[0])] = fe[1];
            break;
        }
      }, R);
    else if (O[2] == 26 || O[2] == 14)
      R.Enum = ve, O[2] == 14 && (R.qpro = !0, O.l = 0), e(O, function(fe, Je, Ur) {
        switch (Ur) {
          case 204:
            Y = fe;
            break;
          /* SHEETNAMECS */
          case 22:
            fe[1].v = fe[1].v.slice(1);
          /* falls through */
          case 23:
          /* NUMBER17 */
          case 24:
          /* NUMBER18 */
          case 25:
          /* FORMULA19 */
          case 37:
          /* NUMBER25 */
          case 39:
          /* NUMBER27 */
          case 40:
            if (fe[3] > ae && (D["!ref"] = _e(I), ee[Y] = D, Z.push(Y), D = R.dense ? [] : {}, I = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, ae = fe[3], Y = "Sheet" + (ae + 1)), Xe > 0 && fe[0].r >= Xe) break;
            R.dense ? (D[fe[0].r] || (D[fe[0].r] = []), D[fe[0].r][fe[0].c] = fe[1]) : D[me(fe[0])] = fe[1], I.e.c < fe[0].c && (I.e.c = fe[0].c), I.e.r < fe[0].r && (I.e.r = fe[0].r);
            break;
          case 27:
            fe[14e3] && (we[fe[14e3][0]] = fe[14e3][1]);
            break;
          case 1537:
            we[fe[0]] = fe[1], fe[0] == ae && (Y = fe[1]);
            break;
        }
      }, R);
    else throw new Error("Unrecognized LOTUS BOF " + O[2]);
    if (D["!ref"] = _e(I), ee[J || Y] = D, Z.push(J || Y), !we.length) return { SheetNames: Z, Sheets: ee };
    for (var Ne = {}, Be = [], Fe = 0; Fe < we.length; ++Fe) ee[Z[Fe]] ? (Be.push(we[Fe] || Z[Fe]), Ne[we[Fe]] = ee[we[Fe]] || ee[Z[Fe]]) : (Be.push(we[Fe]), Ne[we[Fe]] = { "!ref": "A1" });
    return { SheetNames: Be, Sheets: Ne };
  }
  function a(O, B) {
    var R = B || {};
    if (+R.codepage >= 0 && jr(+R.codepage), R.type == "string") throw new Error("Cannot write WK1 to JS string");
    var D = Ir(), Y = Ae(O["!ref"]), J = Array.isArray(O), ae = [];
    ie(D, 0, i(1030)), ie(D, 6, o(Y));
    for (var ee = Math.min(Y.e.r, 8191), Z = Y.s.r; Z <= ee; ++Z)
      for (var we = Ke(Z), I = Y.s.c; I <= Y.e.c; ++I) {
        Z === Y.s.r && (ae[I] = He(I));
        var Xe = ae[I] + we, Ne = J ? (O[Z] || [])[I] : O[Xe];
        if (!(!Ne || Ne.t == "z"))
          if (Ne.t == "n")
            (Ne.v | 0) == Ne.v && Ne.v >= -32768 && Ne.v <= 32767 ? ie(D, 13, p(Z, I, Ne.v)) : ie(D, 14, x(Z, I, Ne.v));
          else {
            var Be = ft(Ne);
            ie(D, 15, d(Z, I, Be.slice(0, 239)));
          }
      }
    return ie(D, 1), D.end();
  }
  function n(O, B) {
    var R = B || {};
    if (+R.codepage >= 0 && jr(+R.codepage), R.type == "string") throw new Error("Cannot write WK3 to JS string");
    var D = Ir();
    ie(D, 0, s(O));
    for (var Y = 0, J = 0; Y < O.SheetNames.length; ++Y) (O.Sheets[O.SheetNames[Y]] || {})["!ref"] && ie(D, 27, G(O.SheetNames[Y], J++));
    var ae = 0;
    for (Y = 0; Y < O.SheetNames.length; ++Y) {
      var ee = O.Sheets[O.SheetNames[Y]];
      if (!(!ee || !ee["!ref"])) {
        for (var Z = Ae(ee["!ref"]), we = Array.isArray(ee), I = [], Xe = Math.min(Z.e.r, 8191), Ne = Z.s.r; Ne <= Xe; ++Ne)
          for (var Be = Ke(Ne), Fe = Z.s.c; Fe <= Z.e.c; ++Fe) {
            Ne === Z.s.r && (I[Fe] = He(Fe));
            var fe = I[Fe] + Be, Je = we ? (ee[Ne] || [])[Fe] : ee[fe];
            if (!(!Je || Je.t == "z"))
              if (Je.t == "n")
                ie(D, 23, U(Ne, Fe, ae, Je.v));
              else {
                var Ur = ft(Je);
                ie(D, 22, w(Ne, Fe, ae, Ur.slice(0, 239)));
              }
          }
        ++ae;
      }
    }
    return ie(D, 1), D.end();
  }
  function i(O) {
    var B = z(2);
    return B.write_shift(2, O), B;
  }
  function s(O) {
    var B = z(26);
    B.write_shift(2, 4096), B.write_shift(2, 4), B.write_shift(4, 0);
    for (var R = 0, D = 0, Y = 0, J = 0; J < O.SheetNames.length; ++J) {
      var ae = O.SheetNames[J], ee = O.Sheets[ae];
      if (!(!ee || !ee["!ref"])) {
        ++Y;
        var Z = Cr(ee["!ref"]);
        R < Z.e.r && (R = Z.e.r), D < Z.e.c && (D = Z.e.c);
      }
    }
    return R > 8191 && (R = 8191), B.write_shift(2, R), B.write_shift(1, Y), B.write_shift(1, D), B.write_shift(2, 0), B.write_shift(2, 0), B.write_shift(1, 1), B.write_shift(1, 2), B.write_shift(4, 0), B.write_shift(4, 0), B;
  }
  function c(O, B, R) {
    var D = { s: { c: 0, r: 0 }, e: { c: 0, r: 0 } };
    return B == 8 && R.qpro ? (D.s.c = O.read_shift(1), O.l++, D.s.r = O.read_shift(2), D.e.c = O.read_shift(1), O.l++, D.e.r = O.read_shift(2), D) : (D.s.c = O.read_shift(2), D.s.r = O.read_shift(2), B == 12 && R.qpro && (O.l += 2), D.e.c = O.read_shift(2), D.e.r = O.read_shift(2), B == 12 && R.qpro && (O.l += 2), D.s.c == 65535 && (D.s.c = D.e.c = D.s.r = D.e.r = 0), D);
  }
  function o(O) {
    var B = z(8);
    return B.write_shift(2, O.s.c), B.write_shift(2, O.s.r), B.write_shift(2, O.e.c), B.write_shift(2, O.e.r), B;
  }
  function l(O, B, R) {
    var D = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0, 0];
    return R.qpro && R.vers != 20768 ? (D[0].c = O.read_shift(1), D[3] = O.read_shift(1), D[0].r = O.read_shift(2), O.l += 2) : (D[2] = O.read_shift(1), D[0].c = O.read_shift(2), D[0].r = O.read_shift(2)), D;
  }
  function f(O, B, R) {
    var D = O.l + B, Y = l(O, B, R);
    if (Y[1].t = "s", R.vers == 20768) {
      O.l++;
      var J = O.read_shift(1);
      return Y[1].v = O.read_shift(J, "utf8"), Y;
    }
    return R.qpro && O.l++, Y[1].v = O.read_shift(D - O.l, "cstr"), Y;
  }
  function d(O, B, R) {
    var D = z(7 + R.length);
    D.write_shift(1, 255), D.write_shift(2, B), D.write_shift(2, O), D.write_shift(1, 39);
    for (var Y = 0; Y < D.length; ++Y) {
      var J = R.charCodeAt(Y);
      D.write_shift(1, J >= 128 ? 95 : J);
    }
    return D.write_shift(1, 0), D;
  }
  function h(O, B, R) {
    var D = l(O, B, R);
    return D[1].v = O.read_shift(2, "i"), D;
  }
  function p(O, B, R) {
    var D = z(7);
    return D.write_shift(1, 255), D.write_shift(2, B), D.write_shift(2, O), D.write_shift(2, R, "i"), D;
  }
  function m(O, B, R) {
    var D = l(O, B, R);
    return D[1].v = O.read_shift(8, "f"), D;
  }
  function x(O, B, R) {
    var D = z(13);
    return D.write_shift(1, 255), D.write_shift(2, B), D.write_shift(2, O), D.write_shift(8, R, "f"), D;
  }
  function u(O, B, R) {
    var D = O.l + B, Y = l(O, B, R);
    if (Y[1].v = O.read_shift(8, "f"), R.qpro) O.l = D;
    else {
      var J = O.read_shift(2);
      y(O.slice(O.l, O.l + J), Y), O.l += J;
    }
    return Y;
  }
  function v(O, B, R) {
    var D = B & 32768;
    return B &= -32769, B = (D ? O : 0) + (B >= 8192 ? B - 16384 : B), (D ? "" : "$") + (R ? He(B) : Ke(B));
  }
  var E = {
    51: ["FALSE", 0],
    52: ["TRUE", 0],
    70: ["LEN", 1],
    80: ["SUM", 69],
    81: ["AVERAGEA", 69],
    82: ["COUNTA", 69],
    83: ["MINA", 69],
    84: ["MAXA", 69],
    111: ["T", 1]
  }, g = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "",
    "+",
    "-",
    "*",
    "/",
    "^",
    "=",
    "<>",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "<=",
    ">=",
    "<",
    ">",
    "",
    "",
    "",
    "",
    // eslint-disable-line no-mixed-spaces-and-tabs
    "&",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
    // eslint-disable-line no-mixed-spaces-and-tabs
  ];
  function y(O, B) {
    dr(O, 0);
    for (var R = [], D = 0, Y = "", J = "", ae = "", ee = ""; O.l < O.length; ) {
      var Z = O[O.l++];
      switch (Z) {
        case 0:
          R.push(O.read_shift(8, "f"));
          break;
        case 1:
          J = v(B[0].c, O.read_shift(2), !0), Y = v(B[0].r, O.read_shift(2), !1), R.push(J + Y);
          break;
        case 2:
          {
            var we = v(B[0].c, O.read_shift(2), !0), I = v(B[0].r, O.read_shift(2), !1);
            J = v(B[0].c, O.read_shift(2), !0), Y = v(B[0].r, O.read_shift(2), !1), R.push(we + I + ":" + J + Y);
          }
          break;
        case 3:
          if (O.l < O.length) {
            console.error("WK1 premature formula end");
            return;
          }
          break;
        case 4:
          R.push("(" + R.pop() + ")");
          break;
        case 5:
          R.push(O.read_shift(2));
          break;
        case 6:
          {
            for (var Xe = ""; Z = O[O.l++]; ) Xe += String.fromCharCode(Z);
            R.push('"' + Xe.replace(/"/g, '""') + '"');
          }
          break;
        case 8:
          R.push("-" + R.pop());
          break;
        case 23:
          R.push("+" + R.pop());
          break;
        case 22:
          R.push("NOT(" + R.pop() + ")");
          break;
        case 20:
        case 21:
          ee = R.pop(), ae = R.pop(), R.push(["AND", "OR"][Z - 20] + "(" + ae + "," + ee + ")");
          break;
        default:
          if (Z < 32 && g[Z])
            ee = R.pop(), ae = R.pop(), R.push(ae + g[Z] + ee);
          else if (E[Z]) {
            if (D = E[Z][1], D == 69 && (D = O[O.l++]), D > R.length) {
              console.error("WK1 bad formula parse 0x" + Z.toString(16) + ":|" + R.join("|") + "|");
              return;
            }
            var Ne = R.slice(-D);
            R.length -= D, R.push(E[Z][0] + "(" + Ne.join(",") + ")");
          } else return Z <= 7 ? console.error("WK1 invalid opcode " + Z.toString(16)) : Z <= 24 ? console.error("WK1 unsupported op " + Z.toString(16)) : Z <= 30 ? console.error("WK1 invalid opcode " + Z.toString(16)) : Z <= 115 ? console.error("WK1 unsupported function opcode " + Z.toString(16)) : console.error("WK1 unrecognized opcode " + Z.toString(16));
      }
    }
    R.length == 1 ? B[1].f = "" + R[0] : console.error("WK1 bad formula parse |" + R.join("|") + "|");
  }
  function N(O) {
    var B = [{ c: 0, r: 0 }, { t: "n", v: 0 }, 0];
    return B[0].r = O.read_shift(2), B[3] = O[O.l++], B[0].c = O[O.l++], B;
  }
  function A(O, B) {
    var R = N(O);
    return R[1].t = "s", R[1].v = O.read_shift(B - 4, "cstr"), R;
  }
  function w(O, B, R, D) {
    var Y = z(6 + D.length);
    Y.write_shift(2, O), Y.write_shift(1, R), Y.write_shift(1, B), Y.write_shift(1, 39);
    for (var J = 0; J < D.length; ++J) {
      var ae = D.charCodeAt(J);
      Y.write_shift(1, ae >= 128 ? 95 : ae);
    }
    return Y.write_shift(1, 0), Y;
  }
  function P(O, B) {
    var R = N(O);
    R[1].v = O.read_shift(2);
    var D = R[1].v >> 1;
    if (R[1].v & 1)
      switch (D & 7) {
        case 0:
          D = (D >> 3) * 5e3;
          break;
        case 1:
          D = (D >> 3) * 500;
          break;
        case 2:
          D = (D >> 3) / 20;
          break;
        case 3:
          D = (D >> 3) / 200;
          break;
        case 4:
          D = (D >> 3) / 2e3;
          break;
        case 5:
          D = (D >> 3) / 2e4;
          break;
        case 6:
          D = (D >> 3) / 16;
          break;
        case 7:
          D = (D >> 3) / 64;
          break;
      }
    return R[1].v = D, R;
  }
  function L(O, B) {
    var R = N(O), D = O.read_shift(4), Y = O.read_shift(4), J = O.read_shift(2);
    if (J == 65535)
      return D === 0 && Y === 3221225472 ? (R[1].t = "e", R[1].v = 15) : D === 0 && Y === 3489660928 ? (R[1].t = "e", R[1].v = 42) : R[1].v = 0, R;
    var ae = J & 32768;
    return J = (J & 32767) - 16446, R[1].v = (1 - ae * 2) * (Y * Math.pow(2, J + 32) + D * Math.pow(2, J)), R;
  }
  function U(O, B, R, D) {
    var Y = z(14);
    if (Y.write_shift(2, O), Y.write_shift(1, R), Y.write_shift(1, B), D == 0)
      return Y.write_shift(4, 0), Y.write_shift(4, 0), Y.write_shift(2, 65535), Y;
    var J = 0, ae = 0, ee = 0, Z = 0;
    return D < 0 && (J = 1, D = -D), ae = Math.log2(D) | 0, D /= Math.pow(2, ae - 31), Z = D >>> 0, (Z & 2147483648) == 0 && (D /= 2, ++ae, Z = D >>> 0), D -= Z, Z |= 2147483648, Z >>>= 0, D *= Math.pow(2, 32), ee = D >>> 0, Y.write_shift(4, ee), Y.write_shift(4, Z), ae += 16383 + (J ? 32768 : 0), Y.write_shift(2, ae), Y;
  }
  function M(O, B) {
    var R = L(O);
    return O.l += B - 14, R;
  }
  function b(O, B) {
    var R = N(O), D = O.read_shift(4);
    return R[1].v = D >> 6, R;
  }
  function K(O, B) {
    var R = N(O), D = O.read_shift(8, "f");
    return R[1].v = D, R;
  }
  function se(O, B) {
    var R = K(O);
    return O.l += B - 10, R;
  }
  function re(O, B) {
    return O[O.l + B - 1] == 0 ? O.read_shift(B, "cstr") : "";
  }
  function ue(O, B) {
    var R = O[O.l++];
    R > B - 1 && (R = B - 1);
    for (var D = ""; D.length < R; ) D += String.fromCharCode(O[O.l++]);
    return D;
  }
  function oe(O, B, R) {
    if (!(!R.qpro || B < 21)) {
      var D = O.read_shift(1);
      O.l += 17, O.l += 1, O.l += 2;
      var Y = O.read_shift(B - 21, "cstr");
      return [D, Y];
    }
  }
  function Le(O, B) {
    for (var R = {}, D = O.l + B; O.l < D; ) {
      var Y = O.read_shift(2);
      if (Y == 14e3) {
        for (R[Y] = [0, ""], R[Y][0] = O.read_shift(2); O[O.l]; )
          R[Y][1] += String.fromCharCode(O[O.l]), O.l++;
        O.l++;
      }
    }
    return R;
  }
  function G(O, B) {
    var R = z(5 + O.length);
    R.write_shift(2, 14e3), R.write_shift(2, B);
    for (var D = 0; D < O.length; ++D) {
      var Y = O.charCodeAt(D);
      R[R.l++] = Y > 127 ? 95 : Y;
    }
    return R[R.l++] = 0, R;
  }
  var xe = {
    /*::[*/
    0: { n: "BOF", f: ar },
    /*::[*/
    1: { n: "EOF" },
    /*::[*/
    2: { n: "CALCMODE" },
    /*::[*/
    3: { n: "CALCORDER" },
    /*::[*/
    4: { n: "SPLIT" },
    /*::[*/
    5: { n: "SYNC" },
    /*::[*/
    6: { n: "RANGE", f: c },
    /*::[*/
    7: { n: "WINDOW1" },
    /*::[*/
    8: { n: "COLW1" },
    /*::[*/
    9: { n: "WINTWO" },
    /*::[*/
    10: { n: "COLW2" },
    /*::[*/
    11: { n: "NAME" },
    /*::[*/
    12: { n: "BLANK" },
    /*::[*/
    13: { n: "INTEGER", f: h },
    /*::[*/
    14: { n: "NUMBER", f: m },
    /*::[*/
    15: { n: "LABEL", f },
    /*::[*/
    16: { n: "FORMULA", f: u },
    /*::[*/
    24: { n: "TABLE" },
    /*::[*/
    25: { n: "ORANGE" },
    /*::[*/
    26: { n: "PRANGE" },
    /*::[*/
    27: { n: "SRANGE" },
    /*::[*/
    28: { n: "FRANGE" },
    /*::[*/
    29: { n: "KRANGE1" },
    /*::[*/
    32: { n: "HRANGE" },
    /*::[*/
    35: { n: "KRANGE2" },
    /*::[*/
    36: { n: "PROTEC" },
    /*::[*/
    37: { n: "FOOTER" },
    /*::[*/
    38: { n: "HEADER" },
    /*::[*/
    39: { n: "SETUP" },
    /*::[*/
    40: { n: "MARGINS" },
    /*::[*/
    41: { n: "LABELFMT" },
    /*::[*/
    42: { n: "TITLES" },
    /*::[*/
    43: { n: "SHEETJS" },
    /*::[*/
    45: { n: "GRAPH" },
    /*::[*/
    46: { n: "NGRAPH" },
    /*::[*/
    47: { n: "CALCCOUNT" },
    /*::[*/
    48: { n: "UNFORMATTED" },
    /*::[*/
    49: { n: "CURSORW12" },
    /*::[*/
    50: { n: "WINDOW" },
    /*::[*/
    51: { n: "STRING", f },
    /*::[*/
    55: { n: "PASSWORD" },
    /*::[*/
    56: { n: "LOCKED" },
    /*::[*/
    60: { n: "QUERY" },
    /*::[*/
    61: { n: "QUERYNAME" },
    /*::[*/
    62: { n: "PRINT" },
    /*::[*/
    63: { n: "PRINTNAME" },
    /*::[*/
    64: { n: "GRAPH2" },
    /*::[*/
    65: { n: "GRAPHNAME" },
    /*::[*/
    66: { n: "ZOOM" },
    /*::[*/
    67: { n: "SYMSPLIT" },
    /*::[*/
    68: { n: "NSROWS" },
    /*::[*/
    69: { n: "NSCOLS" },
    /*::[*/
    70: { n: "RULER" },
    /*::[*/
    71: { n: "NNAME" },
    /*::[*/
    72: { n: "ACOMM" },
    /*::[*/
    73: { n: "AMACRO" },
    /*::[*/
    74: { n: "PARSE" },
    /*::[*/
    102: { n: "PRANGES??" },
    /*::[*/
    103: { n: "RRANGES??" },
    /*::[*/
    104: { n: "FNAME??" },
    /*::[*/
    105: { n: "MRANGES??" },
    /*::[*/
    204: { n: "SHEETNAMECS", f: re },
    /*::[*/
    222: { n: "SHEETNAMELP", f: ue },
    /*::[*/
    65535: { n: "" }
  }, ve = {
    /*::[*/
    0: { n: "BOF" },
    /*::[*/
    1: { n: "EOF" },
    /*::[*/
    2: { n: "PASSWORD" },
    /*::[*/
    3: { n: "CALCSET" },
    /*::[*/
    4: { n: "WINDOWSET" },
    /*::[*/
    5: { n: "SHEETCELLPTR" },
    /*::[*/
    6: { n: "SHEETLAYOUT" },
    /*::[*/
    7: { n: "COLUMNWIDTH" },
    /*::[*/
    8: { n: "HIDDENCOLUMN" },
    /*::[*/
    9: { n: "USERRANGE" },
    /*::[*/
    10: { n: "SYSTEMRANGE" },
    /*::[*/
    11: { n: "ZEROFORCE" },
    /*::[*/
    12: { n: "SORTKEYDIR" },
    /*::[*/
    13: { n: "FILESEAL" },
    /*::[*/
    14: { n: "DATAFILLNUMS" },
    /*::[*/
    15: { n: "PRINTMAIN" },
    /*::[*/
    16: { n: "PRINTSTRING" },
    /*::[*/
    17: { n: "GRAPHMAIN" },
    /*::[*/
    18: { n: "GRAPHSTRING" },
    /*::[*/
    19: { n: "??" },
    /*::[*/
    20: { n: "ERRCELL" },
    /*::[*/
    21: { n: "NACELL" },
    /*::[*/
    22: { n: "LABEL16", f: A },
    /*::[*/
    23: { n: "NUMBER17", f: L },
    /*::[*/
    24: { n: "NUMBER18", f: P },
    /*::[*/
    25: { n: "FORMULA19", f: M },
    /*::[*/
    26: { n: "FORMULA1A" },
    /*::[*/
    27: { n: "XFORMAT", f: Le },
    /*::[*/
    28: { n: "DTLABELMISC" },
    /*::[*/
    29: { n: "DTLABELCELL" },
    /*::[*/
    30: { n: "GRAPHWINDOW" },
    /*::[*/
    31: { n: "CPA" },
    /*::[*/
    32: { n: "LPLAUTO" },
    /*::[*/
    33: { n: "QUERY" },
    /*::[*/
    34: { n: "HIDDENSHEET" },
    /*::[*/
    35: { n: "??" },
    /*::[*/
    37: { n: "NUMBER25", f: b },
    /*::[*/
    38: { n: "??" },
    /*::[*/
    39: { n: "NUMBER27", f: K },
    /*::[*/
    40: { n: "FORMULA28", f: se },
    /*::[*/
    142: { n: "??" },
    /*::[*/
    147: { n: "??" },
    /*::[*/
    150: { n: "??" },
    /*::[*/
    151: { n: "??" },
    /*::[*/
    152: { n: "??" },
    /*::[*/
    153: { n: "??" },
    /*::[*/
    154: { n: "??" },
    /*::[*/
    155: { n: "??" },
    /*::[*/
    156: { n: "??" },
    /*::[*/
    163: { n: "??" },
    /*::[*/
    174: { n: "??" },
    /*::[*/
    175: { n: "??" },
    /*::[*/
    176: { n: "??" },
    /*::[*/
    177: { n: "??" },
    /*::[*/
    184: { n: "??" },
    /*::[*/
    185: { n: "??" },
    /*::[*/
    186: { n: "??" },
    /*::[*/
    187: { n: "??" },
    /*::[*/
    188: { n: "??" },
    /*::[*/
    195: { n: "??" },
    /*::[*/
    201: { n: "??" },
    /*::[*/
    204: { n: "SHEETNAMECS", f: re },
    /*::[*/
    205: { n: "??" },
    /*::[*/
    206: { n: "??" },
    /*::[*/
    207: { n: "??" },
    /*::[*/
    208: { n: "??" },
    /*::[*/
    256: { n: "??" },
    /*::[*/
    259: { n: "??" },
    /*::[*/
    260: { n: "??" },
    /*::[*/
    261: { n: "??" },
    /*::[*/
    262: { n: "??" },
    /*::[*/
    263: { n: "??" },
    /*::[*/
    265: { n: "??" },
    /*::[*/
    266: { n: "??" },
    /*::[*/
    267: { n: "??" },
    /*::[*/
    268: { n: "??" },
    /*::[*/
    270: { n: "??" },
    /*::[*/
    271: { n: "??" },
    /*::[*/
    384: { n: "??" },
    /*::[*/
    389: { n: "??" },
    /*::[*/
    390: { n: "??" },
    /*::[*/
    393: { n: "??" },
    /*::[*/
    396: { n: "??" },
    /*::[*/
    512: { n: "??" },
    /*::[*/
    514: { n: "??" },
    /*::[*/
    513: { n: "??" },
    /*::[*/
    516: { n: "??" },
    /*::[*/
    517: { n: "??" },
    /*::[*/
    640: { n: "??" },
    /*::[*/
    641: { n: "??" },
    /*::[*/
    642: { n: "??" },
    /*::[*/
    643: { n: "??" },
    /*::[*/
    644: { n: "??" },
    /*::[*/
    645: { n: "??" },
    /*::[*/
    646: { n: "??" },
    /*::[*/
    647: { n: "??" },
    /*::[*/
    648: { n: "??" },
    /*::[*/
    658: { n: "??" },
    /*::[*/
    659: { n: "??" },
    /*::[*/
    660: { n: "??" },
    /*::[*/
    661: { n: "??" },
    /*::[*/
    662: { n: "??" },
    /*::[*/
    665: { n: "??" },
    /*::[*/
    666: { n: "??" },
    /*::[*/
    768: { n: "??" },
    /*::[*/
    772: { n: "??" },
    /*::[*/
    1537: { n: "SHEETINFOQP", f: oe },
    /*::[*/
    1600: { n: "??" },
    /*::[*/
    1602: { n: "??" },
    /*::[*/
    1793: { n: "??" },
    /*::[*/
    1794: { n: "??" },
    /*::[*/
    1795: { n: "??" },
    /*::[*/
    1796: { n: "??" },
    /*::[*/
    1920: { n: "??" },
    /*::[*/
    2048: { n: "??" },
    /*::[*/
    2049: { n: "??" },
    /*::[*/
    2052: { n: "??" },
    /*::[*/
    2688: { n: "??" },
    /*::[*/
    10998: { n: "??" },
    /*::[*/
    12849: { n: "??" },
    /*::[*/
    28233: { n: "??" },
    /*::[*/
    28484: { n: "??" },
    /*::[*/
    65535: { n: "" }
  };
  return {
    sheet_to_wk1: a,
    book_to_wk3: n,
    to_workbook: t
  };
})();
function g1(e) {
  var t = {}, r = e.match(Sr), a = 0, n = !1;
  if (r) for (; a != r.length; ++a) {
    var i = ge(r[a]);
    switch (i[0].replace(/\w*:/g, "")) {
      /* 18.8.12 condense CT_BooleanProperty */
      /* ** not required . */
      case "<condense":
        break;
      /* 18.8.17 extend CT_BooleanProperty */
      /* ** not required . */
      case "<extend":
        break;
      /* 18.8.36 shadow CT_BooleanProperty */
      /* ** not required . */
      case "<shadow":
        if (!i.val) break;
      /* falls through */
      case "<shadow>":
      case "<shadow/>":
        t.shadow = 1;
        break;
      case "</shadow>":
        break;
      /* 18.4.1 charset CT_IntProperty TODO */
      case "<charset":
        if (i.val == "1") break;
        t.cp = zi[parseInt(i.val, 10)];
        break;
      /* 18.4.2 outline CT_BooleanProperty TODO */
      case "<outline":
        if (!i.val) break;
      /* falls through */
      case "<outline>":
      case "<outline/>":
        t.outline = 1;
        break;
      case "</outline>":
        break;
      /* 18.4.5 rFont CT_FontName */
      case "<rFont":
        t.name = i.val;
        break;
      /* 18.4.11 sz CT_FontSize */
      case "<sz":
        t.sz = i.val;
        break;
      /* 18.4.10 strike CT_BooleanProperty */
      case "<strike":
        if (!i.val) break;
      /* falls through */
      case "<strike>":
      case "<strike/>":
        t.strike = 1;
        break;
      case "</strike>":
        break;
      /* 18.4.13 u CT_UnderlineProperty */
      case "<u":
        if (!i.val) break;
        switch (i.val) {
          case "double":
            t.uval = "double";
            break;
          case "singleAccounting":
            t.uval = "single-accounting";
            break;
          case "doubleAccounting":
            t.uval = "double-accounting";
            break;
        }
      /* falls through */
      case "<u>":
      case "<u/>":
        t.u = 1;
        break;
      case "</u>":
        break;
      /* 18.8.2 b */
      case "<b":
        if (i.val == "0") break;
      /* falls through */
      case "<b>":
      case "<b/>":
        t.b = 1;
        break;
      case "</b>":
        break;
      /* 18.8.26 i */
      case "<i":
        if (i.val == "0") break;
      /* falls through */
      case "<i>":
      case "<i/>":
        t.i = 1;
        break;
      case "</i>":
        break;
      /* 18.3.1.15 color CT_Color TODO: tint, theme, auto, indexed */
      case "<color":
        i.rgb && (t.color = i.rgb.slice(2, 8));
        break;
      case "<color>":
      case "<color/>":
      case "</color>":
        break;
      /* 18.8.18 family ST_FontFamily */
      case "<family":
        t.family = i.val;
        break;
      case "<family>":
      case "<family/>":
      case "</family>":
        break;
      /* 18.4.14 vertAlign CT_VerticalAlignFontProperty TODO */
      case "<vertAlign":
        t.valign = i.val;
        break;
      case "<vertAlign>":
      case "<vertAlign/>":
      case "</vertAlign>":
        break;
      /* 18.8.35 scheme CT_FontScheme TODO */
      case "<scheme":
        break;
      case "<scheme>":
      case "<scheme/>":
      case "</scheme>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        n = !0;
        break;
      case "</ext>":
        n = !1;
        break;
      default:
        if (i[0].charCodeAt(1) !== 47 && !n) throw new Error("Unrecognized rich format " + i[0]);
    }
  }
  return t;
}
var E1 = /* @__PURE__ */ (function() {
  var e = qa("t"), t = qa("rPr");
  function r(i) {
    var s = i.match(e);
    if (!s) return { t: "s", v: "" };
    var c = { t: "s", v: Ie(s[1]) }, o = i.match(t);
    return o && (c.s = g1(o[1])), c;
  }
  var a = /<(?:\w+:)?r>/g, n = /<\/(?:\w+:)?r>/;
  return function(s) {
    return s.replace(a, "").split(n).map(r).filter(function(c) {
      return c.v;
    });
  };
})(), _1 = /* @__PURE__ */ (function() {
  var t = /(\r\n|\n)/g;
  function r(n, i, s) {
    var c = [];
    n.u && c.push("text-decoration: underline;"), n.uval && c.push("text-underline-style:" + n.uval + ";"), n.sz && c.push("font-size:" + n.sz + "pt;"), n.outline && c.push("text-effect: outline;"), n.shadow && c.push("text-shadow: auto;"), i.push('<span style="' + c.join("") + '">'), n.b && (i.push("<b>"), s.push("</b>")), n.i && (i.push("<i>"), s.push("</i>")), n.strike && (i.push("<s>"), s.push("</s>"));
    var o = n.valign || "";
    return o == "superscript" || o == "super" ? o = "sup" : o == "subscript" && (o = "sub"), o != "" && (i.push("<" + o + ">"), s.push("</" + o + ">")), s.push("</span>"), n;
  }
  function a(n) {
    var i = [[], n.v, []];
    return n.v ? (n.s && r(n.s, i[0], i[2]), i[0].join("") + i[1].replace(t, "<br/>") + i[2].join("")) : "";
  }
  return function(i) {
    return i.map(a).join("");
  };
})(), T1 = /<(?:\w+:)?t[^>]*>([^<]*)<\/(?:\w+:)?t>/g, w1 = /<(?:\w+:)?r>/, y1 = /<(?:\w+:)?rPh.*?>([\s\S]*?)<\/(?:\w+:)?rPh>/g;
function vs(e, t) {
  var r = t ? t.cellHTML : !0, a = {};
  return e ? (e.match(/^\s*<(?:\w+:)?t[^>]*>/) ? (a.t = Ie(Me(e.slice(e.indexOf(">") + 1).split(/<\/(?:\w+:)?t>/)[0] || "")), a.r = Me(e), r && (a.h = Qi(a.t))) : (
    /*y = */
    e.match(w1) && (a.r = Me(e), a.t = Ie(Me((e.replace(y1, "").match(T1) || []).join("").replace(Sr, ""))), r && (a.h = _1(E1(a.r))))
  ), a) : { t: "" };
}
var S1 = /<(?:\w+:)?sst([^>]*)>([\s\S]*)<\/(?:\w+:)?sst>/, k1 = /<(?:\w+:)?(?:si|sstItem)>/g, F1 = /<\/(?:\w+:)?(?:si|sstItem)>/;
function A1(e, t) {
  var r = [], a = "";
  if (!e) return r;
  var n = e.match(S1);
  if (n) {
    a = n[2].replace(k1, "").split(F1);
    for (var i = 0; i != a.length; ++i) {
      var s = vs(a[i].trim(), t);
      s != null && (r[r.length] = s);
    }
    n = ge(n[1]), r.Count = n.count, r.Unique = n.uniqueCount;
  }
  return r;
}
var N1 = /^\s|\s$|[\t\n\r]/;
function Go(e, t) {
  if (!t.bookSST) return "";
  var r = [er];
  r[r.length] = ne("sst", null, {
    xmlns: ea[0],
    count: e.Count,
    uniqueCount: e.Unique
  });
  for (var a = 0; a != e.length; ++a)
    if (e[a] != null) {
      var n = e[a], i = "<si>";
      n.r ? i += n.r : (i += "<t", n.t || (n.t = ""), n.t.match(N1) && (i += ' xml:space="preserve"'), i += ">" + Pe(n.t) + "</t>"), i += "</si>", r[r.length] = i;
    }
  return r.length > 2 && (r[r.length] = "</sst>", r[1] = r[1].replace("/>", ">")), r.join("");
}
function C1(e) {
  return [e.read_shift(4), e.read_shift(4)];
}
function O1(e, t) {
  var r = [], a = !1;
  return Tt(e, function(i, s, c) {
    switch (c) {
      case 159:
        r.Count = i[0], r.Unique = i[1];
        break;
      case 19:
        r.push(i);
        break;
      case 160:
        return !0;
      case 35:
        a = !0;
        break;
      case 36:
        a = !1;
        break;
      default:
        if (s.T, !a || t.WTF) throw new Error("Unexpected record 0x" + c.toString(16));
    }
  }), r;
}
function I1(e, t) {
  return t || (t = z(8)), t.write_shift(4, e.Count), t.write_shift(4, e.Unique), t;
}
var L1 = Hu;
function R1(e) {
  var t = Ir();
  q(t, 159, I1(e));
  for (var r = 0; r < e.length; ++r) q(t, 19, L1(e[r]));
  return q(
    t,
    160
    /* BrtEndSst */
  ), t.end();
}
function Vo(e) {
  if (typeof Ce < "u") return Ce.utils.encode(zt, e);
  for (var t = [], r = e.split(""), a = 0; a < r.length; ++a) t[a] = r[a].charCodeAt(0);
  return t;
}
function gt(e, t) {
  var r = {};
  return r.Major = e.read_shift(2), r.Minor = e.read_shift(2), t >= 4 && (e.l += t - 4), r;
}
function D1(e) {
  var t = {};
  return t.id = e.read_shift(0, "lpp4"), t.R = gt(e, 4), t.U = gt(e, 4), t.W = gt(e, 4), t;
}
function b1(e) {
  for (var t = e.read_shift(4), r = e.l + t - 4, a = {}, n = e.read_shift(4), i = []; n-- > 0; ) i.push({ t: e.read_shift(4), v: e.read_shift(0, "lpp4") });
  if (a.name = e.read_shift(0, "lpp4"), a.comps = i, e.l != r) throw new Error("Bad DataSpaceMapEntry: " + e.l + " != " + r);
  return a;
}
function P1(e) {
  var t = [];
  e.l += 4;
  for (var r = e.read_shift(4); r-- > 0; ) t.push(b1(e));
  return t;
}
function M1(e) {
  var t = [];
  e.l += 4;
  for (var r = e.read_shift(4); r-- > 0; ) t.push(e.read_shift(0, "lpp4"));
  return t;
}
function B1(e) {
  var t = {};
  return e.read_shift(4), e.l += 4, t.id = e.read_shift(0, "lpp4"), t.name = e.read_shift(0, "lpp4"), t.R = gt(e, 4), t.U = gt(e, 4), t.W = gt(e, 4), t;
}
function U1(e) {
  var t = B1(e);
  if (t.ename = e.read_shift(0, "8lpp4"), t.blksz = e.read_shift(4), t.cmode = e.read_shift(4), e.read_shift(4) != 4) throw new Error("Bad !Primary record");
  return t;
}
function zo(e, t) {
  var r = e.l + t, a = {};
  a.Flags = e.read_shift(4) & 63, e.l += 4, a.AlgID = e.read_shift(4);
  var n = !1;
  switch (a.AlgID) {
    case 26126:
    case 26127:
    case 26128:
      n = a.Flags == 36;
      break;
    case 26625:
      n = a.Flags == 4;
      break;
    case 0:
      n = a.Flags == 16 || a.Flags == 4 || a.Flags == 36;
      break;
    default:
      throw "Unrecognized encryption algorithm: " + a.AlgID;
  }
  if (!n) throw new Error("Encryption Flags/AlgID mismatch");
  return a.AlgIDHash = e.read_shift(4), a.KeySize = e.read_shift(4), a.ProviderType = e.read_shift(4), e.l += 8, a.CSPName = e.read_shift(r - e.l >> 1, "utf16le"), e.l = r, a;
}
function Yo(e, t) {
  var r = {}, a = e.l + t;
  return e.l += 4, r.Salt = e.slice(e.l, e.l + 16), e.l += 16, r.Verifier = e.slice(e.l, e.l + 16), e.l += 16, e.read_shift(4), r.VerifierHash = e.slice(e.l, a), e.l = a, r;
}
function X1(e) {
  var t = gt(e);
  switch (t.Minor) {
    case 2:
      return [t.Minor, W1(e)];
    case 3:
      return [t.Minor, H1()];
    case 4:
      return [t.Minor, G1(e)];
  }
  throw new Error("ECMA-376 Encrypted file unrecognized Version: " + t.Minor);
}
function W1(e) {
  var t = e.read_shift(4);
  if ((t & 63) != 36) throw new Error("EncryptionInfo mismatch");
  var r = e.read_shift(4), a = zo(e, r), n = Yo(e, e.length - e.l);
  return { t: "Std", h: a, v: n };
}
function H1() {
  throw new Error("File is password-protected: ECMA-376 Extensible");
}
function G1(e) {
  var t = ["saltSize", "blockSize", "keyBits", "hashSize", "cipherAlgorithm", "cipherChaining", "hashAlgorithm", "saltValue"];
  e.l += 4;
  var r = e.read_shift(e.length - e.l, "utf8"), a = {};
  return r.replace(Sr, function(i) {
    var s = ge(i);
    switch (lt(s[0])) {
      case "<?xml":
        break;
      case "<encryption":
      case "</encryption>":
        break;
      case "<keyData":
        t.forEach(function(c) {
          a[c] = s[c];
        });
        break;
      case "<dataIntegrity":
        a.encryptedHmacKey = s.encryptedHmacKey, a.encryptedHmacValue = s.encryptedHmacValue;
        break;
      case "<keyEncryptors>":
      case "<keyEncryptors":
        a.encs = [];
        break;
      case "</keyEncryptors>":
        break;
      case "<keyEncryptor":
        a.uri = s.uri;
        break;
      case "</keyEncryptor>":
        break;
      case "<encryptedKey":
        a.encs.push(s);
        break;
      default:
        throw s[0];
    }
  }), a;
}
function V1(e, t) {
  var r = {}, a = r.EncryptionVersionInfo = gt(e, 4);
  if (t -= 4, a.Minor != 2) throw new Error("unrecognized minor version code: " + a.Minor);
  if (a.Major > 4 || a.Major < 2) throw new Error("unrecognized major version code: " + a.Major);
  r.Flags = e.read_shift(4), t -= 4;
  var n = e.read_shift(4);
  return t -= 4, r.EncryptionHeader = zo(e, n), t -= n, r.EncryptionVerifier = Yo(e, t), r;
}
function z1(e) {
  var t = {}, r = t.EncryptionVersionInfo = gt(e, 4);
  if (r.Major != 1 || r.Minor != 1) throw "unrecognized version code " + r.Major + " : " + r.Minor;
  return t.Salt = e.read_shift(16), t.EncryptedVerifier = e.read_shift(16), t.EncryptedVerifierHash = e.read_shift(16), t;
}
function gs(e) {
  var t = 0, r, a = Vo(e), n = a.length + 1, i, s, c, o, l;
  for (r = Ot(n), r[0] = a.length, i = 1; i != n; ++i) r[i] = a[i - 1];
  for (i = n - 1; i >= 0; --i)
    s = r[i], c = (t & 16384) === 0 ? 0 : 1, o = t << 1 & 32767, l = c | o, t = l ^ s;
  return t ^ 52811;
}
var jo = /* @__PURE__ */ (function() {
  var e = [187, 255, 255, 186, 255, 255, 185, 128, 0, 190, 15, 0, 191, 15, 0], t = [57840, 7439, 52380, 33984, 4364, 3600, 61902, 12606, 6258, 57657, 54287, 34041, 10252, 43370, 20163], r = [44796, 19929, 39858, 10053, 20106, 40212, 10761, 31585, 63170, 64933, 60267, 50935, 40399, 11199, 17763, 35526, 1453, 2906, 5812, 11624, 23248, 885, 1770, 3540, 7080, 14160, 28320, 56640, 55369, 41139, 20807, 41614, 21821, 43642, 17621, 28485, 56970, 44341, 19019, 38038, 14605, 29210, 60195, 50791, 40175, 10751, 21502, 43004, 24537, 18387, 36774, 3949, 7898, 15796, 31592, 63184, 47201, 24803, 49606, 37805, 14203, 28406, 56812, 17824, 35648, 1697, 3394, 6788, 13576, 27152, 43601, 17539, 35078, 557, 1114, 2228, 4456, 30388, 60776, 51953, 34243, 7079, 14158, 28316, 14128, 28256, 56512, 43425, 17251, 34502, 7597, 13105, 26210, 52420, 35241, 883, 1766, 3532, 4129, 8258, 16516, 33032, 4657, 9314, 18628], a = function(s) {
    return (s / 2 | s * 128) & 255;
  }, n = function(s, c) {
    return a(s ^ c);
  }, i = function(s) {
    for (var c = t[s.length - 1], o = 104, l = s.length - 1; l >= 0; --l)
      for (var f = s[l], d = 0; d != 7; ++d)
        f & 64 && (c ^= r[o]), f *= 2, --o;
    return c;
  };
  return function(s) {
    for (var c = Vo(s), o = i(c), l = c.length, f = Ot(16), d = 0; d != 16; ++d) f[d] = 0;
    var h, p, m;
    for ((l & 1) === 1 && (h = o >> 8, f[l] = n(e[0], h), --l, h = o & 255, p = c[c.length - 1], f[l] = n(p, h)); l > 0; )
      --l, h = o >> 8, f[l] = n(c[l], h), --l, h = o & 255, f[l] = n(c[l], h);
    for (l = 15, m = 15 - c.length; m > 0; )
      h = o >> 8, f[l] = n(e[m], h), --l, --m, h = o & 255, f[l] = n(c[l], h), --l, --m;
    return f;
  };
})(), Y1 = function(e, t, r, a, n) {
  n || (n = t), a || (a = jo(e));
  var i, s;
  for (i = 0; i != t.length; ++i)
    s = t[i], s ^= a[r], s = (s >> 5 | s << 3) & 255, n[i] = s, ++r;
  return [n, r, a];
}, j1 = function(e) {
  var t = 0, r = jo(e);
  return function(a) {
    var n = Y1("", a, t, r);
    return t = n[1], n[0];
  };
};
function K1(e, t, r, a) {
  var n = { key: ar(e), verificationBytes: ar(e) };
  return r.password && (n.verifier = gs(r.password)), a.valid = n.verificationBytes === n.verifier, a.valid && (a.insitu = j1(r.password)), n;
}
function q1(e, t, r) {
  var a = r || {};
  return a.Info = e.read_shift(2), e.l -= 2, a.Info === 1 ? a.Data = z1(e) : a.Data = V1(e, t), a;
}
function $1(e, t, r) {
  var a = { Type: r.biff >= 8 ? e.read_shift(2) : 0 };
  return a.Type ? q1(e, t - 2, a) : K1(e, r.biff >= 8 ? t : t - 2, r, a), a;
}
var Ko = /* @__PURE__ */ (function() {
  function e(n, i) {
    switch (i.type) {
      case "base64":
        return t(Mr(n), i);
      case "binary":
        return t(n, i);
      case "buffer":
        return t(ye && Buffer.isBuffer(n) ? n.toString("binary") : Dt(n), i);
      case "array":
        return t(jt(n), i);
    }
    throw new Error("Unrecognized type " + i.type);
  }
  function t(n, i) {
    var s = i || {}, c = s.dense ? [] : {}, o = n.match(/\\trowd.*?\\row\b/g);
    if (!o.length) throw new Error("RTF missing table");
    var l = { s: { c: 0, r: 0 }, e: { c: 0, r: o.length - 1 } };
    return o.forEach(function(f, d) {
      Array.isArray(c) && (c[d] = []);
      for (var h = /\\\w+\b/g, p = 0, m, x = -1; m = h.exec(f); ) {
        switch (m[0]) {
          case "\\cell":
            var u = f.slice(p, h.lastIndex - m[0].length);
            if (u[0] == " " && (u = u.slice(1)), ++x, u.length) {
              var v = { v: u, t: "s" };
              Array.isArray(c) ? c[d][x] = v : c[me({ r: d, c: x })] = v;
            }
            break;
        }
        p = h.lastIndex;
      }
      x > l.e.c && (l.e.c = x);
    }), c["!ref"] = _e(l), c;
  }
  function r(n, i) {
    return bt(e(n, i), i);
  }
  function a(n) {
    for (var i = ["{\\rtf1\\ansi"], s = Ae(n["!ref"]), c, o = Array.isArray(n), l = s.s.r; l <= s.e.r; ++l) {
      i.push("\\trowd\\trautofit1");
      for (var f = s.s.c; f <= s.e.c; ++f) i.push("\\cellx" + (f + 1));
      for (i.push("\\pard\\intbl"), f = s.s.c; f <= s.e.c; ++f) {
        var d = me({ r: l, c: f });
        c = o ? (n[l] || [])[f] : n[d], !(!c || c.v == null && (!c.f || c.F)) && (i.push(" " + (c.w || (ft(c), c.w))), i.push("\\cell"));
      }
      i.push("\\pard\\intbl\\row");
    }
    return i.join("") + "}";
  }
  return {
    to_workbook: r,
    to_sheet: e,
    from_sheet: a
  };
})();
function J1(e) {
  var t = e.slice(e[0] === "#" ? 1 : 0).slice(0, 6);
  return [parseInt(t.slice(0, 2), 16), parseInt(t.slice(2, 4), 16), parseInt(t.slice(4, 6), 16)];
}
function Qa(e) {
  for (var t = 0, r = 1; t != 3; ++t) r = r * 256 + (e[t] > 255 ? 255 : e[t] < 0 ? 0 : e[t]);
  return r.toString(16).toUpperCase().slice(1);
}
function Z1(e) {
  var t = e[0] / 255, r = e[1] / 255, a = e[2] / 255, n = Math.max(t, r, a), i = Math.min(t, r, a), s = n - i;
  if (s === 0) return [0, 0, t];
  var c = 0, o = 0, l = n + i;
  switch (o = s / (l > 1 ? 2 - l : l), n) {
    case t:
      c = ((r - a) / s + 6) % 6;
      break;
    case r:
      c = (a - t) / s + 2;
      break;
    case a:
      c = (t - r) / s + 4;
      break;
  }
  return [c / 6, o, l / 2];
}
function Q1(e) {
  var t = e[0], r = e[1], a = e[2], n = r * 2 * (a < 0.5 ? a : 1 - a), i = a - n / 2, s = [i, i, i], c = 6 * t, o;
  if (r !== 0) switch (c | 0) {
    case 0:
    case 6:
      o = n * c, s[0] += n, s[1] += o;
      break;
    case 1:
      o = n * (2 - c), s[0] += o, s[1] += n;
      break;
    case 2:
      o = n * (c - 2), s[1] += n, s[2] += o;
      break;
    case 3:
      o = n * (4 - c), s[1] += o, s[2] += n;
      break;
    case 4:
      o = n * (c - 4), s[2] += n, s[0] += o;
      break;
    case 5:
      o = n * (6 - c), s[2] += o, s[0] += n;
      break;
  }
  for (var l = 0; l != 3; ++l) s[l] = Math.round(s[l] * 255);
  return s;
}
function Un(e, t) {
  if (t === 0) return e;
  var r = Z1(J1(e));
  return t < 0 ? r[2] = r[2] * (1 + t) : r[2] = 1 - (1 - r[2]) * (1 - t), Qa(Q1(r));
}
var qo = 6, ex = 15, rx = 1, Er = qo;
function en(e) {
  return Math.floor((e + Math.round(128 / Er) / 256) * Er);
}
function rn(e) {
  return Math.floor((e - 5) / Er * 100 + 0.5) / 100;
}
function Xn(e) {
  return Math.round((e * Er + 5) / Er * 256) / 256;
}
function _i(e) {
  return Xn(rn(en(e)));
}
function Es(e) {
  var t = Math.abs(e - _i(e)), r = Er;
  if (t > 5e-3) for (Er = rx; Er < ex; ++Er) Math.abs(e - _i(e)) <= t && (t = Math.abs(e - _i(e)), r = Er);
  Er = r;
}
function It(e) {
  e.width ? (e.wpx = en(e.width), e.wch = rn(e.wpx), e.MDW = Er) : e.wpx ? (e.wch = rn(e.wpx), e.width = Xn(e.wch), e.MDW = Er) : typeof e.wch == "number" && (e.width = Xn(e.wch), e.wpx = en(e.width), e.MDW = Er), e.customWidth && delete e.customWidth;
}
var tx = 96, $o = tx;
function tn(e) {
  return e * 96 / $o;
}
function ga(e) {
  return e * $o / 96;
}
var ax = {
  None: "none",
  Solid: "solid",
  Gray50: "mediumGray",
  Gray75: "darkGray",
  Gray25: "lightGray",
  HorzStripe: "darkHorizontal",
  VertStripe: "darkVertical",
  ReverseDiagStripe: "darkDown",
  DiagStripe: "darkUp",
  DiagCross: "darkGrid",
  ThickDiagCross: "darkTrellis",
  ThinHorzStripe: "lightHorizontal",
  ThinVertStripe: "lightVertical",
  ThinReverseDiagStripe: "lightDown",
  ThinHorzCross: "lightGrid"
};
function nx(e, t, r, a) {
  t.Borders = [];
  var n = {}, i = !1;
  (e[0].match(Sr) || []).forEach(function(s) {
    var c = ge(s);
    switch (lt(c[0])) {
      case "<borders":
      case "<borders>":
      case "</borders>":
        break;
      /* 18.8.4 border CT_Border */
      case "<border":
      case "<border>":
      case "<border/>":
        n = /*::(*/
        {}, c.diagonalUp && (n.diagonalUp = We(c.diagonalUp)), c.diagonalDown && (n.diagonalDown = We(c.diagonalDown)), t.Borders.push(n);
        break;
      case "</border>":
        break;
      /* note: not in spec, appears to be CT_BorderPr */
      case "<left/>":
        break;
      case "<left":
      case "<left>":
        break;
      case "</left>":
        break;
      /* note: not in spec, appears to be CT_BorderPr */
      case "<right/>":
        break;
      case "<right":
      case "<right>":
        break;
      case "</right>":
        break;
      /* 18.8.43 top CT_BorderPr */
      case "<top/>":
        break;
      case "<top":
      case "<top>":
        break;
      case "</top>":
        break;
      /* 18.8.6 bottom CT_BorderPr */
      case "<bottom/>":
        break;
      case "<bottom":
      case "<bottom>":
        break;
      case "</bottom>":
        break;
      /* 18.8.13 diagonal CT_BorderPr */
      case "<diagonal":
      case "<diagonal>":
      case "<diagonal/>":
        break;
      case "</diagonal>":
        break;
      /* 18.8.25 horizontal CT_BorderPr */
      case "<horizontal":
      case "<horizontal>":
      case "<horizontal/>":
        break;
      case "</horizontal>":
        break;
      /* 18.8.44 vertical CT_BorderPr */
      case "<vertical":
      case "<vertical>":
      case "<vertical/>":
        break;
      case "</vertical>":
        break;
      /* 18.8.37 start CT_BorderPr */
      case "<start":
      case "<start>":
      case "<start/>":
        break;
      case "</start>":
        break;
      /* 18.8.16 end CT_BorderPr */
      case "<end":
      case "<end>":
      case "<end/>":
        break;
      case "</end>":
        break;
      /* 18.8.? color CT_Color */
      case "<color":
      case "<color>":
        break;
      case "<color/>":
      case "</color>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (a && a.WTF && !i)
          throw new Error("unrecognized " + c[0] + " in borders");
    }
  });
}
function ix(e, t, r, a) {
  t.Fills = [];
  var n = {}, i = !1;
  (e[0].match(Sr) || []).forEach(function(s) {
    var c = ge(s);
    switch (lt(c[0])) {
      case "<fills":
      case "<fills>":
      case "</fills>":
        break;
      /* 18.8.20 fill CT_Fill */
      case "<fill>":
      case "<fill":
      case "<fill/>":
        n = {}, t.Fills.push(n);
        break;
      case "</fill>":
        break;
      /* 18.8.24 gradientFill CT_GradientFill */
      case "<gradientFill>":
        break;
      case "<gradientFill":
      case "</gradientFill>":
        t.Fills.push(n), n = {};
        break;
      /* 18.8.32 patternFill CT_PatternFill */
      case "<patternFill":
      case "<patternFill>":
        c.patternType && (n.patternType = c.patternType);
        break;
      case "<patternFill/>":
      case "</patternFill>":
        break;
      /* 18.8.3 bgColor CT_Color */
      case "<bgColor":
        n.bgColor || (n.bgColor = {}), c.indexed && (n.bgColor.indexed = parseInt(c.indexed, 10)), c.theme && (n.bgColor.theme = parseInt(c.theme, 10)), c.tint && (n.bgColor.tint = parseFloat(c.tint)), c.rgb && (n.bgColor.rgb = c.rgb.slice(-6));
        break;
      case "<bgColor/>":
      case "</bgColor>":
        break;
      /* 18.8.19 fgColor CT_Color */
      case "<fgColor":
        n.fgColor || (n.fgColor = {}), c.theme && (n.fgColor.theme = parseInt(c.theme, 10)), c.tint && (n.fgColor.tint = parseFloat(c.tint)), c.rgb != null && (n.fgColor.rgb = c.rgb.slice(-6));
        break;
      case "<fgColor/>":
      case "</fgColor>":
        break;
      /* 18.8.38 stop CT_GradientStop */
      case "<stop":
      case "<stop/>":
        break;
      case "</stop>":
        break;
      /* 18.8.? color CT_Color */
      case "<color":
      case "<color/>":
        break;
      case "</color>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (a && a.WTF && !i)
          throw new Error("unrecognized " + c[0] + " in fills");
    }
  });
}
function sx(e, t, r, a) {
  t.Fonts = [];
  var n = {}, i = !1;
  (e[0].match(Sr) || []).forEach(function(s) {
    var c = ge(s);
    switch (lt(c[0])) {
      case "<fonts":
      case "<fonts>":
      case "</fonts>":
        break;
      /* 18.8.22 font CT_Font */
      case "<font":
      case "<font>":
        break;
      case "</font>":
      case "<font/>":
        t.Fonts.push(n), n = {};
        break;
      /* 18.8.29 name CT_FontName */
      case "<name":
        c.val && (n.name = Me(c.val));
        break;
      case "<name/>":
      case "</name>":
        break;
      /* 18.8.2  b CT_BooleanProperty */
      case "<b":
        n.bold = c.val ? We(c.val) : 1;
        break;
      case "<b/>":
        n.bold = 1;
        break;
      /* 18.8.26 i CT_BooleanProperty */
      case "<i":
        n.italic = c.val ? We(c.val) : 1;
        break;
      case "<i/>":
        n.italic = 1;
        break;
      /* 18.4.13 u CT_UnderlineProperty */
      case "<u":
        switch (c.val) {
          case "none":
            n.underline = 0;
            break;
          case "single":
            n.underline = 1;
            break;
          case "double":
            n.underline = 2;
            break;
          case "singleAccounting":
            n.underline = 33;
            break;
          case "doubleAccounting":
            n.underline = 34;
            break;
        }
        break;
      case "<u/>":
        n.underline = 1;
        break;
      /* 18.4.10 strike CT_BooleanProperty */
      case "<strike":
        n.strike = c.val ? We(c.val) : 1;
        break;
      case "<strike/>":
        n.strike = 1;
        break;
      /* 18.4.2  outline CT_BooleanProperty */
      case "<outline":
        n.outline = c.val ? We(c.val) : 1;
        break;
      case "<outline/>":
        n.outline = 1;
        break;
      /* 18.8.36 shadow CT_BooleanProperty */
      case "<shadow":
        n.shadow = c.val ? We(c.val) : 1;
        break;
      case "<shadow/>":
        n.shadow = 1;
        break;
      /* 18.8.12 condense CT_BooleanProperty */
      case "<condense":
        n.condense = c.val ? We(c.val) : 1;
        break;
      case "<condense/>":
        n.condense = 1;
        break;
      /* 18.8.17 extend CT_BooleanProperty */
      case "<extend":
        n.extend = c.val ? We(c.val) : 1;
        break;
      case "<extend/>":
        n.extend = 1;
        break;
      /* 18.4.11 sz CT_FontSize */
      case "<sz":
        c.val && (n.sz = +c.val);
        break;
      case "<sz/>":
      case "</sz>":
        break;
      /* 18.4.14 vertAlign CT_VerticalAlignFontProperty */
      case "<vertAlign":
        c.val && (n.vertAlign = c.val);
        break;
      case "<vertAlign/>":
      case "</vertAlign>":
        break;
      /* 18.8.18 family CT_FontFamily */
      case "<family":
        c.val && (n.family = parseInt(c.val, 10));
        break;
      case "<family/>":
      case "</family>":
        break;
      /* 18.8.35 scheme CT_FontScheme */
      case "<scheme":
        c.val && (n.scheme = c.val);
        break;
      case "<scheme/>":
      case "</scheme>":
        break;
      /* 18.4.1 charset CT_IntProperty */
      case "<charset":
        if (c.val == "1") break;
        c.codepage = zi[parseInt(c.val, 10)];
        break;
      /* 18.?.? color CT_Color */
      case "<color":
        if (n.color || (n.color = {}), c.auto && (n.color.auto = We(c.auto)), c.rgb) n.color.rgb = c.rgb.slice(-6);
        else if (c.indexed) {
          n.color.index = parseInt(c.indexed, 10);
          var o = Wt[n.color.index];
          n.color.index == 81 && (o = Wt[1]), o || (o = Wt[1]), n.color.rgb = o[0].toString(16) + o[1].toString(16) + o[2].toString(16);
        } else c.theme && (n.color.theme = parseInt(c.theme, 10), c.tint && (n.color.tint = parseFloat(c.tint)), c.theme && r.themeElements && r.themeElements.clrScheme && (n.color.rgb = Un(r.themeElements.clrScheme[n.color.theme].rgb, n.color.tint || 0)));
        break;
      case "<color/>":
      case "</color>":
        break;
      /* note: sometimes mc:AlternateContent appears bare */
      case "<AlternateContent":
        i = !0;
        break;
      case "</AlternateContent>":
        i = !1;
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        i = !0;
        break;
      case "</ext>":
        i = !1;
        break;
      default:
        if (a && a.WTF && !i)
          throw new Error("unrecognized " + c[0] + " in fonts");
    }
  });
}
function cx(e, t, r) {
  t.NumberFmt = [];
  for (var a = $e(pe), n = 0; n < a.length; ++n) t.NumberFmt[a[n]] = pe[a[n]];
  var i = e[0].match(Sr);
  if (i)
    for (n = 0; n < i.length; ++n) {
      var s = ge(i[n]);
      switch (lt(s[0])) {
        case "<numFmts":
        case "</numFmts>":
        case "<numFmts/>":
        case "<numFmts>":
          break;
        case "<numFmt":
          {
            var c = Ie(Me(s.formatCode)), o = parseInt(s.numFmtId, 10);
            if (t.NumberFmt[o] = c, o > 0) {
              if (o > 392) {
                for (o = 392; o > 60 && t.NumberFmt[o] != null; --o) ;
                t.NumberFmt[o] = c;
              }
              ot(c, o);
            }
          }
          break;
        case "</numFmt>":
          break;
        default:
          if (r.WTF) throw new Error("unrecognized " + s[0] + " in numFmts");
      }
    }
}
function ox(e) {
  var t = ["<numFmts>"];
  return [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(r) {
    for (var a = r[0]; a <= r[1]; ++a) e[a] != null && (t[t.length] = ne("numFmt", null, { numFmtId: a, formatCode: Pe(e[a]) }));
  }), t.length === 1 ? "" : (t[t.length] = "</numFmts>", t[0] = ne("numFmts", null, { count: t.length - 2 }).replace("/>", ">"), t.join(""));
}
var kn = ["numFmtId", "fillId", "fontId", "borderId", "xfId"], Fn = ["applyAlignment", "applyBorder", "applyFill", "applyFont", "applyNumberFormat", "applyProtection", "pivotButton", "quotePrefix"];
function fx(e, t, r) {
  t.CellXf = [];
  var a, n = !1;
  (e[0].match(Sr) || []).forEach(function(i) {
    var s = ge(i), c = 0;
    switch (lt(s[0])) {
      case "<cellXfs":
      case "<cellXfs>":
      case "<cellXfs/>":
      case "</cellXfs>":
        break;
      /* 18.8.45 xf CT_Xf */
      case "<xf":
      case "<xf/>":
        for (a = s, delete a[0], c = 0; c < kn.length; ++c) a[kn[c]] && (a[kn[c]] = parseInt(a[kn[c]], 10));
        for (c = 0; c < Fn.length; ++c) a[Fn[c]] && (a[Fn[c]] = We(a[Fn[c]]));
        if (t.NumberFmt && a.numFmtId > 392) {
          for (c = 392; c > 60; --c) if (t.NumberFmt[a.numFmtId] == t.NumberFmt[c]) {
            a.numFmtId = c;
            break;
          }
        }
        t.CellXf.push(a);
        break;
      case "</xf>":
        break;
      /* 18.8.1 alignment CT_CellAlignment */
      case "<alignment":
      case "<alignment/>":
        var o = {};
        s.vertical && (o.vertical = s.vertical), s.horizontal && (o.horizontal = s.horizontal), s.textRotation != null && (o.textRotation = s.textRotation), s.indent && (o.indent = s.indent), s.wrapText && (o.wrapText = We(s.wrapText)), a.alignment = o;
        break;
      case "</alignment>":
        break;
      /* 18.8.33 protection CT_CellProtection */
      case "<protection":
        break;
      case "</protection>":
      case "<protection/>":
        break;
      /* note: sometimes mc:AlternateContent appears bare */
      case "<AlternateContent":
        n = !0;
        break;
      case "</AlternateContent>":
        n = !1;
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
        break;
      case "<ext":
        n = !0;
        break;
      case "</ext>":
        n = !1;
        break;
      default:
        if (r && r.WTF && !n)
          throw new Error("unrecognized " + s[0] + " in cellXfs");
    }
  });
}
function lx(e) {
  var t = [];
  return t[t.length] = ne("cellXfs", null), e.forEach(function(r) {
    t[t.length] = ne("xf", null, r);
  }), t[t.length] = "</cellXfs>", t.length === 2 ? "" : (t[0] = ne("cellXfs", null, { count: t.length - 2 }).replace("/>", ">"), t.join(""));
}
var ux = /* @__PURE__ */ (function() {
  var t = /<(?:\w+:)?numFmts([^>]*)>[\S\s]*?<\/(?:\w+:)?numFmts>/, r = /<(?:\w+:)?cellXfs([^>]*)>[\S\s]*?<\/(?:\w+:)?cellXfs>/, a = /<(?:\w+:)?fills([^>]*)>[\S\s]*?<\/(?:\w+:)?fills>/, n = /<(?:\w+:)?fonts([^>]*)>[\S\s]*?<\/(?:\w+:)?fonts>/, i = /<(?:\w+:)?borders([^>]*)>[\S\s]*?<\/(?:\w+:)?borders>/;
  return function(c, o, l) {
    var f = {};
    if (!c) return f;
    c = c.replace(/<!--([\s\S]*?)-->/mg, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, "");
    var d;
    return (d = c.match(t)) && cx(d, f, l), (d = c.match(n)) && sx(d, f, o, l), (d = c.match(a)) && ix(d, f, o, l), (d = c.match(i)) && nx(d, f, o, l), (d = c.match(r)) && fx(d, f, l), f;
  };
})();
function Jo(e, t) {
  var r = [er, ne("styleSheet", null, {
    xmlns: ea[0],
    "xmlns:vt": ir.vt
  })], a;
  return e.SSF && (a = ox(e.SSF)) != null && (r[r.length] = a), r[r.length] = '<fonts count="1"><font><sz val="12"/><color theme="1"/><name val="Calibri"/><family val="2"/><scheme val="minor"/></font></fonts>', r[r.length] = '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>', r[r.length] = '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>', r[r.length] = '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>', (a = lx(t.cellXfs)) && (r[r.length] = a), r[r.length] = '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>', r[r.length] = '<dxfs count="0"/>', r[r.length] = '<tableStyles count="0" defaultTableStyle="TableStyleMedium9" defaultPivotStyle="PivotStyleMedium4"/>', r.length > 2 && (r[r.length] = "</styleSheet>", r[1] = r[1].replace("/>", ">")), r.join("");
}
function hx(e, t) {
  var r = e.read_shift(2), a = wr(e);
  return [r, a];
}
function dx(e, t, r) {
  r || (r = z(6 + 4 * t.length)), r.write_shift(2, e), lr(t, r);
  var a = r.length > r.l ? r.slice(0, r.l) : r;
  return r.l == null && (r.l = r.length), a;
}
function xx(e, t, r) {
  var a = {};
  a.sz = e.read_shift(2) / 20;
  var n = qu(e);
  n.fItalic && (a.italic = 1), n.fCondense && (a.condense = 1), n.fExtend && (a.extend = 1), n.fShadow && (a.shadow = 1), n.fOutline && (a.outline = 1), n.fStrikeout && (a.strike = 1);
  var i = e.read_shift(2);
  switch (i === 700 && (a.bold = 1), e.read_shift(2)) {
    /* case 0: out.vertAlign = "baseline"; break; */
    case 1:
      a.vertAlign = "superscript";
      break;
    case 2:
      a.vertAlign = "subscript";
      break;
  }
  var s = e.read_shift(1);
  s != 0 && (a.underline = s);
  var c = e.read_shift(1);
  c > 0 && (a.family = c);
  var o = e.read_shift(1);
  switch (o > 0 && (a.charset = o), e.l++, a.color = Ku(e), e.read_shift(1)) {
    /* case 0: out.scheme = "none": break; */
    case 1:
      a.scheme = "major";
      break;
    case 2:
      a.scheme = "minor";
      break;
  }
  return a.name = wr(e), a;
}
function px(e, t) {
  t || (t = z(153)), t.write_shift(2, e.sz * 20), $u(e, t), t.write_shift(2, e.bold ? 700 : 400);
  var r = 0;
  e.vertAlign == "superscript" ? r = 1 : e.vertAlign == "subscript" && (r = 2), t.write_shift(2, r), t.write_shift(1, e.underline || 0), t.write_shift(1, e.family || 0), t.write_shift(1, e.charset || 0), t.write_shift(1, 0), Pn(e.color, t);
  var a = 0;
  return a = 2, t.write_shift(1, a), lr(e.name, t), t.length > t.l ? t.slice(0, t.l) : t;
}
var mx = [
  "none",
  "solid",
  "mediumGray",
  "darkGray",
  "lightGray",
  "darkHorizontal",
  "darkVertical",
  "darkDown",
  "darkUp",
  "darkGrid",
  "darkTrellis",
  "lightHorizontal",
  "lightVertical",
  "lightDown",
  "lightUp",
  "lightGrid",
  "lightTrellis",
  "gray125",
  "gray0625"
], Ti, vx = yr;
function Z0(e, t) {
  t || (t = z(84)), Ti || (Ti = zn(mx));
  var r = Ti[e.patternType];
  r == null && (r = 40), t.write_shift(4, r);
  var a = 0;
  if (r != 40)
    for (Pn({ auto: 1 }, t), Pn({ auto: 1 }, t); a < 12; ++a) t.write_shift(4, 0);
  else {
    for (; a < 4; ++a) t.write_shift(4, 0);
    for (; a < 12; ++a) t.write_shift(4, 0);
  }
  return t.length > t.l ? t.slice(0, t.l) : t;
}
function gx(e, t) {
  var r = e.l + t, a = e.read_shift(2), n = e.read_shift(2);
  return e.l = r, { ixfe: a, numFmtId: n };
}
function Zo(e, t, r) {
  r || (r = z(16)), r.write_shift(2, t || 0), r.write_shift(2, e.numFmtId || 0), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(1, 0), r.write_shift(1, 0);
  var a = 0;
  return r.write_shift(1, a), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(1, 0), r;
}
function La(e, t) {
  return t || (t = z(10)), t.write_shift(1, 0), t.write_shift(1, 0), t.write_shift(4, 0), t.write_shift(4, 0), t;
}
var Ex = yr;
function _x(e, t) {
  return t || (t = z(51)), t.write_shift(1, 0), La(null, t), La(null, t), La(null, t), La(null, t), La(null, t), t.length > t.l ? t.slice(0, t.l) : t;
}
function Tx(e, t) {
  return t || (t = z(52)), t.write_shift(4, e.xfId), t.write_shift(2, 1), t.write_shift(1, 0), t.write_shift(1, 0), bn(e.name || "", t), t.length > t.l ? t.slice(0, t.l) : t;
}
function wx(e, t, r) {
  var a = z(2052);
  return a.write_shift(4, e), bn(t, a), bn(r, a), a.length > a.l ? a.slice(0, a.l) : a;
}
function yx(e, t, r) {
  var a = {};
  a.NumberFmt = [];
  for (var n in pe) a.NumberFmt[n] = pe[n];
  a.CellXf = [], a.Fonts = [];
  var i = [], s = !1;
  return Tt(e, function(o, l, f) {
    switch (f) {
      case 44:
        a.NumberFmt[o[0]] = o[1], ot(o[1], o[0]);
        break;
      case 43:
        a.Fonts.push(o), o.color.theme != null && t && t.themeElements && t.themeElements.clrScheme && (o.color.rgb = Un(t.themeElements.clrScheme[o.color.theme].rgb, o.color.tint || 0));
        break;
      case 1025:
        break;
      case 45:
        break;
      case 46:
        break;
      case 47:
        i[i.length - 1] == 617 && a.CellXf.push(o);
        break;
      case 48:
      /* BrtStyle */
      case 507:
      /* BrtDXF */
      case 572:
      /* BrtMRUColor */
      case 475:
        break;
      case 1171:
      /* BrtDXF14 */
      case 2102:
      /* BrtDXF15 */
      case 1130:
      /* BrtSlicerStyleElement */
      case 512:
      /* BrtTableStyleElement */
      case 2095:
      /* BrtTimelineStyleElement */
      case 3072:
        break;
      case 35:
        s = !0;
        break;
      case 36:
        s = !1;
        break;
      case 37:
        i.push(f), s = !0;
        break;
      case 38:
        i.pop(), s = !1;
        break;
      default:
        if (l.T > 0) i.push(f);
        else if (l.T < 0) i.pop();
        else if (!s || r.WTF && i[i.length - 1] != 37) throw new Error("Unexpected record 0x" + f.toString(16));
    }
  }), a;
}
function Sx(e, t) {
  if (t) {
    var r = 0;
    [[5, 8], [23, 26], [41, 44], [
      /*63*/
      50,
      /*66],[164,*/
      392
    ]].forEach(function(a) {
      for (var n = a[0]; n <= a[1]; ++n) t[n] != null && ++r;
    }), r != 0 && (q(e, 615, rt(r)), [[5, 8], [23, 26], [41, 44], [
      /*63*/
      50,
      /*66],[164,*/
      392
    ]].forEach(function(a) {
      for (var n = a[0]; n <= a[1]; ++n) t[n] != null && q(e, 44, dx(n, t[n]));
    }), q(
      e,
      616
      /* BrtEndFmts */
    ));
  }
}
function kx(e) {
  var t = 1;
  q(e, 611, rt(t)), q(e, 43, px({
    sz: 12,
    color: { theme: 1 },
    name: "Calibri",
    family: 2
  })), q(
    e,
    612
    /* BrtEndFonts */
  );
}
function Fx(e) {
  var t = 2;
  q(e, 603, rt(t)), q(e, 45, Z0({ patternType: "none" })), q(e, 45, Z0({ patternType: "gray125" })), q(
    e,
    604
    /* BrtEndFills */
  );
}
function Ax(e) {
  var t = 1;
  q(e, 613, rt(t)), q(e, 46, _x()), q(
    e,
    614
    /* BrtEndBorders */
  );
}
function Nx(e) {
  var t = 1;
  q(e, 626, rt(t)), q(e, 47, Zo({
    numFmtId: 0
  }, 65535)), q(
    e,
    627
    /* BrtEndCellStyleXFs */
  );
}
function Cx(e, t) {
  q(e, 617, rt(t.length)), t.forEach(function(r) {
    q(e, 47, Zo(r, 0));
  }), q(
    e,
    618
    /* BrtEndCellXFs */
  );
}
function Ox(e) {
  var t = 1;
  q(e, 619, rt(t)), q(e, 48, Tx({
    xfId: 0,
    name: "Normal"
  })), q(
    e,
    620
    /* BrtEndStyles */
  );
}
function Ix(e) {
  var t = 0;
  q(e, 505, rt(t)), q(
    e,
    506
    /* BrtEndDXFs */
  );
}
function Lx(e) {
  var t = 0;
  q(e, 508, wx(t, "TableStyleMedium9", "PivotStyleMedium4")), q(
    e,
    509
    /* BrtEndTableStyles */
  );
}
function Rx(e, t) {
  var r = Ir();
  return q(
    r,
    278
    /* BrtBeginStyleSheet */
  ), Sx(r, e.SSF), kx(r), Fx(r), Ax(r), Nx(r), Cx(r, t.cellXfs), Ox(r), Ix(r), Lx(r), q(
    r,
    279
    /* BrtEndStyleSheet */
  ), r.end();
}
var Dx = [
  "</a:lt1>",
  "</a:dk1>",
  "</a:lt2>",
  "</a:dk2>",
  "</a:accent1>",
  "</a:accent2>",
  "</a:accent3>",
  "</a:accent4>",
  "</a:accent5>",
  "</a:accent6>",
  "</a:hlink>",
  "</a:folHlink>"
];
function bx(e, t, r) {
  t.themeElements.clrScheme = [];
  var a = {};
  (e[0].match(Sr) || []).forEach(function(n) {
    var i = ge(n);
    switch (i[0]) {
      /* 20.1.6.2 clrScheme (Color Scheme) CT_ColorScheme */
      case "<a:clrScheme":
      case "</a:clrScheme>":
        break;
      /* 20.1.2.3.32 srgbClr CT_SRgbColor */
      case "<a:srgbClr":
        a.rgb = i.val;
        break;
      /* 20.1.2.3.33 sysClr CT_SystemColor */
      case "<a:sysClr":
        a.rgb = i.lastClr;
        break;
      /* 20.1.4.1.1 accent1 (Accent 1) */
      /* 20.1.4.1.2 accent2 (Accent 2) */
      /* 20.1.4.1.3 accent3 (Accent 3) */
      /* 20.1.4.1.4 accent4 (Accent 4) */
      /* 20.1.4.1.5 accent5 (Accent 5) */
      /* 20.1.4.1.6 accent6 (Accent 6) */
      /* 20.1.4.1.9 dk1 (Dark 1) */
      /* 20.1.4.1.10 dk2 (Dark 2) */
      /* 20.1.4.1.15 folHlink (Followed Hyperlink) */
      /* 20.1.4.1.19 hlink (Hyperlink) */
      /* 20.1.4.1.22 lt1 (Light 1) */
      /* 20.1.4.1.23 lt2 (Light 2) */
      case "<a:dk1>":
      case "</a:dk1>":
      case "<a:lt1>":
      case "</a:lt1>":
      case "<a:dk2>":
      case "</a:dk2>":
      case "<a:lt2>":
      case "</a:lt2>":
      case "<a:accent1>":
      case "</a:accent1>":
      case "<a:accent2>":
      case "</a:accent2>":
      case "<a:accent3>":
      case "</a:accent3>":
      case "<a:accent4>":
      case "</a:accent4>":
      case "<a:accent5>":
      case "</a:accent5>":
      case "<a:accent6>":
      case "</a:accent6>":
      case "<a:hlink>":
      case "</a:hlink>":
      case "<a:folHlink>":
      case "</a:folHlink>":
        i[0].charAt(1) === "/" ? (t.themeElements.clrScheme[Dx.indexOf(i[0])] = a, a = {}) : a.name = i[0].slice(3, i[0].length - 1);
        break;
      default:
        if (r && r.WTF) throw new Error("Unrecognized " + i[0] + " in clrScheme");
    }
  });
}
function Px() {
}
function Mx() {
}
var Bx = /<a:clrScheme([^>]*)>[\s\S]*<\/a:clrScheme>/, Ux = /<a:fontScheme([^>]*)>[\s\S]*<\/a:fontScheme>/, Xx = /<a:fmtScheme([^>]*)>[\s\S]*<\/a:fmtScheme>/;
function Wx(e, t, r) {
  t.themeElements = {};
  var a;
  [
    /* clrScheme CT_ColorScheme */
    ["clrScheme", Bx, bx],
    /* fontScheme CT_FontScheme */
    ["fontScheme", Ux, Px],
    /* fmtScheme CT_StyleMatrix */
    ["fmtScheme", Xx, Mx]
  ].forEach(function(n) {
    if (!(a = e.match(n[1]))) throw new Error(n[0] + " not found in themeElements");
    n[2](a, t, r);
  });
}
var Hx = /<a:themeElements([^>]*)>[\s\S]*<\/a:themeElements>/;
function Qo(e, t) {
  (!e || e.length === 0) && (e = _s());
  var r, a = {};
  if (!(r = e.match(Hx))) throw new Error("themeElements not found in theme");
  return Wx(r[0], a, t), a.raw = e, a;
}
function _s(e, t) {
  if (t && t.themeXLSX) return t.themeXLSX;
  if (e && typeof e.raw == "string") return e.raw;
  var r = [er];
  return r[r.length] = '<a:theme xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" name="Office Theme">', r[r.length] = "<a:themeElements>", r[r.length] = '<a:clrScheme name="Office">', r[r.length] = '<a:dk1><a:sysClr val="windowText" lastClr="000000"/></a:dk1>', r[r.length] = '<a:lt1><a:sysClr val="window" lastClr="FFFFFF"/></a:lt1>', r[r.length] = '<a:dk2><a:srgbClr val="1F497D"/></a:dk2>', r[r.length] = '<a:lt2><a:srgbClr val="EEECE1"/></a:lt2>', r[r.length] = '<a:accent1><a:srgbClr val="4F81BD"/></a:accent1>', r[r.length] = '<a:accent2><a:srgbClr val="C0504D"/></a:accent2>', r[r.length] = '<a:accent3><a:srgbClr val="9BBB59"/></a:accent3>', r[r.length] = '<a:accent4><a:srgbClr val="8064A2"/></a:accent4>', r[r.length] = '<a:accent5><a:srgbClr val="4BACC6"/></a:accent5>', r[r.length] = '<a:accent6><a:srgbClr val="F79646"/></a:accent6>', r[r.length] = '<a:hlink><a:srgbClr val="0000FF"/></a:hlink>', r[r.length] = '<a:folHlink><a:srgbClr val="800080"/></a:folHlink>', r[r.length] = "</a:clrScheme>", r[r.length] = '<a:fontScheme name="Office">', r[r.length] = "<a:majorFont>", r[r.length] = '<a:latin typeface="Cambria"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Hebr" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="MoolBoran"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Times New Roman"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:majorFont>", r[r.length] = "<a:minorFont>", r[r.length] = '<a:latin typeface="Calibri"/>', r[r.length] = '<a:ea typeface=""/>', r[r.length] = '<a:cs typeface=""/>', r[r.length] = '<a:font script="Jpan" typeface="ＭＳ Ｐゴシック"/>', r[r.length] = '<a:font script="Hang" typeface="맑은 고딕"/>', r[r.length] = '<a:font script="Hans" typeface="宋体"/>', r[r.length] = '<a:font script="Hant" typeface="新細明體"/>', r[r.length] = '<a:font script="Arab" typeface="Arial"/>', r[r.length] = '<a:font script="Hebr" typeface="Arial"/>', r[r.length] = '<a:font script="Thai" typeface="Tahoma"/>', r[r.length] = '<a:font script="Ethi" typeface="Nyala"/>', r[r.length] = '<a:font script="Beng" typeface="Vrinda"/>', r[r.length] = '<a:font script="Gujr" typeface="Shruti"/>', r[r.length] = '<a:font script="Khmr" typeface="DaunPenh"/>', r[r.length] = '<a:font script="Knda" typeface="Tunga"/>', r[r.length] = '<a:font script="Guru" typeface="Raavi"/>', r[r.length] = '<a:font script="Cans" typeface="Euphemia"/>', r[r.length] = '<a:font script="Cher" typeface="Plantagenet Cherokee"/>', r[r.length] = '<a:font script="Yiii" typeface="Microsoft Yi Baiti"/>', r[r.length] = '<a:font script="Tibt" typeface="Microsoft Himalaya"/>', r[r.length] = '<a:font script="Thaa" typeface="MV Boli"/>', r[r.length] = '<a:font script="Deva" typeface="Mangal"/>', r[r.length] = '<a:font script="Telu" typeface="Gautami"/>', r[r.length] = '<a:font script="Taml" typeface="Latha"/>', r[r.length] = '<a:font script="Syrc" typeface="Estrangelo Edessa"/>', r[r.length] = '<a:font script="Orya" typeface="Kalinga"/>', r[r.length] = '<a:font script="Mlym" typeface="Kartika"/>', r[r.length] = '<a:font script="Laoo" typeface="DokChampa"/>', r[r.length] = '<a:font script="Sinh" typeface="Iskoola Pota"/>', r[r.length] = '<a:font script="Mong" typeface="Mongolian Baiti"/>', r[r.length] = '<a:font script="Viet" typeface="Arial"/>', r[r.length] = '<a:font script="Uigh" typeface="Microsoft Uighur"/>', r[r.length] = '<a:font script="Geor" typeface="Sylfaen"/>', r[r.length] = "</a:minorFont>", r[r.length] = "</a:fontScheme>", r[r.length] = '<a:fmtScheme name="Office">', r[r.length] = "<a:fillStyleLst>", r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>', r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="50000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="35000"><a:schemeClr val="phClr"><a:tint val="37000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="15000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:lin ang="16200000" scaled="1"/>', r[r.length] = "</a:gradFill>", r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="100000"/><a:shade val="100000"/><a:satMod val="130000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:tint val="50000"/><a:shade val="100000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:lin ang="16200000" scaled="0"/>', r[r.length] = "</a:gradFill>", r[r.length] = "</a:fillStyleLst>", r[r.length] = "<a:lnStyleLst>", r[r.length] = '<a:ln w="9525" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"><a:shade val="95000"/><a:satMod val="105000"/></a:schemeClr></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = '<a:ln w="25400" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = '<a:ln w="38100" cap="flat" cmpd="sng" algn="ctr"><a:solidFill><a:schemeClr val="phClr"/></a:solidFill><a:prstDash val="solid"/></a:ln>', r[r.length] = "</a:lnStyleLst>", r[r.length] = "<a:effectStyleLst>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="20000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="38000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = "</a:effectStyle>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = "</a:effectStyle>", r[r.length] = "<a:effectStyle>", r[r.length] = "<a:effectLst>", r[r.length] = '<a:outerShdw blurRad="40000" dist="23000" dir="5400000" rotWithShape="0"><a:srgbClr val="000000"><a:alpha val="35000"/></a:srgbClr></a:outerShdw>', r[r.length] = "</a:effectLst>", r[r.length] = '<a:scene3d><a:camera prst="orthographicFront"><a:rot lat="0" lon="0" rev="0"/></a:camera><a:lightRig rig="threePt" dir="t"><a:rot lat="0" lon="0" rev="1200000"/></a:lightRig></a:scene3d>', r[r.length] = '<a:sp3d><a:bevelT w="63500" h="25400"/></a:sp3d>', r[r.length] = "</a:effectStyle>", r[r.length] = "</a:effectStyleLst>", r[r.length] = "<a:bgFillStyleLst>", r[r.length] = '<a:solidFill><a:schemeClr val="phClr"/></a:solidFill>', r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="40000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="40000"><a:schemeClr val="phClr"><a:tint val="45000"/><a:shade val="99000"/><a:satMod val="350000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="20000"/><a:satMod val="255000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="-80000" r="50000" b="180000"/></a:path>', r[r.length] = "</a:gradFill>", r[r.length] = '<a:gradFill rotWithShape="1">', r[r.length] = "<a:gsLst>", r[r.length] = '<a:gs pos="0"><a:schemeClr val="phClr"><a:tint val="80000"/><a:satMod val="300000"/></a:schemeClr></a:gs>', r[r.length] = '<a:gs pos="100000"><a:schemeClr val="phClr"><a:shade val="30000"/><a:satMod val="200000"/></a:schemeClr></a:gs>', r[r.length] = "</a:gsLst>", r[r.length] = '<a:path path="circle"><a:fillToRect l="50000" t="50000" r="50000" b="50000"/></a:path>', r[r.length] = "</a:gradFill>", r[r.length] = "</a:bgFillStyleLst>", r[r.length] = "</a:fmtScheme>", r[r.length] = "</a:themeElements>", r[r.length] = "<a:objectDefaults>", r[r.length] = "<a:spDef>", r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="1"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="3"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="2"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="lt1"/></a:fontRef></a:style>', r[r.length] = "</a:spDef>", r[r.length] = "<a:lnDef>", r[r.length] = '<a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx="2"><a:schemeClr val="accent1"/></a:lnRef><a:fillRef idx="0"><a:schemeClr val="accent1"/></a:fillRef><a:effectRef idx="1"><a:schemeClr val="accent1"/></a:effectRef><a:fontRef idx="minor"><a:schemeClr val="tx1"/></a:fontRef></a:style>', r[r.length] = "</a:lnDef>", r[r.length] = "</a:objectDefaults>", r[r.length] = "<a:extraClrSchemeLst/>", r[r.length] = "</a:theme>", r.join("");
}
function Gx(e, t, r) {
  var a = e.l + t, n = e.read_shift(4);
  if (n !== 124226) {
    if (!r.cellStyles) {
      e.l = a;
      return;
    }
    var i = e.slice(e.l);
    e.l = a;
    var s;
    try {
      s = Kc(i, { type: "array" });
    } catch {
      return;
    }
    var c = br(s, "theme/theme/theme1.xml", !0);
    if (c)
      return Qo(c, r);
  }
}
function Vx(e) {
  return e.read_shift(4);
}
function zx(e) {
  var t = {};
  switch (t.xclrType = e.read_shift(2), t.nTintShade = e.read_shift(2), t.xclrType) {
    case 0:
      e.l += 4;
      break;
    case 1:
      t.xclrValue = Yx(e, 4);
      break;
    case 2:
      t.xclrValue = Lo(e);
      break;
    case 3:
      t.xclrValue = Vx(e);
      break;
    case 4:
      e.l += 4;
      break;
  }
  return e.l += 8, t;
}
function Yx(e, t) {
  return yr(e, t);
}
function jx(e, t) {
  return yr(e, t);
}
function Kx(e) {
  var t = e.read_shift(2), r = e.read_shift(2) - 4, a = [t];
  switch (t) {
    case 4:
    case 5:
    case 7:
    case 8:
    case 9:
    case 10:
    case 11:
    case 13:
      a[1] = zx(e);
      break;
    case 6:
      a[1] = jx(e, r);
      break;
    case 14:
    case 15:
      a[1] = e.read_shift(r === 1 ? 1 : 2);
      break;
    default:
      throw new Error("Unrecognized ExtProp type: " + t + " " + r);
  }
  return a;
}
function qx(e, t) {
  var r = e.l + t;
  e.l += 2;
  var a = e.read_shift(2);
  e.l += 2;
  for (var n = e.read_shift(2), i = []; n-- > 0; ) i.push(Kx(e, r - e.l));
  return { ixfe: a, ext: i };
}
function $x(e, t) {
  t.forEach(function(r) {
    r[0];
  });
}
function Jx(e, t) {
  return {
    flags: e.read_shift(4),
    version: e.read_shift(4),
    name: wr(e)
  };
}
function Zx(e) {
  var t = z(12 + 2 * e.name.length);
  return t.write_shift(4, e.flags), t.write_shift(4, e.version), lr(e.name, t), t.slice(0, t.l);
}
function Qx(e) {
  for (var t = [], r = e.read_shift(4); r-- > 0; )
    t.push([e.read_shift(4), e.read_shift(4)]);
  return t;
}
function ep(e) {
  var t = z(4 + 8 * e.length);
  t.write_shift(4, e.length);
  for (var r = 0; r < e.length; ++r)
    t.write_shift(4, e[r][0]), t.write_shift(4, e[r][1]);
  return t;
}
function rp(e, t) {
  var r = z(8 + 2 * t.length);
  return r.write_shift(4, e), lr(t, r), r.slice(0, r.l);
}
function tp(e) {
  return e.l += 4, e.read_shift(4) != 0;
}
function ap(e, t) {
  var r = z(8);
  return r.write_shift(4, e), r.write_shift(4, 1), r;
}
function np(e, t, r) {
  var a = { Types: [], Cell: [], Value: [] }, n = r || {}, i = [], s = !1, c = 2;
  return Tt(e, function(o, l, f) {
    switch (f) {
      case 335:
        a.Types.push({ name: o.name });
        break;
      case 51:
        o.forEach(function(d) {
          c == 1 ? a.Cell.push({ type: a.Types[d[0] - 1].name, index: d[1] }) : c == 0 && a.Value.push({ type: a.Types[d[0] - 1].name, index: d[1] });
        });
        break;
      case 337:
        c = o ? 1 : 0;
        break;
      case 338:
        c = 2;
        break;
      case 35:
        i.push(f), s = !0;
        break;
      case 36:
        i.pop(), s = !1;
        break;
      default:
        if (!l.T) {
          if (!s || n.WTF && i[i.length - 1] != 35)
            throw new Error("Unexpected record 0x" + f.toString(16));
        }
    }
  }), a;
}
function ip() {
  var e = Ir();
  return q(e, 332), q(e, 334, rt(1)), q(e, 335, Zx({
    name: "XLDAPR",
    version: 12e4,
    flags: 3496657072
  })), q(e, 336), q(e, 339, rp(1, "XLDAPR")), q(e, 52), q(e, 35, rt(514)), q(e, 4096, rt(0)), q(e, 4097, Yr(1)), q(e, 36), q(e, 53), q(e, 340), q(e, 337, ap(1)), q(e, 51, ep([[1, 0]])), q(e, 338), q(e, 333), e.end();
}
function sp(e, t, r) {
  var a = { Types: [], Cell: [], Value: [] };
  if (!e)
    return a;
  var n = !1, i = 2, s;
  return e.replace(Sr, function(c) {
    var o = ge(c);
    switch (lt(o[0])) {
      case "<?xml":
        break;
      case "<metadata":
      case "</metadata>":
        break;
      case "<metadataTypes":
      case "</metadataTypes>":
        break;
      case "<metadataType":
        a.Types.push({ name: o.name });
        break;
      case "</metadataType>":
        break;
      case "<futureMetadata":
        for (var l = 0; l < a.Types.length; ++l)
          a.Types[l].name == o.name && (s = a.Types[l]);
        break;
      case "</futureMetadata>":
        break;
      case "<bk>":
        break;
      case "</bk>":
        break;
      case "<rc":
        i == 1 ? a.Cell.push({ type: a.Types[o.t - 1].name, index: +o.v }) : i == 0 && a.Value.push({ type: a.Types[o.t - 1].name, index: +o.v });
        break;
      case "</rc>":
        break;
      case "<cellMetadata":
        i = 1;
        break;
      case "</cellMetadata>":
        i = 2;
        break;
      case "<valueMetadata":
        i = 0;
        break;
      case "</valueMetadata>":
        i = 2;
        break;
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      case "<ext":
        n = !0;
        break;
      case "</ext>":
        n = !1;
        break;
      case "<rvb":
        if (!s)
          break;
        s.offsets || (s.offsets = []), s.offsets.push(+o.i);
        break;
      default:
        if (!n && r.WTF)
          throw new Error("unrecognized " + o[0] + " in metadata");
    }
    return c;
  }), a;
}
function ef() {
  var e = [er];
  return e.push(`<metadata xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:xlrd="http://schemas.microsoft.com/office/spreadsheetml/2017/richdata" xmlns:xda="http://schemas.microsoft.com/office/spreadsheetml/2017/dynamicarray">
  <metadataTypes count="1">
    <metadataType name="XLDAPR" minSupportedVersion="120000" copy="1" pasteAll="1" pasteValues="1" merge="1" splitFirst="1" rowColShift="1" clearFormats="1" clearComments="1" assign="1" coerce="1" cellMeta="1"/>
  </metadataTypes>
  <futureMetadata name="XLDAPR" count="1">
    <bk>
      <extLst>
        <ext uri="{bdbb8cdc-fa1e-496e-a857-3c3f30c029c3}">
          <xda:dynamicArrayProperties fDynamic="1" fCollapsed="0"/>
        </ext>
      </extLst>
    </bk>
  </futureMetadata>
  <cellMetadata count="1">
    <bk>
      <rc t="1" v="0"/>
    </bk>
  </cellMetadata>
</metadata>`), e.join("");
}
function cp(e) {
  var t = [];
  if (!e) return t;
  var r = 1;
  return (e.match(Sr) || []).forEach(function(a) {
    var n = ge(a);
    switch (n[0]) {
      case "<?xml":
        break;
      /* 18.6.2  calcChain CT_CalcChain 1 */
      case "<calcChain":
      case "<calcChain>":
      case "</calcChain>":
        break;
      /* 18.6.1  c CT_CalcCell 1 */
      case "<c":
        delete n[0], n.i ? r = n.i : n.i = r, t.push(n);
        break;
    }
  }), t;
}
function op(e) {
  var t = {};
  t.i = e.read_shift(4);
  var r = {};
  r.r = e.read_shift(4), r.c = e.read_shift(4), t.r = me(r);
  var a = e.read_shift(1);
  return a & 2 && (t.l = "1"), a & 8 && (t.a = "1"), t;
}
function fp(e, t, r) {
  var a = [];
  return Tt(e, function(i, s, c) {
    switch (c) {
      case 63:
        a.push(i);
        break;
      default:
        if (!s.T) throw new Error("Unexpected record 0x" + c.toString(16));
    }
  }), a;
}
function lp(e, t, r, a) {
  if (!e) return e;
  var n = a || {}, i = !1;
  Tt(e, function(c, o, l) {
    switch (l) {
      case 359:
      /* 'BrtSupTabs' */
      case 363:
      /* 'BrtExternTableStart' */
      case 364:
      /* 'BrtExternTableEnd' */
      case 366:
      /* 'BrtExternRowHdr' */
      case 367:
      /* 'BrtExternCellBlank' */
      case 368:
      /* 'BrtExternCellReal' */
      case 369:
      /* 'BrtExternCellBool' */
      case 370:
      /* 'BrtExternCellError' */
      case 371:
      /* 'BrtExternCellString' */
      case 472:
      /* 'BrtExternValueMeta' */
      case 577:
      /* 'BrtSupNameStart' */
      case 578:
      /* 'BrtSupNameValueStart' */
      case 579:
      /* 'BrtSupNameValueEnd' */
      case 580:
      /* 'BrtSupNameNum' */
      case 581:
      /* 'BrtSupNameErr' */
      case 582:
      /* 'BrtSupNameSt' */
      case 583:
      /* 'BrtSupNameNil' */
      case 584:
      /* 'BrtSupNameBool' */
      case 585:
      /* 'BrtSupNameFmla' */
      case 586:
      /* 'BrtSupNameBits' */
      case 587:
        break;
      case 35:
        i = !0;
        break;
      case 36:
        i = !1;
        break;
      default:
        if (!o.T) {
          if (!i || n.WTF) throw new Error("Unexpected record 0x" + l.toString(16));
        }
    }
  }, n);
}
function up(e, t) {
  if (!e) return "??";
  var r = (e.match(/<c:chart [^>]*r:id="([^"]*)"/) || ["", ""])[1];
  return t["!id"][r].Target;
}
var ua = 1024;
function rf(e, t) {
  for (var r = [21600, 21600], a = ["m0,0l0", r[1], r[0], r[1], r[0], "0xe"].join(","), n = [
    ne("xml", null, { "xmlns:v": Rr.v, "xmlns:o": Rr.o, "xmlns:x": Rr.x, "xmlns:mv": Rr.mv }).replace(/\/>/, ">"),
    ne("o:shapelayout", ne("o:idmap", null, { "v:ext": "edit", data: e }), { "v:ext": "edit" }),
    ne("v:shapetype", [
      ne("v:stroke", null, { joinstyle: "miter" }),
      ne("v:path", null, { gradientshapeok: "t", "o:connecttype": "rect" })
    ].join(""), { id: "_x0000_t202", "o:spt": 202, coordsize: r.join(","), path: a })
  ]; ua < e * 1e3; ) ua += 1e3;
  return t.forEach(function(i) {
    var s = Ye(i[0]), c = (
      /*::(*/
      { color2: "#BEFF82", type: "gradient" }
    );
    c.type == "gradient" && (c.angle = "-180");
    var o = c.type == "gradient" ? ne("o:fill", null, { type: "gradientUnscaled", "v:ext": "view" }) : null, l = ne("v:fill", o, c), f = { on: "t", obscured: "t" };
    ++ua, n = n.concat([
      "<v:shape" + $a({
        id: "_x0000_s" + ua,
        type: "#_x0000_t202",
        style: "position:absolute; margin-left:80pt;margin-top:5pt;width:104pt;height:64pt;z-index:10" + (i[1].hidden ? ";visibility:hidden" : ""),
        fillcolor: "#ECFAD4",
        strokecolor: "#edeaa1"
      }) + ">",
      l,
      ne("v:shadow", null, f),
      ne("v:path", null, { "o:connecttype": "none" }),
      '<v:textbox><div style="text-align:left"></div></v:textbox>',
      '<x:ClientData ObjectType="Note">',
      "<x:MoveWithCells/>",
      "<x:SizeWithCells/>",
      /* Part 4 19.4.2.3 Anchor (Anchor) */
      xr("x:Anchor", [s.c + 1, 0, s.r + 1, 0, s.c + 3, 20, s.r + 5, 20].join(",")),
      xr("x:AutoFill", "False"),
      xr("x:Row", String(s.r)),
      xr("x:Column", String(s.c)),
      i[1].hidden ? "" : "<x:Visible/>",
      "</x:ClientData>",
      "</v:shape>"
    ]);
  }), n.push("</xml>"), n.join("");
}
function Q0(e, t, r, a) {
  var n = Array.isArray(e), i;
  t.forEach(function(s) {
    var c = Ye(s.ref);
    if (n ? (e[c.r] || (e[c.r] = []), i = e[c.r][c.c]) : i = e[s.ref], !i) {
      i = { t: "z" }, n ? e[c.r][c.c] = i : e[s.ref] = i;
      var o = Ae(e["!ref"] || "BDWGO1000001:A1");
      o.s.r > c.r && (o.s.r = c.r), o.e.r < c.r && (o.e.r = c.r), o.s.c > c.c && (o.s.c = c.c), o.e.c < c.c && (o.e.c = c.c);
      var l = _e(o);
      l !== e["!ref"] && (e["!ref"] = l);
    }
    i.c || (i.c = []);
    var f = { a: s.author, t: s.t, r: s.r, T: r };
    s.h && (f.h = s.h);
    for (var d = i.c.length - 1; d >= 0; --d) {
      if (!r && i.c[d].T) return;
      r && !i.c[d].T && i.c.splice(d, 1);
    }
    if (r && a) {
      for (d = 0; d < a.length; ++d)
        if (f.a == a[d].id) {
          f.a = a[d].name || f.a;
          break;
        }
    }
    i.c.push(f);
  });
}
function hp(e, t) {
  if (e.match(/<(?:\w+:)?comments *\/>/)) return [];
  var r = [], a = [], n = e.match(/<(?:\w+:)?authors>([\s\S]*)<\/(?:\w+:)?authors>/);
  n && n[1] && n[1].split(/<\/\w*:?author>/).forEach(function(s) {
    if (!(s === "" || s.trim() === "")) {
      var c = s.match(/<(?:\w+:)?author[^>]*>(.*)/);
      c && r.push(c[1]);
    }
  });
  var i = e.match(/<(?:\w+:)?commentList>([\s\S]*)<\/(?:\w+:)?commentList>/);
  return i && i[1] && i[1].split(/<\/\w*:?comment>/).forEach(function(s) {
    if (!(s === "" || s.trim() === "")) {
      var c = s.match(/<(?:\w+:)?comment[^>]*>/);
      if (c) {
        var o = ge(c[0]), l = { author: o.authorId && r[o.authorId] || "sheetjsghost", ref: o.ref, guid: o.guid }, f = Ye(o.ref);
        if (!(t.sheetRows && t.sheetRows <= f.r)) {
          var d = s.match(/<(?:\w+:)?text>([\s\S]*)<\/(?:\w+:)?text>/), h = !!d && !!d[1] && vs(d[1]) || { r: "", t: "", h: "" };
          l.r = h.r, h.r == "<t></t>" && (h.t = h.h = ""), l.t = (h.t || "").replace(/\r\n/g, `
`).replace(/\r/g, `
`), t.cellHTML && (l.h = h.h), a.push(l);
        }
      }
    }
  }), a;
}
function tf(e) {
  var t = [er, ne("comments", null, { xmlns: ea[0] })], r = [];
  return t.push("<authors>"), e.forEach(function(a) {
    a[1].forEach(function(n) {
      var i = Pe(n.a);
      r.indexOf(i) == -1 && (r.push(i), t.push("<author>" + i + "</author>")), n.T && n.ID && r.indexOf("tc=" + n.ID) == -1 && (r.push("tc=" + n.ID), t.push("<author>tc=" + n.ID + "</author>"));
    });
  }), r.length == 0 && (r.push("SheetJ5"), t.push("<author>SheetJ5</author>")), t.push("</authors>"), t.push("<commentList>"), e.forEach(function(a) {
    var n = 0, i = [];
    if (a[1][0] && a[1][0].T && a[1][0].ID ? n = r.indexOf("tc=" + a[1][0].ID) : a[1].forEach(function(o) {
      o.a && (n = r.indexOf(Pe(o.a))), i.push(o.t || "");
    }), t.push('<comment ref="' + a[0] + '" authorId="' + n + '"><text>'), i.length <= 1) t.push(xr("t", Pe(i[0] || "")));
    else {
      for (var s = `Comment:
    ` + i[0] + `
`, c = 1; c < i.length; ++c) s += `Reply:
    ` + i[c] + `
`;
      t.push(xr("t", Pe(s)));
    }
    t.push("</text></comment>");
  }), t.push("</commentList>"), t.length > 2 && (t[t.length] = "</comments>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function dp(e, t) {
  var r = [], a = !1, n = {}, i = 0;
  return e.replace(Sr, function(c, o) {
    var l = ge(c);
    switch (lt(l[0])) {
      case "<?xml":
        break;
      /* 2.6.207 ThreadedComments CT_ThreadedComments */
      case "<ThreadedComments":
        break;
      case "</ThreadedComments>":
        break;
      /* 2.6.205 threadedComment CT_ThreadedComment */
      case "<threadedComment":
        n = { author: l.personId, guid: l.id, ref: l.ref, T: 1 };
        break;
      case "</threadedComment>":
        n.t != null && r.push(n);
        break;
      case "<text>":
      case "<text":
        i = o + c.length;
        break;
      case "</text>":
        n.t = e.slice(i, o).replace(/\r\n/g, `
`).replace(/\r/g, `
`);
        break;
      /* 2.6.206 mentions CT_ThreadedCommentMentions TODO */
      case "<mentions":
      case "<mentions>":
        a = !0;
        break;
      case "</mentions>":
        a = !1;
        break;
      /* 2.6.202 mention CT_Mention TODO */
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        a = !0;
        break;
      case "</ext>":
        a = !1;
        break;
      default:
        if (!a && t.WTF) throw new Error("unrecognized " + l[0] + " in threaded comments");
    }
    return c;
  }), r;
}
function xp(e, t, r) {
  var a = [er, ne("ThreadedComments", null, { xmlns: ir.TCMNT }).replace(/[\/]>/, ">")];
  return e.forEach(function(n) {
    var i = "";
    (n[1] || []).forEach(function(s, c) {
      if (!s.T) {
        delete s.ID;
        return;
      }
      s.a && t.indexOf(s.a) == -1 && t.push(s.a);
      var o = {
        ref: n[0],
        id: "{54EE7951-7262-4200-6969-" + ("000000000000" + r.tcid++).slice(-12) + "}"
      };
      c == 0 ? i = o.id : o.parentId = i, s.ID = o.id, s.a && (o.personId = "{54EE7950-7262-4200-6969-" + ("000000000000" + t.indexOf(s.a)).slice(-12) + "}"), a.push(ne("threadedComment", xr("text", s.t || ""), o));
    });
  }), a.push("</ThreadedComments>"), a.join("");
}
function pp(e, t) {
  var r = [], a = !1;
  return e.replace(Sr, function(i) {
    var s = ge(i);
    switch (lt(s[0])) {
      case "<?xml":
        break;
      /* 2.4.85 personList CT_PersonList */
      case "<personList":
        break;
      case "</personList>":
        break;
      /* 2.6.203 person CT_Person TODO: providers */
      case "<person":
        r.push({ name: s.displayname, id: s.id });
        break;
      case "</person>":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        a = !0;
        break;
      case "</ext>":
        a = !1;
        break;
      default:
        if (!a && t.WTF) throw new Error("unrecognized " + s[0] + " in threaded comments");
    }
    return i;
  }), r;
}
function mp(e) {
  var t = [er, ne("personList", null, {
    xmlns: ir.TCMNT,
    "xmlns:x": ea[0]
  }).replace(/[\/]>/, ">")];
  return e.forEach(function(r, a) {
    t.push(ne("person", null, {
      displayName: r,
      id: "{54EE7950-7262-4200-6969-" + ("000000000000" + a).slice(-12) + "}",
      userId: r,
      providerId: "None"
    }));
  }), t.push("</personList>"), t.join("");
}
function vp(e) {
  var t = {};
  t.iauthor = e.read_shift(4);
  var r = na(e);
  return t.rfx = r.s, t.ref = me(r.s), e.l += 16, t;
}
function gp(e, t) {
  return t == null && (t = z(36)), t.write_shift(4, e[1].iauthor), wa(e[0], t), t.write_shift(4, 0), t.write_shift(4, 0), t.write_shift(4, 0), t.write_shift(4, 0), t;
}
var Ep = wr;
function _p(e) {
  return lr(e.slice(0, 54));
}
function Tp(e, t) {
  var r = [], a = [], n = {}, i = !1;
  return Tt(e, function(c, o, l) {
    switch (l) {
      case 632:
        a.push(c);
        break;
      case 635:
        n = c;
        break;
      case 637:
        n.t = c.t, n.h = c.h, n.r = c.r;
        break;
      case 636:
        if (n.author = a[n.iauthor], delete n.iauthor, t.sheetRows && n.rfx && t.sheetRows <= n.rfx.r) break;
        n.t || (n.t = ""), delete n.rfx, r.push(n);
        break;
      case 3072:
        break;
      case 35:
        i = !0;
        break;
      case 36:
        i = !1;
        break;
      case 37:
        break;
      case 38:
        break;
      default:
        if (!o.T) {
          if (!i || t.WTF) throw new Error("Unexpected record 0x" + l.toString(16));
        }
    }
  }), r;
}
function wp(e) {
  var t = Ir(), r = [];
  return q(
    t,
    628
    /* BrtBeginComments */
  ), q(
    t,
    630
    /* BrtBeginCommentAuthors */
  ), e.forEach(function(a) {
    a[1].forEach(function(n) {
      r.indexOf(n.a) > -1 || (r.push(n.a.slice(0, 54)), q(t, 632, _p(n.a)));
    });
  }), q(
    t,
    631
    /* BrtEndCommentAuthors */
  ), q(
    t,
    633
    /* BrtBeginCommentList */
  ), e.forEach(function(a) {
    a[1].forEach(function(n) {
      n.iauthor = r.indexOf(n.a);
      var i = { s: Ye(a[0]), e: Ye(a[0]) };
      q(t, 635, gp([i, n])), n.t && n.t.length > 0 && q(t, 637, Vu(n)), q(
        t,
        636
        /* BrtEndComment */
      ), delete n.iauthor;
    });
  }), q(
    t,
    634
    /* BrtEndCommentList */
  ), q(
    t,
    629
    /* BrtEndComments */
  ), t.end();
}
var yp = "application/vnd.ms-office.vbaProject";
function Sp(e) {
  var t = de.utils.cfb_new({ root: "R" });
  return e.FullPaths.forEach(function(r, a) {
    if (!(r.slice(-1) === "/" || !r.match(/_VBA_PROJECT_CUR/))) {
      var n = r.replace(/^[^\/]*/, "R").replace(/\/_VBA_PROJECT_CUR\u0000*/, "");
      de.utils.cfb_add(t, n, e.FileIndex[a].content);
    }
  }), de.write(t);
}
function kp(e, t) {
  t.FullPaths.forEach(function(r, a) {
    if (a != 0) {
      var n = r.replace(/[^\/]*[\/]/, "/_VBA_PROJECT_CUR/");
      n.slice(-1) !== "/" && de.utils.cfb_add(e, n, t.FileIndex[a].content);
    }
  });
}
var af = ["xlsb", "xlsm", "xlam", "biff8", "xla"];
function Fp() {
  return { "!type": "dialog" };
}
function Ap() {
  return { "!type": "dialog" };
}
function Np() {
  return { "!type": "macro" };
}
function Cp() {
  return { "!type": "macro" };
}
var xa = /* @__PURE__ */ (function() {
  var e = /(^|[^A-Za-z_])R(\[?-?\d+\]|[1-9]\d*|)C(\[?-?\d+\]|[1-9]\d*|)(?![A-Za-z0-9_])/g, t = { r: 0, c: 0 };
  function r(a, n, i, s) {
    var c = !1, o = !1;
    i.length == 0 ? o = !0 : i.charAt(0) == "[" && (o = !0, i = i.slice(1, -1)), s.length == 0 ? c = !0 : s.charAt(0) == "[" && (c = !0, s = s.slice(1, -1));
    var l = i.length > 0 ? parseInt(i, 10) | 0 : 0, f = s.length > 0 ? parseInt(s, 10) | 0 : 0;
    return c ? f += t.c : --f, o ? l += t.r : --l, n + (c ? "" : "$") + He(f) + (o ? "" : "$") + Ke(l);
  }
  return function(n, i) {
    return t = i, n.replace(e, r);
  };
})(), Ts = /(^|[^._A-Z0-9])([$]?)([A-Z]{1,2}|[A-W][A-Z]{2}|X[A-E][A-Z]|XF[A-D])([$]?)(10[0-3]\d{4}|104[0-7]\d{3}|1048[0-4]\d{2}|10485[0-6]\d|104857[0-6]|[1-9]\d{0,5})(?![_.\(A-Za-z0-9])/g, ws = /* @__PURE__ */ (function() {
  return function(t, r) {
    return t.replace(Ts, function(a, n, i, s, c, o) {
      var l = os(s) - (i ? 0 : r.c), f = cs(o) - (c ? 0 : r.r), d = f == 0 ? "" : c ? f + 1 : "[" + f + "]", h = l == 0 ? "" : i ? l + 1 : "[" + l + "]";
      return n + "R" + d + "C" + h;
    });
  };
})();
function nf(e, t) {
  return e.replace(Ts, function(r, a, n, i, s, c) {
    return a + (n == "$" ? n + i : He(os(i) + t.c)) + (s == "$" ? s + c : Ke(cs(c) + t.r));
  });
}
function Op(e, t, r) {
  var a = Cr(t), n = a.s, i = Ye(r), s = { r: i.r - n.r, c: i.c - n.c };
  return nf(e, s);
}
function Ip(e) {
  return e.length != 1;
}
function ec(e) {
  return e.replace(/_xlfn\./g, "");
}
function rr(e) {
  e.l += 1;
}
function Lt(e, t) {
  var r = e.read_shift(2);
  return [r & 16383, r >> 14 & 1, r >> 15 & 1];
}
function sf(e, t, r) {
  var a = 2;
  if (r) {
    if (r.biff >= 2 && r.biff <= 5) return cf(e);
    r.biff == 12 && (a = 4);
  }
  var n = e.read_shift(a), i = e.read_shift(a), s = Lt(e), c = Lt(e);
  return { s: { r: n, c: s[0], cRel: s[1], rRel: s[2] }, e: { r: i, c: c[0], cRel: c[1], rRel: c[2] } };
}
function cf(e) {
  var t = Lt(e), r = Lt(e), a = e.read_shift(1), n = e.read_shift(1);
  return { s: { r: t[0], c: a, cRel: t[1], rRel: t[2] }, e: { r: r[0], c: n, cRel: r[1], rRel: r[2] } };
}
function Lp(e, t, r) {
  if (r.biff < 8) return cf(e);
  var a = e.read_shift(r.biff == 12 ? 4 : 2), n = e.read_shift(r.biff == 12 ? 4 : 2), i = Lt(e), s = Lt(e);
  return { s: { r: a, c: i[0], cRel: i[1], rRel: i[2] }, e: { r: n, c: s[0], cRel: s[1], rRel: s[2] } };
}
function of(e, t, r) {
  if (r && r.biff >= 2 && r.biff <= 5) return Rp(e);
  var a = e.read_shift(r && r.biff == 12 ? 4 : 2), n = Lt(e);
  return { r: a, c: n[0], cRel: n[1], rRel: n[2] };
}
function Rp(e) {
  var t = Lt(e), r = e.read_shift(1);
  return { r: t[0], c: r, cRel: t[1], rRel: t[2] };
}
function Dp(e) {
  var t = e.read_shift(2), r = e.read_shift(2);
  return { r: t, c: r & 255, fQuoted: !!(r & 16384), cRel: r >> 15, rRel: r >> 15 };
}
function bp(e, t, r) {
  var a = r && r.biff ? r.biff : 8;
  if (a >= 2 && a <= 5) return Pp(e);
  var n = e.read_shift(a >= 12 ? 4 : 2), i = e.read_shift(2), s = (i & 16384) >> 14, c = (i & 32768) >> 15;
  if (i &= 16383, c == 1) for (; n > 524287; ) n -= 1048576;
  if (s == 1) for (; i > 8191; ) i = i - 16384;
  return { r: n, c: i, cRel: s, rRel: c };
}
function Pp(e) {
  var t = e.read_shift(2), r = e.read_shift(1), a = (t & 32768) >> 15, n = (t & 16384) >> 14;
  return t &= 16383, a == 1 && t >= 8192 && (t = t - 16384), n == 1 && r >= 128 && (r = r - 256), { r: t, c: r, cRel: n, rRel: a };
}
function Mp(e, t, r) {
  var a = (e[e.l++] & 96) >> 5, n = sf(e, r.biff >= 2 && r.biff <= 5 ? 6 : 8, r);
  return [a, n];
}
function Bp(e, t, r) {
  var a = (e[e.l++] & 96) >> 5, n = e.read_shift(2, "i"), i = 8;
  if (r) switch (r.biff) {
    case 5:
      e.l += 12, i = 6;
      break;
    case 12:
      i = 12;
      break;
  }
  var s = sf(e, i, r);
  return [a, n, s];
}
function Up(e, t, r) {
  var a = (e[e.l++] & 96) >> 5;
  return e.l += r && r.biff > 8 ? 12 : r.biff < 8 ? 6 : 8, [a];
}
function Xp(e, t, r) {
  var a = (e[e.l++] & 96) >> 5, n = e.read_shift(2), i = 8;
  if (r) switch (r.biff) {
    case 5:
      e.l += 12, i = 6;
      break;
    case 12:
      i = 12;
      break;
  }
  return e.l += i, [a, n];
}
function Wp(e, t, r) {
  var a = (e[e.l++] & 96) >> 5, n = Lp(e, t - 1, r);
  return [a, n];
}
function Hp(e, t, r) {
  var a = (e[e.l++] & 96) >> 5;
  return e.l += r.biff == 2 ? 6 : r.biff == 12 ? 14 : 7, [a];
}
function rc(e) {
  var t = e[e.l + 1] & 1, r = 1;
  return e.l += 4, [t, r];
}
function Gp(e, t, r) {
  e.l += 2;
  for (var a = e.read_shift(r && r.biff == 2 ? 1 : 2), n = [], i = 0; i <= a; ++i) n.push(e.read_shift(r && r.biff == 2 ? 1 : 2));
  return n;
}
function Vp(e, t, r) {
  var a = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [a, e.read_shift(r && r.biff == 2 ? 1 : 2)];
}
function zp(e, t, r) {
  var a = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [a, e.read_shift(r && r.biff == 2 ? 1 : 2)];
}
function Yp(e) {
  var t = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += 2, [t, e.read_shift(2)];
}
function jp(e, t, r) {
  var a = e[e.l + 1] & 255 ? 1 : 0;
  return e.l += r && r.biff == 2 ? 3 : 4, [a];
}
function ff(e) {
  var t = e.read_shift(1), r = e.read_shift(1);
  return [t, r];
}
function Kp(e) {
  return e.read_shift(2), ff(e);
}
function qp(e) {
  return e.read_shift(2), ff(e);
}
function $p(e, t, r) {
  var a = (e[e.l] & 96) >> 5;
  e.l += 1;
  var n = of(e, 0, r);
  return [a, n];
}
function Jp(e, t, r) {
  var a = (e[e.l] & 96) >> 5;
  e.l += 1;
  var n = bp(e, 0, r);
  return [a, n];
}
function Zp(e, t, r) {
  var a = (e[e.l] & 96) >> 5;
  e.l += 1;
  var n = e.read_shift(2);
  r && r.biff == 5 && (e.l += 12);
  var i = of(e, 0, r);
  return [a, n, i];
}
function Qp(e, t, r) {
  var a = (e[e.l] & 96) >> 5;
  e.l += 1;
  var n = e.read_shift(r && r.biff <= 3 ? 1 : 2);
  return [tv[n], hf[n], a];
}
function em(e, t, r) {
  var a = e[e.l++], n = e.read_shift(1), i = r && r.biff <= 3 ? [a == 88 ? -1 : 0, e.read_shift(1)] : rm(e);
  return [n, (i[0] === 0 ? hf : rv)[i[1]]];
}
function rm(e) {
  return [e[e.l + 1] >> 7, e.read_shift(2) & 32767];
}
function tm(e, t, r) {
  e.l += r && r.biff == 2 ? 3 : 4;
}
function am(e, t, r) {
  if (e.l++, r && r.biff == 12) return [e.read_shift(4, "i"), 0];
  var a = e.read_shift(2), n = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [a, n];
}
function nm(e) {
  return e.l++, wt[e.read_shift(1)];
}
function im(e) {
  return e.l++, e.read_shift(2);
}
function sm(e) {
  return e.l++, e.read_shift(1) !== 0;
}
function cm(e) {
  return e.l++, _r(e);
}
function om(e, t, r) {
  return e.l++, ln(e, t - 1, r);
}
function fm(e, t) {
  var r = [e.read_shift(1)];
  if (t == 12) switch (r[0]) {
    case 2:
      r[0] = 4;
      break;
    /* SerBool */
    case 4:
      r[0] = 16;
      break;
    /* SerErr */
    case 0:
      r[0] = 1;
      break;
    /* SerNum */
    case 1:
      r[0] = 2;
      break;
  }
  switch (r[0]) {
    case 4:
      r[1] = Qe(e, 1) ? "TRUE" : "FALSE", t != 12 && (e.l += 7);
      break;
    case 37:
    /* appears to be an alias */
    case 16:
      r[1] = wt[e[e.l]], e.l += t == 12 ? 4 : 8;
      break;
    case 0:
      e.l += 8;
      break;
    case 1:
      r[1] = _r(e);
      break;
    case 2:
      r[1] = ia(e, 0, { biff: t > 0 && t < 8 ? 2 : t });
      break;
    default:
      throw new Error("Bad SerAr: " + r[0]);
  }
  return r;
}
function lm(e, t, r) {
  for (var a = e.read_shift(r.biff == 12 ? 4 : 2), n = [], i = 0; i != a; ++i) n.push((r.biff == 12 ? na : qn)(e));
  return n;
}
function um(e, t, r) {
  var a = 0, n = 0;
  r.biff == 12 ? (a = e.read_shift(4), n = e.read_shift(4)) : (n = 1 + e.read_shift(1), a = 1 + e.read_shift(2)), r.biff >= 2 && r.biff < 8 && (--a, --n == 0 && (n = 256));
  for (var i = 0, s = []; i != a && (s[i] = []); ++i)
    for (var c = 0; c != n; ++c) s[i][c] = fm(e, r.biff);
  return s;
}
function hm(e, t, r) {
  var a = e.read_shift(1) >>> 5 & 3, n = !r || r.biff >= 8 ? 4 : 2, i = e.read_shift(n);
  switch (r.biff) {
    case 2:
      e.l += 5;
      break;
    case 3:
    case 4:
      e.l += 8;
      break;
    case 5:
      e.l += 12;
      break;
  }
  return [a, 0, i];
}
function dm(e, t, r) {
  if (r.biff == 5) return xm(e);
  var a = e.read_shift(1) >>> 5 & 3, n = e.read_shift(2), i = e.read_shift(4);
  return [a, n, i];
}
function xm(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2, "i");
  e.l += 8;
  var a = e.read_shift(2);
  return e.l += 12, [t, r, a];
}
function pm(e, t, r) {
  var a = e.read_shift(1) >>> 5 & 3;
  e.l += r && r.biff == 2 ? 3 : 4;
  var n = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [a, n];
}
function mm(e, t, r) {
  var a = e.read_shift(1) >>> 5 & 3, n = e.read_shift(r && r.biff == 2 ? 1 : 2);
  return [a, n];
}
function vm(e, t, r) {
  var a = e.read_shift(1) >>> 5 & 3;
  return e.l += 4, r.biff < 8 && e.l--, r.biff == 12 && (e.l += 2), [a];
}
function gm(e, t, r) {
  var a = (e[e.l++] & 96) >> 5, n = e.read_shift(2), i = 4;
  if (r) switch (r.biff) {
    case 5:
      i = 15;
      break;
    case 12:
      i = 6;
      break;
  }
  return e.l += i, [a, n];
}
var Em = yr, _m = yr, Tm = yr;
function hn(e, t, r) {
  return e.l += 2, [Dp(e)];
}
function ys(e) {
  return e.l += 6, [];
}
var wm = hn, ym = ys, Sm = ys, km = hn;
function lf(e) {
  return e.l += 2, [ar(e), e.read_shift(2) & 1];
}
var Fm = hn, Am = lf, Nm = ys, Cm = hn, Om = hn, Im = [
  "Data",
  "All",
  "Headers",
  "??",
  "?Data2",
  "??",
  "?DataHeaders",
  "??",
  "Totals",
  "??",
  "??",
  "??",
  "?DataTotals",
  "??",
  "??",
  "??",
  "?Current"
];
function Lm(e) {
  e.l += 2;
  var t = e.read_shift(2), r = e.read_shift(2), a = e.read_shift(4), n = e.read_shift(2), i = e.read_shift(2), s = Im[r >> 2 & 31];
  return { ixti: t, coltype: r & 3, rt: s, idx: a, c: n, C: i };
}
function Rm(e) {
  return e.l += 2, [e.read_shift(4)];
}
function Dm(e, t, r) {
  return e.l += 5, e.l += 2, e.l += r.biff == 2 ? 1 : 4, ["PTGSHEET"];
}
function bm(e, t, r) {
  return e.l += r.biff == 2 ? 4 : 5, ["PTGENDSHEET"];
}
function Pm(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2);
  return [t, r];
}
function Mm(e) {
  var t = e.read_shift(1) >>> 5 & 3, r = e.read_shift(2);
  return [t, r];
}
function Bm(e) {
  return e.l += 4, [0, 0];
}
var tc = {
  /*::[*/
  1: { n: "PtgExp", f: am },
  /*::[*/
  2: { n: "PtgTbl", f: Tm },
  /*::[*/
  3: { n: "PtgAdd", f: rr },
  /*::[*/
  4: { n: "PtgSub", f: rr },
  /*::[*/
  5: { n: "PtgMul", f: rr },
  /*::[*/
  6: { n: "PtgDiv", f: rr },
  /*::[*/
  7: { n: "PtgPower", f: rr },
  /*::[*/
  8: { n: "PtgConcat", f: rr },
  /*::[*/
  9: { n: "PtgLt", f: rr },
  /*::[*/
  10: { n: "PtgLe", f: rr },
  /*::[*/
  11: { n: "PtgEq", f: rr },
  /*::[*/
  12: { n: "PtgGe", f: rr },
  /*::[*/
  13: { n: "PtgGt", f: rr },
  /*::[*/
  14: { n: "PtgNe", f: rr },
  /*::[*/
  15: { n: "PtgIsect", f: rr },
  /*::[*/
  16: { n: "PtgUnion", f: rr },
  /*::[*/
  17: { n: "PtgRange", f: rr },
  /*::[*/
  18: { n: "PtgUplus", f: rr },
  /*::[*/
  19: { n: "PtgUminus", f: rr },
  /*::[*/
  20: { n: "PtgPercent", f: rr },
  /*::[*/
  21: { n: "PtgParen", f: rr },
  /*::[*/
  22: { n: "PtgMissArg", f: rr },
  /*::[*/
  23: { n: "PtgStr", f: om },
  /*::[*/
  26: { n: "PtgSheet", f: Dm },
  /*::[*/
  27: { n: "PtgEndSheet", f: bm },
  /*::[*/
  28: { n: "PtgErr", f: nm },
  /*::[*/
  29: { n: "PtgBool", f: sm },
  /*::[*/
  30: { n: "PtgInt", f: im },
  /*::[*/
  31: { n: "PtgNum", f: cm },
  /*::[*/
  32: { n: "PtgArray", f: Hp },
  /*::[*/
  33: { n: "PtgFunc", f: Qp },
  /*::[*/
  34: { n: "PtgFuncVar", f: em },
  /*::[*/
  35: { n: "PtgName", f: hm },
  /*::[*/
  36: { n: "PtgRef", f: $p },
  /*::[*/
  37: { n: "PtgArea", f: Mp },
  /*::[*/
  38: { n: "PtgMemArea", f: pm },
  /*::[*/
  39: { n: "PtgMemErr", f: Em },
  /*::[*/
  40: { n: "PtgMemNoMem", f: _m },
  /*::[*/
  41: { n: "PtgMemFunc", f: mm },
  /*::[*/
  42: { n: "PtgRefErr", f: vm },
  /*::[*/
  43: { n: "PtgAreaErr", f: Up },
  /*::[*/
  44: { n: "PtgRefN", f: Jp },
  /*::[*/
  45: { n: "PtgAreaN", f: Wp },
  /*::[*/
  46: { n: "PtgMemAreaN", f: Pm },
  /*::[*/
  47: { n: "PtgMemNoMemN", f: Mm },
  /*::[*/
  57: { n: "PtgNameX", f: dm },
  /*::[*/
  58: { n: "PtgRef3d", f: Zp },
  /*::[*/
  59: { n: "PtgArea3d", f: Bp },
  /*::[*/
  60: { n: "PtgRefErr3d", f: gm },
  /*::[*/
  61: { n: "PtgAreaErr3d", f: Xp },
  /*::[*/
  255: {}
}, Um = {
  /*::[*/
  64: 32,
  /*::[*/
  96: 32,
  /*::[*/
  65: 33,
  /*::[*/
  97: 33,
  /*::[*/
  66: 34,
  /*::[*/
  98: 34,
  /*::[*/
  67: 35,
  /*::[*/
  99: 35,
  /*::[*/
  68: 36,
  /*::[*/
  100: 36,
  /*::[*/
  69: 37,
  /*::[*/
  101: 37,
  /*::[*/
  70: 38,
  /*::[*/
  102: 38,
  /*::[*/
  71: 39,
  /*::[*/
  103: 39,
  /*::[*/
  72: 40,
  /*::[*/
  104: 40,
  /*::[*/
  73: 41,
  /*::[*/
  105: 41,
  /*::[*/
  74: 42,
  /*::[*/
  106: 42,
  /*::[*/
  75: 43,
  /*::[*/
  107: 43,
  /*::[*/
  76: 44,
  /*::[*/
  108: 44,
  /*::[*/
  77: 45,
  /*::[*/
  109: 45,
  /*::[*/
  78: 46,
  /*::[*/
  110: 46,
  /*::[*/
  79: 47,
  /*::[*/
  111: 47,
  /*::[*/
  88: 34,
  /*::[*/
  120: 34,
  /*::[*/
  89: 57,
  /*::[*/
  121: 57,
  /*::[*/
  90: 58,
  /*::[*/
  122: 58,
  /*::[*/
  91: 59,
  /*::[*/
  123: 59,
  /*::[*/
  92: 60,
  /*::[*/
  124: 60,
  /*::[*/
  93: 61,
  /*::[*/
  125: 61
}, Xm = {
  /*::[*/
  1: { n: "PtgElfLel", f: lf },
  /*::[*/
  2: { n: "PtgElfRw", f: Cm },
  /*::[*/
  3: { n: "PtgElfCol", f: wm },
  /*::[*/
  6: { n: "PtgElfRwV", f: Om },
  /*::[*/
  7: { n: "PtgElfColV", f: km },
  /*::[*/
  10: { n: "PtgElfRadical", f: Fm },
  /*::[*/
  11: { n: "PtgElfRadicalS", f: Nm },
  /*::[*/
  13: { n: "PtgElfColS", f: ym },
  /*::[*/
  15: { n: "PtgElfColSV", f: Sm },
  /*::[*/
  16: { n: "PtgElfRadicalLel", f: Am },
  /*::[*/
  25: { n: "PtgList", f: Lm },
  /*::[*/
  29: { n: "PtgSxName", f: Rm },
  /*::[*/
  255: {}
}, Wm = {
  /*::[*/
  0: { n: "PtgAttrNoop", f: Bm },
  /*::[*/
  1: { n: "PtgAttrSemi", f: jp },
  /*::[*/
  2: { n: "PtgAttrIf", f: zp },
  /*::[*/
  4: { n: "PtgAttrChoose", f: Gp },
  /*::[*/
  8: { n: "PtgAttrGoto", f: Vp },
  /*::[*/
  16: { n: "PtgAttrSum", f: tm },
  /*::[*/
  32: { n: "PtgAttrBaxcel", f: rc },
  /*::[*/
  33: { n: "PtgAttrBaxcel", f: rc },
  /*::[*/
  64: { n: "PtgAttrSpace", f: Kp },
  /*::[*/
  65: { n: "PtgAttrSpaceSemi", f: qp },
  /*::[*/
  128: { n: "PtgAttrIfError", f: Yp },
  /*::[*/
  255: {}
};
function dn(e, t, r, a) {
  if (a.biff < 8) return yr(e, t);
  for (var n = e.l + t, i = [], s = 0; s !== r.length; ++s)
    switch (r[s][0]) {
      case "PtgArray":
        r[s][1] = um(e, 0, a), i.push(r[s][1]);
        break;
      case "PtgMemArea":
        r[s][2] = lm(e, r[s][1], a), i.push(r[s][2]);
        break;
      case "PtgExp":
        a && a.biff == 12 && (r[s][1][1] = e.read_shift(4), i.push(r[s][1]));
        break;
      case "PtgList":
      /* TODO: PtgList -> PtgExtraList */
      case "PtgElfRadicalS":
      /* TODO: PtgElfRadicalS -> PtgExtraElf */
      case "PtgElfColS":
      /* TODO: PtgElfColS -> PtgExtraElf */
      case "PtgElfColSV":
        throw "Unsupported " + r[s][0];
    }
  return t = n - e.l, t !== 0 && i.push(yr(e, t)), i;
}
function xn(e, t, r) {
  for (var a = e.l + t, n, i, s = []; a != e.l; )
    t = a - e.l, i = e[e.l], n = tc[i] || tc[Um[i]], (i === 24 || i === 25) && (n = (i === 24 ? Xm : Wm)[e[e.l + 1]]), !n || !n.f ? yr(e, t) : s.push([n.n, n.f(e, t, r)]);
  return s;
}
function Hm(e) {
  for (var t = [], r = 0; r < e.length; ++r) {
    for (var a = e[r], n = [], i = 0; i < a.length; ++i) {
      var s = a[i];
      s ? s[0] === 2 ? n.push('"' + s[1].replace(/"/g, '""') + '"') : n.push(s[1]) : n.push("");
    }
    t.push(n.join(","));
  }
  return t.join(";");
}
var Gm = {
  PtgAdd: "+",
  PtgConcat: "&",
  PtgDiv: "/",
  PtgEq: "=",
  PtgGe: ">=",
  PtgGt: ">",
  PtgLe: "<=",
  PtgLt: "<",
  PtgMul: "*",
  PtgNe: "<>",
  PtgPower: "^",
  PtgSub: "-"
};
function Vm(e, t) {
  if (!e && !(t && t.biff <= 5 && t.biff >= 2)) throw new Error("empty sheet name");
  return /[^\w\u4E00-\u9FFF\u3040-\u30FF]/.test(e) ? "'" + e + "'" : e;
}
function uf(e, t, r) {
  if (!e) return "SH33TJSERR0";
  if (r.biff > 8 && (!e.XTI || !e.XTI[t])) return e.SheetNames[t];
  if (!e.XTI) return "SH33TJSERR6";
  var a = e.XTI[t];
  if (r.biff < 8)
    return t > 1e4 && (t -= 65536), t < 0 && (t = -t), t == 0 ? "" : e.XTI[t - 1];
  if (!a) return "SH33TJSERR1";
  var n = "";
  if (r.biff > 8) switch (e[a[0]][0]) {
    case 357:
      return n = a[1] == -1 ? "#REF" : e.SheetNames[a[1]], a[1] == a[2] ? n : n + ":" + e.SheetNames[a[2]];
    case 358:
      return r.SID != null ? e.SheetNames[r.SID] : "SH33TJSSAME" + e[a[0]][0];
    /* 'BrtSupBookSrc' */
    /* falls through */
    default:
      return "SH33TJSSRC" + e[a[0]][0];
  }
  switch (e[a[0]][0][0]) {
    case 1025:
      return n = a[1] == -1 ? "#REF" : e.SheetNames[a[1]] || "SH33TJSERR3", a[1] == a[2] ? n : n + ":" + e.SheetNames[a[2]];
    case 14849:
      return e[a[0]].slice(1).map(function(i) {
        return i.Name;
      }).join(";;");
    //return "SH33TJSERR8";
    default:
      return e[a[0]][0][3] ? (n = a[1] == -1 ? "#REF" : e[a[0]][0][3][a[1]] || "SH33TJSERR4", a[1] == a[2] ? n : n + ":" + e[a[0]][0][3][a[2]]) : "SH33TJSERR2";
  }
}
function ac(e, t, r) {
  var a = uf(e, t, r);
  return a == "#REF" ? a : Vm(a, r);
}
function gr(e, t, r, a, n) {
  var i = n && n.biff || 8, s = (
    /*range != null ? range :*/
    { s: { c: 0, r: 0 } }
  ), c = [], o, l, f, d = 0, h = 0, p, m = "";
  if (!e[0] || !e[0][0]) return "";
  for (var x = -1, u = "", v = 0, E = e[0].length; v < E; ++v) {
    var g = e[0][v];
    switch (g[0]) {
      case "PtgUminus":
        c.push("-" + c.pop());
        break;
      case "PtgUplus":
        c.push("+" + c.pop());
        break;
      case "PtgPercent":
        c.push(c.pop() + "%");
        break;
      case "PtgAdd":
      /* [MS-XLS] 2.5.198.26 */
      case "PtgConcat":
      /* [MS-XLS] 2.5.198.43 */
      case "PtgDiv":
      /* [MS-XLS] 2.5.198.45 */
      case "PtgEq":
      /* [MS-XLS] 2.5.198.56 */
      case "PtgGe":
      /* [MS-XLS] 2.5.198.64 */
      case "PtgGt":
      /* [MS-XLS] 2.5.198.65 */
      case "PtgLe":
      /* [MS-XLS] 2.5.198.68 */
      case "PtgLt":
      /* [MS-XLS] 2.5.198.69 */
      case "PtgMul":
      /* [MS-XLS] 2.5.198.75 */
      case "PtgNe":
      /* [MS-XLS] 2.5.198.78 */
      case "PtgPower":
      /* [MS-XLS] 2.5.198.82 */
      case "PtgSub":
        if (o = c.pop(), l = c.pop(), x >= 0) {
          switch (e[0][x][1][0]) {
            case 0:
              u = je(" ", e[0][x][1][1]);
              break;
            case 1:
              u = je("\r", e[0][x][1][1]);
              break;
            default:
              if (u = "", n.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][x][1][0]);
          }
          l = l + u, x = -1;
        }
        c.push(l + Gm[g[0]] + o);
        break;
      case "PtgIsect":
        o = c.pop(), l = c.pop(), c.push(l + " " + o);
        break;
      case "PtgUnion":
        o = c.pop(), l = c.pop(), c.push(l + "," + o);
        break;
      case "PtgRange":
        o = c.pop(), l = c.pop(), c.push(l + ":" + o);
        break;
      case "PtgAttrChoose":
        break;
      case "PtgAttrGoto":
        break;
      case "PtgAttrIf":
        break;
      case "PtgAttrIfError":
        break;
      case "PtgRef":
        f = Ua(g[1][1], s, n), c.push(Xa(f, i));
        break;
      case "PtgRefN":
        f = r ? Ua(g[1][1], r, n) : g[1][1], c.push(Xa(f, i));
        break;
      case "PtgRef3d":
        d = /*::Number(*/
        g[1][1], f = Ua(g[1][2], s, n), m = ac(a, d, n), c.push(m + "!" + Xa(f, i));
        break;
      case "PtgFunc":
      /* [MS-XLS] 2.5.198.62 */
      case "PtgFuncVar":
        var y = g[1][0], N = g[1][1];
        y || (y = 0), y &= 127;
        var A = y == 0 ? [] : c.slice(-y);
        c.length -= y, N === "User" && (N = A.shift()), c.push(N + "(" + A.join(",") + ")");
        break;
      case "PtgBool":
        c.push(g[1] ? "TRUE" : "FALSE");
        break;
      case "PtgInt":
        c.push(
          /*::String(*/
          g[1]
          /*::)*/
        );
        break;
      case "PtgNum":
        c.push(String(g[1]));
        break;
      case "PtgStr":
        c.push('"' + g[1].replace(/"/g, '""') + '"');
        break;
      case "PtgErr":
        c.push(
          /*::String(*/
          g[1]
          /*::)*/
        );
        break;
      case "PtgAreaN":
        p = L0(g[1][1], r ? { s: r } : s, n), c.push(vi(p, n));
        break;
      case "PtgArea":
        p = L0(g[1][1], s, n), c.push(vi(p, n));
        break;
      case "PtgArea3d":
        d = /*::Number(*/
        g[1][1], p = g[1][2], m = ac(a, d, n), c.push(m + "!" + vi(p, n));
        break;
      case "PtgAttrSum":
        c.push("SUM(" + c.pop() + ")");
        break;
      case "PtgAttrBaxcel":
      /* [MS-XLS] 2.5.198.33 */
      case "PtgAttrSemi":
        break;
      case "PtgName":
        h = g[1][2];
        var w = (a.names || [])[h - 1] || (a[0] || [])[h], P = w ? w.Name : "SH33TJSNAME" + String(h);
        P && P.slice(0, 6) == "_xlfn." && !n.xlfn && (P = P.slice(6)), c.push(P);
        break;
      case "PtgNameX":
        var L = g[1][1];
        h = g[1][2];
        var U;
        if (n.biff <= 5)
          L < 0 && (L = -L), a[L] && (U = a[L][h]);
        else {
          var M = "";
          if (((a[L] || [])[0] || [])[0] == 14849 || (((a[L] || [])[0] || [])[0] == 1025 ? a[L][h] && a[L][h].itab > 0 && (M = a.SheetNames[a[L][h].itab - 1] + "!") : M = a.SheetNames[h - 1] + "!"), a[L] && a[L][h]) M += a[L][h].Name;
          else if (a[0] && a[0][h]) M += a[0][h].Name;
          else {
            var b = (uf(a, L, n) || "").split(";;");
            b[h - 1] ? M = b[h - 1] : M += "SH33TJSERRX";
          }
          c.push(M);
          break;
        }
        U || (U = { Name: "SH33TJSERRY" }), c.push(U.Name);
        break;
      case "PtgParen":
        var K = "(", se = ")";
        if (x >= 0) {
          switch (u = "", e[0][x][1][0]) {
            // $FlowIgnore
            case 2:
              K = je(" ", e[0][x][1][1]) + K;
              break;
            // $FlowIgnore
            case 3:
              K = je("\r", e[0][x][1][1]) + K;
              break;
            // $FlowIgnore
            case 4:
              se = je(" ", e[0][x][1][1]) + se;
              break;
            // $FlowIgnore
            case 5:
              se = je("\r", e[0][x][1][1]) + se;
              break;
            default:
              if (n.WTF) throw new Error("Unexpected PtgAttrSpaceType " + e[0][x][1][0]);
          }
          x = -1;
        }
        c.push(K + c.pop() + se);
        break;
      case "PtgRefErr":
        c.push("#REF!");
        break;
      case "PtgRefErr3d":
        c.push("#REF!");
        break;
      case "PtgExp":
        f = { c: g[1][1], r: g[1][0] };
        var re = { c: r.c, r: r.r };
        if (a.sharedf[me(f)]) {
          var ue = a.sharedf[me(f)];
          c.push(gr(ue, s, re, a, n));
        } else {
          var oe = !1;
          for (o = 0; o != a.arrayf.length; ++o)
            if (l = a.arrayf[o], !(f.c < l[0].s.c || f.c > l[0].e.c) && !(f.r < l[0].s.r || f.r > l[0].e.r)) {
              c.push(gr(l[1], s, re, a, n)), oe = !0;
              break;
            }
          oe || c.push(
            /*::String(*/
            g[1]
            /*::)*/
          );
        }
        break;
      case "PtgArray":
        c.push("{" + Hm(
          /*::(*/
          g[1]
          /*:: :any)*/
        ) + "}");
        break;
      case "PtgMemArea":
        break;
      case "PtgAttrSpace":
      /* [MS-XLS] 2.5.198.38 */
      case "PtgAttrSpaceSemi":
        x = v;
        break;
      case "PtgTbl":
        break;
      case "PtgMemErr":
        break;
      case "PtgMissArg":
        c.push("");
        break;
      case "PtgAreaErr":
        c.push("#REF!");
        break;
      case "PtgAreaErr3d":
        c.push("#REF!");
        break;
      case "PtgList":
        c.push("Table" + g[1].idx + "[#" + g[1].rt + "]");
        break;
      case "PtgMemAreaN":
      case "PtgMemNoMemN":
      case "PtgAttrNoop":
      case "PtgSheet":
      case "PtgEndSheet":
        break;
      case "PtgMemFunc":
        break;
      case "PtgMemNoMem":
        break;
      case "PtgElfCol":
      /* [MS-XLS] 2.5.198.46 */
      case "PtgElfColS":
      /* [MS-XLS] 2.5.198.47 */
      case "PtgElfColSV":
      /* [MS-XLS] 2.5.198.48 */
      case "PtgElfColV":
      /* [MS-XLS] 2.5.198.49 */
      case "PtgElfLel":
      /* [MS-XLS] 2.5.198.50 */
      case "PtgElfRadical":
      /* [MS-XLS] 2.5.198.51 */
      case "PtgElfRadicalLel":
      /* [MS-XLS] 2.5.198.52 */
      case "PtgElfRadicalS":
      /* [MS-XLS] 2.5.198.53 */
      case "PtgElfRw":
      /* [MS-XLS] 2.5.198.54 */
      case "PtgElfRwV":
        throw new Error("Unsupported ELFs");
      case "PtgSxName":
        throw new Error("Unrecognized Formula Token: " + String(g));
      default:
        throw new Error("Unrecognized Formula Token: " + String(g));
    }
    var Le = ["PtgAttrSpace", "PtgAttrSpaceSemi", "PtgAttrGoto"];
    if (n.biff != 3 && x >= 0 && Le.indexOf(e[0][v][0]) == -1) {
      g = e[0][x];
      var G = !0;
      switch (g[1][0]) {
        /* note: some bad XLSB files omit the PtgParen */
        case 4:
          G = !1;
        /* falls through */
        case 0:
          u = je(" ", g[1][1]);
          break;
        case 5:
          G = !1;
        /* falls through */
        case 1:
          u = je("\r", g[1][1]);
          break;
        default:
          if (u = "", n.WTF) throw new Error("Unexpected PtgAttrSpaceType " + g[1][0]);
      }
      c.push((G ? u : "") + c.pop() + (G ? "" : u)), x = -1;
    }
  }
  if (c.length > 1 && n.WTF) throw new Error("bad formula stack");
  return c[0];
}
function zm(e, t, r) {
  var a = e.l + t, n = r.biff == 2 ? 1 : 2, i, s = e.read_shift(n);
  if (s == 65535) return [[], yr(e, t - 2)];
  var c = xn(e, s, r);
  return t !== s + n && (i = dn(e, t - s - n, c, r)), e.l = a, [c, i];
}
function Ym(e, t, r) {
  var a = e.l + t, n = r.biff == 2 ? 1 : 2, i, s = e.read_shift(n);
  if (s == 65535) return [[], yr(e, t - 2)];
  var c = xn(e, s, r);
  return t !== s + n && (i = dn(e, t - s - n, c, r)), e.l = a, [c, i];
}
function jm(e, t, r, a) {
  var n = e.l + t, i = xn(e, a, r), s;
  return n !== e.l && (s = dn(e, n - e.l, i, r)), [i, s];
}
function Km(e, t, r) {
  var a = e.l + t, n, i = e.read_shift(2), s = xn(e, i, r);
  return i == 65535 ? [[], yr(e, t - 2)] : (t !== i + 2 && (n = dn(e, a - i - 2, s, r)), [s, n]);
}
function qm(e) {
  var t;
  if (mt(e, e.l + 6) !== 65535) return [_r(e), "n"];
  switch (e[e.l]) {
    case 0:
      return e.l += 8, ["String", "s"];
    case 1:
      return t = e[e.l + 2] === 1, e.l += 8, [t, "b"];
    case 2:
      return t = e[e.l + 2], e.l += 8, [t, "e"];
    case 3:
      return e.l += 8, ["", "s"];
  }
  return [];
}
function $m(e) {
  if (e == null) {
    var t = z(8);
    return t.write_shift(1, 3), t.write_shift(1, 0), t.write_shift(2, 0), t.write_shift(2, 0), t.write_shift(2, 65535), t;
  } else if (typeof e == "number") return Kt(e);
  return Kt(0);
}
function wi(e, t, r) {
  var a = e.l + t, n = ut(e);
  r.biff == 2 && ++e.l;
  var i = qm(e), s = e.read_shift(1);
  r.biff != 2 && (e.read_shift(1), r.biff >= 5 && e.read_shift(4));
  var c = Ym(e, a - e.l, r);
  return { cell: n, val: i[0], formula: c, shared: s >> 3 & 1, tt: i[1] };
}
function Jm(e, t, r, a, n) {
  var i = $t(t, r, n), s = $m(e.v), c = z(6), o = 33;
  c.write_shift(2, o), c.write_shift(4, 0);
  for (var l = z(e.bf.length), f = 0; f < e.bf.length; ++f) l[f] = e.bf[f];
  var d = fr([i, s, c, l]);
  return d;
}
function $n(e, t, r) {
  var a = e.read_shift(4), n = xn(e, a, r), i = e.read_shift(4), s = i > 0 ? dn(e, i, n, r) : null;
  return [n, s];
}
var Zm = $n, Jn = $n, Qm = $n, ev = $n, rv = {
  0: "BEEP",
  1: "OPEN",
  2: "OPEN.LINKS",
  3: "CLOSE.ALL",
  4: "SAVE",
  5: "SAVE.AS",
  6: "FILE.DELETE",
  7: "PAGE.SETUP",
  8: "PRINT",
  9: "PRINTER.SETUP",
  10: "QUIT",
  11: "NEW.WINDOW",
  12: "ARRANGE.ALL",
  13: "WINDOW.SIZE",
  14: "WINDOW.MOVE",
  15: "FULL",
  16: "CLOSE",
  17: "RUN",
  22: "SET.PRINT.AREA",
  23: "SET.PRINT.TITLES",
  24: "SET.PAGE.BREAK",
  25: "REMOVE.PAGE.BREAK",
  26: "FONT",
  27: "DISPLAY",
  28: "PROTECT.DOCUMENT",
  29: "PRECISION",
  30: "A1.R1C1",
  31: "CALCULATE.NOW",
  32: "CALCULATION",
  34: "DATA.FIND",
  35: "EXTRACT",
  36: "DATA.DELETE",
  37: "SET.DATABASE",
  38: "SET.CRITERIA",
  39: "SORT",
  40: "DATA.SERIES",
  41: "TABLE",
  42: "FORMAT.NUMBER",
  43: "ALIGNMENT",
  44: "STYLE",
  45: "BORDER",
  46: "CELL.PROTECTION",
  47: "COLUMN.WIDTH",
  48: "UNDO",
  49: "CUT",
  50: "COPY",
  51: "PASTE",
  52: "CLEAR",
  53: "PASTE.SPECIAL",
  54: "EDIT.DELETE",
  55: "INSERT",
  56: "FILL.RIGHT",
  57: "FILL.DOWN",
  61: "DEFINE.NAME",
  62: "CREATE.NAMES",
  63: "FORMULA.GOTO",
  64: "FORMULA.FIND",
  65: "SELECT.LAST.CELL",
  66: "SHOW.ACTIVE.CELL",
  67: "GALLERY.AREA",
  68: "GALLERY.BAR",
  69: "GALLERY.COLUMN",
  70: "GALLERY.LINE",
  71: "GALLERY.PIE",
  72: "GALLERY.SCATTER",
  73: "COMBINATION",
  74: "PREFERRED",
  75: "ADD.OVERLAY",
  76: "GRIDLINES",
  77: "SET.PREFERRED",
  78: "AXES",
  79: "LEGEND",
  80: "ATTACH.TEXT",
  81: "ADD.ARROW",
  82: "SELECT.CHART",
  83: "SELECT.PLOT.AREA",
  84: "PATTERNS",
  85: "MAIN.CHART",
  86: "OVERLAY",
  87: "SCALE",
  88: "FORMAT.LEGEND",
  89: "FORMAT.TEXT",
  90: "EDIT.REPEAT",
  91: "PARSE",
  92: "JUSTIFY",
  93: "HIDE",
  94: "UNHIDE",
  95: "WORKSPACE",
  96: "FORMULA",
  97: "FORMULA.FILL",
  98: "FORMULA.ARRAY",
  99: "DATA.FIND.NEXT",
  100: "DATA.FIND.PREV",
  101: "FORMULA.FIND.NEXT",
  102: "FORMULA.FIND.PREV",
  103: "ACTIVATE",
  104: "ACTIVATE.NEXT",
  105: "ACTIVATE.PREV",
  106: "UNLOCKED.NEXT",
  107: "UNLOCKED.PREV",
  108: "COPY.PICTURE",
  109: "SELECT",
  110: "DELETE.NAME",
  111: "DELETE.FORMAT",
  112: "VLINE",
  113: "HLINE",
  114: "VPAGE",
  115: "HPAGE",
  116: "VSCROLL",
  117: "HSCROLL",
  118: "ALERT",
  119: "NEW",
  120: "CANCEL.COPY",
  121: "SHOW.CLIPBOARD",
  122: "MESSAGE",
  124: "PASTE.LINK",
  125: "APP.ACTIVATE",
  126: "DELETE.ARROW",
  127: "ROW.HEIGHT",
  128: "FORMAT.MOVE",
  129: "FORMAT.SIZE",
  130: "FORMULA.REPLACE",
  131: "SEND.KEYS",
  132: "SELECT.SPECIAL",
  133: "APPLY.NAMES",
  134: "REPLACE.FONT",
  135: "FREEZE.PANES",
  136: "SHOW.INFO",
  137: "SPLIT",
  138: "ON.WINDOW",
  139: "ON.DATA",
  140: "DISABLE.INPUT",
  142: "OUTLINE",
  143: "LIST.NAMES",
  144: "FILE.CLOSE",
  145: "SAVE.WORKBOOK",
  146: "DATA.FORM",
  147: "COPY.CHART",
  148: "ON.TIME",
  149: "WAIT",
  150: "FORMAT.FONT",
  151: "FILL.UP",
  152: "FILL.LEFT",
  153: "DELETE.OVERLAY",
  155: "SHORT.MENUS",
  159: "SET.UPDATE.STATUS",
  161: "COLOR.PALETTE",
  162: "DELETE.STYLE",
  163: "WINDOW.RESTORE",
  164: "WINDOW.MAXIMIZE",
  166: "CHANGE.LINK",
  167: "CALCULATE.DOCUMENT",
  168: "ON.KEY",
  169: "APP.RESTORE",
  170: "APP.MOVE",
  171: "APP.SIZE",
  172: "APP.MINIMIZE",
  173: "APP.MAXIMIZE",
  174: "BRING.TO.FRONT",
  175: "SEND.TO.BACK",
  185: "MAIN.CHART.TYPE",
  186: "OVERLAY.CHART.TYPE",
  187: "SELECT.END",
  188: "OPEN.MAIL",
  189: "SEND.MAIL",
  190: "STANDARD.FONT",
  191: "CONSOLIDATE",
  192: "SORT.SPECIAL",
  193: "GALLERY.3D.AREA",
  194: "GALLERY.3D.COLUMN",
  195: "GALLERY.3D.LINE",
  196: "GALLERY.3D.PIE",
  197: "VIEW.3D",
  198: "GOAL.SEEK",
  199: "WORKGROUP",
  200: "FILL.GROUP",
  201: "UPDATE.LINK",
  202: "PROMOTE",
  203: "DEMOTE",
  204: "SHOW.DETAIL",
  206: "UNGROUP",
  207: "OBJECT.PROPERTIES",
  208: "SAVE.NEW.OBJECT",
  209: "SHARE",
  210: "SHARE.NAME",
  211: "DUPLICATE",
  212: "APPLY.STYLE",
  213: "ASSIGN.TO.OBJECT",
  214: "OBJECT.PROTECTION",
  215: "HIDE.OBJECT",
  216: "SET.EXTRACT",
  217: "CREATE.PUBLISHER",
  218: "SUBSCRIBE.TO",
  219: "ATTRIBUTES",
  220: "SHOW.TOOLBAR",
  222: "PRINT.PREVIEW",
  223: "EDIT.COLOR",
  224: "SHOW.LEVELS",
  225: "FORMAT.MAIN",
  226: "FORMAT.OVERLAY",
  227: "ON.RECALC",
  228: "EDIT.SERIES",
  229: "DEFINE.STYLE",
  240: "LINE.PRINT",
  243: "ENTER.DATA",
  249: "GALLERY.RADAR",
  250: "MERGE.STYLES",
  251: "EDITION.OPTIONS",
  252: "PASTE.PICTURE",
  253: "PASTE.PICTURE.LINK",
  254: "SPELLING",
  256: "ZOOM",
  259: "INSERT.OBJECT",
  260: "WINDOW.MINIMIZE",
  265: "SOUND.NOTE",
  266: "SOUND.PLAY",
  267: "FORMAT.SHAPE",
  268: "EXTEND.POLYGON",
  269: "FORMAT.AUTO",
  272: "GALLERY.3D.BAR",
  273: "GALLERY.3D.SURFACE",
  274: "FILL.AUTO",
  276: "CUSTOMIZE.TOOLBAR",
  277: "ADD.TOOL",
  278: "EDIT.OBJECT",
  279: "ON.DOUBLECLICK",
  280: "ON.ENTRY",
  281: "WORKBOOK.ADD",
  282: "WORKBOOK.MOVE",
  283: "WORKBOOK.COPY",
  284: "WORKBOOK.OPTIONS",
  285: "SAVE.WORKSPACE",
  288: "CHART.WIZARD",
  289: "DELETE.TOOL",
  290: "MOVE.TOOL",
  291: "WORKBOOK.SELECT",
  292: "WORKBOOK.ACTIVATE",
  293: "ASSIGN.TO.TOOL",
  295: "COPY.TOOL",
  296: "RESET.TOOL",
  297: "CONSTRAIN.NUMERIC",
  298: "PASTE.TOOL",
  302: "WORKBOOK.NEW",
  305: "SCENARIO.CELLS",
  306: "SCENARIO.DELETE",
  307: "SCENARIO.ADD",
  308: "SCENARIO.EDIT",
  309: "SCENARIO.SHOW",
  310: "SCENARIO.SHOW.NEXT",
  311: "SCENARIO.SUMMARY",
  312: "PIVOT.TABLE.WIZARD",
  313: "PIVOT.FIELD.PROPERTIES",
  314: "PIVOT.FIELD",
  315: "PIVOT.ITEM",
  316: "PIVOT.ADD.FIELDS",
  318: "OPTIONS.CALCULATION",
  319: "OPTIONS.EDIT",
  320: "OPTIONS.VIEW",
  321: "ADDIN.MANAGER",
  322: "MENU.EDITOR",
  323: "ATTACH.TOOLBARS",
  324: "VBAActivate",
  325: "OPTIONS.CHART",
  328: "VBA.INSERT.FILE",
  330: "VBA.PROCEDURE.DEFINITION",
  336: "ROUTING.SLIP",
  338: "ROUTE.DOCUMENT",
  339: "MAIL.LOGON",
  342: "INSERT.PICTURE",
  343: "EDIT.TOOL",
  344: "GALLERY.DOUGHNUT",
  350: "CHART.TREND",
  352: "PIVOT.ITEM.PROPERTIES",
  354: "WORKBOOK.INSERT",
  355: "OPTIONS.TRANSITION",
  356: "OPTIONS.GENERAL",
  370: "FILTER.ADVANCED",
  373: "MAIL.ADD.MAILER",
  374: "MAIL.DELETE.MAILER",
  375: "MAIL.REPLY",
  376: "MAIL.REPLY.ALL",
  377: "MAIL.FORWARD",
  378: "MAIL.NEXT.LETTER",
  379: "DATA.LABEL",
  380: "INSERT.TITLE",
  381: "FONT.PROPERTIES",
  382: "MACRO.OPTIONS",
  383: "WORKBOOK.HIDE",
  384: "WORKBOOK.UNHIDE",
  385: "WORKBOOK.DELETE",
  386: "WORKBOOK.NAME",
  388: "GALLERY.CUSTOM",
  390: "ADD.CHART.AUTOFORMAT",
  391: "DELETE.CHART.AUTOFORMAT",
  392: "CHART.ADD.DATA",
  393: "AUTO.OUTLINE",
  394: "TAB.ORDER",
  395: "SHOW.DIALOG",
  396: "SELECT.ALL",
  397: "UNGROUP.SHEETS",
  398: "SUBTOTAL.CREATE",
  399: "SUBTOTAL.REMOVE",
  400: "RENAME.OBJECT",
  412: "WORKBOOK.SCROLL",
  413: "WORKBOOK.NEXT",
  414: "WORKBOOK.PREV",
  415: "WORKBOOK.TAB.SPLIT",
  416: "FULL.SCREEN",
  417: "WORKBOOK.PROTECT",
  420: "SCROLLBAR.PROPERTIES",
  421: "PIVOT.SHOW.PAGES",
  422: "TEXT.TO.COLUMNS",
  423: "FORMAT.CHARTTYPE",
  424: "LINK.FORMAT",
  425: "TRACER.DISPLAY",
  430: "TRACER.NAVIGATE",
  431: "TRACER.CLEAR",
  432: "TRACER.ERROR",
  433: "PIVOT.FIELD.GROUP",
  434: "PIVOT.FIELD.UNGROUP",
  435: "CHECKBOX.PROPERTIES",
  436: "LABEL.PROPERTIES",
  437: "LISTBOX.PROPERTIES",
  438: "EDITBOX.PROPERTIES",
  439: "PIVOT.REFRESH",
  440: "LINK.COMBO",
  441: "OPEN.TEXT",
  442: "HIDE.DIALOG",
  443: "SET.DIALOG.FOCUS",
  444: "ENABLE.OBJECT",
  445: "PUSHBUTTON.PROPERTIES",
  446: "SET.DIALOG.DEFAULT",
  447: "FILTER",
  448: "FILTER.SHOW.ALL",
  449: "CLEAR.OUTLINE",
  450: "FUNCTION.WIZARD",
  451: "ADD.LIST.ITEM",
  452: "SET.LIST.ITEM",
  453: "REMOVE.LIST.ITEM",
  454: "SELECT.LIST.ITEM",
  455: "SET.CONTROL.VALUE",
  456: "SAVE.COPY.AS",
  458: "OPTIONS.LISTS.ADD",
  459: "OPTIONS.LISTS.DELETE",
  460: "SERIES.AXES",
  461: "SERIES.X",
  462: "SERIES.Y",
  463: "ERRORBAR.X",
  464: "ERRORBAR.Y",
  465: "FORMAT.CHART",
  466: "SERIES.ORDER",
  467: "MAIL.LOGOFF",
  468: "CLEAR.ROUTING.SLIP",
  469: "APP.ACTIVATE.MICROSOFT",
  470: "MAIL.EDIT.MAILER",
  471: "ON.SHEET",
  472: "STANDARD.WIDTH",
  473: "SCENARIO.MERGE",
  474: "SUMMARY.INFO",
  475: "FIND.FILE",
  476: "ACTIVE.CELL.FONT",
  477: "ENABLE.TIPWIZARD",
  478: "VBA.MAKE.ADDIN",
  480: "INSERTDATATABLE",
  481: "WORKGROUP.OPTIONS",
  482: "MAIL.SEND.MAILER",
  485: "AUTOCORRECT",
  489: "POST.DOCUMENT",
  491: "PICKLIST",
  493: "VIEW.SHOW",
  494: "VIEW.DEFINE",
  495: "VIEW.DELETE",
  509: "SHEET.BACKGROUND",
  510: "INSERT.MAP.OBJECT",
  511: "OPTIONS.MENONO",
  517: "MSOCHECKS",
  518: "NORMAL",
  519: "LAYOUT",
  520: "RM.PRINT.AREA",
  521: "CLEAR.PRINT.AREA",
  522: "ADD.PRINT.AREA",
  523: "MOVE.BRK",
  545: "HIDECURR.NOTE",
  546: "HIDEALL.NOTES",
  547: "DELETE.NOTE",
  548: "TRAVERSE.NOTES",
  549: "ACTIVATE.NOTES",
  620: "PROTECT.REVISIONS",
  621: "UNPROTECT.REVISIONS",
  647: "OPTIONS.ME",
  653: "WEB.PUBLISH",
  667: "NEWWEBQUERY",
  673: "PIVOT.TABLE.CHART",
  753: "OPTIONS.SAVE",
  755: "OPTIONS.SPELL",
  808: "HIDEALL.INKANNOTS"
}, hf = {
  0: "COUNT",
  1: "IF",
  2: "ISNA",
  3: "ISERROR",
  4: "SUM",
  5: "AVERAGE",
  6: "MIN",
  7: "MAX",
  8: "ROW",
  9: "COLUMN",
  10: "NA",
  11: "NPV",
  12: "STDEV",
  13: "DOLLAR",
  14: "FIXED",
  15: "SIN",
  16: "COS",
  17: "TAN",
  18: "ATAN",
  19: "PI",
  20: "SQRT",
  21: "EXP",
  22: "LN",
  23: "LOG10",
  24: "ABS",
  25: "INT",
  26: "SIGN",
  27: "ROUND",
  28: "LOOKUP",
  29: "INDEX",
  30: "REPT",
  31: "MID",
  32: "LEN",
  33: "VALUE",
  34: "TRUE",
  35: "FALSE",
  36: "AND",
  37: "OR",
  38: "NOT",
  39: "MOD",
  40: "DCOUNT",
  41: "DSUM",
  42: "DAVERAGE",
  43: "DMIN",
  44: "DMAX",
  45: "DSTDEV",
  46: "VAR",
  47: "DVAR",
  48: "TEXT",
  49: "LINEST",
  50: "TREND",
  51: "LOGEST",
  52: "GROWTH",
  53: "GOTO",
  54: "HALT",
  55: "RETURN",
  56: "PV",
  57: "FV",
  58: "NPER",
  59: "PMT",
  60: "RATE",
  61: "MIRR",
  62: "IRR",
  63: "RAND",
  64: "MATCH",
  65: "DATE",
  66: "TIME",
  67: "DAY",
  68: "MONTH",
  69: "YEAR",
  70: "WEEKDAY",
  71: "HOUR",
  72: "MINUTE",
  73: "SECOND",
  74: "NOW",
  75: "AREAS",
  76: "ROWS",
  77: "COLUMNS",
  78: "OFFSET",
  79: "ABSREF",
  80: "RELREF",
  81: "ARGUMENT",
  82: "SEARCH",
  83: "TRANSPOSE",
  84: "ERROR",
  85: "STEP",
  86: "TYPE",
  87: "ECHO",
  88: "SET.NAME",
  89: "CALLER",
  90: "DEREF",
  91: "WINDOWS",
  92: "SERIES",
  93: "DOCUMENTS",
  94: "ACTIVE.CELL",
  95: "SELECTION",
  96: "RESULT",
  97: "ATAN2",
  98: "ASIN",
  99: "ACOS",
  100: "CHOOSE",
  101: "HLOOKUP",
  102: "VLOOKUP",
  103: "LINKS",
  104: "INPUT",
  105: "ISREF",
  106: "GET.FORMULA",
  107: "GET.NAME",
  108: "SET.VALUE",
  109: "LOG",
  110: "EXEC",
  111: "CHAR",
  112: "LOWER",
  113: "UPPER",
  114: "PROPER",
  115: "LEFT",
  116: "RIGHT",
  117: "EXACT",
  118: "TRIM",
  119: "REPLACE",
  120: "SUBSTITUTE",
  121: "CODE",
  122: "NAMES",
  123: "DIRECTORY",
  124: "FIND",
  125: "CELL",
  126: "ISERR",
  127: "ISTEXT",
  128: "ISNUMBER",
  129: "ISBLANK",
  130: "T",
  131: "N",
  132: "FOPEN",
  133: "FCLOSE",
  134: "FSIZE",
  135: "FREADLN",
  136: "FREAD",
  137: "FWRITELN",
  138: "FWRITE",
  139: "FPOS",
  140: "DATEVALUE",
  141: "TIMEVALUE",
  142: "SLN",
  143: "SYD",
  144: "DDB",
  145: "GET.DEF",
  146: "REFTEXT",
  147: "TEXTREF",
  148: "INDIRECT",
  149: "REGISTER",
  150: "CALL",
  151: "ADD.BAR",
  152: "ADD.MENU",
  153: "ADD.COMMAND",
  154: "ENABLE.COMMAND",
  155: "CHECK.COMMAND",
  156: "RENAME.COMMAND",
  157: "SHOW.BAR",
  158: "DELETE.MENU",
  159: "DELETE.COMMAND",
  160: "GET.CHART.ITEM",
  161: "DIALOG.BOX",
  162: "CLEAN",
  163: "MDETERM",
  164: "MINVERSE",
  165: "MMULT",
  166: "FILES",
  167: "IPMT",
  168: "PPMT",
  169: "COUNTA",
  170: "CANCEL.KEY",
  171: "FOR",
  172: "WHILE",
  173: "BREAK",
  174: "NEXT",
  175: "INITIATE",
  176: "REQUEST",
  177: "POKE",
  178: "EXECUTE",
  179: "TERMINATE",
  180: "RESTART",
  181: "HELP",
  182: "GET.BAR",
  183: "PRODUCT",
  184: "FACT",
  185: "GET.CELL",
  186: "GET.WORKSPACE",
  187: "GET.WINDOW",
  188: "GET.DOCUMENT",
  189: "DPRODUCT",
  190: "ISNONTEXT",
  191: "GET.NOTE",
  192: "NOTE",
  193: "STDEVP",
  194: "VARP",
  195: "DSTDEVP",
  196: "DVARP",
  197: "TRUNC",
  198: "ISLOGICAL",
  199: "DCOUNTA",
  200: "DELETE.BAR",
  201: "UNREGISTER",
  204: "USDOLLAR",
  205: "FINDB",
  206: "SEARCHB",
  207: "REPLACEB",
  208: "LEFTB",
  209: "RIGHTB",
  210: "MIDB",
  211: "LENB",
  212: "ROUNDUP",
  213: "ROUNDDOWN",
  214: "ASC",
  215: "DBCS",
  216: "RANK",
  219: "ADDRESS",
  220: "DAYS360",
  221: "TODAY",
  222: "VDB",
  223: "ELSE",
  224: "ELSE.IF",
  225: "END.IF",
  226: "FOR.CELL",
  227: "MEDIAN",
  228: "SUMPRODUCT",
  229: "SINH",
  230: "COSH",
  231: "TANH",
  232: "ASINH",
  233: "ACOSH",
  234: "ATANH",
  235: "DGET",
  236: "CREATE.OBJECT",
  237: "VOLATILE",
  238: "LAST.ERROR",
  239: "CUSTOM.UNDO",
  240: "CUSTOM.REPEAT",
  241: "FORMULA.CONVERT",
  242: "GET.LINK.INFO",
  243: "TEXT.BOX",
  244: "INFO",
  245: "GROUP",
  246: "GET.OBJECT",
  247: "DB",
  248: "PAUSE",
  251: "RESUME",
  252: "FREQUENCY",
  253: "ADD.TOOLBAR",
  254: "DELETE.TOOLBAR",
  255: "User",
  256: "RESET.TOOLBAR",
  257: "EVALUATE",
  258: "GET.TOOLBAR",
  259: "GET.TOOL",
  260: "SPELLING.CHECK",
  261: "ERROR.TYPE",
  262: "APP.TITLE",
  263: "WINDOW.TITLE",
  264: "SAVE.TOOLBAR",
  265: "ENABLE.TOOL",
  266: "PRESS.TOOL",
  267: "REGISTER.ID",
  268: "GET.WORKBOOK",
  269: "AVEDEV",
  270: "BETADIST",
  271: "GAMMALN",
  272: "BETAINV",
  273: "BINOMDIST",
  274: "CHIDIST",
  275: "CHIINV",
  276: "COMBIN",
  277: "CONFIDENCE",
  278: "CRITBINOM",
  279: "EVEN",
  280: "EXPONDIST",
  281: "FDIST",
  282: "FINV",
  283: "FISHER",
  284: "FISHERINV",
  285: "FLOOR",
  286: "GAMMADIST",
  287: "GAMMAINV",
  288: "CEILING",
  289: "HYPGEOMDIST",
  290: "LOGNORMDIST",
  291: "LOGINV",
  292: "NEGBINOMDIST",
  293: "NORMDIST",
  294: "NORMSDIST",
  295: "NORMINV",
  296: "NORMSINV",
  297: "STANDARDIZE",
  298: "ODD",
  299: "PERMUT",
  300: "POISSON",
  301: "TDIST",
  302: "WEIBULL",
  303: "SUMXMY2",
  304: "SUMX2MY2",
  305: "SUMX2PY2",
  306: "CHITEST",
  307: "CORREL",
  308: "COVAR",
  309: "FORECAST",
  310: "FTEST",
  311: "INTERCEPT",
  312: "PEARSON",
  313: "RSQ",
  314: "STEYX",
  315: "SLOPE",
  316: "TTEST",
  317: "PROB",
  318: "DEVSQ",
  319: "GEOMEAN",
  320: "HARMEAN",
  321: "SUMSQ",
  322: "KURT",
  323: "SKEW",
  324: "ZTEST",
  325: "LARGE",
  326: "SMALL",
  327: "QUARTILE",
  328: "PERCENTILE",
  329: "PERCENTRANK",
  330: "MODE",
  331: "TRIMMEAN",
  332: "TINV",
  334: "MOVIE.COMMAND",
  335: "GET.MOVIE",
  336: "CONCATENATE",
  337: "POWER",
  338: "PIVOT.ADD.DATA",
  339: "GET.PIVOT.TABLE",
  340: "GET.PIVOT.FIELD",
  341: "GET.PIVOT.ITEM",
  342: "RADIANS",
  343: "DEGREES",
  344: "SUBTOTAL",
  345: "SUMIF",
  346: "COUNTIF",
  347: "COUNTBLANK",
  348: "SCENARIO.GET",
  349: "OPTIONS.LISTS.GET",
  350: "ISPMT",
  351: "DATEDIF",
  352: "DATESTRING",
  353: "NUMBERSTRING",
  354: "ROMAN",
  355: "OPEN.DIALOG",
  356: "SAVE.DIALOG",
  357: "VIEW.GET",
  358: "GETPIVOTDATA",
  359: "HYPERLINK",
  360: "PHONETIC",
  361: "AVERAGEA",
  362: "MAXA",
  363: "MINA",
  364: "STDEVPA",
  365: "VARPA",
  366: "STDEVA",
  367: "VARA",
  368: "BAHTTEXT",
  369: "THAIDAYOFWEEK",
  370: "THAIDIGIT",
  371: "THAIMONTHOFYEAR",
  372: "THAINUMSOUND",
  373: "THAINUMSTRING",
  374: "THAISTRINGLENGTH",
  375: "ISTHAIDIGIT",
  376: "ROUNDBAHTDOWN",
  377: "ROUNDBAHTUP",
  378: "THAIYEAR",
  379: "RTD",
  380: "CUBEVALUE",
  381: "CUBEMEMBER",
  382: "CUBEMEMBERPROPERTY",
  383: "CUBERANKEDMEMBER",
  384: "HEX2BIN",
  385: "HEX2DEC",
  386: "HEX2OCT",
  387: "DEC2BIN",
  388: "DEC2HEX",
  389: "DEC2OCT",
  390: "OCT2BIN",
  391: "OCT2HEX",
  392: "OCT2DEC",
  393: "BIN2DEC",
  394: "BIN2OCT",
  395: "BIN2HEX",
  396: "IMSUB",
  397: "IMDIV",
  398: "IMPOWER",
  399: "IMABS",
  400: "IMSQRT",
  401: "IMLN",
  402: "IMLOG2",
  403: "IMLOG10",
  404: "IMSIN",
  405: "IMCOS",
  406: "IMEXP",
  407: "IMARGUMENT",
  408: "IMCONJUGATE",
  409: "IMAGINARY",
  410: "IMREAL",
  411: "COMPLEX",
  412: "IMSUM",
  413: "IMPRODUCT",
  414: "SERIESSUM",
  415: "FACTDOUBLE",
  416: "SQRTPI",
  417: "QUOTIENT",
  418: "DELTA",
  419: "GESTEP",
  420: "ISEVEN",
  421: "ISODD",
  422: "MROUND",
  423: "ERF",
  424: "ERFC",
  425: "BESSELJ",
  426: "BESSELK",
  427: "BESSELY",
  428: "BESSELI",
  429: "XIRR",
  430: "XNPV",
  431: "PRICEMAT",
  432: "YIELDMAT",
  433: "INTRATE",
  434: "RECEIVED",
  435: "DISC",
  436: "PRICEDISC",
  437: "YIELDDISC",
  438: "TBILLEQ",
  439: "TBILLPRICE",
  440: "TBILLYIELD",
  441: "PRICE",
  442: "YIELD",
  443: "DOLLARDE",
  444: "DOLLARFR",
  445: "NOMINAL",
  446: "EFFECT",
  447: "CUMPRINC",
  448: "CUMIPMT",
  449: "EDATE",
  450: "EOMONTH",
  451: "YEARFRAC",
  452: "COUPDAYBS",
  453: "COUPDAYS",
  454: "COUPDAYSNC",
  455: "COUPNCD",
  456: "COUPNUM",
  457: "COUPPCD",
  458: "DURATION",
  459: "MDURATION",
  460: "ODDLPRICE",
  461: "ODDLYIELD",
  462: "ODDFPRICE",
  463: "ODDFYIELD",
  464: "RANDBETWEEN",
  465: "WEEKNUM",
  466: "AMORDEGRC",
  467: "AMORLINC",
  468: "CONVERT",
  724: "SHEETJS",
  469: "ACCRINT",
  470: "ACCRINTM",
  471: "WORKDAY",
  472: "NETWORKDAYS",
  473: "GCD",
  474: "MULTINOMIAL",
  475: "LCM",
  476: "FVSCHEDULE",
  477: "CUBEKPIMEMBER",
  478: "CUBESET",
  479: "CUBESETCOUNT",
  480: "IFERROR",
  481: "COUNTIFS",
  482: "SUMIFS",
  483: "AVERAGEIF",
  484: "AVERAGEIFS"
}, tv = {
  2: 1,
  3: 1,
  10: 0,
  15: 1,
  16: 1,
  17: 1,
  18: 1,
  19: 0,
  20: 1,
  21: 1,
  22: 1,
  23: 1,
  24: 1,
  25: 1,
  26: 1,
  27: 2,
  30: 2,
  31: 3,
  32: 1,
  33: 1,
  34: 0,
  35: 0,
  38: 1,
  39: 2,
  40: 3,
  41: 3,
  42: 3,
  43: 3,
  44: 3,
  45: 3,
  47: 3,
  48: 2,
  53: 1,
  61: 3,
  63: 0,
  65: 3,
  66: 3,
  67: 1,
  68: 1,
  69: 1,
  70: 1,
  71: 1,
  72: 1,
  73: 1,
  74: 0,
  75: 1,
  76: 1,
  77: 1,
  79: 2,
  80: 2,
  83: 1,
  85: 0,
  86: 1,
  89: 0,
  90: 1,
  94: 0,
  95: 0,
  97: 2,
  98: 1,
  99: 1,
  101: 3,
  102: 3,
  105: 1,
  106: 1,
  108: 2,
  111: 1,
  112: 1,
  113: 1,
  114: 1,
  117: 2,
  118: 1,
  119: 4,
  121: 1,
  126: 1,
  127: 1,
  128: 1,
  129: 1,
  130: 1,
  131: 1,
  133: 1,
  134: 1,
  135: 1,
  136: 2,
  137: 2,
  138: 2,
  140: 1,
  141: 1,
  142: 3,
  143: 4,
  144: 4,
  161: 1,
  162: 1,
  163: 1,
  164: 1,
  165: 2,
  172: 1,
  175: 2,
  176: 2,
  177: 3,
  178: 2,
  179: 1,
  184: 1,
  186: 1,
  189: 3,
  190: 1,
  195: 3,
  196: 3,
  197: 1,
  198: 1,
  199: 3,
  201: 1,
  207: 4,
  210: 3,
  211: 1,
  212: 2,
  213: 2,
  214: 1,
  215: 1,
  225: 0,
  229: 1,
  230: 1,
  231: 1,
  232: 1,
  233: 1,
  234: 1,
  235: 3,
  244: 1,
  247: 4,
  252: 2,
  257: 1,
  261: 1,
  271: 1,
  273: 4,
  274: 2,
  275: 2,
  276: 2,
  277: 3,
  278: 3,
  279: 1,
  280: 3,
  281: 3,
  282: 3,
  283: 1,
  284: 1,
  285: 2,
  286: 4,
  287: 3,
  288: 2,
  289: 4,
  290: 3,
  291: 3,
  292: 3,
  293: 4,
  294: 1,
  295: 3,
  296: 1,
  297: 3,
  298: 1,
  299: 2,
  300: 3,
  301: 3,
  302: 4,
  303: 2,
  304: 2,
  305: 2,
  306: 2,
  307: 2,
  308: 2,
  309: 3,
  310: 2,
  311: 2,
  312: 2,
  313: 2,
  314: 2,
  315: 2,
  316: 4,
  325: 2,
  326: 2,
  327: 2,
  328: 2,
  331: 2,
  332: 2,
  337: 2,
  342: 1,
  343: 1,
  346: 2,
  347: 1,
  350: 4,
  351: 3,
  352: 1,
  353: 2,
  360: 1,
  368: 1,
  369: 1,
  370: 1,
  371: 1,
  372: 1,
  373: 1,
  374: 1,
  375: 1,
  376: 1,
  377: 1,
  378: 1,
  382: 3,
  385: 1,
  392: 1,
  393: 1,
  396: 2,
  397: 2,
  398: 2,
  399: 1,
  400: 1,
  401: 1,
  402: 1,
  403: 1,
  404: 1,
  405: 1,
  406: 1,
  407: 1,
  408: 1,
  409: 1,
  410: 1,
  414: 4,
  415: 1,
  416: 1,
  417: 2,
  420: 1,
  421: 1,
  422: 2,
  424: 1,
  425: 2,
  426: 2,
  427: 2,
  428: 2,
  430: 3,
  438: 3,
  439: 3,
  440: 3,
  443: 2,
  444: 2,
  445: 2,
  446: 2,
  447: 6,
  448: 6,
  449: 2,
  450: 2,
  464: 2,
  468: 3,
  476: 2,
  479: 1,
  480: 2,
  65535: 0
};
function nc(e) {
  return e.slice(0, 3) == "of:" && (e = e.slice(3)), e.charCodeAt(0) == 61 && (e = e.slice(1), e.charCodeAt(0) == 61 && (e = e.slice(1))), e = e.replace(/COM\.MICROSOFT\./g, ""), e = e.replace(/\[((?:\.[A-Z]+[0-9]+)(?::\.[A-Z]+[0-9]+)?)\]/g, function(t, r) {
    return r.replace(/\./g, "");
  }), e = e.replace(/\[.(#[A-Z]*[?!])\]/g, "$1"), e.replace(/[;~]/g, ",").replace(/\|/g, ";");
}
function av(e) {
  var t = "of:=" + e.replace(Ts, "$1[.$2$3$4$5]").replace(/\]:\[/g, ":");
  return t.replace(/;/g, "|").replace(/,/g, ";");
}
function yi(e) {
  var t = e.split(":"), r = t[0].split(".")[0];
  return [r, t[0].split(".")[1] + (t.length > 1 ? ":" + (t[1].split(".")[1] || t[1].split(".")[0]) : "")];
}
function nv(e) {
  return e.replace(/\./, "!");
}
var Ha = {}, pa = {}, Ga = typeof Map < "u";
function Ss(e, t, r) {
  var a = 0, n = e.length;
  if (r) {
    if (Ga ? r.has(t) : Object.prototype.hasOwnProperty.call(r, t)) {
      for (var i = Ga ? r.get(t) : r[t]; a < i.length; ++a)
        if (e[i[a]].t === t)
          return e.Count++, i[a];
    }
  } else for (; a < n; ++a)
    if (e[a].t === t)
      return e.Count++, a;
  return e[n] = { t }, e.Count++, e.Unique++, r && (Ga ? (r.has(t) || r.set(t, []), r.get(t).push(n)) : (Object.prototype.hasOwnProperty.call(r, t) || (r[t] = []), r[t].push(n))), n;
}
function Zn(e, t) {
  var r = { min: e + 1, max: e + 1 }, a = -1;
  return t.MDW && (Er = t.MDW), t.width != null ? r.customWidth = 1 : t.wpx != null ? a = rn(t.wpx) : t.wch != null && (a = t.wch), a > -1 ? (r.width = Xn(a), r.customWidth = 1) : t.width != null && (r.width = t.width), t.hidden && (r.hidden = !0), t.level != null && (r.outlineLevel = r.level = t.level), r;
}
function Vt(e, t) {
  if (e) {
    var r = [0.7, 0.7, 0.75, 0.75, 0.3, 0.3];
    t == "xlml" && (r = [1, 1, 1, 1, 0.5, 0.5]), e.left == null && (e.left = r[0]), e.right == null && (e.right = r[1]), e.top == null && (e.top = r[2]), e.bottom == null && (e.bottom = r[3]), e.header == null && (e.header = r[4]), e.footer == null && (e.footer = r[5]);
  }
}
function Pt(e, t, r) {
  var a = r.revssf[t.z != null ? t.z : "General"], n = 60, i = e.length;
  if (a == null && r.ssf) {
    for (; n < 392; ++n) if (r.ssf[n] == null) {
      ot(t.z, n), r.ssf[n] = t.z, r.revssf[t.z] = a = n;
      break;
    }
  }
  for (n = 0; n != i; ++n) if (e[n].numFmtId === a) return n;
  return e[i] = {
    numFmtId: a,
    fontId: 0,
    fillId: 0,
    borderId: 0,
    xfId: 0,
    applyNumberFormat: 1
  }, i;
}
function df(e, t, r, a, n, i) {
  try {
    a.cellNF && (e.z = pe[t]);
  } catch (c) {
    if (a.WTF) throw c;
  }
  if (!(e.t === "z" && !a.cellStyles)) {
    if (e.t === "d" && typeof e.v == "string" && (e.v = Ge(e.v)), (!a || a.cellText !== !1) && e.t !== "z") try {
      if (pe[t] == null && ot(eu[t] || "General", t), e.t === "e") e.w = e.w || wt[e.v];
      else if (t === 0)
        if (e.t === "n")
          (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = Ka(e.v);
        else if (e.t === "d") {
          var s = sr(e.v);
          (s | 0) === s ? e.w = s.toString(10) : e.w = Ka(s);
        } else {
          if (e.v === void 0) return "";
          e.w = Yt(e.v, pa);
        }
      else e.t === "d" ? e.w = Br(t, sr(e.v), pa) : e.w = Br(t, e.v, pa);
    } catch (c) {
      if (a.WTF) throw c;
    }
    if (a.cellStyles && r != null)
      try {
        e.s = i.Fills[r], e.s.fgColor && e.s.fgColor.theme && !e.s.fgColor.rgb && (e.s.fgColor.rgb = Un(n.themeElements.clrScheme[e.s.fgColor.theme].rgb, e.s.fgColor.tint || 0), a.WTF && (e.s.fgColor.raw_rgb = n.themeElements.clrScheme[e.s.fgColor.theme].rgb)), e.s.bgColor && e.s.bgColor.theme && (e.s.bgColor.rgb = Un(n.themeElements.clrScheme[e.s.bgColor.theme].rgb, e.s.bgColor.tint || 0), a.WTF && (e.s.bgColor.raw_rgb = n.themeElements.clrScheme[e.s.bgColor.theme].rgb));
      } catch (c) {
        if (a.WTF && i.Fills) throw c;
      }
  }
}
function iv(e, t, r) {
  if (e && e["!ref"]) {
    var a = Ae(e["!ref"]);
    if (a.e.c < a.s.c || a.e.r < a.s.r) throw new Error("Bad range (" + r + "): " + e["!ref"]);
  }
}
function sv(e, t) {
  var r = Ae(t);
  r.s.r <= r.e.r && r.s.c <= r.e.c && r.s.r >= 0 && r.s.c >= 0 && (e["!ref"] = _e(r));
}
var cv = /<(?:\w:)?mergeCell ref="[A-Z0-9:]+"\s*[\/]?>/g, ov = /<(?:\w+:)?sheetData[^>]*>([\s\S]*)<\/(?:\w+:)?sheetData>/, fv = /<(?:\w:)?hyperlink [^>]*>/mg, lv = /"(\w*:\w*)"/, uv = /<(?:\w:)?col\b[^>]*[\/]?>/g, hv = /<(?:\w:)?autoFilter[^>]*([\/]|>([\s\S]*)<\/(?:\w:)?autoFilter)>/g, dv = /<(?:\w:)?pageMargins[^>]*\/>/g, xf = /<(?:\w:)?sheetPr\b(?:[^>a-z][^>]*)?\/>/, xv = /<(?:\w:)?sheetPr[^>]*(?:[\/]|>([\s\S]*)<\/(?:\w:)?sheetPr)>/, pv = /<(?:\w:)?sheetViews[^>]*(?:[\/]|>([\s\S]*)<\/(?:\w:)?sheetViews)>/;
function mv(e, t, r, a, n, i, s) {
  if (!e) return e;
  a || (a = { "!id": {} });
  var c = t.dense ? [] : {}, o = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, l = "", f = "", d = e.match(ov);
  d ? (l = e.slice(0, d.index), f = e.slice(d.index + d[0].length)) : l = f = e;
  var h = l.match(xf);
  h ? ks(h[0], c, n, r) : (h = l.match(xv)) && gv(h[0], h[1] || "", c, n, r);
  var p = (l.match(/<(?:\w*:)?dimension/) || { index: -1 }).index;
  if (p > 0) {
    var m = l.slice(p, p + 50).match(lv);
    m && sv(c, m[1]);
  }
  var x = l.match(pv);
  x && x[1] && Iv(x[1], n);
  var u = [];
  if (t.cellStyles) {
    var v = l.match(uv);
    v && Fv(u, v);
  }
  d && Dv(d[1], c, t, o, i, s);
  var E = f.match(hv);
  E && (c["!autofilter"] = Nv(E[0]));
  var g = [], y = f.match(cv);
  if (y) for (p = 0; p != y.length; ++p)
    g[p] = Ae(y[p].slice(y[p].indexOf('"') + 1));
  var N = f.match(fv);
  N && yv(c, N, a);
  var A = f.match(dv);
  if (A && (c["!margins"] = Sv(ge(A[0]))), !c["!ref"] && o.e.c >= o.s.c && o.e.r >= o.s.r && (c["!ref"] = _e(o)), t.sheetRows > 0 && c["!ref"]) {
    var w = Ae(c["!ref"]);
    t.sheetRows <= +w.e.r && (w.e.r = t.sheetRows - 1, w.e.r > o.e.r && (w.e.r = o.e.r), w.e.r < w.s.r && (w.s.r = w.e.r), w.e.c > o.e.c && (w.e.c = o.e.c), w.e.c < w.s.c && (w.s.c = w.e.c), c["!fullref"] = c["!ref"], c["!ref"] = _e(w));
  }
  return u.length > 0 && (c["!cols"] = u), g.length > 0 && (c["!merges"] = g), c;
}
function vv(e) {
  if (e.length === 0) return "";
  for (var t = '<mergeCells count="' + e.length + '">', r = 0; r != e.length; ++r) t += '<mergeCell ref="' + _e(e[r]) + '"/>';
  return t + "</mergeCells>";
}
function ks(e, t, r, a) {
  var n = ge(e);
  r.Sheets[a] || (r.Sheets[a] = {}), n.codeName && (r.Sheets[a].CodeName = Ie(Me(n.codeName)));
}
function gv(e, t, r, a, n) {
  ks(e.slice(0, e.indexOf(">")), r, a, n);
}
function Ev(e, t, r, a, n) {
  var i = !1, s = {}, c = null;
  if (a.bookType !== "xlsx" && t.vbaraw) {
    var o = t.SheetNames[r];
    try {
      t.Workbook && (o = t.Workbook.Sheets[r].CodeName || o);
    } catch {
    }
    i = !0, s.codeName = ct(Pe(o));
  }
  if (e && e["!outline"]) {
    var l = { summaryBelow: 1, summaryRight: 1 };
    e["!outline"].above && (l.summaryBelow = 0), e["!outline"].left && (l.summaryRight = 0), c = (c || "") + ne("outlinePr", null, l);
  }
  !i && !c || (n[n.length] = ne("sheetPr", c, s));
}
var _v = ["objects", "scenarios", "selectLockedCells", "selectUnlockedCells"], Tv = [
  "formatColumns",
  "formatRows",
  "formatCells",
  "insertColumns",
  "insertRows",
  "insertHyperlinks",
  "deleteColumns",
  "deleteRows",
  "sort",
  "autoFilter",
  "pivotTables"
];
function wv(e) {
  var t = { sheet: 1 };
  return _v.forEach(function(r) {
    e[r] != null && e[r] && (t[r] = "1");
  }), Tv.forEach(function(r) {
    e[r] != null && !e[r] && (t[r] = "0");
  }), e.password && (t.password = gs(e.password).toString(16).toUpperCase()), ne("sheetProtection", null, t);
}
function yv(e, t, r) {
  for (var a = Array.isArray(e), n = 0; n != t.length; ++n) {
    var i = ge(Me(t[n]), !0);
    if (!i.ref) return;
    var s = ((r || {})["!id"] || [])[i.id];
    s ? (i.Target = s.Target, i.location && (i.Target += "#" + Ie(i.location))) : (i.Target = "#" + Ie(i.location), s = { Target: i.Target, TargetMode: "Internal" }), i.Rel = s, i.tooltip && (i.Tooltip = i.tooltip, delete i.tooltip);
    for (var c = Ae(i.ref), o = c.s.r; o <= c.e.r; ++o) for (var l = c.s.c; l <= c.e.c; ++l) {
      var f = me({ c: l, r: o });
      a ? (e[o] || (e[o] = []), e[o][l] || (e[o][l] = { t: "z", v: void 0 }), e[o][l].l = i) : (e[f] || (e[f] = { t: "z", v: void 0 }), e[f].l = i);
    }
  }
}
function Sv(e) {
  var t = {};
  return ["left", "right", "top", "bottom", "header", "footer"].forEach(function(r) {
    e[r] && (t[r] = parseFloat(e[r]));
  }), t;
}
function kv(e) {
  return Vt(e), ne("pageMargins", null, e);
}
function Fv(e, t) {
  for (var r = !1, a = 0; a != t.length; ++a) {
    var n = ge(t[a], !0);
    n.hidden && (n.hidden = We(n.hidden));
    var i = parseInt(n.min, 10) - 1, s = parseInt(n.max, 10) - 1;
    for (n.outlineLevel && (n.level = +n.outlineLevel || 0), delete n.min, delete n.max, n.width = +n.width, !r && n.width && (r = !0, Es(n.width)), It(n); i <= s; ) e[i++] = Ue(n);
  }
}
function Av(e, t) {
  for (var r = ["<cols>"], a, n = 0; n != t.length; ++n)
    (a = t[n]) && (r[r.length] = ne("col", null, Zn(n, a)));
  return r[r.length] = "</cols>", r.join("");
}
function Nv(e) {
  var t = { ref: (e.match(/ref="([^"]*)"/) || [])[1] };
  return t;
}
function Cv(e, t, r, a) {
  var n = typeof e.ref == "string" ? e.ref : _e(e.ref);
  r.Workbook || (r.Workbook = { Sheets: [] }), r.Workbook.Names || (r.Workbook.Names = []);
  var i = r.Workbook.Names, s = Cr(n);
  s.s.r == s.e.r && (s.e.r = Cr(t["!ref"]).e.r, n = _e(s));
  for (var c = 0; c < i.length; ++c) {
    var o = i[c];
    if (o.Name == "_xlnm._FilterDatabase" && o.Sheet == a) {
      o.Ref = "'" + r.SheetNames[a] + "'!" + n;
      break;
    }
  }
  return c == i.length && i.push({ Name: "_xlnm._FilterDatabase", Sheet: a, Ref: "'" + r.SheetNames[a] + "'!" + n }), ne("autoFilter", null, { ref: n });
}
var Ov = /<(?:\w:)?sheetView(?:[^>a-z][^>]*)?\/?>/;
function Iv(e, t) {
  t.Views || (t.Views = [{}]), (e.match(Ov) || []).forEach(function(r, a) {
    var n = ge(r);
    t.Views[a] || (t.Views[a] = {}), +n.zoomScale && (t.Views[a].zoom = +n.zoomScale), We(n.rightToLeft) && (t.Views[a].RTL = !0);
  });
}
function Lv(e, t, r, a) {
  var n = { workbookViewId: "0" };
  return (((a || {}).Workbook || {}).Views || [])[0] && (n.rightToLeft = a.Workbook.Views[0].RTL ? "1" : "0"), ne("sheetViews", ne("sheetView", null, n), {});
}
function Rv(e, t, r, a) {
  if (e.c && r["!comments"].push([t, e.c]), e.v === void 0 && typeof e.f != "string" || e.t === "z" && !e.f) return "";
  var n = "", i = e.t, s = e.v;
  if (e.t !== "z") switch (e.t) {
    case "b":
      n = e.v ? "1" : "0";
      break;
    case "n":
      n = "" + e.v;
      break;
    case "e":
      n = wt[e.v];
      break;
    case "d":
      a && a.cellDates ? n = Ge(e.v, -1).toISOString() : (e = Ue(e), e.t = "n", n = "" + (e.v = sr(Ge(e.v)))), typeof e.z > "u" && (e.z = pe[14]);
      break;
    default:
      n = e.v;
      break;
  }
  var c = xr("v", Pe(n)), o = { r: t }, l = Pt(a.cellXfs, e, a);
  switch (l !== 0 && (o.s = l), e.t) {
    case "n":
      break;
    case "d":
      o.t = "d";
      break;
    case "b":
      o.t = "b";
      break;
    case "e":
      o.t = "e";
      break;
    case "z":
      break;
    default:
      if (e.v == null) {
        delete e.t;
        break;
      }
      if (e.v.length > 32767) throw new Error("Text length must not exceed 32767 characters");
      if (a && a.bookSST) {
        c = xr("v", "" + Ss(a.Strings, e.v, a.revStrings)), o.t = "s";
        break;
      }
      o.t = "str";
      break;
  }
  if (e.t != i && (e.t = i, e.v = s), typeof e.f == "string" && e.f) {
    var f = e.F && e.F.slice(0, t.length) == t ? { t: "array", ref: e.F } : null;
    c = ne("f", Pe(e.f), f) + (e.v != null ? c : "");
  }
  return e.l && r["!links"].push([t, e.l]), e.D && (o.cm = 1), ne("c", c, o);
}
var Dv = /* @__PURE__ */ (function() {
  var e = /<(?:\w+:)?c[ \/>]/, t = /<\/(?:\w+:)?row>/, r = /r=["']([^"']*)["']/, a = /<(?:\w+:)?is>([\S\s]*?)<\/(?:\w+:)?is>/, n = /ref=["']([^"']*)["']/, i = qa("v"), s = qa("f");
  return function(o, l, f, d, h, p) {
    for (var m = 0, x = "", u = [], v = [], E = 0, g = 0, y = 0, N = "", A, w, P = 0, L = 0, U, M, b = 0, K = 0, se = Array.isArray(p.CellXf), re, ue = [], oe = [], Le = Array.isArray(l), G = [], xe = {}, ve = !1, O = !!f.sheetStubs, B = o.split(t), R = 0, D = B.length; R != D; ++R) {
      x = B[R].trim();
      var Y = x.length;
      if (Y !== 0) {
        var J = 0;
        e: for (m = 0; m < Y; ++m) switch (
          /*x.charCodeAt(ri)*/
          x[m]
        ) {
          case ">":
            if (
              /*x.charCodeAt(ri-1) != 47*/
              x[m - 1] != "/"
            ) {
              ++m;
              break e;
            }
            if (f && f.cellStyles) {
              if (w = ge(x.slice(J, m), !0), P = w.r != null ? parseInt(w.r, 10) : P + 1, L = -1, f.sheetRows && f.sheetRows < P) continue;
              xe = {}, ve = !1, w.ht && (ve = !0, xe.hpt = parseFloat(w.ht), xe.hpx = ga(xe.hpt)), w.hidden == "1" && (ve = !0, xe.hidden = !0), w.outlineLevel != null && (ve = !0, xe.level = +w.outlineLevel), ve && (G[P - 1] = xe);
            }
            break;
          case "<":
            J = m;
            break;
        }
        if (J >= m) break;
        if (w = ge(x.slice(J, m), !0), P = w.r != null ? parseInt(w.r, 10) : P + 1, L = -1, !(f.sheetRows && f.sheetRows < P)) {
          d.s.r > P - 1 && (d.s.r = P - 1), d.e.r < P - 1 && (d.e.r = P - 1), f && f.cellStyles && (xe = {}, ve = !1, w.ht && (ve = !0, xe.hpt = parseFloat(w.ht), xe.hpx = ga(xe.hpt)), w.hidden == "1" && (ve = !0, xe.hidden = !0), w.outlineLevel != null && (ve = !0, xe.level = +w.outlineLevel), ve && (G[P - 1] = xe)), u = x.slice(m).split(e);
          for (var ae = 0; ae != u.length && u[ae].trim().charAt(0) == "<"; ++ae) ;
          for (u = u.slice(ae), m = 0; m != u.length; ++m)
            if (x = u[m].trim(), x.length !== 0) {
              if (v = x.match(r), E = m, g = 0, y = 0, x = "<c " + (x.slice(0, 1) == "<" ? ">" : "") + x, v != null && v.length === 2) {
                for (E = 0, N = v[1], g = 0; g != N.length && !((y = N.charCodeAt(g) - 64) < 1 || y > 26); ++g)
                  E = 26 * E + y;
                --E, L = E;
              } else ++L;
              for (g = 0; g != x.length && x.charCodeAt(g) !== 62; ++g) ;
              if (++g, w = ge(x.slice(0, g), !0), w.r || (w.r = me({ r: P - 1, c: L })), N = x.slice(g), A = { t: "" }, (v = N.match(i)) != null && /*::cref != null && */
              v[1] !== "" && (A.v = Ie(v[1])), f.cellFormula) {
                if ((v = N.match(s)) != null && /*::cref != null && */
                v[1] !== "") {
                  if (A.f = Ie(Me(v[1])).replace(/\r\n/g, `
`), f.xlfn || (A.f = ec(A.f)), /*::cref != null && cref[0] != null && */
                  v[0].indexOf('t="array"') > -1)
                    A.F = (N.match(n) || [])[1], A.F.indexOf(":") > -1 && ue.push([Ae(A.F), A.F]);
                  else if (
                    /*::cref != null && cref[0] != null && */
                    v[0].indexOf('t="shared"') > -1
                  ) {
                    M = ge(v[0]);
                    var ee = Ie(Me(v[1]));
                    f.xlfn || (ee = ec(ee)), oe[parseInt(M.si, 10)] = [M, ee, w.r];
                  }
                } else (v = N.match(/<f[^>]*\/>/)) && (M = ge(v[0]), oe[M.si] && (A.f = Op(oe[M.si][1], oe[M.si][2], w.r)));
                var Z = Ye(w.r);
                for (g = 0; g < ue.length; ++g)
                  Z.r >= ue[g][0].s.r && Z.r <= ue[g][0].e.r && Z.c >= ue[g][0].s.c && Z.c <= ue[g][0].e.c && (A.F = ue[g][1]);
              }
              if (w.t == null && A.v === void 0)
                if (A.f || A.F)
                  A.v = 0, A.t = "n";
                else if (O) A.t = "z";
                else continue;
              else A.t = w.t || "n";
              switch (d.s.c > L && (d.s.c = L), d.e.c < L && (d.e.c = L), A.t) {
                case "n":
                  if (A.v == "" || A.v == null) {
                    if (!O) continue;
                    A.t = "z";
                  } else A.v = parseFloat(A.v);
                  break;
                case "s":
                  if (typeof A.v > "u") {
                    if (!O) continue;
                    A.t = "z";
                  } else
                    U = Ha[parseInt(A.v, 10)], A.v = U.t, A.r = U.r, f.cellHTML && (A.h = U.h);
                  break;
                case "str":
                  A.t = "s", A.v = A.v != null ? Me(A.v) : "", f.cellHTML && (A.h = Qi(A.v));
                  break;
                case "inlineStr":
                  v = N.match(a), A.t = "s", v != null && (U = vs(v[1])) ? (A.v = U.t, f.cellHTML && (A.h = U.h)) : A.v = "";
                  break;
                case "b":
                  A.v = We(A.v);
                  break;
                case "d":
                  f.cellDates ? A.v = Ge(A.v, 1) : (A.v = sr(Ge(A.v, 1)), A.t = "n");
                  break;
                /* error string in .w, number in .v */
                case "e":
                  (!f || f.cellText !== !1) && (A.w = A.v), A.v = po[A.v];
                  break;
              }
              if (b = K = 0, re = null, se && w.s !== void 0 && (re = p.CellXf[w.s], re != null && (re.numFmtId != null && (b = re.numFmtId), f.cellStyles && re.fillId != null && (K = re.fillId))), df(A, b, K, f, h, p), f.cellDates && se && A.t == "n" && Qt(pe[b]) && (A.t = "d", A.v = jn(A.v)), w.cm && f.xlmeta) {
                var we = (f.xlmeta.Cell || [])[+w.cm - 1];
                we && we.type == "XLDAPR" && (A.D = !0);
              }
              if (Le) {
                var I = Ye(w.r);
                l[I.r] || (l[I.r] = []), l[I.r][I.c] = A;
              } else l[w.r] = A;
            }
        }
      }
    }
    G.length > 0 && (l["!rows"] = G);
  };
})();
function bv(e, t, r, a) {
  var n = [], i = [], s = Ae(e["!ref"]), c = "", o, l = "", f = [], d = 0, h = 0, p = e["!rows"], m = Array.isArray(e), x = { r: l }, u, v = -1;
  for (h = s.s.c; h <= s.e.c; ++h) f[h] = He(h);
  for (d = s.s.r; d <= s.e.r; ++d) {
    for (i = [], l = Ke(d), h = s.s.c; h <= s.e.c; ++h) {
      o = f[h] + l;
      var E = m ? (e[d] || [])[h] : e[o];
      E !== void 0 && (c = Rv(E, o, e, t)) != null && i.push(c);
    }
    (i.length > 0 || p && p[d]) && (x = { r: l }, p && p[d] && (u = p[d], u.hidden && (x.hidden = 1), v = -1, u.hpx ? v = tn(u.hpx) : u.hpt && (v = u.hpt), v > -1 && (x.ht = v, x.customHeight = 1), u.level && (x.outlineLevel = u.level)), n[n.length] = ne("row", i.join(""), x));
  }
  if (p) for (; d < p.length; ++d)
    p && p[d] && (x = { r: d + 1 }, u = p[d], u.hidden && (x.hidden = 1), v = -1, u.hpx ? v = tn(u.hpx) : u.hpt && (v = u.hpt), v > -1 && (x.ht = v, x.customHeight = 1), u.level && (x.outlineLevel = u.level), n[n.length] = ne("row", "", x));
  return n.join("");
}
function pf(e, t, r, a) {
  var n = [er, ne("worksheet", null, {
    xmlns: ea[0],
    "xmlns:r": ir.r
  })], i = r.SheetNames[e], s = 0, c = "", o = r.Sheets[i];
  o == null && (o = {});
  var l = o["!ref"] || "A1", f = Ae(l);
  if (f.e.c > 16383 || f.e.r > 1048575) {
    if (t.WTF) throw new Error("Range " + l + " exceeds format limit A1:XFD1048576");
    f.e.c = Math.min(f.e.c, 16383), f.e.r = Math.min(f.e.c, 1048575), l = _e(f);
  }
  a || (a = {}), o["!comments"] = [];
  var d = [];
  Ev(o, r, e, t, n), n[n.length] = ne("dimension", null, { ref: l }), n[n.length] = Lv(o, t, e, r), t.sheetFormat && (n[n.length] = ne("sheetFormatPr", null, {
    defaultRowHeight: t.sheetFormat.defaultRowHeight || "16",
    baseColWidth: t.sheetFormat.baseColWidth || "10",
    outlineLevelRow: t.sheetFormat.outlineLevelRow || "7"
  })), o["!cols"] != null && o["!cols"].length > 0 && (n[n.length] = Av(o, o["!cols"])), n[s = n.length] = "<sheetData/>", o["!links"] = [], o["!ref"] != null && (c = bv(o, t), c.length > 0 && (n[n.length] = c)), n.length > s + 1 && (n[n.length] = "</sheetData>", n[s] = n[s].replace("/>", ">")), o["!protect"] && (n[n.length] = wv(o["!protect"])), o["!autofilter"] != null && (n[n.length] = Cv(o["!autofilter"], o, r, e)), o["!merges"] != null && o["!merges"].length > 0 && (n[n.length] = vv(o["!merges"]));
  var h = -1, p, m = -1;
  return (
    /*::(*/
    o["!links"].length > 0 && (n[n.length] = "<hyperlinks>", o["!links"].forEach(function(x) {
      x[1].Target && (p = { ref: x[0] }, x[1].Target.charAt(0) != "#" && (m = be(a, -1, Pe(x[1].Target).replace(/#.*$/, ""), ke.HLINK), p["r:id"] = "rId" + m), (h = x[1].Target.indexOf("#")) > -1 && (p.location = Pe(x[1].Target.slice(h + 1))), x[1].Tooltip && (p.tooltip = Pe(x[1].Tooltip)), n[n.length] = ne("hyperlink", null, p));
    }), n[n.length] = "</hyperlinks>"), delete o["!links"], o["!margins"] != null && (n[n.length] = kv(o["!margins"])), (!t || t.ignoreEC || t.ignoreEC == null) && (n[n.length] = xr("ignoredErrors", ne("ignoredError", null, { numberStoredAsText: 1, sqref: l }))), d.length > 0 && (m = be(a, -1, "../drawings/drawing" + (e + 1) + ".xml", ke.DRAW), n[n.length] = ne("drawing", null, { "r:id": "rId" + m }), o["!drawing"] = d), o["!comments"].length > 0 && (m = be(a, -1, "../drawings/vmlDrawing" + (e + 1) + ".vml", ke.VML), n[n.length] = ne("legacyDrawing", null, { "r:id": "rId" + m }), o["!legacy"] = m), n.length > 1 && (n[n.length] = "</worksheet>", n[1] = n[1].replace("/>", ">")), n.join("")
  );
}
function Pv(e, t) {
  var r = {}, a = e.l + t;
  r.r = e.read_shift(4), e.l += 4;
  var n = e.read_shift(2);
  e.l += 1;
  var i = e.read_shift(1);
  return e.l = a, i & 7 && (r.level = i & 7), i & 16 && (r.hidden = !0), i & 32 && (r.hpt = n / 20), r;
}
function Mv(e, t, r) {
  var a = z(145), n = (r["!rows"] || [])[e] || {};
  a.write_shift(4, e), a.write_shift(4, 0);
  var i = 320;
  n.hpx ? i = tn(n.hpx) * 20 : n.hpt && (i = n.hpt * 20), a.write_shift(2, i), a.write_shift(1, 0);
  var s = 0;
  n.level && (s |= n.level), n.hidden && (s |= 16), (n.hpx || n.hpt) && (s |= 32), a.write_shift(1, s), a.write_shift(1, 0);
  var c = 0, o = a.l;
  a.l += 4;
  for (var l = { r: e, c: 0 }, f = 0; f < 16; ++f)
    if (!(t.s.c > f + 1 << 10 || t.e.c < f << 10)) {
      for (var d = -1, h = -1, p = f << 10; p < f + 1 << 10; ++p) {
        l.c = p;
        var m = Array.isArray(r) ? (r[l.r] || [])[l.c] : r[me(l)];
        m && (d < 0 && (d = p), h = p);
      }
      d < 0 || (++c, a.write_shift(4, d), a.write_shift(4, h));
    }
  var x = a.l;
  return a.l = o, a.write_shift(4, c), a.l = x, a.length > a.l ? a.slice(0, a.l) : a;
}
function Bv(e, t, r, a) {
  var n = Mv(a, r, t);
  (n.length > 17 || (t["!rows"] || [])[a]) && q(e, 0, n);
}
var Uv = na, Xv = wa;
function Wv() {
}
function Hv(e, t) {
  var r = {}, a = e[e.l];
  return ++e.l, r.above = !(a & 64), r.left = !(a & 128), e.l += 18, r.name = zu(e), r;
}
function Gv(e, t, r) {
  r == null && (r = z(84 + 4 * e.length));
  var a = 192;
  t && (t.above && (a &= -65), t.left && (a &= -129)), r.write_shift(1, a);
  for (var n = 1; n < 3; ++n) r.write_shift(1, 0);
  return Pn({ auto: 1 }, r), r.write_shift(-4, -1), r.write_shift(-4, -1), fo(e, r), r.slice(0, r.l);
}
function Vv(e) {
  var t = qr(e);
  return [t];
}
function zv(e, t, r) {
  return r == null && (r = z(8)), ra(t, r);
}
function Yv(e) {
  var t = ta(e);
  return [t];
}
function jv(e, t, r) {
  return r == null && (r = z(4)), aa(t, r);
}
function Kv(e) {
  var t = qr(e), r = e.read_shift(1);
  return [t, r, "b"];
}
function qv(e, t, r) {
  return r == null && (r = z(9)), ra(t, r), r.write_shift(1, e.v ? 1 : 0), r;
}
function $v(e) {
  var t = ta(e), r = e.read_shift(1);
  return [t, r, "b"];
}
function Jv(e, t, r) {
  return r == null && (r = z(5)), aa(t, r), r.write_shift(1, e.v ? 1 : 0), r;
}
function Zv(e) {
  var t = qr(e), r = e.read_shift(1);
  return [t, r, "e"];
}
function Qv(e, t, r) {
  return r == null && (r = z(9)), ra(t, r), r.write_shift(1, e.v), r;
}
function eg(e) {
  var t = ta(e), r = e.read_shift(1);
  return [t, r, "e"];
}
function rg(e, t, r) {
  return r == null && (r = z(8)), aa(t, r), r.write_shift(1, e.v), r.write_shift(2, 0), r.write_shift(1, 0), r;
}
function tg(e) {
  var t = qr(e), r = e.read_shift(4);
  return [t, r, "s"];
}
function ag(e, t, r) {
  return r == null && (r = z(12)), ra(t, r), r.write_shift(4, t.v), r;
}
function ng(e) {
  var t = ta(e), r = e.read_shift(4);
  return [t, r, "s"];
}
function ig(e, t, r) {
  return r == null && (r = z(8)), aa(t, r), r.write_shift(4, t.v), r;
}
function sg(e) {
  var t = qr(e), r = _r(e);
  return [t, r, "n"];
}
function cg(e, t, r) {
  return r == null && (r = z(16)), ra(t, r), Kt(e.v, r), r;
}
function mf(e) {
  var t = ta(e), r = _r(e);
  return [t, r, "n"];
}
function og(e, t, r) {
  return r == null && (r = z(12)), aa(t, r), Kt(e.v, r), r;
}
function fg(e) {
  var t = qr(e), r = hs(e);
  return [t, r, "n"];
}
function lg(e, t, r) {
  return r == null && (r = z(12)), ra(t, r), lo(e.v, r), r;
}
function ug(e) {
  var t = ta(e), r = hs(e);
  return [t, r, "n"];
}
function hg(e, t, r) {
  return r == null && (r = z(8)), aa(t, r), lo(e.v, r), r;
}
function dg(e) {
  var t = qr(e), r = fs(e);
  return [t, r, "is"];
}
function xg(e) {
  var t = qr(e), r = wr(e);
  return [t, r, "str"];
}
function pg(e, t, r) {
  return r == null && (r = z(12 + 4 * e.v.length)), ra(t, r), lr(e.v, r), r.length > r.l ? r.slice(0, r.l) : r;
}
function mg(e) {
  var t = ta(e), r = wr(e);
  return [t, r, "str"];
}
function vg(e, t, r) {
  return r == null && (r = z(8 + 4 * e.v.length)), aa(t, r), lr(e.v, r), r.length > r.l ? r.slice(0, r.l) : r;
}
function gg(e, t, r) {
  var a = e.l + t, n = qr(e);
  n.r = r["!row"];
  var i = e.read_shift(1), s = [n, i, "b"];
  if (r.cellFormula) {
    e.l += 2;
    var c = Jn(e, a - e.l, r);
    s[3] = gr(c, null, n, r.supbooks, r);
  } else e.l = a;
  return s;
}
function Eg(e, t, r) {
  var a = e.l + t, n = qr(e);
  n.r = r["!row"];
  var i = e.read_shift(1), s = [n, i, "e"];
  if (r.cellFormula) {
    e.l += 2;
    var c = Jn(e, a - e.l, r);
    s[3] = gr(c, null, n, r.supbooks, r);
  } else e.l = a;
  return s;
}
function _g(e, t, r) {
  var a = e.l + t, n = qr(e);
  n.r = r["!row"];
  var i = _r(e), s = [n, i, "n"];
  if (r.cellFormula) {
    e.l += 2;
    var c = Jn(e, a - e.l, r);
    s[3] = gr(c, null, n, r.supbooks, r);
  } else e.l = a;
  return s;
}
function Tg(e, t, r) {
  var a = e.l + t, n = qr(e);
  n.r = r["!row"];
  var i = wr(e), s = [n, i, "str"];
  if (r.cellFormula) {
    e.l += 2;
    var c = Jn(e, a - e.l, r);
    s[3] = gr(c, null, n, r.supbooks, r);
  } else e.l = a;
  return s;
}
var wg = na, yg = wa;
function Sg(e, t) {
  return t == null && (t = z(4)), t.write_shift(4, e), t;
}
function kg(e, t) {
  var r = e.l + t, a = na(e), n = ls(e), i = wr(e), s = wr(e), c = wr(e);
  e.l = r;
  var o = { rfx: a, relId: n, loc: i, display: c };
  return s && (o.Tooltip = s), o;
}
function Fg(e, t) {
  var r = z(50 + 4 * (e[1].Target.length + (e[1].Tooltip || "").length));
  wa({ s: Ye(e[0]), e: Ye(e[0]) }, r), us("rId" + t, r);
  var a = e[1].Target.indexOf("#"), n = a == -1 ? "" : e[1].Target.slice(a + 1);
  return lr(n || "", r), lr(e[1].Tooltip || "", r), lr("", r), r.slice(0, r.l);
}
function Ag() {
}
function Ng(e, t, r) {
  var a = e.l + t, n = uo(e), i = e.read_shift(1), s = [n];
  if (s[2] = i, r.cellFormula) {
    var c = Zm(e, a - e.l, r);
    s[1] = c;
  } else e.l = a;
  return s;
}
function Cg(e, t, r) {
  var a = e.l + t, n = na(e), i = [n];
  if (r.cellFormula) {
    var s = ev(e, a - e.l, r);
    i[1] = s, e.l = a;
  } else e.l = a;
  return i;
}
function Og(e, t, r) {
  r == null && (r = z(18));
  var a = Zn(e, t);
  r.write_shift(-4, e), r.write_shift(-4, e), r.write_shift(4, (a.width || 10) * 256), r.write_shift(
    4,
    0
    /*ixfe*/
  );
  var n = 0;
  return t.hidden && (n |= 1), typeof a.width == "number" && (n |= 2), t.level && (n |= t.level << 8), r.write_shift(2, n), r;
}
var vf = ["left", "right", "top", "bottom", "header", "footer"];
function Ig(e) {
  var t = {};
  return vf.forEach(function(r) {
    t[r] = _r(e);
  }), t;
}
function Lg(e, t) {
  return t == null && (t = z(48)), Vt(e), vf.forEach(function(r) {
    Kt(e[r], t);
  }), t;
}
function Rg(e) {
  var t = e.read_shift(2);
  return e.l += 28, { RTL: t & 32 };
}
function Dg(e, t, r) {
  r == null && (r = z(30));
  var a = 924;
  return (((t || {}).Views || [])[0] || {}).RTL && (a |= 32), r.write_shift(2, a), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(1, 0), r.write_shift(1, 0), r.write_shift(2, 0), r.write_shift(2, 100), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(2, 0), r.write_shift(4, 0), r;
}
function bg(e) {
  var t = z(24);
  return t.write_shift(4, 4), t.write_shift(4, 1), wa(e, t), t;
}
function Pg(e, t) {
  return t == null && (t = z(66)), t.write_shift(2, e.password ? gs(e.password) : 0), t.write_shift(4, 1), [
    ["objects", !1],
    // fObjects
    ["scenarios", !1],
    // fScenarios
    ["formatCells", !0],
    // fFormatCells
    ["formatColumns", !0],
    // fFormatColumns
    ["formatRows", !0],
    // fFormatRows
    ["insertColumns", !0],
    // fInsertColumns
    ["insertRows", !0],
    // fInsertRows
    ["insertHyperlinks", !0],
    // fInsertHyperlinks
    ["deleteColumns", !0],
    // fDeleteColumns
    ["deleteRows", !0],
    // fDeleteRows
    ["selectLockedCells", !1],
    // fSelLockedCells
    ["sort", !0],
    // fSort
    ["autoFilter", !0],
    // fAutoFilter
    ["pivotTables", !0],
    // fPivotTables
    ["selectUnlockedCells", !1]
    // fSelUnlockedCells
  ].forEach(function(r) {
    r[1] ? t.write_shift(4, e[r[0]] != null && !e[r[0]] ? 1 : 0) : t.write_shift(4, e[r[0]] != null && e[r[0]] ? 0 : 1);
  }), t;
}
function Mg() {
}
function Bg() {
}
function Ug(e, t, r, a, n, i, s) {
  if (!e) return e;
  var c = t || {};
  a || (a = { "!id": {} });
  var o = c.dense ? [] : {}, l, f = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, d = !1, h = !1, p, m, x, u, v, E, g, y, N, A = [];
  c.biff = 12, c["!row"] = 0;
  var w = 0, P = !1, L = [], U = {}, M = c.supbooks || /*::(*/
  n.supbooks || [[]];
  if (M.sharedf = U, M.arrayf = L, M.SheetNames = n.SheetNames || n.Sheets.map(function(Le) {
    return Le.name;
  }), !c.supbooks && (c.supbooks = M, n.Names))
    for (var b = 0; b < n.Names.length; ++b) M[0][b + 1] = n.Names[b];
  var K = [], se = [], re = !1;
  an[16] = { n: "BrtShortReal", f: mf };
  var ue;
  if (Tt(e, function(G, xe, ve) {
    if (!h)
      switch (ve) {
        case 148:
          l = G;
          break;
        case 0:
          p = G, c.sheetRows && c.sheetRows <= p.r && (h = !0), y = Ke(u = p.r), c["!row"] = p.r, (G.hidden || G.hpt || G.level != null) && (G.hpt && (G.hpx = ga(G.hpt)), se[G.r] = G);
          break;
        case 2:
        /* 'BrtCellRk' */
        case 3:
        /* 'BrtCellError' */
        case 4:
        /* 'BrtCellBool' */
        case 5:
        /* 'BrtCellReal' */
        case 6:
        /* 'BrtCellSt' */
        case 7:
        /* 'BrtCellIsst' */
        case 8:
        /* 'BrtFmlaString' */
        case 9:
        /* 'BrtFmlaNum' */
        case 10:
        /* 'BrtFmlaBool' */
        case 11:
        /* 'BrtFmlaError' */
        case 13:
        /* 'BrtShortRk' */
        case 14:
        /* 'BrtShortError' */
        case 15:
        /* 'BrtShortBool' */
        case 16:
        /* 'BrtShortReal' */
        case 17:
        /* 'BrtShortSt' */
        case 18:
        /* 'BrtShortIsst' */
        case 62:
          switch (m = { t: G[2] }, G[2]) {
            case "n":
              m.v = G[1];
              break;
            case "s":
              g = Ha[G[1]], m.v = g.t, m.r = g.r;
              break;
            case "b":
              m.v = !!G[1];
              break;
            case "e":
              m.v = G[1], c.cellText !== !1 && (m.w = wt[m.v]);
              break;
            case "str":
              m.t = "s", m.v = G[1];
              break;
            case "is":
              m.t = "s", m.v = G[1].t;
              break;
          }
          if ((x = s.CellXf[G[0].iStyleRef]) && df(m, x.numFmtId, null, c, i, s), v = G[0].c == -1 ? v + 1 : G[0].c, c.dense ? (o[u] || (o[u] = []), o[u][v] = m) : o[He(v) + y] = m, c.cellFormula) {
            for (P = !1, w = 0; w < L.length; ++w) {
              var O = L[w];
              p.r >= O[0].s.r && p.r <= O[0].e.r && v >= O[0].s.c && v <= O[0].e.c && (m.F = _e(O[0]), P = !0);
            }
            !P && G.length > 3 && (m.f = G[3]);
          }
          if (f.s.r > p.r && (f.s.r = p.r), f.s.c > v && (f.s.c = v), f.e.r < p.r && (f.e.r = p.r), f.e.c < v && (f.e.c = v), c.cellDates && x && m.t == "n" && Qt(pe[x.numFmtId])) {
            var B = At(m.v);
            B && (m.t = "d", m.v = new Date(B.y, B.m - 1, B.d, B.H, B.M, B.S, B.u));
          }
          ue && (ue.type == "XLDAPR" && (m.D = !0), ue = void 0);
          break;
        case 1:
        /* 'BrtCellBlank' */
        case 12:
          if (!c.sheetStubs || d) break;
          m = { t: "z", v: void 0 }, v = G[0].c == -1 ? v + 1 : G[0].c, c.dense ? (o[u] || (o[u] = []), o[u][v] = m) : o[He(v) + y] = m, f.s.r > p.r && (f.s.r = p.r), f.s.c > v && (f.s.c = v), f.e.r < p.r && (f.e.r = p.r), f.e.c < v && (f.e.c = v), ue && (ue.type == "XLDAPR" && (m.D = !0), ue = void 0);
          break;
        case 176:
          A.push(G);
          break;
        case 49:
          ue = ((c.xlmeta || {}).Cell || [])[G - 1];
          break;
        case 494:
          var R = a["!id"][G.relId];
          for (R ? (G.Target = R.Target, G.loc && (G.Target += "#" + G.loc), G.Rel = R) : G.relId == "" && (G.Target = "#" + G.loc), u = G.rfx.s.r; u <= G.rfx.e.r; ++u) for (v = G.rfx.s.c; v <= G.rfx.e.c; ++v)
            c.dense ? (o[u] || (o[u] = []), o[u][v] || (o[u][v] = { t: "z", v: void 0 }), o[u][v].l = G) : (E = me({ c: v, r: u }), o[E] || (o[E] = { t: "z", v: void 0 }), o[E].l = G);
          break;
        case 426:
          if (!c.cellFormula) break;
          L.push(G), N = c.dense ? o[u][v] : o[He(v) + y], N.f = gr(G[1], f, { r: p.r, c: v }, M, c), N.F = _e(G[0]);
          break;
        case 427:
          if (!c.cellFormula) break;
          U[me(G[0].s)] = G[1], N = c.dense ? o[u][v] : o[He(v) + y], N.f = gr(G[1], f, { r: p.r, c: v }, M, c);
          break;
        /* identical to 'ColInfo' in XLS */
        case 60:
          if (!c.cellStyles) break;
          for (; G.e >= G.s; )
            K[G.e--] = { width: G.w / 256, hidden: !!(G.flags & 1), level: G.level }, re || (re = !0, Es(G.w / 256)), It(K[G.e + 1]);
          break;
        case 161:
          o["!autofilter"] = { ref: _e(G) };
          break;
        case 476:
          o["!margins"] = G;
          break;
        case 147:
          n.Sheets[r] || (n.Sheets[r] = {}), G.name && (n.Sheets[r].CodeName = G.name), (G.above || G.left) && (o["!outline"] = { above: G.above, left: G.left });
          break;
        case 137:
          n.Views || (n.Views = [{}]), n.Views[0] || (n.Views[0] = {}), G.RTL && (n.Views[0].RTL = !0);
          break;
        case 485:
          break;
        case 64:
        /* 'BrtDVal' */
        case 1053:
          break;
        case 151:
          break;
        case 152:
        /* 'BrtSel' */
        case 175:
        /* 'BrtAFilterDateGroupItem' */
        case 644:
        /* 'BrtActiveX' */
        case 625:
        /* 'BrtBigName' */
        case 562:
        /* 'BrtBkHim' */
        case 396:
        /* 'BrtBrk' */
        case 1112:
        /* 'BrtCFIcon' */
        case 1146:
        /* 'BrtCFRuleExt' */
        case 471:
        /* 'BrtCFVO' */
        case 1050:
        /* 'BrtCFVO14' */
        case 649:
        /* 'BrtCellIgnoreEC' */
        case 1105:
        /* 'BrtCellIgnoreEC14' */
        case 589:
        /* 'BrtCellSmartTagProperty' */
        case 607:
        /* 'BrtCellWatch' */
        case 564:
        /* 'BrtColor' */
        case 1055:
        /* 'BrtColor14' */
        case 168:
        /* 'BrtColorFilter' */
        case 174:
        /* 'BrtCustomFilter' */
        case 1180:
        /* 'BrtCustomFilter14' */
        case 499:
        /* 'BrtDRef' */
        case 507:
        /* 'BrtDXF' */
        case 550:
        /* 'BrtDrawing' */
        case 171:
        /* 'BrtDynamicFilter' */
        case 167:
        /* 'BrtFilter' */
        case 1177:
        /* 'BrtFilter14' */
        case 169:
        /* 'BrtIconFilter' */
        case 1181:
        /* 'BrtIconFilter14' */
        case 551:
        /* 'BrtLegacyDrawing' */
        case 552:
        /* 'BrtLegacyDrawingHF' */
        case 661:
        /* 'BrtListPart' */
        case 639:
        /* 'BrtOleObject' */
        case 478:
        /* 'BrtPageSetup' */
        case 537:
        /* 'BrtPhoneticInfo' */
        case 477:
        /* 'BrtPrintOptions' */
        case 536:
        /* 'BrtRangeProtection' */
        case 1103:
        /* 'BrtRangeProtection14' */
        case 680:
        /* 'BrtRangeProtectionIso' */
        case 1104:
        /* 'BrtRangeProtectionIso14' */
        case 1024:
        /* 'BrtRwDescent' */
        case 663:
        /* 'BrtSheetCalcProp' */
        case 535:
        /* 'BrtSheetProtection' */
        case 678:
        /* 'BrtSheetProtectionIso' */
        case 504:
        /* 'BrtSlc' */
        case 1043:
        /* 'BrtSparkline' */
        case 428:
        /* 'BrtTable' */
        case 170:
        /* 'BrtTop10Filter' */
        case 3072:
        /* 'BrtUid' */
        case 50:
        /* 'BrtValueMeta' */
        case 2070:
        /* 'BrtWebExtension' */
        case 1045:
          break;
        case 35:
          d = !0;
          break;
        case 36:
          d = !1;
          break;
        case 37:
          d = !0;
          break;
        case 38:
          d = !1;
          break;
        default:
          if (!xe.T) {
            if (!d || c.WTF) throw new Error("Unexpected record 0x" + ve.toString(16));
          }
      }
  }, c), delete c.supbooks, delete c["!row"], !o["!ref"] && (f.s.r < 2e6 || l && (l.e.r > 0 || l.e.c > 0 || l.s.r > 0 || l.s.c > 0)) && (o["!ref"] = _e(l || f)), c.sheetRows && o["!ref"]) {
    var oe = Ae(o["!ref"]);
    c.sheetRows <= +oe.e.r && (oe.e.r = c.sheetRows - 1, oe.e.r > f.e.r && (oe.e.r = f.e.r), oe.e.r < oe.s.r && (oe.s.r = oe.e.r), oe.e.c > f.e.c && (oe.e.c = f.e.c), oe.e.c < oe.s.c && (oe.s.c = oe.e.c), o["!fullref"] = o["!ref"], o["!ref"] = _e(oe));
  }
  return A.length > 0 && (o["!merges"] = A), K.length > 0 && (o["!cols"] = K), se.length > 0 && (o["!rows"] = se), o;
}
function Xg(e, t, r, a, n, i, s) {
  if (t.v === void 0) return !1;
  var c = "";
  switch (t.t) {
    case "b":
      c = t.v ? "1" : "0";
      break;
    case "d":
      t = Ue(t), t.z = t.z || pe[14], t.v = sr(Ge(t.v)), t.t = "n";
      break;
    /* falls through */
    case "n":
    case "e":
      c = "" + t.v;
      break;
    default:
      c = t.v;
      break;
  }
  var o = { r, c: a };
  switch (o.s = Pt(n.cellXfs, t, n), t.l && i["!links"].push([me(o), t.l]), t.c && i["!comments"].push([me(o), t.c]), t.t) {
    case "s":
    case "str":
      return n.bookSST ? (c = Ss(n.Strings, t.v, n.revStrings), o.t = "s", o.v = c, s ? q(e, 18, ig(t, o)) : q(e, 7, ag(t, o))) : (o.t = "str", s ? q(e, 17, vg(t, o)) : q(e, 6, pg(t, o))), !0;
    case "n":
      return t.v == (t.v | 0) && t.v > -1e3 && t.v < 1e3 ? s ? q(e, 13, hg(t, o)) : q(e, 2, lg(t, o)) : s ? q(e, 16, og(t, o)) : q(e, 5, cg(t, o)), !0;
    case "b":
      return o.t = "b", s ? q(e, 15, Jv(t, o)) : q(e, 4, qv(t, o)), !0;
    case "e":
      return o.t = "e", s ? q(e, 14, rg(t, o)) : q(e, 3, Qv(t, o)), !0;
  }
  return s ? q(e, 12, jv(t, o)) : q(e, 1, zv(t, o)), !0;
}
function Wg(e, t, r, a) {
  var n = Ae(t["!ref"] || "A1"), i, s = "", c = [];
  q(
    e,
    145
    /* BrtBeginSheetData */
  );
  var o = Array.isArray(t), l = n.e.r;
  t["!rows"] && (l = Math.max(n.e.r, t["!rows"].length - 1));
  for (var f = n.s.r; f <= l; ++f) {
    s = Ke(f), Bv(e, t, n, f);
    var d = !1;
    if (f <= n.e.r) for (var h = n.s.c; h <= n.e.c; ++h) {
      f === n.s.r && (c[h] = He(h)), i = c[h] + s;
      var p = o ? (t[f] || [])[h] : t[i];
      if (!p) {
        d = !1;
        continue;
      }
      d = Xg(e, p, f, h, a, t, d);
    }
  }
  q(
    e,
    146
    /* BrtEndSheetData */
  );
}
function Hg(e, t) {
  !t || !t["!merges"] || (q(e, 177, Sg(t["!merges"].length)), t["!merges"].forEach(function(r) {
    q(e, 176, yg(r));
  }), q(
    e,
    178
    /* BrtEndMergeCells */
  ));
}
function Gg(e, t) {
  !t || !t["!cols"] || (q(
    e,
    390
    /* BrtBeginColInfos */
  ), t["!cols"].forEach(function(r, a) {
    r && q(e, 60, Og(a, r));
  }), q(
    e,
    391
    /* BrtEndColInfos */
  ));
}
function Vg(e, t) {
  !t || !t["!ref"] || (q(
    e,
    648
    /* BrtBeginCellIgnoreECs */
  ), q(e, 649, bg(Ae(t["!ref"]))), q(
    e,
    650
    /* BrtEndCellIgnoreECs */
  ));
}
function zg(e, t, r) {
  t["!links"].forEach(function(a) {
    if (a[1].Target) {
      var n = be(r, -1, a[1].Target.replace(/#.*$/, ""), ke.HLINK);
      q(e, 494, Fg(a, n));
    }
  }), delete t["!links"];
}
function Yg(e, t, r, a) {
  if (t["!comments"].length > 0) {
    var n = be(a, -1, "../drawings/vmlDrawing" + (r + 1) + ".vml", ke.VML);
    q(e, 551, us("rId" + n)), t["!legacy"] = n;
  }
}
function jg(e, t, r, a) {
  if (t["!autofilter"]) {
    var n = t["!autofilter"], i = typeof n.ref == "string" ? n.ref : _e(n.ref);
    r.Workbook || (r.Workbook = { Sheets: [] }), r.Workbook.Names || (r.Workbook.Names = []);
    var s = r.Workbook.Names, c = Cr(i);
    c.s.r == c.e.r && (c.e.r = Cr(t["!ref"]).e.r, i = _e(c));
    for (var o = 0; o < s.length; ++o) {
      var l = s[o];
      if (l.Name == "_xlnm._FilterDatabase" && l.Sheet == a) {
        l.Ref = "'" + r.SheetNames[a] + "'!" + i;
        break;
      }
    }
    o == s.length && s.push({ Name: "_xlnm._FilterDatabase", Sheet: a, Ref: "'" + r.SheetNames[a] + "'!" + i }), q(e, 161, wa(Ae(i))), q(
      e,
      162
      /* BrtEndAFilter */
    );
  }
}
function Kg(e, t, r) {
  q(
    e,
    133
    /* BrtBeginWsViews */
  ), q(e, 137, Dg(t, r)), q(
    e,
    138
    /* BrtEndWsView */
  ), q(
    e,
    134
    /* BrtEndWsViews */
  );
}
function qg(e, t) {
  t["!protect"] && q(e, 535, Pg(t["!protect"]));
}
function $g(e, t, r, a) {
  var n = Ir(), i = r.SheetNames[e], s = r.Sheets[i] || {}, c = i;
  try {
    r && r.Workbook && (c = r.Workbook.Sheets[e].CodeName || c);
  } catch {
  }
  var o = Ae(s["!ref"] || "A1");
  if (o.e.c > 16383 || o.e.r > 1048575) {
    if (t.WTF) throw new Error("Range " + (s["!ref"] || "A1") + " exceeds format limit A1:XFD1048576");
    o.e.c = Math.min(o.e.c, 16383), o.e.r = Math.min(o.e.c, 1048575);
  }
  return s["!links"] = [], s["!comments"] = [], q(
    n,
    129
    /* BrtBeginSheet */
  ), (r.vbaraw || s["!outline"]) && q(n, 147, Gv(c, s["!outline"])), q(n, 148, Xv(o)), Kg(n, s, r.Workbook), Gg(n, s), Wg(n, s, e, t), qg(n, s), jg(n, s, r, e), Hg(n, s), zg(n, s, a), s["!margins"] && q(n, 476, Lg(s["!margins"])), (!t || t.ignoreEC || t.ignoreEC == null) && Vg(n, s), Yg(n, s, e, a), q(
    n,
    130
    /* BrtEndSheet */
  ), n.end();
}
function Jg(e) {
  var t = [], r = e.match(/^<c:numCache>/), a;
  (e.match(/<c:pt idx="(\d*)">(.*?)<\/c:pt>/mg) || []).forEach(function(i) {
    var s = i.match(/<c:pt idx="(\d*?)"><c:v>(.*)<\/c:v><\/c:pt>/);
    s && (t[+s[1]] = r ? +s[2] : s[2]);
  });
  var n = Ie((e.match(/<c:formatCode>([\s\S]*?)<\/c:formatCode>/) || ["", "General"])[1]);
  return (e.match(/<c:f>(.*?)<\/c:f>/mg) || []).forEach(function(i) {
    a = i.replace(/<.*?>/g, "");
  }), [t, n, a];
}
function Zg(e, t, r, a, n, i) {
  var s = i || { "!type": "chart" };
  if (!e) return i;
  var c = 0, o = 0, l = "A", f = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } };
  return (e.match(/<c:numCache>[\s\S]*?<\/c:numCache>/gm) || []).forEach(function(d) {
    var h = Jg(d);
    f.s.r = f.s.c = 0, f.e.c = c, l = He(c), h[0].forEach(function(p, m) {
      s[l + Ke(m)] = { t: "n", v: p, z: h[1] }, o = m;
    }), f.e.r < o && (f.e.r = o), ++c;
  }), c > 0 && (s["!ref"] = _e(f)), s;
}
function Qg(e, t, r, a, n) {
  if (!e) return e;
  a || (a = { "!id": {} });
  var i = { "!type": "chart", "!drawel": null, "!rel": "" }, s, c = e.match(xf);
  return c && ks(c[0], i, n, r), (s = e.match(/drawing r:id="(.*?)"/)) && (i["!rel"] = s[1]), a["!id"][i["!rel"]] && (i["!drawel"] = a["!id"][i["!rel"]]), i;
}
function eE(e, t) {
  e.l += 10;
  var r = wr(e);
  return { name: r };
}
function rE(e, t, r, a, n) {
  if (!e) return e;
  a || (a = { "!id": {} });
  var i = { "!type": "chart", "!drawel": null, "!rel": "" }, s = !1;
  return Tt(e, function(o, l, f) {
    switch (f) {
      case 550:
        i["!rel"] = o;
        break;
      case 651:
        n.Sheets[r] || (n.Sheets[r] = {}), o.name && (n.Sheets[r].CodeName = o.name);
        break;
      case 562:
      /* 'BrtBkHim' */
      case 652:
      /* 'BrtCsPageSetup' */
      case 669:
      /* 'BrtCsProtection' */
      case 679:
      /* 'BrtCsProtectionIso' */
      case 551:
      /* 'BrtLegacyDrawing' */
      case 552:
      /* 'BrtLegacyDrawingHF' */
      case 476:
      /* 'BrtMargins' */
      case 3072:
        break;
      case 35:
        s = !0;
        break;
      case 36:
        s = !1;
        break;
      case 37:
        break;
      case 38:
        break;
      default:
        if (!(l.T > 0)) {
          if (!(l.T < 0)) {
            if (!s || t.WTF) throw new Error("Unexpected record 0x" + f.toString(16));
          }
        }
    }
  }, t), a["!id"][i["!rel"]] && (i["!drawel"] = a["!id"][i["!rel"]]), i;
}
var Fs = [
  ["allowRefreshQuery", !1, "bool"],
  ["autoCompressPictures", !0, "bool"],
  ["backupFile", !1, "bool"],
  ["checkCompatibility", !1, "bool"],
  ["CodeName", ""],
  ["date1904", !1, "bool"],
  ["defaultThemeVersion", 0, "int"],
  ["filterPrivacy", !1, "bool"],
  ["hidePivotFieldList", !1, "bool"],
  ["promptedSolutions", !1, "bool"],
  ["publishItems", !1, "bool"],
  ["refreshAllConnections", !1, "bool"],
  ["saveExternalLinkValues", !0, "bool"],
  ["showBorderUnselectedTables", !0, "bool"],
  ["showInkAnnotation", !0, "bool"],
  ["showObjects", "all"],
  ["showPivotChartFilter", !1, "bool"],
  ["updateLinks", "userSet"]
], tE = [
  ["activeTab", 0, "int"],
  ["autoFilterDateGrouping", !0, "bool"],
  ["firstSheet", 0, "int"],
  ["minimized", !1, "bool"],
  ["showHorizontalScroll", !0, "bool"],
  ["showSheetTabs", !0, "bool"],
  ["showVerticalScroll", !0, "bool"],
  ["tabRatio", 600, "int"],
  ["visibility", "visible"]
  //window{Height,Width}, {x,y}Window
], aE = [
  //['state', 'visible']
], nE = [
  ["calcCompleted", "true"],
  ["calcMode", "auto"],
  ["calcOnSave", "true"],
  ["concurrentCalc", "true"],
  ["fullCalcOnLoad", "false"],
  ["fullPrecision", "true"],
  ["iterate", "false"],
  ["iterateCount", "100"],
  ["iterateDelta", "0.001"],
  ["refMode", "A1"]
];
function ic(e, t) {
  for (var r = 0; r != e.length; ++r)
    for (var a = e[r], n = 0; n != t.length; ++n) {
      var i = t[n];
      if (a[i[0]] == null) a[i[0]] = i[1];
      else switch (i[2]) {
        case "bool":
          typeof a[i[0]] == "string" && (a[i[0]] = We(a[i[0]]));
          break;
        case "int":
          typeof a[i[0]] == "string" && (a[i[0]] = parseInt(a[i[0]], 10));
          break;
      }
    }
}
function sc(e, t) {
  for (var r = 0; r != t.length; ++r) {
    var a = t[r];
    if (e[a[0]] == null) e[a[0]] = a[1];
    else switch (a[2]) {
      case "bool":
        typeof e[a[0]] == "string" && (e[a[0]] = We(e[a[0]]));
        break;
      case "int":
        typeof e[a[0]] == "string" && (e[a[0]] = parseInt(e[a[0]], 10));
        break;
    }
  }
}
function gf(e) {
  sc(e.WBProps, Fs), sc(e.CalcPr, nE), ic(e.WBView, tE), ic(e.Sheets, aE), pa.date1904 = We(e.WBProps.date1904);
}
function iE(e) {
  return !e.Workbook || !e.Workbook.WBProps ? "false" : We(e.Workbook.WBProps.date1904) ? "true" : "false";
}
var sE = /* @__PURE__ */ "][*?/\\".split("");
function Ef(e, t) {
  if (e.length > 31)
    throw new Error("Sheet names cannot exceed 31 chars");
  var r = !0;
  return sE.forEach(function(a) {
    if (e.indexOf(a) != -1)
      throw new Error("Sheet name cannot contain : \\ / ? * [ ]");
  }), r;
}
function cE(e, t, r) {
  e.forEach(function(a, n) {
    Ef(a);
    for (var i = 0; i < n; ++i) if (a == e[i]) throw new Error("Duplicate Sheet Name: " + a);
    if (r) {
      var s = t && t[n] && t[n].CodeName || a;
      if (s.charCodeAt(0) == 95 && s.length > 22) throw new Error("Bad Code Name: Worksheet" + s);
    }
  });
}
function _f(e) {
  if (!e || !e.SheetNames || !e.Sheets) throw new Error("Invalid Workbook");
  if (!e.SheetNames.length) throw new Error("Workbook is empty");
  var t = e.Workbook && e.Workbook.Sheets || [];
  cE(e.SheetNames, t, !!e.vbaraw);
  for (var r = 0; r < e.SheetNames.length; ++r) iv(e.Sheets[e.SheetNames[r]], e.SheetNames[r], r);
}
var oE = /<\w+:workbook/;
function fE(e, t) {
  if (!e) throw new Error("Could not find file");
  var r = (
    /*::(*/
    { AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, Names: [], xmlns: "" }
  ), a = !1, n = "xmlns", i = {}, s = 0;
  if (e.replace(Sr, function(o, l) {
    var f = ge(o);
    switch (lt(f[0])) {
      case "<?xml":
        break;
      /* 18.2.27 workbook CT_Workbook 1 */
      case "<workbook":
        o.match(oE) && (n = "xmlns" + o.match(/<(\w+):/)[1]), r.xmlns = f[n];
        break;
      case "</workbook>":
        break;
      /* 18.2.13 fileVersion CT_FileVersion ? */
      case "<fileVersion":
        delete f[0], r.AppVersion = f;
        break;
      case "<fileVersion/>":
      case "</fileVersion>":
        break;
      /* 18.2.12 fileSharing CT_FileSharing ? */
      case "<fileSharing":
        break;
      case "<fileSharing/>":
        break;
      /* 18.2.28 workbookPr CT_WorkbookPr ? */
      case "<workbookPr":
      case "<workbookPr/>":
        Fs.forEach(function(d) {
          if (f[d[0]] != null)
            switch (d[2]) {
              case "bool":
                r.WBProps[d[0]] = We(f[d[0]]);
                break;
              case "int":
                r.WBProps[d[0]] = parseInt(f[d[0]], 10);
                break;
              default:
                r.WBProps[d[0]] = f[d[0]];
            }
        }), f.codeName && (r.WBProps.CodeName = Me(f.codeName));
        break;
      case "</workbookPr>":
        break;
      /* 18.2.29 workbookProtection CT_WorkbookProtection ? */
      case "<workbookProtection":
        break;
      case "<workbookProtection/>":
        break;
      /* 18.2.1  bookViews CT_BookViews ? */
      case "<bookViews":
      case "<bookViews>":
      case "</bookViews>":
        break;
      /* 18.2.30   workbookView CT_BookView + */
      case "<workbookView":
      case "<workbookView/>":
        delete f[0], r.WBView.push(f);
        break;
      case "</workbookView>":
        break;
      /* 18.2.20 sheets CT_Sheets 1 */
      case "<sheets":
      case "<sheets>":
      case "</sheets>":
        break;
      // aggregate sheet
      /* 18.2.19   sheet CT_Sheet + */
      case "<sheet":
        switch (f.state) {
          case "hidden":
            f.Hidden = 1;
            break;
          case "veryHidden":
            f.Hidden = 2;
            break;
          default:
            f.Hidden = 0;
        }
        delete f.state, f.name = Ie(Me(f.name)), delete f[0], r.Sheets.push(f);
        break;
      case "</sheet>":
        break;
      /* 18.2.15 functionGroups CT_FunctionGroups ? */
      case "<functionGroups":
      case "<functionGroups/>":
        break;
      /* 18.2.14   functionGroup CT_FunctionGroup + */
      case "<functionGroup":
        break;
      /* 18.2.9  externalReferences CT_ExternalReferences ? */
      case "<externalReferences":
      case "</externalReferences>":
      case "<externalReferences>":
        break;
      /* 18.2.8    externalReference CT_ExternalReference + */
      case "<externalReference":
        break;
      /* 18.2.6  definedNames CT_DefinedNames ? */
      case "<definedNames/>":
        break;
      case "<definedNames>":
      case "<definedNames":
        a = !0;
        break;
      case "</definedNames>":
        a = !1;
        break;
      /* 18.2.5    definedName CT_DefinedName + */
      case "<definedName":
        i = {}, i.Name = Me(f.name), f.comment && (i.Comment = f.comment), f.localSheetId && (i.Sheet = +f.localSheetId), We(f.hidden || "0") && (i.Hidden = !0), s = l + o.length;
        break;
      case "</definedName>":
        i.Ref = Ie(Me(e.slice(s, l))), r.Names.push(i);
        break;
      case "<definedName/>":
        break;
      /* 18.2.2  calcPr CT_CalcPr ? */
      case "<calcPr":
        delete f[0], r.CalcPr = f;
        break;
      case "<calcPr/>":
        delete f[0], r.CalcPr = f;
        break;
      case "</calcPr>":
        break;
      /* 18.2.16 oleSize CT_OleSize ? (ref required) */
      case "<oleSize":
        break;
      /* 18.2.4  customWorkbookViews CT_CustomWorkbookViews ? */
      case "<customWorkbookViews>":
      case "</customWorkbookViews>":
      case "<customWorkbookViews":
        break;
      /* 18.2.3  customWorkbookView CT_CustomWorkbookView + */
      case "<customWorkbookView":
      case "</customWorkbookView>":
        break;
      /* 18.2.18 pivotCaches CT_PivotCaches ? */
      case "<pivotCaches>":
      case "</pivotCaches>":
      case "<pivotCaches":
        break;
      /* 18.2.17 pivotCache CT_PivotCache ? */
      case "<pivotCache":
        break;
      /* 18.2.21 smartTagPr CT_SmartTagPr ? */
      case "<smartTagPr":
      case "<smartTagPr/>":
        break;
      /* 18.2.23 smartTagTypes CT_SmartTagTypes ? */
      case "<smartTagTypes":
      case "<smartTagTypes>":
      case "</smartTagTypes>":
        break;
      /* 18.2.22 smartTagType CT_SmartTagType ? */
      case "<smartTagType":
        break;
      /* 18.2.24 webPublishing CT_WebPublishing ? */
      case "<webPublishing":
      case "<webPublishing/>":
        break;
      /* 18.2.11 fileRecoveryPr CT_FileRecoveryPr ? */
      case "<fileRecoveryPr":
      case "<fileRecoveryPr/>":
        break;
      /* 18.2.26 webPublishObjects CT_WebPublishObjects ? */
      case "<webPublishObjects>":
      case "<webPublishObjects":
      case "</webPublishObjects>":
        break;
      /* 18.2.25 webPublishObject CT_WebPublishObject ? */
      case "<webPublishObject":
        break;
      /* 18.2.10 extLst CT_ExtensionList ? */
      case "<extLst":
      case "<extLst>":
      case "</extLst>":
      case "<extLst/>":
        break;
      /* 18.2.7  ext CT_Extension + */
      case "<ext":
        a = !0;
        break;
      //TODO: check with versions of excel
      case "</ext>":
        a = !1;
        break;
      /* Others */
      case "<ArchID":
        break;
      case "<AlternateContent":
      case "<AlternateContent>":
        a = !0;
        break;
      case "</AlternateContent>":
        a = !1;
        break;
      /* TODO */
      case "<revisionPtr":
        break;
      default:
        if (!a && t.WTF) throw new Error("unrecognized " + f[0] + " in workbook");
    }
    return o;
  }), ea.indexOf(r.xmlns) === -1) throw new Error("Unknown Namespace: " + r.xmlns);
  return gf(r), r;
}
function Tf(e) {
  var t = [er];
  t[t.length] = ne("workbook", null, {
    xmlns: ea[0],
    //'xmlns:mx': XMLNS.mx,
    //'xmlns:s': XMLNS_main[0],
    "xmlns:r": ir.r
  });
  var r = e.Workbook && (e.Workbook.Names || []).length > 0, a = { codeName: "ThisWorkbook" };
  e.Workbook && e.Workbook.WBProps && (Fs.forEach(function(c) {
    e.Workbook.WBProps[c[0]] != null && e.Workbook.WBProps[c[0]] != c[1] && (a[c[0]] = e.Workbook.WBProps[c[0]]);
  }), e.Workbook.WBProps.CodeName && (a.codeName = e.Workbook.WBProps.CodeName, delete a.CodeName)), t[t.length] = ne("workbookPr", null, a);
  var n = e.Workbook && e.Workbook.Sheets || [], i = 0;
  if (n && n[0] && n[0].Hidden) {
    for (t[t.length] = "<bookViews>", i = 0; i != e.SheetNames.length && !(!n[i] || !n[i].Hidden); ++i)
      ;
    i == e.SheetNames.length && (i = 0), t[t.length] = '<workbookView firstSheet="' + i + '" activeTab="' + i + '"/>', t[t.length] = "</bookViews>";
  }
  for (t[t.length] = "<sheets>", i = 0; i != e.SheetNames.length; ++i) {
    var s = { name: Pe(e.SheetNames[i].slice(0, 31)) };
    if (s.sheetId = "" + (i + 1), s["r:id"] = "rId" + (i + 1), n[i]) switch (n[i].Hidden) {
      case 1:
        s.state = "hidden";
        break;
      case 2:
        s.state = "veryHidden";
        break;
    }
    t[t.length] = ne("sheet", null, s);
  }
  return t[t.length] = "</sheets>", r && (t[t.length] = "<definedNames>", e.Workbook && e.Workbook.Names && e.Workbook.Names.forEach(function(c) {
    var o = { name: c.Name };
    c.Comment && (o.comment = c.Comment), c.Sheet != null && (o.localSheetId = "" + c.Sheet), c.Hidden && (o.hidden = "1"), c.Ref && (t[t.length] = ne("definedName", Pe(c.Ref), o));
  }), t[t.length] = "</definedNames>"), t.length > 2 && (t[t.length] = "</workbook>", t[1] = t[1].replace("/>", ">")), t.join("");
}
function lE(e, t) {
  var r = {};
  return r.Hidden = e.read_shift(4), r.iTabID = e.read_shift(4), r.strRelID = Ri(e), r.name = wr(e), r;
}
function uE(e, t) {
  return t || (t = z(127)), t.write_shift(4, e.Hidden), t.write_shift(4, e.iTabID), us(e.strRelID, t), lr(e.name.slice(0, 31), t), t.length > t.l ? t.slice(0, t.l) : t;
}
function hE(e, t) {
  var r = {}, a = e.read_shift(4);
  r.defaultThemeVersion = e.read_shift(4);
  var n = t > 8 ? wr(e) : "";
  return n.length > 0 && (r.CodeName = n), r.autoCompressPictures = !!(a & 65536), r.backupFile = !!(a & 64), r.checkCompatibility = !!(a & 4096), r.date1904 = !!(a & 1), r.filterPrivacy = !!(a & 8), r.hidePivotFieldList = !!(a & 1024), r.promptedSolutions = !!(a & 16), r.publishItems = !!(a & 2048), r.refreshAllConnections = !!(a & 262144), r.saveExternalLinkValues = !!(a & 128), r.showBorderUnselectedTables = !!(a & 4), r.showInkAnnotation = !!(a & 32), r.showObjects = ["all", "placeholders", "none"][a >> 13 & 3], r.showPivotChartFilter = !!(a & 32768), r.updateLinks = ["userSet", "never", "always"][a >> 8 & 3], r;
}
function dE(e, t) {
  t || (t = z(72));
  var r = 0;
  return e && e.filterPrivacy && (r |= 8), t.write_shift(4, r), t.write_shift(4, 0), fo(e && e.CodeName || "ThisWorkbook", t), t.slice(0, t.l);
}
function xE(e, t) {
  var r = {};
  return e.read_shift(4), r.ArchID = e.read_shift(4), e.l += t - 8, r;
}
function pE(e, t, r) {
  var a = e.l + t;
  e.l += 4, e.l += 1;
  var n = e.read_shift(4), i = Yu(e), s = Qm(e, 0, r), c = ls(e);
  e.l = a;
  var o = { Name: i, Ptg: s };
  return n < 268435455 && (o.Sheet = n), c && (o.Comment = c), o;
}
function mE(e, t) {
  var r = { AppVersion: {}, WBProps: {}, WBView: [], Sheets: [], CalcPr: {}, xmlns: "" }, a = [], n = !1;
  t || (t = {}), t.biff = 12;
  var i = [], s = [[]];
  return s.SheetNames = [], s.XTI = [], an[16] = { n: "BrtFRTArchID$", f: xE }, Tt(e, function(o, l, f) {
    switch (f) {
      case 156:
        s.SheetNames.push(o.name), r.Sheets.push(o);
        break;
      case 153:
        r.WBProps = o;
        break;
      case 39:
        o.Sheet != null && (t.SID = o.Sheet), o.Ref = gr(o.Ptg, null, null, s, t), delete t.SID, delete o.Ptg, i.push(o);
        break;
      case 1036:
        break;
      case 357:
      /* 'BrtSupSelf' */
      case 358:
      /* 'BrtSupSame' */
      case 355:
      /* 'BrtSupBookSrc' */
      case 667:
        s[0].length ? s.push([f, o]) : s[0] = [f, o], s[s.length - 1].XTI = [];
        break;
      case 362:
        s.length === 0 && (s[0] = [], s[0].XTI = []), s[s.length - 1].XTI = s[s.length - 1].XTI.concat(o), s.XTI = s.XTI.concat(o);
        break;
      case 361:
        break;
      case 2071:
      /* 'BrtAbsPath15' */
      case 158:
      /* 'BrtBookView' */
      case 143:
      /* 'BrtBeginBundleShs' */
      case 664:
      /* 'BrtBeginFnGroup' */
      case 353:
        break;
      /* case 'BrtModelTimeGroupingCalcCol' */
      case 3072:
      /* 'BrtUid' */
      case 3073:
      /* 'BrtRevisionPtr' */
      case 534:
      /* 'BrtBookProtection' */
      case 677:
      /* 'BrtBookProtectionIso' */
      case 157:
      /* 'BrtCalcProp' */
      case 610:
      /* 'BrtCrashRecErr' */
      case 2050:
      /* 'BrtDecoupledPivotCacheID' */
      case 155:
      /* 'BrtFileRecover' */
      case 548:
      /* 'BrtFileSharing' */
      case 676:
      /* 'BrtFileSharingIso' */
      case 128:
      /* 'BrtFileVersion' */
      case 665:
      /* 'BrtFnGroup' */
      case 2128:
      /* 'BrtModelRelationship' */
      case 2125:
      /* 'BrtModelTable' */
      case 549:
      /* 'BrtOleSize' */
      case 2053:
      /* 'BrtPivotTableRef' */
      case 596:
      /* 'BrtSmartTagType' */
      case 2076:
      /* 'BrtTableSlicerCacheID' */
      case 2075:
      /* 'BrtTableSlicerCacheIDs' */
      case 2082:
      /* 'BrtTimelineCachePivotCacheID' */
      case 397:
      /* 'BrtUserBookView' */
      case 154:
      /* 'BrtWbFactoid' */
      case 1117:
      /* 'BrtWbProp14' */
      case 553:
      /* 'BrtWebOpt' */
      case 2091:
        break;
      case 35:
        a.push(f), n = !0;
        break;
      case 36:
        a.pop(), n = !1;
        break;
      case 37:
        a.push(f), n = !0;
        break;
      case 38:
        a.pop(), n = !1;
        break;
      case 16:
        break;
      default:
        if (!l.T) {
          if (!n || t.WTF && a[a.length - 1] != 37 && a[a.length - 1] != 35) throw new Error("Unexpected record 0x" + f.toString(16));
        }
    }
  }, t), gf(r), r.Names = i, r.supbooks = s, r;
}
function vE(e, t) {
  q(
    e,
    143
    /* BrtBeginBundleShs */
  );
  for (var r = 0; r != t.SheetNames.length; ++r) {
    var a = t.Workbook && t.Workbook.Sheets && t.Workbook.Sheets[r] && t.Workbook.Sheets[r].Hidden || 0, n = { Hidden: a, iTabID: r + 1, strRelID: "rId" + (r + 1), name: t.SheetNames[r] };
    q(e, 156, uE(n));
  }
  q(
    e,
    144
    /* BrtEndBundleShs */
  );
}
function gE(e, t) {
  t || (t = z(127));
  for (var r = 0; r != 4; ++r) t.write_shift(4, 0);
  return lr("SheetJS", t), lr(Ya.version, t), lr(Ya.version, t), lr("7262", t), t.length > t.l ? t.slice(0, t.l) : t;
}
function EE(e, t) {
  t || (t = z(29)), t.write_shift(-4, 0), t.write_shift(-4, 460), t.write_shift(4, 28800), t.write_shift(4, 17600), t.write_shift(4, 500), t.write_shift(4, e), t.write_shift(4, e);
  var r = 120;
  return t.write_shift(1, r), t.length > t.l ? t.slice(0, t.l) : t;
}
function _E(e, t) {
  if (!(!t.Workbook || !t.Workbook.Sheets)) {
    for (var r = t.Workbook.Sheets, a = 0, n = -1, i = -1; a < r.length; ++a)
      !r[a] || !r[a].Hidden && n == -1 ? n = a : r[a].Hidden == 1 && i == -1 && (i = a);
    i > n || (q(
      e,
      135
      /* BrtBeginBookViews */
    ), q(e, 158, EE(n)), q(
      e,
      136
      /* BrtEndBookViews */
    ));
  }
}
function TE(e, t) {
  var r = Ir();
  return q(
    r,
    131
    /* BrtBeginBook */
  ), q(r, 128, gE()), q(r, 153, dE(e.Workbook && e.Workbook.WBProps || null)), _E(r, e), vE(r, e), q(
    r,
    132
    /* BrtEndBook */
  ), r.end();
}
function wE(e, t, r) {
  return t.slice(-4) === ".bin" ? mE(e, r) : fE(e, r);
}
function yE(e, t, r, a, n, i, s, c) {
  return t.slice(-4) === ".bin" ? Ug(e, a, r, n, i, s, c) : mv(e, a, r, n, i, s, c);
}
function SE(e, t, r, a, n, i, s, c) {
  return t.slice(-4) === ".bin" ? rE(e, a, r, n, i) : Qg(e, a, r, n, i);
}
function kE(e, t, r, a, n, i, s, c) {
  return t.slice(-4) === ".bin" ? Np() : Cp();
}
function FE(e, t, r, a, n, i, s, c) {
  return t.slice(-4) === ".bin" ? Fp() : Ap();
}
function AE(e, t, r, a) {
  return t.slice(-4) === ".bin" ? yx(e, r, a) : ux(e, r, a);
}
function NE(e, t, r) {
  return Qo(e, r);
}
function CE(e, t, r) {
  return t.slice(-4) === ".bin" ? O1(e, r) : A1(e, r);
}
function OE(e, t, r) {
  return t.slice(-4) === ".bin" ? Tp(e, r) : hp(e, r);
}
function IE(e, t, r) {
  return t.slice(-4) === ".bin" ? fp(e) : cp(e);
}
function LE(e, t, r, a) {
  return r.slice(-4) === ".bin" ? lp(e, t, r, a) : void 0;
}
function RE(e, t, r) {
  return t.slice(-4) === ".bin" ? np(e, t, r) : sp(e, t, r);
}
function DE(e, t, r) {
  return (t.slice(-4) === ".bin" ? TE : Tf)(e);
}
function bE(e, t, r, a, n) {
  return (t.slice(-4) === ".bin" ? $g : pf)(e, r, a, n);
}
function PE(e, t, r) {
  return (t.slice(-4) === ".bin" ? Rx : Jo)(e, r);
}
function ME(e, t, r) {
  return (t.slice(-4) === ".bin" ? R1 : Go)(e, r);
}
function BE(e, t, r) {
  return (t.slice(-4) === ".bin" ? wp : tf)(e);
}
function UE(e) {
  return (e.slice(-4) === ".bin" ? ip : ef)();
}
var wf = /([\w:]+)=((?:")([^"]*)(?:")|(?:')([^']*)(?:'))/g, yf = /([\w:]+)=((?:")(?:[^"]*)(?:")|(?:')(?:[^']*)(?:'))/;
function Jr(e, t) {
  var r = e.split(/\s+/), a = [];
  if (a[0] = r[0], r.length === 1) return a;
  var n = e.match(wf), i, s, c, o;
  if (n) for (o = 0; o != n.length; ++o)
    i = n[o].match(yf), (s = i[1].indexOf(":")) === -1 ? a[i[1]] = i[2].slice(1, i[2].length - 1) : (i[1].slice(0, 6) === "xmlns:" ? c = "xmlns" + i[1].slice(6) : c = i[1].slice(s + 1), a[c] = i[2].slice(1, i[2].length - 1));
  return a;
}
function XE(e) {
  var t = e.split(/\s+/), r = {};
  if (t.length === 1) return r;
  var a = e.match(wf), n, i, s, c;
  if (a) for (c = 0; c != a.length; ++c)
    n = a[c].match(yf), (i = n[1].indexOf(":")) === -1 ? r[n[1]] = n[2].slice(1, n[2].length - 1) : (n[1].slice(0, 6) === "xmlns:" ? s = "xmlns" + n[1].slice(6) : s = n[1].slice(i + 1), r[s] = n[2].slice(1, n[2].length - 1));
  return r;
}
var Va;
function WE(e, t) {
  var r = Va[e] || Ie(e);
  return r === "General" ? Yt(t) : Br(r, t);
}
function HE(e, t, r, a) {
  var n = a;
  switch ((r[0].match(/dt:dt="([\w.]+)"/) || ["", ""])[1]) {
    case "boolean":
      n = We(a);
      break;
    case "i2":
    case "int":
      n = parseInt(a, 10);
      break;
    case "r4":
    case "float":
      n = parseFloat(a);
      break;
    case "date":
    case "dateTime.tz":
      n = Ge(a);
      break;
    case "i8":
    case "string":
    case "fixed":
    case "uuid":
    case "bin.base64":
      break;
    default:
      throw new Error("bad custprop:" + r[0]);
  }
  e[Ie(t)] = n;
}
function GE(e, t, r) {
  if (e.t !== "z") {
    if (!r || r.cellText !== !1) try {
      e.t === "e" ? e.w = e.w || wt[e.v] : t === "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = Ka(e.v) : e.w = Yt(e.v) : e.w = WE(t || "General", e.v);
    } catch (i) {
      if (r.WTF) throw i;
    }
    try {
      var a = Va[t] || t || "General";
      if (r.cellNF && (e.z = a), r.cellDates && e.t == "n" && Qt(a)) {
        var n = At(e.v);
        n && (e.t = "d", e.v = new Date(n.y, n.m - 1, n.d, n.H, n.M, n.S, n.u));
      }
    } catch (i) {
      if (r.WTF) throw i;
    }
  }
}
function VE(e, t, r) {
  if (r.cellStyles && t.Interior) {
    var a = t.Interior;
    a.Pattern && (a.patternType = ax[a.Pattern] || a.Pattern);
  }
  e[t.ID] = t;
}
function zE(e, t, r, a, n, i, s, c, o, l) {
  var f = "General", d = a.StyleID, h = {};
  l = l || {};
  var p = [], m = 0;
  for (d === void 0 && c && (d = c.StyleID), d === void 0 && s && (d = s.StyleID); i[d] !== void 0 && (i[d].nf && (f = i[d].nf), i[d].Interior && p.push(i[d].Interior), !!i[d].Parent); )
    d = i[d].Parent;
  switch (r.Type) {
    case "Boolean":
      a.t = "b", a.v = We(e);
      break;
    case "String":
      a.t = "s", a.r = y0(Ie(e)), a.v = e.indexOf("<") > -1 ? Ie(t || e).replace(/<.*?>/g, "") : a.r;
      break;
    case "DateTime":
      e.slice(-1) != "Z" && (e += "Z"), a.v = (Ge(e) - new Date(Date.UTC(1899, 11, 30))) / (1440 * 60 * 1e3), a.v !== a.v ? a.v = Ie(e) : a.v < 60 && (a.v = a.v - 1), (!f || f == "General") && (f = "yyyy-mm-dd");
    /* falls through */
    case "Number":
      a.v === void 0 && (a.v = +e), a.t || (a.t = "n");
      break;
    case "Error":
      a.t = "e", a.v = po[e], l.cellText !== !1 && (a.w = e);
      break;
    default:
      e == "" && t == "" ? a.t = "z" : (a.t = "s", a.v = y0(t || e));
      break;
  }
  if (GE(a, f, l), l.cellFormula !== !1)
    if (a.Formula) {
      var x = Ie(a.Formula);
      x.charCodeAt(0) == 61 && (x = x.slice(1)), a.f = xa(x, n), delete a.Formula, a.ArrayRange == "RC" ? a.F = xa("RC:RC", n) : a.ArrayRange && (a.F = xa(a.ArrayRange, n), o.push([Ae(a.F), a.F]));
    } else
      for (m = 0; m < o.length; ++m)
        n.r >= o[m][0].s.r && n.r <= o[m][0].e.r && n.c >= o[m][0].s.c && n.c <= o[m][0].e.c && (a.F = o[m][1]);
  l.cellStyles && (p.forEach(function(u) {
    !h.patternType && u.patternType && (h.patternType = u.patternType);
  }), a.s = h), a.StyleID !== void 0 && (a.ixfe = a.StyleID);
}
function YE(e) {
  e.t = e.v || "", e.t = e.t.replace(/\r\n/g, `
`).replace(/\r/g, `
`), e.v = e.w = e.ixfe = void 0;
}
function Si(e, t) {
  var r = t || {};
  Ea();
  var a = la(es(e));
  (r.type == "binary" || r.type == "array" || r.type == "base64") && (typeof Ce < "u" ? a = Ce.utils.decode(65001, Cn(a)) : a = Me(a));
  var n = a.slice(0, 1024).toLowerCase(), i = !1;
  if (n = n.replace(/".*?"/g, ""), (n.indexOf(">") & 1023) > Math.min(n.indexOf(",") & 1023, n.indexOf(";") & 1023)) {
    var s = Ue(r);
    return s.type = "string", va.to_workbook(a, s);
  }
  if (n.indexOf("<?xml") == -1 && ["html", "table", "head", "meta", "script", "style", "div"].forEach(function(Je) {
    n.indexOf("<" + Je) >= 0 && (i = !0);
  }), i) return N_(a, r);
  Va = {
    "General Number": "General",
    "General Date": pe[22],
    "Long Date": "dddd, mmmm dd, yyyy",
    "Medium Date": pe[15],
    "Short Date": pe[14],
    "Long Time": pe[19],
    "Medium Time": pe[18],
    "Short Time": pe[20],
    Currency: '"$"#,##0.00_);[Red]\\("$"#,##0.00\\)',
    Fixed: pe[2],
    Standard: pe[4],
    Percent: pe[10],
    Scientific: pe[11],
    "Yes/No": '"Yes";"Yes";"No";@',
    "True/False": '"True";"True";"False";@',
    "On/Off": '"Yes";"Yes";"No";@'
  };
  var c, o = [], l, f = {}, d = [], h = r.dense ? [] : {}, p = "", m = {}, x = {}, u = Jr('<Data ss:Type="String">'), v = 0, E = 0, g = 0, y = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, N = {}, A = {}, w = "", P = 0, L = [], U = {}, M = {}, b = 0, K = [], se = [], re = {}, ue = [], oe, Le = !1, G = [], xe = [], ve = {}, O = 0, B = 0, R = { Sheets: [], WBProps: { date1904: !1 } }, D = {};
  Ja.lastIndex = 0, a = a.replace(/<!--([\s\S]*?)-->/mg, "");
  for (var Y = ""; c = Ja.exec(a); ) switch (c[3] = (Y = c[3]).toLowerCase()) {
    case "data":
      if (Y == "data") {
        if (c[1] === "/") {
          if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
        } else c[0].charAt(c[0].length - 2) !== "/" && o.push([c[3], !0]);
        break;
      }
      if (o[o.length - 1][1]) break;
      c[1] === "/" ? zE(a.slice(v, c.index), w, u, o[o.length - 1][0] == /*"Comment"*/
      "comment" ? re : m, { c: E, r: g }, N, ue[E], x, G, r) : (w = "", u = Jr(c[0]), v = c.index + c[0].length);
      break;
    case "cell":
      if (c[1] === "/")
        if (se.length > 0 && (m.c = se), (!r.sheetRows || r.sheetRows > g) && m.v !== void 0 && (r.dense ? (h[g] || (h[g] = []), h[g][E] = m) : h[He(E) + Ke(g)] = m), m.HRef && (m.l = { Target: Ie(m.HRef) }, m.HRefScreenTip && (m.l.Tooltip = m.HRefScreenTip), delete m.HRef, delete m.HRefScreenTip), (m.MergeAcross || m.MergeDown) && (O = E + (parseInt(m.MergeAcross, 10) | 0), B = g + (parseInt(m.MergeDown, 10) | 0), L.push({ s: { c: E, r: g }, e: { c: O, r: B } })), !r.sheetStubs)
          m.MergeAcross ? E = O + 1 : ++E;
        else if (m.MergeAcross || m.MergeDown) {
          for (var J = E; J <= O; ++J)
            for (var ae = g; ae <= B; ++ae)
              (J > E || ae > g) && (r.dense ? (h[ae] || (h[ae] = []), h[ae][J] = { t: "z" }) : h[He(J) + Ke(ae)] = { t: "z" });
          E = O + 1;
        } else ++E;
      else
        m = XE(c[0]), m.Index && (E = +m.Index - 1), E < y.s.c && (y.s.c = E), E > y.e.c && (y.e.c = E), c[0].slice(-2) === "/>" && ++E, se = [];
      break;
    case "row":
      c[1] === "/" || c[0].slice(-2) === "/>" ? (g < y.s.r && (y.s.r = g), g > y.e.r && (y.e.r = g), c[0].slice(-2) === "/>" && (x = Jr(c[0]), x.Index && (g = +x.Index - 1)), E = 0, ++g) : (x = Jr(c[0]), x.Index && (g = +x.Index - 1), ve = {}, (x.AutoFitHeight == "0" || x.Height) && (ve.hpx = parseInt(x.Height, 10), ve.hpt = tn(ve.hpx), xe[g] = ve), x.Hidden == "1" && (ve.hidden = !0, xe[g] = ve));
      break;
    case "worksheet":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
        d.push(p), y.s.r <= y.e.r && y.s.c <= y.e.c && (h["!ref"] = _e(y), r.sheetRows && r.sheetRows <= y.e.r && (h["!fullref"] = h["!ref"], y.e.r = r.sheetRows - 1, h["!ref"] = _e(y))), L.length && (h["!merges"] = L), ue.length > 0 && (h["!cols"] = ue), xe.length > 0 && (h["!rows"] = xe), f[p] = h;
      } else
        y = { s: { r: 2e6, c: 2e6 }, e: { r: 0, c: 0 } }, g = E = 0, o.push([c[3], !1]), l = Jr(c[0]), p = Ie(l.Name), h = r.dense ? [] : {}, L = [], G = [], xe = [], D = { name: p, Hidden: 0 }, R.Sheets.push(D);
      break;
    case "table":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
      } else {
        if (c[0].slice(-2) == "/>") break;
        o.push([c[3], !1]), ue = [], Le = !1;
      }
      break;
    case "style":
      c[1] === "/" ? VE(N, A, r) : A = Jr(c[0]);
      break;
    case "numberformat":
      A.nf = Ie(Jr(c[0]).Format || "General"), Va[A.nf] && (A.nf = Va[A.nf]);
      for (var ee = 0; ee != 392 && pe[ee] != A.nf; ++ee) ;
      if (ee == 392) {
        for (ee = 57; ee != 392; ++ee) if (pe[ee] == null) {
          ot(A.nf, ee);
          break;
        }
      }
      break;
    case "column":
      if (o[o.length - 1][0] !== /*'Table'*/
      "table") break;
      if (oe = Jr(c[0]), oe.Hidden && (oe.hidden = !0, delete oe.Hidden), oe.Width && (oe.wpx = parseInt(oe.Width, 10)), !Le && oe.wpx > 10) {
        Le = !0, Er = qo;
        for (var Z = 0; Z < ue.length; ++Z) ue[Z] && It(ue[Z]);
      }
      Le && It(oe), ue[oe.Index - 1 || ue.length] = oe;
      for (var we = 0; we < +oe.Span; ++we) ue[ue.length] = Ue(oe);
      break;
    case "namedrange":
      if (c[1] === "/") break;
      R.Names || (R.Names = []);
      var I = ge(c[0]), Xe = {
        Name: I.Name,
        Ref: xa(I.RefersTo.slice(1), { r: 0, c: 0 })
      };
      R.Sheets.length > 0 && (Xe.Sheet = R.Sheets.length - 1), R.Names.push(Xe);
      break;
    case "namedcell":
      break;
    case "b":
      break;
    case "i":
      break;
    case "u":
      break;
    case "s":
      break;
    case "em":
      break;
    case "h2":
      break;
    case "h3":
      break;
    case "sub":
      break;
    case "sup":
      break;
    case "span":
      break;
    case "alignment":
      break;
    case "borders":
      break;
    case "border":
      break;
    case "font":
      if (c[0].slice(-2) === "/>") break;
      c[1] === "/" ? w += a.slice(P, c.index) : P = c.index + c[0].length;
      break;
    case "interior":
      if (!r.cellStyles) break;
      A.Interior = Jr(c[0]);
      break;
    case "protection":
      break;
    case "author":
    case "title":
    case "description":
    case "created":
    case "keywords":
    case "subject":
    case "category":
    case "company":
    case "lastauthor":
    case "lastsaved":
    case "lastprinted":
    case "version":
    case "revision":
    case "totaltime":
    case "hyperlinkbase":
    case "manager":
    case "contentstatus":
    case "identifier":
    case "language":
    case "appname":
      if (c[0].slice(-2) === "/>") break;
      c[1] === "/" ? vh(U, Y, a.slice(b, c.index)) : b = c.index + c[0].length;
      break;
    case "paragraphs":
      break;
    case "styles":
    case "workbook":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
      } else o.push([c[3], !1]);
      break;
    case "comment":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
        YE(re), se.push(re);
      } else
        o.push([c[3], !1]), l = Jr(c[0]), re = { a: l.Author };
      break;
    case "autofilter":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
      } else if (c[0].charAt(c[0].length - 2) !== "/") {
        var Ne = Jr(c[0]);
        h["!autofilter"] = { ref: xa(Ne.Range).replace(/\$/g, "") }, o.push([c[3], !0]);
      }
      break;
    case "name":
      break;
    case "datavalidation":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
      } else
        c[0].charAt(c[0].length - 2) !== "/" && o.push([c[3], !0]);
      break;
    case "pixelsperinch":
      break;
    case "componentoptions":
    case "documentproperties":
    case "customdocumentproperties":
    case "officedocumentsettings":
    case "pivottable":
    case "pivotcache":
    case "names":
    case "mapinfo":
    case "pagebreaks":
    case "querytable":
    case "sorting":
    case "schema":
    //case 'data' /*case 'data'*/:
    case "conditionalformatting":
    case "smarttagtype":
    case "smarttags":
    case "excelworkbook":
    case "workbookoptions":
    case "worksheetoptions":
      if (c[1] === "/") {
        if ((l = o.pop())[0] !== c[3]) throw new Error("Bad state: " + l.join("|"));
      } else c[0].charAt(c[0].length - 2) !== "/" && o.push([c[3], !0]);
      break;
    case "null":
      break;
    default:
      if (o.length == 0 && c[3] == "document" || o.length == 0 && c[3] == "uof") return uc(a, r);
      var Be = !0;
      switch (o[o.length - 1][0]) {
        /* OfficeDocumentSettings */
        case "officedocumentsettings":
          switch (c[3]) {
            case "allowpng":
              break;
            case "removepersonalinformation":
              break;
            case "downloadcomponents":
              break;
            case "locationofcomponents":
              break;
            case "colors":
              break;
            case "color":
              break;
            case "index":
              break;
            case "rgb":
              break;
            case "targetscreensize":
              break;
            case "readonlyrecommended":
              break;
            default:
              Be = !1;
          }
          break;
        /* ComponentOptions */
        case "componentoptions":
          switch (c[3]) {
            case "toolbar":
              break;
            case "hideofficelogo":
              break;
            case "spreadsheetautofit":
              break;
            case "label":
              break;
            case "caption":
              break;
            case "maxheight":
              break;
            case "maxwidth":
              break;
            case "nextsheetnumber":
              break;
            default:
              Be = !1;
          }
          break;
        /* ExcelWorkbook */
        case "excelworkbook":
          switch (c[3]) {
            case "date1904":
              R.WBProps.date1904 = !0;
              break;
            case "windowheight":
              break;
            case "windowwidth":
              break;
            case "windowtopx":
              break;
            case "windowtopy":
              break;
            case "tabratio":
              break;
            case "protectstructure":
              break;
            case "protectwindow":
              break;
            case "protectwindows":
              break;
            case "activesheet":
              break;
            case "displayinknotes":
              break;
            case "firstvisiblesheet":
              break;
            case "supbook":
              break;
            case "sheetname":
              break;
            case "sheetindex":
              break;
            case "sheetindexfirst":
              break;
            case "sheetindexlast":
              break;
            case "dll":
              break;
            case "acceptlabelsinformulas":
              break;
            case "donotsavelinkvalues":
              break;
            case "iteration":
              break;
            case "maxiterations":
              break;
            case "maxchange":
              break;
            case "path":
              break;
            case "xct":
              break;
            case "count":
              break;
            case "selectedsheets":
              break;
            case "calculation":
              break;
            case "uncalced":
              break;
            case "startupprompt":
              break;
            case "crn":
              break;
            case "externname":
              break;
            case "formula":
              break;
            case "colfirst":
              break;
            case "collast":
              break;
            case "wantadvise":
              break;
            case "boolean":
              break;
            case "error":
              break;
            case "text":
              break;
            case "ole":
              break;
            case "noautorecover":
              break;
            case "publishobjects":
              break;
            case "donotcalculatebeforesave":
              break;
            case "number":
              break;
            case "refmoder1c1":
              break;
            case "embedsavesmarttags":
              break;
            default:
              Be = !1;
          }
          break;
        /* WorkbookOptions */
        case "workbookoptions":
          switch (c[3]) {
            case "owcversion":
              break;
            case "height":
              break;
            case "width":
              break;
            default:
              Be = !1;
          }
          break;
        /* WorksheetOptions */
        case "worksheetoptions":
          switch (c[3]) {
            case "visible":
              if (c[0].slice(-2) !== "/>") if (c[1] === "/") switch (a.slice(b, c.index)) {
                case "SheetHidden":
                  D.Hidden = 1;
                  break;
                case "SheetVeryHidden":
                  D.Hidden = 2;
                  break;
              }
              else b = c.index + c[0].length;
              break;
            case "header":
              h["!margins"] || Vt(h["!margins"] = {}, "xlml"), isNaN(+ge(c[0]).Margin) || (h["!margins"].header = +ge(c[0]).Margin);
              break;
            case "footer":
              h["!margins"] || Vt(h["!margins"] = {}, "xlml"), isNaN(+ge(c[0]).Margin) || (h["!margins"].footer = +ge(c[0]).Margin);
              break;
            case "pagemargins":
              var Fe = ge(c[0]);
              h["!margins"] || Vt(h["!margins"] = {}, "xlml"), isNaN(+Fe.Top) || (h["!margins"].top = +Fe.Top), isNaN(+Fe.Left) || (h["!margins"].left = +Fe.Left), isNaN(+Fe.Right) || (h["!margins"].right = +Fe.Right), isNaN(+Fe.Bottom) || (h["!margins"].bottom = +Fe.Bottom);
              break;
            case "displayrighttoleft":
              R.Views || (R.Views = []), R.Views[0] || (R.Views[0] = {}), R.Views[0].RTL = !0;
              break;
            case "freezepanes":
              break;
            case "frozennosplit":
              break;
            case "splithorizontal":
            case "splitvertical":
              break;
            case "donotdisplaygridlines":
              break;
            case "activerow":
              break;
            case "activecol":
              break;
            case "toprowbottompane":
              break;
            case "leftcolumnrightpane":
              break;
            case "unsynced":
              break;
            case "print":
              break;
            case "printerrors":
              break;
            case "panes":
              break;
            case "scale":
              break;
            case "pane":
              break;
            case "number":
              break;
            case "layout":
              break;
            case "pagesetup":
              break;
            case "selected":
              break;
            case "protectobjects":
              break;
            case "enableselection":
              break;
            case "protectscenarios":
              break;
            case "validprinterinfo":
              break;
            case "horizontalresolution":
              break;
            case "verticalresolution":
              break;
            case "numberofcopies":
              break;
            case "activepane":
              break;
            case "toprowvisible":
              break;
            case "leftcolumnvisible":
              break;
            case "fittopage":
              break;
            case "rangeselection":
              break;
            case "papersizeindex":
              break;
            case "pagelayoutzoom":
              break;
            case "pagebreakzoom":
              break;
            case "filteron":
              break;
            case "fitwidth":
              break;
            case "fitheight":
              break;
            case "commentslayout":
              break;
            case "zoom":
              break;
            case "lefttoright":
              break;
            case "gridlines":
              break;
            case "allowsort":
              break;
            case "allowfilter":
              break;
            case "allowinsertrows":
              break;
            case "allowdeleterows":
              break;
            case "allowinsertcols":
              break;
            case "allowdeletecols":
              break;
            case "allowinserthyperlinks":
              break;
            case "allowformatcells":
              break;
            case "allowsizecols":
              break;
            case "allowsizerows":
              break;
            case "nosummaryrowsbelowdetail":
              h["!outline"] || (h["!outline"] = {}), h["!outline"].above = !0;
              break;
            case "tabcolorindex":
              break;
            case "donotdisplayheadings":
              break;
            case "showpagelayoutzoom":
              break;
            case "nosummarycolumnsrightdetail":
              h["!outline"] || (h["!outline"] = {}), h["!outline"].left = !0;
              break;
            case "blackandwhite":
              break;
            case "donotdisplayzeros":
              break;
            case "displaypagebreak":
              break;
            case "rowcolheadings":
              break;
            case "donotdisplayoutline":
              break;
            case "noorientation":
              break;
            case "allowusepivottables":
              break;
            case "zeroheight":
              break;
            case "viewablerange":
              break;
            case "selection":
              break;
            case "protectcontents":
              break;
            default:
              Be = !1;
          }
          break;
        /* PivotTable */
        case "pivottable":
        case "pivotcache":
          switch (c[3]) {
            case "immediateitemsondrop":
              break;
            case "showpagemultipleitemlabel":
              break;
            case "compactrowindent":
              break;
            case "location":
              break;
            case "pivotfield":
              break;
            case "orientation":
              break;
            case "layoutform":
              break;
            case "layoutsubtotallocation":
              break;
            case "layoutcompactrow":
              break;
            case "position":
              break;
            case "pivotitem":
              break;
            case "datatype":
              break;
            case "datafield":
              break;
            case "sourcename":
              break;
            case "parentfield":
              break;
            case "ptlineitems":
              break;
            case "ptlineitem":
              break;
            case "countofsameitems":
              break;
            case "item":
              break;
            case "itemtype":
              break;
            case "ptsource":
              break;
            case "cacheindex":
              break;
            case "consolidationreference":
              break;
            case "filename":
              break;
            case "reference":
              break;
            case "nocolumngrand":
              break;
            case "norowgrand":
              break;
            case "blanklineafteritems":
              break;
            case "hidden":
              break;
            case "subtotal":
              break;
            case "basefield":
              break;
            case "mapchilditems":
              break;
            case "function":
              break;
            case "refreshonfileopen":
              break;
            case "printsettitles":
              break;
            case "mergelabels":
              break;
            case "defaultversion":
              break;
            case "refreshname":
              break;
            case "refreshdate":
              break;
            case "refreshdatecopy":
              break;
            case "versionlastrefresh":
              break;
            case "versionlastupdate":
              break;
            case "versionupdateablemin":
              break;
            case "versionrefreshablemin":
              break;
            case "calculation":
              break;
            default:
              Be = !1;
          }
          break;
        /* PageBreaks */
        case "pagebreaks":
          switch (c[3]) {
            case "colbreaks":
              break;
            case "colbreak":
              break;
            case "rowbreaks":
              break;
            case "rowbreak":
              break;
            case "colstart":
              break;
            case "colend":
              break;
            case "rowend":
              break;
            default:
              Be = !1;
          }
          break;
        /* AutoFilter */
        case "autofilter":
          switch (c[3]) {
            case "autofiltercolumn":
              break;
            case "autofiltercondition":
              break;
            case "autofilterand":
              break;
            case "autofilteror":
              break;
            default:
              Be = !1;
          }
          break;
        /* QueryTable */
        case "querytable":
          switch (c[3]) {
            case "id":
              break;
            case "autoformatfont":
              break;
            case "autoformatpattern":
              break;
            case "querysource":
              break;
            case "querytype":
              break;
            case "enableredirections":
              break;
            case "refreshedinxl9":
              break;
            case "urlstring":
              break;
            case "htmltables":
              break;
            case "connection":
              break;
            case "commandtext":
              break;
            case "refreshinfo":
              break;
            case "notitles":
              break;
            case "nextid":
              break;
            case "columninfo":
              break;
            case "overwritecells":
              break;
            case "donotpromptforfile":
              break;
            case "textwizardsettings":
              break;
            case "source":
              break;
            case "number":
              break;
            case "decimal":
              break;
            case "thousandseparator":
              break;
            case "trailingminusnumbers":
              break;
            case "formatsettings":
              break;
            case "fieldtype":
              break;
            case "delimiters":
              break;
            case "tab":
              break;
            case "comma":
              break;
            case "autoformatname":
              break;
            case "versionlastedit":
              break;
            case "versionlastrefresh":
              break;
            default:
              Be = !1;
          }
          break;
        case "datavalidation":
          switch (c[3]) {
            case "range":
              break;
            case "type":
              break;
            case "min":
              break;
            case "max":
              break;
            case "sort":
              break;
            case "descending":
              break;
            case "order":
              break;
            case "casesensitive":
              break;
            case "value":
              break;
            case "errorstyle":
              break;
            case "errormessage":
              break;
            case "errortitle":
              break;
            case "inputmessage":
              break;
            case "inputtitle":
              break;
            case "combohide":
              break;
            case "inputhide":
              break;
            case "condition":
              break;
            case "qualifier":
              break;
            case "useblank":
              break;
            case "value1":
              break;
            case "value2":
              break;
            case "format":
              break;
            case "cellrangelist":
              break;
            default:
              Be = !1;
          }
          break;
        case "sorting":
        case "conditionalformatting":
          switch (c[3]) {
            case "range":
              break;
            case "type":
              break;
            case "min":
              break;
            case "max":
              break;
            case "sort":
              break;
            case "descending":
              break;
            case "order":
              break;
            case "casesensitive":
              break;
            case "value":
              break;
            case "errorstyle":
              break;
            case "errormessage":
              break;
            case "errortitle":
              break;
            case "cellrangelist":
              break;
            case "inputmessage":
              break;
            case "inputtitle":
              break;
            case "combohide":
              break;
            case "inputhide":
              break;
            case "condition":
              break;
            case "qualifier":
              break;
            case "useblank":
              break;
            case "value1":
              break;
            case "value2":
              break;
            case "format":
              break;
            default:
              Be = !1;
          }
          break;
        /* MapInfo (schema) */
        case "mapinfo":
        case "schema":
        case "data":
          switch (c[3]) {
            case "map":
              break;
            case "entry":
              break;
            case "range":
              break;
            case "xpath":
              break;
            case "field":
              break;
            case "xsdtype":
              break;
            case "filteron":
              break;
            case "aggregate":
              break;
            case "elementtype":
              break;
            case "attributetype":
              break;
            /* These are from xsd (XML Schema Definition) */
            case "schema":
            case "element":
            case "complextype":
            case "datatype":
            case "all":
            case "attribute":
            case "extends":
              break;
            case "row":
              break;
            default:
              Be = !1;
          }
          break;
        /* SmartTags (can be anything) */
        case "smarttags":
          break;
        default:
          Be = !1;
          break;
      }
      if (Be || c[3].match(/!\[CDATA/)) break;
      if (!o[o.length - 1][1]) throw "Unrecognized tag: " + c[3] + "|" + o.join("|");
      if (o[o.length - 1][0] === /*'CustomDocumentProperties'*/
      "customdocumentproperties") {
        if (c[0].slice(-2) === "/>") break;
        c[1] === "/" ? HE(M, Y, K, a.slice(b, c.index)) : (K = c, b = c.index + c[0].length);
        break;
      }
      if (r.WTF) throw "Unrecognized tag: " + c[3] + "|" + o.join("|");
  }
  var fe = {};
  return !r.bookSheets && !r.bookProps && (fe.Sheets = f), fe.SheetNames = d, fe.Workbook = R, fe.SSF = Ue(pe), fe.Props = U, fe.Custprops = M, fe;
}
function Xi(e, t) {
  switch (Cs(t = t || {}), t.type || "base64") {
    case "base64":
      return Si(Mr(e), t);
    case "binary":
    case "buffer":
    case "file":
      return Si(e, t);
    case "array":
      return Si(Dt(e), t);
  }
}
function jE(e, t) {
  var r = [];
  return e.Props && r.push(gh(e.Props, t)), e.Custprops && r.push(Eh(e.Props, e.Custprops)), r.join("");
}
function KE() {
  return "";
}
function qE(e, t) {
  var r = ['<Style ss:ID="Default" ss:Name="Normal"><NumberFormat/></Style>'];
  return t.cellXfs.forEach(function(a, n) {
    var i = [];
    i.push(ne("NumberFormat", null, { "ss:Format": Pe(pe[a.numFmtId]) }));
    var s = (
      /*::(*/
      { "ss:ID": "s" + (21 + n) }
    );
    r.push(ne("Style", i.join(""), s));
  }), ne("Styles", r.join(""));
}
function Sf(e) {
  return ne("NamedRange", null, { "ss:Name": e.Name, "ss:RefersTo": "=" + ws(e.Ref, { r: 0, c: 0 }) });
}
function $E(e) {
  if (!((e || {}).Workbook || {}).Names) return "";
  for (var t = e.Workbook.Names, r = [], a = 0; a < t.length; ++a) {
    var n = t[a];
    n.Sheet == null && (n.Name.match(/^_xlfn\./) || r.push(Sf(n)));
  }
  return ne("Names", r.join(""));
}
function JE(e, t, r, a) {
  if (!e || !((a || {}).Workbook || {}).Names) return "";
  for (var n = a.Workbook.Names, i = [], s = 0; s < n.length; ++s) {
    var c = n[s];
    c.Sheet == r && (c.Name.match(/^_xlfn\./) || i.push(Sf(c)));
  }
  return i.join("");
}
function ZE(e, t, r, a) {
  if (!e) return "";
  var n = [];
  if (e["!margins"] && (n.push("<PageSetup>"), e["!margins"].header && n.push(ne("Header", null, { "x:Margin": e["!margins"].header })), e["!margins"].footer && n.push(ne("Footer", null, { "x:Margin": e["!margins"].footer })), n.push(ne("PageMargins", null, {
    "x:Bottom": e["!margins"].bottom || "0.75",
    "x:Left": e["!margins"].left || "0.7",
    "x:Right": e["!margins"].right || "0.7",
    "x:Top": e["!margins"].top || "0.75"
  })), n.push("</PageSetup>")), a && a.Workbook && a.Workbook.Sheets && a.Workbook.Sheets[r])
    if (a.Workbook.Sheets[r].Hidden) n.push(ne("Visible", a.Workbook.Sheets[r].Hidden == 1 ? "SheetHidden" : "SheetVeryHidden", {}));
    else {
      for (var i = 0; i < r && !(a.Workbook.Sheets[i] && !a.Workbook.Sheets[i].Hidden); ++i) ;
      i == r && n.push("<Selected/>");
    }
  return ((((a || {}).Workbook || {}).Views || [])[0] || {}).RTL && n.push("<DisplayRightToLeft/>"), e["!protect"] && (n.push(xr("ProtectContents", "True")), e["!protect"].objects && n.push(xr("ProtectObjects", "True")), e["!protect"].scenarios && n.push(xr("ProtectScenarios", "True")), e["!protect"].selectLockedCells != null && !e["!protect"].selectLockedCells ? n.push(xr("EnableSelection", "NoSelection")) : e["!protect"].selectUnlockedCells != null && !e["!protect"].selectUnlockedCells && n.push(xr("EnableSelection", "UnlockedCells")), [
    ["formatCells", "AllowFormatCells"],
    ["formatColumns", "AllowSizeCols"],
    ["formatRows", "AllowSizeRows"],
    ["insertColumns", "AllowInsertCols"],
    ["insertRows", "AllowInsertRows"],
    ["insertHyperlinks", "AllowInsertHyperlinks"],
    ["deleteColumns", "AllowDeleteCols"],
    ["deleteRows", "AllowDeleteRows"],
    ["sort", "AllowSort"],
    ["autoFilter", "AllowFilter"],
    ["pivotTables", "AllowUsePivotTables"]
  ].forEach(function(s) {
    e["!protect"][s[0]] && n.push("<" + s[1] + "/>");
  })), n.length == 0 ? "" : ne("WorksheetOptions", n.join(""), { xmlns: Rr.x });
}
function QE(e) {
  return e.map(function(t) {
    var r = Tu(t.t || ""), a = ne("ss:Data", r, { xmlns: "http://www.w3.org/TR/REC-html40" });
    return ne("Comment", a, { "ss:Author": t.a });
  }).join("");
}
function e_(e, t, r, a, n, i, s) {
  if (!e || e.v == null && e.f == null) return "";
  var c = {};
  if (e.f && (c["ss:Formula"] = "=" + Pe(ws(e.f, s))), e.F && e.F.slice(0, t.length) == t) {
    var o = Ye(e.F.slice(t.length + 1));
    c["ss:ArrayRange"] = "RC:R" + (o.r == s.r ? "" : "[" + (o.r - s.r) + "]") + "C" + (o.c == s.c ? "" : "[" + (o.c - s.c) + "]");
  }
  if (e.l && e.l.Target && (c["ss:HRef"] = Pe(e.l.Target), e.l.Tooltip && (c["x:HRefScreenTip"] = Pe(e.l.Tooltip))), r["!merges"])
    for (var l = r["!merges"], f = 0; f != l.length; ++f)
      l[f].s.c != s.c || l[f].s.r != s.r || (l[f].e.c > l[f].s.c && (c["ss:MergeAcross"] = l[f].e.c - l[f].s.c), l[f].e.r > l[f].s.r && (c["ss:MergeDown"] = l[f].e.r - l[f].s.r));
  var d = "", h = "";
  switch (e.t) {
    case "z":
      if (!a.sheetStubs) return "";
      break;
    case "n":
      d = "Number", h = String(e.v);
      break;
    case "b":
      d = "Boolean", h = e.v ? "1" : "0";
      break;
    case "e":
      d = "Error", h = wt[e.v];
      break;
    case "d":
      d = "DateTime", h = new Date(e.v).toISOString(), e.z == null && (e.z = e.z || pe[14]);
      break;
    case "s":
      d = "String", h = _u(e.v || "");
      break;
  }
  var p = Pt(a.cellXfs, e, a);
  c["ss:StyleID"] = "s" + (21 + p), c["ss:Index"] = s.c + 1;
  var m = e.v != null ? h : "", x = e.t == "z" ? "" : '<Data ss:Type="' + d + '">' + m + "</Data>";
  return (e.c || []).length > 0 && (x += QE(e.c)), ne("Cell", x, c);
}
function r_(e, t) {
  var r = '<Row ss:Index="' + (e + 1) + '"';
  return t && (t.hpt && !t.hpx && (t.hpx = ga(t.hpt)), t.hpx && (r += ' ss:AutoFitHeight="0" ss:Height="' + t.hpx + '"'), t.hidden && (r += ' ss:Hidden="1"')), r + ">";
}
function t_(e, t, r, a) {
  if (!e["!ref"]) return "";
  var n = Ae(e["!ref"]), i = e["!merges"] || [], s = 0, c = [];
  e["!cols"] && e["!cols"].forEach(function(u, v) {
    It(u);
    var E = !!u.width, g = Zn(v, u), y = { "ss:Index": v + 1 };
    E && (y["ss:Width"] = en(g.width)), u.hidden && (y["ss:Hidden"] = "1"), c.push(ne("Column", null, y));
  });
  for (var o = Array.isArray(e), l = n.s.r; l <= n.e.r; ++l) {
    for (var f = [r_(l, (e["!rows"] || [])[l])], d = n.s.c; d <= n.e.c; ++d) {
      var h = !1;
      for (s = 0; s != i.length; ++s)
        if (!(i[s].s.c > d) && !(i[s].s.r > l) && !(i[s].e.c < d) && !(i[s].e.r < l)) {
          (i[s].s.c != d || i[s].s.r != l) && (h = !0);
          break;
        }
      if (!h) {
        var p = { r: l, c: d }, m = me(p), x = o ? (e[l] || [])[d] : e[m];
        f.push(e_(x, m, e, t, r, a, p));
      }
    }
    f.push("</Row>"), f.length > 2 && c.push(f.join(""));
  }
  return c.join("");
}
function a_(e, t, r) {
  var a = [], n = r.SheetNames[e], i = r.Sheets[n], s = i ? JE(i, t, e, r) : "";
  return s.length > 0 && a.push("<Names>" + s + "</Names>"), s = i ? t_(i, t, e, r) : "", s.length > 0 && a.push("<Table>" + s + "</Table>"), a.push(ZE(i, t, e, r)), a.join("");
}
function n_(e, t) {
  t || (t = {}), e.SSF || (e.SSF = Ue(pe)), e.SSF && (Ea(), on(e.SSF), t.revssf = Yn(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF, t.cellXfs = [], Pt(t.cellXfs, {}, { revssf: { General: 0 } }));
  var r = [];
  r.push(jE(e, t)), r.push(KE()), r.push(""), r.push("");
  for (var a = 0; a < e.SheetNames.length; ++a)
    r.push(ne("Worksheet", a_(a, t, e), { "ss:Name": Pe(e.SheetNames[a]) }));
  return r[2] = qE(e, t), r[3] = $E(e), er + ne("Workbook", r.join(""), {
    xmlns: Rr.ss,
    "xmlns:o": Rr.o,
    "xmlns:x": Rr.x,
    "xmlns:ss": Rr.ss,
    "xmlns:dt": Rr.dt,
    "xmlns:html": Rr.html
  });
}
function i_(e) {
  var t = {}, r = e.content;
  if (r.l = 28, t.AnsiUserType = r.read_shift(0, "lpstr-ansi"), t.AnsiClipboardFormat = Ju(r), r.length - r.l <= 4) return t;
  var a = r.read_shift(4);
  if (a == 0 || a > 40 || (r.l -= 4, t.Reserved1 = r.read_shift(0, "lpstr-ansi"), r.length - r.l <= 4) || (a = r.read_shift(4), a !== 1907505652) || (t.UnicodeClipboardFormat = Zu(r), a = r.read_shift(4), a == 0 || a > 40)) return t;
  r.l -= 4, t.Reserved2 = r.read_shift(0, "lpwstr");
}
var s_ = [60, 1084, 2066, 2165, 2175];
function c_(e, t, r, a, n) {
  var i = a, s = [], c = r.slice(r.l, r.l + i);
  if (n && n.enc && n.enc.insitu && c.length > 0) switch (e) {
    case 9:
    case 521:
    case 1033:
    case 2057:
    case 47:
    case 405:
    case 225:
    case 406:
    case 312:
    case 404:
    case 10:
      break;
    case 133:
      break;
    default:
      n.enc.insitu(c);
  }
  s.push(c), r.l += i;
  for (var o = mt(r, r.l), l = Wi[o], f = 0; l != null && s_.indexOf(o) > -1; )
    i = mt(r, r.l + 2), f = r.l + 4, o == 2066 ? f += 4 : (o == 2165 || o == 2175) && (f += 12), c = r.slice(f, r.l + 4 + i), s.push(c), r.l += 4 + i, l = Wi[o = mt(r, r.l)];
  var d = fr(s);
  dr(d, 0);
  var h = 0;
  d.lens = [];
  for (var p = 0; p < s.length; ++p)
    d.lens.push(h), h += s[p].length;
  if (d.length < a) throw "XLS Record 0x" + e.toString(16) + " Truncated: " + d.length + " < " + a;
  return t.f(d, d.length, n);
}
function nt(e, t, r) {
  if (e.t !== "z" && e.XF) {
    var a = 0;
    try {
      a = e.z || e.XF.numFmtId || 0, t.cellNF && (e.z = pe[a]);
    } catch (i) {
      if (t.WTF) throw i;
    }
    if (!t || t.cellText !== !1) try {
      e.t === "e" ? e.w = e.w || wt[e.v] : a === 0 || a == "General" ? e.t === "n" ? (e.v | 0) === e.v ? e.w = e.v.toString(10) : e.w = Ka(e.v) : e.w = Yt(e.v) : e.w = Br(a, e.v, { date1904: !!r, dateNF: t && t.dateNF });
    } catch (i) {
      if (t.WTF) throw i;
    }
    if (t.cellDates && a && e.t == "n" && Qt(pe[a] || String(a))) {
      var n = At(e.v);
      n && (e.t = "d", e.v = new Date(n.y, n.m - 1, n.d, n.H, n.M, n.S, n.u));
    }
  }
}
function An(e, t, r) {
  return { v: e, ixfe: t, t: r };
}
function o_(e, t) {
  var r = { opts: {} }, a = {}, n = t.dense ? [] : {}, i = {}, s = {}, c = null, o = [], l = "", f = {}, d, h = "", p, m, x, u, v = {}, E = [], g, y, N = [], A = [], w = { Sheets: [], WBProps: { date1904: !1 }, Views: [{}] }, P = {}, L = function(Se) {
    return Se < 8 ? Wt[Se] : Se < 64 && A[Se - 8] || Wt[Se];
  }, U = function(Se, Ze, Xr) {
    var nr = Ze.XF.data;
    if (!(!nr || !nr.patternType || !Xr || !Xr.cellStyles)) {
      Ze.s = {}, Ze.s.patternType = nr.patternType;
      var Mt;
      (Mt = Qa(L(nr.icvFore))) && (Ze.s.fgColor = { rgb: Mt }), (Mt = Qa(L(nr.icvBack))) && (Ze.s.bgColor = { rgb: Mt });
    }
  }, M = function(Se, Ze, Xr) {
    if (!(ve > 1) && !(Xr.sheetRows && Se.r >= Xr.sheetRows)) {
      if (Xr.cellStyles && Ze.XF && Ze.XF.data && U(Se, Ze, Xr), delete Ze.ixfe, delete Ze.XF, d = Se, h = me(Se), (!s || !s.s || !s.e) && (s = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }), Se.r < s.s.r && (s.s.r = Se.r), Se.c < s.s.c && (s.s.c = Se.c), Se.r + 1 > s.e.r && (s.e.r = Se.r + 1), Se.c + 1 > s.e.c && (s.e.c = Se.c + 1), Xr.cellFormula && Ze.f) {
        for (var nr = 0; nr < E.length; ++nr)
          if (!(E[nr][0].s.c > Se.c || E[nr][0].s.r > Se.r) && !(E[nr][0].e.c < Se.c || E[nr][0].e.r < Se.r)) {
            Ze.F = _e(E[nr][0]), (E[nr][0].s.c != Se.c || E[nr][0].s.r != Se.r) && delete Ze.f, Ze.f && (Ze.f = "" + gr(E[nr][1], s, Se, G, b));
            break;
          }
      }
      Xr.dense ? (n[Se.r] || (n[Se.r] = []), n[Se.r][Se.c] = Ze) : n[h] = Ze;
    }
  }, b = {
    enc: !1,
    // encrypted
    sbcch: 0,
    // cch in the preceding SupBook
    snames: [],
    // sheetnames
    sharedf: v,
    // shared formulae by address
    arrayf: E,
    // array formulae array
    rrtabid: [],
    // RRTabId
    lastuser: "",
    // Last User from WriteAccess
    biff: 8,
    // BIFF version
    codepage: 0,
    // CP from CodePage record
    winlocked: 0,
    // fLockWn from WinProtect
    cellStyles: !!t && !!t.cellStyles,
    WTF: !!t && !!t.wtf
  };
  t.password && (b.password = t.password);
  var K, se = [], re = [], ue = [], oe = [], Le = !1, G = [];
  G.SheetNames = b.snames, G.sharedf = b.sharedf, G.arrayf = b.arrayf, G.names = [], G.XTI = [];
  var xe = 0, ve = 0, O = 0, B = [], R = [], D;
  b.codepage = 1200, jr(1200);
  for (var Y = !1; e.l < e.length - 1; ) {
    var J = e.l, ae = e.read_shift(2);
    if (ae === 0 && xe === 10) break;
    var ee = e.l === e.length ? 0 : e.read_shift(2), Z = Wi[ae];
    if (Z && Z.f) {
      if (t.bookSheets && xe === 133 && ae !== 133)
        break;
      if (xe = ae, Z.r === 2 || Z.r == 12) {
        var we = e.read_shift(2);
        if (ee -= 2, !b.enc && we !== ae && ((we & 255) << 8 | we >> 8) !== ae) throw new Error("rt mismatch: " + we + "!=" + ae);
        Z.r == 12 && (e.l += 10, ee -= 10);
      }
      var I = {};
      if (ae === 10 ? I = /*::(*/
      Z.f(e, ee, b) : I = /*::(*/
      c_(ae, Z, e, ee, b), ve == 0 && [9, 521, 1033, 2057].indexOf(xe) === -1) continue;
      switch (ae) {
        case 34:
          r.opts.Date1904 = w.WBProps.date1904 = I;
          break;
        case 134:
          r.opts.WriteProtect = !0;
          break;
        case 47:
          if (b.enc || (e.l = 0), b.enc = I, !t.password) throw new Error("File is password-protected");
          if (I.valid == null) throw new Error("Encryption scheme unsupported");
          if (!I.valid) throw new Error("Password is incorrect");
          break;
        case 92:
          b.lastuser = I;
          break;
        case 66:
          var Xe = Number(I);
          switch (Xe) {
            case 21010:
              Xe = 1200;
              break;
            case 32768:
              Xe = 1e4;
              break;
            case 32769:
              Xe = 1252;
              break;
          }
          jr(b.codepage = Xe), Y = !0;
          break;
        case 317:
          b.rrtabid = I;
          break;
        case 25:
          b.winlocked = I;
          break;
        case 439:
          r.opts.RefreshAll = I;
          break;
        case 12:
          r.opts.CalcCount = I;
          break;
        case 16:
          r.opts.CalcDelta = I;
          break;
        case 17:
          r.opts.CalcIter = I;
          break;
        case 13:
          r.opts.CalcMode = I;
          break;
        case 14:
          r.opts.CalcPrecision = I;
          break;
        case 95:
          r.opts.CalcSaveRecalc = I;
          break;
        case 15:
          b.CalcRefMode = I;
          break;
        // TODO: implement R1C1
        case 2211:
          r.opts.FullCalc = I;
          break;
        case 129:
          I.fDialog && (n["!type"] = "dialog"), I.fBelow || ((n["!outline"] || (n["!outline"] = {})).above = !0), I.fRight || ((n["!outline"] || (n["!outline"] = {})).left = !0);
          break;
        // TODO
        case 224:
          N.push(I);
          break;
        case 430:
          G.push([I]), G[G.length - 1].XTI = [];
          break;
        case 35:
        case 547:
          G[G.length - 1].push(I);
          break;
        case 24:
        case 536:
          D = {
            Name: I.Name,
            Ref: gr(I.rgce, s, null, G, b)
          }, I.itab > 0 && (D.Sheet = I.itab - 1), G.names.push(D), G[0] || (G[0] = [], G[0].XTI = []), G[G.length - 1].push(I), I.Name == "_xlnm._FilterDatabase" && I.itab > 0 && I.rgce && I.rgce[0] && I.rgce[0][0] && I.rgce[0][0][0] == "PtgArea3d" && (R[I.itab - 1] = { ref: _e(I.rgce[0][0][1][2]) });
          break;
        case 22:
          b.ExternCount = I;
          break;
        case 23:
          G.length == 0 && (G[0] = [], G[0].XTI = []), G[G.length - 1].XTI = G[G.length - 1].XTI.concat(I), G.XTI = G.XTI.concat(I);
          break;
        case 2196:
          if (b.biff < 8) break;
          D != null && (D.Comment = I[1]);
          break;
        case 18:
          n["!protect"] = I;
          break;
        /* for sheet or book */
        case 19:
          I !== 0 && b.WTF && console.error("Password verifier: " + I);
          break;
        case 133:
          i[I.pos] = I, b.snames.push(I.name);
          break;
        case 10:
          {
            if (--ve) break;
            if (s.e) {
              if (s.e.r > 0 && s.e.c > 0) {
                if (s.e.r--, s.e.c--, n["!ref"] = _e(s), t.sheetRows && t.sheetRows <= s.e.r) {
                  var Ne = s.e.r;
                  s.e.r = t.sheetRows - 1, n["!fullref"] = n["!ref"], n["!ref"] = _e(s), s.e.r = Ne;
                }
                s.e.r++, s.e.c++;
              }
              se.length > 0 && (n["!merges"] = se), re.length > 0 && (n["!objects"] = re), ue.length > 0 && (n["!cols"] = ue), oe.length > 0 && (n["!rows"] = oe), w.Sheets.push(P);
            }
            l === "" ? f = n : a[l] = n, n = t.dense ? [] : {};
          }
          break;
        case 9:
        case 521:
        case 1033:
        case 2057:
          {
            if (b.biff === 8 && (b.biff = {
              /*::[*/
              9: 2,
              /*::[*/
              521: 3,
              /*::[*/
              1033: 4
            }[ae] || {
              /*::[*/
              512: 2,
              /*::[*/
              768: 3,
              /*::[*/
              1024: 4,
              /*::[*/
              1280: 5,
              /*::[*/
              1536: 8,
              /*::[*/
              2: 2,
              /*::[*/
              7: 2
            }[I.BIFFVer] || 8), b.biffguess = I.BIFFVer == 0, I.BIFFVer == 0 && I.dt == 4096 && (b.biff = 5, Y = !0, jr(b.codepage = 28591)), b.biff == 8 && I.BIFFVer == 0 && I.dt == 16 && (b.biff = 2), ve++) break;
            if (n = t.dense ? [] : {}, b.biff < 8 && !Y && (Y = !0, jr(b.codepage = t.codepage || 1252)), b.biff < 5 || I.BIFFVer == 0 && I.dt == 4096) {
              l === "" && (l = "Sheet1"), s = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
              var Be = { pos: e.l - ee, name: l };
              i[Be.pos] = Be, b.snames.push(l);
            } else l = (i[J] || { name: "" }).name;
            I.dt == 32 && (n["!type"] = "chart"), I.dt == 64 && (n["!type"] = "macro"), se = [], re = [], b.arrayf = E = [], ue = [], oe = [], Le = !1, P = { Hidden: (i[J] || { hs: 0 }).hs, name: l };
          }
          break;
        case 515:
        case 3:
        case 2:
          n["!type"] == "chart" && (t.dense ? (n[I.r] || [])[I.c] : n[me({ c: I.c, r: I.r })]) && ++I.c, g = { ixfe: I.ixfe, XF: N[I.ixfe] || {}, v: I.val, t: "n" }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t);
          break;
        case 5:
        case 517:
          g = { ixfe: I.ixfe, XF: N[I.ixfe], v: I.val, t: I.t }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t);
          break;
        case 638:
          g = { ixfe: I.ixfe, XF: N[I.ixfe], v: I.rknum, t: "n" }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t);
          break;
        case 189:
          for (var Fe = I.c; Fe <= I.C; ++Fe) {
            var fe = I.rkrec[Fe - I.c][0];
            g = { ixfe: fe, XF: N[fe], v: I.rkrec[Fe - I.c][1], t: "n" }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: Fe, r: I.r }, g, t);
          }
          break;
        case 6:
        case 518:
        case 1030:
          {
            if (I.val == "String") {
              c = I;
              break;
            }
            if (g = An(I.val, I.cell.ixfe, I.tt), g.XF = N[g.ixfe], t.cellFormula) {
              var Je = I.formula;
              if (Je && Je[0] && Je[0][0] && Je[0][0][0] == "PtgExp") {
                var Ur = Je[0][0][1][0], tt = Je[0][0][1][1], ht = me({ r: Ur, c: tt });
                v[ht] ? g.f = "" + gr(I.formula, s, I.cell, G, b) : g.F = ((t.dense ? (n[Ur] || [])[tt] : n[ht]) || {}).F;
              } else g.f = "" + gr(I.formula, s, I.cell, G, b);
            }
            O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M(I.cell, g, t), c = I;
          }
          break;
        case 7:
        case 519:
          if (c)
            c.val = I, g = An(I, c.cell.ixfe, "s"), g.XF = N[g.ixfe], t.cellFormula && (g.f = "" + gr(c.formula, s, c.cell, G, b)), O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M(c.cell, g, t), c = null;
          else throw new Error("String record expects Formula");
          break;
        case 33:
        case 545:
          {
            E.push(I);
            var ya = me(I[0].s);
            if (p = t.dense ? (n[I[0].s.r] || [])[I[0].s.c] : n[ya], t.cellFormula && p) {
              if (!c || !ya || !p) break;
              p.f = "" + gr(I[1], s, I[0], G, b), p.F = _e(I[0]);
            }
          }
          break;
        case 1212:
          {
            if (!t.cellFormula) break;
            if (h) {
              if (!c) break;
              v[me(c.cell)] = I[0], p = t.dense ? (n[c.cell.r] || [])[c.cell.c] : n[me(c.cell)], (p || {}).f = "" + gr(I[0], s, d, G, b);
            }
          }
          break;
        case 253:
          g = An(o[I.isst].t, I.ixfe, "s"), o[I.isst].h && (g.h = o[I.isst].h), g.XF = N[g.ixfe], O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t);
          break;
        case 513:
          t.sheetStubs && (g = { ixfe: I.ixfe, XF: N[I.ixfe], t: "z" }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t));
          break;
        case 190:
          if (t.sheetStubs)
            for (var yt = I.c; yt <= I.C; ++yt) {
              var Lr = I.ixfe[yt - I.c];
              g = { ixfe: Lr, XF: N[Lr], t: "z" }, O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: yt, r: I.r }, g, t);
            }
          break;
        case 214:
        case 516:
        case 4:
          g = An(I.val, I.ixfe, "s"), g.XF = N[g.ixfe], O > 0 && (g.z = B[g.ixfe >> 8 & 63]), nt(g, t, r.opts.Date1904), M({ c: I.c, r: I.r }, g, t);
          break;
        case 0:
        case 512:
          ve === 1 && (s = I);
          break;
        case 252:
          o = I;
          break;
        case 1054:
          if (b.biff == 4) {
            B[O++] = I[1];
            for (var dt = 0; dt < O + 163 && pe[dt] != I[1]; ++dt) ;
            dt >= 163 && ot(I[1], O + 163);
          } else ot(I[1], I[0]);
          break;
        case 30:
          {
            B[O++] = I;
            for (var St = 0; St < O + 163 && pe[St] != I; ++St) ;
            St >= 163 && ot(I, O + 163);
          }
          break;
        case 229:
          se = se.concat(I);
          break;
        case 93:
          re[I.cmo[0]] = b.lastobj = I;
          break;
        case 438:
          b.lastobj.TxO = I;
          break;
        case 127:
          b.lastobj.ImData = I;
          break;
        case 440:
          for (u = I[0].s.r; u <= I[0].e.r; ++u)
            for (x = I[0].s.c; x <= I[0].e.c; ++x)
              p = t.dense ? (n[u] || [])[x] : n[me({ c: x, r: u })], p && (p.l = I[1]);
          break;
        case 2048:
          for (u = I[0].s.r; u <= I[0].e.r; ++u)
            for (x = I[0].s.c; x <= I[0].e.c; ++x)
              p = t.dense ? (n[u] || [])[x] : n[me({ c: x, r: u })], p && p.l && (p.l.Tooltip = I[1]);
          break;
        case 28:
          {
            if (b.biff <= 5 && b.biff >= 2) break;
            p = t.dense ? (n[I[0].r] || [])[I[0].c] : n[me(I[0])];
            var Sa = re[I[2]];
            p || (t.dense ? (n[I[0].r] || (n[I[0].r] = []), p = n[I[0].r][I[0].c] = { t: "z" }) : p = n[me(I[0])] = { t: "z" }, s.e.r = Math.max(s.e.r, I[0].r), s.s.r = Math.min(s.s.r, I[0].r), s.e.c = Math.max(s.e.c, I[0].c), s.s.c = Math.min(s.s.c, I[0].c)), p.c || (p.c = []), m = { a: I[1], t: Sa.TxO.t }, p.c.push(m);
          }
          break;
        case 2173:
          $x(N[I.ixfe], I.ext);
          break;
        case 125:
          {
            if (!b.cellStyles) break;
            for (; I.e >= I.s; )
              ue[I.e--] = { width: I.w / 256, level: I.level || 0, hidden: !!(I.flags & 1) }, Le || (Le = !0, Es(I.w / 256)), It(ue[I.e + 1]);
          }
          break;
        case 520:
          {
            var kr = {};
            I.level != null && (oe[I.r] = kr, kr.level = I.level), I.hidden && (oe[I.r] = kr, kr.hidden = !0), I.hpt && (oe[I.r] = kr, kr.hpt = I.hpt, kr.hpx = ga(I.hpt));
          }
          break;
        case 38:
        case 39:
        case 40:
        case 41:
          n["!margins"] || Vt(n["!margins"] = {}), n["!margins"][{ 38: "left", 39: "right", 40: "top", 41: "bottom" }[ae]] = I;
          break;
        case 161:
          n["!margins"] || Vt(n["!margins"] = {}), n["!margins"].header = I.header, n["!margins"].footer = I.footer;
          break;
        case 574:
          I.RTL && (w.Views[0].RTL = !0);
          break;
        case 146:
          A = I;
          break;
        case 2198:
          K = I;
          break;
        case 140:
          y = I;
          break;
        case 442:
          l ? P.CodeName = I || P.name : w.WBProps.CodeName = I || "ThisWorkbook";
          break;
      }
    } else
      Z || console.error("Missing Info for XLS Record 0x" + ae.toString(16)), e.l += ee;
  }
  return r.SheetNames = $e(i).sort(function(at, Se) {
    return Number(at) - Number(Se);
  }).map(function(at) {
    return i[at].name;
  }), t.bookSheets || (r.Sheets = a), !r.SheetNames.length && f["!ref"] ? (r.SheetNames.push("Sheet1"), r.Sheets && (r.Sheets.Sheet1 = f)) : r.Preamble = f, r.Sheets && R.forEach(function(at, Se) {
    r.Sheets[r.SheetNames[Se]]["!autofilter"] = at;
  }), r.Strings = o, r.SSF = Ue(pe), b.enc && (r.Encryption = b.enc), K && (r.Themes = K), r.Metadata = {}, y !== void 0 && (r.Metadata.Country = y), G.names.length > 0 && (w.Names = G.names), r.Workbook = w, r;
}
var za = {
  SI: "e0859ff2f94f6810ab9108002b27b3d9",
  DSI: "02d5cdd59c2e1b10939708002b2cf9ae",
  UDI: "05d5cdd59c2e1b10939708002b2cf9ae"
};
function f_(e, t, r) {
  var a = de.find(e, "/!DocumentSummaryInformation");
  if (a && a.size > 0) try {
    var n = W0(a, Di, za.DSI);
    for (var i in n) t[i] = n[i];
  } catch (l) {
    if (r.WTF) throw l;
  }
  var s = de.find(e, "/!SummaryInformation");
  if (s && s.size > 0) try {
    var c = W0(s, bi, za.SI);
    for (var o in c) t[o] == null && (t[o] = c[o]);
  } catch (l) {
    if (r.WTF) throw l;
  }
  t.HeadingPairs && t.TitlesOfParts && (To(t.HeadingPairs, t.TitlesOfParts, t, r), delete t.HeadingPairs, delete t.TitlesOfParts);
}
function l_(e, t) {
  var r = [], a = [], n = [], i = 0, s, c = v0(Di, "n"), o = v0(bi, "n");
  if (e.Props)
    for (s = $e(e.Props), i = 0; i < s.length; ++i) (Object.prototype.hasOwnProperty.call(c, s[i]) ? r : Object.prototype.hasOwnProperty.call(o, s[i]) ? a : n).push([s[i], e.Props[s[i]]]);
  if (e.Custprops)
    for (s = $e(e.Custprops), i = 0; i < s.length; ++i) Object.prototype.hasOwnProperty.call(e.Props || {}, s[i]) || (Object.prototype.hasOwnProperty.call(c, s[i]) ? r : Object.prototype.hasOwnProperty.call(o, s[i]) ? a : n).push([s[i], e.Custprops[s[i]]]);
  var l = [];
  for (i = 0; i < n.length; ++i)
    No.indexOf(n[i][0]) > -1 || _o.indexOf(n[i][0]) > -1 || n[i][1] != null && l.push(n[i]);
  a.length && de.utils.cfb_add(t, "/SummaryInformation", H0(a, za.SI, o, bi)), (r.length || l.length) && de.utils.cfb_add(t, "/DocumentSummaryInformation", H0(r, za.DSI, c, Di, l.length ? l : null, za.UDI));
}
function As(e, t) {
  t || (t = {}), Cs(t), Vn(), t.codepage && Gn(t.codepage);
  var r, a;
  if (e.FullPaths) {
    if (de.find(e, "/encryption")) throw new Error("File is password-protected");
    r = de.find(e, "!CompObj"), a = de.find(e, "/Workbook") || de.find(e, "/Book");
  } else {
    switch (t.type) {
      case "base64":
        e = Dr(Mr(e));
        break;
      case "binary":
        e = Dr(e);
        break;
      case "buffer":
        break;
      case "array":
        Array.isArray(e) || (e = Array.prototype.slice.call(e));
        break;
    }
    dr(e, 0), a = { content: e };
  }
  var n, i;
  if (r && i_(r), t.bookProps && !t.bookSheets) n = {};
  else {
    var s = ye ? "buffer" : "array";
    if (a && a.content) n = o_(a.content, t);
    else if ((i = de.find(e, "PerfectOffice_MAIN")) && i.content) n = Gt.to_workbook(i.content, (t.type = s, t));
    else if ((i = de.find(e, "NativeContent_MAIN")) && i.content) n = Gt.to_workbook(i.content, (t.type = s, t));
    else throw (i = de.find(e, "MN0")) && i.content ? new Error("Unsupported Works 4 for Mac file") : new Error("Cannot find Workbook stream");
    t.bookVBA && e.FullPaths && de.find(e, "/_VBA_PROJECT_CUR/VBA/dir") && (n.vbaraw = Sp(e));
  }
  var c = {};
  return e.FullPaths && f_(
    /*::((*/
    e,
    c,
    t
  ), n.Props = n.Custprops = c, t.bookFiles && (n.cfb = e), n;
}
function u_(e, t) {
  var r = t || {}, a = de.utils.cfb_new({ root: "R" }), n = "/Workbook";
  switch (r.bookType || "xls") {
    case "xls":
      r.bookType = "biff8";
    /* falls through */
    case "xla":
      r.bookType || (r.bookType = "xla");
    /* falls through */
    case "biff8":
      n = "/Workbook", r.biff = 8;
      break;
    case "biff5":
      n = "/Book", r.biff = 5;
      break;
    default:
      throw new Error("invalid type " + r.bookType + " for XLS CFB");
  }
  return de.utils.cfb_add(a, n, kf(e, r)), r.biff == 8 && (e.Props || e.Custprops) && l_(e, a), r.biff == 8 && e.vbaraw && kp(a, de.read(e.vbaraw, { type: typeof e.vbaraw == "string" ? "binary" : "buffer" })), a;
}
var an = {
  /*::[*/
  0: {
    /* n:"BrtRowHdr", */
    f: Pv
  },
  /*::[*/
  1: {
    /* n:"BrtCellBlank", */
    f: Vv
  },
  /*::[*/
  2: {
    /* n:"BrtCellRk", */
    f: fg
  },
  /*::[*/
  3: {
    /* n:"BrtCellError", */
    f: Zv
  },
  /*::[*/
  4: {
    /* n:"BrtCellBool", */
    f: Kv
  },
  /*::[*/
  5: {
    /* n:"BrtCellReal", */
    f: sg
  },
  /*::[*/
  6: {
    /* n:"BrtCellSt", */
    f: xg
  },
  /*::[*/
  7: {
    /* n:"BrtCellIsst", */
    f: tg
  },
  /*::[*/
  8: {
    /* n:"BrtFmlaString", */
    f: Tg
  },
  /*::[*/
  9: {
    /* n:"BrtFmlaNum", */
    f: _g
  },
  /*::[*/
  10: {
    /* n:"BrtFmlaBool", */
    f: gg
  },
  /*::[*/
  11: {
    /* n:"BrtFmlaError", */
    f: Eg
  },
  /*::[*/
  12: {
    /* n:"BrtShortBlank", */
    f: Yv
  },
  /*::[*/
  13: {
    /* n:"BrtShortRk", */
    f: ug
  },
  /*::[*/
  14: {
    /* n:"BrtShortError", */
    f: eg
  },
  /*::[*/
  15: {
    /* n:"BrtShortBool", */
    f: $v
  },
  /*::[*/
  16: {
    /* n:"BrtShortReal", */
    f: mf
  },
  /*::[*/
  17: {
    /* n:"BrtShortSt", */
    f: mg
  },
  /*::[*/
  18: {
    /* n:"BrtShortIsst", */
    f: ng
  },
  /*::[*/
  19: {
    /* n:"BrtSSTItem", */
    f: fs
  },
  /*::[*/
  20: {
    /* n:"BrtPCDIMissing" */
  },
  /*::[*/
  21: {
    /* n:"BrtPCDINumber" */
  },
  /*::[*/
  22: {
    /* n:"BrtPCDIBoolean" */
  },
  /*::[*/
  23: {
    /* n:"BrtPCDIError" */
  },
  /*::[*/
  24: {
    /* n:"BrtPCDIString" */
  },
  /*::[*/
  25: {
    /* n:"BrtPCDIDatetime" */
  },
  /*::[*/
  26: {
    /* n:"BrtPCDIIndex" */
  },
  /*::[*/
  27: {
    /* n:"BrtPCDIAMissing" */
  },
  /*::[*/
  28: {
    /* n:"BrtPCDIANumber" */
  },
  /*::[*/
  29: {
    /* n:"BrtPCDIABoolean" */
  },
  /*::[*/
  30: {
    /* n:"BrtPCDIAError" */
  },
  /*::[*/
  31: {
    /* n:"BrtPCDIAString" */
  },
  /*::[*/
  32: {
    /* n:"BrtPCDIADatetime" */
  },
  /*::[*/
  33: {
    /* n:"BrtPCRRecord" */
  },
  /*::[*/
  34: {
    /* n:"BrtPCRRecordDt" */
  },
  /*::[*/
  35: {
    /* n:"BrtFRTBegin", */
    T: 1
  },
  /*::[*/
  36: {
    /* n:"BrtFRTEnd", */
    T: -1
  },
  /*::[*/
  37: {
    /* n:"BrtACBegin", */
    T: 1
  },
  /*::[*/
  38: {
    /* n:"BrtACEnd", */
    T: -1
  },
  /*::[*/
  39: {
    /* n:"BrtName", */
    f: pE
  },
  /*::[*/
  40: {
    /* n:"BrtIndexRowBlock" */
  },
  /*::[*/
  42: {
    /* n:"BrtIndexBlock" */
  },
  /*::[*/
  43: {
    /* n:"BrtFont", */
    f: xx
  },
  /*::[*/
  44: {
    /* n:"BrtFmt", */
    f: hx
  },
  /*::[*/
  45: {
    /* n:"BrtFill", */
    f: vx
  },
  /*::[*/
  46: {
    /* n:"BrtBorder", */
    f: Ex
  },
  /*::[*/
  47: {
    /* n:"BrtXF", */
    f: gx
  },
  /*::[*/
  48: {
    /* n:"BrtStyle" */
  },
  /*::[*/
  49: {
    /* n:"BrtCellMeta", */
    f: Uu
  },
  /*::[*/
  50: {
    /* n:"BrtValueMeta" */
  },
  /*::[*/
  51: {
    /* n:"BrtMdb" */
    f: Qx
  },
  /*::[*/
  52: {
    /* n:"BrtBeginFmd", */
    T: 1
  },
  /*::[*/
  53: {
    /* n:"BrtEndFmd", */
    T: -1
  },
  /*::[*/
  54: {
    /* n:"BrtBeginMdx", */
    T: 1
  },
  /*::[*/
  55: {
    /* n:"BrtEndMdx", */
    T: -1
  },
  /*::[*/
  56: {
    /* n:"BrtBeginMdxTuple", */
    T: 1
  },
  /*::[*/
  57: {
    /* n:"BrtEndMdxTuple", */
    T: -1
  },
  /*::[*/
  58: {
    /* n:"BrtMdxMbrIstr" */
  },
  /*::[*/
  59: {
    /* n:"BrtStr" */
  },
  /*::[*/
  60: {
    /* n:"BrtColInfo", */
    f: Uo
  },
  /*::[*/
  62: {
    /* n:"BrtCellRString", */
    f: dg
  },
  /*::[*/
  63: {
    /* n:"BrtCalcChainItem$", */
    f: op
  },
  /*::[*/
  64: {
    /* n:"BrtDVal", */
    f: Mg
  },
  /*::[*/
  65: {
    /* n:"BrtSxvcellNum" */
  },
  /*::[*/
  66: {
    /* n:"BrtSxvcellStr" */
  },
  /*::[*/
  67: {
    /* n:"BrtSxvcellBool" */
  },
  /*::[*/
  68: {
    /* n:"BrtSxvcellErr" */
  },
  /*::[*/
  69: {
    /* n:"BrtSxvcellDate" */
  },
  /*::[*/
  70: {
    /* n:"BrtSxvcellNil" */
  },
  /*::[*/
  128: {
    /* n:"BrtFileVersion" */
  },
  /*::[*/
  129: {
    /* n:"BrtBeginSheet", */
    T: 1
  },
  /*::[*/
  130: {
    /* n:"BrtEndSheet", */
    T: -1
  },
  /*::[*/
  131: {
    /* n:"BrtBeginBook", */
    T: 1,
    f: yr,
    p: 0
  },
  /*::[*/
  132: {
    /* n:"BrtEndBook", */
    T: -1
  },
  /*::[*/
  133: {
    /* n:"BrtBeginWsViews", */
    T: 1
  },
  /*::[*/
  134: {
    /* n:"BrtEndWsViews", */
    T: -1
  },
  /*::[*/
  135: {
    /* n:"BrtBeginBookViews", */
    T: 1
  },
  /*::[*/
  136: {
    /* n:"BrtEndBookViews", */
    T: -1
  },
  /*::[*/
  137: {
    /* n:"BrtBeginWsView", */
    T: 1,
    f: Rg
  },
  /*::[*/
  138: {
    /* n:"BrtEndWsView", */
    T: -1
  },
  /*::[*/
  139: {
    /* n:"BrtBeginCsViews", */
    T: 1
  },
  /*::[*/
  140: {
    /* n:"BrtEndCsViews", */
    T: -1
  },
  /*::[*/
  141: {
    /* n:"BrtBeginCsView", */
    T: 1
  },
  /*::[*/
  142: {
    /* n:"BrtEndCsView", */
    T: -1
  },
  /*::[*/
  143: {
    /* n:"BrtBeginBundleShs", */
    T: 1
  },
  /*::[*/
  144: {
    /* n:"BrtEndBundleShs", */
    T: -1
  },
  /*::[*/
  145: {
    /* n:"BrtBeginSheetData", */
    T: 1
  },
  /*::[*/
  146: {
    /* n:"BrtEndSheetData", */
    T: -1
  },
  /*::[*/
  147: {
    /* n:"BrtWsProp", */
    f: Hv
  },
  /*::[*/
  148: {
    /* n:"BrtWsDim", */
    f: Uv,
    p: 16
  },
  /*::[*/
  151: {
    /* n:"BrtPane", */
    f: Ag
  },
  /*::[*/
  152: {
    /* n:"BrtSel" */
  },
  /*::[*/
  153: {
    /* n:"BrtWbProp", */
    f: hE
  },
  /*::[*/
  154: {
    /* n:"BrtWbFactoid" */
  },
  /*::[*/
  155: {
    /* n:"BrtFileRecover" */
  },
  /*::[*/
  156: {
    /* n:"BrtBundleSh", */
    f: lE
  },
  /*::[*/
  157: {
    /* n:"BrtCalcProp" */
  },
  /*::[*/
  158: {
    /* n:"BrtBookView" */
  },
  /*::[*/
  159: {
    /* n:"BrtBeginSst", */
    T: 1,
    f: C1
  },
  /*::[*/
  160: {
    /* n:"BrtEndSst", */
    T: -1
  },
  /*::[*/
  161: {
    /* n:"BrtBeginAFilter", */
    T: 1,
    f: na
  },
  /*::[*/
  162: {
    /* n:"BrtEndAFilter", */
    T: -1
  },
  /*::[*/
  163: {
    /* n:"BrtBeginFilterColumn", */
    T: 1
  },
  /*::[*/
  164: {
    /* n:"BrtEndFilterColumn", */
    T: -1
  },
  /*::[*/
  165: {
    /* n:"BrtBeginFilters", */
    T: 1
  },
  /*::[*/
  166: {
    /* n:"BrtEndFilters", */
    T: -1
  },
  /*::[*/
  167: {
    /* n:"BrtFilter" */
  },
  /*::[*/
  168: {
    /* n:"BrtColorFilter" */
  },
  /*::[*/
  169: {
    /* n:"BrtIconFilter" */
  },
  /*::[*/
  170: {
    /* n:"BrtTop10Filter" */
  },
  /*::[*/
  171: {
    /* n:"BrtDynamicFilter" */
  },
  /*::[*/
  172: {
    /* n:"BrtBeginCustomFilters", */
    T: 1
  },
  /*::[*/
  173: {
    /* n:"BrtEndCustomFilters", */
    T: -1
  },
  /*::[*/
  174: {
    /* n:"BrtCustomFilter" */
  },
  /*::[*/
  175: {
    /* n:"BrtAFilterDateGroupItem" */
  },
  /*::[*/
  176: {
    /* n:"BrtMergeCell", */
    f: wg
  },
  /*::[*/
  177: {
    /* n:"BrtBeginMergeCells", */
    T: 1
  },
  /*::[*/
  178: {
    /* n:"BrtEndMergeCells", */
    T: -1
  },
  /*::[*/
  179: {
    /* n:"BrtBeginPivotCacheDef", */
    T: 1
  },
  /*::[*/
  180: {
    /* n:"BrtEndPivotCacheDef", */
    T: -1
  },
  /*::[*/
  181: {
    /* n:"BrtBeginPCDFields", */
    T: 1
  },
  /*::[*/
  182: {
    /* n:"BrtEndPCDFields", */
    T: -1
  },
  /*::[*/
  183: {
    /* n:"BrtBeginPCDField", */
    T: 1
  },
  /*::[*/
  184: {
    /* n:"BrtEndPCDField", */
    T: -1
  },
  /*::[*/
  185: {
    /* n:"BrtBeginPCDSource", */
    T: 1
  },
  /*::[*/
  186: {
    /* n:"BrtEndPCDSource", */
    T: -1
  },
  /*::[*/
  187: {
    /* n:"BrtBeginPCDSRange", */
    T: 1
  },
  /*::[*/
  188: {
    /* n:"BrtEndPCDSRange", */
    T: -1
  },
  /*::[*/
  189: {
    /* n:"BrtBeginPCDFAtbl", */
    T: 1
  },
  /*::[*/
  190: {
    /* n:"BrtEndPCDFAtbl", */
    T: -1
  },
  /*::[*/
  191: {
    /* n:"BrtBeginPCDIRun", */
    T: 1
  },
  /*::[*/
  192: {
    /* n:"BrtEndPCDIRun", */
    T: -1
  },
  /*::[*/
  193: {
    /* n:"BrtBeginPivotCacheRecords", */
    T: 1
  },
  /*::[*/
  194: {
    /* n:"BrtEndPivotCacheRecords", */
    T: -1
  },
  /*::[*/
  195: {
    /* n:"BrtBeginPCDHierarchies", */
    T: 1
  },
  /*::[*/
  196: {
    /* n:"BrtEndPCDHierarchies", */
    T: -1
  },
  /*::[*/
  197: {
    /* n:"BrtBeginPCDHierarchy", */
    T: 1
  },
  /*::[*/
  198: {
    /* n:"BrtEndPCDHierarchy", */
    T: -1
  },
  /*::[*/
  199: {
    /* n:"BrtBeginPCDHFieldsUsage", */
    T: 1
  },
  /*::[*/
  200: {
    /* n:"BrtEndPCDHFieldsUsage", */
    T: -1
  },
  /*::[*/
  201: {
    /* n:"BrtBeginExtConnection", */
    T: 1
  },
  /*::[*/
  202: {
    /* n:"BrtEndExtConnection", */
    T: -1
  },
  /*::[*/
  203: {
    /* n:"BrtBeginECDbProps", */
    T: 1
  },
  /*::[*/
  204: {
    /* n:"BrtEndECDbProps", */
    T: -1
  },
  /*::[*/
  205: {
    /* n:"BrtBeginECOlapProps", */
    T: 1
  },
  /*::[*/
  206: {
    /* n:"BrtEndECOlapProps", */
    T: -1
  },
  /*::[*/
  207: {
    /* n:"BrtBeginPCDSConsol", */
    T: 1
  },
  /*::[*/
  208: {
    /* n:"BrtEndPCDSConsol", */
    T: -1
  },
  /*::[*/
  209: {
    /* n:"BrtBeginPCDSCPages", */
    T: 1
  },
  /*::[*/
  210: {
    /* n:"BrtEndPCDSCPages", */
    T: -1
  },
  /*::[*/
  211: {
    /* n:"BrtBeginPCDSCPage", */
    T: 1
  },
  /*::[*/
  212: {
    /* n:"BrtEndPCDSCPage", */
    T: -1
  },
  /*::[*/
  213: {
    /* n:"BrtBeginPCDSCPItem", */
    T: 1
  },
  /*::[*/
  214: {
    /* n:"BrtEndPCDSCPItem", */
    T: -1
  },
  /*::[*/
  215: {
    /* n:"BrtBeginPCDSCSets", */
    T: 1
  },
  /*::[*/
  216: {
    /* n:"BrtEndPCDSCSets", */
    T: -1
  },
  /*::[*/
  217: {
    /* n:"BrtBeginPCDSCSet", */
    T: 1
  },
  /*::[*/
  218: {
    /* n:"BrtEndPCDSCSet", */
    T: -1
  },
  /*::[*/
  219: {
    /* n:"BrtBeginPCDFGroup", */
    T: 1
  },
  /*::[*/
  220: {
    /* n:"BrtEndPCDFGroup", */
    T: -1
  },
  /*::[*/
  221: {
    /* n:"BrtBeginPCDFGItems", */
    T: 1
  },
  /*::[*/
  222: {
    /* n:"BrtEndPCDFGItems", */
    T: -1
  },
  /*::[*/
  223: {
    /* n:"BrtBeginPCDFGRange", */
    T: 1
  },
  /*::[*/
  224: {
    /* n:"BrtEndPCDFGRange", */
    T: -1
  },
  /*::[*/
  225: {
    /* n:"BrtBeginPCDFGDiscrete", */
    T: 1
  },
  /*::[*/
  226: {
    /* n:"BrtEndPCDFGDiscrete", */
    T: -1
  },
  /*::[*/
  227: {
    /* n:"BrtBeginPCDSDTupleCache", */
    T: 1
  },
  /*::[*/
  228: {
    /* n:"BrtEndPCDSDTupleCache", */
    T: -1
  },
  /*::[*/
  229: {
    /* n:"BrtBeginPCDSDTCEntries", */
    T: 1
  },
  /*::[*/
  230: {
    /* n:"BrtEndPCDSDTCEntries", */
    T: -1
  },
  /*::[*/
  231: {
    /* n:"BrtBeginPCDSDTCEMembers", */
    T: 1
  },
  /*::[*/
  232: {
    /* n:"BrtEndPCDSDTCEMembers", */
    T: -1
  },
  /*::[*/
  233: {
    /* n:"BrtBeginPCDSDTCEMember", */
    T: 1
  },
  /*::[*/
  234: {
    /* n:"BrtEndPCDSDTCEMember", */
    T: -1
  },
  /*::[*/
  235: {
    /* n:"BrtBeginPCDSDTCQueries", */
    T: 1
  },
  /*::[*/
  236: {
    /* n:"BrtEndPCDSDTCQueries", */
    T: -1
  },
  /*::[*/
  237: {
    /* n:"BrtBeginPCDSDTCQuery", */
    T: 1
  },
  /*::[*/
  238: {
    /* n:"BrtEndPCDSDTCQuery", */
    T: -1
  },
  /*::[*/
  239: {
    /* n:"BrtBeginPCDSDTCSets", */
    T: 1
  },
  /*::[*/
  240: {
    /* n:"BrtEndPCDSDTCSets", */
    T: -1
  },
  /*::[*/
  241: {
    /* n:"BrtBeginPCDSDTCSet", */
    T: 1
  },
  /*::[*/
  242: {
    /* n:"BrtEndPCDSDTCSet", */
    T: -1
  },
  /*::[*/
  243: {
    /* n:"BrtBeginPCDCalcItems", */
    T: 1
  },
  /*::[*/
  244: {
    /* n:"BrtEndPCDCalcItems", */
    T: -1
  },
  /*::[*/
  245: {
    /* n:"BrtBeginPCDCalcItem", */
    T: 1
  },
  /*::[*/
  246: {
    /* n:"BrtEndPCDCalcItem", */
    T: -1
  },
  /*::[*/
  247: {
    /* n:"BrtBeginPRule", */
    T: 1
  },
  /*::[*/
  248: {
    /* n:"BrtEndPRule", */
    T: -1
  },
  /*::[*/
  249: {
    /* n:"BrtBeginPRFilters", */
    T: 1
  },
  /*::[*/
  250: {
    /* n:"BrtEndPRFilters", */
    T: -1
  },
  /*::[*/
  251: {
    /* n:"BrtBeginPRFilter", */
    T: 1
  },
  /*::[*/
  252: {
    /* n:"BrtEndPRFilter", */
    T: -1
  },
  /*::[*/
  253: {
    /* n:"BrtBeginPNames", */
    T: 1
  },
  /*::[*/
  254: {
    /* n:"BrtEndPNames", */
    T: -1
  },
  /*::[*/
  255: {
    /* n:"BrtBeginPName", */
    T: 1
  },
  /*::[*/
  256: {
    /* n:"BrtEndPName", */
    T: -1
  },
  /*::[*/
  257: {
    /* n:"BrtBeginPNPairs", */
    T: 1
  },
  /*::[*/
  258: {
    /* n:"BrtEndPNPairs", */
    T: -1
  },
  /*::[*/
  259: {
    /* n:"BrtBeginPNPair", */
    T: 1
  },
  /*::[*/
  260: {
    /* n:"BrtEndPNPair", */
    T: -1
  },
  /*::[*/
  261: {
    /* n:"BrtBeginECWebProps", */
    T: 1
  },
  /*::[*/
  262: {
    /* n:"BrtEndECWebProps", */
    T: -1
  },
  /*::[*/
  263: {
    /* n:"BrtBeginEcWpTables", */
    T: 1
  },
  /*::[*/
  264: {
    /* n:"BrtEndECWPTables", */
    T: -1
  },
  /*::[*/
  265: {
    /* n:"BrtBeginECParams", */
    T: 1
  },
  /*::[*/
  266: {
    /* n:"BrtEndECParams", */
    T: -1
  },
  /*::[*/
  267: {
    /* n:"BrtBeginECParam", */
    T: 1
  },
  /*::[*/
  268: {
    /* n:"BrtEndECParam", */
    T: -1
  },
  /*::[*/
  269: {
    /* n:"BrtBeginPCDKPIs", */
    T: 1
  },
  /*::[*/
  270: {
    /* n:"BrtEndPCDKPIs", */
    T: -1
  },
  /*::[*/
  271: {
    /* n:"BrtBeginPCDKPI", */
    T: 1
  },
  /*::[*/
  272: {
    /* n:"BrtEndPCDKPI", */
    T: -1
  },
  /*::[*/
  273: {
    /* n:"BrtBeginDims", */
    T: 1
  },
  /*::[*/
  274: {
    /* n:"BrtEndDims", */
    T: -1
  },
  /*::[*/
  275: {
    /* n:"BrtBeginDim", */
    T: 1
  },
  /*::[*/
  276: {
    /* n:"BrtEndDim", */
    T: -1
  },
  /*::[*/
  277: {
    /* n:"BrtIndexPartEnd" */
  },
  /*::[*/
  278: {
    /* n:"BrtBeginStyleSheet", */
    T: 1
  },
  /*::[*/
  279: {
    /* n:"BrtEndStyleSheet", */
    T: -1
  },
  /*::[*/
  280: {
    /* n:"BrtBeginSXView", */
    T: 1
  },
  /*::[*/
  281: {
    /* n:"BrtEndSXVI", */
    T: -1
  },
  /*::[*/
  282: {
    /* n:"BrtBeginSXVI", */
    T: 1
  },
  /*::[*/
  283: {
    /* n:"BrtBeginSXVIs", */
    T: 1
  },
  /*::[*/
  284: {
    /* n:"BrtEndSXVIs", */
    T: -1
  },
  /*::[*/
  285: {
    /* n:"BrtBeginSXVD", */
    T: 1
  },
  /*::[*/
  286: {
    /* n:"BrtEndSXVD", */
    T: -1
  },
  /*::[*/
  287: {
    /* n:"BrtBeginSXVDs", */
    T: 1
  },
  /*::[*/
  288: {
    /* n:"BrtEndSXVDs", */
    T: -1
  },
  /*::[*/
  289: {
    /* n:"BrtBeginSXPI", */
    T: 1
  },
  /*::[*/
  290: {
    /* n:"BrtEndSXPI", */
    T: -1
  },
  /*::[*/
  291: {
    /* n:"BrtBeginSXPIs", */
    T: 1
  },
  /*::[*/
  292: {
    /* n:"BrtEndSXPIs", */
    T: -1
  },
  /*::[*/
  293: {
    /* n:"BrtBeginSXDI", */
    T: 1
  },
  /*::[*/
  294: {
    /* n:"BrtEndSXDI", */
    T: -1
  },
  /*::[*/
  295: {
    /* n:"BrtBeginSXDIs", */
    T: 1
  },
  /*::[*/
  296: {
    /* n:"BrtEndSXDIs", */
    T: -1
  },
  /*::[*/
  297: {
    /* n:"BrtBeginSXLI", */
    T: 1
  },
  /*::[*/
  298: {
    /* n:"BrtEndSXLI", */
    T: -1
  },
  /*::[*/
  299: {
    /* n:"BrtBeginSXLIRws", */
    T: 1
  },
  /*::[*/
  300: {
    /* n:"BrtEndSXLIRws", */
    T: -1
  },
  /*::[*/
  301: {
    /* n:"BrtBeginSXLICols", */
    T: 1
  },
  /*::[*/
  302: {
    /* n:"BrtEndSXLICols", */
    T: -1
  },
  /*::[*/
  303: {
    /* n:"BrtBeginSXFormat", */
    T: 1
  },
  /*::[*/
  304: {
    /* n:"BrtEndSXFormat", */
    T: -1
  },
  /*::[*/
  305: {
    /* n:"BrtBeginSXFormats", */
    T: 1
  },
  /*::[*/
  306: {
    /* n:"BrtEndSxFormats", */
    T: -1
  },
  /*::[*/
  307: {
    /* n:"BrtBeginSxSelect", */
    T: 1
  },
  /*::[*/
  308: {
    /* n:"BrtEndSxSelect", */
    T: -1
  },
  /*::[*/
  309: {
    /* n:"BrtBeginISXVDRws", */
    T: 1
  },
  /*::[*/
  310: {
    /* n:"BrtEndISXVDRws", */
    T: -1
  },
  /*::[*/
  311: {
    /* n:"BrtBeginISXVDCols", */
    T: 1
  },
  /*::[*/
  312: {
    /* n:"BrtEndISXVDCols", */
    T: -1
  },
  /*::[*/
  313: {
    /* n:"BrtEndSXLocation", */
    T: -1
  },
  /*::[*/
  314: {
    /* n:"BrtBeginSXLocation", */
    T: 1
  },
  /*::[*/
  315: {
    /* n:"BrtEndSXView", */
    T: -1
  },
  /*::[*/
  316: {
    /* n:"BrtBeginSXTHs", */
    T: 1
  },
  /*::[*/
  317: {
    /* n:"BrtEndSXTHs", */
    T: -1
  },
  /*::[*/
  318: {
    /* n:"BrtBeginSXTH", */
    T: 1
  },
  /*::[*/
  319: {
    /* n:"BrtEndSXTH", */
    T: -1
  },
  /*::[*/
  320: {
    /* n:"BrtBeginISXTHRws", */
    T: 1
  },
  /*::[*/
  321: {
    /* n:"BrtEndISXTHRws", */
    T: -1
  },
  /*::[*/
  322: {
    /* n:"BrtBeginISXTHCols", */
    T: 1
  },
  /*::[*/
  323: {
    /* n:"BrtEndISXTHCols", */
    T: -1
  },
  /*::[*/
  324: {
    /* n:"BrtBeginSXTDMPS", */
    T: 1
  },
  /*::[*/
  325: {
    /* n:"BrtEndSXTDMPs", */
    T: -1
  },
  /*::[*/
  326: {
    /* n:"BrtBeginSXTDMP", */
    T: 1
  },
  /*::[*/
  327: {
    /* n:"BrtEndSXTDMP", */
    T: -1
  },
  /*::[*/
  328: {
    /* n:"BrtBeginSXTHItems", */
    T: 1
  },
  /*::[*/
  329: {
    /* n:"BrtEndSXTHItems", */
    T: -1
  },
  /*::[*/
  330: {
    /* n:"BrtBeginSXTHItem", */
    T: 1
  },
  /*::[*/
  331: {
    /* n:"BrtEndSXTHItem", */
    T: -1
  },
  /*::[*/
  332: {
    /* n:"BrtBeginMetadata", */
    T: 1
  },
  /*::[*/
  333: {
    /* n:"BrtEndMetadata", */
    T: -1
  },
  /*::[*/
  334: {
    /* n:"BrtBeginEsmdtinfo", */
    T: 1
  },
  /*::[*/
  335: {
    /* n:"BrtMdtinfo", */
    f: Jx
  },
  /*::[*/
  336: {
    /* n:"BrtEndEsmdtinfo", */
    T: -1
  },
  /*::[*/
  337: {
    /* n:"BrtBeginEsmdb", */
    f: tp,
    T: 1
  },
  /*::[*/
  338: {
    /* n:"BrtEndEsmdb", */
    T: -1
  },
  /*::[*/
  339: {
    /* n:"BrtBeginEsfmd", */
    T: 1
  },
  /*::[*/
  340: {
    /* n:"BrtEndEsfmd", */
    T: -1
  },
  /*::[*/
  341: {
    /* n:"BrtBeginSingleCells", */
    T: 1
  },
  /*::[*/
  342: {
    /* n:"BrtEndSingleCells", */
    T: -1
  },
  /*::[*/
  343: {
    /* n:"BrtBeginList", */
    T: 1
  },
  /*::[*/
  344: {
    /* n:"BrtEndList", */
    T: -1
  },
  /*::[*/
  345: {
    /* n:"BrtBeginListCols", */
    T: 1
  },
  /*::[*/
  346: {
    /* n:"BrtEndListCols", */
    T: -1
  },
  /*::[*/
  347: {
    /* n:"BrtBeginListCol", */
    T: 1
  },
  /*::[*/
  348: {
    /* n:"BrtEndListCol", */
    T: -1
  },
  /*::[*/
  349: {
    /* n:"BrtBeginListXmlCPr", */
    T: 1
  },
  /*::[*/
  350: {
    /* n:"BrtEndListXmlCPr", */
    T: -1
  },
  /*::[*/
  351: {
    /* n:"BrtListCCFmla" */
  },
  /*::[*/
  352: {
    /* n:"BrtListTrFmla" */
  },
  /*::[*/
  353: {
    /* n:"BrtBeginExternals", */
    T: 1
  },
  /*::[*/
  354: {
    /* n:"BrtEndExternals", */
    T: -1
  },
  /*::[*/
  355: {
    /* n:"BrtSupBookSrc", */
    f: Ri
  },
  /*::[*/
  357: {
    /* n:"BrtSupSelf" */
  },
  /*::[*/
  358: {
    /* n:"BrtSupSame" */
  },
  /*::[*/
  359: {
    /* n:"BrtSupTabs" */
  },
  /*::[*/
  360: {
    /* n:"BrtBeginSupBook", */
    T: 1
  },
  /*::[*/
  361: {
    /* n:"BrtPlaceholderName" */
  },
  /*::[*/
  362: {
    /* n:"BrtExternSheet", */
    f: Bo
  },
  /*::[*/
  363: {
    /* n:"BrtExternTableStart" */
  },
  /*::[*/
  364: {
    /* n:"BrtExternTableEnd" */
  },
  /*::[*/
  366: {
    /* n:"BrtExternRowHdr" */
  },
  /*::[*/
  367: {
    /* n:"BrtExternCellBlank" */
  },
  /*::[*/
  368: {
    /* n:"BrtExternCellReal" */
  },
  /*::[*/
  369: {
    /* n:"BrtExternCellBool" */
  },
  /*::[*/
  370: {
    /* n:"BrtExternCellError" */
  },
  /*::[*/
  371: {
    /* n:"BrtExternCellString" */
  },
  /*::[*/
  372: {
    /* n:"BrtBeginEsmdx", */
    T: 1
  },
  /*::[*/
  373: {
    /* n:"BrtEndEsmdx", */
    T: -1
  },
  /*::[*/
  374: {
    /* n:"BrtBeginMdxSet", */
    T: 1
  },
  /*::[*/
  375: {
    /* n:"BrtEndMdxSet", */
    T: -1
  },
  /*::[*/
  376: {
    /* n:"BrtBeginMdxMbrProp", */
    T: 1
  },
  /*::[*/
  377: {
    /* n:"BrtEndMdxMbrProp", */
    T: -1
  },
  /*::[*/
  378: {
    /* n:"BrtBeginMdxKPI", */
    T: 1
  },
  /*::[*/
  379: {
    /* n:"BrtEndMdxKPI", */
    T: -1
  },
  /*::[*/
  380: {
    /* n:"BrtBeginEsstr", */
    T: 1
  },
  /*::[*/
  381: {
    /* n:"BrtEndEsstr", */
    T: -1
  },
  /*::[*/
  382: {
    /* n:"BrtBeginPRFItem", */
    T: 1
  },
  /*::[*/
  383: {
    /* n:"BrtEndPRFItem", */
    T: -1
  },
  /*::[*/
  384: {
    /* n:"BrtBeginPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  385: {
    /* n:"BrtEndPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  386: {
    /* n:"BrtBeginPivotCacheID", */
    T: 1
  },
  /*::[*/
  387: {
    /* n:"BrtEndPivotCacheID", */
    T: -1
  },
  /*::[*/
  388: {
    /* n:"BrtBeginISXVIs", */
    T: 1
  },
  /*::[*/
  389: {
    /* n:"BrtEndISXVIs", */
    T: -1
  },
  /*::[*/
  390: {
    /* n:"BrtBeginColInfos", */
    T: 1
  },
  /*::[*/
  391: {
    /* n:"BrtEndColInfos", */
    T: -1
  },
  /*::[*/
  392: {
    /* n:"BrtBeginRwBrk", */
    T: 1
  },
  /*::[*/
  393: {
    /* n:"BrtEndRwBrk", */
    T: -1
  },
  /*::[*/
  394: {
    /* n:"BrtBeginColBrk", */
    T: 1
  },
  /*::[*/
  395: {
    /* n:"BrtEndColBrk", */
    T: -1
  },
  /*::[*/
  396: {
    /* n:"BrtBrk" */
  },
  /*::[*/
  397: {
    /* n:"BrtUserBookView" */
  },
  /*::[*/
  398: {
    /* n:"BrtInfo" */
  },
  /*::[*/
  399: {
    /* n:"BrtCUsr" */
  },
  /*::[*/
  400: {
    /* n:"BrtUsr" */
  },
  /*::[*/
  401: {
    /* n:"BrtBeginUsers", */
    T: 1
  },
  /*::[*/
  403: {
    /* n:"BrtEOF" */
  },
  /*::[*/
  404: {
    /* n:"BrtUCR" */
  },
  /*::[*/
  405: {
    /* n:"BrtRRInsDel" */
  },
  /*::[*/
  406: {
    /* n:"BrtRREndInsDel" */
  },
  /*::[*/
  407: {
    /* n:"BrtRRMove" */
  },
  /*::[*/
  408: {
    /* n:"BrtRREndMove" */
  },
  /*::[*/
  409: {
    /* n:"BrtRRChgCell" */
  },
  /*::[*/
  410: {
    /* n:"BrtRREndChgCell" */
  },
  /*::[*/
  411: {
    /* n:"BrtRRHeader" */
  },
  /*::[*/
  412: {
    /* n:"BrtRRUserView" */
  },
  /*::[*/
  413: {
    /* n:"BrtRRRenSheet" */
  },
  /*::[*/
  414: {
    /* n:"BrtRRInsertSh" */
  },
  /*::[*/
  415: {
    /* n:"BrtRRDefName" */
  },
  /*::[*/
  416: {
    /* n:"BrtRRNote" */
  },
  /*::[*/
  417: {
    /* n:"BrtRRConflict" */
  },
  /*::[*/
  418: {
    /* n:"BrtRRTQSIF" */
  },
  /*::[*/
  419: {
    /* n:"BrtRRFormat" */
  },
  /*::[*/
  420: {
    /* n:"BrtRREndFormat" */
  },
  /*::[*/
  421: {
    /* n:"BrtRRAutoFmt" */
  },
  /*::[*/
  422: {
    /* n:"BrtBeginUserShViews", */
    T: 1
  },
  /*::[*/
  423: {
    /* n:"BrtBeginUserShView", */
    T: 1
  },
  /*::[*/
  424: {
    /* n:"BrtEndUserShView", */
    T: -1
  },
  /*::[*/
  425: {
    /* n:"BrtEndUserShViews", */
    T: -1
  },
  /*::[*/
  426: {
    /* n:"BrtArrFmla", */
    f: Ng
  },
  /*::[*/
  427: {
    /* n:"BrtShrFmla", */
    f: Cg
  },
  /*::[*/
  428: {
    /* n:"BrtTable" */
  },
  /*::[*/
  429: {
    /* n:"BrtBeginExtConnections", */
    T: 1
  },
  /*::[*/
  430: {
    /* n:"BrtEndExtConnections", */
    T: -1
  },
  /*::[*/
  431: {
    /* n:"BrtBeginPCDCalcMems", */
    T: 1
  },
  /*::[*/
  432: {
    /* n:"BrtEndPCDCalcMems", */
    T: -1
  },
  /*::[*/
  433: {
    /* n:"BrtBeginPCDCalcMem", */
    T: 1
  },
  /*::[*/
  434: {
    /* n:"BrtEndPCDCalcMem", */
    T: -1
  },
  /*::[*/
  435: {
    /* n:"BrtBeginPCDHGLevels", */
    T: 1
  },
  /*::[*/
  436: {
    /* n:"BrtEndPCDHGLevels", */
    T: -1
  },
  /*::[*/
  437: {
    /* n:"BrtBeginPCDHGLevel", */
    T: 1
  },
  /*::[*/
  438: {
    /* n:"BrtEndPCDHGLevel", */
    T: -1
  },
  /*::[*/
  439: {
    /* n:"BrtBeginPCDHGLGroups", */
    T: 1
  },
  /*::[*/
  440: {
    /* n:"BrtEndPCDHGLGroups", */
    T: -1
  },
  /*::[*/
  441: {
    /* n:"BrtBeginPCDHGLGroup", */
    T: 1
  },
  /*::[*/
  442: {
    /* n:"BrtEndPCDHGLGroup", */
    T: -1
  },
  /*::[*/
  443: {
    /* n:"BrtBeginPCDHGLGMembers", */
    T: 1
  },
  /*::[*/
  444: {
    /* n:"BrtEndPCDHGLGMembers", */
    T: -1
  },
  /*::[*/
  445: {
    /* n:"BrtBeginPCDHGLGMember", */
    T: 1
  },
  /*::[*/
  446: {
    /* n:"BrtEndPCDHGLGMember", */
    T: -1
  },
  /*::[*/
  447: {
    /* n:"BrtBeginQSI", */
    T: 1
  },
  /*::[*/
  448: {
    /* n:"BrtEndQSI", */
    T: -1
  },
  /*::[*/
  449: {
    /* n:"BrtBeginQSIR", */
    T: 1
  },
  /*::[*/
  450: {
    /* n:"BrtEndQSIR", */
    T: -1
  },
  /*::[*/
  451: {
    /* n:"BrtBeginDeletedNames", */
    T: 1
  },
  /*::[*/
  452: {
    /* n:"BrtEndDeletedNames", */
    T: -1
  },
  /*::[*/
  453: {
    /* n:"BrtBeginDeletedName", */
    T: 1
  },
  /*::[*/
  454: {
    /* n:"BrtEndDeletedName", */
    T: -1
  },
  /*::[*/
  455: {
    /* n:"BrtBeginQSIFs", */
    T: 1
  },
  /*::[*/
  456: {
    /* n:"BrtEndQSIFs", */
    T: -1
  },
  /*::[*/
  457: {
    /* n:"BrtBeginQSIF", */
    T: 1
  },
  /*::[*/
  458: {
    /* n:"BrtEndQSIF", */
    T: -1
  },
  /*::[*/
  459: {
    /* n:"BrtBeginAutoSortScope", */
    T: 1
  },
  /*::[*/
  460: {
    /* n:"BrtEndAutoSortScope", */
    T: -1
  },
  /*::[*/
  461: {
    /* n:"BrtBeginConditionalFormatting", */
    T: 1
  },
  /*::[*/
  462: {
    /* n:"BrtEndConditionalFormatting", */
    T: -1
  },
  /*::[*/
  463: {
    /* n:"BrtBeginCFRule", */
    T: 1
  },
  /*::[*/
  464: {
    /* n:"BrtEndCFRule", */
    T: -1
  },
  /*::[*/
  465: {
    /* n:"BrtBeginIconSet", */
    T: 1
  },
  /*::[*/
  466: {
    /* n:"BrtEndIconSet", */
    T: -1
  },
  /*::[*/
  467: {
    /* n:"BrtBeginDatabar", */
    T: 1
  },
  /*::[*/
  468: {
    /* n:"BrtEndDatabar", */
    T: -1
  },
  /*::[*/
  469: {
    /* n:"BrtBeginColorScale", */
    T: 1
  },
  /*::[*/
  470: {
    /* n:"BrtEndColorScale", */
    T: -1
  },
  /*::[*/
  471: {
    /* n:"BrtCFVO" */
  },
  /*::[*/
  472: {
    /* n:"BrtExternValueMeta" */
  },
  /*::[*/
  473: {
    /* n:"BrtBeginColorPalette", */
    T: 1
  },
  /*::[*/
  474: {
    /* n:"BrtEndColorPalette", */
    T: -1
  },
  /*::[*/
  475: {
    /* n:"BrtIndexedColor" */
  },
  /*::[*/
  476: {
    /* n:"BrtMargins", */
    f: Ig
  },
  /*::[*/
  477: {
    /* n:"BrtPrintOptions" */
  },
  /*::[*/
  478: {
    /* n:"BrtPageSetup" */
  },
  /*::[*/
  479: {
    /* n:"BrtBeginHeaderFooter", */
    T: 1
  },
  /*::[*/
  480: {
    /* n:"BrtEndHeaderFooter", */
    T: -1
  },
  /*::[*/
  481: {
    /* n:"BrtBeginSXCrtFormat", */
    T: 1
  },
  /*::[*/
  482: {
    /* n:"BrtEndSXCrtFormat", */
    T: -1
  },
  /*::[*/
  483: {
    /* n:"BrtBeginSXCrtFormats", */
    T: 1
  },
  /*::[*/
  484: {
    /* n:"BrtEndSXCrtFormats", */
    T: -1
  },
  /*::[*/
  485: {
    /* n:"BrtWsFmtInfo", */
    f: Wv
  },
  /*::[*/
  486: {
    /* n:"BrtBeginMgs", */
    T: 1
  },
  /*::[*/
  487: {
    /* n:"BrtEndMGs", */
    T: -1
  },
  /*::[*/
  488: {
    /* n:"BrtBeginMGMaps", */
    T: 1
  },
  /*::[*/
  489: {
    /* n:"BrtEndMGMaps", */
    T: -1
  },
  /*::[*/
  490: {
    /* n:"BrtBeginMG", */
    T: 1
  },
  /*::[*/
  491: {
    /* n:"BrtEndMG", */
    T: -1
  },
  /*::[*/
  492: {
    /* n:"BrtBeginMap", */
    T: 1
  },
  /*::[*/
  493: {
    /* n:"BrtEndMap", */
    T: -1
  },
  /*::[*/
  494: {
    /* n:"BrtHLink", */
    f: kg
  },
  /*::[*/
  495: {
    /* n:"BrtBeginDCon", */
    T: 1
  },
  /*::[*/
  496: {
    /* n:"BrtEndDCon", */
    T: -1
  },
  /*::[*/
  497: {
    /* n:"BrtBeginDRefs", */
    T: 1
  },
  /*::[*/
  498: {
    /* n:"BrtEndDRefs", */
    T: -1
  },
  /*::[*/
  499: {
    /* n:"BrtDRef" */
  },
  /*::[*/
  500: {
    /* n:"BrtBeginScenMan", */
    T: 1
  },
  /*::[*/
  501: {
    /* n:"BrtEndScenMan", */
    T: -1
  },
  /*::[*/
  502: {
    /* n:"BrtBeginSct", */
    T: 1
  },
  /*::[*/
  503: {
    /* n:"BrtEndSct", */
    T: -1
  },
  /*::[*/
  504: {
    /* n:"BrtSlc" */
  },
  /*::[*/
  505: {
    /* n:"BrtBeginDXFs", */
    T: 1
  },
  /*::[*/
  506: {
    /* n:"BrtEndDXFs", */
    T: -1
  },
  /*::[*/
  507: {
    /* n:"BrtDXF" */
  },
  /*::[*/
  508: {
    /* n:"BrtBeginTableStyles", */
    T: 1
  },
  /*::[*/
  509: {
    /* n:"BrtEndTableStyles", */
    T: -1
  },
  /*::[*/
  510: {
    /* n:"BrtBeginTableStyle", */
    T: 1
  },
  /*::[*/
  511: {
    /* n:"BrtEndTableStyle", */
    T: -1
  },
  /*::[*/
  512: {
    /* n:"BrtTableStyleElement" */
  },
  /*::[*/
  513: {
    /* n:"BrtTableStyleClient" */
  },
  /*::[*/
  514: {
    /* n:"BrtBeginVolDeps", */
    T: 1
  },
  /*::[*/
  515: {
    /* n:"BrtEndVolDeps", */
    T: -1
  },
  /*::[*/
  516: {
    /* n:"BrtBeginVolType", */
    T: 1
  },
  /*::[*/
  517: {
    /* n:"BrtEndVolType", */
    T: -1
  },
  /*::[*/
  518: {
    /* n:"BrtBeginVolMain", */
    T: 1
  },
  /*::[*/
  519: {
    /* n:"BrtEndVolMain", */
    T: -1
  },
  /*::[*/
  520: {
    /* n:"BrtBeginVolTopic", */
    T: 1
  },
  /*::[*/
  521: {
    /* n:"BrtEndVolTopic", */
    T: -1
  },
  /*::[*/
  522: {
    /* n:"BrtVolSubtopic" */
  },
  /*::[*/
  523: {
    /* n:"BrtVolRef" */
  },
  /*::[*/
  524: {
    /* n:"BrtVolNum" */
  },
  /*::[*/
  525: {
    /* n:"BrtVolErr" */
  },
  /*::[*/
  526: {
    /* n:"BrtVolStr" */
  },
  /*::[*/
  527: {
    /* n:"BrtVolBool" */
  },
  /*::[*/
  528: {
    /* n:"BrtBeginCalcChain$", */
    T: 1
  },
  /*::[*/
  529: {
    /* n:"BrtEndCalcChain$", */
    T: -1
  },
  /*::[*/
  530: {
    /* n:"BrtBeginSortState", */
    T: 1
  },
  /*::[*/
  531: {
    /* n:"BrtEndSortState", */
    T: -1
  },
  /*::[*/
  532: {
    /* n:"BrtBeginSortCond", */
    T: 1
  },
  /*::[*/
  533: {
    /* n:"BrtEndSortCond", */
    T: -1
  },
  /*::[*/
  534: {
    /* n:"BrtBookProtection" */
  },
  /*::[*/
  535: {
    /* n:"BrtSheetProtection" */
  },
  /*::[*/
  536: {
    /* n:"BrtRangeProtection" */
  },
  /*::[*/
  537: {
    /* n:"BrtPhoneticInfo" */
  },
  /*::[*/
  538: {
    /* n:"BrtBeginECTxtWiz", */
    T: 1
  },
  /*::[*/
  539: {
    /* n:"BrtEndECTxtWiz", */
    T: -1
  },
  /*::[*/
  540: {
    /* n:"BrtBeginECTWFldInfoLst", */
    T: 1
  },
  /*::[*/
  541: {
    /* n:"BrtEndECTWFldInfoLst", */
    T: -1
  },
  /*::[*/
  542: {
    /* n:"BrtBeginECTwFldInfo", */
    T: 1
  },
  /*::[*/
  548: {
    /* n:"BrtFileSharing" */
  },
  /*::[*/
  549: {
    /* n:"BrtOleSize" */
  },
  /*::[*/
  550: {
    /* n:"BrtDrawing", */
    f: Ri
  },
  /*::[*/
  551: {
    /* n:"BrtLegacyDrawing" */
  },
  /*::[*/
  552: {
    /* n:"BrtLegacyDrawingHF" */
  },
  /*::[*/
  553: {
    /* n:"BrtWebOpt" */
  },
  /*::[*/
  554: {
    /* n:"BrtBeginWebPubItems", */
    T: 1
  },
  /*::[*/
  555: {
    /* n:"BrtEndWebPubItems", */
    T: -1
  },
  /*::[*/
  556: {
    /* n:"BrtBeginWebPubItem", */
    T: 1
  },
  /*::[*/
  557: {
    /* n:"BrtEndWebPubItem", */
    T: -1
  },
  /*::[*/
  558: {
    /* n:"BrtBeginSXCondFmt", */
    T: 1
  },
  /*::[*/
  559: {
    /* n:"BrtEndSXCondFmt", */
    T: -1
  },
  /*::[*/
  560: {
    /* n:"BrtBeginSXCondFmts", */
    T: 1
  },
  /*::[*/
  561: {
    /* n:"BrtEndSXCondFmts", */
    T: -1
  },
  /*::[*/
  562: {
    /* n:"BrtBkHim" */
  },
  /*::[*/
  564: {
    /* n:"BrtColor" */
  },
  /*::[*/
  565: {
    /* n:"BrtBeginIndexedColors", */
    T: 1
  },
  /*::[*/
  566: {
    /* n:"BrtEndIndexedColors", */
    T: -1
  },
  /*::[*/
  569: {
    /* n:"BrtBeginMRUColors", */
    T: 1
  },
  /*::[*/
  570: {
    /* n:"BrtEndMRUColors", */
    T: -1
  },
  /*::[*/
  572: {
    /* n:"BrtMRUColor" */
  },
  /*::[*/
  573: {
    /* n:"BrtBeginDVals", */
    T: 1
  },
  /*::[*/
  574: {
    /* n:"BrtEndDVals", */
    T: -1
  },
  /*::[*/
  577: {
    /* n:"BrtSupNameStart" */
  },
  /*::[*/
  578: {
    /* n:"BrtSupNameValueStart" */
  },
  /*::[*/
  579: {
    /* n:"BrtSupNameValueEnd" */
  },
  /*::[*/
  580: {
    /* n:"BrtSupNameNum" */
  },
  /*::[*/
  581: {
    /* n:"BrtSupNameErr" */
  },
  /*::[*/
  582: {
    /* n:"BrtSupNameSt" */
  },
  /*::[*/
  583: {
    /* n:"BrtSupNameNil" */
  },
  /*::[*/
  584: {
    /* n:"BrtSupNameBool" */
  },
  /*::[*/
  585: {
    /* n:"BrtSupNameFmla" */
  },
  /*::[*/
  586: {
    /* n:"BrtSupNameBits" */
  },
  /*::[*/
  587: {
    /* n:"BrtSupNameEnd" */
  },
  /*::[*/
  588: {
    /* n:"BrtEndSupBook", */
    T: -1
  },
  /*::[*/
  589: {
    /* n:"BrtCellSmartTagProperty" */
  },
  /*::[*/
  590: {
    /* n:"BrtBeginCellSmartTag", */
    T: 1
  },
  /*::[*/
  591: {
    /* n:"BrtEndCellSmartTag", */
    T: -1
  },
  /*::[*/
  592: {
    /* n:"BrtBeginCellSmartTags", */
    T: 1
  },
  /*::[*/
  593: {
    /* n:"BrtEndCellSmartTags", */
    T: -1
  },
  /*::[*/
  594: {
    /* n:"BrtBeginSmartTags", */
    T: 1
  },
  /*::[*/
  595: {
    /* n:"BrtEndSmartTags", */
    T: -1
  },
  /*::[*/
  596: {
    /* n:"BrtSmartTagType" */
  },
  /*::[*/
  597: {
    /* n:"BrtBeginSmartTagTypes", */
    T: 1
  },
  /*::[*/
  598: {
    /* n:"BrtEndSmartTagTypes", */
    T: -1
  },
  /*::[*/
  599: {
    /* n:"BrtBeginSXFilters", */
    T: 1
  },
  /*::[*/
  600: {
    /* n:"BrtEndSXFilters", */
    T: -1
  },
  /*::[*/
  601: {
    /* n:"BrtBeginSXFILTER", */
    T: 1
  },
  /*::[*/
  602: {
    /* n:"BrtEndSXFilter", */
    T: -1
  },
  /*::[*/
  603: {
    /* n:"BrtBeginFills", */
    T: 1
  },
  /*::[*/
  604: {
    /* n:"BrtEndFills", */
    T: -1
  },
  /*::[*/
  605: {
    /* n:"BrtBeginCellWatches", */
    T: 1
  },
  /*::[*/
  606: {
    /* n:"BrtEndCellWatches", */
    T: -1
  },
  /*::[*/
  607: {
    /* n:"BrtCellWatch" */
  },
  /*::[*/
  608: {
    /* n:"BrtBeginCRErrs", */
    T: 1
  },
  /*::[*/
  609: {
    /* n:"BrtEndCRErrs", */
    T: -1
  },
  /*::[*/
  610: {
    /* n:"BrtCrashRecErr" */
  },
  /*::[*/
  611: {
    /* n:"BrtBeginFonts", */
    T: 1
  },
  /*::[*/
  612: {
    /* n:"BrtEndFonts", */
    T: -1
  },
  /*::[*/
  613: {
    /* n:"BrtBeginBorders", */
    T: 1
  },
  /*::[*/
  614: {
    /* n:"BrtEndBorders", */
    T: -1
  },
  /*::[*/
  615: {
    /* n:"BrtBeginFmts", */
    T: 1
  },
  /*::[*/
  616: {
    /* n:"BrtEndFmts", */
    T: -1
  },
  /*::[*/
  617: {
    /* n:"BrtBeginCellXFs", */
    T: 1
  },
  /*::[*/
  618: {
    /* n:"BrtEndCellXFs", */
    T: -1
  },
  /*::[*/
  619: {
    /* n:"BrtBeginStyles", */
    T: 1
  },
  /*::[*/
  620: {
    /* n:"BrtEndStyles", */
    T: -1
  },
  /*::[*/
  625: {
    /* n:"BrtBigName" */
  },
  /*::[*/
  626: {
    /* n:"BrtBeginCellStyleXFs", */
    T: 1
  },
  /*::[*/
  627: {
    /* n:"BrtEndCellStyleXFs", */
    T: -1
  },
  /*::[*/
  628: {
    /* n:"BrtBeginComments", */
    T: 1
  },
  /*::[*/
  629: {
    /* n:"BrtEndComments", */
    T: -1
  },
  /*::[*/
  630: {
    /* n:"BrtBeginCommentAuthors", */
    T: 1
  },
  /*::[*/
  631: {
    /* n:"BrtEndCommentAuthors", */
    T: -1
  },
  /*::[*/
  632: {
    /* n:"BrtCommentAuthor", */
    f: Ep
  },
  /*::[*/
  633: {
    /* n:"BrtBeginCommentList", */
    T: 1
  },
  /*::[*/
  634: {
    /* n:"BrtEndCommentList", */
    T: -1
  },
  /*::[*/
  635: {
    /* n:"BrtBeginComment", */
    T: 1,
    f: vp
  },
  /*::[*/
  636: {
    /* n:"BrtEndComment", */
    T: -1
  },
  /*::[*/
  637: {
    /* n:"BrtCommentText", */
    f: Gu
  },
  /*::[*/
  638: {
    /* n:"BrtBeginOleObjects", */
    T: 1
  },
  /*::[*/
  639: {
    /* n:"BrtOleObject" */
  },
  /*::[*/
  640: {
    /* n:"BrtEndOleObjects", */
    T: -1
  },
  /*::[*/
  641: {
    /* n:"BrtBeginSxrules", */
    T: 1
  },
  /*::[*/
  642: {
    /* n:"BrtEndSxRules", */
    T: -1
  },
  /*::[*/
  643: {
    /* n:"BrtBeginActiveXControls", */
    T: 1
  },
  /*::[*/
  644: {
    /* n:"BrtActiveX" */
  },
  /*::[*/
  645: {
    /* n:"BrtEndActiveXControls", */
    T: -1
  },
  /*::[*/
  646: {
    /* n:"BrtBeginPCDSDTCEMembersSortBy", */
    T: 1
  },
  /*::[*/
  648: {
    /* n:"BrtBeginCellIgnoreECs", */
    T: 1
  },
  /*::[*/
  649: {
    /* n:"BrtCellIgnoreEC" */
  },
  /*::[*/
  650: {
    /* n:"BrtEndCellIgnoreECs", */
    T: -1
  },
  /*::[*/
  651: {
    /* n:"BrtCsProp", */
    f: eE
  },
  /*::[*/
  652: {
    /* n:"BrtCsPageSetup" */
  },
  /*::[*/
  653: {
    /* n:"BrtBeginUserCsViews", */
    T: 1
  },
  /*::[*/
  654: {
    /* n:"BrtEndUserCsViews", */
    T: -1
  },
  /*::[*/
  655: {
    /* n:"BrtBeginUserCsView", */
    T: 1
  },
  /*::[*/
  656: {
    /* n:"BrtEndUserCsView", */
    T: -1
  },
  /*::[*/
  657: {
    /* n:"BrtBeginPcdSFCIEntries", */
    T: 1
  },
  /*::[*/
  658: {
    /* n:"BrtEndPCDSFCIEntries", */
    T: -1
  },
  /*::[*/
  659: {
    /* n:"BrtPCDSFCIEntry" */
  },
  /*::[*/
  660: {
    /* n:"BrtBeginListParts", */
    T: 1
  },
  /*::[*/
  661: {
    /* n:"BrtListPart" */
  },
  /*::[*/
  662: {
    /* n:"BrtEndListParts", */
    T: -1
  },
  /*::[*/
  663: {
    /* n:"BrtSheetCalcProp" */
  },
  /*::[*/
  664: {
    /* n:"BrtBeginFnGroup", */
    T: 1
  },
  /*::[*/
  665: {
    /* n:"BrtFnGroup" */
  },
  /*::[*/
  666: {
    /* n:"BrtEndFnGroup", */
    T: -1
  },
  /*::[*/
  667: {
    /* n:"BrtSupAddin" */
  },
  /*::[*/
  668: {
    /* n:"BrtSXTDMPOrder" */
  },
  /*::[*/
  669: {
    /* n:"BrtCsProtection" */
  },
  /*::[*/
  671: {
    /* n:"BrtBeginWsSortMap", */
    T: 1
  },
  /*::[*/
  672: {
    /* n:"BrtEndWsSortMap", */
    T: -1
  },
  /*::[*/
  673: {
    /* n:"BrtBeginRRSort", */
    T: 1
  },
  /*::[*/
  674: {
    /* n:"BrtEndRRSort", */
    T: -1
  },
  /*::[*/
  675: {
    /* n:"BrtRRSortItem" */
  },
  /*::[*/
  676: {
    /* n:"BrtFileSharingIso" */
  },
  /*::[*/
  677: {
    /* n:"BrtBookProtectionIso" */
  },
  /*::[*/
  678: {
    /* n:"BrtSheetProtectionIso" */
  },
  /*::[*/
  679: {
    /* n:"BrtCsProtectionIso" */
  },
  /*::[*/
  680: {
    /* n:"BrtRangeProtectionIso" */
  },
  /*::[*/
  681: {
    /* n:"BrtDValList" */
  },
  /*::[*/
  1024: {
    /* n:"BrtRwDescent" */
  },
  /*::[*/
  1025: {
    /* n:"BrtKnownFonts" */
  },
  /*::[*/
  1026: {
    /* n:"BrtBeginSXTupleSet", */
    T: 1
  },
  /*::[*/
  1027: {
    /* n:"BrtEndSXTupleSet", */
    T: -1
  },
  /*::[*/
  1028: {
    /* n:"BrtBeginSXTupleSetHeader", */
    T: 1
  },
  /*::[*/
  1029: {
    /* n:"BrtEndSXTupleSetHeader", */
    T: -1
  },
  /*::[*/
  1030: {
    /* n:"BrtSXTupleSetHeaderItem" */
  },
  /*::[*/
  1031: {
    /* n:"BrtBeginSXTupleSetData", */
    T: 1
  },
  /*::[*/
  1032: {
    /* n:"BrtEndSXTupleSetData", */
    T: -1
  },
  /*::[*/
  1033: {
    /* n:"BrtBeginSXTupleSetRow", */
    T: 1
  },
  /*::[*/
  1034: {
    /* n:"BrtEndSXTupleSetRow", */
    T: -1
  },
  /*::[*/
  1035: {
    /* n:"BrtSXTupleSetRowItem" */
  },
  /*::[*/
  1036: {
    /* n:"BrtNameExt" */
  },
  /*::[*/
  1037: {
    /* n:"BrtPCDH14" */
  },
  /*::[*/
  1038: {
    /* n:"BrtBeginPCDCalcMem14", */
    T: 1
  },
  /*::[*/
  1039: {
    /* n:"BrtEndPCDCalcMem14", */
    T: -1
  },
  /*::[*/
  1040: {
    /* n:"BrtSXTH14" */
  },
  /*::[*/
  1041: {
    /* n:"BrtBeginSparklineGroup", */
    T: 1
  },
  /*::[*/
  1042: {
    /* n:"BrtEndSparklineGroup", */
    T: -1
  },
  /*::[*/
  1043: {
    /* n:"BrtSparkline" */
  },
  /*::[*/
  1044: {
    /* n:"BrtSXDI14" */
  },
  /*::[*/
  1045: {
    /* n:"BrtWsFmtInfoEx14" */
  },
  /*::[*/
  1046: {
    /* n:"BrtBeginConditionalFormatting14", */
    T: 1
  },
  /*::[*/
  1047: {
    /* n:"BrtEndConditionalFormatting14", */
    T: -1
  },
  /*::[*/
  1048: {
    /* n:"BrtBeginCFRule14", */
    T: 1
  },
  /*::[*/
  1049: {
    /* n:"BrtEndCFRule14", */
    T: -1
  },
  /*::[*/
  1050: {
    /* n:"BrtCFVO14" */
  },
  /*::[*/
  1051: {
    /* n:"BrtBeginDatabar14", */
    T: 1
  },
  /*::[*/
  1052: {
    /* n:"BrtBeginIconSet14", */
    T: 1
  },
  /*::[*/
  1053: {
    /* n:"BrtDVal14", */
    f: Bg
  },
  /*::[*/
  1054: {
    /* n:"BrtBeginDVals14", */
    T: 1
  },
  /*::[*/
  1055: {
    /* n:"BrtColor14" */
  },
  /*::[*/
  1056: {
    /* n:"BrtBeginSparklines", */
    T: 1
  },
  /*::[*/
  1057: {
    /* n:"BrtEndSparklines", */
    T: -1
  },
  /*::[*/
  1058: {
    /* n:"BrtBeginSparklineGroups", */
    T: 1
  },
  /*::[*/
  1059: {
    /* n:"BrtEndSparklineGroups", */
    T: -1
  },
  /*::[*/
  1061: {
    /* n:"BrtSXVD14" */
  },
  /*::[*/
  1062: {
    /* n:"BrtBeginSXView14", */
    T: 1
  },
  /*::[*/
  1063: {
    /* n:"BrtEndSXView14", */
    T: -1
  },
  /*::[*/
  1064: {
    /* n:"BrtBeginSXView16", */
    T: 1
  },
  /*::[*/
  1065: {
    /* n:"BrtEndSXView16", */
    T: -1
  },
  /*::[*/
  1066: {
    /* n:"BrtBeginPCD14", */
    T: 1
  },
  /*::[*/
  1067: {
    /* n:"BrtEndPCD14", */
    T: -1
  },
  /*::[*/
  1068: {
    /* n:"BrtBeginExtConn14", */
    T: 1
  },
  /*::[*/
  1069: {
    /* n:"BrtEndExtConn14", */
    T: -1
  },
  /*::[*/
  1070: {
    /* n:"BrtBeginSlicerCacheIDs", */
    T: 1
  },
  /*::[*/
  1071: {
    /* n:"BrtEndSlicerCacheIDs", */
    T: -1
  },
  /*::[*/
  1072: {
    /* n:"BrtBeginSlicerCacheID", */
    T: 1
  },
  /*::[*/
  1073: {
    /* n:"BrtEndSlicerCacheID", */
    T: -1
  },
  /*::[*/
  1075: {
    /* n:"BrtBeginSlicerCache", */
    T: 1
  },
  /*::[*/
  1076: {
    /* n:"BrtEndSlicerCache", */
    T: -1
  },
  /*::[*/
  1077: {
    /* n:"BrtBeginSlicerCacheDef", */
    T: 1
  },
  /*::[*/
  1078: {
    /* n:"BrtEndSlicerCacheDef", */
    T: -1
  },
  /*::[*/
  1079: {
    /* n:"BrtBeginSlicersEx", */
    T: 1
  },
  /*::[*/
  1080: {
    /* n:"BrtEndSlicersEx", */
    T: -1
  },
  /*::[*/
  1081: {
    /* n:"BrtBeginSlicerEx", */
    T: 1
  },
  /*::[*/
  1082: {
    /* n:"BrtEndSlicerEx", */
    T: -1
  },
  /*::[*/
  1083: {
    /* n:"BrtBeginSlicer", */
    T: 1
  },
  /*::[*/
  1084: {
    /* n:"BrtEndSlicer", */
    T: -1
  },
  /*::[*/
  1085: {
    /* n:"BrtSlicerCachePivotTables" */
  },
  /*::[*/
  1086: {
    /* n:"BrtBeginSlicerCacheOlapImpl", */
    T: 1
  },
  /*::[*/
  1087: {
    /* n:"BrtEndSlicerCacheOlapImpl", */
    T: -1
  },
  /*::[*/
  1088: {
    /* n:"BrtBeginSlicerCacheLevelsData", */
    T: 1
  },
  /*::[*/
  1089: {
    /* n:"BrtEndSlicerCacheLevelsData", */
    T: -1
  },
  /*::[*/
  1090: {
    /* n:"BrtBeginSlicerCacheLevelData", */
    T: 1
  },
  /*::[*/
  1091: {
    /* n:"BrtEndSlicerCacheLevelData", */
    T: -1
  },
  /*::[*/
  1092: {
    /* n:"BrtBeginSlicerCacheSiRanges", */
    T: 1
  },
  /*::[*/
  1093: {
    /* n:"BrtEndSlicerCacheSiRanges", */
    T: -1
  },
  /*::[*/
  1094: {
    /* n:"BrtBeginSlicerCacheSiRange", */
    T: 1
  },
  /*::[*/
  1095: {
    /* n:"BrtEndSlicerCacheSiRange", */
    T: -1
  },
  /*::[*/
  1096: {
    /* n:"BrtSlicerCacheOlapItem" */
  },
  /*::[*/
  1097: {
    /* n:"BrtBeginSlicerCacheSelections", */
    T: 1
  },
  /*::[*/
  1098: {
    /* n:"BrtSlicerCacheSelection" */
  },
  /*::[*/
  1099: {
    /* n:"BrtEndSlicerCacheSelections", */
    T: -1
  },
  /*::[*/
  1100: {
    /* n:"BrtBeginSlicerCacheNative", */
    T: 1
  },
  /*::[*/
  1101: {
    /* n:"BrtEndSlicerCacheNative", */
    T: -1
  },
  /*::[*/
  1102: {
    /* n:"BrtSlicerCacheNativeItem" */
  },
  /*::[*/
  1103: {
    /* n:"BrtRangeProtection14" */
  },
  /*::[*/
  1104: {
    /* n:"BrtRangeProtectionIso14" */
  },
  /*::[*/
  1105: {
    /* n:"BrtCellIgnoreEC14" */
  },
  /*::[*/
  1111: {
    /* n:"BrtList14" */
  },
  /*::[*/
  1112: {
    /* n:"BrtCFIcon" */
  },
  /*::[*/
  1113: {
    /* n:"BrtBeginSlicerCachesPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  1114: {
    /* n:"BrtEndSlicerCachesPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  1115: {
    /* n:"BrtBeginSlicers", */
    T: 1
  },
  /*::[*/
  1116: {
    /* n:"BrtEndSlicers", */
    T: -1
  },
  /*::[*/
  1117: {
    /* n:"BrtWbProp14" */
  },
  /*::[*/
  1118: {
    /* n:"BrtBeginSXEdit", */
    T: 1
  },
  /*::[*/
  1119: {
    /* n:"BrtEndSXEdit", */
    T: -1
  },
  /*::[*/
  1120: {
    /* n:"BrtBeginSXEdits", */
    T: 1
  },
  /*::[*/
  1121: {
    /* n:"BrtEndSXEdits", */
    T: -1
  },
  /*::[*/
  1122: {
    /* n:"BrtBeginSXChange", */
    T: 1
  },
  /*::[*/
  1123: {
    /* n:"BrtEndSXChange", */
    T: -1
  },
  /*::[*/
  1124: {
    /* n:"BrtBeginSXChanges", */
    T: 1
  },
  /*::[*/
  1125: {
    /* n:"BrtEndSXChanges", */
    T: -1
  },
  /*::[*/
  1126: {
    /* n:"BrtSXTupleItems" */
  },
  /*::[*/
  1128: {
    /* n:"BrtBeginSlicerStyle", */
    T: 1
  },
  /*::[*/
  1129: {
    /* n:"BrtEndSlicerStyle", */
    T: -1
  },
  /*::[*/
  1130: {
    /* n:"BrtSlicerStyleElement" */
  },
  /*::[*/
  1131: {
    /* n:"BrtBeginStyleSheetExt14", */
    T: 1
  },
  /*::[*/
  1132: {
    /* n:"BrtEndStyleSheetExt14", */
    T: -1
  },
  /*::[*/
  1133: {
    /* n:"BrtBeginSlicerCachesPivotCacheID", */
    T: 1
  },
  /*::[*/
  1134: {
    /* n:"BrtEndSlicerCachesPivotCacheID", */
    T: -1
  },
  /*::[*/
  1135: {
    /* n:"BrtBeginConditionalFormattings", */
    T: 1
  },
  /*::[*/
  1136: {
    /* n:"BrtEndConditionalFormattings", */
    T: -1
  },
  /*::[*/
  1137: {
    /* n:"BrtBeginPCDCalcMemExt", */
    T: 1
  },
  /*::[*/
  1138: {
    /* n:"BrtEndPCDCalcMemExt", */
    T: -1
  },
  /*::[*/
  1139: {
    /* n:"BrtBeginPCDCalcMemsExt", */
    T: 1
  },
  /*::[*/
  1140: {
    /* n:"BrtEndPCDCalcMemsExt", */
    T: -1
  },
  /*::[*/
  1141: {
    /* n:"BrtPCDField14" */
  },
  /*::[*/
  1142: {
    /* n:"BrtBeginSlicerStyles", */
    T: 1
  },
  /*::[*/
  1143: {
    /* n:"BrtEndSlicerStyles", */
    T: -1
  },
  /*::[*/
  1144: {
    /* n:"BrtBeginSlicerStyleElements", */
    T: 1
  },
  /*::[*/
  1145: {
    /* n:"BrtEndSlicerStyleElements", */
    T: -1
  },
  /*::[*/
  1146: {
    /* n:"BrtCFRuleExt" */
  },
  /*::[*/
  1147: {
    /* n:"BrtBeginSXCondFmt14", */
    T: 1
  },
  /*::[*/
  1148: {
    /* n:"BrtEndSXCondFmt14", */
    T: -1
  },
  /*::[*/
  1149: {
    /* n:"BrtBeginSXCondFmts14", */
    T: 1
  },
  /*::[*/
  1150: {
    /* n:"BrtEndSXCondFmts14", */
    T: -1
  },
  /*::[*/
  1152: {
    /* n:"BrtBeginSortCond14", */
    T: 1
  },
  /*::[*/
  1153: {
    /* n:"BrtEndSortCond14", */
    T: -1
  },
  /*::[*/
  1154: {
    /* n:"BrtEndDVals14", */
    T: -1
  },
  /*::[*/
  1155: {
    /* n:"BrtEndIconSet14", */
    T: -1
  },
  /*::[*/
  1156: {
    /* n:"BrtEndDatabar14", */
    T: -1
  },
  /*::[*/
  1157: {
    /* n:"BrtBeginColorScale14", */
    T: 1
  },
  /*::[*/
  1158: {
    /* n:"BrtEndColorScale14", */
    T: -1
  },
  /*::[*/
  1159: {
    /* n:"BrtBeginSxrules14", */
    T: 1
  },
  /*::[*/
  1160: {
    /* n:"BrtEndSxrules14", */
    T: -1
  },
  /*::[*/
  1161: {
    /* n:"BrtBeginPRule14", */
    T: 1
  },
  /*::[*/
  1162: {
    /* n:"BrtEndPRule14", */
    T: -1
  },
  /*::[*/
  1163: {
    /* n:"BrtBeginPRFilters14", */
    T: 1
  },
  /*::[*/
  1164: {
    /* n:"BrtEndPRFilters14", */
    T: -1
  },
  /*::[*/
  1165: {
    /* n:"BrtBeginPRFilter14", */
    T: 1
  },
  /*::[*/
  1166: {
    /* n:"BrtEndPRFilter14", */
    T: -1
  },
  /*::[*/
  1167: {
    /* n:"BrtBeginPRFItem14", */
    T: 1
  },
  /*::[*/
  1168: {
    /* n:"BrtEndPRFItem14", */
    T: -1
  },
  /*::[*/
  1169: {
    /* n:"BrtBeginCellIgnoreECs14", */
    T: 1
  },
  /*::[*/
  1170: {
    /* n:"BrtEndCellIgnoreECs14", */
    T: -1
  },
  /*::[*/
  1171: {
    /* n:"BrtDxf14" */
  },
  /*::[*/
  1172: {
    /* n:"BrtBeginDxF14s", */
    T: 1
  },
  /*::[*/
  1173: {
    /* n:"BrtEndDxf14s", */
    T: -1
  },
  /*::[*/
  1177: {
    /* n:"BrtFilter14" */
  },
  /*::[*/
  1178: {
    /* n:"BrtBeginCustomFilters14", */
    T: 1
  },
  /*::[*/
  1180: {
    /* n:"BrtCustomFilter14" */
  },
  /*::[*/
  1181: {
    /* n:"BrtIconFilter14" */
  },
  /*::[*/
  1182: {
    /* n:"BrtPivotCacheConnectionName" */
  },
  /*::[*/
  2048: {
    /* n:"BrtBeginDecoupledPivotCacheIDs", */
    T: 1
  },
  /*::[*/
  2049: {
    /* n:"BrtEndDecoupledPivotCacheIDs", */
    T: -1
  },
  /*::[*/
  2050: {
    /* n:"BrtDecoupledPivotCacheID" */
  },
  /*::[*/
  2051: {
    /* n:"BrtBeginPivotTableRefs", */
    T: 1
  },
  /*::[*/
  2052: {
    /* n:"BrtEndPivotTableRefs", */
    T: -1
  },
  /*::[*/
  2053: {
    /* n:"BrtPivotTableRef" */
  },
  /*::[*/
  2054: {
    /* n:"BrtSlicerCacheBookPivotTables" */
  },
  /*::[*/
  2055: {
    /* n:"BrtBeginSxvcells", */
    T: 1
  },
  /*::[*/
  2056: {
    /* n:"BrtEndSxvcells", */
    T: -1
  },
  /*::[*/
  2057: {
    /* n:"BrtBeginSxRow", */
    T: 1
  },
  /*::[*/
  2058: {
    /* n:"BrtEndSxRow", */
    T: -1
  },
  /*::[*/
  2060: {
    /* n:"BrtPcdCalcMem15" */
  },
  /*::[*/
  2067: {
    /* n:"BrtQsi15" */
  },
  /*::[*/
  2068: {
    /* n:"BrtBeginWebExtensions", */
    T: 1
  },
  /*::[*/
  2069: {
    /* n:"BrtEndWebExtensions", */
    T: -1
  },
  /*::[*/
  2070: {
    /* n:"BrtWebExtension" */
  },
  /*::[*/
  2071: {
    /* n:"BrtAbsPath15" */
  },
  /*::[*/
  2072: {
    /* n:"BrtBeginPivotTableUISettings", */
    T: 1
  },
  /*::[*/
  2073: {
    /* n:"BrtEndPivotTableUISettings", */
    T: -1
  },
  /*::[*/
  2075: {
    /* n:"BrtTableSlicerCacheIDs" */
  },
  /*::[*/
  2076: {
    /* n:"BrtTableSlicerCacheID" */
  },
  /*::[*/
  2077: {
    /* n:"BrtBeginTableSlicerCache", */
    T: 1
  },
  /*::[*/
  2078: {
    /* n:"BrtEndTableSlicerCache", */
    T: -1
  },
  /*::[*/
  2079: {
    /* n:"BrtSxFilter15" */
  },
  /*::[*/
  2080: {
    /* n:"BrtBeginTimelineCachePivotCacheIDs", */
    T: 1
  },
  /*::[*/
  2081: {
    /* n:"BrtEndTimelineCachePivotCacheIDs", */
    T: -1
  },
  /*::[*/
  2082: {
    /* n:"BrtTimelineCachePivotCacheID" */
  },
  /*::[*/
  2083: {
    /* n:"BrtBeginTimelineCacheIDs", */
    T: 1
  },
  /*::[*/
  2084: {
    /* n:"BrtEndTimelineCacheIDs", */
    T: -1
  },
  /*::[*/
  2085: {
    /* n:"BrtBeginTimelineCacheID", */
    T: 1
  },
  /*::[*/
  2086: {
    /* n:"BrtEndTimelineCacheID", */
    T: -1
  },
  /*::[*/
  2087: {
    /* n:"BrtBeginTimelinesEx", */
    T: 1
  },
  /*::[*/
  2088: {
    /* n:"BrtEndTimelinesEx", */
    T: -1
  },
  /*::[*/
  2089: {
    /* n:"BrtBeginTimelineEx", */
    T: 1
  },
  /*::[*/
  2090: {
    /* n:"BrtEndTimelineEx", */
    T: -1
  },
  /*::[*/
  2091: {
    /* n:"BrtWorkBookPr15" */
  },
  /*::[*/
  2092: {
    /* n:"BrtPCDH15" */
  },
  /*::[*/
  2093: {
    /* n:"BrtBeginTimelineStyle", */
    T: 1
  },
  /*::[*/
  2094: {
    /* n:"BrtEndTimelineStyle", */
    T: -1
  },
  /*::[*/
  2095: {
    /* n:"BrtTimelineStyleElement" */
  },
  /*::[*/
  2096: {
    /* n:"BrtBeginTimelineStylesheetExt15", */
    T: 1
  },
  /*::[*/
  2097: {
    /* n:"BrtEndTimelineStylesheetExt15", */
    T: -1
  },
  /*::[*/
  2098: {
    /* n:"BrtBeginTimelineStyles", */
    T: 1
  },
  /*::[*/
  2099: {
    /* n:"BrtEndTimelineStyles", */
    T: -1
  },
  /*::[*/
  2100: {
    /* n:"BrtBeginTimelineStyleElements", */
    T: 1
  },
  /*::[*/
  2101: {
    /* n:"BrtEndTimelineStyleElements", */
    T: -1
  },
  /*::[*/
  2102: {
    /* n:"BrtDxf15" */
  },
  /*::[*/
  2103: {
    /* n:"BrtBeginDxfs15", */
    T: 1
  },
  /*::[*/
  2104: {
    /* n:"BrtEndDxfs15", */
    T: -1
  },
  /*::[*/
  2105: {
    /* n:"BrtSlicerCacheHideItemsWithNoData" */
  },
  /*::[*/
  2106: {
    /* n:"BrtBeginItemUniqueNames", */
    T: 1
  },
  /*::[*/
  2107: {
    /* n:"BrtEndItemUniqueNames", */
    T: -1
  },
  /*::[*/
  2108: {
    /* n:"BrtItemUniqueName" */
  },
  /*::[*/
  2109: {
    /* n:"BrtBeginExtConn15", */
    T: 1
  },
  /*::[*/
  2110: {
    /* n:"BrtEndExtConn15", */
    T: -1
  },
  /*::[*/
  2111: {
    /* n:"BrtBeginOledbPr15", */
    T: 1
  },
  /*::[*/
  2112: {
    /* n:"BrtEndOledbPr15", */
    T: -1
  },
  /*::[*/
  2113: {
    /* n:"BrtBeginDataFeedPr15", */
    T: 1
  },
  /*::[*/
  2114: {
    /* n:"BrtEndDataFeedPr15", */
    T: -1
  },
  /*::[*/
  2115: {
    /* n:"BrtTextPr15" */
  },
  /*::[*/
  2116: {
    /* n:"BrtRangePr15" */
  },
  /*::[*/
  2117: {
    /* n:"BrtDbCommand15" */
  },
  /*::[*/
  2118: {
    /* n:"BrtBeginDbTables15", */
    T: 1
  },
  /*::[*/
  2119: {
    /* n:"BrtEndDbTables15", */
    T: -1
  },
  /*::[*/
  2120: {
    /* n:"BrtDbTable15" */
  },
  /*::[*/
  2121: {
    /* n:"BrtBeginDataModel", */
    T: 1
  },
  /*::[*/
  2122: {
    /* n:"BrtEndDataModel", */
    T: -1
  },
  /*::[*/
  2123: {
    /* n:"BrtBeginModelTables", */
    T: 1
  },
  /*::[*/
  2124: {
    /* n:"BrtEndModelTables", */
    T: -1
  },
  /*::[*/
  2125: {
    /* n:"BrtModelTable" */
  },
  /*::[*/
  2126: {
    /* n:"BrtBeginModelRelationships", */
    T: 1
  },
  /*::[*/
  2127: {
    /* n:"BrtEndModelRelationships", */
    T: -1
  },
  /*::[*/
  2128: {
    /* n:"BrtModelRelationship" */
  },
  /*::[*/
  2129: {
    /* n:"BrtBeginECTxtWiz15", */
    T: 1
  },
  /*::[*/
  2130: {
    /* n:"BrtEndECTxtWiz15", */
    T: -1
  },
  /*::[*/
  2131: {
    /* n:"BrtBeginECTWFldInfoLst15", */
    T: 1
  },
  /*::[*/
  2132: {
    /* n:"BrtEndECTWFldInfoLst15", */
    T: -1
  },
  /*::[*/
  2133: {
    /* n:"BrtBeginECTWFldInfo15", */
    T: 1
  },
  /*::[*/
  2134: {
    /* n:"BrtFieldListActiveItem" */
  },
  /*::[*/
  2135: {
    /* n:"BrtPivotCacheIdVersion" */
  },
  /*::[*/
  2136: {
    /* n:"BrtSXDI15" */
  },
  /*::[*/
  2137: {
    /* n:"BrtBeginModelTimeGroupings", */
    T: 1
  },
  /*::[*/
  2138: {
    /* n:"BrtEndModelTimeGroupings", */
    T: -1
  },
  /*::[*/
  2139: {
    /* n:"BrtBeginModelTimeGrouping", */
    T: 1
  },
  /*::[*/
  2140: {
    /* n:"BrtEndModelTimeGrouping", */
    T: -1
  },
  /*::[*/
  2141: {
    /* n:"BrtModelTimeGroupingCalcCol" */
  },
  /*::[*/
  3072: {
    /* n:"BrtUid" */
  },
  /*::[*/
  3073: {
    /* n:"BrtRevisionPtr" */
  },
  /*::[*/
  4096: {
    /* n:"BrtBeginDynamicArrayPr", */
    T: 1
  },
  /*::[*/
  4097: {
    /* n:"BrtEndDynamicArrayPr", */
    T: -1
  },
  /*::[*/
  5002: {
    /* n:"BrtBeginRichValueBlock", */
    T: 1
  },
  /*::[*/
  5003: {
    /* n:"BrtEndRichValueBlock", */
    T: -1
  },
  /*::[*/
  5081: {
    /* n:"BrtBeginRichFilters", */
    T: 1
  },
  /*::[*/
  5082: {
    /* n:"BrtEndRichFilters", */
    T: -1
  },
  /*::[*/
  5083: {
    /* n:"BrtRichFilter" */
  },
  /*::[*/
  5084: {
    /* n:"BrtBeginRichFilterColumn", */
    T: 1
  },
  /*::[*/
  5085: {
    /* n:"BrtEndRichFilterColumn", */
    T: -1
  },
  /*::[*/
  5086: {
    /* n:"BrtBeginCustomRichFilters", */
    T: 1
  },
  /*::[*/
  5087: {
    /* n:"BrtEndCustomRichFilters", */
    T: -1
  },
  /*::[*/
  5088: {
    /* n:"BrtCustomRichFilter" */
  },
  /*::[*/
  5089: {
    /* n:"BrtTop10RichFilter" */
  },
  /*::[*/
  5090: {
    /* n:"BrtDynamicRichFilter" */
  },
  /*::[*/
  5092: {
    /* n:"BrtBeginRichSortCondition", */
    T: 1
  },
  /*::[*/
  5093: {
    /* n:"BrtEndRichSortCondition", */
    T: -1
  },
  /*::[*/
  5094: {
    /* n:"BrtRichFilterDateGroupItem" */
  },
  /*::[*/
  5095: {
    /* n:"BrtBeginCalcFeatures", */
    T: 1
  },
  /*::[*/
  5096: {
    /* n:"BrtEndCalcFeatures", */
    T: -1
  },
  /*::[*/
  5097: {
    /* n:"BrtCalcFeature" */
  },
  /*::[*/
  5099: {
    /* n:"BrtExternalLinksPr" */
  },
  /*::[*/
  65535: { n: "" }
}, Wi = {
  /* [MS-XLS] 2.3 Record Enumeration 2021-08-17 */
  /*::[*/
  6: {
    /* n:"Formula", */
    f: wi
  },
  /*::[*/
  10: {
    /* n:"EOF", */
    f: kt
  },
  /*::[*/
  12: {
    /* n:"CalcCount", */
    f: ar
  },
  //
  /*::[*/
  13: {
    /* n:"CalcMode", */
    f: ar
  },
  //
  /*::[*/
  14: {
    /* n:"CalcPrecision", */
    f: Qe
  },
  //
  /*::[*/
  15: {
    /* n:"CalcRefMode", */
    f: Qe
  },
  //
  /*::[*/
  16: {
    /* n:"CalcDelta", */
    f: _r
  },
  //
  /*::[*/
  17: {
    /* n:"CalcIter", */
    f: Qe
  },
  //
  /*::[*/
  18: {
    /* n:"Protect", */
    f: Qe
  },
  /*::[*/
  19: {
    /* n:"Password", */
    f: ar
  },
  /*::[*/
  20: {
    /* n:"Header", */
    f: K0
  },
  /*::[*/
  21: {
    /* n:"Footer", */
    f: K0
  },
  /*::[*/
  23: {
    /* n:"ExternSheet", */
    f: Bo
  },
  /*::[*/
  24: {
    /* n:"Lbl", */
    f: $0
  },
  /*::[*/
  25: {
    /* n:"WinProtect", */
    f: Qe
  },
  /*::[*/
  26: {
    /* n:"VerticalPageBreaks", */
  },
  /*::[*/
  27: {
    /* n:"HorizontalPageBreaks", */
  },
  /*::[*/
  28: {
    /* n:"Note", */
    f: Bd
  },
  /*::[*/
  29: {
    /* n:"Selection", */
  },
  /*::[*/
  34: {
    /* n:"Date1904", */
    f: Qe
  },
  /*::[*/
  35: {
    /* n:"ExternName", */
    f: q0
  },
  /*::[*/
  38: {
    /* n:"LeftMargin", */
    f: _r
  },
  // *
  /*::[*/
  39: {
    /* n:"RightMargin", */
    f: _r
  },
  // *
  /*::[*/
  40: {
    /* n:"TopMargin", */
    f: _r
  },
  // *
  /*::[*/
  41: {
    /* n:"BottomMargin", */
    f: _r
  },
  // *
  /*::[*/
  42: {
    /* n:"PrintRowCol", */
    f: Qe
  },
  /*::[*/
  43: {
    /* n:"PrintGrid", */
    f: Qe
  },
  /*::[*/
  47: {
    /* n:"FilePass", */
    f: $1
  },
  /*::[*/
  49: {
    /* n:"Font", */
    f: ud
  },
  /*::[*/
  51: {
    /* n:"PrintSize", */
    f: ar
  },
  /*::[*/
  60: {
    /* n:"Continue", */
  },
  /*::[*/
  61: {
    /* n:"Window1", */
    f: sd
  },
  /*::[*/
  64: {
    /* n:"Backup", */
    f: Qe
  },
  /*::[*/
  65: {
    /* n:"Pane", */
    f: ld
  },
  /*::[*/
  66: {
    /* n:"CodePage", */
    f: ar
  },
  /*::[*/
  77: {
    /* n:"Pls", */
  },
  /*::[*/
  80: {
    /* n:"DCon", */
  },
  /*::[*/
  81: {
    /* n:"DConRef", */
  },
  /*::[*/
  82: {
    /* n:"DConName", */
  },
  /*::[*/
  85: {
    /* n:"DefColWidth", */
    f: ar
  },
  /*::[*/
  89: {
    /* n:"XCT", */
  },
  /*::[*/
  90: {
    /* n:"CRN", */
  },
  /*::[*/
  91: {
    /* n:"FileSharing", */
  },
  /*::[*/
  92: {
    /* n:"WriteAccess", */
    f: qh
  },
  /*::[*/
  93: {
    /* n:"Obj", */
    f: Wd
  },
  /*::[*/
  94: {
    /* n:"Uncalced", */
  },
  /*::[*/
  95: {
    /* n:"CalcSaveRecalc", */
    f: Qe
  },
  //
  /*::[*/
  96: {
    /* n:"Template", */
  },
  /*::[*/
  97: {
    /* n:"Intl", */
  },
  /*::[*/
  99: {
    /* n:"ObjProtect", */
    f: Qe
  },
  /*::[*/
  125: {
    /* n:"ColInfo", */
    f: Uo
  },
  /*::[*/
  128: {
    /* n:"Guts", */
    f: Fd
  },
  /*::[*/
  129: {
    /* n:"WsBool", */
    f: Jh
  },
  /*::[*/
  130: {
    /* n:"GridSet", */
    f: ar
  },
  /*::[*/
  131: {
    /* n:"HCenter", */
    f: Qe
  },
  /*::[*/
  132: {
    /* n:"VCenter", */
    f: Qe
  },
  /*::[*/
  133: {
    /* n:"BoundSheet8", */
    f: Zh
  },
  /*::[*/
  134: {
    /* n:"WriteProtect", */
  },
  /*::[*/
  140: {
    /* n:"Country", */
    f: qd
  },
  /*::[*/
  141: {
    /* n:"HideObj", */
    f: ar
  },
  /*::[*/
  144: {
    /* n:"Sort", */
  },
  /*::[*/
  146: {
    /* n:"Palette", */
    f: Zd
  },
  /*::[*/
  151: {
    /* n:"Sync", */
  },
  /*::[*/
  152: {
    /* n:"LPr", */
  },
  /*::[*/
  153: {
    /* n:"DxGCol", */
  },
  /*::[*/
  154: {
    /* n:"FnGroupName", */
  },
  /*::[*/
  155: {
    /* n:"FilterMode", */
  },
  /*::[*/
  156: {
    /* n:"BuiltInFnGroupCount", */
    f: ar
  },
  /*::[*/
  157: {
    /* n:"AutoFilterInfo", */
  },
  /*::[*/
  158: {
    /* n:"AutoFilter", */
  },
  /*::[*/
  160: {
    /* n:"Scl", */
    f: i1
  },
  /*::[*/
  161: {
    /* n:"Setup", */
    f: r1
  },
  /*::[*/
  174: {
    /* n:"ScenMan", */
  },
  /*::[*/
  175: {
    /* n:"SCENARIO", */
  },
  /*::[*/
  176: {
    /* n:"SxView", */
  },
  /*::[*/
  177: {
    /* n:"Sxvd", */
  },
  /*::[*/
  178: {
    /* n:"SXVI", */
  },
  /*::[*/
  180: {
    /* n:"SxIvd", */
  },
  /*::[*/
  181: {
    /* n:"SXLI", */
  },
  /*::[*/
  182: {
    /* n:"SXPI", */
  },
  /*::[*/
  184: {
    /* n:"DocRoute", */
  },
  /*::[*/
  185: {
    /* n:"RecipName", */
  },
  /*::[*/
  189: {
    /* n:"MulRk", */
    f: wd
  },
  /*::[*/
  190: {
    /* n:"MulBlank", */
    f: yd
  },
  /*::[*/
  193: {
    /* n:"Mms", */
    f: kt
  },
  /*::[*/
  197: {
    /* n:"SXDI", */
  },
  /*::[*/
  198: {
    /* n:"SXDB", */
  },
  /*::[*/
  199: {
    /* n:"SXFDB", */
  },
  /*::[*/
  200: {
    /* n:"SXDBB", */
  },
  /*::[*/
  201: {
    /* n:"SXNum", */
  },
  /*::[*/
  202: {
    /* n:"SxBool", */
    f: Qe
  },
  /*::[*/
  203: {
    /* n:"SxErr", */
  },
  /*::[*/
  204: {
    /* n:"SXInt", */
  },
  /*::[*/
  205: {
    /* n:"SXString", */
  },
  /*::[*/
  206: {
    /* n:"SXDtr", */
  },
  /*::[*/
  207: {
    /* n:"SxNil", */
  },
  /*::[*/
  208: {
    /* n:"SXTbl", */
  },
  /*::[*/
  209: {
    /* n:"SXTBRGIITM", */
  },
  /*::[*/
  210: {
    /* n:"SxTbpg", */
  },
  /*::[*/
  211: {
    /* n:"ObProj", */
  },
  /*::[*/
  213: {
    /* n:"SXStreamID", */
  },
  /*::[*/
  215: {
    /* n:"DBCell", */
  },
  /*::[*/
  216: {
    /* n:"SXRng", */
  },
  /*::[*/
  217: {
    /* n:"SxIsxoper", */
  },
  /*::[*/
  218: {
    /* n:"BookBool", */
    f: ar
  },
  /*::[*/
  220: {
    /* n:"DbOrParamQry", */
  },
  /*::[*/
  221: {
    /* n:"ScenarioProtect", */
    f: Qe
  },
  /*::[*/
  222: {
    /* n:"OleObjectSize", */
  },
  /*::[*/
  224: {
    /* n:"XF", */
    f: kd
  },
  /*::[*/
  225: {
    /* n:"InterfaceHdr", */
    f: Kh
  },
  /*::[*/
  226: {
    /* n:"InterfaceEnd", */
    f: kt
  },
  /*::[*/
  227: {
    /* n:"SXVS", */
  },
  /*::[*/
  229: {
    /* n:"MergeCells", */
    f: Ud
  },
  /*::[*/
  233: {
    /* n:"BkHim", */
  },
  /*::[*/
  235: {
    /* n:"MsoDrawingGroup", */
  },
  /*::[*/
  236: {
    /* n:"MsoDrawing", */
  },
  /*::[*/
  237: {
    /* n:"MsoDrawingSelection", */
  },
  /*::[*/
  239: {
    /* n:"PhoneticInfo", */
  },
  /*::[*/
  240: {
    /* n:"SxRule", */
  },
  /*::[*/
  241: {
    /* n:"SXEx", */
  },
  /*::[*/
  242: {
    /* n:"SxFilt", */
  },
  /*::[*/
  244: {
    /* n:"SxDXF", */
  },
  /*::[*/
  245: {
    /* n:"SxItm", */
  },
  /*::[*/
  246: {
    /* n:"SxName", */
  },
  /*::[*/
  247: {
    /* n:"SxSelect", */
  },
  /*::[*/
  248: {
    /* n:"SXPair", */
  },
  /*::[*/
  249: {
    /* n:"SxFmla", */
  },
  /*::[*/
  251: {
    /* n:"SxFormat", */
  },
  /*::[*/
  252: {
    /* n:"SST", */
    f: ed
  },
  /*::[*/
  253: {
    /* n:"LabelSst", */
    f: dd
  },
  /*::[*/
  255: {
    /* n:"ExtSST", */
    f: td
  },
  /*::[*/
  256: {
    /* n:"SXVDEx", */
  },
  /*::[*/
  259: {
    /* n:"SXFormula", */
  },
  /*::[*/
  290: {
    /* n:"SXDBEx", */
  },
  /*::[*/
  311: {
    /* n:"RRDInsDel", */
  },
  /*::[*/
  312: {
    /* n:"RRDHead", */
  },
  /*::[*/
  315: {
    /* n:"RRDChgCell", */
  },
  /*::[*/
  317: {
    /* n:"RRTabId", */
    f: Co
  },
  /*::[*/
  318: {
    /* n:"RRDRenSheet", */
  },
  /*::[*/
  319: {
    /* n:"RRSort", */
  },
  /*::[*/
  320: {
    /* n:"RRDMove", */
  },
  /*::[*/
  330: {
    /* n:"RRFormat", */
  },
  /*::[*/
  331: {
    /* n:"RRAutoFmt", */
  },
  /*::[*/
  333: {
    /* n:"RRInsertSh", */
  },
  /*::[*/
  334: {
    /* n:"RRDMoveBegin", */
  },
  /*::[*/
  335: {
    /* n:"RRDMoveEnd", */
  },
  /*::[*/
  336: {
    /* n:"RRDInsDelBegin", */
  },
  /*::[*/
  337: {
    /* n:"RRDInsDelEnd", */
  },
  /*::[*/
  338: {
    /* n:"RRDConflict", */
  },
  /*::[*/
  339: {
    /* n:"RRDDefName", */
  },
  /*::[*/
  340: {
    /* n:"RRDRstEtxp", */
  },
  /*::[*/
  351: {
    /* n:"LRng", */
  },
  /*::[*/
  352: {
    /* n:"UsesELFs", */
    f: Qe
  },
  /*::[*/
  353: {
    /* n:"DSF", */
    f: kt
  },
  /*::[*/
  401: {
    /* n:"CUsr", */
  },
  /*::[*/
  402: {
    /* n:"CbUsr", */
  },
  /*::[*/
  403: {
    /* n:"UsrInfo", */
  },
  /*::[*/
  404: {
    /* n:"UsrExcl", */
  },
  /*::[*/
  405: {
    /* n:"FileLock", */
  },
  /*::[*/
  406: {
    /* n:"RRDInfo", */
  },
  /*::[*/
  407: {
    /* n:"BCUsrs", */
  },
  /*::[*/
  408: {
    /* n:"UsrChk", */
  },
  /*::[*/
  425: {
    /* n:"UserBView", */
  },
  /*::[*/
  426: {
    /* n:"UserSViewBegin", */
  },
  /*::[*/
  427: {
    /* n:"UserSViewEnd", */
  },
  /*::[*/
  428: {
    /* n:"RRDUserView", */
  },
  /*::[*/
  429: {
    /* n:"Qsi", */
  },
  /*::[*/
  430: {
    /* n:"SupBook", */
    f: Id
  },
  /*::[*/
  431: {
    /* n:"Prot4Rev", */
    f: Qe
  },
  /*::[*/
  432: {
    /* n:"CondFmt", */
  },
  /*::[*/
  433: {
    /* n:"CF", */
  },
  /*::[*/
  434: {
    /* n:"DVal", */
  },
  /*::[*/
  437: {
    /* n:"DConBin", */
  },
  /*::[*/
  438: {
    /* n:"TxO", */
    f: Vd
  },
  /*::[*/
  439: {
    /* n:"RefreshAll", */
    f: Qe
  },
  //
  /*::[*/
  440: {
    /* n:"HLink", */
    f: zd
  },
  /*::[*/
  441: {
    /* n:"Lel", */
  },
  /*::[*/
  442: {
    /* n:"CodeName", */
    f: un
  },
  /*::[*/
  443: {
    /* n:"SXFDBType", */
  },
  /*::[*/
  444: {
    /* n:"Prot4RevPass", */
    f: ar
  },
  /*::[*/
  445: {
    /* n:"ObNoMacros", */
  },
  /*::[*/
  446: {
    /* n:"Dv", */
  },
  /*::[*/
  448: {
    /* n:"Excel9File", */
    f: kt
  },
  /*::[*/
  449: {
    /* n:"RecalcId", */
    f: id,
    r: 2
  },
  /*::[*/
  450: {
    /* n:"EntExU2", */
    f: kt
  },
  /*::[*/
  512: {
    /* n:"Dimensions", */
    f: z0
  },
  /*::[*/
  513: {
    /* n:"Blank", */
    f: n1
  },
  /*::[*/
  515: {
    /* n:"Number", */
    f: Cd
  },
  /*::[*/
  516: {
    /* n:"Label", */
    f: pd
  },
  /*::[*/
  517: {
    /* n:"BoolErr", */
    f: j0
  },
  /*::[*/
  519: {
    /* n:"String", */
    f: s1
  },
  /*::[*/
  520: {
    /* n:"Row", */
    f: ad
  },
  /*::[*/
  523: {
    /* n:"Index", */
  },
  /*::[*/
  545: {
    /* n:"Array", */
    f: J0
  },
  /*::[*/
  549: {
    /* n:"DefaultRowHeight", */
    f: V0
  },
  /*::[*/
  566: {
    /* n:"Table", */
  },
  /*::[*/
  574: {
    /* n:"Window2", */
    f: od
  },
  /*::[*/
  638: {
    /* n:"RK", */
    f: Td
  },
  /*::[*/
  659: {
    /* n:"Style", */
  },
  /*::[*/
  1048: {
    /* n:"BigName", */
  },
  /*::[*/
  1054: {
    /* n:"Format", */
    f: vd
  },
  /*::[*/
  1084: {
    /* n:"ContinueBigName", */
  },
  /*::[*/
  1212: {
    /* n:"ShrFmla", */
    f: bd
  },
  /*::[*/
  2048: {
    /* n:"HLinkTooltip", */
    f: jd
  },
  /*::[*/
  2049: {
    /* n:"WebPub", */
  },
  /*::[*/
  2050: {
    /* n:"QsiSXTag", */
  },
  /*::[*/
  2051: {
    /* n:"DBQueryExt", */
  },
  /*::[*/
  2052: {
    /* n:"ExtString", */
  },
  /*::[*/
  2053: {
    /* n:"TxtQry", */
  },
  /*::[*/
  2054: {
    /* n:"Qsir", */
  },
  /*::[*/
  2055: {
    /* n:"Qsif", */
  },
  /*::[*/
  2056: {
    /* n:"RRDTQSIF", */
  },
  /*::[*/
  2057: {
    /* n:"BOF", */
    f: Sn
  },
  /*::[*/
  2058: {
    /* n:"OleDbConn", */
  },
  /*::[*/
  2059: {
    /* n:"WOpt", */
  },
  /*::[*/
  2060: {
    /* n:"SXViewEx", */
  },
  /*::[*/
  2061: {
    /* n:"SXTH", */
  },
  /*::[*/
  2062: {
    /* n:"SXPIEx", */
  },
  /*::[*/
  2063: {
    /* n:"SXVDTEx", */
  },
  /*::[*/
  2064: {
    /* n:"SXViewEx9", */
  },
  /*::[*/
  2066: {
    /* n:"ContinueFrt", */
  },
  /*::[*/
  2067: {
    /* n:"RealTimeData", */
  },
  /*::[*/
  2128: {
    /* n:"ChartFrtInfo", */
  },
  /*::[*/
  2129: {
    /* n:"FrtWrapper", */
  },
  /*::[*/
  2130: {
    /* n:"StartBlock", */
  },
  /*::[*/
  2131: {
    /* n:"EndBlock", */
  },
  /*::[*/
  2132: {
    /* n:"StartObject", */
  },
  /*::[*/
  2133: {
    /* n:"EndObject", */
  },
  /*::[*/
  2134: {
    /* n:"CatLab", */
  },
  /*::[*/
  2135: {
    /* n:"YMult", */
  },
  /*::[*/
  2136: {
    /* n:"SXViewLink", */
  },
  /*::[*/
  2137: {
    /* n:"PivotChartBits", */
  },
  /*::[*/
  2138: {
    /* n:"FrtFontList", */
  },
  /*::[*/
  2146: {
    /* n:"SheetExt", */
  },
  /*::[*/
  2147: {
    /* n:"BookExt", */
    r: 12
  },
  /*::[*/
  2148: {
    /* n:"SXAddl", */
  },
  /*::[*/
  2149: {
    /* n:"CrErr", */
  },
  /*::[*/
  2150: {
    /* n:"HFPicture", */
  },
  /*::[*/
  2151: {
    /* n:"FeatHdr", */
    f: kt
  },
  /*::[*/
  2152: {
    /* n:"Feat", */
  },
  /*::[*/
  2154: {
    /* n:"DataLabExt", */
  },
  /*::[*/
  2155: {
    /* n:"DataLabExtContents", */
  },
  /*::[*/
  2156: {
    /* n:"CellWatch", */
  },
  /*::[*/
  2161: {
    /* n:"FeatHdr11", */
  },
  /*::[*/
  2162: {
    /* n:"Feature11", */
  },
  /*::[*/
  2164: {
    /* n:"DropDownObjIds", */
  },
  /*::[*/
  2165: {
    /* n:"ContinueFrt11", */
  },
  /*::[*/
  2166: {
    /* n:"DConn", */
  },
  /*::[*/
  2167: {
    /* n:"List12", */
  },
  /*::[*/
  2168: {
    /* n:"Feature12", */
  },
  /*::[*/
  2169: {
    /* n:"CondFmt12", */
  },
  /*::[*/
  2170: {
    /* n:"CF12", */
  },
  /*::[*/
  2171: {
    /* n:"CFEx", */
  },
  /*::[*/
  2172: {
    /* n:"XFCRC", */
    f: Qd,
    r: 12
  },
  /*::[*/
  2173: {
    /* n:"XFExt", */
    f: qx,
    r: 12
  },
  /*::[*/
  2174: {
    /* n:"AutoFilter12", */
  },
  /*::[*/
  2175: {
    /* n:"ContinueFrt12", */
  },
  /*::[*/
  2180: {
    /* n:"MDTInfo", */
  },
  /*::[*/
  2181: {
    /* n:"MDXStr", */
  },
  /*::[*/
  2182: {
    /* n:"MDXTuple", */
  },
  /*::[*/
  2183: {
    /* n:"MDXSet", */
  },
  /*::[*/
  2184: {
    /* n:"MDXProp", */
  },
  /*::[*/
  2185: {
    /* n:"MDXKPI", */
  },
  /*::[*/
  2186: {
    /* n:"MDB", */
  },
  /*::[*/
  2187: {
    /* n:"PLV", */
  },
  /*::[*/
  2188: {
    /* n:"Compat12", */
    f: Qe,
    r: 12
  },
  /*::[*/
  2189: {
    /* n:"DXF", */
  },
  /*::[*/
  2190: {
    /* n:"TableStyles", */
    r: 12
  },
  /*::[*/
  2191: {
    /* n:"TableStyle", */
  },
  /*::[*/
  2192: {
    /* n:"TableStyleElement", */
  },
  /*::[*/
  2194: {
    /* n:"StyleExt", */
  },
  /*::[*/
  2195: {
    /* n:"NamePublish", */
  },
  /*::[*/
  2196: {
    /* n:"NameCmt", */
    f: Dd,
    r: 12
  },
  /*::[*/
  2197: {
    /* n:"SortData", */
  },
  /*::[*/
  2198: {
    /* n:"Theme", */
    f: Gx,
    r: 12
  },
  /*::[*/
  2199: {
    /* n:"GUIDTypeLib", */
  },
  /*::[*/
  2200: {
    /* n:"FnGrp12", */
  },
  /*::[*/
  2201: {
    /* n:"NameFnGrp12", */
  },
  /*::[*/
  2202: {
    /* n:"MTRSettings", */
    f: Pd,
    r: 12
  },
  /*::[*/
  2203: {
    /* n:"CompressPictures", */
    f: kt
  },
  /*::[*/
  2204: {
    /* n:"HeaderFooter", */
  },
  /*::[*/
  2205: {
    /* n:"CrtLayout12", */
  },
  /*::[*/
  2206: {
    /* n:"CrtMlFrt", */
  },
  /*::[*/
  2207: {
    /* n:"CrtMlFrtContinue", */
  },
  /*::[*/
  2211: {
    /* n:"ForceFullCalculation", */
    f: nd
  },
  /*::[*/
  2212: {
    /* n:"ShapePropsStream", */
  },
  /*::[*/
  2213: {
    /* n:"TextPropsStream", */
  },
  /*::[*/
  2214: {
    /* n:"RichTextStream", */
  },
  /*::[*/
  2215: {
    /* n:"CrtLayout12A", */
  },
  /*::[*/
  4097: {
    /* n:"Units", */
  },
  /*::[*/
  4098: {
    /* n:"Chart", */
  },
  /*::[*/
  4099: {
    /* n:"Series", */
  },
  /*::[*/
  4102: {
    /* n:"DataFormat", */
  },
  /*::[*/
  4103: {
    /* n:"LineFormat", */
  },
  /*::[*/
  4105: {
    /* n:"MarkerFormat", */
  },
  /*::[*/
  4106: {
    /* n:"AreaFormat", */
  },
  /*::[*/
  4107: {
    /* n:"PieFormat", */
  },
  /*::[*/
  4108: {
    /* n:"AttachedLabel", */
  },
  /*::[*/
  4109: {
    /* n:"SeriesText", */
  },
  /*::[*/
  4116: {
    /* n:"ChartFormat", */
  },
  /*::[*/
  4117: {
    /* n:"Legend", */
  },
  /*::[*/
  4118: {
    /* n:"SeriesList", */
  },
  /*::[*/
  4119: {
    /* n:"Bar", */
  },
  /*::[*/
  4120: {
    /* n:"Line", */
  },
  /*::[*/
  4121: {
    /* n:"Pie", */
  },
  /*::[*/
  4122: {
    /* n:"Area", */
  },
  /*::[*/
  4123: {
    /* n:"Scatter", */
  },
  /*::[*/
  4124: {
    /* n:"CrtLine", */
  },
  /*::[*/
  4125: {
    /* n:"Axis", */
  },
  /*::[*/
  4126: {
    /* n:"Tick", */
  },
  /*::[*/
  4127: {
    /* n:"ValueRange", */
  },
  /*::[*/
  4128: {
    /* n:"CatSerRange", */
  },
  /*::[*/
  4129: {
    /* n:"AxisLine", */
  },
  /*::[*/
  4130: {
    /* n:"CrtLink", */
  },
  /*::[*/
  4132: {
    /* n:"DefaultText", */
  },
  /*::[*/
  4133: {
    /* n:"Text", */
  },
  /*::[*/
  4134: {
    /* n:"FontX", */
    f: ar
  },
  /*::[*/
  4135: {
    /* n:"ObjectLink", */
  },
  /*::[*/
  4146: {
    /* n:"Frame", */
  },
  /*::[*/
  4147: {
    /* n:"Begin", */
  },
  /*::[*/
  4148: {
    /* n:"End", */
  },
  /*::[*/
  4149: {
    /* n:"PlotArea", */
  },
  /*::[*/
  4154: {
    /* n:"Chart3d", */
  },
  /*::[*/
  4156: {
    /* n:"PicF", */
  },
  /*::[*/
  4157: {
    /* n:"DropBar", */
  },
  /*::[*/
  4158: {
    /* n:"Radar", */
  },
  /*::[*/
  4159: {
    /* n:"Surf", */
  },
  /*::[*/
  4160: {
    /* n:"RadarArea", */
  },
  /*::[*/
  4161: {
    /* n:"AxisParent", */
  },
  /*::[*/
  4163: {
    /* n:"LegendException", */
  },
  /*::[*/
  4164: {
    /* n:"ShtProps", */
    f: t1
  },
  /*::[*/
  4165: {
    /* n:"SerToCrt", */
  },
  /*::[*/
  4166: {
    /* n:"AxesUsed", */
  },
  /*::[*/
  4168: {
    /* n:"SBaseRef", */
  },
  /*::[*/
  4170: {
    /* n:"SerParent", */
  },
  /*::[*/
  4171: {
    /* n:"SerAuxTrend", */
  },
  /*::[*/
  4174: {
    /* n:"IFmtRecord", */
  },
  /*::[*/
  4175: {
    /* n:"Pos", */
  },
  /*::[*/
  4176: {
    /* n:"AlRuns", */
  },
  /*::[*/
  4177: {
    /* n:"BRAI", */
  },
  /*::[*/
  4187: {
    /* n:"SerAuxErrBar", */
  },
  /*::[*/
  4188: {
    /* n:"ClrtClient", */
    f: Jd
  },
  /*::[*/
  4189: {
    /* n:"SerFmt", */
  },
  /*::[*/
  4191: {
    /* n:"Chart3DBarShape", */
  },
  /*::[*/
  4192: {
    /* n:"Fbi", */
  },
  /*::[*/
  4193: {
    /* n:"BopPop", */
  },
  /*::[*/
  4194: {
    /* n:"AxcExt", */
  },
  /*::[*/
  4195: {
    /* n:"Dat", */
  },
  /*::[*/
  4196: {
    /* n:"PlotGrowth", */
  },
  /*::[*/
  4197: {
    /* n:"SIIndex", */
  },
  /*::[*/
  4198: {
    /* n:"GelFrame", */
  },
  /*::[*/
  4199: {
    /* n:"BopPopCustom", */
  },
  /*::[*/
  4200: {
    /* n:"Fbi2", */
  },
  /*::[*/
  0: {
    /* n:"Dimensions", */
    f: z0
  },
  /*::[*/
  1: {
    /* n:"BIFF2BLANK", */
  },
  /*::[*/
  2: {
    /* n:"BIFF2INT", */
    f: u1
  },
  /*::[*/
  3: {
    /* n:"BIFF2NUM", */
    f: f1
  },
  /*::[*/
  4: {
    /* n:"BIFF2STR", */
    f: o1
  },
  /*::[*/
  5: {
    /* n:"BoolErr", */
    f: j0
  },
  /*::[*/
  7: {
    /* n:"String", */
    f: d1
  },
  /*::[*/
  8: {
    /* n:"BIFF2ROW", */
  },
  /*::[*/
  9: {
    /* n:"BOF", */
    f: Sn
  },
  /*::[*/
  11: {
    /* n:"Index", */
  },
  /*::[*/
  22: {
    /* n:"ExternCount", */
    f: ar
  },
  /*::[*/
  30: {
    /* n:"BIFF2FORMAT", */
    f: Ed
  },
  /*::[*/
  31: {
    /* n:"BIFF2FMTCNT", */
  },
  /* 16-bit cnt of BIFF2FORMAT records */
  /*::[*/
  32: {
    /* n:"BIFF2COLINFO", */
  },
  /*::[*/
  33: {
    /* n:"Array", */
    f: J0
  },
  /*::[*/
  36: {
    /* n:"COLWIDTH", */
  },
  /*::[*/
  37: {
    /* n:"DefaultRowHeight", */
    f: V0
  },
  // 0x2c ??
  // 0x2d ??
  // 0x2e ??
  // 0x30 FONTCOUNT: number of fonts
  /*::[*/
  50: {
    /* n:"BIFF2FONTXTRA", */
    f: x1
  },
  // 0x35: INFOOPTS
  // 0x36: TABLE (BIFF2 only)
  // 0x37: TABLE2 (BIFF2 only)
  // 0x38: WNDESK
  // 0x39 ??
  // 0x3a: BEGINPREF
  // 0x3b: ENDPREF
  /*::[*/
  62: {
    /* n:"BIFF2WINDOW2", */
  },
  // 0x3f ??
  // 0x46: SHOWSCROLL
  // 0x47: SHOWFORMULA
  // 0x48: STATUSBAR
  // 0x49: SHORTMENUS
  // 0x4A:
  // 0x4B:
  // 0x4C:
  // 0x4E:
  // 0x4F:
  // 0x58: TOOLBAR (BIFF3)
  /* - - - */
  /*::[*/
  52: {
    /* n:"DDEObjName", */
  },
  /*::[*/
  67: {
    /* n:"BIFF2XF", */
  },
  /*::[*/
  68: {
    /* n:"BIFF2XFINDEX", */
    f: ar
  },
  /*::[*/
  69: {
    /* n:"BIFF2FONTCLR", */
  },
  /*::[*/
  86: {
    /* n:"BIFF4FMTCNT", */
  },
  /* 16-bit cnt, similar to BIFF2 */
  /*::[*/
  126: {
    /* n:"RK", */
  },
  /* Not necessarily same as 0x027e */
  /*::[*/
  127: {
    /* n:"ImData", */
    f: c1
  },
  /*::[*/
  135: {
    /* n:"Addin", */
  },
  /*::[*/
  136: {
    /* n:"Edg", */
  },
  /*::[*/
  137: {
    /* n:"Pub", */
  },
  // 0x8A
  // 0x8B LH: alternate menu key flag (BIFF3/4)
  // 0x8E
  // 0x8F
  /*::[*/
  145: {
    /* n:"Sub", */
  },
  // 0x93 STYLE
  /*::[*/
  148: {
    /* n:"LHRecord", */
  },
  /*::[*/
  149: {
    /* n:"LHNGraph", */
  },
  /*::[*/
  150: {
    /* n:"Sound", */
  },
  // 0xA2 FNPROTO: function prototypes (BIFF4)
  // 0xA3
  // 0xA8
  /*::[*/
  169: {
    /* n:"CoordList", */
  },
  /*::[*/
  171: {
    /* n:"GCW", */
  },
  /*::[*/
  188: {
    /* n:"ShrFmla", */
  },
  /* Not necessarily same as 0x04bc */
  /*::[*/
  191: {
    /* n:"ToolbarHdr", */
  },
  /*::[*/
  192: {
    /* n:"ToolbarEnd", */
  },
  /*::[*/
  194: {
    /* n:"AddMenu", */
  },
  /*::[*/
  195: {
    /* n:"DelMenu", */
  },
  /*::[*/
  214: {
    /* n:"RString", */
    f: p1
  },
  /*::[*/
  223: {
    /* n:"UDDesc", */
  },
  /*::[*/
  234: {
    /* n:"TabIdConf", */
  },
  /*::[*/
  354: {
    /* n:"XL5Modify", */
  },
  /*::[*/
  421: {
    /* n:"FileSharing2", */
  },
  /*::[*/
  518: {
    /* n:"Formula", */
    f: wi
  },
  /*::[*/
  521: {
    /* n:"BOF", */
    f: Sn
  },
  /*::[*/
  536: {
    /* n:"Lbl", */
    f: $0
  },
  /*::[*/
  547: {
    /* n:"ExternName", */
    f: q0
  },
  /*::[*/
  561: {
    /* n:"Font", */
  },
  /*::[*/
  579: {
    /* n:"BIFF3XF", */
  },
  /*::[*/
  1030: {
    /* n:"Formula", */
    f: wi
  },
  /*::[*/
  1033: {
    /* n:"BOF", */
    f: Sn
  },
  /*::[*/
  1091: {
    /* n:"BIFF4XF", */
  },
  /*::[*/
  2157: {
    /* n:"FeatInfo", */
  },
  /*::[*/
  2163: {
    /* n:"FeatInfo11", */
  },
  /*::[*/
  2177: {
    /* n:"SXAddl12", */
  },
  /*::[*/
  2240: {
    /* n:"AutoWebPub", */
  },
  /*::[*/
  2241: {
    /* n:"ListObj", */
  },
  /*::[*/
  2242: {
    /* n:"ListField", */
  },
  /*::[*/
  2243: {
    /* n:"ListDV", */
  },
  /*::[*/
  2244: {
    /* n:"ListCondFmt", */
  },
  /*::[*/
  2245: {
    /* n:"ListCF", */
  },
  /*::[*/
  2246: {
    /* n:"FMQry", */
  },
  /*::[*/
  2247: {
    /* n:"FMSQry", */
  },
  /*::[*/
  2248: {
    /* n:"PLV", */
  },
  /*::[*/
  2249: {
    /* n:"LnExt", */
  },
  /*::[*/
  2250: {
    /* n:"MkrExt", */
  },
  /*::[*/
  2251: {
    /* n:"CrtCoopt", */
  },
  /*::[*/
  2262: {
    /* n:"FRTArchId$", */
    r: 12
  },
  /*::[*/
  29282: {}
};
function ie(e, t, r, a) {
  var n = t;
  if (!isNaN(n)) {
    var i = a || (r || []).length || 0, s = e.next(4);
    s.write_shift(2, n), s.write_shift(2, i), /*:: len != null &&*/
    i > 0 && ss(r) && e.push(r);
  }
}
function h_(e, t, r, a) {
  var n = (r || []).length || 0;
  if (n <= 8224) return ie(e, t, r, n);
  var i = t;
  if (!isNaN(i)) {
    for (var s = r.parts || [], c = 0, o = 0, l = 0; l + (s[c] || 8224) <= 8224; )
      l += s[c] || 8224, c++;
    var f = e.next(4);
    for (f.write_shift(2, i), f.write_shift(2, l), e.push(r.slice(o, o + l)), o += l; o < n; ) {
      for (f = e.next(4), f.write_shift(2, 60), l = 0; l + (s[c] || 8224) <= 8224; )
        l += s[c] || 8224, c++;
      f.write_shift(2, l), e.push(r.slice(o, o + l)), o += l;
    }
  }
}
function pn(e, t, r) {
  return e || (e = z(7)), e.write_shift(2, t), e.write_shift(2, r), e.write_shift(2, 0), e.write_shift(1, 0), e;
}
function d_(e, t, r, a) {
  var n = z(9);
  return pn(n, e, t), Oo(r, a || "b", n), n;
}
function x_(e, t, r) {
  var a = z(8 + 2 * r.length);
  return pn(a, e, t), a.write_shift(1, r.length), a.write_shift(r.length, r, "sbcs"), a.l < a.length ? a.slice(0, a.l) : a;
}
function p_(e, t, r, a) {
  if (t.v != null) switch (t.t) {
    case "d":
    case "n":
      var n = t.t == "d" ? sr(Ge(t.v)) : t.v;
      n == (n | 0) && n >= 0 && n < 65536 ? ie(e, 2, h1(r, a, n)) : ie(e, 3, l1(r, a, n));
      return;
    case "b":
    case "e":
      ie(e, 5, d_(r, a, t.v, t.t));
      return;
    /* TODO: codepage, sst */
    case "s":
    case "str":
      ie(e, 4, x_(r, a, (t.v || "").slice(0, 255)));
      return;
  }
  ie(e, 1, pn(null, r, a));
}
function m_(e, t, r, a) {
  var n = Array.isArray(t), i = Ae(t["!ref"] || "A1"), s, c = "", o = [];
  if (i.e.c > 255 || i.e.r > 16383) {
    if (a.WTF) throw new Error("Range " + (t["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    i.e.c = Math.min(i.e.c, 255), i.e.r = Math.min(i.e.c, 16383), s = _e(i);
  }
  for (var l = i.s.r; l <= i.e.r; ++l) {
    c = Ke(l);
    for (var f = i.s.c; f <= i.e.c; ++f) {
      l === i.s.r && (o[f] = He(f)), s = o[f] + c;
      var d = n ? (t[l] || [])[f] : t[s];
      d && p_(e, d, l, f);
    }
  }
}
function v_(e, t) {
  for (var r = t || {}, a = Ir(), n = 0, i = 0; i < e.SheetNames.length; ++i) e.SheetNames[i] == r.sheet && (n = i);
  if (n == 0 && r.sheet && e.SheetNames[0] != r.sheet) throw new Error("Sheet not found: " + r.sheet);
  return ie(a, r.biff == 4 ? 1033 : r.biff == 3 ? 521 : 9, ms(e, 16, r)), m_(a, e.Sheets[e.SheetNames[n]], n, r), ie(a, 10), a.end();
}
function g_(e, t, r) {
  ie(e, 49, hd({
    sz: 12,
    name: "Arial"
  }, r));
}
function E_(e, t, r) {
  t && [[5, 8], [23, 26], [41, 44], [
    /*63*/
    50,
    /*66],[164,*/
    392
  ]].forEach(function(a) {
    for (var n = a[0]; n <= a[1]; ++n) t[n] != null && ie(e, 1054, gd(n, t[n], r));
  });
}
function __(e, t) {
  var r = z(19);
  r.write_shift(4, 2151), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(2, 3), r.write_shift(1, 1), r.write_shift(4, 0), ie(e, 2151, r), r = z(39), r.write_shift(4, 2152), r.write_shift(4, 0), r.write_shift(4, 0), r.write_shift(2, 3), r.write_shift(1, 0), r.write_shift(4, 0), r.write_shift(2, 1), r.write_shift(4, 4), r.write_shift(2, 0), bo(Ae(t["!ref"] || "A1"), r), r.write_shift(4, 4), ie(e, 2152, r);
}
function T_(e, t) {
  for (var r = 0; r < 16; ++r) ie(e, 224, Y0({ numFmtId: 0, style: !0 }, 0, t));
  t.cellXfs.forEach(function(a) {
    ie(e, 224, Y0(a, 0, t));
  });
}
function w_(e, t) {
  for (var r = 0; r < t["!links"].length; ++r) {
    var a = t["!links"][r];
    ie(e, 440, Yd(a)), a[1].Tooltip && ie(e, 2048, Kd(a));
  }
  delete t["!links"];
}
function y_(e, t) {
  if (t) {
    var r = 0;
    t.forEach(function(a, n) {
      ++r <= 256 && a && ie(e, 125, e1(Zn(n, a), n));
    });
  }
}
function S_(e, t, r, a, n) {
  var i = 16 + Pt(n.cellXfs, t, n);
  if (t.v == null && !t.bf) {
    ie(e, 513, $t(r, a, i));
    return;
  }
  if (t.bf) ie(e, 6, Jm(t, r, a, n, i));
  else switch (t.t) {
    case "d":
    case "n":
      var s = t.t == "d" ? sr(Ge(t.v)) : t.v;
      ie(e, 515, Od(r, a, s, i));
      break;
    case "b":
    case "e":
      ie(e, 517, Nd(r, a, t.v, i, n, t.t));
      break;
    /* TODO: codepage, sst */
    case "s":
    case "str":
      if (n.bookSST) {
        var c = Ss(n.Strings, t.v, n.revStrings);
        ie(e, 253, xd(r, a, c, i));
      } else ie(e, 516, md(r, a, (t.v || "").slice(0, 255), i, n));
      break;
    default:
      ie(e, 513, $t(r, a, i));
  }
}
function k_(e, t, r) {
  var a = Ir(), n = r.SheetNames[e], i = r.Sheets[n] || {}, s = (r || {}).Workbook || {}, c = (s.Sheets || [])[e] || {}, o = Array.isArray(i), l = t.biff == 8, f, d = "", h = [], p = Ae(i["!ref"] || "A1"), m = l ? 65536 : 16384;
  if (p.e.c > 255 || p.e.r >= m) {
    if (t.WTF) throw new Error("Range " + (i["!ref"] || "A1") + " exceeds format limit A1:IV16384");
    p.e.c = Math.min(p.e.c, 255), p.e.r = Math.min(p.e.c, m - 1);
  }
  ie(a, 2057, ms(r, 16, t)), ie(a, 13, Yr(1)), ie(a, 12, Yr(100)), ie(a, 15, Nr(!0)), ie(a, 17, Nr(!1)), ie(a, 16, Kt(1e-3)), ie(a, 95, Nr(!0)), ie(a, 42, Nr(!1)), ie(a, 43, Nr(!1)), ie(a, 130, Yr(1)), ie(a, 128, Ad()), ie(a, 131, Nr(!1)), ie(a, 132, Nr(!1)), l && y_(a, i["!cols"]), ie(a, 512, _d(p, t)), l && (i["!links"] = []);
  for (var x = p.s.r; x <= p.e.r; ++x) {
    d = Ke(x);
    for (var u = p.s.c; u <= p.e.c; ++u) {
      x === p.s.r && (h[u] = He(u)), f = h[u] + d;
      var v = o ? (i[x] || [])[u] : i[f];
      v && (S_(a, v, x, u, t), l && v.l && i["!links"].push([f, v.l]));
    }
  }
  var E = c.CodeName || c.name || n;
  return l && ie(a, 574, fd((s.Views || [])[0])), l && (i["!merges"] || []).length && ie(a, 229, Xd(i["!merges"])), l && w_(a, i), ie(a, 442, Io(E)), l && __(a, i), ie(
    a,
    10
    /* EOF */
  ), a.end();
}
function F_(e, t, r) {
  var a = Ir(), n = (e || {}).Workbook || {}, i = n.Sheets || [], s = (
    /*::((*/
    n.WBProps || {
      /*::CodeName:"ThisWorkbook"*/
    }
  ), c = r.biff == 8, o = r.biff == 5;
  if (ie(a, 2057, ms(e, 5, r)), r.bookType == "xla" && ie(
    a,
    135
    /* Addin */
  ), ie(a, 225, c ? Yr(1200) : null), ie(a, 193, Nh(2)), o && ie(
    a,
    191
    /* ToolbarHdr */
  ), o && ie(
    a,
    192
    /* ToolbarEnd */
  ), ie(
    a,
    226
    /* InterfaceEnd */
  ), ie(a, 92, $h("SheetJS", r)), ie(a, 66, Yr(c ? 1200 : 1252)), c && ie(a, 353, Yr(0)), c && ie(
    a,
    448
    /* Excel9File */
  ), ie(a, 317, a1(e.SheetNames.length)), c && e.vbaraw && ie(
    a,
    211
    /* ObProj */
  ), c && e.vbaraw) {
    var l = s.CodeName || "ThisWorkbook";
    ie(a, 442, Io(l));
  }
  ie(a, 156, Yr(17)), ie(a, 25, Nr(!1)), ie(a, 18, Nr(!1)), ie(a, 19, Yr(0)), c && ie(a, 431, Nr(!1)), c && ie(a, 444, Yr(0)), ie(a, 61, cd()), ie(a, 64, Nr(!1)), ie(a, 141, Yr(0)), ie(a, 34, Nr(iE(e) == "true")), ie(a, 14, Nr(!0)), c && ie(a, 439, Nr(!1)), ie(a, 218, Yr(0)), g_(a, e, r), E_(a, e.SSF, r), T_(a, r), c && ie(a, 352, Nr(!1));
  var f = a.end(), d = Ir();
  c && ie(d, 140, $d()), c && r.Strings && h_(d, 252, rd(r.Strings)), ie(
    d,
    10
    /* EOF */
  );
  var h = d.end(), p = Ir(), m = 0, x = 0;
  for (x = 0; x < e.SheetNames.length; ++x) m += (c ? 12 : 11) + (c ? 2 : 1) * e.SheetNames[x].length;
  var u = f.length + m + h.length;
  for (x = 0; x < e.SheetNames.length; ++x) {
    var v = i[x] || {};
    ie(p, 133, Qh({ pos: u, hs: v.Hidden || 0, dt: 0, name: e.SheetNames[x] }, r)), u += t[x].length;
  }
  var E = p.end();
  if (m != E.length) throw new Error("BS8 " + m + " != " + E.length);
  var g = [];
  return f.length && g.push(f), E.length && g.push(E), h.length && g.push(h), fr(g);
}
function A_(e, t) {
  var r = t || {}, a = [];
  e && !e.SSF && (e.SSF = Ue(pe)), e && e.SSF && (Ea(), on(e.SSF), r.revssf = Yn(e.SSF), r.revssf[e.SSF[65535]] = 0, r.ssf = e.SSF), r.Strings = /*::((*/
  [], r.Strings.Count = 0, r.Strings.Unique = 0, Os(r), r.cellXfs = [], Pt(r.cellXfs, {}, { revssf: { General: 0 } }), e.Props || (e.Props = {});
  for (var n = 0; n < e.SheetNames.length; ++n) a[a.length] = k_(n, r, e);
  return a.unshift(F_(e, a, r)), fr(a);
}
function kf(e, t) {
  for (var r = 0; r <= e.SheetNames.length; ++r) {
    var a = e.Sheets[e.SheetNames[r]];
    if (!(!a || !a["!ref"])) {
      var n = Cr(a["!ref"]);
      n.e.c > 255 && typeof console < "u" && console.error && console.error("Worksheet '" + e.SheetNames[r] + "' extends beyond column IV (255).  Data may be lost.");
    }
  }
  var i = t || {};
  switch (i.biff || 2) {
    case 8:
    case 5:
      return A_(e, t);
    case 4:
    case 3:
    case 2:
      return v_(e, t);
  }
  throw new Error("invalid type " + i.bookType + " for BIFF");
}
function cc(e, t) {
  var r = t || {}, a = r.dense ? [] : {};
  e = e.replace(/<!--.*?-->/g, "");
  var n = e.match(/<table/i);
  if (!n) throw new Error("Invalid HTML: could not find <table>");
  var i = e.match(/<\/table/i), s = n.index, c = i && i.index || e.length, o = hu(e.slice(s, c), /(:?<tr[^>]*>)/i, "<tr>"), l = -1, f = 0, d = 0, h = 0, p = { s: { r: 1e7, c: 1e7 }, e: { r: 0, c: 0 } }, m = [];
  for (s = 0; s < o.length; ++s) {
    var x = o[s].trim(), u = x.slice(0, 3).toLowerCase();
    if (u == "<tr") {
      if (++l, r.sheetRows && r.sheetRows <= l) {
        --l;
        break;
      }
      f = 0;
      continue;
    }
    if (!(u != "<td" && u != "<th")) {
      var v = x.split(/<\/t[dh]>/i);
      for (c = 0; c < v.length; ++c) {
        var E = v[c].trim();
        if (E.match(/<t[dh]/i)) {
          for (var g = E, y = 0; g.charAt(0) == "<" && (y = g.indexOf(">")) > -1; ) g = g.slice(y + 1);
          for (var N = 0; N < m.length; ++N) {
            var A = m[N];
            A.s.c == f && A.s.r < l && l <= A.e.r && (f = A.e.c + 1, N = -1);
          }
          var w = ge(E.slice(0, E.indexOf(">")));
          h = w.colspan ? +w.colspan : 1, ((d = +w.rowspan) > 1 || h > 1) && m.push({ s: { r: l, c: f }, e: { r: l + (d || 1) - 1, c: f + h - 1 } });
          var P = w.t || w["data-t"] || "";
          if (!g.length) {
            f += h;
            continue;
          }
          if (g = Jc(g), p.s.r > l && (p.s.r = l), p.e.r < l && (p.e.r = l), p.s.c > f && (p.s.c = f), p.e.c < f && (p.e.c = f), !g.length) {
            f += h;
            continue;
          }
          var L = { t: "s", v: g };
          r.raw || !g.trim().length || P == "s" || (g === "TRUE" ? L = { t: "b", v: !0 } : g === "FALSE" ? L = { t: "b", v: !1 } : isNaN(et(g)) ? isNaN(ma(g).getDate()) || (L = { t: "d", v: Ge(g) }, r.cellDates || (L = { t: "n", v: sr(L.v) }), L.z = r.dateNF || pe[14]) : L = { t: "n", v: et(g) }), r.dense ? (a[l] || (a[l] = []), a[l][f] = L) : a[me({ r: l, c: f })] = L, f += h;
        }
      }
    }
  }
  return a["!ref"] = _e(p), m.length && (a["!merges"] = m), a;
}
function Ff(e, t, r, a) {
  for (var n = e["!merges"] || [], i = [], s = t.s.c; s <= t.e.c; ++s) {
    for (var c = 0, o = 0, l = 0; l < n.length; ++l)
      if (!(n[l].s.r > r || n[l].s.c > s) && !(n[l].e.r < r || n[l].e.c < s)) {
        if (n[l].s.r < r || n[l].s.c < s) {
          c = -1;
          break;
        }
        c = n[l].e.r - n[l].s.r + 1, o = n[l].e.c - n[l].s.c + 1;
        break;
      }
    if (!(c < 0)) {
      var f = me({ r, c: s }), d = a.dense ? (e[r] || [])[s] : e[f], h = d && d.v != null && (d.h || Qi(d.w || (ft(d), d.w) || "")) || "", p = {};
      c > 1 && (p.rowspan = c), o > 1 && (p.colspan = o), a.editable ? h = '<span contenteditable="true">' + h + "</span>" : d && (p["data-t"] = d && d.t || "z", d.v != null && (p["data-v"] = d.v), d.z != null && (p["data-z"] = d.z), d.l && (d.l.Target || "#").charAt(0) != "#" && (h = '<a href="' + d.l.Target + '">' + h + "</a>")), p.id = (a.id || "sjs") + "-" + f, i.push(ne("td", h, p));
    }
  }
  var m = "<tr>";
  return m + i.join("") + "</tr>";
}
var Af = '<html><head><meta charset="utf-8"/><title>SheetJS Table Export</title></head><body>', Nf = "</body></html>";
function N_(e, t) {
  var r = e.match(/<table[\s\S]*?>[\s\S]*?<\/table>/gi);
  if (!r || r.length == 0) throw new Error("Invalid HTML: could not find <table>");
  if (r.length == 1) return bt(cc(r[0], t), t);
  var a = bs();
  return r.forEach(function(n, i) {
    Ps(a, cc(n, t), "Sheet" + (i + 1));
  }), a;
}
function Cf(e, t, r) {
  var a = [];
  return a.join("") + "<table" + (r && r.id ? ' id="' + r.id + '"' : "") + ">";
}
function Of(e, t) {
  var r = t || {}, a = r.header != null ? r.header : Af, n = r.footer != null ? r.footer : Nf, i = [a], s = Cr(e["!ref"]);
  r.dense = Array.isArray(e), i.push(Cf(e, s, r));
  for (var c = s.s.r; c <= s.e.r; ++c) i.push(Ff(e, s, c, r));
  return i.push("</table>" + n), i.join("");
}
function If(e, t, r) {
  var a = r || {}, n = 0, i = 0;
  if (a.origin != null)
    if (typeof a.origin == "number") n = a.origin;
    else {
      var s = typeof a.origin == "string" ? Ye(a.origin) : a.origin;
      n = s.r, i = s.c;
    }
  var c = t.getElementsByTagName("tr"), o = Math.min(a.sheetRows || 1e7, c.length), l = { s: { r: 0, c: 0 }, e: { r: n, c: i } };
  if (e["!ref"]) {
    var f = Cr(e["!ref"]);
    l.s.r = Math.min(l.s.r, f.s.r), l.s.c = Math.min(l.s.c, f.s.c), l.e.r = Math.max(l.e.r, f.e.r), l.e.c = Math.max(l.e.c, f.e.c), n == -1 && (l.e.r = n = f.e.r + 1);
  }
  var d = [], h = 0, p = e["!rows"] || (e["!rows"] = []), m = 0, x = 0, u = 0, v = 0, E = 0, g = 0;
  for (e["!cols"] || (e["!cols"] = []); m < c.length && x < o; ++m) {
    var y = c[m];
    if (oc(y)) {
      if (a.display) continue;
      p[x] = { hidden: !0 };
    }
    var N = y.children;
    for (u = v = 0; u < N.length; ++u) {
      var A = N[u];
      if (!(a.display && oc(A))) {
        var w = A.hasAttribute("data-v") ? A.getAttribute("data-v") : A.hasAttribute("v") ? A.getAttribute("v") : Jc(A.innerHTML), P = A.getAttribute("data-z") || A.getAttribute("z");
        for (h = 0; h < d.length; ++h) {
          var L = d[h];
          L.s.c == v + i && L.s.r < x + n && x + n <= L.e.r && (v = L.e.c + 1 - i, h = -1);
        }
        g = +A.getAttribute("colspan") || 1, ((E = +A.getAttribute("rowspan") || 1) > 1 || g > 1) && d.push({ s: { r: x + n, c: v + i }, e: { r: x + n + (E || 1) - 1, c: v + i + (g || 1) - 1 } });
        var U = { t: "s", v: w }, M = A.getAttribute("data-t") || A.getAttribute("t") || "";
        w != null && (w.length == 0 ? U.t = M || "z" : a.raw || w.trim().length == 0 || M == "s" || (w === "TRUE" ? U = { t: "b", v: !0 } : w === "FALSE" ? U = { t: "b", v: !1 } : isNaN(et(w)) ? isNaN(ma(w).getDate()) || (U = { t: "d", v: Ge(w) }, a.cellDates || (U = { t: "n", v: sr(U.v) }), U.z = a.dateNF || pe[14]) : U = { t: "n", v: et(w) })), U.z === void 0 && P != null && (U.z = P);
        var b = "", K = A.getElementsByTagName("A");
        if (K && K.length) for (var se = 0; se < K.length && !(K[se].hasAttribute("href") && (b = K[se].getAttribute("href"), b.charAt(0) != "#")); ++se) ;
        b && b.charAt(0) != "#" && (U.l = { Target: b }), a.dense ? (e[x + n] || (e[x + n] = []), e[x + n][v + i] = U) : e[me({ c: v + i, r: x + n })] = U, l.e.c < v + i && (l.e.c = v + i), v += g;
      }
    }
    ++x;
  }
  return d.length && (e["!merges"] = (e["!merges"] || []).concat(d)), l.e.r = Math.max(l.e.r, x - 1 + n), e["!ref"] = _e(l), x >= o && (e["!fullref"] = _e((l.e.r = c.length - m + x - 1 + n, l))), e;
}
function Lf(e, t) {
  var r = t || {}, a = r.dense ? [] : {};
  return If(a, e, t);
}
function C_(e, t) {
  return bt(Lf(e, t), t);
}
function oc(e) {
  var t = "", r = O_(e);
  return r && (t = r(e).getPropertyValue("display")), t || (t = e.style && e.style.display), t === "none";
}
function O_(e) {
  return e.ownerDocument.defaultView && typeof e.ownerDocument.defaultView.getComputedStyle == "function" ? e.ownerDocument.defaultView.getComputedStyle : typeof getComputedStyle == "function" ? getComputedStyle : null;
}
function I_(e) {
  var t = e.replace(/[\t\r\n]/g, " ").trim().replace(/ +/g, " ").replace(/<text:s\/>/g, " ").replace(/<text:s text:c="(\d+)"\/>/g, function(a, n) {
    return Array(parseInt(n, 10) + 1).join(" ");
  }).replace(/<text:tab[^>]*\/>/g, "	").replace(/<text:line-break\/>/g, `
`), r = Ie(t.replace(/<[^>]*>/g, ""));
  return [r];
}
var fc = {
  /* ods name: [short ssf fmt, long ssf fmt] */
  day: ["d", "dd"],
  month: ["m", "mm"],
  year: ["y", "yy"],
  hours: ["h", "hh"],
  minutes: ["m", "mm"],
  seconds: ["s", "ss"],
  "am-pm": ["A/P", "AM/PM"],
  "day-of-week": ["ddd", "dddd"],
  era: ["e", "ee"],
  /* there is no native representation of LO "Q" format */
  quarter: ["\\Qm", 'm\\"th quarter"']
};
function Rf(e, t) {
  var r = t || {}, a = es(e), n = [], i, s, c = { name: "" }, o = "", l = 0, f, d, h = {}, p = [], m = r.dense ? [] : {}, x, u, v = { value: "" }, E = "", g = 0, y = [], N = -1, A = -1, w = { s: { r: 1e6, c: 1e7 }, e: { r: 0, c: 0 } }, P = 0, L = {}, U = [], M = {}, b = 0, K = 0, se = [], re = 1, ue = 1, oe = [], Le = { Names: [] }, G = {}, xe = ["", ""], ve = [], O = {}, B = "", R = 0, D = !1, Y = !1, J = 0;
  for (Ja.lastIndex = 0, a = a.replace(/<!--([\s\S]*?)-->/mg, "").replace(/<!DOCTYPE[^\[]*\[[^\]]*\]>/gm, ""); x = Ja.exec(a); ) switch (x[3] = x[3].replace(/_.*$/, "")) {
    case "table":
    case "工作表":
      x[1] === "/" ? (w.e.c >= w.s.c && w.e.r >= w.s.r ? m["!ref"] = _e(w) : m["!ref"] = "A1:A1", r.sheetRows > 0 && r.sheetRows <= w.e.r && (m["!fullref"] = m["!ref"], w.e.r = r.sheetRows - 1, m["!ref"] = _e(w)), U.length && (m["!merges"] = U), se.length && (m["!rows"] = se), f.name = f.名称 || f.name, typeof JSON < "u" && JSON.stringify(f), p.push(f.name), h[f.name] = m, Y = !1) : x[0].charAt(x[0].length - 2) !== "/" && (f = ge(x[0], !1), N = A = -1, w.s.r = w.s.c = 1e7, w.e.r = w.e.c = 0, m = r.dense ? [] : {}, U = [], se = [], Y = !0);
      break;
    case "table-row-group":
      x[1] === "/" ? --P : ++P;
      break;
    case "table-row":
    case "行":
      if (x[1] === "/") {
        N += re, re = 1;
        break;
      }
      if (d = ge(x[0], !1), d.行号 ? N = d.行号 - 1 : N == -1 && (N = 0), re = +d["number-rows-repeated"] || 1, re < 10) for (J = 0; J < re; ++J) P > 0 && (se[N + J] = { level: P });
      A = -1;
      break;
    case "covered-table-cell":
      x[1] !== "/" && ++A, r.sheetStubs && (r.dense ? (m[N] || (m[N] = []), m[N][A] = { t: "z" }) : m[me({ r: N, c: A })] = { t: "z" }), E = "", y = [];
      break;
    /* stub */
    case "table-cell":
    case "数据":
      if (x[0].charAt(x[0].length - 2) === "/")
        ++A, v = ge(x[0], !1), ue = parseInt(v["number-columns-repeated"] || "1", 10), u = {
          t: "z",
          v: null
          /*:: , z:null, w:"",c:[]*/
        }, v.formula && r.cellFormula != !1 && (u.f = nc(Ie(v.formula))), (v.数据类型 || v["value-type"]) == "string" && (u.t = "s", u.v = Ie(v["string-value"] || ""), r.dense ? (m[N] || (m[N] = []), m[N][A] = u) : m[me({ r: N, c: A })] = u), A += ue - 1;
      else if (x[1] !== "/") {
        ++A, E = "", g = 0, y = [], ue = 1;
        var ae = re ? N + re - 1 : N;
        if (A > w.e.c && (w.e.c = A), A < w.s.c && (w.s.c = A), N < w.s.r && (w.s.r = N), ae > w.e.r && (w.e.r = ae), v = ge(x[0], !1), ve = [], O = {}, u = {
          t: v.数据类型 || v["value-type"],
          v: null
          /*:: , z:null, w:"",c:[]*/
        }, r.cellFormula)
          if (v.formula && (v.formula = Ie(v.formula)), v["number-matrix-columns-spanned"] && v["number-matrix-rows-spanned"] && (b = parseInt(v["number-matrix-rows-spanned"], 10) || 0, K = parseInt(v["number-matrix-columns-spanned"], 10) || 0, M = { s: { r: N, c: A }, e: { r: N + b - 1, c: A + K - 1 } }, u.F = _e(M), oe.push([M, u.F])), v.formula) u.f = nc(v.formula);
          else for (J = 0; J < oe.length; ++J)
            N >= oe[J][0].s.r && N <= oe[J][0].e.r && A >= oe[J][0].s.c && A <= oe[J][0].e.c && (u.F = oe[J][1]);
        switch ((v["number-columns-spanned"] || v["number-rows-spanned"]) && (b = parseInt(v["number-rows-spanned"], 10) || 0, K = parseInt(v["number-columns-spanned"], 10) || 0, M = { s: { r: N, c: A }, e: { r: N + b - 1, c: A + K - 1 } }, U.push(M)), v["number-columns-repeated"] && (ue = parseInt(v["number-columns-repeated"], 10)), u.t) {
          case "boolean":
            u.t = "b", u.v = We(v["boolean-value"]);
            break;
          case "float":
            u.t = "n", u.v = parseFloat(v.value);
            break;
          case "percentage":
            u.t = "n", u.v = parseFloat(v.value);
            break;
          case "currency":
            u.t = "n", u.v = parseFloat(v.value);
            break;
          case "date":
            u.t = "d", u.v = Ge(v["date-value"]), r.cellDates || (u.t = "n", u.v = sr(u.v)), u.z = "m/d/yy";
            break;
          case "time":
            u.t = "n", u.v = fu(v["time-value"]) / 86400, r.cellDates && (u.t = "d", u.v = jn(u.v)), u.z = "HH:MM:SS";
            break;
          case "number":
            u.t = "n", u.v = parseFloat(v.数据数值);
            break;
          default:
            if (u.t === "string" || u.t === "text" || !u.t)
              u.t = "s", v["string-value"] != null && (E = Ie(v["string-value"]), y = []);
            else throw new Error("Unsupported value type " + u.t);
        }
      } else {
        if (D = !1, u.t === "s" && (u.v = E || "", y.length && (u.R = y), D = g == 0), G.Target && (u.l = G), ve.length > 0 && (u.c = ve, ve = []), E && r.cellText !== !1 && (u.w = E), D && (u.t = "z", delete u.v), (!D || r.sheetStubs) && !(r.sheetRows && r.sheetRows <= N))
          for (var ee = 0; ee < re; ++ee) {
            if (ue = parseInt(v["number-columns-repeated"] || "1", 10), r.dense)
              for (m[N + ee] || (m[N + ee] = []), m[N + ee][A] = ee == 0 ? u : Ue(u); --ue > 0; ) m[N + ee][A + ue] = Ue(u);
            else
              for (m[me({ r: N + ee, c: A })] = u; --ue > 0; ) m[me({ r: N + ee, c: A + ue })] = Ue(u);
            w.e.c <= A && (w.e.c = A);
          }
        ue = parseInt(v["number-columns-repeated"] || "1", 10), A += ue - 1, ue = 0, u = {
          /*:: t:"", v:null, z:null, w:"",c:[]*/
        }, E = "", y = [];
      }
      G = {};
      break;
    // 9.1.4 <table:table-cell>
    /* pure state */
    case "document":
    // TODO: <office:document> is the root for FODS
    case "document-content":
    case "电子表格文档":
    // 3.1.3.2 <office:document-content>
    case "spreadsheet":
    case "主体":
    // 3.7 <office:spreadsheet>
    case "scripts":
    // 3.12 <office:scripts>
    case "styles":
    // TODO <office:styles>
    case "font-face-decls":
    // 3.14 <office:font-face-decls>
    case "master-styles":
      if (x[1] === "/") {
        if ((i = n.pop())[0] !== x[3]) throw "Bad state: " + i;
      } else x[0].charAt(x[0].length - 2) !== "/" && n.push([x[3], !0]);
      break;
    case "annotation":
      if (x[1] === "/") {
        if ((i = n.pop())[0] !== x[3]) throw "Bad state: " + i;
        O.t = E, y.length && (O.R = y), O.a = B, ve.push(O);
      } else x[0].charAt(x[0].length - 2) !== "/" && n.push([x[3], !1]);
      B = "", R = 0, E = "", g = 0, y = [];
      break;
    case "creator":
      x[1] === "/" ? B = a.slice(R, x.index) : R = x.index + x[0].length;
      break;
    /* ignore state */
    case "meta":
    case "元数据":
    // TODO: <office:meta> <uof:元数据> FODS/UOF
    case "settings":
    // TODO: <office:settings>
    case "config-item-set":
    // TODO: <office:config-item-set>
    case "config-item-map-indexed":
    // TODO: <office:config-item-map-indexed>
    case "config-item-map-entry":
    // TODO: <office:config-item-map-entry>
    case "config-item-map-named":
    // TODO: <office:config-item-map-entry>
    case "shapes":
    // 9.2.8 <table:shapes>
    case "frame":
    // 10.4.2 <draw:frame>
    case "text-box":
    // 10.4.3 <draw:text-box>
    case "image":
    // 10.4.4 <draw:image>
    case "data-pilot-tables":
    // 9.6.2 <table:data-pilot-tables>
    case "list-style":
    // 16.30 <text:list-style>
    case "form":
    // 13.13 <form:form>
    case "dde-links":
    // 9.8 <table:dde-links>
    case "event-listeners":
    // TODO
    case "chart":
      if (x[1] === "/") {
        if ((i = n.pop())[0] !== x[3]) throw "Bad state: " + i;
      } else x[0].charAt(x[0].length - 2) !== "/" && n.push([x[3], !1]);
      E = "", g = 0, y = [];
      break;
    case "scientific-number":
      break;
    case "currency-symbol":
      break;
    case "currency-style":
      break;
    case "number-style":
    // 16.27.2 <number:number-style>
    case "percentage-style":
    // 16.27.9 <number:percentage-style>
    case "date-style":
    // 16.27.10 <number:date-style>
    case "time-style":
      if (x[1] === "/") {
        if (L[c.name] = o, (i = n.pop())[0] !== x[3]) throw "Bad state: " + i;
      } else x[0].charAt(x[0].length - 2) !== "/" && (o = "", c = ge(x[0], !1), n.push([x[3], !0]));
      break;
    case "script":
      break;
    // 3.13 <office:script>
    case "libraries":
      break;
    // TODO: <ooo:libraries>
    case "automatic-styles":
      break;
    // 3.15.3 <office:automatic-styles>
    case "default-style":
    // TODO: <style:default-style>
    case "page-layout":
      break;
    // TODO: <style:page-layout>
    case "style":
      break;
    case "map":
      break;
    // 16.3 <style:map>
    case "font-face":
      break;
    // 16.21 <style:font-face>
    case "paragraph-properties":
      break;
    // 17.6 <style:paragraph-properties>
    case "table-properties":
      break;
    // 17.15 <style:table-properties>
    case "table-column-properties":
      break;
    // 17.16 <style:table-column-properties>
    case "table-row-properties":
      break;
    // 17.17 <style:table-row-properties>
    case "table-cell-properties":
      break;
    // 17.18 <style:table-cell-properties>
    case "number":
      switch (n[n.length - 1][0]) {
        case "time-style":
        case "date-style":
          s = ge(x[0], !1), o += fc[x[3]][s.style === "long" ? 1 : 0];
          break;
      }
      break;
    case "fraction":
      break;
    // TODO 16.27.6 <number:fraction>
    case "day":
    // 16.27.11 <number:day>
    case "month":
    // 16.27.12 <number:month>
    case "year":
    // 16.27.13 <number:year>
    case "era":
    // 16.27.14 <number:era>
    case "day-of-week":
    // 16.27.15 <number:day-of-week>
    case "week-of-year":
    // 16.27.16 <number:week-of-year>
    case "quarter":
    // 16.27.17 <number:quarter>
    case "hours":
    // 16.27.19 <number:hours>
    case "minutes":
    // 16.27.20 <number:minutes>
    case "seconds":
    // 16.27.21 <number:seconds>
    case "am-pm":
      switch (n[n.length - 1][0]) {
        case "time-style":
        case "date-style":
          s = ge(x[0], !1), o += fc[x[3]][s.style === "long" ? 1 : 0];
          break;
      }
      break;
    case "boolean-style":
      break;
    // 16.27.23 <number:boolean-style>
    case "boolean":
      break;
    // 16.27.24 <number:boolean>
    case "text-style":
      break;
    // 16.27.25 <number:text-style>
    case "text":
      if (x[0].slice(-2) === "/>") break;
      if (x[1] === "/") switch (n[n.length - 1][0]) {
        case "number-style":
        case "date-style":
        case "time-style":
          o += a.slice(l, x.index);
          break;
      }
      else l = x.index + x[0].length;
      break;
    case "named-range":
      s = ge(x[0], !1), xe = yi(s["cell-range-address"]);
      var Z = { Name: s.name, Ref: xe[0] + "!" + xe[1] };
      Y && (Z.Sheet = p.length), Le.Names.push(Z);
      break;
    case "text-content":
      break;
    // 16.27.27 <number:text-content>
    case "text-properties":
      break;
    // 16.27.27 <style:text-properties>
    case "embedded-text":
      break;
    // 16.27.4 <number:embedded-text>
    case "body":
    case "电子表格":
      break;
    // 3.3 16.9.6 19.726.3
    case "forms":
      break;
    // 12.25.2 13.2
    case "table-column":
      break;
    // 9.1.6 <table:table-column>
    case "table-header-rows":
      break;
    // 9.1.7 <table:table-header-rows>
    case "table-rows":
      break;
    // 9.1.12 <table:table-rows>
    /* TODO: outline levels */
    case "table-column-group":
      break;
    // 9.1.10 <table:table-column-group>
    case "table-header-columns":
      break;
    // 9.1.11 <table:table-header-columns>
    case "table-columns":
      break;
    // 9.1.12 <table:table-columns>
    case "null-date":
      break;
    // 9.4.2 <table:null-date> TODO: date1904
    case "graphic-properties":
      break;
    // 17.21 <style:graphic-properties>
    case "calculation-settings":
      break;
    // 9.4.1 <table:calculation-settings>
    case "named-expressions":
      break;
    // 9.4.11 <table:named-expressions>
    case "label-range":
      break;
    // 9.4.9 <table:label-range>
    case "label-ranges":
      break;
    // 9.4.10 <table:label-ranges>
    case "named-expression":
      break;
    // 9.4.13 <table:named-expression>
    case "sort":
      break;
    // 9.4.19 <table:sort>
    case "sort-by":
      break;
    // 9.4.20 <table:sort-by>
    case "sort-groups":
      break;
    // 9.4.22 <table:sort-groups>
    case "tab":
      break;
    // 6.1.4 <text:tab>
    case "line-break":
      break;
    // 6.1.5 <text:line-break>
    case "span":
      break;
    // 6.1.7 <text:span>
    case "p":
    case "文本串":
      if (["master-styles"].indexOf(n[n.length - 1][0]) > -1) break;
      if (x[1] === "/" && (!v || !v["string-value"])) {
        var we = I_(a.slice(g, x.index));
        E = (E.length > 0 ? E + `
` : "") + we[0];
      } else
        ge(x[0], !1), g = x.index + x[0].length;
      break;
    // <text:p>
    case "s":
      break;
    // <text:s>
    case "database-range":
      if (x[1] === "/") break;
      try {
        xe = yi(ge(x[0])["target-range-address"]), h[xe[0]]["!autofilter"] = { ref: xe[1] };
      } catch {
      }
      break;
    case "date":
      break;
    // <*:date>
    case "object":
      break;
    // 10.4.6.2 <draw:object>
    case "title":
    case "标题":
      break;
    // <*:title> OR <uof:标题>
    case "desc":
      break;
    // <*:desc>
    case "binary-data":
      break;
    // 10.4.5 TODO: b64 blob
    /* 9.2 Advanced Tables */
    case "table-source":
      break;
    // 9.2.6
    case "scenario":
      break;
    // 9.2.6
    case "iteration":
      break;
    // 9.4.3 <table:iteration>
    case "content-validations":
      break;
    // 9.4.4 <table:
    case "content-validation":
      break;
    // 9.4.5 <table:
    case "help-message":
      break;
    // 9.4.6 <table:
    case "error-message":
      break;
    // 9.4.7 <table:
    case "database-ranges":
      break;
    // 9.4.14 <table:database-ranges>
    case "filter":
      break;
    // 9.5.2 <table:filter>
    case "filter-and":
      break;
    // 9.5.3 <table:filter-and>
    case "filter-or":
      break;
    // 9.5.4 <table:filter-or>
    case "filter-condition":
      break;
    // 9.5.5 <table:filter-condition>
    case "list-level-style-bullet":
      break;
    // 16.31 <text:
    case "list-level-style-number":
      break;
    // 16.32 <text:
    case "list-level-properties":
      break;
    // 17.19 <style:
    /* 7.3 Document Fields */
    case "sender-firstname":
    // 7.3.6.2
    case "sender-lastname":
    // 7.3.6.3
    case "sender-initials":
    // 7.3.6.4
    case "sender-title":
    // 7.3.6.5
    case "sender-position":
    // 7.3.6.6
    case "sender-email":
    // 7.3.6.7
    case "sender-phone-private":
    // 7.3.6.8
    case "sender-fax":
    // 7.3.6.9
    case "sender-company":
    // 7.3.6.10
    case "sender-phone-work":
    // 7.3.6.11
    case "sender-street":
    // 7.3.6.12
    case "sender-city":
    // 7.3.6.13
    case "sender-postal-code":
    // 7.3.6.14
    case "sender-country":
    // 7.3.6.15
    case "sender-state-or-province":
    // 7.3.6.16
    case "author-name":
    // 7.3.7.1
    case "author-initials":
    // 7.3.7.2
    case "chapter":
    // 7.3.8
    case "file-name":
    // 7.3.9
    case "template-name":
    // 7.3.9
    case "sheet-name":
      break;
    case "event-listener":
      break;
    /* TODO: FODS Properties */
    case "initial-creator":
    case "creation-date":
    case "print-date":
    case "generator":
    case "document-statistic":
    case "user-defined":
    case "editing-duration":
    case "editing-cycles":
      break;
    /* TODO: FODS Config */
    case "config-item":
      break;
    /* TODO: style tokens */
    case "page-number":
      break;
    // TODO <text:page-number>
    case "page-count":
      break;
    // TODO <text:page-count>
    case "time":
      break;
    // TODO <text:time>
    /* 9.3 Advanced Table Cells */
    case "cell-range-source":
      break;
    // 9.3.1 <table:
    case "detective":
      break;
    // 9.3.2 <table:
    case "operation":
      break;
    // 9.3.3 <table:
    case "highlighted-range":
      break;
    // 9.3.4 <table:
    /* 9.6 Data Pilot Tables <table: */
    case "data-pilot-table":
    // 9.6.3
    case "source-cell-range":
    // 9.6.5
    case "source-service":
    // 9.6.6
    case "data-pilot-field":
    // 9.6.7
    case "data-pilot-level":
    // 9.6.8
    case "data-pilot-subtotals":
    // 9.6.9
    case "data-pilot-subtotal":
    // 9.6.10
    case "data-pilot-members":
    // 9.6.11
    case "data-pilot-member":
    // 9.6.12
    case "data-pilot-display-info":
    // 9.6.13
    case "data-pilot-sort-info":
    // 9.6.14
    case "data-pilot-layout-info":
    // 9.6.15
    case "data-pilot-field-reference":
    // 9.6.16
    case "data-pilot-groups":
    // 9.6.17
    case "data-pilot-group":
    // 9.6.18
    case "data-pilot-group-member":
      break;
    /* 10.3 Drawing Shapes */
    case "rect":
      break;
    /* 14.6 DDE Connections */
    case "dde-connection-decls":
    // 14.6.2 <text:
    case "dde-connection-decl":
    // 14.6.3 <text:
    case "dde-link":
    // 14.6.4 <table:
    case "dde-source":
      break;
    case "properties":
      break;
    // 13.7 <form:properties>
    case "property":
      break;
    // 13.8 <form:property>
    case "a":
      if (x[1] !== "/") {
        if (G = ge(x[0], !1), !G.href) break;
        G.Target = Ie(G.href), delete G.href, G.Target.charAt(0) == "#" && G.Target.indexOf(".") > -1 ? (xe = yi(G.Target.slice(1)), G.Target = "#" + xe[0] + "!" + xe[1]) : G.Target.match(/^\.\.[\\\/]/) && (G.Target = G.Target.slice(3));
      }
      break;
    /* non-standard */
    case "table-protection":
      break;
    case "data-pilot-grand-total":
      break;
    // <table:
    case "office-document-common-attrs":
      break;
    // bare
    default:
      switch (x[2]) {
        case "dc:":
        // TODO: properties
        case "calcext:":
        // ignore undocumented extensions
        case "loext:":
        // ignore undocumented extensions
        case "ooo:":
        // ignore undocumented extensions
        case "chartooo:":
        // ignore undocumented extensions
        case "draw:":
        // TODO: drawing
        case "style:":
        // TODO: styles
        case "chart:":
        // TODO: charts
        case "form:":
        // TODO: forms
        case "uof:":
        // TODO: uof
        case "表:":
        // TODO: uof
        case "字:":
          break;
        default:
          if (r.WTF) throw new Error(x);
      }
  }
  var I = {
    Sheets: h,
    SheetNames: p,
    Workbook: Le
  };
  return r.bookSheets && delete /*::(*/
  I.Sheets, I;
}
function lc(e, t) {
  t = t || {}, zr(e, "META-INF/manifest.xml") && fh(tr(e, "META-INF/manifest.xml"), t);
  var r = br(e, "content.xml");
  if (!r) throw new Error("Missing content.xml in ODS / UOF file");
  var a = Rf(Me(r), t);
  return zr(e, "meta.xml") && (a.Props = go(tr(e, "meta.xml"))), a;
}
function uc(e, t) {
  return Rf(e, t);
}
var L_ = /* @__PURE__ */ (function() {
  var e = [
    "<office:master-styles>",
    '<style:master-page style:name="mp1" style:page-layout-name="mp1">',
    "<style:header/>",
    '<style:header-left style:display="false"/>',
    "<style:footer/>",
    '<style:footer-left style:display="false"/>',
    "</style:master-page>",
    "</office:master-styles>"
  ].join(""), t = "<office:document-styles " + $a({
    "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
    "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
    "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
    "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
    "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
    "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    "xmlns:dc": "http://purl.org/dc/elements/1.1/",
    "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
    "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
    "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
    "office:version": "1.2"
  }) + ">" + e + "</office:document-styles>";
  return function() {
    return er + t;
  };
})(), hc = /* @__PURE__ */ (function() {
  var e = function(i) {
    return Pe(i).replace(/  +/g, function(s) {
      return '<text:s text:c="' + s.length + '"/>';
    }).replace(/\t/g, "<text:tab/>").replace(/\n/g, "</text:p><text:p>").replace(/^ /, "<text:s/>").replace(/ $/, "<text:s/>");
  }, t = `          <table:table-cell />
`, r = `          <table:covered-table-cell/>
`, a = function(i, s, c) {
    var o = [];
    o.push('      <table:table table:name="' + Pe(s.SheetNames[c]) + `" table:style-name="ta1">
`);
    var l = 0, f = 0, d = Cr(i["!ref"] || "A1"), h = i["!merges"] || [], p = 0, m = Array.isArray(i);
    if (i["!cols"])
      for (f = 0; f <= d.e.c; ++f) o.push("        <table:table-column" + (i["!cols"][f] ? ' table:style-name="co' + i["!cols"][f].ods + '"' : "") + `></table:table-column>
`);
    var x = "", u = i["!rows"] || [];
    for (l = 0; l < d.s.r; ++l)
      x = u[l] ? ' table:style-name="ro' + u[l].ods + '"' : "", o.push("        <table:table-row" + x + `></table:table-row>
`);
    for (; l <= d.e.r; ++l) {
      for (x = u[l] ? ' table:style-name="ro' + u[l].ods + '"' : "", o.push("        <table:table-row" + x + `>
`), f = 0; f < d.s.c; ++f) o.push(t);
      for (; f <= d.e.c; ++f) {
        var v = !1, E = {}, g = "";
        for (p = 0; p != h.length; ++p)
          if (!(h[p].s.c > f) && !(h[p].s.r > l) && !(h[p].e.c < f) && !(h[p].e.r < l)) {
            (h[p].s.c != f || h[p].s.r != l) && (v = !0), E["table:number-columns-spanned"] = h[p].e.c - h[p].s.c + 1, E["table:number-rows-spanned"] = h[p].e.r - h[p].s.r + 1;
            break;
          }
        if (v) {
          o.push(r);
          continue;
        }
        var y = me({ r: l, c: f }), N = m ? (i[l] || [])[f] : i[y];
        if (N && N.f && (E["table:formula"] = Pe(av(N.f)), N.F && N.F.slice(0, y.length) == y)) {
          var A = Cr(N.F);
          E["table:number-matrix-columns-spanned"] = A.e.c - A.s.c + 1, E["table:number-matrix-rows-spanned"] = A.e.r - A.s.r + 1;
        }
        if (!N) {
          o.push(t);
          continue;
        }
        switch (N.t) {
          case "b":
            g = N.v ? "TRUE" : "FALSE", E["office:value-type"] = "boolean", E["office:boolean-value"] = N.v ? "true" : "false";
            break;
          case "n":
            g = N.w || String(N.v || 0), E["office:value-type"] = "float", E["office:value"] = N.v || 0;
            break;
          case "s":
          case "str":
            g = N.v == null ? "" : N.v, E["office:value-type"] = "string";
            break;
          case "d":
            g = N.w || Ge(N.v).toISOString(), E["office:value-type"] = "date", E["office:date-value"] = Ge(N.v).toISOString(), E["table:style-name"] = "ce1";
            break;
          //case 'e':
          default:
            o.push(t);
            continue;
        }
        var w = e(g);
        if (N.l && N.l.Target) {
          var P = N.l.Target;
          P = P.charAt(0) == "#" ? "#" + nv(P.slice(1)) : P, P.charAt(0) != "#" && !P.match(/^\w+:/) && (P = "../" + P), w = ne("text:a", w, { "xlink:href": P.replace(/&/g, "&amp;") });
        }
        o.push("          " + ne("table:table-cell", ne("text:p", w, {}), E) + `
`);
      }
      o.push(`        </table:table-row>
`);
    }
    return o.push(`      </table:table>
`), o.join("");
  }, n = function(i, s) {
    i.push(` <office:automatic-styles>
`), i.push(`  <number:date-style style:name="N37" number:automatic-order="true">
`), i.push(`   <number:month number:style="long"/>
`), i.push(`   <number:text>/</number:text>
`), i.push(`   <number:day number:style="long"/>
`), i.push(`   <number:text>/</number:text>
`), i.push(`   <number:year/>
`), i.push(`  </number:date-style>
`);
    var c = 0;
    s.SheetNames.map(function(l) {
      return s.Sheets[l];
    }).forEach(function(l) {
      if (l && l["!cols"]) {
        for (var f = 0; f < l["!cols"].length; ++f) if (l["!cols"][f]) {
          var d = l["!cols"][f];
          if (d.width == null && d.wpx == null && d.wch == null) continue;
          It(d), d.ods = c;
          var h = l["!cols"][f].wpx + "px";
          i.push('  <style:style style:name="co' + c + `" style:family="table-column">
`), i.push('   <style:table-column-properties fo:break-before="auto" style:column-width="' + h + `"/>
`), i.push(`  </style:style>
`), ++c;
        }
      }
    });
    var o = 0;
    s.SheetNames.map(function(l) {
      return s.Sheets[l];
    }).forEach(function(l) {
      if (l && l["!rows"]) {
        for (var f = 0; f < l["!rows"].length; ++f) if (l["!rows"][f]) {
          l["!rows"][f].ods = o;
          var d = l["!rows"][f].hpx + "px";
          i.push('  <style:style style:name="ro' + o + `" style:family="table-row">
`), i.push('   <style:table-row-properties fo:break-before="auto" style:row-height="' + d + `"/>
`), i.push(`  </style:style>
`), ++o;
        }
      }
    }), i.push(`  <style:style style:name="ta1" style:family="table" style:master-page-name="mp1">
`), i.push(`   <style:table-properties table:display="true" style:writing-mode="lr-tb"/>
`), i.push(`  </style:style>
`), i.push(`  <style:style style:name="ce1" style:family="table-cell" style:parent-style-name="Default" style:data-style-name="N37"/>
`), i.push(` </office:automatic-styles>
`);
  };
  return function(s, c) {
    var o = [er], l = $a({
      "xmlns:office": "urn:oasis:names:tc:opendocument:xmlns:office:1.0",
      "xmlns:table": "urn:oasis:names:tc:opendocument:xmlns:table:1.0",
      "xmlns:style": "urn:oasis:names:tc:opendocument:xmlns:style:1.0",
      "xmlns:text": "urn:oasis:names:tc:opendocument:xmlns:text:1.0",
      "xmlns:draw": "urn:oasis:names:tc:opendocument:xmlns:drawing:1.0",
      "xmlns:fo": "urn:oasis:names:tc:opendocument:xmlns:xsl-fo-compatible:1.0",
      "xmlns:xlink": "http://www.w3.org/1999/xlink",
      "xmlns:dc": "http://purl.org/dc/elements/1.1/",
      "xmlns:meta": "urn:oasis:names:tc:opendocument:xmlns:meta:1.0",
      "xmlns:number": "urn:oasis:names:tc:opendocument:xmlns:datastyle:1.0",
      "xmlns:presentation": "urn:oasis:names:tc:opendocument:xmlns:presentation:1.0",
      "xmlns:svg": "urn:oasis:names:tc:opendocument:xmlns:svg-compatible:1.0",
      "xmlns:chart": "urn:oasis:names:tc:opendocument:xmlns:chart:1.0",
      "xmlns:dr3d": "urn:oasis:names:tc:opendocument:xmlns:dr3d:1.0",
      "xmlns:math": "http://www.w3.org/1998/Math/MathML",
      "xmlns:form": "urn:oasis:names:tc:opendocument:xmlns:form:1.0",
      "xmlns:script": "urn:oasis:names:tc:opendocument:xmlns:script:1.0",
      "xmlns:ooo": "http://openoffice.org/2004/office",
      "xmlns:ooow": "http://openoffice.org/2004/writer",
      "xmlns:oooc": "http://openoffice.org/2004/calc",
      "xmlns:dom": "http://www.w3.org/2001/xml-events",
      "xmlns:xforms": "http://www.w3.org/2002/xforms",
      "xmlns:xsd": "http://www.w3.org/2001/XMLSchema",
      "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "xmlns:sheet": "urn:oasis:names:tc:opendocument:sh33tjs:1.0",
      "xmlns:rpt": "http://openoffice.org/2005/report",
      "xmlns:of": "urn:oasis:names:tc:opendocument:xmlns:of:1.2",
      "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
      "xmlns:grddl": "http://www.w3.org/2003/g/data-view#",
      "xmlns:tableooo": "http://openoffice.org/2009/table",
      "xmlns:drawooo": "http://openoffice.org/2010/draw",
      "xmlns:calcext": "urn:org:documentfoundation:names:experimental:calc:xmlns:calcext:1.0",
      "xmlns:loext": "urn:org:documentfoundation:names:experimental:office:xmlns:loext:1.0",
      "xmlns:field": "urn:openoffice:names:experimental:ooo-ms-interop:xmlns:field:1.0",
      "xmlns:formx": "urn:openoffice:names:experimental:ooxml-odf-interop:xmlns:form:1.0",
      "xmlns:css3t": "http://www.w3.org/TR/css3-text/",
      "office:version": "1.2"
    }), f = $a({
      "xmlns:config": "urn:oasis:names:tc:opendocument:xmlns:config:1.0",
      "office:mimetype": "application/vnd.oasis.opendocument.spreadsheet"
    });
    c.bookType == "fods" ? (o.push("<office:document" + l + f + `>
`), o.push(vo().replace(/office:document-meta/g, "office:meta"))) : o.push("<office:document-content" + l + `>
`), n(o, s), o.push(`  <office:body>
`), o.push(`    <office:spreadsheet>
`);
    for (var d = 0; d != s.SheetNames.length; ++d) o.push(a(s.Sheets[s.SheetNames[d]], s, d));
    return o.push(`    </office:spreadsheet>
`), o.push(`  </office:body>
`), c.bookType == "fods" ? o.push("</office:document>") : o.push("</office:document-content>"), o.join("");
  };
})();
function Df(e, t) {
  if (t.bookType == "fods") return hc(e, t);
  var r = $i(), a = "", n = [], i = [];
  return a = "mimetype", Te(r, a, "application/vnd.oasis.opendocument.spreadsheet"), a = "content.xml", Te(r, a, hc(e, t)), n.push([a, "text/xml"]), i.push([a, "ContentFile"]), a = "styles.xml", Te(r, a, L_(e, t)), n.push([a, "text/xml"]), i.push([a, "StylesFile"]), a = "meta.xml", Te(r, a, er + vo(
    /*::wb, opts*/
  )), n.push([a, "text/xml"]), i.push([a, "MetadataFile"]), a = "manifest.rdf", Te(r, a, hh(
    i
    /*, opts*/
  )), n.push([a, "application/rdf+xml"]), a = "META-INF/manifest.xml", Te(r, a, lh(
    n
    /*, opts*/
  )), r;
}
function Jt(e) {
  return new DataView(e.buffer, e.byteOffset, e.byteLength);
}
function Hi(e) {
  return typeof TextDecoder < "u" ? new TextDecoder().decode(e) : Me(Dt(e));
}
function R_(e) {
  return typeof TextEncoder < "u" ? new TextEncoder().encode(e) : Dr(ct(e));
}
function D_(e, t) {
  e:
    for (var r = 0; r <= e.length - t.length; ++r) {
      for (var a = 0; a < t.length; ++a)
        if (e[r + a] != t[a])
          continue e;
      return !0;
    }
  return !1;
}
function Rt(e) {
  var t = e.reduce(function(n, i) {
    return n + i.length;
  }, 0), r = new Uint8Array(t), a = 0;
  return e.forEach(function(n) {
    r.set(n, a), a += n.length;
  }), r;
}
function dc(e) {
  return e -= e >> 1 & 1431655765, e = (e & 858993459) + (e >> 2 & 858993459), (e + (e >> 4) & 252645135) * 16843009 >>> 24;
}
function b_(e, t) {
  for (var r = (e[t + 15] & 127) << 7 | e[t + 14] >> 1, a = e[t + 14] & 1, n = t + 13; n >= t; --n)
    a = a * 256 + e[n];
  return (e[t + 15] & 128 ? -a : a) * Math.pow(10, r - 6176);
}
function P_(e, t, r) {
  var a = Math.floor(r == 0 ? 0 : Math.LOG10E * Math.log(Math.abs(r))) + 6176 - 20, n = r / Math.pow(10, a - 6176);
  e[t + 15] |= a >> 7, e[t + 14] |= (a & 127) << 1;
  for (var i = 0; n >= 1; ++i, n /= 256)
    e[t + i] = n & 255;
  e[t + 15] |= r >= 0 ? 0 : 128;
}
function nn(e, t) {
  var r = t ? t[0] : 0, a = e[r] & 127;
  e:
    if (e[r++] >= 128 && (a |= (e[r] & 127) << 7, e[r++] < 128 || (a |= (e[r] & 127) << 14, e[r++] < 128) || (a |= (e[r] & 127) << 21, e[r++] < 128) || (a += (e[r] & 127) * Math.pow(2, 28), ++r, e[r++] < 128) || (a += (e[r] & 127) * Math.pow(2, 35), ++r, e[r++] < 128) || (a += (e[r] & 127) * Math.pow(2, 42), ++r, e[r++] < 128)))
      break e;
  return t && (t[0] = r), a;
}
function De(e) {
  var t = new Uint8Array(7);
  t[0] = e & 127;
  var r = 1;
  e:
    if (e > 127) {
      if (t[r - 1] |= 128, t[r] = e >> 7 & 127, ++r, e <= 16383 || (t[r - 1] |= 128, t[r] = e >> 14 & 127, ++r, e <= 2097151) || (t[r - 1] |= 128, t[r] = e >> 21 & 127, ++r, e <= 268435455) || (t[r - 1] |= 128, t[r] = e / 256 >>> 21 & 127, ++r, e <= 34359738367) || (t[r - 1] |= 128, t[r] = e / 65536 >>> 21 & 127, ++r, e <= 4398046511103))
        break e;
      t[r - 1] |= 128, t[r] = e / 16777216 >>> 21 & 127, ++r;
    }
  return t.slice(0, r);
}
function qe(e) {
  var t = 0, r = e[t] & 127;
  e:
    if (e[t++] >= 128) {
      if (r |= (e[t] & 127) << 7, e[t++] < 128 || (r |= (e[t] & 127) << 14, e[t++] < 128) || (r |= (e[t] & 127) << 21, e[t++] < 128))
        break e;
      r |= (e[t] & 127) << 28;
    }
  return r;
}
function Re(e) {
  for (var t = [], r = [0]; r[0] < e.length; ) {
    var a = r[0], n = nn(e, r), i = n & 7;
    n = Math.floor(n / 8);
    var s = 0, c;
    if (n == 0)
      break;
    switch (i) {
      case 0:
        {
          for (var o = r[0]; e[r[0]++] >= 128; )
            ;
          c = e.slice(o, r[0]);
        }
        break;
      case 5:
        s = 4, c = e.slice(r[0], r[0] + s), r[0] += s;
        break;
      case 1:
        s = 8, c = e.slice(r[0], r[0] + s), r[0] += s;
        break;
      case 2:
        s = nn(e, r), c = e.slice(r[0], r[0] + s), r[0] += s;
        break;
      default:
        throw new Error("PB Type ".concat(i, " for Field ").concat(n, " at offset ").concat(a));
    }
    var l = { data: c, type: i };
    t[n] == null ? t[n] = [l] : t[n].push(l);
  }
  return t;
}
function hr(e) {
  var t = [];
  return e.forEach(function(r, a) {
    r.forEach(function(n) {
      n.data && (t.push(De(a * 8 + n.type)), n.type == 2 && t.push(De(n.data.length)), t.push(n.data));
    });
  }), Rt(t);
}
function Ns(e, t) {
  return e?.map(function(r) {
    return t(r.data);
  }) || [];
}
function Gr(e) {
  for (var t, r = [], a = [0]; a[0] < e.length; ) {
    var n = nn(e, a), i = Re(e.slice(a[0], a[0] + n));
    a[0] += n;
    var s = {
      id: qe(i[1][0].data),
      messages: []
    };
    i[2].forEach(function(c) {
      var o = Re(c.data), l = qe(o[3][0].data);
      s.messages.push({
        meta: o,
        data: e.slice(a[0], a[0] + l)
      }), a[0] += l;
    }), (t = i[3]) != null && t[0] && (s.merge = qe(i[3][0].data) >>> 0 > 0), r.push(s);
  }
  return r;
}
function ca(e) {
  var t = [];
  return e.forEach(function(r) {
    var a = [];
    a[1] = [{ data: De(r.id), type: 0 }], a[2] = [], r.merge != null && (a[3] = [{ data: De(+!!r.merge), type: 0 }]);
    var n = [];
    r.messages.forEach(function(s) {
      n.push(s.data), s.meta[3] = [{ type: 0, data: De(s.data.length) }], a[2].push({ data: hr(s.meta), type: 2 });
    });
    var i = hr(a);
    t.push(De(i.length)), t.push(i), n.forEach(function(s) {
      return t.push(s);
    });
  }), Rt(t);
}
function M_(e, t) {
  if (e != 0)
    throw new Error("Unexpected Snappy chunk type ".concat(e));
  for (var r = [0], a = nn(t, r), n = []; r[0] < t.length; ) {
    var i = t[r[0]] & 3;
    if (i == 0) {
      var s = t[r[0]++] >> 2;
      if (s < 60)
        ++s;
      else {
        var c = s - 59;
        s = t[r[0]], c > 1 && (s |= t[r[0] + 1] << 8), c > 2 && (s |= t[r[0] + 2] << 16), c > 3 && (s |= t[r[0] + 3] << 24), s >>>= 0, s++, r[0] += c;
      }
      n.push(t.slice(r[0], r[0] + s)), r[0] += s;
      continue;
    } else {
      var o = 0, l = 0;
      if (i == 1 ? (l = (t[r[0]] >> 2 & 7) + 4, o = (t[r[0]++] & 224) << 3, o |= t[r[0]++]) : (l = (t[r[0]++] >> 2) + 1, i == 2 ? (o = t[r[0]] | t[r[0] + 1] << 8, r[0] += 2) : (o = (t[r[0]] | t[r[0] + 1] << 8 | t[r[0] + 2] << 16 | t[r[0] + 3] << 24) >>> 0, r[0] += 4)), n = [Rt(n)], o == 0)
        throw new Error("Invalid offset 0");
      if (o > n[0].length)
        throw new Error("Invalid offset beyond length");
      if (l >= o)
        for (n.push(n[0].slice(-o)), l -= o; l >= n[n.length - 1].length; )
          n.push(n[n.length - 1]), l -= n[n.length - 1].length;
      n.push(n[0].slice(-o, -o + l));
    }
  }
  var f = Rt(n);
  if (f.length != a)
    throw new Error("Unexpected length: ".concat(f.length, " != ").concat(a));
  return f;
}
function Vr(e) {
  for (var t = [], r = 0; r < e.length; ) {
    var a = e[r++], n = e[r] | e[r + 1] << 8 | e[r + 2] << 16;
    r += 3, t.push(M_(a, e.slice(r, r + n))), r += n;
  }
  if (r !== e.length)
    throw new Error("data is not a valid framed stream!");
  return Rt(t);
}
function oa(e) {
  for (var t = [], r = 0; r < e.length; ) {
    var a = Math.min(e.length - r, 268435455), n = new Uint8Array(4);
    t.push(n);
    var i = De(a), s = i.length;
    t.push(i), a <= 60 ? (s++, t.push(new Uint8Array([a - 1 << 2]))) : a <= 256 ? (s += 2, t.push(new Uint8Array([240, a - 1 & 255]))) : a <= 65536 ? (s += 3, t.push(new Uint8Array([244, a - 1 & 255, a - 1 >> 8 & 255]))) : a <= 16777216 ? (s += 4, t.push(new Uint8Array([248, a - 1 & 255, a - 1 >> 8 & 255, a - 1 >> 16 & 255]))) : a <= 4294967296 && (s += 5, t.push(new Uint8Array([252, a - 1 & 255, a - 1 >> 8 & 255, a - 1 >> 16 & 255, a - 1 >>> 24 & 255]))), t.push(e.slice(r, r + a)), s += a, n[0] = 0, n[1] = s & 255, n[2] = s >> 8 & 255, n[3] = s >> 16 & 255, r += a;
  }
  return Rt(t);
}
function B_(e, t, r, a) {
  var n = Jt(e), i = n.getUint32(4, !0), s = (a > 1 ? 12 : 8) + dc(i & (a > 1 ? 3470 : 398)) * 4, c = -1, o = -1, l = NaN, f = new Date(2001, 0, 1);
  i & 512 && (c = n.getUint32(s, !0), s += 4), s += dc(i & (a > 1 ? 12288 : 4096)) * 4, i & 16 && (o = n.getUint32(s, !0), s += 4), i & 32 && (l = n.getFloat64(s, !0), s += 8), i & 64 && (f.setTime(f.getTime() + n.getFloat64(s, !0) * 1e3), s += 8);
  var d;
  switch (e[2]) {
    case 0:
      break;
    case 2:
      d = { t: "n", v: l };
      break;
    case 3:
      d = { t: "s", v: t[o] };
      break;
    case 5:
      d = { t: "d", v: f };
      break;
    case 6:
      d = { t: "b", v: l > 0 };
      break;
    case 7:
      d = { t: "n", v: l / 86400 };
      break;
    case 8:
      d = { t: "e", v: 0 };
      break;
    case 9:
      if (c > -1)
        d = { t: "s", v: r[c] };
      else if (o > -1)
        d = { t: "s", v: t[o] };
      else if (!isNaN(l))
        d = { t: "n", v: l };
      else
        throw new Error("Unsupported cell type ".concat(e.slice(0, 4)));
      break;
    default:
      throw new Error("Unsupported cell type ".concat(e.slice(0, 4)));
  }
  return d;
}
function U_(e, t, r) {
  var a = Jt(e), n = a.getUint32(8, !0), i = 12, s = -1, c = -1, o = NaN, l = NaN, f = new Date(2001, 0, 1);
  n & 1 && (o = b_(e, i), i += 16), n & 2 && (l = a.getFloat64(i, !0), i += 8), n & 4 && (f.setTime(f.getTime() + a.getFloat64(i, !0) * 1e3), i += 8), n & 8 && (c = a.getUint32(i, !0), i += 4), n & 16 && (s = a.getUint32(i, !0), i += 4);
  var d;
  switch (e[1]) {
    case 0:
      break;
    case 2:
      d = { t: "n", v: o };
      break;
    case 3:
      d = { t: "s", v: t[c] };
      break;
    case 5:
      d = { t: "d", v: f };
      break;
    case 6:
      d = { t: "b", v: l > 0 };
      break;
    case 7:
      d = { t: "n", v: l / 86400 };
      break;
    case 8:
      d = { t: "e", v: 0 };
      break;
    case 9:
      if (s > -1)
        d = { t: "s", v: r[s] };
      else
        throw new Error("Unsupported cell type ".concat(e[1], " : ").concat(n & 31, " : ").concat(e.slice(0, 4)));
      break;
    case 10:
      d = { t: "n", v: o };
      break;
    default:
      throw new Error("Unsupported cell type ".concat(e[1], " : ").concat(n & 31, " : ").concat(e.slice(0, 4)));
  }
  return d;
}
function ki(e, t) {
  var r = new Uint8Array(32), a = Jt(r), n = 12, i = 0;
  switch (r[0] = 5, e.t) {
    case "n":
      r[1] = 2, P_(r, n, e.v), i |= 1, n += 16;
      break;
    case "b":
      r[1] = 6, a.setFloat64(n, e.v ? 1 : 0, !0), i |= 2, n += 8;
      break;
    case "s":
      if (t.indexOf(e.v) == -1)
        throw new Error("Value ".concat(e.v, " missing from SST!"));
      r[1] = 3, a.setUint32(n, t.indexOf(e.v), !0), i |= 8, n += 4;
      break;
    default:
      throw "unsupported cell type " + e.t;
  }
  return a.setUint32(8, i, !0), r.slice(0, n);
}
function Fi(e, t) {
  var r = new Uint8Array(32), a = Jt(r), n = 12, i = 0;
  switch (r[0] = 3, e.t) {
    case "n":
      r[2] = 2, a.setFloat64(n, e.v, !0), i |= 32, n += 8;
      break;
    case "b":
      r[2] = 6, a.setFloat64(n, e.v ? 1 : 0, !0), i |= 32, n += 8;
      break;
    case "s":
      if (t.indexOf(e.v) == -1)
        throw new Error("Value ".concat(e.v, " missing from SST!"));
      r[2] = 3, a.setUint32(n, t.indexOf(e.v), !0), i |= 16, n += 4;
      break;
    default:
      throw "unsupported cell type " + e.t;
  }
  return a.setUint32(4, i, !0), r.slice(0, n);
}
function X_(e, t, r) {
  switch (e[0]) {
    case 0:
    case 1:
    case 2:
    case 3:
      return B_(e, t, r, e[0]);
    case 5:
      return U_(e, t, r);
    default:
      throw new Error("Unsupported payload version ".concat(e[0]));
  }
}
function vr(e) {
  var t = Re(e);
  return nn(t[1][0].data);
}
function xc(e, t) {
  var r = Re(t.data), a = qe(r[1][0].data), n = r[3], i = [];
  return (n || []).forEach(function(s) {
    var c = Re(s.data), o = qe(c[1][0].data) >>> 0;
    switch (a) {
      case 1:
        i[o] = Hi(c[3][0].data);
        break;
      case 8:
        {
          var l = e[vr(c[9][0].data)][0], f = Re(l.data), d = e[vr(f[1][0].data)][0], h = qe(d.meta[1][0].data);
          if (h != 2001)
            throw new Error("2000 unexpected reference to ".concat(h));
          var p = Re(d.data);
          i[o] = p[3].map(function(m) {
            return Hi(m.data);
          }).join("");
        }
        break;
    }
  }), i;
}
function W_(e, t) {
  var r, a, n, i, s, c, o, l, f, d, h, p, m, x, u = Re(e), v = qe(u[1][0].data) >>> 0, E = qe(u[2][0].data) >>> 0, g = ((a = (r = u[8]) == null ? void 0 : r[0]) == null ? void 0 : a.data) && qe(u[8][0].data) > 0 || !1, y, N;
  if ((i = (n = u[7]) == null ? void 0 : n[0]) != null && i.data && t != 0)
    y = (c = (s = u[7]) == null ? void 0 : s[0]) == null ? void 0 : c.data, N = (l = (o = u[6]) == null ? void 0 : o[0]) == null ? void 0 : l.data;
  else if ((d = (f = u[4]) == null ? void 0 : f[0]) != null && d.data && t != 1)
    y = (p = (h = u[4]) == null ? void 0 : h[0]) == null ? void 0 : p.data, N = (x = (m = u[3]) == null ? void 0 : m[0]) == null ? void 0 : x.data;
  else
    throw "NUMBERS Tile missing ".concat(t, " cell storage");
  for (var A = g ? 4 : 1, w = Jt(y), P = [], L = 0; L < y.length / 2; ++L) {
    var U = w.getUint16(L * 2, !0);
    U < 65535 && P.push([L, U]);
  }
  if (P.length != E)
    throw "Expected ".concat(E, " cells, found ").concat(P.length);
  var M = [];
  for (L = 0; L < P.length - 1; ++L)
    M[P[L][0]] = N.subarray(P[L][1] * A, P[L + 1][1] * A);
  return P.length >= 1 && (M[P[P.length - 1][0]] = N.subarray(P[P.length - 1][1] * A)), { R: v, cells: M };
}
function H_(e, t) {
  var r, a = Re(t.data), n = (r = a?.[7]) != null && r[0] ? qe(a[7][0].data) >>> 0 > 0 ? 1 : 0 : -1, i = Ns(a[5], function(s) {
    return W_(s, n);
  });
  return {
    nrows: qe(a[4][0].data) >>> 0,
    data: i.reduce(function(s, c) {
      return s[c.R] || (s[c.R] = []), c.cells.forEach(function(o, l) {
        if (s[c.R][l])
          throw new Error("Duplicate cell r=".concat(c.R, " c=").concat(l));
        s[c.R][l] = o;
      }), s;
    }, [])
  };
}
function G_(e, t, r) {
  var a, n = Re(t.data), i = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
  if (i.e.r = (qe(n[6][0].data) >>> 0) - 1, i.e.r < 0)
    throw new Error("Invalid row varint ".concat(n[6][0].data));
  if (i.e.c = (qe(n[7][0].data) >>> 0) - 1, i.e.c < 0)
    throw new Error("Invalid col varint ".concat(n[7][0].data));
  r["!ref"] = _e(i);
  var s = Re(n[4][0].data), c = xc(e, e[vr(s[4][0].data)][0]), o = (a = s[17]) != null && a[0] ? xc(e, e[vr(s[17][0].data)][0]) : [], l = Re(s[3][0].data), f = 0;
  l[1].forEach(function(d) {
    var h = Re(d.data), p = e[vr(h[2][0].data)][0], m = qe(p.meta[1][0].data);
    if (m != 6002)
      throw new Error("6001 unexpected reference to ".concat(m));
    var x = H_(e, p);
    x.data.forEach(function(u, v) {
      u.forEach(function(E, g) {
        var y = me({ r: f + v, c: g }), N = X_(E, c, o);
        N && (r[y] = N);
      });
    }), f += x.nrows;
  });
}
function V_(e, t) {
  var r = Re(t.data), a = { "!ref": "A1" }, n = e[vr(r[2][0].data)], i = qe(n[0].meta[1][0].data);
  if (i != 6001)
    throw new Error("6000 unexpected reference to ".concat(i));
  return G_(e, n[0], a), a;
}
function z_(e, t) {
  var r, a = Re(t.data), n = {
    name: (r = a[1]) != null && r[0] ? Hi(a[1][0].data) : "",
    sheets: []
  }, i = Ns(a[2], vr);
  return i.forEach(function(s) {
    e[s].forEach(function(c) {
      var o = qe(c.meta[1][0].data);
      o == 6e3 && n.sheets.push(V_(e, c));
    });
  }), n;
}
function Y_(e, t) {
  var r = bs(), a = Re(t.data), n = Ns(a[1], vr);
  if (n.forEach(function(i) {
    e[i].forEach(function(s) {
      var c = qe(s.meta[1][0].data);
      if (c == 2) {
        var o = z_(e, s);
        o.sheets.forEach(function(l, f) {
          Ps(r, l, f == 0 ? o.name : o.name + "_" + f, !0);
        });
      }
    });
  }), r.SheetNames.length == 0)
    throw new Error("Empty NUMBERS file");
  return r;
}
function Ai(e) {
  var t, r, a, n, i = {}, s = [];
  if (e.FullPaths.forEach(function(o) {
    if (o.match(/\.iwpv2/))
      throw new Error("Unsupported password protection");
  }), e.FileIndex.forEach(function(o) {
    if (o.name.match(/\.iwa$/)) {
      var l;
      try {
        l = Vr(o.content);
      } catch (d) {
        return console.log("?? " + o.content.length + " " + (d.message || d));
      }
      var f;
      try {
        f = Gr(l);
      } catch (d) {
        return console.log("## " + (d.message || d));
      }
      f.forEach(function(d) {
        i[d.id] = d.messages, s.push(d.id);
      });
    }
  }), !s.length)
    throw new Error("File has no messages");
  var c = ((n = (a = (r = (t = i?.[1]) == null ? void 0 : t[0]) == null ? void 0 : r.meta) == null ? void 0 : a[1]) == null ? void 0 : n[0].data) && qe(i[1][0].meta[1][0].data) == 1 && i[1][0];
  if (c || s.forEach(function(o) {
    i[o].forEach(function(l) {
      var f = qe(l.meta[1][0].data) >>> 0;
      if (f == 1)
        if (!c)
          c = l;
        else
          throw new Error("Document has multiple roots");
    });
  }), !c)
    throw new Error("Cannot find Document root");
  return Y_(i, c);
}
function j_(e, t, r) {
  var a, n, i, s;
  if (!((a = e[6]) != null && a[0]) || !((n = e[7]) != null && n[0]))
    throw "Mutation only works on post-BNC storages!";
  var c = ((s = (i = e[8]) == null ? void 0 : i[0]) == null ? void 0 : s.data) && qe(e[8][0].data) > 0 || !1;
  if (c)
    throw "Math only works with normal offsets";
  for (var o = 0, l = Jt(e[7][0].data), f = 0, d = [], h = Jt(e[4][0].data), p = 0, m = [], x = 0; x < t.length; ++x) {
    if (t[x] == null) {
      l.setUint16(x * 2, 65535, !0), h.setUint16(x * 2, 65535);
      continue;
    }
    l.setUint16(x * 2, f, !0), h.setUint16(x * 2, p, !0);
    var u, v;
    switch (typeof t[x]) {
      case "string":
        u = ki({ t: "s", v: t[x] }, r), v = Fi({ t: "s", v: t[x] }, r);
        break;
      case "number":
        u = ki({ t: "n", v: t[x] }, r), v = Fi({ t: "n", v: t[x] }, r);
        break;
      case "boolean":
        u = ki({ t: "b", v: t[x] }, r), v = Fi({ t: "b", v: t[x] }, r);
        break;
      default:
        throw new Error("Unsupported value " + t[x]);
    }
    d.push(u), f += u.length, m.push(v), p += v.length, ++o;
  }
  for (e[2][0].data = De(o); x < e[7][0].data.length / 2; ++x)
    l.setUint16(x * 2, 65535, !0), h.setUint16(x * 2, 65535, !0);
  return e[6][0].data = Rt(d), e[3][0].data = Rt(m), o;
}
function K_(e, t) {
  if (!t || !t.numbers)
    throw new Error("Must pass a `numbers` option -- check the README");
  var r = e.Sheets[e.SheetNames[0]];
  e.SheetNames.length > 1 && console.error("The Numbers writer currently writes only the first table");
  var a = Cr(r["!ref"]);
  a.s.r = a.s.c = 0;
  var n = !1;
  a.e.c > 9 && (n = !0, a.e.c = 9), a.e.r > 49 && (n = !0, a.e.r = 49), n && console.error("The Numbers writer is currently limited to ".concat(_e(a)));
  var i = Hn(r, { range: a, header: 1 }), s = ["~Sh33tJ5~"];
  i.forEach(function(B) {
    return B.forEach(function(R) {
      typeof R == "string" && s.push(R);
    });
  });
  var c = {}, o = [], l = de.read(t.numbers, { type: "base64" });
  l.FileIndex.map(function(B, R) {
    return [B, l.FullPaths[R]];
  }).forEach(function(B) {
    var R = B[0], D = B[1];
    if (R.type == 2 && R.name.match(/\.iwa/)) {
      var Y = R.content, J = Vr(Y), ae = Gr(J);
      ae.forEach(function(ee) {
        o.push(ee.id), c[ee.id] = { deps: [], location: D, type: qe(ee.messages[0].meta[1][0].data) };
      });
    }
  }), o.sort(function(B, R) {
    return B - R;
  });
  var f = o.filter(function(B) {
    return B > 1;
  }).map(function(B) {
    return [B, De(B)];
  });
  l.FileIndex.map(function(B, R) {
    return [B, l.FullPaths[R]];
  }).forEach(function(B) {
    var R = B[0];
    if (B[1], !!R.name.match(/\.iwa/)) {
      var D = Gr(Vr(R.content));
      D.forEach(function(Y) {
        Y.messages.forEach(function(J) {
          f.forEach(function(ae) {
            Y.messages.some(function(ee) {
              return qe(ee.meta[1][0].data) != 11006 && D_(ee.data, ae[1]);
            }) && c[ae[0]].deps.push(Y.id);
          });
        });
      });
    }
  });
  for (var d = de.find(l, c[1].location), h = Gr(Vr(d.content)), p, m = 0; m < h.length; ++m) {
    var x = h[m];
    x.id == 1 && (p = x);
  }
  var u = vr(Re(p.messages[0].data)[1][0].data);
  for (d = de.find(l, c[u].location), h = Gr(Vr(d.content)), m = 0; m < h.length; ++m)
    x = h[m], x.id == u && (p = x);
  for (u = vr(Re(p.messages[0].data)[2][0].data), d = de.find(l, c[u].location), h = Gr(Vr(d.content)), m = 0; m < h.length; ++m)
    x = h[m], x.id == u && (p = x);
  for (u = vr(Re(p.messages[0].data)[2][0].data), d = de.find(l, c[u].location), h = Gr(Vr(d.content)), m = 0; m < h.length; ++m)
    x = h[m], x.id == u && (p = x);
  var v = Re(p.messages[0].data);
  {
    v[6][0].data = De(a.e.r + 1), v[7][0].data = De(a.e.c + 1);
    var E = vr(v[46][0].data), g = de.find(l, c[E].location), y = Gr(Vr(g.content));
    {
      for (var N = 0; N < y.length && y[N].id != E; ++N)
        ;
      if (y[N].id != E)
        throw "Bad ColumnRowUIDMapArchive";
      var A = Re(y[N].messages[0].data);
      A[1] = [], A[2] = [], A[3] = [];
      for (var w = 0; w <= a.e.c; ++w) {
        var P = [];
        P[1] = P[2] = [{ type: 0, data: De(w + 420690) }], A[1].push({ type: 2, data: hr(P) }), A[2].push({ type: 0, data: De(w) }), A[3].push({ type: 0, data: De(w) });
      }
      A[4] = [], A[5] = [], A[6] = [];
      for (var L = 0; L <= a.e.r; ++L)
        P = [], P[1] = P[2] = [{ type: 0, data: De(L + 726270) }], A[4].push({ type: 2, data: hr(P) }), A[5].push({ type: 0, data: De(L) }), A[6].push({ type: 0, data: De(L) });
      y[N].messages[0].data = hr(A);
    }
    g.content = oa(ca(y)), g.size = g.content.length, delete v[46];
    var U = Re(v[4][0].data);
    {
      U[7][0].data = De(a.e.r + 1);
      var M = Re(U[1][0].data), b = vr(M[2][0].data);
      g = de.find(l, c[b].location), y = Gr(Vr(g.content));
      {
        if (y[0].id != b)
          throw "Bad HeaderStorageBucket";
        var K = Re(y[0].messages[0].data);
        for (L = 0; L < i.length; ++L) {
          var se = Re(K[2][0].data);
          se[1][0].data = De(L), se[4][0].data = De(i[L].length), K[2][L] = { type: K[2][0].type, data: hr(se) };
        }
        y[0].messages[0].data = hr(K);
      }
      g.content = oa(ca(y)), g.size = g.content.length;
      var re = vr(U[2][0].data);
      g = de.find(l, c[re].location), y = Gr(Vr(g.content));
      {
        if (y[0].id != re)
          throw "Bad HeaderStorageBucket";
        for (K = Re(y[0].messages[0].data), w = 0; w <= a.e.c; ++w)
          se = Re(K[2][0].data), se[1][0].data = De(w), se[4][0].data = De(a.e.r + 1), K[2][w] = { type: K[2][0].type, data: hr(se) };
        y[0].messages[0].data = hr(K);
      }
      g.content = oa(ca(y)), g.size = g.content.length;
      var ue = vr(U[4][0].data);
      (function() {
        for (var B = de.find(l, c[ue].location), R = Gr(Vr(B.content)), D, Y = 0; Y < R.length; ++Y) {
          var J = R[Y];
          J.id == ue && (D = J);
        }
        var ae = Re(D.messages[0].data);
        {
          ae[3] = [];
          var ee = [];
          s.forEach(function(I, Xe) {
            ee[1] = [{ type: 0, data: De(Xe) }], ee[2] = [{ type: 0, data: De(1) }], ee[3] = [{ type: 2, data: R_(I) }], ae[3].push({ type: 2, data: hr(ee) });
          });
        }
        D.messages[0].data = hr(ae);
        var Z = ca(R), we = oa(Z);
        B.content = we, B.size = B.content.length;
      })();
      var oe = Re(U[3][0].data);
      {
        var Le = oe[1][0];
        delete oe[2];
        var G = Re(Le.data);
        {
          var xe = vr(G[2][0].data);
          (function() {
            for (var B = de.find(l, c[xe].location), R = Gr(Vr(B.content)), D, Y = 0; Y < R.length; ++Y) {
              var J = R[Y];
              J.id == xe && (D = J);
            }
            var ae = Re(D.messages[0].data);
            {
              delete ae[6], delete oe[7];
              var ee = new Uint8Array(ae[5][0].data);
              ae[5] = [];
              for (var Z = 0, we = 0; we <= a.e.r; ++we) {
                var I = Re(ee);
                Z += j_(I, i[we], s), I[1][0].data = De(we), ae[5].push({ data: hr(I), type: 2 });
              }
              ae[1] = [{ type: 0, data: De(a.e.c + 1) }], ae[2] = [{ type: 0, data: De(a.e.r + 1) }], ae[3] = [{ type: 0, data: De(Z) }], ae[4] = [{ type: 0, data: De(a.e.r + 1) }];
            }
            D.messages[0].data = hr(ae);
            var Xe = ca(R), Ne = oa(Xe);
            B.content = Ne, B.size = B.content.length;
          })();
        }
        Le.data = hr(G);
      }
      U[3][0].data = hr(oe);
    }
    v[4][0].data = hr(U);
  }
  p.messages[0].data = hr(v);
  var ve = ca(h), O = oa(ve);
  return d.content = O, d.size = d.content.length, l;
}
function bf(e) {
  return function(r) {
    for (var a = 0; a != e.length; ++a) {
      var n = e[a];
      r[n[0]] === void 0 && (r[n[0]] = n[1]), n[2] === "n" && (r[n[0]] = Number(r[n[0]]));
    }
  };
}
function Cs(e) {
  bf([
    ["cellNF", !1],
    /* emit cell number format string as .z */
    ["cellHTML", !0],
    /* emit html string as .h */
    ["cellFormula", !0],
    /* emit formulae as .f */
    ["cellStyles", !1],
    /* emits style/theme as .s */
    ["cellText", !0],
    /* emit formatted text as .w */
    ["cellDates", !1],
    /* emit date cells with type `d` */
    ["sheetStubs", !1],
    /* emit empty cells */
    ["sheetRows", 0, "n"],
    /* read n rows (0 = read all rows) */
    ["bookDeps", !1],
    /* parse calculation chains */
    ["bookSheets", !1],
    /* only try to get sheet names (no Sheets) */
    ["bookProps", !1],
    /* only try to get properties (no Sheets) */
    ["bookFiles", !1],
    /* include raw file structure (keys, files, cfb) */
    ["bookVBA", !1],
    /* include vba raw data (vbaraw) */
    ["password", ""],
    /* password */
    ["WTF", !1]
    /* WTF mode (throws errors) */
  ])(e);
}
function Os(e) {
  bf([
    ["cellDates", !1],
    /* write date cells with type `d` */
    ["bookSST", !1],
    /* Generate Shared String Table */
    ["bookType", "xlsx"],
    /* Type of workbook (xlsx/m/b) */
    ["compression", !1],
    /* Use file compression */
    ["WTF", !1]
    /* WTF mode (throws errors) */
  ])(e);
}
function q_(e) {
  return ke.WS.indexOf(e) > -1 ? "sheet" : e == ke.CS ? "chart" : e == ke.DS ? "dialog" : e == ke.MS ? "macro" : e && e.length ? e : "sheet";
}
function $_(e, t) {
  if (!e) return 0;
  try {
    e = t.map(function(a) {
      return a.id || (a.id = a.strRelID), [a.name, e["!id"][a.id].Target, q_(e["!id"][a.id].Type)];
    });
  } catch {
    return null;
  }
  return !e || e.length === 0 ? null : e;
}
function J_(e, t, r, a, n, i, s, c, o, l, f, d) {
  try {
    i[a] = Wa(br(e, r, !0), t);
    var h = tr(e, t), p;
    switch (c) {
      case "sheet":
        p = yE(h, t, n, o, i[a], l, f, d);
        break;
      case "chart":
        if (p = SE(h, t, n, o, i[a], l, f, d), !p || !p["!drawel"]) break;
        var m = Ma(p["!drawel"].Target, t), x = Za(m), u = up(br(e, m, !0), Wa(br(e, x, !0), m)), v = Ma(u, m), E = Za(v);
        p = Zg(br(e, v, !0), v, o, Wa(br(e, E, !0), v), l, p);
        break;
      case "macro":
        p = kE(h, t, n, o, i[a], l, f, d);
        break;
      case "dialog":
        p = FE(h, t, n, o, i[a], l, f, d);
        break;
      default:
        throw new Error("Unrecognized sheet type " + c);
    }
    s[a] = p;
    var g = [];
    i && i[a] && $e(i[a]).forEach(function(y) {
      var N = "";
      if (i[a][y].Type == ke.CMNT) {
        N = Ma(i[a][y].Target, t);
        var A = OE(tr(e, N, !0), N, o);
        if (!A || !A.length) return;
        Q0(p, A, !1);
      }
      i[a][y].Type == ke.TCMNT && (N = Ma(i[a][y].Target, t), g = g.concat(dp(tr(e, N, !0), o)));
    }), g && g.length && Q0(p, g, !0, o.people || []);
  } catch (y) {
    if (o.WTF) throw y;
  }
}
function Wr(e) {
  return e.charAt(0) == "/" ? e.slice(1) : e;
}
function Pf(e, t) {
  if (Ea(), t = t || {}, Cs(t), zr(e, "META-INF/manifest.xml") || zr(e, "objectdata.xml")) return lc(e, t);
  if (zr(e, "Index/Document.iwa")) {
    if (typeof Uint8Array > "u") throw new Error("NUMBERS file parsing requires Uint8Array support");
    if (typeof Ai < "u") {
      if (e.FileIndex) return Ai(e);
      var r = de.utils.cfb_new();
      return _0(e).forEach(function(se) {
        Te(r, se, xu(e, se));
      }), Ai(r);
    }
    throw new Error("Unsupported NUMBERS file");
  }
  if (!zr(e, "[Content_Types].xml"))
    throw zr(e, "index.xml.gz") ? new Error("Unsupported NUMBERS 08 file") : zr(e, "index.xml") ? new Error("Unsupported NUMBERS 09 file") : new Error("Unsupported ZIP file");
  var a = _0(e), n = ch(br(e, "[Content_Types].xml")), i = !1, s, c;
  if (n.workbooks.length === 0 && (c = "xl/workbook.xml", tr(e, c, !0) && n.workbooks.push(c)), n.workbooks.length === 0) {
    if (c = "xl/workbook.bin", !tr(e, c, !0)) throw new Error("Could not find workbook");
    n.workbooks.push(c), i = !0;
  }
  n.workbooks[0].slice(-3) == "bin" && (i = !0);
  var o = {}, l = {};
  if (!t.bookSheets && !t.bookProps) {
    if (Ha = [], n.sst) try {
      Ha = CE(tr(e, Wr(n.sst)), n.sst, t);
    } catch (se) {
      if (t.WTF) throw se;
    }
    t.cellStyles && n.themes.length && (o = NE(br(e, n.themes[0].replace(/^\//, ""), !0) || "", n.themes[0], t)), n.style && (l = AE(tr(e, Wr(n.style)), n.style, o, t));
  }
  n.links.map(function(se) {
    try {
      var re = Wa(br(e, Za(Wr(se))), se);
      return LE(tr(e, Wr(se)), re, se, t);
    } catch {
    }
  });
  var f = wE(tr(e, Wr(n.workbooks[0])), n.workbooks[0], t), d = {}, h = "";
  n.coreprops.length && (h = tr(e, Wr(n.coreprops[0]), !0), h && (d = go(h)), n.extprops.length !== 0 && (h = tr(e, Wr(n.extprops[0]), !0), h && xh(h, d, t)));
  var p = {};
  (!t.bookSheets || t.bookProps) && n.custprops.length !== 0 && (h = br(e, Wr(n.custprops[0]), !0), h && (p = mh(h, t)));
  var m = {};
  if ((t.bookSheets || t.bookProps) && (f.Sheets ? s = f.Sheets.map(function(re) {
    return re.name;
  }) : d.Worksheets && d.SheetNames.length > 0 && (s = d.SheetNames), t.bookProps && (m.Props = d, m.Custprops = p), t.bookSheets && typeof s < "u" && (m.SheetNames = s), t.bookSheets ? m.SheetNames : t.bookProps))
    return m;
  s = {};
  var x = {};
  t.bookDeps && n.calcchain && (x = IE(tr(e, Wr(n.calcchain)), n.calcchain));
  var u = 0, v = {}, E, g;
  {
    var y = f.Sheets;
    d.Worksheets = y.length, d.SheetNames = [];
    for (var N = 0; N != y.length; ++N)
      d.SheetNames[N] = y[N].name;
  }
  var A = i ? "bin" : "xml", w = n.workbooks[0].lastIndexOf("/"), P = (n.workbooks[0].slice(0, w + 1) + "_rels/" + n.workbooks[0].slice(w + 1) + ".rels").replace(/^\//, "");
  zr(e, P) || (P = "xl/_rels/workbook." + A + ".rels");
  var L = Wa(br(e, P, !0), P.replace(/_rels.*/, "s5s"));
  (n.metadata || []).length >= 1 && (t.xlmeta = RE(tr(e, Wr(n.metadata[0])), n.metadata[0], t)), (n.people || []).length >= 1 && (t.people = pp(tr(e, Wr(n.people[0])), t)), L && (L = $_(L, f.Sheets));
  var U = tr(e, "xl/worksheets/sheet.xml", !0) ? 1 : 0;
  e: for (u = 0; u != d.Worksheets; ++u) {
    var M = "sheet";
    if (L && L[u] ? (E = "xl/" + L[u][1].replace(/[\/]?xl\//, ""), zr(e, E) || (E = L[u][1]), zr(e, E) || (E = P.replace(/_rels\/.*$/, "") + L[u][1]), M = L[u][2]) : (E = "xl/worksheets/sheet" + (u + 1 - U) + "." + A, E = E.replace(/sheet0\./, "sheet.")), g = E.replace(/^(.*)(\/)([^\/]*)$/, "$1/_rels/$3.rels"), t && t.sheets != null) switch (typeof t.sheets) {
      case "number":
        if (u != t.sheets) continue e;
        break;
      case "string":
        if (d.SheetNames[u].toLowerCase() != t.sheets.toLowerCase()) continue e;
        break;
      default:
        if (Array.isArray && Array.isArray(t.sheets)) {
          for (var b = !1, K = 0; K != t.sheets.length; ++K)
            typeof t.sheets[K] == "number" && t.sheets[K] == u && (b = 1), typeof t.sheets[K] == "string" && t.sheets[K].toLowerCase() == d.SheetNames[u].toLowerCase() && (b = 1);
          if (!b) continue e;
        }
    }
    J_(e, E, g, d.SheetNames[u], u, v, s, M, t, f, o, l);
  }
  return m = {
    Directory: n,
    Workbook: f,
    Props: d,
    Custprops: p,
    Deps: x,
    Sheets: s,
    SheetNames: d.SheetNames,
    Strings: Ha,
    Styles: l,
    Themes: o,
    SSF: Ue(pe)
  }, t && t.bookFiles && (e.files ? (m.keys = a, m.files = e.files) : (m.keys = [], m.files = {}, e.FullPaths.forEach(function(se, re) {
    se = se.replace(/^Root Entry[\/]/, ""), m.keys.push(se), m.files[se] = e.FileIndex[re];
  }))), t && t.bookVBA && (n.vba.length > 0 ? m.vbaraw = tr(e, Wr(n.vba[0]), !0) : n.defaults && n.defaults.bin === yp && (m.vbaraw = tr(e, "xl/vbaProject.bin", !0))), m;
}
function Z_(e, t) {
  var r = t || {}, a = "Workbook", n = de.find(e, a);
  try {
    if (a = "/!DataSpaces/Version", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
    if (D1(n.content), a = "/!DataSpaces/DataSpaceMap", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
    var i = P1(n.content);
    if (i.length !== 1 || i[0].comps.length !== 1 || i[0].comps[0].t !== 0 || i[0].name !== "StrongEncryptionDataSpace" || i[0].comps[0].v !== "EncryptedPackage")
      throw new Error("ECMA-376 Encrypted file bad " + a);
    if (a = "/!DataSpaces/DataSpaceInfo/StrongEncryptionDataSpace", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
    var s = M1(n.content);
    if (s.length != 1 || s[0] != "StrongEncryptionTransform")
      throw new Error("ECMA-376 Encrypted file bad " + a);
    if (a = "/!DataSpaces/TransformInfo/StrongEncryptionTransform/!Primary", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
    U1(n.content);
  } catch {
  }
  if (a = "/EncryptionInfo", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
  var c = X1(n.content);
  if (a = "/EncryptedPackage", n = de.find(e, a), !n || !n.content) throw new Error("ECMA-376 Encrypted file missing " + a);
  if (c[0] == 4 && typeof decrypt_agile < "u") return decrypt_agile(c[1], n.content, r.password || "", r);
  if (c[0] == 2 && typeof decrypt_std76 < "u") return decrypt_std76(c[1], n.content, r.password || "", r);
  throw new Error("File is password-protected");
}
function Q_(e, t) {
  return t.bookType == "ods" ? Df(e, t) : t.bookType == "numbers" ? K_(e, t) : t.bookType == "xlsb" ? eT(e, t) : Mf(e, t);
}
function eT(e, t) {
  ua = 1024, e && !e.SSF && (e.SSF = Ue(pe)), e && e.SSF && (Ea(), on(e.SSF), t.revssf = Yn(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF), t.rels = {}, t.wbrels = {}, t.Strings = /*::((*/
  [], t.Strings.Count = 0, t.Strings.Unique = 0, Ga ? t.revStrings = /* @__PURE__ */ new Map() : (t.revStrings = {}, t.revStrings.foo = [], delete t.revStrings.foo);
  var r = t.bookType == "xlsb" ? "bin" : "xml", a = af.indexOf(t.bookType) > -1, n = xs();
  Os(t = t || {});
  var i = $i(), s = "", c = 0;
  if (t.cellXfs = [], Pt(t.cellXfs, {}, { revssf: { General: 0 } }), e.Props || (e.Props = {}), s = "docProps/core.xml", Te(i, s, Eo(e.Props, t)), n.coreprops.push(s), be(t.rels, 2, s, ke.CORE_PROPS), s = "docProps/app.xml", !(e.Props && e.Props.SheetNames)) if (!e.Workbook || !e.Workbook.Sheets) e.Props.SheetNames = e.SheetNames;
  else {
    for (var o = [], l = 0; l < e.SheetNames.length; ++l)
      (e.Workbook.Sheets[l] || {}).Hidden != 2 && o.push(e.SheetNames[l]);
    e.Props.SheetNames = o;
  }
  for (e.Props.Worksheets = e.Props.SheetNames.length, Te(i, s, wo(e.Props)), n.extprops.push(s), be(t.rels, 3, s, ke.EXT_PROPS), e.Custprops !== e.Props && $e(e.Custprops || {}).length > 0 && (s = "docProps/custom.xml", Te(i, s, yo(e.Custprops)), n.custprops.push(s), be(t.rels, 4, s, ke.CUST_PROPS)), c = 1; c <= e.SheetNames.length; ++c) {
    var f = { "!id": {} }, d = e.Sheets[e.SheetNames[c - 1]], h = (d || {})["!type"] || "sheet";
    if (s = "xl/worksheets/sheet" + c + "." + r, Te(i, s, bE(c - 1, s, t, e, f)), n.sheets.push(s), be(t.wbrels, -1, "worksheets/sheet" + c + "." + r, ke.WS[0]), d) {
      var p = d["!comments"], m = !1, x = "";
      p && p.length > 0 && (x = "xl/comments" + c + "." + r, Te(i, x, BE(p, x)), n.comments.push(x), be(f, -1, "../comments" + c + "." + r, ke.CMNT), m = !0), d["!legacy"] && m && Te(i, "xl/drawings/vmlDrawing" + c + ".vml", rf(c, d["!comments"])), delete d["!comments"], delete d["!legacy"];
    }
    f["!id"].rId1 && Te(i, Za(s), da(f));
  }
  return t.Strings != null && t.Strings.length > 0 && (s = "xl/sharedStrings." + r, Te(i, s, ME(t.Strings, s, t)), n.strs.push(s), be(t.wbrels, -1, "sharedStrings." + r, ke.SST)), s = "xl/workbook." + r, Te(i, s, DE(e, s)), n.workbooks.push(s), be(t.rels, 1, s, ke.WB), s = "xl/theme/theme1.xml", Te(i, s, _s(e.Themes, t)), n.themes.push(s), be(t.wbrels, -1, "theme/theme1.xml", ke.THEME), s = "xl/styles." + r, Te(i, s, PE(e, s, t)), n.styles.push(s), be(t.wbrels, -1, "styles." + r, ke.STY), e.vbaraw && a && (s = "xl/vbaProject.bin", Te(i, s, e.vbaraw), n.vba.push(s), be(t.wbrels, -1, "vbaProject.bin", ke.VBA)), s = "xl/metadata." + r, Te(i, s, UE(s)), n.metadata.push(s), be(t.wbrels, -1, "metadata." + r, ke.XLMETA), Te(i, "[Content_Types].xml", mo(n, t)), Te(i, "_rels/.rels", da(t.rels)), Te(i, "xl/_rels/workbook." + r + ".rels", da(t.wbrels)), delete t.revssf, delete t.ssf, i;
}
function Mf(e, t) {
  ua = 1024, e && !e.SSF && (e.SSF = Ue(pe)), e && e.SSF && (Ea(), on(e.SSF), t.revssf = Yn(e.SSF), t.revssf[e.SSF[65535]] = 0, t.ssf = e.SSF), t.rels = {}, t.wbrels = {}, t.Strings = /*::((*/
  [], t.Strings.Count = 0, t.Strings.Unique = 0, Ga ? t.revStrings = /* @__PURE__ */ new Map() : (t.revStrings = {}, t.revStrings.foo = [], delete t.revStrings.foo);
  var r = "xml", a = af.indexOf(t.bookType) > -1, n = xs();
  Os(t = t || {});
  var i = $i(), s = "", c = 0;
  if (t.cellXfs = [], Pt(t.cellXfs, {}, { revssf: { General: 0 } }), e.Props || (e.Props = {}), s = "docProps/core.xml", Te(i, s, Eo(e.Props, t)), n.coreprops.push(s), be(t.rels, 2, s, ke.CORE_PROPS), s = "docProps/app.xml", !(e.Props && e.Props.SheetNames)) if (!e.Workbook || !e.Workbook.Sheets) e.Props.SheetNames = e.SheetNames;
  else {
    for (var o = [], l = 0; l < e.SheetNames.length; ++l)
      (e.Workbook.Sheets[l] || {}).Hidden != 2 && o.push(e.SheetNames[l]);
    e.Props.SheetNames = o;
  }
  e.Props.Worksheets = e.Props.SheetNames.length, Te(i, s, wo(e.Props)), n.extprops.push(s), be(t.rels, 3, s, ke.EXT_PROPS), e.Custprops !== e.Props && $e(e.Custprops || {}).length > 0 && (s = "docProps/custom.xml", Te(i, s, yo(e.Custprops)), n.custprops.push(s), be(t.rels, 4, s, ke.CUST_PROPS));
  var f = ["SheetJ5"];
  for (t.tcid = 0, c = 1; c <= e.SheetNames.length; ++c) {
    var d = { "!id": {} }, h = e.Sheets[e.SheetNames[c - 1]], p = (h || {})["!type"] || "sheet";
    if (s = "xl/worksheets/sheet" + c + "." + r, Te(i, s, pf(c - 1, t, e, d)), n.sheets.push(s), be(t.wbrels, -1, "worksheets/sheet" + c + "." + r, ke.WS[0]), h) {
      var m = h["!comments"], x = !1, u = "";
      if (m && m.length > 0) {
        var v = !1;
        m.forEach(function(E) {
          E[1].forEach(function(g) {
            g.T == !0 && (v = !0);
          });
        }), v && (u = "xl/threadedComments/threadedComment" + c + "." + r, Te(i, u, xp(m, f, t)), n.threadedcomments.push(u), be(d, -1, "../threadedComments/threadedComment" + c + "." + r, ke.TCMNT)), u = "xl/comments" + c + "." + r, Te(i, u, tf(m)), n.comments.push(u), be(d, -1, "../comments" + c + "." + r, ke.CMNT), x = !0;
      }
      h["!legacy"] && x && Te(i, "xl/drawings/vmlDrawing" + c + ".vml", rf(c, h["!comments"])), delete h["!comments"], delete h["!legacy"];
    }
    d["!id"].rId1 && Te(i, Za(s), da(d));
  }
  return t.Strings != null && t.Strings.length > 0 && (s = "xl/sharedStrings." + r, Te(i, s, Go(t.Strings, t)), n.strs.push(s), be(t.wbrels, -1, "sharedStrings." + r, ke.SST)), s = "xl/workbook." + r, Te(i, s, Tf(e)), n.workbooks.push(s), be(t.rels, 1, s, ke.WB), s = "xl/theme/theme1.xml", Te(i, s, _s(e.Themes, t)), n.themes.push(s), be(t.wbrels, -1, "theme/theme1.xml", ke.THEME), s = "xl/styles." + r, Te(i, s, Jo(e, t)), n.styles.push(s), be(t.wbrels, -1, "styles." + r, ke.STY), e.vbaraw && a && (s = "xl/vbaProject.bin", Te(i, s, e.vbaraw), n.vba.push(s), be(t.wbrels, -1, "vbaProject.bin", ke.VBA)), s = "xl/metadata." + r, Te(i, s, ef()), n.metadata.push(s), be(t.wbrels, -1, "metadata." + r, ke.XLMETA), f.length > 1 && (s = "xl/persons/person.xml", Te(i, s, mp(f)), n.people.push(s), be(t.wbrels, -1, "persons/person.xml", ke.PEOPLE)), Te(i, "[Content_Types].xml", mo(n, t)), Te(i, "_rels/.rels", da(t.rels)), Te(i, "xl/_rels/workbook." + r + ".rels", da(t.wbrels)), delete t.revssf, delete t.ssf, i;
}
function Is(e, t) {
  var r = "";
  switch ((t || {}).type || "base64") {
    case "buffer":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    case "base64":
      r = Mr(e.slice(0, 12));
      break;
    case "binary":
      r = e;
      break;
    case "array":
      return [e[0], e[1], e[2], e[3], e[4], e[5], e[6], e[7]];
    default:
      throw new Error("Unrecognized type " + (t && t.type || "undefined"));
  }
  return [r.charCodeAt(0), r.charCodeAt(1), r.charCodeAt(2), r.charCodeAt(3), r.charCodeAt(4), r.charCodeAt(5), r.charCodeAt(6), r.charCodeAt(7)];
}
function rT(e, t) {
  return de.find(e, "EncryptedPackage") ? Z_(e, t) : As(e, t);
}
function tT(e, t) {
  var r, a = e, n = t || {};
  return n.type || (n.type = ye && Buffer.isBuffer(e) ? "buffer" : "base64"), r = Kc(a, n), Pf(r, n);
}
function Bf(e, t) {
  var r = 0;
  e: for (; r < e.length; ) switch (e.charCodeAt(r)) {
    case 10:
    case 13:
    case 32:
      ++r;
      break;
    case 60:
      return Xi(e.slice(r), t);
    default:
      break e;
  }
  return va.to_workbook(e, t);
}
function aT(e, t) {
  var r = "", a = Is(e, t);
  switch (t.type) {
    case "base64":
      r = Mr(e);
      break;
    case "binary":
      r = e;
      break;
    case "buffer":
      r = e.toString("binary");
      break;
    case "array":
      r = jt(e);
      break;
    default:
      throw new Error("Unrecognized type " + t.type);
  }
  return a[0] == 239 && a[1] == 187 && a[2] == 191 && (r = Me(r)), t.type = "binary", Bf(r, t);
}
function nT(e, t) {
  var r = e;
  return t.type == "base64" && (r = Mr(r)), r = Ce.utils.decode(1200, r.slice(2), "str"), t.type = "binary", Bf(r, t);
}
function iT(e) {
  return e.match(/[^\x00-\x7F]/) ? ct(e) : e;
}
function Ni(e, t, r, a) {
  return a ? (r.type = "string", va.to_workbook(e, r)) : va.to_workbook(t, r);
}
function Wn(e, t) {
  Vn();
  var r = t || {};
  if (typeof ArrayBuffer < "u" && e instanceof ArrayBuffer) return Wn(new Uint8Array(e), (r = Ue(r), r.type = "array", r));
  typeof Uint8Array < "u" && e instanceof Uint8Array && !r.type && (r.type = typeof Deno < "u" ? "buffer" : "array");
  var a = e, n = [0, 0, 0, 0], i = !1;
  if (r.cellStyles && (r.cellNF = !0, r.sheetStubs = !0), pa = {}, r.dateNF && (pa.dateNF = r.dateNF), r.type || (r.type = ye && Buffer.isBuffer(e) ? "buffer" : "base64"), r.type == "file" && (r.type = ye ? "buffer" : "binary", a = su(e), typeof Uint8Array < "u" && !ye && (r.type = "array")), r.type == "string" && (i = !0, r.type = "binary", r.codepage = 65001, a = iT(e)), r.type == "array" && typeof Uint8Array < "u" && e instanceof Uint8Array && typeof ArrayBuffer < "u") {
    var s = new ArrayBuffer(3), c = new Uint8Array(s);
    if (c.foo = "bar", !c.foo)
      return r = Ue(r), r.type = "array", Wn(Yi(a), r);
  }
  switch ((n = Is(a, r))[0]) {
    case 208:
      if (n[1] === 207 && n[2] === 17 && n[3] === 224 && n[4] === 161 && n[5] === 177 && n[6] === 26 && n[7] === 225) return rT(de.read(a, r), r);
      break;
    case 9:
      if (n[1] <= 8) return As(a, r);
      break;
    case 60:
      return Xi(a, r);
    case 73:
      if (n[1] === 73 && n[2] === 42 && n[3] === 0) throw new Error("TIFF Image File is not a spreadsheet");
      if (n[1] === 68) return v1(a, r);
      break;
    case 84:
      if (n[1] === 65 && n[2] === 66 && n[3] === 76) return Wo.to_workbook(a, r);
      break;
    case 80:
      return n[1] === 75 && n[2] < 9 && n[3] < 9 ? tT(a, r) : Ni(e, a, r, i);
    case 239:
      return n[3] === 60 ? Xi(a, r) : Ni(e, a, r, i);
    case 255:
      if (n[1] === 254)
        return nT(a, r);
      if (n[1] === 0 && n[2] === 2 && n[3] === 0) return Gt.to_workbook(a, r);
      break;
    case 0:
      if (n[1] === 0 && (n[2] >= 2 && n[3] === 0 || n[2] === 0 && (n[3] === 8 || n[3] === 9)))
        return Gt.to_workbook(a, r);
      break;
    case 3:
    case 131:
    case 139:
    case 140:
      return Ui.to_workbook(a, r);
    case 123:
      if (n[1] === 92 && n[2] === 114 && n[3] === 116) return Ko.to_workbook(a, r);
      break;
    case 10:
    case 13:
    case 32:
      return aT(a, r);
    case 137:
      if (n[1] === 80 && n[2] === 78 && n[3] === 71) throw new Error("PNG Image File is not a spreadsheet");
      break;
  }
  return m1.indexOf(n[0]) > -1 && n[2] <= 12 && n[3] <= 31 ? Ui.to_workbook(a, r) : Ni(e, a, r, i);
}
function pc(e, t) {
  var r = t || {};
  return r.type = "file", Wn(e, r);
}
function Uf(e, t) {
  switch (t.type) {
    case "base64":
    case "binary":
      break;
    case "buffer":
    case "array":
      t.type = "";
      break;
    case "file":
      return fn(t.file, de.write(e, { type: ye ? "buffer" : "" }));
    case "string":
      throw new Error("'string' output type invalid for '" + t.bookType + "' files");
    default:
      throw new Error("Unrecognized type " + t.type);
  }
  return de.write(e, t);
}
function sT(e, t) {
  var r = Ue(t || {}), a = Q_(e, r);
  return Xf(a, r);
}
function cT(e, t) {
  var r = Ue(t || {}), a = Mf(e, r);
  return Xf(a, r);
}
function Xf(e, t) {
  var r = {}, a = ye ? "nodebuffer" : typeof Uint8Array < "u" ? "array" : "string";
  if (t.compression && (r.compression = "DEFLATE"), t.password) r.type = a;
  else switch (t.type) {
    case "base64":
      r.type = "base64";
      break;
    case "binary":
      r.type = "string";
      break;
    case "string":
      throw new Error("'string' output type invalid for '" + t.bookType + "' files");
    case "buffer":
    case "file":
      r.type = a;
      break;
    default:
      throw new Error("Unrecognized type " + t.type);
  }
  var n = e.FullPaths ? de.write(e, { fileType: "zip", type: (
    /*::(*/
    { nodebuffer: "buffer", string: "binary" }[r.type] || r.type
  ), compression: !!t.compression }) : e.generate(r);
  if (typeof Deno < "u" && typeof n == "string") {
    if (t.type == "binary" || t.type == "base64") return n;
    n = new Uint8Array(cn(n));
  }
  return t.password && typeof encrypt_agile < "u" ? Uf(encrypt_agile(n, t.password), t) : t.type === "file" ? fn(t.file, n) : t.type == "string" ? Me(
    /*::(*/
    n
    /*:: :any)*/
  ) : n;
}
function oT(e, t) {
  var r = t || {}, a = u_(e, r);
  return Uf(a, r);
}
function st(e, t, r) {
  r || (r = "");
  var a = r + e;
  switch (t.type) {
    case "base64":
      return ja(ct(a));
    case "binary":
      return ct(a);
    case "string":
      return e;
    case "file":
      return fn(t.file, a, "utf8");
    case "buffer":
      return ye ? _t(a, "utf8") : typeof TextEncoder < "u" ? new TextEncoder().encode(a) : st(a, { type: "binary" }).split("").map(function(n) {
        return n.charCodeAt(0);
      });
  }
  throw new Error("Unrecognized type " + t.type);
}
function fT(e, t) {
  switch (t.type) {
    case "base64":
      return ja(e);
    case "binary":
      return e;
    case "string":
      return e;
    /* override in sheet_to_txt */
    case "file":
      return fn(t.file, e, "binary");
    case "buffer":
      return ye ? _t(e, "binary") : e.split("").map(function(r) {
        return r.charCodeAt(0);
      });
  }
  throw new Error("Unrecognized type " + t.type);
}
function Nn(e, t) {
  switch (t.type) {
    case "string":
    case "base64":
    case "binary":
      for (var r = "", a = 0; a < e.length; ++a) r += String.fromCharCode(e[a]);
      return t.type == "base64" ? ja(r) : t.type == "string" ? Me(r) : r;
    case "file":
      return fn(t.file, e);
    case "buffer":
      return e;
    default:
      throw new Error("Unrecognized type " + t.type);
  }
}
function Ls(e, t) {
  Vn(), _f(e);
  var r = Ue(t || {});
  if (r.cellStyles && (r.cellNF = !0, r.sheetStubs = !0), r.type == "array") {
    r.type = "binary";
    var a = Ls(e, r);
    return r.type = "array", cn(a);
  }
  return cT(e, r);
}
function Qn(e, t) {
  Vn(), _f(e);
  var r = Ue(t || {});
  if (r.cellStyles && (r.cellNF = !0, r.sheetStubs = !0), r.type == "array") {
    r.type = "binary";
    var a = Qn(e, r);
    return r.type = "array", cn(a);
  }
  var n = 0;
  if (r.sheet && (typeof r.sheet == "number" ? n = r.sheet : n = e.SheetNames.indexOf(r.sheet), !e.SheetNames[n]))
    throw new Error("Sheet not found: " + r.sheet + " : " + typeof r.sheet);
  switch (r.bookType || "xlsb") {
    case "xml":
    case "xlml":
      return st(n_(e, r), r);
    case "slk":
    case "sylk":
      return st(Xo.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "htm":
    case "html":
      return st(Of(e.Sheets[e.SheetNames[n]], r), r);
    case "txt":
      return fT(Gf(e.Sheets[e.SheetNames[n]], r), r);
    case "csv":
      return st(Ds(e.Sheets[e.SheetNames[n]], r), r, "\uFEFF");
    case "dif":
      return st(Wo.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "dbf":
      return Nn(Ui.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "prn":
      return st(va.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "rtf":
      return st(Ko.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "eth":
      return st(Ho.from_sheet(e.Sheets[e.SheetNames[n]], r), r);
    case "fods":
      return st(Df(e, r), r);
    case "wk1":
      return Nn(Gt.sheet_to_wk1(e.Sheets[e.SheetNames[n]], r), r);
    case "wk3":
      return Nn(Gt.book_to_wk3(e, r), r);
    case "biff2":
      r.biff || (r.biff = 2);
    /* falls through */
    case "biff3":
      r.biff || (r.biff = 3);
    /* falls through */
    case "biff4":
      return r.biff || (r.biff = 4), Nn(kf(e, r), r);
    case "biff5":
      r.biff || (r.biff = 5);
    /* falls through */
    case "biff8":
    case "xla":
    case "xls":
      return r.biff || (r.biff = 8), oT(e, r);
    case "xlsx":
    case "xlsm":
    case "xlam":
    case "xlsb":
    case "numbers":
    case "ods":
      return sT(e, r);
    default:
      throw new Error("Unrecognized bookType |" + r.bookType + "|");
  }
}
function Rs(e) {
  if (!e.bookType) {
    var t = {
      xls: "biff8",
      htm: "html",
      slk: "sylk",
      socialcalc: "eth",
      Sh33tJS: "WTF"
    }, r = e.file.slice(e.file.lastIndexOf(".")).toLowerCase();
    r.match(/^\.[a-z]+$/) && (e.bookType = r.slice(1)), e.bookType = t[e.bookType] || e.bookType;
  }
}
function mc(e, t, r) {
  var a = r || {};
  return a.type = "file", a.file = t, Rs(a), Qn(e, a);
}
function lT(e, t, r) {
  var a = r || {};
  return a.type = "file", a.file = t, Rs(a), Ls(e, a);
}
function uT(e, t, r, a) {
  var n = r || {};
  n.type = "file", n.file = e, Rs(n), n.type = "buffer";
  var i = a;
  return i instanceof Function || (i = r), Ct.writeFile(e, Qn(t, n), i);
}
function Wf(e, t, r, a, n, i, s, c) {
  var o = Ke(r), l = c.defval, f = c.raw || !Object.prototype.hasOwnProperty.call(c, "raw"), d = !0, h = n === 1 ? [] : {};
  if (n !== 1)
    if (Object.defineProperty) try {
      Object.defineProperty(h, "__rowNum__", { value: r, enumerable: !1 });
    } catch {
      h.__rowNum__ = r;
    }
    else h.__rowNum__ = r;
  if (!s || e[r]) for (var p = t.s.c; p <= t.e.c; ++p) {
    var m = s ? e[r][p] : e[a[p] + o];
    if (m === void 0 || m.t === void 0) {
      if (l === void 0) continue;
      i[p] != null && (h[i[p]] = l);
      continue;
    }
    var x = m.v;
    switch (m.t) {
      case "z":
        if (x == null) break;
        continue;
      case "e":
        x = x == 0 ? null : void 0;
        break;
      case "s":
      case "d":
      case "b":
      case "n":
        break;
      default:
        throw new Error("unrecognized type " + m.t);
    }
    if (i[p] != null) {
      if (x == null)
        if (m.t == "e" && x === null) h[i[p]] = null;
        else if (l !== void 0) h[i[p]] = l;
        else if (f && x === null) h[i[p]] = null;
        else continue;
      else
        h[i[p]] = f && (m.t !== "n" || m.t === "n" && c.rawNumbers !== !1) ? x : ft(m, x, c);
      x != null && (d = !1);
    }
  }
  return { row: h, isempty: d };
}
function Hn(e, t) {
  if (e == null || e["!ref"] == null) return [];
  var r = { t: "n", v: 0 }, a = 0, n = 1, i = [], s = 0, c = "", o = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, l = t || {}, f = l.range != null ? l.range : e["!ref"];
  switch (l.header === 1 ? a = 1 : l.header === "A" ? a = 2 : Array.isArray(l.header) ? a = 3 : l.header == null && (a = 0), typeof f) {
    case "string":
      o = Ae(f);
      break;
    case "number":
      o = Ae(e["!ref"]), o.s.r = f;
      break;
    default:
      o = f;
  }
  a > 0 && (n = 0);
  var d = Ke(o.s.r), h = [], p = [], m = 0, x = 0, u = Array.isArray(e), v = o.s.r, E = 0, g = {};
  u && !e[v] && (e[v] = []);
  var y = l.skipHidden && e["!cols"] || [], N = l.skipHidden && e["!rows"] || [];
  for (E = o.s.c; E <= o.e.c; ++E)
    if (!(y[E] || {}).hidden)
      switch (h[E] = He(E), r = u ? e[v][E] : e[h[E] + d], a) {
        case 1:
          i[E] = E - o.s.c;
          break;
        case 2:
          i[E] = h[E];
          break;
        case 3:
          i[E] = l.header[E - o.s.c];
          break;
        default:
          if (r == null && (r = { w: "__EMPTY", t: "s" }), c = s = ft(r, null, l), x = g[s] || 0, !x) g[s] = 1;
          else {
            do
              c = s + "_" + x++;
            while (g[c]);
            g[s] = x, g[c] = 1;
          }
          i[E] = c;
      }
  for (v = o.s.r + n; v <= o.e.r; ++v)
    if (!(N[v] || {}).hidden) {
      var A = Wf(e, o, v, h, a, i, u, l);
      (A.isempty === !1 || (a === 1 ? l.blankrows !== !1 : l.blankrows)) && (p[m++] = A.row);
    }
  return p.length = m, p;
}
var vc = /"/g;
function Hf(e, t, r, a, n, i, s, c) {
  for (var o = !0, l = [], f = "", d = Ke(r), h = t.s.c; h <= t.e.c; ++h)
    if (a[h]) {
      var p = c.dense ? (e[r] || [])[h] : e[a[h] + d];
      if (p == null) f = "";
      else if (p.v != null) {
        o = !1, f = "" + (c.rawNumbers && p.t == "n" ? p.v : ft(p, null, c));
        for (var m = 0, x = 0; m !== f.length; ++m) if ((x = f.charCodeAt(m)) === n || x === i || x === 34 || c.forceQuotes) {
          f = '"' + f.replace(vc, '""') + '"';
          break;
        }
        f == "ID" && (f = '"ID"');
      } else p.f != null && !p.F ? (o = !1, f = "=" + p.f, f.indexOf(",") >= 0 && (f = '"' + f.replace(vc, '""') + '"')) : f = "";
      l.push(f);
    }
  return c.blankrows === !1 && o ? null : l.join(s);
}
function Ds(e, t) {
  var r = [], a = t ?? {};
  if (e == null || e["!ref"] == null) return "";
  var n = Ae(e["!ref"]), i = a.FS !== void 0 ? a.FS : ",", s = i.charCodeAt(0), c = a.RS !== void 0 ? a.RS : `
`, o = c.charCodeAt(0), l = new RegExp((i == "|" ? "\\|" : i) + "+$"), f = "", d = [];
  a.dense = Array.isArray(e);
  for (var h = a.skipHidden && e["!cols"] || [], p = a.skipHidden && e["!rows"] || [], m = n.s.c; m <= n.e.c; ++m) (h[m] || {}).hidden || (d[m] = He(m));
  for (var x = 0, u = n.s.r; u <= n.e.r; ++u)
    (p[u] || {}).hidden || (f = Hf(e, n, u, d, s, o, i, a), f != null && (a.strip && (f = f.replace(l, "")), (f || a.blankrows !== !1) && r.push((x++ ? c : "") + f)));
  return delete a.dense, r.join("");
}
function Gf(e, t) {
  t || (t = {}), t.FS = "	", t.RS = `
`;
  var r = Ds(e, t);
  if (typeof Ce > "u" || t.type == "string") return r;
  var a = Ce.utils.encode(1200, r, "str");
  return "ÿþ" + a;
}
function hT(e) {
  var t = "", r, a = "";
  if (e == null || e["!ref"] == null) return [];
  var n = Ae(e["!ref"]), i = "", s = [], c, o = [], l = Array.isArray(e);
  for (c = n.s.c; c <= n.e.c; ++c) s[c] = He(c);
  for (var f = n.s.r; f <= n.e.r; ++f)
    for (i = Ke(f), c = n.s.c; c <= n.e.c; ++c)
      if (t = s[c] + i, r = l ? (e[f] || [])[c] : e[t], a = "", r !== void 0) {
        if (r.F != null) {
          if (t = r.F, !r.f) continue;
          a = r.f, t.indexOf(":") == -1 && (t = t + ":" + t);
        }
        if (r.f != null) a = r.f;
        else {
          if (r.t == "z") continue;
          if (r.t == "n" && r.v != null) a = "" + r.v;
          else if (r.t == "b") a = r.v ? "TRUE" : "FALSE";
          else if (r.w !== void 0) a = "'" + r.w;
          else {
            if (r.v === void 0) continue;
            r.t == "s" ? a = "'" + r.v : a = "" + r.v;
          }
        }
        o[o.length] = t + "=" + a;
      }
  return o;
}
function Vf(e, t, r) {
  var a = r || {}, n = +!a.skipHeader, i = e || {}, s = 0, c = 0;
  if (i && a.origin != null)
    if (typeof a.origin == "number") s = a.origin;
    else {
      var o = typeof a.origin == "string" ? Ye(a.origin) : a.origin;
      s = o.r, c = o.c;
    }
  var l, f = { s: { c: 0, r: 0 }, e: { c, r: s + t.length - 1 + n } };
  if (i["!ref"]) {
    var d = Ae(i["!ref"]);
    f.e.c = Math.max(f.e.c, d.e.c), f.e.r = Math.max(f.e.r, d.e.r), s == -1 && (s = d.e.r + 1, f.e.r = s + t.length - 1 + n);
  } else
    s == -1 && (s = 0, f.e.r = t.length - 1 + n);
  var h = a.header || [], p = 0;
  t.forEach(function(x, u) {
    $e(x).forEach(function(v) {
      (p = h.indexOf(v)) == -1 && (h[p = h.length] = v);
      var E = x[v], g = "z", y = "", N = me({ c: c + p, r: s + u + n });
      l = sn(i, N), E && typeof E == "object" && !(E instanceof Date) ? i[N] = E : (typeof E == "number" ? g = "n" : typeof E == "boolean" ? g = "b" : typeof E == "string" ? g = "s" : E instanceof Date ? (g = "d", a.cellDates || (g = "n", E = sr(E)), y = a.dateNF || pe[14]) : E === null && a.nullError && (g = "e", E = 0), l ? (l.t = g, l.v = E, delete l.w, delete l.R, y && (l.z = y)) : i[N] = l = { t: g, v: E }, y && (l.z = y));
    });
  }), f.e.c = Math.max(f.e.c, c + h.length - 1);
  var m = Ke(s);
  if (n) for (p = 0; p < h.length; ++p) i[He(p + c) + m] = { t: "s", v: h[p] };
  return i["!ref"] = _e(f), i;
}
function dT(e, t) {
  return Vf(null, e, t);
}
function sn(e, t, r) {
  if (typeof t == "string") {
    if (Array.isArray(e)) {
      var a = Ye(t);
      return e[a.r] || (e[a.r] = []), e[a.r][a.c] || (e[a.r][a.c] = { t: "z" });
    }
    return e[t] || (e[t] = { t: "z" });
  }
  return typeof t != "number" ? sn(e, me(t)) : sn(e, me({ r: t, c: r || 0 }));
}
function xT(e, t) {
  if (typeof t == "number") {
    if (t >= 0 && e.SheetNames.length > t) return t;
    throw new Error("Cannot find sheet # " + t);
  } else if (typeof t == "string") {
    var r = e.SheetNames.indexOf(t);
    if (r > -1) return r;
    throw new Error("Cannot find sheet name |" + t + "|");
  } else throw new Error("Cannot find sheet |" + t + "|");
}
function bs() {
  return { SheetNames: [], Sheets: {} };
}
function Ps(e, t, r, a) {
  var n = 1;
  if (!r) for (; n <= 65535 && e.SheetNames.indexOf(r = "Sheet" + n) != -1; ++n, r = void 0) ;
  if (!r || e.SheetNames.length >= 65535) throw new Error("Too many worksheets");
  if (a && e.SheetNames.indexOf(r) >= 0) {
    var i = r.match(/(^.*?)(\d+)$/);
    n = i && +i[2] || 0;
    var s = i && i[1] || r;
    for (++n; n <= 65535 && e.SheetNames.indexOf(r = s + n) != -1; ++n) ;
  }
  if (Ef(r), e.SheetNames.indexOf(r) >= 0) throw new Error("Worksheet with name |" + r + "| already exists!");
  return e.SheetNames.push(r), e.Sheets[r] = t, r;
}
function pT(e, t, r) {
  e.Workbook || (e.Workbook = {}), e.Workbook.Sheets || (e.Workbook.Sheets = []);
  var a = xT(e, t);
  switch (e.Workbook.Sheets[a] || (e.Workbook.Sheets[a] = {}), r) {
    case 0:
    case 1:
    case 2:
      break;
    default:
      throw new Error("Bad sheet visibility setting " + r);
  }
  e.Workbook.Sheets[a].Hidden = r;
}
function mT(e, t) {
  return e.z = t, e;
}
function zf(e, t, r) {
  return t ? (e.l = { Target: t }, r && (e.l.Tooltip = r)) : delete e.l, e;
}
function vT(e, t, r) {
  return zf(e, "#" + t, r);
}
function gT(e, t, r) {
  e.c || (e.c = []), e.c.push({ t, a: r || "SheetJS" });
}
function ET(e, t, r, a) {
  for (var n = typeof t != "string" ? t : Ae(t), i = typeof t == "string" ? t : _e(t), s = n.s.r; s <= n.e.r; ++s) for (var c = n.s.c; c <= n.e.c; ++c) {
    var o = sn(e, s, c);
    o.t = "n", o.F = i, delete o.v, s == n.s.r && c == n.s.c && (o.f = r, a && (o.D = !0));
  }
  return e;
}
var _T = {
  encode_col: He,
  encode_row: Ke,
  encode_cell: me,
  encode_range: _e,
  decode_col: os,
  decode_row: cs,
  split_cell: Bu,
  decode_cell: Ye,
  decode_range: Cr,
  format_cell: ft,
  sheet_add_aoa: oo,
  sheet_add_json: Vf,
  sheet_add_dom: If,
  aoa_to_sheet: Ta,
  json_to_sheet: dT,
  table_to_sheet: Lf,
  table_to_book: C_,
  sheet_to_csv: Ds,
  sheet_to_txt: Gf,
  sheet_to_json: Hn,
  sheet_to_html: Of,
  sheet_to_formulae: hT,
  sheet_to_row_object_array: Hn,
  sheet_get_cell: sn,
  book_new: bs,
  book_append_sheet: Ps,
  book_set_sheet_visibility: pT,
  cell_set_number_format: mT,
  cell_set_hyperlink: zf,
  cell_set_internal_link: vT,
  cell_add_comment: gT,
  sheet_set_array_formula: ET,
  consts: {
    SHEET_VISIBLE: 0,
    SHEET_HIDDEN: 1,
    SHEET_VERY_HIDDEN: 2
  }
}, ei;
function TT(e) {
  ei = e;
}
function wT(e, t) {
  var r = ei(), a = t ?? {};
  if (e == null || e["!ref"] == null)
    return r.push(null), r;
  var n = Ae(e["!ref"]), i = a.FS !== void 0 ? a.FS : ",", s = i.charCodeAt(0), c = a.RS !== void 0 ? a.RS : `
`, o = c.charCodeAt(0), l = new RegExp((i == "|" ? "\\|" : i) + "+$"), f = "", d = [];
  a.dense = Array.isArray(e);
  for (var h = a.skipHidden && e["!cols"] || [], p = a.skipHidden && e["!rows"] || [], m = n.s.c; m <= n.e.c; ++m) (h[m] || {}).hidden || (d[m] = He(m));
  var x = n.s.r, u = !1, v = 0;
  return r._read = function() {
    if (!u)
      return u = !0, r.push("\uFEFF");
    for (; x <= n.e.r; )
      if (++x, !(p[x - 1] || {}).hidden && (f = Hf(e, n, x - 1, d, s, o, i, a), f != null && (a.strip && (f = f.replace(l, "")), f || a.blankrows !== !1)))
        return r.push((v++ ? c : "") + f);
    return r.push(null);
  }, r;
}
function yT(e, t) {
  var r = ei(), a = t || {}, n = a.header != null ? a.header : Af, i = a.footer != null ? a.footer : Nf;
  r.push(n);
  var s = Cr(e["!ref"]);
  a.dense = Array.isArray(e), r.push(Cf(e, s, a));
  var c = s.s.r, o = !1;
  return r._read = function() {
    if (c > s.e.r)
      return o || (o = !0, r.push("</table>" + i)), r.push(null);
    for (; c <= s.e.r; ) {
      r.push(Ff(e, s, c, a)), ++c;
      break;
    }
  }, r;
}
function ST(e, t) {
  var r = ei({ objectMode: !0 });
  if (e == null || e["!ref"] == null)
    return r.push(null), r;
  var a = { t: "n", v: 0 }, n = 0, i = 1, s = [], c = 0, o = "", l = { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }, f = t || {}, d = f.range != null ? f.range : e["!ref"];
  switch (f.header === 1 ? n = 1 : f.header === "A" ? n = 2 : Array.isArray(f.header) && (n = 3), typeof d) {
    case "string":
      l = Ae(d);
      break;
    case "number":
      l = Ae(e["!ref"]), l.s.r = d;
      break;
    default:
      l = d;
  }
  n > 0 && (i = 0);
  var h = Ke(l.s.r), p = [], m = 0, x = Array.isArray(e), u = l.s.r, v = 0, E = {};
  x && !e[u] && (e[u] = []);
  var g = f.skipHidden && e["!cols"] || [], y = f.skipHidden && e["!rows"] || [];
  for (v = l.s.c; v <= l.e.c; ++v)
    if (!(g[v] || {}).hidden)
      switch (p[v] = He(v), a = x ? e[u][v] : e[p[v] + h], n) {
        case 1:
          s[v] = v - l.s.c;
          break;
        case 2:
          s[v] = p[v];
          break;
        case 3:
          s[v] = f.header[v - l.s.c];
          break;
        default:
          if (a == null && (a = { w: "__EMPTY", t: "s" }), o = c = ft(a, null, f), m = E[c] || 0, !m) E[c] = 1;
          else {
            do
              o = c + "_" + m++;
            while (E[o]);
            E[c] = m, E[o] = 1;
          }
          s[v] = o;
      }
  return u = l.s.r + i, r._read = function() {
    for (; u <= l.e.r; )
      if (!(y[u - 1] || {}).hidden) {
        var N = Wf(e, l, u, p, n, s, x, f);
        if (++u, N.isempty === !1 || (n === 1 ? f.blankrows !== !1 : f.blankrows)) {
          r.push(N.row);
          return;
        }
      }
    return r.push(null);
  }, r;
}
var kT = {
  to_json: ST,
  to_html: yT,
  to_csv: wT,
  set_readable: TT
};
const FT = Ya.version, AT = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CFB: de,
  SSF: Hc,
  parse_xlscfb: As,
  parse_zip: Pf,
  read: Wn,
  readFile: pc,
  readFileSync: pc,
  set_cptable: Cl,
  set_fs: nu,
  stream: kT,
  utils: _T,
  version: FT,
  write: Qn,
  writeFile: mc,
  writeFileAsync: uT,
  writeFileSync: mc,
  writeFileXLSX: lT,
  writeXLSX: Ls
}, Symbol.toStringTag, { value: "Module" })), NT = /* @__PURE__ */ fl(AT);
var gc;
function CT() {
  if (gc) return ur;
  gc = 1;
  var e = ur && ur.__createBinding || (Object.create ? (function(o, l, f, d) {
    d === void 0 && (d = f);
    var h = Object.getOwnPropertyDescriptor(l, f);
    (!h || ("get" in h ? !l.__esModule : h.writable || h.configurable)) && (h = { enumerable: !0, get: function() {
      return l[f];
    } }), Object.defineProperty(o, d, h);
  }) : (function(o, l, f, d) {
    d === void 0 && (d = f), o[d] = l[f];
  })), t = ur && ur.__setModuleDefault || (Object.create ? (function(o, l) {
    Object.defineProperty(o, "default", { enumerable: !0, value: l });
  }) : function(o, l) {
    o.default = l;
  }), r = ur && ur.__importStar || /* @__PURE__ */ (function() {
    var o = function(l) {
      return o = Object.getOwnPropertyNames || function(f) {
        var d = [];
        for (var h in f) Object.prototype.hasOwnProperty.call(f, h) && (d[d.length] = h);
        return d;
      }, o(l);
    };
    return function(l) {
      if (l && l.__esModule) return l;
      var f = {};
      if (l != null) for (var d = o(l), h = 0; h < d.length; h++) d[h] !== "default" && e(f, l, d[h]);
      return t(f, l), f;
    };
  })();
  Object.defineProperty(ur, "__esModule", { value: !0 }), ur.readSheet = ur.isValidExcelFile = ur.getSheetNames = ur.parseExcelFile = void 0;
  const a = r(NT), n = async (o) => {
    const f = await (await fetch(o)).arrayBuffer(), d = a.read(f, { type: "array" }), h = {};
    d.SheetNames.forEach((x) => {
      const u = d.Sheets[x], v = a.utils.sheet_to_json(u, {
        header: 1,
        // Use first row as header
        raw: !1,
        // Get formatted values
        defval: null
        // Use null for empty cells
      });
      if (v.length > 0) {
        const E = v[0], g = v.slice(1).map((y) => {
          const N = [];
          return E.forEach((A, w) => {
            N.push(y[w]);
          }), N;
        });
        h[x] = {
          headers: E,
          rows: g
        };
      }
    });
    const m = Xt.statSync(o);
    return {
      sheets: h,
      metadata: {
        filename: Zt.basename(o),
        fileSize: m.size,
        uploadedAt: /* @__PURE__ */ new Date()
      }
    };
  };
  ur.parseExcelFile = n;
  const i = (o) => {
    const f = Xt.readFileSync(o);
    return a.read(f, { type: "buffer" }).SheetNames;
  };
  ur.getSheetNames = i;
  const s = (o) => {
    const l = o.toLowerCase().split(".").pop();
    return ["xlsx", "xls", "csv"].includes(l || "");
  };
  ur.isValidExcelFile = s;
  const c = (o, l) => {
    const d = Xt.readFileSync(o), h = a.read(d, { type: "buffer" });
    if (!h.SheetNames.includes(l))
      return null;
    const p = h.Sheets[l], m = a.utils.sheet_to_json(p, {
      header: 1,
      raw: !1,
      defval: null
    });
    if (m.length === 0)
      return null;
    const x = m[0], u = m.slice(1).map((v) => {
      const E = [];
      return x.forEach((g, y) => {
        E.push(v[y]);
      }), E;
    });
    return {
      headers: x,
      rows: u
    };
  };
  return ur.readSheet = c, ur;
}
var Ci = {}, Ec;
function _c() {
  return Ec || (Ec = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.loadToDatabase = e.insertMovements = e.insertInventory = e.insertLocations = e.insertSectors = e.insertZones = e.insertProducts = void 0;
    const t = Gi(), r = (f) => {
      const d = (0, t.getDatabase)(), h = d.prepare(`
    INSERT OR REPLACE INTO products (
      id, sku, name, description, category, subcategory, brand, unit,
      weight, volume, min_stock, max_stock, reorder_point, reorder_quantity,
      cost_price, selling_price, supplier, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
      let p = 0;
      return d.transaction((x) => {
        for (const u of x)
          try {
            h.run(u.id, u.sku, u.name, u.description || null, u.category, u.subcategory || null, u.brand || null, u.unit, u.weight || null, u.volume || null, u.minStock || null, u.maxStock || null, u.reorderPoint || null, u.reorderQuantity || null, u.costPrice || null, u.sellingPrice || null, u.supplier || null, u.status), p++;
          } catch (v) {
            console.error(`Error inserting product ${u.sku}:`, v);
          }
      })(f), p;
    };
    e.insertProducts = r;
    const a = (f) => {
      const d = (0, t.getDatabase)(), h = d.prepare(`
    INSERT OR REPLACE INTO zones (
      id, warehouse_id, code, name, type,
      surface, capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
      let p = 0;
      return d.transaction((x) => {
        for (const u of x)
          try {
            h.run(u.id, u.warehouseId, u.code, u.name, u.type, u.surface || null, u.capacity || null, u.status), p++;
          } catch (v) {
            console.error(`Error inserting zone ${u.code}:`, v);
          }
      })(f), p;
    };
    e.insertZones = a;
    const n = (f) => {
      const d = (0, t.getDatabase)(), h = d.prepare(`
    INSERT OR REPLACE INTO sectors (
      id, warehouse_id, zone_id, code, name, type,
      capacity, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
      let p = 0;
      return d.transaction((x) => {
        for (const u of x)
          try {
            h.run(u.id, u.warehouseId, u.zoneId, u.code, u.name, u.type, u.capacity || null, u.status), p++;
          } catch (v) {
            console.error(`Error inserting sector ${u.code}:`, v);
          }
      })(f), p;
    };
    e.insertSectors = n;
    const i = (f) => {
      const d = (0, t.getDatabase)(), h = d.prepare(`
    INSERT OR REPLACE INTO locations (
      id, warehouse_id, zone_id, sector_id, code, type,
      capacity, used_capacity, product_count, picker_count,
      aisle, level, position, barcode, status,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
      let p = 0;
      return d.transaction((x) => {
        for (const u of x)
          try {
            h.run(u.id, u.warehouseId, u.zoneId, u.sectorId, u.code, u.type, u.capacity || null, u.usedCapacity || null, u.productCount || null, u.pickerCount || null, u.aisle || null, u.level || null, u.position || null, u.barcode || null, u.status), p++;
          } catch (v) {
            console.error(`Error inserting location ${u.code}:`, v);
          }
      })(f), p;
    };
    e.insertLocations = i;
    const s = (f, d) => {
      const h = (0, t.getDatabase)(), p = h.prepare(`
    INSERT OR REPLACE INTO inventory (
      id, warehouse_id, product_id, location_id,
      quantity, available_quantity, reserved_quantity,
      last_received_at, last_shipped_at,
      created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
  `);
      let m = 0;
      return h.transaction((u) => {
        for (const v of u)
          try {
            const E = `${f}-${v.productId}-${v.locationId || "default"}`;
            p.run(
              E,
              f,
              v.productId,
              v.locationId || null,
              v.quantity,
              v.availableQuantity,
              v.reservedQuantity,
              null,
              // last_received_at
              null
              // last_shipped_at
            ), m++;
          } catch (E) {
            console.error(`Error inserting inventory for product ${v.productId}:`, E);
          }
      })(d), m;
    };
    e.insertInventory = s;
    const c = (f) => {
      const d = (0, t.getDatabase)(), h = d.prepare(`
    INSERT INTO movements (
      id, warehouse_id, product_id, product_sku, product_name,
      type, source_location_id, source_zone, source_location_code,
      destination_location_id, destination_zone, destination_location_code,
      quantity, unit, movement_date, user, reason,
      lot, expiration_date, reference_type, reference_id,
      created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
      let p = 0;
      return d.transaction((x) => {
        for (const u of x)
          try {
            const v = `${u.warehouseId}-${u.productId}-${u.movementDate.getTime()}-${Math.random().toString(36).substring(2, 15)}`;
            h.run(v, u.warehouseId, u.productId, u.productSku, u.productName, u.type, u.sourceLocationId || null, u.sourceZone || null, u.sourceLocationCode || null, u.destinationLocationId || null, u.destinationZone || null, u.destinationLocationCode || null, u.quantity, u.unit, l(u.movementDate), u.user || null, u.reason || null, u.lot || null, u.expirationDate ? l(u.expirationDate) : null, u.referenceType || null, u.referenceId || null), p++;
          } catch (v) {
            console.error("Error inserting movement:", v);
          }
      })(f), p;
    };
    e.insertMovements = c;
    const o = (f) => {
      const d = {
        productsImported: 0,
        inventoryImported: 0,
        movementsImported: 0,
        zonesImported: 0,
        sectorsImported: 0,
        locationsImported: 0,
        ordersImported: 0,
        pickingsImported: 0,
        receptionsImported: 0,
        restockingsImported: 0,
        returnsImported: 0
      };
      return f.zones && f.zones.length > 0 && (d.zonesImported = (0, e.insertZones)(f.zones)), f.sectors && f.sectors.length > 0 && (d.sectorsImported = (0, e.insertSectors)(f.sectors)), f.locations && f.locations.length > 0 && (d.locationsImported = (0, e.insertLocations)(f.locations)), f.products.length > 0 && (d.productsImported = (0, e.insertProducts)(f.products)), f.inventory.length > 0 && (d.inventoryImported = (0, e.insertInventory)(f.metadata.warehouseId, f.inventory)), f.movements.length > 0 && (d.movementsImported = (0, e.insertMovements)(f.movements)), d;
    };
    e.loadToDatabase = o;
    function l(f) {
      return f.toISOString();
    }
  })(Ci)), Ci;
}
var Tc;
function OT() {
  if (Tc) return Fr;
  Tc = 1;
  var e = Fr && Fr.__createBinding || (Object.create ? (function(o, l, f, d) {
    d === void 0 && (d = f);
    var h = Object.getOwnPropertyDescriptor(l, f);
    (!h || ("get" in h ? !l.__esModule : h.writable || h.configurable)) && (h = { enumerable: !0, get: function() {
      return l[f];
    } }), Object.defineProperty(o, d, h);
  }) : (function(o, l, f, d) {
    d === void 0 && (d = f), o[d] = l[f];
  })), t = Fr && Fr.__setModuleDefault || (Object.create ? (function(o, l) {
    Object.defineProperty(o, "default", { enumerable: !0, value: l });
  }) : function(o, l) {
    o.default = l;
  }), r = Fr && Fr.__importStar || /* @__PURE__ */ (function() {
    var o = function(l) {
      return o = Object.getOwnPropertyNames || function(f) {
        var d = [];
        for (var h in f) Object.prototype.hasOwnProperty.call(f, h) && (d[d.length] = h);
        return d;
      }, o(l);
    };
    return function(l) {
      if (l && l.__esModule) return l;
      var f = {};
      if (l != null) for (var d = o(l), h = 0; h < d.length; h++) d[h] !== "default" && e(f, l, d[h]);
      return t(f, l), f;
    };
  })();
  Object.defineProperty(Fr, "__esModule", { value: !0 }), Fr.generateMockData = Fr.executeImport = Fr.validateImportFile = void 0;
  const a = r(Xt), n = CT(), i = async (o, l) => {
    const f = [];
    if (!a.existsSync(o))
      return f.push({
        severity: "error",
        message: "File not found",
        suggestion: "Please check the file path",
        canContinue: !1
      }), { valid: f.length === 0, errors: f };
    if (!(0, n.isValidExcelFile)(o))
      return f.push({
        severity: "error",
        message: "Invalid file format",
        suggestion: "Please provide an Excel file (.xlsx, .xls, .csv)",
        canContinue: !1
      }), { valid: f.length === 0, errors: f };
    let d;
    try {
      d = await (0, n.parseExcelFile)(o);
    } catch (p) {
      return f.push({
        severity: "error",
        message: `Failed to parse Excel file: ${p}`,
        suggestion: "Ensure the file is a valid Excel file",
        canContinue: !1
      }), { valid: f.length === 0, errors: f };
    }
    const h = l.validate(d);
    return f.push(...h), {
      valid: f.filter((p) => p.severity === "error").length === 0,
      errors: f
    };
  };
  Fr.validateImportFile = i;
  const s = async (o, l, f, d) => {
    const h = Date.now();
    let p = 0;
    const m = [];
    try {
      d?.(10, "Parsing Excel file...");
      const x = await (0, n.parseExcelFile)(o);
      p = Object.values(x.sheets).reduce((N, A) => N + A.rows.length, 0), d?.(20, "Transforming data...");
      const u = {
        warehouseId: l,
        pluginId: f.id,
        onProgress: (N, A) => {
          d?.(20 + N * 0.6, A);
        }
      }, v = f.transform(x, u);
      d?.(80, "Loading data into database...");
      const { loadToDatabase: E } = await Promise.resolve().then(() => r(_c())), g = E(v);
      d?.(100, "Import completed!");
      const y = Date.now() - h;
      return {
        status: "success",
        warehouseId: l,
        pluginId: f.id,
        stats: {
          rowsProcessed: p,
          productsImported: g.productsImported,
          inventoryImported: g.inventoryImported,
          movementsImported: g.movementsImported,
          zonesImported: g.zonesImported,
          sectorsImported: g.sectorsImported,
          locationsImported: g.locationsImported
        },
        duration: y,
        errors: [],
        warnings: m
      };
    } catch (x) {
      const u = Date.now() - h;
      return {
        status: "failed",
        warehouseId: l,
        pluginId: f.id,
        stats: {
          rowsProcessed: p,
          productsImported: 0,
          inventoryImported: 0,
          movementsImported: 0,
          zonesImported: 0,
          sectorsImported: 0,
          locationsImported: 0
        },
        duration: u,
        errors: [
          {
            severity: "error",
            message: `Import failed: ${x}`,
            suggestion: "Check the error details and try again",
            canContinue: !1
          }
        ],
        warnings: m
      };
    }
  };
  Fr.executeImport = s;
  const c = async (o, l, f) => {
    const d = Date.now(), h = [];
    try {
      f?.(10, "Generating mock data...");
      const p = {
        warehouseId: o,
        pluginId: l.id,
        onProgress: (g, y) => {
          f?.(20 + g * 0.6, y);
        }
      }, m = {
        sheets: {},
        metadata: {
          filename: "mock-data",
          fileSize: 0,
          uploadedAt: /* @__PURE__ */ new Date()
        }
      }, x = l.transform(m, p);
      f?.(80, "Loading data into database...");
      const { loadToDatabase: u } = await Promise.resolve().then(() => r(_c())), v = u(x);
      f?.(100, "Mock data generated successfully!");
      const E = Date.now() - d;
      return {
        status: "success",
        warehouseId: o,
        pluginId: l.id,
        stats: {
          rowsProcessed: 0,
          // Not applicable for mock data
          productsImported: v.productsImported,
          inventoryImported: v.inventoryImported,
          movementsImported: v.movementsImported,
          zonesImported: v.zonesImported,
          sectorsImported: v.sectorsImported,
          locationsImported: v.locationsImported
        },
        duration: E,
        errors: [],
        warnings: h
      };
    } catch (p) {
      const m = Date.now() - d;
      return {
        status: "failed",
        warehouseId: o,
        pluginId: l.id,
        stats: {
          rowsProcessed: 0,
          productsImported: 0,
          inventoryImported: 0,
          movementsImported: 0,
          zonesImported: 0,
          sectorsImported: 0,
          locationsImported: 0
        },
        duration: m,
        errors: [
          {
            severity: "error",
            message: `Mock data generation failed: ${p}`,
            suggestion: "Check the error details and try again",
            canContinue: !1
          }
        ],
        warnings: h
      };
    }
  };
  return Fr.generateMockData = c, Fr;
}
var Zr = {}, wc;
function IT() {
  if (wc) return Zr;
  wc = 1, Object.defineProperty(Zr, "__esModule", { value: !0 }), Zr.getSupportedFormats = Zr.hasPlugin = Zr.getPlugin = Zr.listPlugins = void 0;
  const e = Oc(), t = () => Object.values(e.registry).map((i) => ({
    id: i.id,
    name: i.name,
    version: i.version,
    description: i.description,
    author: i.author,
    wmsSystem: i.wmsSystem,
    supportedFormats: i.supportedFormats
  }));
  Zr.listPlugins = t;
  const r = (i) => e.registry[i] || null;
  Zr.getPlugin = r;
  const a = (i) => i in e.registry;
  Zr.hasPlugin = a;
  const n = (i) => e.registry[i]?.supportedFormats || [];
  return Zr.getSupportedFormats = n, Zr;
}
var Oi = {}, Ra = {}, yc;
function LT() {
  if (yc) return Ra;
  yc = 1, Object.defineProperty(Ra, "__esModule", { value: !0 }), Ra.runABCAnalysis = void 0;
  const e = (t, r, a) => {
    const { getProductMovementTotals: n } = Vi(), i = n(t, "outbound", r, a);
    if (i.length === 0)
      return {
        products: [],
        summary: {
          totalProducts: 0,
          classA: { count: 0, contribution: 0 },
          classB: { count: 0, contribution: 0 },
          classC: { count: 0, contribution: 0 }
        },
        totalQuantity: 0,
        analysisDate: /* @__PURE__ */ new Date(),
        parameters: {
          warehouseId: t,
          dateFrom: r,
          dateTo: a
        }
      };
    const s = i.reduce((f, d) => f + d.total_quantity, 0);
    let c = 0;
    const o = i.map((f) => {
      const d = f.total_quantity, h = d / s * 100;
      c += h;
      let p;
      return c <= 20 ? p = "A" : c <= 50 ? p = "B" : p = "C", {
        productId: f.product_id,
        productSku: f.sku,
        productName: f.name,
        category: "",
        totalQuantity: d,
        contribution: h,
        cumulativeContribution: c,
        abcClass: p
      };
    }), l = {
      totalProducts: o.length,
      classA: {
        count: o.filter((f) => f.abcClass === "A").length,
        contribution: o.filter((f) => f.abcClass === "A").reduce((f, d) => f + d.contribution, 0)
      },
      classB: {
        count: o.filter((f) => f.abcClass === "B").length,
        contribution: o.filter((f) => f.abcClass === "B").reduce((f, d) => f + d.contribution, 0)
      },
      classC: {
        count: o.filter((f) => f.abcClass === "C").length,
        contribution: o.filter((f) => f.abcClass === "C").reduce((f, d) => f + d.contribution, 0)
      }
    };
    return {
      products: o,
      summary: l,
      totalQuantity: s,
      analysisDate: /* @__PURE__ */ new Date(),
      parameters: {
        warehouseId: t,
        dateFrom: r,
        dateTo: a
      }
    };
  };
  return Ra.runABCAnalysis = e, Ra;
}
var Da = {}, Sc;
function RT() {
  if (Sc) return Da;
  Sc = 1, Object.defineProperty(Da, "__esModule", { value: !0 }), Da.runDeadStockAnalysis = void 0;
  const e = (t, r = 90, a = 180, n = 90) => {
    const { getDeadStock: i } = Vi(), s = i(t);
    if (s.length === 0)
      return {
        products: [],
        summary: {
          totalProducts: 0,
          deadStockProducts: 0,
          totalTiedCapital: 0,
          criticalLevel: { count: 0, tiedCapital: 0 },
          warningLevel: { count: 0, tiedCapital: 0 },
          monitorLevel: { count: 0, tiedCapital: 0 }
        },
        analysisDate: /* @__PURE__ */ new Date(),
        parameters: {
          warehouseId: t,
          thresholdDays: r,
          criticalThreshold: a,
          warningThreshold: n
        }
      };
    const c = /* @__PURE__ */ new Date(), o = s.map((h) => {
      const p = h.last_movement_date ? new Date(h.last_movement_date) : null;
      let m = null;
      if (p) {
        const g = Math.abs(c.getTime() - p.getTime());
        m = Math.floor(g / (1e3 * 60 * 60 * 24));
      }
      const x = h.quantity, u = h.cost_price || 0, v = x * u;
      let E;
      return m === null || m >= a ? E = "critical" : m >= n ? E = "warning" : E = "monitor", {
        productId: h.product_id,
        productSku: h.sku,
        productName: h.name,
        category: h.category || "",
        currentQuantity: x,
        lastMovementDate: p,
        daysSinceLastMovement: m,
        unitCost: u,
        tiedCapital: v,
        deadStockLevel: E
      };
    }), f = o.filter((h) => h.daysSinceLastMovement === null ? !0 : h.daysSinceLastMovement >= r).sort((h, p) => p.tiedCapital - h.tiedCapital), d = {
      totalProducts: o.length,
      deadStockProducts: f.length,
      totalTiedCapital: f.reduce((h, p) => h + p.tiedCapital, 0),
      criticalLevel: {
        count: f.filter((h) => h.deadStockLevel === "critical").length,
        tiedCapital: f.filter((h) => h.deadStockLevel === "critical").reduce((h, p) => h + p.tiedCapital, 0)
      },
      warningLevel: {
        count: f.filter((h) => h.deadStockLevel === "warning").length,
        tiedCapital: f.filter((h) => h.deadStockLevel === "warning").reduce((h, p) => h + p.tiedCapital, 0)
      },
      monitorLevel: {
        count: f.filter((h) => h.deadStockLevel === "monitor").length,
        tiedCapital: f.filter((h) => h.deadStockLevel === "monitor").reduce((h, p) => h + p.tiedCapital, 0)
      }
    };
    return {
      products: f,
      summary: d,
      analysisDate: c,
      parameters: {
        warehouseId: t,
        thresholdDays: r,
        criticalThreshold: a,
        warningThreshold: n
      }
    };
  };
  return Da.runDeadStockAnalysis = e, Da;
}
var kc;
function DT() {
  return kc || (kc = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.runDeadStockAnalysis = e.runABCAnalysis = void 0;
    var t = LT();
    Object.defineProperty(e, "runABCAnalysis", { enumerable: !0, get: function() {
      return t.runABCAnalysis;
    } });
    var r = RT();
    Object.defineProperty(e, "runDeadStockAnalysis", { enumerable: !0, get: function() {
      return r.runDeadStockAnalysis;
    } });
  })(Oi)), Oi;
}
var Fc;
function bT() {
  if (Fc) return Ws;
  Fc = 1;
  const { app: e, BrowserWindow: t, dialog: r, ipcMain: a } = Ac, n = Zt, { initializeDatabase: i, getDatabase: s, closeDatabase: c, getAllWarehouses: o, createWarehouse: l, warehouseExists: f, getDatabaseFilePath: d } = Gi(), h = Vi(), { registry: p, initializeDefaultPlugins: m } = Oc(), x = OT(), u = IT(), v = DT();
  m(), i(), console.log("Database initialized at:", d()), a.handle("import:generate-mock-data", async (g, y, N) => {
    i();
    const A = u.getPlugin("mock-data-generator");
    if (!A)
      throw new Error("Mock data generator plugin not found");
    return await x.generateMockData(y, A, N);
  }), a.handle("plugins:list", () => u.listPlugins()), a.handle("plugins:get", (g, y) => u.getPlugin(y)), a.handle("import:validate", async (g, y, N) => {
    const A = u.getPlugin(N);
    if (!A)
      throw new Error(`Plugin not found: ${N}`);
    return x.validateImportFile(y, A);
  }), a.handle("import:execute", async (g, y, N, A) => {
    const w = u.getPlugin(A);
    if (!w)
      throw new Error(`Plugin not found: ${A}`);
    return x.executeImport(y, N, w);
  }), a.handle("db:get-products", async (g, y) => (i(), h.getProductsByWarehouse(y.warehouseId))), a.handle("db:get-inventory", async (g, y) => (i(), h.getInventoryByWarehouse(y))), a.handle("db:get-movements", async (g, y) => (i(), h.getMovementsByWarehouse(y))), a.handle("db:get-orders", async (g, y) => (i(), h.getOrdersByWarehouse(y))), a.handle("db:get-locations", async (g, y) => (i(), h.getLocationsByWarehouse(y.warehouseId))), a.handle("db:get-zones", async (g, y) => (i(), h.getZonesByWarehouse(y.warehouseId))), a.handle("db:get-sectors", async (g, y) => (i(), h.getSectorsByWarehouse(y.warehouseId))), a.handle("db:get-stats", async () => (i(), h.getDatabaseStats())), a.handle("warehouse:get-all", async () => (i(), o())), a.handle("warehouse:get-all-with-kpis", async () => (i(), h.getWarehousesWithKPIs())), a.handle("warehouse:create", async (g, y) => (i(), f(y.id) ? s().prepare("SELECT * FROM warehouses WHERE id = ?").get(y.id) : l(y))), a.handle("db:get-import-history", async (g, y) => (i(), h.getImportHistory(y))), a.handle("db:get-dashboard-kpis", async (g, y) => (i(), h.getDashboardKPIs(y))), a.handle("analysis:run-abc", async (g, y) => {
    i();
    const { warehouseId: N, dateFrom: A, dateTo: w } = y;
    return v.runABCAnalysis(N, A, w);
  }), a.handle("analysis:run-dead-stock", async (g, y) => {
    i();
    const { warehouseId: N, thresholdDays: A, criticalThreshold: w, warningThreshold: P } = y;
    return v.runDeadStockAnalysis(
      N,
      A || 90,
      w || 180,
      P || 90
    );
  }), a.handle("app:get-version", () => ({ version: e.getVersion() })), e.on("before-quit", () => {
    console.log("App quitting, closing database..."), c();
  });
  function E() {
    const g = n.join(__dirname, "..", "dist-electron", "preload.cjs"), y = new t({
      width: 1200,
      height: 800,
      webPreferences: {
        preload: g,
        nodeIntegration: !1,
        contextIsolation: !0
      }
    });
    if (y.webContents.on("did-fail-load", (N, A, w, P) => {
      console.error("Failed to load:", A, w, P), r.showErrorBox("Failed to load", `Failed to load: ${w}`);
    }), y.webContents.on("render-process-gone", (N, A) => {
      console.error("Render process gone:", A), r.showErrorBox("Renderer process crashed", `Reason: ${A.reason}`);
    }), process.env.NODE_ENV === "development")
      console.log("Loading dev server at http://127.0.0.1:3000"), y.loadURL("http://127.0.0.1:3000"), y.webContents.openDevTools();
    else {
      const N = n.join(__dirname, "../dist/index.html");
      console.log("Loading production build:", N), y.loadFile(N).catch((A) => {
        console.error("Failed to load index.html:", A), r.showErrorBox("Error", `Failed to load index.html: ${A.message}`);
      }), y.webContents.openDevTools();
    }
  }
  return e.whenReady().then(() => {
    E();
  }).catch((g) => {
    console.error("Failed to initialize app:", g), r.showErrorBox("Initialization Error", g.message);
  }), e.on("window-all-closed", () => {
    process.platform !== "darwin" && e.quit();
  }), e.on("activate", () => {
    t.getAllWindows().length === 0 && E();
  }), process.on("uncaughtException", (g) => {
    console.error("Uncaught exception:", g), r.showErrorBox("Uncaught Exception", g.message);
  }), process.on("unhandledRejection", (g) => {
    console.error("Unhandled rejection:", g);
  }), Ws;
}
var PT = bT();
const WT = /* @__PURE__ */ ol(PT);
export {
  WT as default
};
