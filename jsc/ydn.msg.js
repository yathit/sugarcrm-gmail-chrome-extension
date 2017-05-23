(function(){var h, l = this;
function aa() {
}
function ba(a) {
  var b = typeof a;
  if ("object" == b) {
    if (a) {
      if (a instanceof Array) {
        return "array";
      }
      if (a instanceof Object) {
        return b;
      }
      var c = Object.prototype.toString.call(a);
      if ("[object Window]" == c) {
        return "object";
      }
      if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice")) {
        return "array";
      }
      if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call")) {
        return "function";
      }
    } else {
      return "null";
    }
  } else {
    if ("function" == b && "undefined" == typeof a.call) {
      return "object";
    }
  }
  return b;
}
function m(a) {
  return "string" == typeof a;
}
function n(a) {
  return "function" == ba(a);
}
function ca(a) {
  var b = typeof a;
  return "object" == b && null != a || "function" == b;
}
var da = "closure_uid_" + (1E9 * Math.random() >>> 0), ea = 0;
function fa(a, b, c) {
  return a.call.apply(a.bind, arguments);
}
function ga(a, b, c) {
  if (!a) {
    throw Error();
  }
  if (2 < arguments.length) {
    var d = Array.prototype.slice.call(arguments, 2);
    return function() {
      var c = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(c, d);
      return a.apply(b, c);
    };
  }
  return function() {
    return a.apply(b, arguments);
  };
}
function p(a, b, c) {
  p = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? fa : ga;
  return p.apply(null, arguments);
}
var ha = Date.now || function() {
  return +new Date;
};
function q(a, b) {
  a = a.split(".");
  var c = l;
  a[0] in c || !c.execScript || c.execScript("var " + a[0]);
  for (var d;a.length && (d = a.shift());) {
    a.length || void 0 === b ? c[d] ? c = c[d] : c = c[d] = {} : c[d] = b;
  }
}
function r(a, b) {
  function c() {
  }
  c.prototype = b.prototype;
  a.C = b.prototype;
  a.prototype = new c;
  a.prototype.constructor = a;
  a.N = function(a, c, f) {
    for (var g = Array(arguments.length - 2), k = 2;k < arguments.length;k++) {
      g[k - 2] = arguments[k];
    }
    return b.prototype[c].apply(a, g);
  };
}
;function ia() {
  0 != ja && (this[da] || (this[da] = ++ea));
  this.f = this.f;
  this.l = this.l;
}
var ja = 0;
ia.prototype.f = !1;
function u(a) {
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, u);
  } else {
    var b = Error().stack;
    b && (this.stack = b);
  }
  a && (this.message = String(a));
}
r(u, Error);
u.prototype.name = "CustomError";
function ka(a, b) {
  for (var c = a.split("%s"), d = "", e = Array.prototype.slice.call(arguments, 1);e.length && 1 < c.length;) {
    d += c.shift() + e.shift();
  }
  return d + c.join("%s");
}
var la = String.prototype.trim ? function(a) {
  return a.trim();
} : function(a) {
  return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "");
};
function ma(a, b) {
  return a < b ? -1 : a > b ? 1 : 0;
}
;function na(a, b) {
  b.unshift(a);
  u.call(this, ka.apply(null, b));
  b.shift();
}
r(na, u);
na.prototype.name = "AssertionError";
function oa(a, b) {
  throw new na("Failure" + (a ? ": " + a : ""), Array.prototype.slice.call(arguments, 1));
}
;var pa = Array.prototype.indexOf ? function(a, b, c) {
  return Array.prototype.indexOf.call(a, b, c);
} : function(a, b, c) {
  c = null == c ? 0 : 0 > c ? Math.max(0, a.length + c) : c;
  if (m(a)) {
    return m(b) && 1 == b.length ? a.indexOf(b, c) : -1;
  }
  for (;c < a.length;c++) {
    if (c in a && a[c] === b) {
      return c;
    }
  }
  return -1;
}, qa = Array.prototype.some ? function(a, b, c) {
  return Array.prototype.some.call(a, b, c);
} : function(a, b, c) {
  for (var d = a.length, e = m(a) ? a.split("") : a, f = 0;f < d;f++) {
    if (f in e && b.call(c, e[f], f, a)) {
      return !0;
    }
  }
  return !1;
};
var v;
a: {
  var ra = l.navigator;
  if (ra) {
    var sa = ra.userAgent;
    if (sa) {
      v = sa;
      break a;
    }
  }
  v = "";
}
function w(a) {
  return -1 != v.indexOf(a);
}
;var ta = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");
function ua(a, b) {
  for (var c, d, e = 1;e < arguments.length;e++) {
    d = arguments[e];
    for (c in d) {
      a[c] = d[c];
    }
    for (var f = 0;f < ta.length;f++) {
      c = ta[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c]);
    }
  }
}
;var va = w("Opera") || w("OPR"), x = w("Trident") || w("MSIE"), wa = w("Edge"), y = w("Gecko") && !(-1 != v.toLowerCase().indexOf("webkit") && !w("Edge")) && !(w("Trident") || w("MSIE")) && !w("Edge"), xa = -1 != v.toLowerCase().indexOf("webkit") && !w("Edge");
function ya() {
  var a = v;
  if (y) {
    return /rv\:([^\);]+)(\)|;)/.exec(a);
  }
  if (wa) {
    return /Edge\/([\d\.]+)/.exec(a);
  }
  if (x) {
    return /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/.exec(a);
  }
  if (xa) {
    return /WebKit\/(\S+)/.exec(a);
  }
}
function za() {
  var a = l.document;
  return a ? a.documentMode : void 0;
}
var Aa = function() {
  if (va && l.opera) {
    var a;
    var b = l.opera.version;
    try {
      a = b();
    } catch (c) {
      a = b;
    }
    return a;
  }
  a = "";
  (b = ya()) && (a = b ? b[1] : "");
  return x && (b = za(), b > parseFloat(a)) ? String(b) : a;
}(), Ba = {};
function z(a) {
  var b;
  if (!(b = Ba[a])) {
    b = 0;
    for (var c = la(String(Aa)).split("."), d = la(String(a)).split("."), e = Math.max(c.length, d.length), f = 0;0 == b && f < e;f++) {
      var g = c[f] || "", k = d[f] || "", t = /(\d*)(\D*)/g, I = /(\d*)(\D*)/g;
      do {
        var J = t.exec(g) || ["", "", ""], K = I.exec(k) || ["", "", ""];
        if (0 == J[0].length && 0 == K[0].length) {
          break;
        }
        b = ma(0 == J[1].length ? 0 : parseInt(J[1], 10), 0 == K[1].length ? 0 : parseInt(K[1], 10)) || ma(0 == J[2].length, 0 == K[2].length) || ma(J[2], K[2]);
      } while (0 == b);
    }
    b = Ba[a] = 0 <= b;
  }
  return b;
}
var Ca = l.document, Da = Ca && x ? za() || ("CSS1Compat" == Ca.compatMode ? parseInt(Aa, 10) : 5) : void 0;
var Ea;
(Ea = !x) || (Ea = 9 <= Da);
var Fa = Ea, Ga = x && !z("9");
!xa || z("528");
y && z("1.9b") || x && z("8") || va && z("9.5") || xa && z("528");
y && !z("8") || x && z("9");
function A(a, b) {
  this.type = a;
  this.a = this.target = b;
}
A.prototype.b = function() {
};
function Ha(a) {
  Ha[" "](a);
  return a;
}
Ha[" "] = aa;
function B(a, b) {
  A.call(this, a ? a.type : "");
  this.c = this.state = this.a = this.target = null;
  if (a) {
    this.type = a.type;
    this.target = a.target || a.srcElement;
    this.a = b;
    if ((b = a.relatedTarget) && y) {
      try {
        Ha(b.nodeName);
      } catch (c) {
      }
    }
    this.state = a.state;
    this.c = a;
    a.defaultPrevented && this.b();
  }
}
r(B, A);
B.prototype.b = function() {
  B.C.b.call(this);
  var a = this.c;
  if (a.preventDefault) {
    a.preventDefault();
  } else {
    if (a.returnValue = !1, Ga) {
      try {
        if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode) {
          a.keyCode = -1;
        }
      } catch (b) {
      }
    }
  }
};
var C = "closure_listenable_" + (1E6 * Math.random() | 0), Ia = 0;
function Ja(a, b, c, d, e) {
  this.listener = a;
  this.proxy = null;
  this.src = b;
  this.type = c;
  this.v = !!d;
  this.A = e;
  ++Ia;
  this.removed = this.u = !1;
}
function D(a) {
  a.removed = !0;
  a.listener = null;
  a.proxy = null;
  a.src = null;
  a.A = null;
}
;function E(a) {
  this.src = a;
  this.a = {};
  this.b = 0;
}
function Ka(a, b, c, d, e) {
  var f = b.toString();
  b = a.a[f];
  b || (b = a.a[f] = [], a.b++);
  var g = La(b, c, d, e);
  -1 < g ? (a = b[g], a.u = !1) : (a = new Ja(c, a.src, f, !!d, e), a.u = !1, b.push(a));
  return a;
}
E.prototype.remove = function(a, b, c, d) {
  a = a.toString();
  if (!(a in this.a)) {
    return !1;
  }
  var e = this.a[a];
  b = La(e, b, c, d);
  return -1 < b ? (D(e[b]), Array.prototype.splice.call(e, b, 1), 0 == e.length && (delete this.a[a], this.b--), !0) : !1;
};
function Ma(a, b) {
  var c = b.type;
  if (c in a.a) {
    var d = a.a[c], e = pa(d, b), f;
    (f = 0 <= e) && Array.prototype.splice.call(d, e, 1);
    f && (D(b), 0 == a.a[c].length && (delete a.a[c], a.b--));
  }
}
E.prototype.removeAll = function(a) {
  a = a && a.toString();
  var b = 0, c;
  for (c in this.a) {
    if (!a || c == a) {
      for (var d = this.a[c], e = 0;e < d.length;e++) {
        ++b, D(d[e]);
      }
      delete this.a[c];
      this.b--;
    }
  }
  return b;
};
function La(a, b, c, d) {
  for (var e = 0;e < a.length;++e) {
    var f = a[e];
    if (!f.removed && f.listener == b && f.v == !!c && f.A == d) {
      return e;
    }
  }
  return -1;
}
;var Na = "closure_lm_" + (1E6 * Math.random() | 0), Oa = {}, Pa = 0;
function Qa(a, b, c, d, e) {
  if ("array" == ba(b)) {
    for (var f = 0;f < b.length;f++) {
      Qa(a, b[f], c, d, e);
    }
  } else {
    if (c = Ra(c), a && a[C]) {
      a.listen(b, c, d, e);
    } else {
      if (!b) {
        throw Error("Invalid event type");
      }
      var f = !!d, g = F(a);
      g || (a[Na] = g = new E(a));
      c = Ka(g, b, c, d, e);
      if (!c.proxy) {
        d = Sa();
        c.proxy = d;
        d.src = a;
        d.listener = c;
        if (a.addEventListener) {
          a.addEventListener(b.toString(), d, f);
        } else {
          if (a.attachEvent) {
            a.attachEvent(Ta(b.toString()), d);
          } else {
            throw Error("addEventListener and attachEvent are unavailable.");
          }
        }
        Pa++;
      }
    }
  }
}
function Sa() {
  var a = Ua, b = Fa ? function(c) {
    return a.call(b.src, b.listener, c);
  } : function(c) {
    c = a.call(b.src, b.listener, c);
    if (!c) {
      return c;
    }
  };
  return b;
}
function Va(a, b, c, d, e) {
  if ("array" == ba(b)) {
    for (var f = 0;f < b.length;f++) {
      Va(a, b[f], c, d, e);
    }
  } else {
    (c = Ra(c), a && a[C]) ? a.o.remove(String(b), c, d, e) : a && (a = F(a)) && (b = a.a[b.toString()], a = -1, b && (a = La(b, c, !!d, e)), (c = -1 < a ? b[a] : null) && Wa(c));
  }
}
function Wa(a) {
  if ("number" != typeof a && a && !a.removed) {
    var b = a.src;
    if (b && b[C]) {
      Ma(b.o, a);
    } else {
      var c = a.type, d = a.proxy;
      b.removeEventListener ? b.removeEventListener(c, d, a.v) : b.detachEvent && b.detachEvent(Ta(c), d);
      Pa--;
      (c = F(b)) ? (Ma(c, a), 0 == c.b && (c.src = null, b[Na] = null)) : D(a);
    }
  }
}
function Ta(a) {
  return a in Oa ? Oa[a] : Oa[a] = "on" + a;
}
function Xa(a, b, c, d) {
  var e = !0;
  if (a = F(a)) {
    if (b = a.a[b.toString()]) {
      for (b = b.concat(), a = 0;a < b.length;a++) {
        var f = b[a];
        f && f.v == c && !f.removed && (f = Ya(f, d), e = e && !1 !== f);
      }
    }
  }
  return e;
}
function Ya(a, b) {
  var c = a.listener, d = a.A || a.src;
  a.u && Wa(a);
  return c.call(d, b);
}
function Ua(a, b) {
  if (a.removed) {
    return !0;
  }
  if (!Fa) {
    if (!b) {
      a: {
        b = ["window", "event"];
        for (var c = l, d;d = b.shift();) {
          if (null != c[d]) {
            c = c[d];
          } else {
            b = null;
            break a;
          }
        }
        b = c;
      }
    }
    d = b;
    b = new B(d, this);
    c = !0;
    if (!(0 > d.keyCode || void 0 != d.returnValue)) {
      a: {
        var e = !1;
        if (0 == d.keyCode) {
          try {
            d.keyCode = -1;
            break a;
          } catch (g) {
            e = !0;
          }
        }
        if (e || void 0 == d.returnValue) {
          d.returnValue = !0;
        }
      }
      d = [];
      for (e = b.a;e;e = e.parentNode) {
        d.push(e);
      }
      a = a.type;
      for (e = d.length - 1;0 <= e;e--) {
        b.a = d[e];
        var f = Xa(d[e], a, !0, b), c = c && f;
      }
      for (e = 0;e < d.length;e++) {
        b.a = d[e], f = Xa(d[e], a, !1, b), c = c && f;
      }
    }
    return c;
  }
  return Ya(a, new B(b, this));
}
function F(a) {
  a = a[Na];
  return a instanceof E ? a : null;
}
var Za = "__closure_events_fn_" + (1E9 * Math.random() >>> 0);
function Ra(a) {
  if (n(a)) {
    return a;
  }
  a[Za] || (a[Za] = function(b) {
    return a.handleEvent(b);
  });
  return a[Za];
}
;function G() {
  ia.call(this);
  this.o = new E(this);
  this.h = this;
}
r(G, ia);
G.prototype[C] = !0;
G.prototype.addEventListener = function(a, b, c, d) {
  Qa(this, a, b, c, d);
};
G.prototype.removeEventListener = function(a, b, c, d) {
  Va(this, a, b, c, d);
};
G.prototype.listen = function(a, b, c, d) {
  return Ka(this.o, String(a), b, c, d);
};
function $a(a, b, c, d) {
  b = a.o.a[String(b)];
  if (!b) {
    return;
  }
  b = b.concat();
  for (var e = !0, f = 0;f < b.length;++f) {
    var g = b[f];
    if (g && !g.removed && g.v == c) {
      var k = g.listener, t = g.A || g.src;
      g.u && Ma(a.o, g);
      e = !1 !== k.call(t, d) && e;
    }
  }
}
;function H(a, b, c) {
  this.c = a;
  this.b = b;
  this.a = c;
  this.id = this.b + (this.a ? "-" + this.a : "");
}
H.prototype.send = function(a, b) {
  a = new L(a);
  var c = this.a;
  a.i = this.b;
  a.j = c;
  a.b = b;
  b = a.f;
  var c = this.c, d = a.toJSON();
  ab && 0 <= "dnt-add dnt-remove export-record feedback ga-nc gdata-update new-entry remove-sugar sync sync-for new-record upload delete-record import-gdata link set-rel put-record".split(" ").indexOf(a.g) ? l.console.log("dryRun: " + a.g, a) : (c.postMessage(d), c.a.push(a), 50 < c.a.length && --c.a.length);
  return b;
};
function bb(a) {
  A.call(this, a.req || "event");
  this.c = a;
}
r(bb, A);
bb.prototype.getMessage = function() {
  return this.c;
};
function cb(a) {
  a.prototype.then = a.prototype.then;
  a.prototype.$goog_Thenable = !0;
}
function db(a) {
  if (!a) {
    return !1;
  }
  try {
    return !!a.$goog_Thenable;
  } catch (b) {
    return !1;
  }
}
;function eb(a, b, c) {
  this.f = c;
  this.c = a;
  this.g = b;
  this.b = 0;
  this.a = null;
}
eb.prototype.get = function() {
  var a;
  0 < this.b ? (this.b--, a = this.a, this.a = a.next, a.next = null) : a = this.c();
  return a;
};
function fb(a, b) {
  a.g(b);
  a.b < a.f && (a.b++, b.next = a.a, a.a = b);
}
;function gb() {
  this.b = this.a = null;
}
var ib = new eb(function() {
  return new hb;
}, function(a) {
  a.reset();
}, 100);
gb.prototype.remove = function() {
  var a = null;
  this.a && (a = this.a, this.a = this.a.next, this.a || (this.b = null), a.next = null);
  return a;
};
function hb() {
  this.next = this.b = this.a = null;
}
hb.prototype.set = function(a, b) {
  this.a = a;
  this.b = b;
  this.next = null;
};
hb.prototype.reset = function() {
  this.next = this.b = this.a = null;
};
function jb(a) {
  l.setTimeout(function() {
    throw a;
  }, 0);
}
var kb;
function lb() {
  var a = l.MessageChannel;
  "undefined" === typeof a && "undefined" !== typeof window && window.postMessage && window.addEventListener && !w("Presto") && (a = function() {
    var a = document.createElement("IFRAME");
    a.style.display = "none";
    a.src = "";
    document.documentElement.appendChild(a);
    var b = a.contentWindow, a = b.document;
    a.open();
    a.write("");
    a.close();
    var c = "callImmediate" + Math.random(), d = "file:" == b.location.protocol ? "*" : b.location.protocol + "//" + b.location.host, a = p(function(a) {
      if (("*" == d || a.origin == d) && a.data == c) {
        this.port1.onmessage();
      }
    }, this);
    b.addEventListener("message", a, !1);
    this.port1 = {};
    this.port2 = {postMessage:function() {
      b.postMessage(c, d);
    }};
  });
  if ("undefined" !== typeof a && !w("Trident") && !w("MSIE")) {
    var b = new a, c = {}, d = c;
    b.port1.onmessage = function() {
      if (void 0 !== c.next) {
        c = c.next;
        var a = c.D;
        c.D = null;
        a();
      }
    };
    return function(a) {
      d.next = {D:a};
      d = d.next;
      b.port2.postMessage(0);
    };
  }
  return "undefined" !== typeof document && "onreadystatechange" in document.createElement("SCRIPT") ? function(a) {
    var b = document.createElement("SCRIPT");
    b.onreadystatechange = function() {
      b.onreadystatechange = null;
      b.parentNode.removeChild(b);
      b = null;
      a();
      a = null;
    };
    document.documentElement.appendChild(b);
  } : function(a) {
    l.setTimeout(a, 0);
  };
}
;function mb(a, b) {
  M || nb();
  ob || (M(), ob = !0);
  var c = pb, d = ib.get();
  d.set(a, b);
  c.b ? c.b.next = d : c.a = d;
  c.b = d;
}
var M;
function nb() {
  if (l.Promise && l.Promise.resolve) {
    var a = l.Promise.resolve(void 0);
    M = function() {
      a.then(qb);
    };
  } else {
    M = function() {
      var a = qb;
      !n(l.setImmediate) || l.Window && l.Window.prototype && !w("Edge") && l.Window.prototype.setImmediate == l.setImmediate ? (kb || (kb = lb()), kb(a)) : l.setImmediate(a);
    };
  }
}
var ob = !1, pb = new gb;
function qb() {
  for (var a;a = pb.remove();) {
    try {
      a.a.call(a.b);
    } catch (b) {
      jb(b);
    }
    fb(ib, a);
  }
  ob = !1;
}
;function N(a, b) {
  this.a = O;
  this.i = void 0;
  this.f = this.b = this.c = null;
  this.g = this.h = !1;
  if (a != aa) {
    try {
      var c = this;
      a.call(b, function(a) {
        P(c, Q, a);
      }, function(a) {
        if (!(a instanceof R)) {
          try {
            if (a instanceof Error) {
              throw a;
            }
            throw Error("Promise rejected.");
          } catch (b) {
          }
        }
        P(c, S, a);
      });
    } catch (d) {
      P(this, S, d);
    }
  }
}
var O = 0, Q = 2, S = 3;
function rb() {
  this.next = this.c = this.b = this.f = this.a = null;
  this.g = !1;
}
rb.prototype.reset = function() {
  this.c = this.b = this.f = this.a = null;
  this.g = !1;
};
var sb = new eb(function() {
  return new rb;
}, function(a) {
  a.reset();
}, 100);
function tb(a, b, c) {
  var d = sb.get();
  d.f = a;
  d.b = b;
  d.c = c;
  return d;
}
N.prototype.then = function(a, b, c) {
  return ub(this, n(a) ? a : null, n(b) ? b : null, c);
};
cb(N);
N.prototype.cancel = function(a) {
  this.a == O && mb(function() {
    var b = new R(a);
    vb(this, b);
  }, this);
};
function vb(a, b) {
  if (a.a == O) {
    if (a.c) {
      var c = a.c;
      if (c.b) {
        for (var d = 0, e = null, f = null, g = c.b;g && (g.g || (d++, g.a == a && (e = g), !(e && 1 < d)));g = g.next) {
          e || (f = g);
        }
        e && (c.a == O && 1 == d ? vb(c, b) : (f ? (d = f, d.next == c.f && (c.f = d), d.next = d.next.next) : wb(c), xb(c, e, S, b)));
      }
      a.c = null;
    } else {
      P(a, S, b);
    }
  }
}
function yb(a, b) {
  a.b || a.a != Q && a.a != S || zb(a);
  a.f ? a.f.next = b : a.b = b;
  a.f = b;
}
function ub(a, b, c, d) {
  var e = tb(null, null, null);
  e.a = new N(function(a, g) {
    e.f = b ? function(c) {
      try {
        var e = b.call(d, c);
        a(e);
      } catch (I) {
        g(I);
      }
    } : a;
    e.b = c ? function(b) {
      try {
        var e = c.call(d, b);
        void 0 === e && b instanceof R ? g(b) : a(e);
      } catch (I) {
        g(I);
      }
    } : g;
  });
  e.a.c = a;
  yb(a, e);
  return e.a;
}
N.prototype.l = function(a) {
  this.a = O;
  P(this, Q, a);
};
N.prototype.s = function(a) {
  this.a = O;
  P(this, S, a);
};
function P(a, b, c) {
  if (a.a == O) {
    a == c && (b = S, c = new TypeError("Promise cannot resolve to itself"));
    a.a = 1;
    var d;
    a: {
      var e = c, f = a.l, g = a.s;
      if (e instanceof N) {
        yb(e, tb(f || aa, g || null, a)), d = !0;
      } else {
        if (db(e)) {
          e.then(f, g, a), d = !0;
        } else {
          if (ca(e)) {
            try {
              var k = e.then;
              if (n(k)) {
                Ab(e, k, f, g, a);
                d = !0;
                break a;
              }
            } catch (t) {
              g.call(a, t);
              d = !0;
              break a;
            }
          }
          d = !1;
        }
      }
    }
    d || (a.i = c, a.a = b, a.c = null, zb(a), b != S || c instanceof R || Bb(a, c));
  }
}
function Ab(a, b, c, d, e) {
  function f(a) {
    k || (k = !0, d.call(e, a));
  }
  function g(a) {
    k || (k = !0, c.call(e, a));
  }
  var k = !1;
  try {
    b.call(a, g, f);
  } catch (t) {
    f(t);
  }
}
function zb(a) {
  a.h || (a.h = !0, mb(a.j, a));
}
function wb(a) {
  var b = null;
  a.b && (b = a.b, a.b = b.next, b.next = null);
  a.b || (a.f = null);
  return b;
}
N.prototype.j = function() {
  for (var a;a = wb(this);) {
    xb(this, a, this.a, this.i);
  }
  this.h = !1;
};
function xb(a, b, c, d) {
  if (c == S && b.b && !b.g) {
    for (;a && a.g;a = a.c) {
      a.g = !1;
    }
  }
  if (b.a) {
    b.a.c = null, Cb(b, c, d);
  } else {
    try {
      b.g ? b.f.call(b.c) : Cb(b, c, d);
    } catch (e) {
      Db.call(null, e);
    }
  }
  fb(sb, b);
}
function Cb(a, b, c) {
  b == Q ? a.f.call(a.c, c) : a.b && a.b.call(a.c, c);
}
function Bb(a, b) {
  a.g = !0;
  mb(function() {
    a.g && Db.call(null, b);
  });
}
var Db = jb;
function R(a) {
  u.call(this, a);
}
r(R, u);
R.prototype.name = "cancel";
/*
 Portions of this code are from MochiKit, received by
 The Closure Authors under the MIT license. All other code is Copyright
 2005-2009 The Closure Authors. All Rights Reserved.
*/
function T(a, b) {
  this.h = [];
  this.H = a;
  this.G = b || null;
  this.g = this.a = !1;
  this.c = void 0;
  this.s = this.M = this.j = !1;
  this.i = 0;
  this.b = null;
  this.l = 0;
}
h = T.prototype;
h.cancel = function(a) {
  if (this.a) {
    this.c instanceof T && this.c.cancel();
  } else {
    if (this.b) {
      var b = this.b;
      delete this.b;
      a ? b.cancel(a) : (b.l--, 0 >= b.l && b.cancel());
    }
    this.H ? this.H.call(this.G, this) : this.s = !0;
    this.a || this.w(new U);
  }
};
h.F = function(a, b) {
  this.j = !1;
  Eb(this, a, b);
};
function Eb(a, b, c) {
  a.a = !0;
  a.c = c;
  a.g = !b;
  Fb(a);
}
function Gb(a) {
  if (a.a) {
    if (!a.s) {
      throw new V;
    }
    a.s = !1;
  }
}
h.B = function(a) {
  Gb(this);
  Eb(this, !0, a);
};
h.w = function(a) {
  Gb(this);
  Eb(this, !1, a);
};
h.J = function(a, b) {
  return this.m(a, null, b);
};
h.K = function(a, b) {
  return this.m(null, a, b);
};
h.I = function(a, b) {
  return this.m(a, a, b);
};
h.m = function(a, b, c) {
  this.h.push([a, b, c]);
  this.a && Fb(this);
  return this;
};
h.then = function(a, b, c) {
  var d, e, f = new N(function(a, b) {
    d = a;
    e = b;
  });
  this.m(d, function(a) {
    a instanceof U ? f.cancel() : e(a);
  });
  return f.then(a, b, c);
};
cb(T);
function Hb(a) {
  return qa(a.h, function(a) {
    return n(a[1]);
  });
}
function Fb(a) {
  if (a.i && a.a && Hb(a)) {
    var b = a.i, c = W[b];
    c && (l.clearTimeout(c.a), delete W[b]);
    a.i = 0;
  }
  a.b && (a.b.l--, delete a.b);
  for (var b = a.c, d = c = !1;a.h.length && !a.j;) {
    var e = a.h.shift(), f = e[0], g = e[1], e = e[2];
    if (f = a.g ? g : f) {
      try {
        var k = f.call(e || a.G, b);
        void 0 !== k && (a.g = a.g && (k == b || k instanceof Error), a.c = b = k);
        if (db(b) || "function" === typeof l.Promise && b instanceof l.Promise) {
          d = !0, a.j = !0;
        }
      } catch (t) {
        b = t, a.g = !0, Hb(a) || (c = !0);
      }
    }
  }
  a.c = b;
  d && (k = p(a.F, a, !0), d = p(a.F, a, !1), b instanceof T ? (b.m(k, d), b.M = !0) : b.then(k, d));
  c && (b = new Ib(b), W[b.a] = b, a.i = b.a);
}
function V() {
  u.call(this);
}
r(V, u);
V.prototype.message = "Deferred has already fired";
V.prototype.name = "AlreadyCalledError";
function U() {
  u.call(this);
}
r(U, u);
U.prototype.message = "Deferred was canceled";
U.prototype.name = "CanceledError";
function Ib(a) {
  this.a = l.setTimeout(p(this.c, this), 0);
  this.b = a;
}
Ib.prototype.c = function() {
  delete W[this.a];
  window.console.error(this.b.stack);
  throw this.b;
};
var W = {};
function X(a, b, c, d, e) {
  this.reset(a, b, c, d, e);
}
X.prototype.a = null;
var Jb = 0;
X.prototype.reset = function(a, b, c, d, e) {
  "number" == typeof e || Jb++;
  d || ha();
  this.b = b;
  delete this.a;
};
X.prototype.getMessage = function() {
  return this.b;
};
function Kb(a) {
  this.f = a;
  this.b = this.c = this.a = null;
}
function Lb(a, b) {
  this.name = a;
  this.value = b;
}
Lb.prototype.toString = function() {
  return this.name;
};
var Mb = new Lb("CONFIG", 700);
Kb.prototype.getChildren = function() {
  this.b || (this.b = {});
  return this.b;
};
function Nb(a) {
  if (a.c) {
    return a.c;
  }
  if (a.a) {
    return Nb(a.a);
  }
  oa("Root logger has no level set.");
  return null;
}
Kb.prototype.log = function(a, b, c) {
  if (a.value >= Nb(this).value) {
    for (n(b) && (b = b()), a = new X(a, String(b), this.f), c && (a.a = c), c = "log:" + a.getMessage(), l.console && (l.console.timeStamp ? l.console.timeStamp(c) : l.console.markTimeline && l.console.markTimeline(c)), l.msWriteProfilerMark && l.msWriteProfilerMark(c), c = this;c;) {
      c = c.a;
    }
  }
};
var Ob = {}, Pb = null;
function Qb(a) {
  Pb || (Pb = new Kb(""), Ob[""] = Pb, Pb.c = Mb);
  var b;
  if (!(b = Ob[a])) {
    b = new Kb(a);
    var c = a.lastIndexOf("."), d = a.substr(c + 1), c = Qb(a.substr(0, c));
    c.getChildren()[d] = b;
    b.a = c;
    Ob[a] = b;
  }
  return b;
}
;Qb("ydn");
function Y(a, b) {
  T.call(this, a, b);
  this.f = [];
}
r(Y, T);
Y.prototype.L = function(a, b) {
  this.f.push([a, b]);
  return this;
};
Y.prototype.B = function(a) {
  this.f.length = 0;
  Y.C.B.call(this, a);
};
Y.prototype.w = function(a) {
  this.f.length = 0;
  Y.C.w.call(this, a);
};
function L(a) {
  Rb++;
  this.id = "i" + Rb;
  this.g = a;
  this.c = !0;
  this.a = this.b = null;
  this.f = new Y;
  this.h = NaN;
}
var Rb = 0;
L.prototype.listen = function(a) {
  if (a && a.id == this.id) {
    this.b = a.data;
    var b = a.error;
    if (b) {
      if (b instanceof Error) {
        this.a = b;
      } else {
        if (ca(b)) {
          this.a = Error(b.message), b.name && (this.a.name = b.name), this.a.source = b, this.a.result = this.b;
        } else {
          if (m(b)) {
            if (/^\s*$/.test(b) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(b.replace(/\\["\\\/bfnrtu]/g, "@").replace(/(?:"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)[\s\u2028\u2029]*(?=:|,|]|}|$)/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, ""))) {
              try {
                var c = JSON.parse(b);
                this.a = Error(c.message);
                for (var d in c) {
                  this.a[d] = c[d];
                }
              } catch (e) {
                this.a = Error(b);
              }
            } else {
              this.a = Error(b);
            }
          } else {
            this.a = Error(b);
          }
        }
      }
    }
    if (a.done) {
      this.c = !1, this.a ? this.f.w(this.a) : this.f.B(this.b), window.clearTimeout(this.h);
    } else {
      for (b = this.f, a = a.data, c = 0;c < b.f.length;c++) {
        b.f[c][0].call(b.f[c][1], a);
      }
    }
    return !0;
  }
  return !1;
};
L.prototype.toString = function() {
  return "Message:" + this.id + (this.c ? "*" : "");
};
L.prototype.toJSON = function() {
  var a = this;
  this.h = window.setTimeout(function() {
    if (a.c) {
      var b = Error("message timeout");
      b.name = "TimeOutError";
      a.listen({id:a.id, req:a.g, error:b});
    }
  }, 3E5);
  return {id:this.id, req:this.g, group:this.i, name:this.j, data:this.b};
};
function Z(a) {
  G.call(this);
  var b = m(a) ? null : a;
  this.name = m(a) ? a : a.name;
  this.a = [];
  this.j = b;
  this.b = null;
  this.c = {};
}
r(Z, G);
Z.prototype.i = function(a) {
  if (a) {
    if (a.id) {
      for (var b = this.a.length - 1;0 <= b;b--) {
        if (this.a[b].id == a.id) {
          if (this.a[b].listen(a)) {
            this.a[b].c ? 25 < b && (b = this.a.splice(b, 1), this.a.unshift(b[0])) : this.a.splice(b, 1);
            break;
          }
          break;
        }
      }
    } else {
      if ("info" == a.req) {
        a.data = this.j, this.b.postMessage(a);
      } else {
        if ("html-body-inner" == a.req) {
          l.console.log("html", a), a.req = "", a.done = !0, a.data = document && document.body ? document.body.innerHTML : "", this.b.postMessage(a);
        } else {
          b = this.h;
          a = new bb(a);
          var c = a.type || a;
          if (m(a)) {
            a = new A(a, b);
          } else {
            if (a instanceof A) {
              a.target = a.target || b;
            } else {
              var d = a;
              a = new A(c, b);
              ua(a, d);
            }
          }
          b = a.a = b;
          $a(b, c, !0, a);
          $a(b, c, !1, a);
        }
      }
    }
  }
};
Z.prototype.postMessage = function(a) {
  Sb(this).postMessage(a);
};
Z.prototype.g = function(a, b) {
  a = a || Tb;
  var c = a + (b ? "-" + b : "");
  this.c[c] || (this.c[c] = new H(this, a, b || ""));
  return this.c[c];
};
function Sb(a) {
  if (!a.b) {
    a.b = chrome.runtime.connect({name:a.name});
    var b = p(a.i, a);
    a.b.onMessage.addListener(b);
    a.b.onDisconnect.addListener(function() {
      a.b.onMessage.removeListener(b);
      a.b = null;
      a.a.length = 0;
    });
  }
  return a.b;
}
Z.prototype.toString = function() {
  return "Pipe:" + this.name;
};
var ab = !1, Tb = "default";
var Ub = null;
q("ydn.msg.Pipe", Z);
q("ydn.msg.initPipe", function(a) {
  var b = a;
  m(a) && (b = {group:a, name:a + "-" + ha()});
  return Ub = new Z(b);
});
q("ydn.msg.getChannel", function(a, b) {
  if (!Ub) {
    var c = Tb + "-" + ha();
    Ub = new Z(c);
  }
  return Ub.g(a, b);
});
Z.prototype.listen = Z.prototype.listen;
Z.prototype.getChannel = Z.prototype.g;
H.prototype.send = H.prototype.send;
q("goog.async.Deferred", T);
T.prototype.addCallback = T.prototype.J;
T.prototype.addErrback = T.prototype.K;
T.prototype.addBoth = T.prototype.I;
T.prototype.addCallbacks = T.prototype.m;
Y.prototype.addProgback = Y.prototype.L;
})();
