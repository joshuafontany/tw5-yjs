/*\
title: lib0.js
type: application/javascript
module-type: library

https://github.com/dmonad/lib0#readme

\*/

(function (exports) {
  'use strict';

  /**
   * Utility module to work with Arrays.
   *
   * @module array
   */

  /**
   * Return the last element of an array. The element must exist
   *
   * @template L
   * @param {Array<L>} arr
   * @return {L}
   */
  const last = arr => arr[arr.length - 1];

  /**
   * @template C
   * @return {Array<C>}
   */
  const create$8 = () => /** @type {Array<C>} */ ([]);

  /**
   * @template D
   * @param {Array<D>} a
   * @return {Array<D>}
   */
  const copy$1 = a => /** @type {Array<D>} */ (a.slice());

  /**
   * Append elements from src to dest
   *
   * @template M
   * @param {Array<M>} dest
   * @param {Array<M>} src
   */
  const appendTo = (dest, src) => {
    for (let i = 0; i < src.length; i++) {
      dest.push(src[i]);
    }
  };

  /**
   * Transforms something array-like to an actual Array.
   *
   * @function
   * @template T
   * @param {ArrayLike<T>|Iterable<T>} arraylike
   * @return {T}
   */
  const from$1 = Array.from;

  /**
   * True iff condition holds on every element in the Array.
   *
   * @function
   * @template ITEM
   *
   * @param {Array<ITEM>} arr
   * @param {function(ITEM, number, Array<ITEM>):boolean} f
   * @return {boolean}
   */
  const every$1 = (arr, f) => arr.every(f);

  /**
   * True iff condition holds on some element in the Array.
   *
   * @function
   * @template S
   * @param {Array<S>} arr
   * @param {function(S, number, Array<S>):boolean} f
   * @return {boolean}
   */
  const some$1 = (arr, f) => arr.some(f);

  /**
   * @template ELEM
   *
   * @param {Array<ELEM>} a
   * @param {Array<ELEM>} b
   * @return {boolean}
   */
  const equalFlat$1 = (a, b) => a.length === b.length && every$1(a, (item, index) => item === b[index]);

  /**
   * @template ELEM
   * @param {Array<Array<ELEM>>} arr
   * @return {Array<ELEM>}
   */
  const flatten = arr => arr.reduce((acc, val) => acc.concat(val), []);

  var array = /*#__PURE__*/Object.freeze({
    __proto__: null,
    last: last,
    create: create$8,
    copy: copy$1,
    appendTo: appendTo,
    from: from$1,
    every: every$1,
    some: some$1,
    equalFlat: equalFlat$1,
    flatten: flatten
  });

  /* eslint-env browser */

  /**
   * Binary data constants.
   *
   * @module binary
   */

  /**
   * n-th bit activated.
   *
   * @type {number}
   */
  const BIT1 = 1;
  const BIT2 = 2;
  const BIT3 = 4;
  const BIT4 = 8;
  const BIT5 = 16;
  const BIT6 = 32;
  const BIT7 = 64;
  const BIT8 = 128;
  const BIT9 = 256;
  const BIT10 = 512;
  const BIT11 = 1024;
  const BIT12 = 2048;
  const BIT13 = 4096;
  const BIT14 = 8192;
  const BIT15 = 16384;
  const BIT16 = 32768;
  const BIT17 = 65536;
  const BIT18 = 1 << 17;
  const BIT19 = 1 << 18;
  const BIT20 = 1 << 19;
  const BIT21 = 1 << 20;
  const BIT22 = 1 << 21;
  const BIT23 = 1 << 22;
  const BIT24 = 1 << 23;
  const BIT25 = 1 << 24;
  const BIT26 = 1 << 25;
  const BIT27 = 1 << 26;
  const BIT28 = 1 << 27;
  const BIT29 = 1 << 28;
  const BIT30 = 1 << 29;
  const BIT31 = 1 << 30;
  const BIT32 = 1 << 31;

  /**
   * First n bits activated.
   *
   * @type {number}
   */
  const BITS0 = 0;
  const BITS1 = 1;
  const BITS2 = 3;
  const BITS3 = 7;
  const BITS4 = 15;
  const BITS5 = 31;
  const BITS6 = 63;
  const BITS7 = 127;
  const BITS8 = 255;
  const BITS9 = 511;
  const BITS10 = 1023;
  const BITS11 = 2047;
  const BITS12 = 4095;
  const BITS13 = 8191;
  const BITS14 = 16383;
  const BITS15 = 32767;
  const BITS16 = 65535;
  const BITS17 = BIT18 - 1;
  const BITS18 = BIT19 - 1;
  const BITS19 = BIT20 - 1;
  const BITS20 = BIT21 - 1;
  const BITS21 = BIT22 - 1;
  const BITS22 = BIT23 - 1;
  const BITS23 = BIT24 - 1;
  const BITS24 = BIT25 - 1;
  const BITS25 = BIT26 - 1;
  const BITS26 = BIT27 - 1;
  const BITS27 = BIT28 - 1;
  const BITS28 = BIT29 - 1;
  const BITS29 = BIT30 - 1;
  const BITS30 = BIT31 - 1;
  /**
   * @type {number}
   */
  const BITS31 = 0x7FFFFFFF;
  /**
   * @type {number}
   */
  const BITS32 = 0xFFFFFFFF;

  var binary = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BIT1: BIT1,
    BIT2: BIT2,
    BIT3: BIT3,
    BIT4: BIT4,
    BIT5: BIT5,
    BIT6: BIT6,
    BIT7: BIT7,
    BIT8: BIT8,
    BIT9: BIT9,
    BIT10: BIT10,
    BIT11: BIT11,
    BIT12: BIT12,
    BIT13: BIT13,
    BIT14: BIT14,
    BIT15: BIT15,
    BIT16: BIT16,
    BIT17: BIT17,
    BIT18: BIT18,
    BIT19: BIT19,
    BIT20: BIT20,
    BIT21: BIT21,
    BIT22: BIT22,
    BIT23: BIT23,
    BIT24: BIT24,
    BIT25: BIT25,
    BIT26: BIT26,
    BIT27: BIT27,
    BIT28: BIT28,
    BIT29: BIT29,
    BIT30: BIT30,
    BIT31: BIT31,
    BIT32: BIT32,
    BITS0: BITS0,
    BITS1: BITS1,
    BITS2: BITS2,
    BITS3: BITS3,
    BITS4: BITS4,
    BITS5: BITS5,
    BITS6: BITS6,
    BITS7: BITS7,
    BITS8: BITS8,
    BITS9: BITS9,
    BITS10: BITS10,
    BITS11: BITS11,
    BITS12: BITS12,
    BITS13: BITS13,
    BITS14: BITS14,
    BITS15: BITS15,
    BITS16: BITS16,
    BITS17: BITS17,
    BITS18: BITS18,
    BITS19: BITS19,
    BITS20: BITS20,
    BITS21: BITS21,
    BITS22: BITS22,
    BITS23: BITS23,
    BITS24: BITS24,
    BITS25: BITS25,
    BITS26: BITS26,
    BITS27: BITS27,
    BITS28: BITS28,
    BITS29: BITS29,
    BITS30: BITS30,
    BITS31: BITS31,
    BITS32: BITS32
  });

  /**
   * Utility module to work with key-value stores.
   *
   * @module map
   */

  /**
   * Creates a new Map instance.
   *
   * @function
   * @return {Map<any, any>}
   *
   * @function
   */
  const create$7 = () => new Map();

  /**
   * Copy a Map object into a fresh Map object.
   *
   * @function
   * @template X,Y
   * @param {Map<X,Y>} m
   * @return {Map<X,Y>}
   */
  const copy = m => {
    const r = create$7();
    m.forEach((v, k) => { r.set(k, v); });
    return r
  };

  /**
   * Get map property. Create T if property is undefined and set T on map.
   *
   * ```js
   * const listeners = map.setIfUndefined(events, 'eventName', set.create)
   * listeners.add(listener)
   * ```
   *
   * @function
   * @template T,K
   * @param {Map<K, T>} map
   * @param {K} key
   * @param {function():T} createT
   * @return {T}
   */
  const setIfUndefined = (map, key, createT) => {
    let set = map.get(key);
    if (set === undefined) {
      map.set(key, set = createT());
    }
    return set
  };

  /**
   * Creates an Array and populates it with the content of all key-value pairs using the `f(value, key)` function.
   *
   * @function
   * @template K
   * @template V
   * @template R
   * @param {Map<K,V>} m
   * @param {function(V,K):R} f
   * @return {Array<R>}
   */
  const map$2 = (m, f) => {
    const res = [];
    for (const [key, value] of m) {
      res.push(f(value, key));
    }
    return res
  };

  /**
   * Tests whether any key-value pairs pass the test implemented by `f(value, key)`.
   *
   * @todo should rename to some - similarly to Array.some
   *
   * @function
   * @template K
   * @template V
   * @param {Map<K,V>} m
   * @param {function(V,K):boolean} f
   * @return {boolean}
   */
  const any = (m, f) => {
    for (const [key, value] of m) {
      if (f(value, key)) {
        return true
      }
    }
    return false
  };

  /**
   * Tests whether all key-value pairs pass the test implemented by `f(value, key)`.
   *
   * @function
   * @template K
   * @template V
   * @param {Map<K,V>} m
   * @param {function(V,K):boolean} f
   * @return {boolean}
   */
  const all$1 = (m, f) => {
    for (const [key, value] of m) {
      if (!f(value, key)) {
        return false
      }
    }
    return true
  };

  var map$3 = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$7,
    copy: copy,
    setIfUndefined: setIfUndefined,
    map: map$2,
    any: any,
    all: all$1
  });

  /**
   * Utility module to work with strings.
   *
   * @module string
   */

  const fromCharCode = String.fromCharCode;
  const fromCodePoint = String.fromCodePoint;

  /**
   * @param {string} s
   * @return {string}
   */
  const toLowerCase = s => s.toLowerCase();

  const trimLeftRegex = /^\s*/g;

  /**
   * @param {string} s
   * @return {string}
   */
  const trimLeft = s => s.replace(trimLeftRegex, '');

  const fromCamelCaseRegex = /([A-Z])/g;

  /**
   * @param {string} s
   * @param {string} separator
   * @return {string}
   */
  const fromCamelCase = (s, separator) => trimLeft(s.replace(fromCamelCaseRegex, match => `${separator}${toLowerCase(match)}`));

  /**
   * Compute the utf8ByteLength
   * @param {string} str
   * @return {number}
   */
  const utf8ByteLength = str => unescape(encodeURIComponent(str)).length;

  /**
   * @param {string} str
   * @return {Uint8Array}
   */
  const _encodeUtf8Polyfill = str => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    const buf = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      buf[i] = /** @type {number} */ (encodedString.codePointAt(i));
    }
    return buf
  };

  /* istanbul ignore next */
  const utf8TextEncoder = /** @type {TextEncoder} */ (typeof TextEncoder !== 'undefined' ? new TextEncoder() : null);

  /**
   * @param {string} str
   * @return {Uint8Array}
   */
  const _encodeUtf8Native = str => utf8TextEncoder.encode(str);

  /**
   * @param {string} str
   * @return {Uint8Array}
   */
  /* istanbul ignore next */
  const encodeUtf8 = utf8TextEncoder ? _encodeUtf8Native : _encodeUtf8Polyfill;

  /**
   * @param {Uint8Array} buf
   * @return {string}
   */
  const _decodeUtf8Polyfill = buf => {
    let remainingLen = buf.length;
    let encodedString = '';
    let bufPos = 0;
    while (remainingLen > 0) {
      const nextLen = remainingLen < 10000 ? remainingLen : 10000;
      const bytes = buf.subarray(bufPos, bufPos + nextLen);
      bufPos += nextLen;
      // Starting with ES5.1 we can supply a generic array-like object as arguments
      encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
      remainingLen -= nextLen;
    }
    return decodeURIComponent(escape(encodedString))
  };

  /* istanbul ignore next */
  let utf8TextDecoder = typeof TextDecoder === 'undefined' ? null : new TextDecoder('utf-8', { fatal: true, ignoreBOM: true });

  /* istanbul ignore next */
  if (utf8TextDecoder && utf8TextDecoder.decode(new Uint8Array()).length === 1) {
    // Safari doesn't handle BOM correctly.
    // This fixes a bug in Safari 13.0.5 where it produces a BOM the first time it is called.
    // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the first call and
    // utf8TextDecoder.decode(new Uint8Array()).length === 1 on the second call
    // Another issue is that from then on no BOM chars are recognized anymore
    /* istanbul ignore next */
    utf8TextDecoder = null;
  }

  /**
   * @param {Uint8Array} buf
   * @return {string}
   */
  const _decodeUtf8Native = buf => /** @type {TextDecoder} */ (utf8TextDecoder).decode(buf);

  /**
   * @param {Uint8Array} buf
   * @return {string}
   */
  /* istanbul ignore next */
  const decodeUtf8 = utf8TextDecoder ? _decodeUtf8Native : _decodeUtf8Polyfill;

  /**
   * @param {string} str The initial string
   * @param {number} index Starting position
   * @param {number} remove Number of characters to remove
   * @param {string} insert New content to insert
   */
  const splice = (str, index, remove, insert = '') => str.slice(0, index) + insert + str.slice(index + remove);

  var string = /*#__PURE__*/Object.freeze({
    __proto__: null,
    fromCharCode: fromCharCode,
    fromCodePoint: fromCodePoint,
    trimLeft: trimLeft,
    fromCamelCase: fromCamelCase,
    utf8ByteLength: utf8ByteLength,
    _encodeUtf8Polyfill: _encodeUtf8Polyfill,
    utf8TextEncoder: utf8TextEncoder,
    _encodeUtf8Native: _encodeUtf8Native,
    encodeUtf8: encodeUtf8,
    _decodeUtf8Polyfill: _decodeUtf8Polyfill,
    get utf8TextDecoder () { return utf8TextDecoder; },
    _decodeUtf8Native: _decodeUtf8Native,
    decodeUtf8: decodeUtf8,
    splice: splice
  });

  /**
   * Often used conditions.
   *
   * @module conditions
   */

  /**
   * @template T
   * @param {T|null|undefined} v
   * @return {T|null}
   */
  /* istanbul ignore next */
  const undefinedToNull = v => v === undefined ? null : v;

  var conditions = /*#__PURE__*/Object.freeze({
    __proto__: null,
    undefinedToNull: undefinedToNull
  });

  /* global localStorage, addEventListener */

  /**
   * Isomorphic variable storage.
   *
   * Uses LocalStorage in the browser and falls back to in-memory storage.
   *
   * @module storage
   */

  /* istanbul ignore next */
  class VarStoragePolyfill {
    constructor () {
      this.map = new Map();
    }

    /**
     * @param {string} key
     * @param {any} newValue
     */
    setItem (key, newValue) {
      this.map.set(key, newValue);
    }

    /**
     * @param {string} key
     */
    getItem (key) {
      return this.map.get(key)
    }
  }

  /* istanbul ignore next */
  /**
   * @type {any}
   */
  let _localStorage = new VarStoragePolyfill();
  let usePolyfill = true;

  try {
    // if the same-origin rule is violated, accessing localStorage might thrown an error
    /* istanbul ignore next */
    if (typeof localStorage !== 'undefined') {
      _localStorage = localStorage;
      usePolyfill = false;
    }
  } catch (e) { }

  /* istanbul ignore next */
  /**
   * This is basically localStorage in browser, or a polyfill in nodejs
   */
  const varStorage = _localStorage;

  /* istanbul ignore next */
  /**
   * A polyfill for `addEventListener('storage', event => {..})` that does nothing if the polyfill is being used.
   *
   * @param {function({ key: string, newValue: string, oldValue: string }): void} eventHandler
   * @function
   */
  const onChange = eventHandler => usePolyfill || addEventListener('storage', /** @type {any} */ (eventHandler));

  /**
   * Isomorphic module to work access the environment (query params, env variables).
   *
   * @module map
   */

  /* istanbul ignore next */
  // @ts-ignore
  const isNode = typeof process !== 'undefined' && process.release && /node|io\.js/.test(process.release.name);
  /* istanbul ignore next */
  const isBrowser = typeof window !== 'undefined' && !isNode;
  /* istanbul ignore next */
  const isMac = typeof navigator !== 'undefined' ? /Mac/.test(navigator.platform) : false;

  /**
   * @type {Map<string,string>}
   */
  let params;

  /* istanbul ignore next */
  const computeParams = () => {
    if (params === undefined) {
      if (isNode) {
        params = create$7();
        const pargs = process.argv;
        let currParamName = null;
        /* istanbul ignore next */
        for (let i = 0; i < pargs.length; i++) {
          const parg = pargs[i];
          if (parg[0] === '-') {
            if (currParamName !== null) {
              params.set(currParamName, '');
            }
            currParamName = parg;
          } else {
            if (currParamName !== null) {
              params.set(currParamName, parg);
              currParamName = null;
            }
          }
        }
        if (currParamName !== null) {
          params.set(currParamName, '');
        }
      // in ReactNative for example this would not be true (unless connected to the Remote Debugger)
      } else if (typeof location === 'object') {
        params = create$7()
        // eslint-disable-next-line no-undef
        ;(location.search || '?').slice(1).split('&').forEach(kv => {
          if (kv.length !== 0) {
            const [key, value] = kv.split('=');
            params.set(`--${fromCamelCase(key, '-')}`, value);
            params.set(`-${fromCamelCase(key, '-')}`, value);
          }
        });
      } else {
        params = create$7();
      }
    }
    return params
  };

  /**
   * @param {string} name
   * @return {boolean}
   */
  /* istanbul ignore next */
  const hasParam = name => computeParams().has(name);

  /**
   * @param {string} name
   * @param {string} defaultVal
   * @return {string}
   */
  /* istanbul ignore next */
  const getParam = (name, defaultVal) => computeParams().get(name) || defaultVal;
  // export const getArgs = name => computeParams() && args

  /**
   * @param {string} name
   * @return {string|null}
   */
  /* istanbul ignore next */
  const getVariable = name => isNode ? undefinedToNull(process.env[name.toUpperCase()]) : undefinedToNull(varStorage.getItem(name));

  /**
   * @param {string} name
   * @return {string|null}
   */
  const getConf = name => computeParams().get('--' + name) || getVariable(name);

  /**
   * @param {string} name
   * @return {boolean}
   */
  /* istanbul ignore next */
  const hasConf = name => hasParam('--' + name) || getVariable(name) !== null;

  /* istanbul ignore next */
  const production = hasConf('production');

  var environment = /*#__PURE__*/Object.freeze({
    __proto__: null,
    isNode: isNode,
    isBrowser: isBrowser,
    isMac: isMac,
    hasParam: hasParam,
    getParam: getParam,
    getVariable: getVariable,
    getConf: getConf,
    hasConf: hasConf,
    production: production
  });

  /**
   * Common Math expressions.
   *
   * @module math
   */

  const floor = Math.floor;
  const ceil = Math.ceil;
  const abs = Math.abs;
  const imul = Math.imul;
  const round = Math.round;
  const log10 = Math.log10;
  const log2 = Math.log2;
  const log = Math.log;
  const sqrt = Math.sqrt;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The sum of a and b
   */
  const add$1 = (a, b) => a + b;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The smaller element of a and b
   */
  const min = (a, b) => a < b ? a : b;

  /**
   * @function
   * @param {number} a
   * @param {number} b
   * @return {number} The bigger element of a and b
   */
  const max = (a, b) => a > b ? a : b;

  const isNaN$1 = Number.isNaN;

  const pow = Math.pow;
  /**
   * Base 10 exponential function. Returns the value of 10 raised to the power of pow.
   *
   * @param {number} exp
   * @return {number}
   */
  const exp10 = exp => Math.pow(10, exp);

  const sign = Math.sign;

  /**
   * @param {number} n
   * @return {boolean} Wether n is negative. This function also differentiates between -0 and +0
   */
  const isNegativeZero = n => n !== 0 ? n < 0 : 1 / n < 0;

  var math = /*#__PURE__*/Object.freeze({
    __proto__: null,
    floor: floor,
    ceil: ceil,
    abs: abs,
    imul: imul,
    round: round,
    log10: log10,
    log2: log2,
    log: log,
    sqrt: sqrt,
    add: add$1,
    min: min,
    max: max,
    isNaN: isNaN$1,
    pow: pow,
    exp10: exp10,
    sign: sign,
    isNegativeZero: isNegativeZero
  });

  /**
   * Utility helpers for working with numbers.
   *
   * @module number
   */

  const MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER;
  const MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER;

  const LOWEST_INT32 = 1 << 31;
  /**
   * @type {number}
   */
  const HIGHEST_INT32 = BITS31;

  /**
   * @module number
   */

  /* istanbul ignore next */
  const isInteger = Number.isInteger || (num => typeof num === 'number' && isFinite(num) && floor(num) === num);
  const isNaN = Number.isNaN;
  const parseInt = Number.parseInt;

  var number = /*#__PURE__*/Object.freeze({
    __proto__: null,
    MAX_SAFE_INTEGER: MAX_SAFE_INTEGER,
    MIN_SAFE_INTEGER: MIN_SAFE_INTEGER,
    LOWEST_INT32: LOWEST_INT32,
    HIGHEST_INT32: HIGHEST_INT32,
    isInteger: isInteger,
    isNaN: isNaN,
    parseInt: parseInt
  });

  /**
   * Efficient schema-less binary encoding with support for variable length encoding.
   *
   * Use [lib0/encoding] with [lib0/decoding]. Every encoding function has a corresponding decoding function.
   *
   * Encodes numbers in little-endian order (least to most significant byte order)
   * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
   * which is also used in Protocol Buffers.
   *
   * ```js
   * // encoding step
   * const encoder = new encoding.createEncoder()
   * encoding.writeVarUint(encoder, 256)
   * encoding.writeVarString(encoder, 'Hello world!')
   * const buf = encoding.toUint8Array(encoder)
   * ```
   *
   * ```js
   * // decoding step
   * const decoder = new decoding.createDecoder(buf)
   * decoding.readVarUint(decoder) // => 256
   * decoding.readVarString(decoder) // => 'Hello world!'
   * decoding.hasContent(decoder) // => false - all data is read
   * ```
   *
   * @module encoding
   */

  /**
   * A BinaryEncoder handles the encoding to an Uint8Array.
   */
  class Encoder {
    constructor () {
      this.cpos = 0;
      this.cbuf = new Uint8Array(100);
      /**
       * @type {Array<Uint8Array>}
       */
      this.bufs = [];
    }
  }

  /**
   * @function
   * @return {Encoder}
   */
  const createEncoder = () => new Encoder();

  /**
   * The current length of the encoded data.
   *
   * @function
   * @param {Encoder} encoder
   * @return {number}
   */
  const length$1 = encoder => {
    let len = encoder.cpos;
    for (let i = 0; i < encoder.bufs.length; i++) {
      len += encoder.bufs[i].length;
    }
    return len
  };

  /**
   * Transform to Uint8Array.
   *
   * @function
   * @param {Encoder} encoder
   * @return {Uint8Array} The created ArrayBuffer.
   */
  const toUint8Array = encoder => {
    const uint8arr = new Uint8Array(length$1(encoder));
    let curPos = 0;
    for (let i = 0; i < encoder.bufs.length; i++) {
      const d = encoder.bufs[i];
      uint8arr.set(d, curPos);
      curPos += d.length;
    }
    uint8arr.set(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos), curPos);
    return uint8arr
  };

  /**
   * Verify that it is possible to write `len` bytes wtihout checking. If
   * necessary, a new Buffer with the required length is attached.
   *
   * @param {Encoder} encoder
   * @param {number} len
   */
  const verifyLen = (encoder, len) => {
    const bufferLen = encoder.cbuf.length;
    if (bufferLen - encoder.cpos < len) {
      encoder.bufs.push(createUint8ArrayViewFromArrayBuffer(encoder.cbuf.buffer, 0, encoder.cpos));
      encoder.cbuf = new Uint8Array(max(bufferLen, len) * 2);
      encoder.cpos = 0;
    }
  };

  /**
   * Write one byte to the encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The byte that is to be encoded.
   */
  const write = (encoder, num) => {
    const bufferLen = encoder.cbuf.length;
    if (encoder.cpos === bufferLen) {
      encoder.bufs.push(encoder.cbuf);
      encoder.cbuf = new Uint8Array(bufferLen * 2);
      encoder.cpos = 0;
    }
    encoder.cbuf[encoder.cpos++] = num;
  };

  /**
   * Write one byte at a specific position.
   * Position must already be written (i.e. encoder.length > pos)
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} pos Position to which to write data
   * @param {number} num Unsigned 8-bit integer
   */
  const set$1 = (encoder, pos, num) => {
    let buffer = null;
    // iterate all buffers and adjust position
    for (let i = 0; i < encoder.bufs.length && buffer === null; i++) {
      const b = encoder.bufs[i];
      if (pos < b.length) {
        buffer = b; // found buffer
      } else {
        pos -= b.length;
      }
    }
    if (buffer === null) {
      // use current buffer
      buffer = encoder.cbuf;
    }
    buffer[pos] = num;
  };

  /**
   * Write one byte as an unsigned integer.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeUint8 = write;

  /**
   * Write one byte as an unsigned Integer at a specific location.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} pos The location where the data will be written.
   * @param {number} num The number that is to be encoded.
   */
  const setUint8 = set$1;

  /**
   * Write two bytes as an unsigned integer.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeUint16 = (encoder, num) => {
    write(encoder, num & BITS8);
    write(encoder, (num >>> 8) & BITS8);
  };
  /**
   * Write two bytes as an unsigned integer at a specific location.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} pos The location where the data will be written.
   * @param {number} num The number that is to be encoded.
   */
  const setUint16 = (encoder, pos, num) => {
    set$1(encoder, pos, num & BITS8);
    set$1(encoder, pos + 1, (num >>> 8) & BITS8);
  };

  /**
   * Write two bytes as an unsigned integer
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeUint32 = (encoder, num) => {
    for (let i = 0; i < 4; i++) {
      write(encoder, num & BITS8);
      num >>>= 8;
    }
  };

  /**
   * Write two bytes as an unsigned integer in big endian order.
   * (most significant byte first)
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeUint32BigEndian = (encoder, num) => {
    for (let i = 3; i >= 0; i--) {
      write(encoder, (num >>> (8 * i)) & BITS8);
    }
  };

  /**
   * Write two bytes as an unsigned integer at a specific location.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} pos The location where the data will be written.
   * @param {number} num The number that is to be encoded.
   */
  const setUint32 = (encoder, pos, num) => {
    for (let i = 0; i < 4; i++) {
      set$1(encoder, pos + i, num & BITS8);
      num >>>= 8;
    }
  };

  /**
   * Write a variable length unsigned integer.
   *
   * Encodes integers in the range from [0, 4294967295] / [0, 0xffffffff]. (max 32 bit unsigned integer)
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeVarUint = (encoder, num) => {
    while (num > BITS7) {
      write(encoder, BIT8 | (BITS7 & num));
      num >>>= 7;
    }
    write(encoder, BITS7 & num);
  };

  /**
   * Write a variable length integer.
   *
   * Encodes integers in the range from [-2147483648, -2147483647].
   *
   * We don't use zig-zag encoding because we want to keep the option open
   * to use the same function for BigInt and 53bit integers (doubles).
   *
   * We use the 7th bit instead for signaling that this is a negative number.
   *
   * @function
   * @param {Encoder} encoder
   * @param {number} num The number that is to be encoded.
   */
  const writeVarInt = (encoder, num) => {
    const isNegative = isNegativeZero(num);
    if (isNegative) {
      num = -num;
    }
    //             |- whether to continue reading         |- whether is negative     |- number
    write(encoder, (num > BITS6 ? BIT8 : 0) | (isNegative ? BIT7 : 0) | (BITS6 & num));
    num >>>= 6;
    // We don't need to consider the case of num === 0 so we can use a different
    // pattern here than above.
    while (num > 0) {
      write(encoder, (num > BITS7 ? BIT8 : 0) | (BITS7 & num));
      num >>>= 7;
    }
  };

  /**
   * Write a variable length string.
   *
   * @function
   * @param {Encoder} encoder
   * @param {String} str The string that is to be encoded.
   */
  const writeVarString = (encoder, str) => {
    const encodedString = unescape(encodeURIComponent(str));
    const len = encodedString.length;
    writeVarUint(encoder, len);
    for (let i = 0; i < len; i++) {
      write(encoder, /** @type {number} */ (encodedString.codePointAt(i)));
    }
  };

  /**
   * Write the content of another Encoder.
   *
   * @TODO: can be improved!
   *        - Note: Should consider that when appending a lot of small Encoders, we should rather clone than referencing the old structure.
   *                Encoders start with a rather big initial buffer.
   *
   * @function
   * @param {Encoder} encoder The enUint8Arr
   * @param {Encoder} append The BinaryEncoder to be written.
   */
  const writeBinaryEncoder = (encoder, append) => writeUint8Array(encoder, toUint8Array(append));

  /**
   * Append fixed-length Uint8Array to the encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {Uint8Array} uint8Array
   */
  const writeUint8Array = (encoder, uint8Array) => {
    const bufferLen = encoder.cbuf.length;
    const cpos = encoder.cpos;
    const leftCopyLen = min(bufferLen - cpos, uint8Array.length);
    const rightCopyLen = uint8Array.length - leftCopyLen;
    encoder.cbuf.set(uint8Array.subarray(0, leftCopyLen), cpos);
    encoder.cpos += leftCopyLen;
    if (rightCopyLen > 0) {
      // Still something to write, write right half..
      // Append new buffer
      encoder.bufs.push(encoder.cbuf);
      // must have at least size of remaining buffer
      encoder.cbuf = new Uint8Array(max(bufferLen * 2, rightCopyLen));
      // copy array
      encoder.cbuf.set(uint8Array.subarray(leftCopyLen));
      encoder.cpos = rightCopyLen;
    }
  };

  /**
   * Append an Uint8Array to Encoder.
   *
   * @function
   * @param {Encoder} encoder
   * @param {Uint8Array} uint8Array
   */
  const writeVarUint8Array = (encoder, uint8Array) => {
    writeVarUint(encoder, uint8Array.byteLength);
    writeUint8Array(encoder, uint8Array);
  };

  /**
   * Create an DataView of the next `len` bytes. Use it to write data after
   * calling this function.
   *
   * ```js
   * // write float32 using DataView
   * const dv = writeOnDataView(encoder, 4)
   * dv.setFloat32(0, 1.1)
   * // read float32 using DataView
   * const dv = readFromDataView(encoder, 4)
   * dv.getFloat32(0) // => 1.100000023841858 (leaving it to the reader to find out why this is the correct result)
   * ```
   *
   * @param {Encoder} encoder
   * @param {number} len
   * @return {DataView}
   */
  const writeOnDataView = (encoder, len) => {
    verifyLen(encoder, len);
    const dview = new DataView(encoder.cbuf.buffer, encoder.cpos, len);
    encoder.cpos += len;
    return dview
  };

  /**
   * @param {Encoder} encoder
   * @param {number} num
   */
  const writeFloat32 = (encoder, num) => writeOnDataView(encoder, 4).setFloat32(0, num, false);

  /**
   * @param {Encoder} encoder
   * @param {number} num
   */
  const writeFloat64 = (encoder, num) => writeOnDataView(encoder, 8).setFloat64(0, num, false);

  /**
   * @param {Encoder} encoder
   * @param {bigint} num
   */
  const writeBigInt64 = (encoder, num) => /** @type {any} */ (writeOnDataView(encoder, 8)).setBigInt64(0, num, false);

  /**
   * @param {Encoder} encoder
   * @param {bigint} num
   */
  const writeBigUint64 = (encoder, num) => /** @type {any} */ (writeOnDataView(encoder, 8)).setBigUint64(0, num, false);

  const floatTestBed = new DataView(new ArrayBuffer(4));
  /**
   * Check if a number can be encoded as a 32 bit float.
   *
   * @param {number} num
   * @return {boolean}
   */
  const isFloat32 = num => {
    floatTestBed.setFloat32(0, num);
    return floatTestBed.getFloat32(0) === num
  };

  /**
   * Encode data with efficient binary format.
   *
   * Differences to JSON:
   * • Transforms data to a binary format (not to a string)
   * • Encodes undefined, NaN, and ArrayBuffer (these can't be represented in JSON)
   * • Numbers are efficiently encoded either as a variable length integer, as a
   *   32 bit float, as a 64 bit float, or as a 64 bit bigint.
   *
   * Encoding table:
   *
   * | Data Type           | Prefix   | Encoding Method    | Comment |
   * | ------------------- | -------- | ------------------ | ------- |
   * | undefined           | 127      |                    | Functions, symbol, and everything that cannot be identified is encoded as undefined |
   * | null                | 126      |                    | |
   * | integer             | 125      | writeVarInt        | Only encodes 32 bit signed integers |
   * | float32             | 124      | writeFloat32       | |
   * | float64             | 123      | writeFloat64       | |
   * | bigint              | 122      | writeBigInt64      | |
   * | boolean (false)     | 121      |                    | True and false are different data types so we save the following byte |
   * | boolean (true)      | 120      |                    | - 0b01111000 so the last bit determines whether true or false |
   * | string              | 119      | writeVarString     | |
   * | object<string,any>  | 118      | custom             | Writes {length} then {length} key-value pairs |
   * | array<any>          | 117      | custom             | Writes {length} then {length} json values |
   * | Uint8Array          | 116      | writeVarUint8Array | We use Uint8Array for any kind of binary data |
   *
   * Reasons for the decreasing prefix:
   * We need the first bit for extendability (later we may want to encode the
   * prefix with writeVarUint). The remaining 7 bits are divided as follows:
   * [0-30]   the beginning of the data range is used for custom purposes
   *          (defined by the function that uses this library)
   * [31-127] the end of the data range is used for data encoding by
   *          lib0/encoding.js
   *
   * @param {Encoder} encoder
   * @param {undefined|null|number|bigint|boolean|string|Object<string,any>|Array<any>|Uint8Array} data
   */
  const writeAny = (encoder, data) => {
    switch (typeof data) {
      case 'string':
        // TYPE 119: STRING
        write(encoder, 119);
        writeVarString(encoder, data);
        break
      case 'number':
        if (isInteger(data) && data <= BITS31) {
          // TYPE 125: INTEGER
          write(encoder, 125);
          writeVarInt(encoder, data);
        } else if (isFloat32(data)) {
          // TYPE 124: FLOAT32
          write(encoder, 124);
          writeFloat32(encoder, data);
        } else {
          // TYPE 123: FLOAT64
          write(encoder, 123);
          writeFloat64(encoder, data);
        }
        break
      case 'bigint':
        // TYPE 122: BigInt
        write(encoder, 122);
        writeBigInt64(encoder, data);
        break
      case 'object':
        if (data === null) {
          // TYPE 126: null
          write(encoder, 126);
        } else if (data instanceof Array) {
          // TYPE 117: Array
          write(encoder, 117);
          writeVarUint(encoder, data.length);
          for (let i = 0; i < data.length; i++) {
            writeAny(encoder, data[i]);
          }
        } else if (data instanceof Uint8Array) {
          // TYPE 116: ArrayBuffer
          write(encoder, 116);
          writeVarUint8Array(encoder, data);
        } else {
          // TYPE 118: Object
          write(encoder, 118);
          const keys = Object.keys(data);
          writeVarUint(encoder, keys.length);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            writeVarString(encoder, key);
            writeAny(encoder, data[key]);
          }
        }
        break
      case 'boolean':
        // TYPE 120/121: boolean (true/false)
        write(encoder, data ? 120 : 121);
        break
      default:
        // TYPE 127: undefined
        write(encoder, 127);
    }
  };

  /**
   * Now come a few stateful encoder that have their own classes.
   */

  /**
   * Basic Run Length Encoder - a basic compression implementation.
   *
   * Encodes [1,1,1,7] to [1,3,7,1] (3 times 1, 1 time 7). This encoder might do more harm than good if there are a lot of values that are not repeated.
   *
   * It was originally used for image compression. Cool .. article http://csbruce.com/cbm/transactor/pdfs/trans_v7_i06.pdf
   *
   * @note T must not be null!
   *
   * @template T
   */
  class RleEncoder extends Encoder {
    /**
     * @param {function(Encoder, T):void} writer
     */
    constructor (writer) {
      super();
      /**
       * The writer
       */
      this.w = writer;
      /**
       * Current state
       * @type {T|null}
       */
      this.s = null;
      this.count = 0;
    }

    /**
     * @param {T} v
     */
    write (v) {
      if (this.s === v) {
        this.count++;
      } else {
        if (this.count > 0) {
          // flush counter, unless this is the first value (count = 0)
          writeVarUint(this, this.count - 1); // since count is always > 0, we can decrement by one. non-standard encoding ftw
        }
        this.count = 1;
        // write first value
        this.w(this, v);
        this.s = v;
      }
    }
  }

  /**
   * Basic diff decoder using variable length encoding.
   *
   * Encodes the values [3, 1100, 1101, 1050, 0] to [3, 1097, 1, -51, -1050] using writeVarInt.
   */
  class IntDiffEncoder extends Encoder {
    /**
     * @param {number} start
     */
    constructor (start) {
      super();
      /**
       * Current state
       * @type {number}
       */
      this.s = start;
    }

    /**
     * @param {number} v
     */
    write (v) {
      writeVarInt(this, v - this.s);
      this.s = v;
    }
  }

  /**
   * A combination of IntDiffEncoder and RleEncoder.
   *
   * Basically first writes the IntDiffEncoder and then counts duplicate diffs using RleEncoding.
   *
   * Encodes the values [1,1,1,2,3,4,5,6] as [1,1,0,2,1,5] (RLE([1,0,0,1,1,1,1,1]) ⇒ RleIntDiff[1,1,0,2,1,5])
   */
  class RleIntDiffEncoder extends Encoder {
    /**
     * @param {number} start
     */
    constructor (start) {
      super();
      /**
       * Current state
       * @type {number}
       */
      this.s = start;
      this.count = 0;
    }

    /**
     * @param {number} v
     */
    write (v) {
      if (this.s === v && this.count > 0) {
        this.count++;
      } else {
        if (this.count > 0) {
          // flush counter, unless this is the first value (count = 0)
          writeVarUint(this, this.count - 1); // since count is always > 0, we can decrement by one. non-standard encoding ftw
        }
        this.count = 1;
        // write first value
        writeVarInt(this, v - this.s);
        this.s = v;
      }
    }
  }

  /**
   * @param {UintOptRleEncoder} encoder
   */
  const flushUintOptRleEncoder = encoder => {
    /* istanbul ignore else */
    if (encoder.count > 0) {
      // flush counter, unless this is the first value (count = 0)
      // case 1: just a single value. set sign to positive
      // case 2: write several values. set sign to negative to indicate that there is a length coming
      writeVarInt(encoder.encoder, encoder.count === 1 ? encoder.s : -encoder.s);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
      }
    }
  };

  /**
   * Optimized Rle encoder that does not suffer from the mentioned problem of the basic Rle encoder.
   *
   * Internally uses VarInt encoder to write unsigned integers. If the input occurs multiple times, we write
   * write it as a negative number. The UintOptRleDecoder then understands that it needs to read a count.
   *
   * Encodes [1,2,3,3,3] as [1,2,-3,3] (once 1, once 2, three times 3)
   */
  class UintOptRleEncoder {
    constructor () {
      this.encoder = new Encoder();
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
    }

    /**
     * @param {number} v
     */
    write (v) {
      if (this.s === v) {
        this.count++;
      } else {
        flushUintOptRleEncoder(this);
        this.count = 1;
        this.s = v;
      }
    }

    toUint8Array () {
      flushUintOptRleEncoder(this);
      return toUint8Array(this.encoder)
    }
  }

  /**
   * Increasing Uint Optimized RLE Encoder
   *
   * The RLE encoder counts the number of same occurences of the same value.
   * The IncUintOptRle encoder counts if the value increases.
   * I.e. 7, 8, 9, 10 will be encoded as [-7, 4]. 1, 3, 5 will be encoded
   * as [1, 3, 5].
   */
  class IncUintOptRleEncoder {
    constructor () {
      this.encoder = new Encoder();
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
    }

    /**
     * @param {number} v
     */
    write (v) {
      if (this.s + this.count === v) {
        this.count++;
      } else {
        flushUintOptRleEncoder(this);
        this.count = 1;
        this.s = v;
      }
    }

    toUint8Array () {
      flushUintOptRleEncoder(this);
      return toUint8Array(this.encoder)
    }
  }

  /**
   * @param {IntDiffOptRleEncoder} encoder
   */
  const flushIntDiffOptRleEncoder = encoder => {
    if (encoder.count > 0) {
      //          31 bit making up the diff | wether to write the counter
      const encodedDiff = encoder.diff << 1 | (encoder.count === 1 ? 0 : 1);
      // flush counter, unless this is the first value (count = 0)
      // case 1: just a single value. set first bit to positive
      // case 2: write several values. set first bit to negative to indicate that there is a length coming
      writeVarInt(encoder.encoder, encodedDiff);
      if (encoder.count > 1) {
        writeVarUint(encoder.encoder, encoder.count - 2); // since count is always > 1, we can decrement by one. non-standard encoding ftw
      }
    }
  };

  /**
   * A combination of the IntDiffEncoder and the UintOptRleEncoder.
   *
   * The count approach is similar to the UintDiffOptRleEncoder, but instead of using the negative bitflag, it encodes
   * in the LSB whether a count is to be read. Therefore this Encoder only supports 31 bit integers!
   *
   * Encodes [1, 2, 3, 2] as [3, 1, 6, -1] (more specifically [(1 << 1) | 1, (3 << 0) | 0, -1])
   *
   * Internally uses variable length encoding. Contrary to normal UintVar encoding, the first byte contains:
   * * 1 bit that denotes whether the next value is a count (LSB)
   * * 1 bit that denotes whether this value is negative (MSB - 1)
   * * 1 bit that denotes whether to continue reading the variable length integer (MSB)
   *
   * Therefore, only five bits remain to encode diff ranges.
   *
   * Use this Encoder only when appropriate. In most cases, this is probably a bad idea.
   */
  class IntDiffOptRleEncoder {
    constructor () {
      this.encoder = new Encoder();
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }

    /**
     * @param {number} v
     */
    write (v) {
      if (this.diff === v - this.s) {
        this.s = v;
        this.count++;
      } else {
        flushIntDiffOptRleEncoder(this);
        this.count = 1;
        this.diff = v - this.s;
        this.s = v;
      }
    }

    toUint8Array () {
      flushIntDiffOptRleEncoder(this);
      return toUint8Array(this.encoder)
    }
  }

  /**
   * Optimized String Encoder.
   *
   * Encoding many small strings in a simple Encoder is not very efficient. The function call to decode a string takes some time and creates references that must be eventually deleted.
   * In practice, when decoding several million small strings, the GC will kick in more and more often to collect orphaned string objects (or maybe there is another reason?).
   *
   * This string encoder solves the above problem. All strings are concatenated and written as a single string using a single encoding call.
   *
   * The lengths are encoded using a UintOptRleEncoder.
   */
  class StringEncoder {
    constructor () {
      /**
       * @type {Array<string>}
       */
      this.sarr = [];
      this.s = '';
      this.lensE = new UintOptRleEncoder();
    }

    /**
     * @param {string} string
     */
    write (string) {
      this.s += string;
      if (this.s.length > 19) {
        this.sarr.push(this.s);
        this.s = '';
      }
      this.lensE.write(string.length);
    }

    toUint8Array () {
      const encoder = new Encoder();
      this.sarr.push(this.s);
      this.s = '';
      writeVarString(encoder, this.sarr.join(''));
      writeUint8Array(encoder, this.lensE.toUint8Array());
      return toUint8Array(encoder)
    }
  }

  var encoding = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Encoder: Encoder,
    createEncoder: createEncoder,
    length: length$1,
    toUint8Array: toUint8Array,
    write: write,
    set: set$1,
    writeUint8: writeUint8,
    setUint8: setUint8,
    writeUint16: writeUint16,
    setUint16: setUint16,
    writeUint32: writeUint32,
    writeUint32BigEndian: writeUint32BigEndian,
    setUint32: setUint32,
    writeVarUint: writeVarUint,
    writeVarInt: writeVarInt,
    writeVarString: writeVarString,
    writeBinaryEncoder: writeBinaryEncoder,
    writeUint8Array: writeUint8Array,
    writeVarUint8Array: writeVarUint8Array,
    writeOnDataView: writeOnDataView,
    writeFloat32: writeFloat32,
    writeFloat64: writeFloat64,
    writeBigInt64: writeBigInt64,
    writeBigUint64: writeBigUint64,
    writeAny: writeAny,
    RleEncoder: RleEncoder,
    IntDiffEncoder: IntDiffEncoder,
    RleIntDiffEncoder: RleIntDiffEncoder,
    UintOptRleEncoder: UintOptRleEncoder,
    IncUintOptRleEncoder: IncUintOptRleEncoder,
    IntDiffOptRleEncoder: IntDiffOptRleEncoder,
    StringEncoder: StringEncoder
  });

  /**
   * Efficient schema-less binary decoding with support for variable length encoding.
   *
   * Use [lib0/decoding] with [lib0/encoding]. Every encoding function has a corresponding decoding function.
   *
   * Encodes numbers in little-endian order (least to most significant byte order)
   * and is compatible with Golang's binary encoding (https://golang.org/pkg/encoding/binary/)
   * which is also used in Protocol Buffers.
   *
   * ```js
   * // encoding step
   * const encoder = new encoding.createEncoder()
   * encoding.writeVarUint(encoder, 256)
   * encoding.writeVarString(encoder, 'Hello world!')
   * const buf = encoding.toUint8Array(encoder)
   * ```
   *
   * ```js
   * // decoding step
   * const decoder = new decoding.createDecoder(buf)
   * decoding.readVarUint(decoder) // => 256
   * decoding.readVarString(decoder) // => 'Hello world!'
   * decoding.hasContent(decoder) // => false - all data is read
   * ```
   *
   * @module decoding
   */

  /**
   * A Decoder handles the decoding of an Uint8Array.
   */
  class Decoder {
    /**
     * @param {Uint8Array} uint8Array Binary data to decode
     */
    constructor (uint8Array) {
      /**
       * Decoding target.
       *
       * @type {Uint8Array}
       */
      this.arr = uint8Array;
      /**
       * Current decoding position.
       *
       * @type {number}
       */
      this.pos = 0;
    }
  }

  /**
   * @function
   * @param {Uint8Array} uint8Array
   * @return {Decoder}
   */
  const createDecoder = uint8Array => new Decoder(uint8Array);

  /**
   * @function
   * @param {Decoder} decoder
   * @return {boolean}
   */
  const hasContent = decoder => decoder.pos !== decoder.arr.length;

  /**
   * Clone a decoder instance.
   * Optionally set a new position parameter.
   *
   * @function
   * @param {Decoder} decoder The decoder instance
   * @param {number} [newPos] Defaults to current position
   * @return {Decoder} A clone of `decoder`
   */
  const clone = (decoder, newPos = decoder.pos) => {
    const _decoder = createDecoder(decoder.arr);
    _decoder.pos = newPos;
    return _decoder
  };

  /**
   * Create an Uint8Array view of the next `len` bytes and advance the position by `len`.
   *
   * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
   *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
   *
   * @function
   * @param {Decoder} decoder The decoder instance
   * @param {number} len The length of bytes to read
   * @return {Uint8Array}
   */
  const readUint8Array = (decoder, len) => {
    const view = createUint8ArrayViewFromArrayBuffer(decoder.arr.buffer, decoder.pos + decoder.arr.byteOffset, len);
    decoder.pos += len;
    return view
  };

  /**
   * Read variable length Uint8Array.
   *
   * Important: The Uint8Array still points to the underlying ArrayBuffer. Make sure to discard the result as soon as possible to prevent any memory leaks.
   *            Use `buffer.copyUint8Array` to copy the result into a new Uint8Array.
   *
   * @function
   * @param {Decoder} decoder
   * @return {Uint8Array}
   */
  const readVarUint8Array = decoder => readUint8Array(decoder, readVarUint(decoder));

  /**
   * Read the rest of the content as an ArrayBuffer
   * @function
   * @param {Decoder} decoder
   * @return {Uint8Array}
   */
  const readTailAsUint8Array = decoder => readUint8Array(decoder, decoder.arr.length - decoder.pos);

  /**
   * Skip one byte, jump to the next position.
   * @function
   * @param {Decoder} decoder The decoder instance
   * @return {number} The next position
   */
  const skip8 = decoder => decoder.pos++;

  /**
   * Read one byte as unsigned integer.
   * @function
   * @param {Decoder} decoder The decoder instance
   * @return {number} Unsigned 8-bit integer
   */
  const readUint8 = decoder => decoder.arr[decoder.pos++];

  /**
   * Read 2 bytes as unsigned integer.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const readUint16 = decoder => {
    const uint =
      decoder.arr[decoder.pos] +
      (decoder.arr[decoder.pos + 1] << 8);
    decoder.pos += 2;
    return uint
  };

  /**
   * Read 4 bytes as unsigned integer.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const readUint32 = decoder => {
    const uint =
      (decoder.arr[decoder.pos] +
      (decoder.arr[decoder.pos + 1] << 8) +
      (decoder.arr[decoder.pos + 2] << 16) +
      (decoder.arr[decoder.pos + 3] << 24)) >>> 0;
    decoder.pos += 4;
    return uint
  };

  /**
   * Read 4 bytes as unsigned integer in big endian order.
   * (most significant byte first)
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const readUint32BigEndian = decoder => {
    const uint =
      (decoder.arr[decoder.pos + 3] +
      (decoder.arr[decoder.pos + 2] << 8) +
      (decoder.arr[decoder.pos + 1] << 16) +
      (decoder.arr[decoder.pos] << 24)) >>> 0;
    decoder.pos += 4;
    return uint
  };

  /**
   * Look ahead without incrementing the position
   * to the next byte and read it as unsigned integer.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const peekUint8 = decoder => decoder.arr[decoder.pos];

  /**
   * Look ahead without incrementing the position
   * to the next byte and read it as unsigned integer.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const peekUint16 = decoder =>
    decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8);

  /**
   * Look ahead without incrementing the position
   * to the next byte and read it as unsigned integer.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.
   */
  const peekUint32 = decoder => (
    decoder.arr[decoder.pos] +
    (decoder.arr[decoder.pos + 1] << 8) +
    (decoder.arr[decoder.pos + 2] << 16) +
    (decoder.arr[decoder.pos + 3] << 24)
  ) >>> 0;

  /**
   * Read unsigned integer (32bit) with variable length.
   * 1/8th of the storage is used as encoding overhead.
   *  * numbers < 2^7 is stored in one bytlength
   *  * numbers < 2^14 is stored in two bylength
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.length
   */
  const readVarUint = decoder => {
    let num = 0;
    let len = 0;
    while (true) {
      const r = decoder.arr[decoder.pos++];
      num = num | ((r & BITS7) << len);
      len += 7;
      if (r < BIT8) {
        return num >>> 0 // return unsigned number!
      }
      /* istanbul ignore if */
      if (len > 35) {
        throw new Error('Integer out of range!')
      }
    }
  };

  /**
   * Read signed integer (32bit) with variable length.
   * 1/8th of the storage is used as encoding overhead.
   *  * numbers < 2^7 is stored in one bytlength
   *  * numbers < 2^14 is stored in two bylength
   * @todo This should probably create the inverse ~num if number is negative - but this would be a breaking change.
   *
   * @function
   * @param {Decoder} decoder
   * @return {number} An unsigned integer.length
   */
  const readVarInt = decoder => {
    let r = decoder.arr[decoder.pos++];
    let num = r & BITS6;
    let len = 6;
    const sign = (r & BIT7) > 0 ? -1 : 1;
    if ((r & BIT8) === 0) {
      // don't continue reading
      return sign * num
    }
    while (true) {
      r = decoder.arr[decoder.pos++];
      num = num | ((r & BITS7) << len);
      len += 7;
      if (r < BIT8) {
        return sign * (num >>> 0)
      }
      /* istanbul ignore if */
      if (len > 41) {
        throw new Error('Integer out of range!')
      }
    }
  };

  /**
   * Look ahead and read varUint without incrementing position
   *
   * @function
   * @param {Decoder} decoder
   * @return {number}
   */
  const peekVarUint = decoder => {
    const pos = decoder.pos;
    const s = readVarUint(decoder);
    decoder.pos = pos;
    return s
  };

  /**
   * Look ahead and read varUint without incrementing position
   *
   * @function
   * @param {Decoder} decoder
   * @return {number}
   */
  const peekVarInt = decoder => {
    const pos = decoder.pos;
    const s = readVarInt(decoder);
    decoder.pos = pos;
    return s
  };

  /**
   * Read string of variable length
   * * varUint is used to store the length of the string
   *
   * Transforming utf8 to a string is pretty expensive. The code performs 10x better
   * when String.fromCodePoint is fed with all characters as arguments.
   * But most environments have a maximum number of arguments per functions.
   * For effiency reasons we apply a maximum of 10000 characters at once.
   *
   * @function
   * @param {Decoder} decoder
   * @return {String} The read String.
   */
  const readVarString = decoder => {
    let remainingLen = readVarUint(decoder);
    if (remainingLen === 0) {
      return ''
    } else {
      let encodedString = String.fromCodePoint(readUint8(decoder)); // remember to decrease remainingLen
      if (--remainingLen < 100) { // do not create a Uint8Array for small strings
        while (remainingLen--) {
          encodedString += String.fromCodePoint(readUint8(decoder));
        }
      } else {
        while (remainingLen > 0) {
          const nextLen = remainingLen < 10000 ? remainingLen : 10000;
          // this is dangerous, we create a fresh array view from the existing buffer
          const bytes = decoder.arr.subarray(decoder.pos, decoder.pos + nextLen);
          decoder.pos += nextLen;
          // Starting with ES5.1 we can supply a generic array-like object as arguments
          encodedString += String.fromCodePoint.apply(null, /** @type {any} */ (bytes));
          remainingLen -= nextLen;
        }
      }
      return decodeURIComponent(escape(encodedString))
    }
  };

  /**
   * Look ahead and read varString without incrementing position
   *
   * @function
   * @param {Decoder} decoder
   * @return {string}
   */
  const peekVarString = decoder => {
    const pos = decoder.pos;
    const s = readVarString(decoder);
    decoder.pos = pos;
    return s
  };

  /**
   * @param {Decoder} decoder
   * @param {number} len
   * @return {DataView}
   */
  const readFromDataView = (decoder, len) => {
    const dv = new DataView(decoder.arr.buffer, decoder.arr.byteOffset + decoder.pos, len);
    decoder.pos += len;
    return dv
  };

  /**
   * @param {Decoder} decoder
   */
  const readFloat32 = decoder => readFromDataView(decoder, 4).getFloat32(0, false);

  /**
   * @param {Decoder} decoder
   */
  const readFloat64 = decoder => readFromDataView(decoder, 8).getFloat64(0, false);

  /**
   * @param {Decoder} decoder
   */
  const readBigInt64 = decoder => /** @type {any} */ (readFromDataView(decoder, 8)).getBigInt64(0, false);

  /**
   * @param {Decoder} decoder
   */
  const readBigUint64 = decoder => /** @type {any} */ (readFromDataView(decoder, 8)).getBigUint64(0, false);

  /**
   * @type {Array<function(Decoder):any>}
   */
  const readAnyLookupTable = [
    decoder => undefined, // CASE 127: undefined
    decoder => null, // CASE 126: null
    readVarInt, // CASE 125: integer
    readFloat32, // CASE 124: float32
    readFloat64, // CASE 123: float64
    readBigInt64, // CASE 122: bigint
    decoder => false, // CASE 121: boolean (false)
    decoder => true, // CASE 120: boolean (true)
    readVarString, // CASE 119: string
    decoder => { // CASE 118: object<string,any>
      const len = readVarUint(decoder);
      /**
       * @type {Object<string,any>}
       */
      const obj = {};
      for (let i = 0; i < len; i++) {
        const key = readVarString(decoder);
        obj[key] = readAny(decoder);
      }
      return obj
    },
    decoder => { // CASE 117: array<any>
      const len = readVarUint(decoder);
      const arr = [];
      for (let i = 0; i < len; i++) {
        arr.push(readAny(decoder));
      }
      return arr
    },
    readVarUint8Array // CASE 116: Uint8Array
  ];

  /**
   * @param {Decoder} decoder
   */
  const readAny = decoder => readAnyLookupTable[127 - readUint8(decoder)](decoder);

  /**
   * T must not be null.
   *
   * @template T
   */
  class RleDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     * @param {function(Decoder):T} reader
     */
    constructor (uint8Array, reader) {
      super(uint8Array);
      /**
       * The reader
       */
      this.reader = reader;
      /**
       * Current state
       * @type {T|null}
       */
      this.s = null;
      this.count = 0;
    }

    read () {
      if (this.count === 0) {
        this.s = this.reader(this);
        if (hasContent(this)) {
          this.count = readVarUint(this) + 1; // see encoder implementation for the reason why this is incremented
        } else {
          this.count = -1; // read the current value forever
        }
      }
      this.count--;
      return /** @type {T} */ (this.s)
    }
  }

  class IntDiffDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     * @param {number} start
     */
    constructor (uint8Array, start) {
      super(uint8Array);
      /**
       * Current state
       * @type {number}
       */
      this.s = start;
    }

    /**
     * @return {number}
     */
    read () {
      this.s += readVarInt(this);
      return this.s
    }
  }

  class RleIntDiffDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     * @param {number} start
     */
    constructor (uint8Array, start) {
      super(uint8Array);
      /**
       * Current state
       * @type {number}
       */
      this.s = start;
      this.count = 0;
    }

    /**
     * @return {number}
     */
    read () {
      if (this.count === 0) {
        this.s += readVarInt(this);
        if (hasContent(this)) {
          this.count = readVarUint(this) + 1; // see encoder implementation for the reason why this is incremented
        } else {
          this.count = -1; // read the current value forever
        }
      }
      this.count--;
      return /** @type {number} */ (this.s)
    }
  }

  class UintOptRleDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor (uint8Array) {
      super(uint8Array);
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
    }

    read () {
      if (this.count === 0) {
        this.s = readVarInt(this);
        // if the sign is negative, we read the count too, otherwise count is 1
        const isNegative = isNegativeZero(this.s);
        this.count = 1;
        if (isNegative) {
          this.s = -this.s;
          this.count = readVarUint(this) + 2;
        }
      }
      this.count--;
      return /** @type {number} */ (this.s)
    }
  }

  class IncUintOptRleDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor (uint8Array) {
      super(uint8Array);
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
    }

    read () {
      if (this.count === 0) {
        this.s = readVarInt(this);
        // if the sign is negative, we read the count too, otherwise count is 1
        const isNegative = isNegativeZero(this.s);
        this.count = 1;
        if (isNegative) {
          this.s = -this.s;
          this.count = readVarUint(this) + 2;
        }
      }
      this.count--;
      return /** @type {number} */ (this.s++)
    }
  }

  class IntDiffOptRleDecoder extends Decoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor (uint8Array) {
      super(uint8Array);
      /**
       * @type {number}
       */
      this.s = 0;
      this.count = 0;
      this.diff = 0;
    }

    /**
     * @return {number}
     */
    read () {
      if (this.count === 0) {
        const diff = readVarInt(this);
        // if the first bit is set, we read more data
        const hasCount = diff & 1;
        this.diff = diff >> 1;
        this.count = 1;
        if (hasCount) {
          this.count = readVarUint(this) + 2;
        }
      }
      this.s += this.diff;
      this.count--;
      return this.s
    }
  }

  class StringDecoder {
    /**
     * @param {Uint8Array} uint8Array
     */
    constructor (uint8Array) {
      this.decoder = new UintOptRleDecoder(uint8Array);
      this.str = readVarString(this.decoder);
      /**
       * @type {number}
       */
      this.spos = 0;
    }

    /**
     * @return {string}
     */
    read () {
      const end = this.spos + this.decoder.read();
      const res = this.str.slice(this.spos, end);
      this.spos = end;
      return res
    }
  }

  var decoding = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Decoder: Decoder,
    createDecoder: createDecoder,
    hasContent: hasContent,
    clone: clone,
    readUint8Array: readUint8Array,
    readVarUint8Array: readVarUint8Array,
    readTailAsUint8Array: readTailAsUint8Array,
    skip8: skip8,
    readUint8: readUint8,
    readUint16: readUint16,
    readUint32: readUint32,
    readUint32BigEndian: readUint32BigEndian,
    peekUint8: peekUint8,
    peekUint16: peekUint16,
    peekUint32: peekUint32,
    readVarUint: readVarUint,
    readVarInt: readVarInt,
    peekVarUint: peekVarUint,
    peekVarInt: peekVarInt,
    readVarString: readVarString,
    peekVarString: peekVarString,
    readFromDataView: readFromDataView,
    readFloat32: readFloat32,
    readFloat64: readFloat64,
    readBigInt64: readBigInt64,
    readBigUint64: readBigUint64,
    readAny: readAny,
    RleDecoder: RleDecoder,
    IntDiffDecoder: IntDiffDecoder,
    RleIntDiffDecoder: RleIntDiffDecoder,
    UintOptRleDecoder: UintOptRleDecoder,
    IncUintOptRleDecoder: IncUintOptRleDecoder,
    IntDiffOptRleDecoder: IntDiffOptRleDecoder,
    StringDecoder: StringDecoder
  });

  /**
   * Utility functions to work with buffers (Uint8Array).
   *
   * @module buffer
   */

  /**
   * @param {number} len
   */
  const createUint8ArrayFromLen = len => new Uint8Array(len);

  /**
   * Create Uint8Array with initial content from buffer
   *
   * @param {ArrayBuffer} buffer
   * @param {number} byteOffset
   * @param {number} length
   */
  const createUint8ArrayViewFromArrayBuffer = (buffer, byteOffset, length) => new Uint8Array(buffer, byteOffset, length);

  /**
   * Create Uint8Array with initial content from buffer
   *
   * @param {ArrayBuffer} buffer
   */
  const createUint8ArrayFromArrayBuffer = buffer => new Uint8Array(buffer);

  /* istanbul ignore next */
  /**
   * @param {Uint8Array} bytes
   * @return {string}
   */
  const toBase64Browser = bytes => {
    let s = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      s += fromCharCode(bytes[i]);
    }
    // eslint-disable-next-line no-undef
    return btoa(s)
  };

  /**
   * @param {Uint8Array} bytes
   * @return {string}
   */
  const toBase64Node = bytes => Buffer.from(bytes.buffer, bytes.byteOffset, bytes.byteLength).toString('base64');

  /* istanbul ignore next */
  /**
   * @param {string} s
   * @return {Uint8Array}
   */
  const fromBase64Browser = s => {
    // eslint-disable-next-line no-undef
    const a = atob(s);
    const bytes = createUint8ArrayFromLen(a.length);
    for (let i = 0; i < a.length; i++) {
      bytes[i] = a.charCodeAt(i);
    }
    return bytes
  };

  /**
   * @param {string} s
   */
  const fromBase64Node = s => {
    const buf = Buffer.from(s, 'base64');
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength)
  };

  /* istanbul ignore next */
  const toBase64 = isBrowser ? toBase64Browser : toBase64Node;

  /* istanbul ignore next */
  const fromBase64 = isBrowser ? fromBase64Browser : fromBase64Node;

  /**
   * Copy the content of an Uint8Array view to a new ArrayBuffer.
   *
   * @param {Uint8Array} uint8Array
   * @return {Uint8Array}
   */
  const copyUint8Array = uint8Array => {
    const newBuf = createUint8ArrayFromLen(uint8Array.byteLength);
    newBuf.set(uint8Array);
    return newBuf
  };

  /**
   * Encode anything as a UInt8Array. It's a pun on typescripts's `any` type.
   * See encoding.writeAny for more information.
   *
   * @param {any} data
   * @return {Uint8Array}
   */
  const encodeAny = data => {
    const encoder = createEncoder();
    writeAny(encoder, data);
    return toUint8Array(encoder)
  };

  /**
   * Decode an any-encoded value.
   *
   * @param {Uint8Array} buf
   * @return {any}
   */
  const decodeAny = buf => readAny(createDecoder(buf));

  var buffer = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createUint8ArrayFromLen: createUint8ArrayFromLen,
    createUint8ArrayViewFromArrayBuffer: createUint8ArrayViewFromArrayBuffer,
    createUint8ArrayFromArrayBuffer: createUint8ArrayFromArrayBuffer,
    toBase64: toBase64,
    fromBase64: fromBase64,
    copyUint8Array: copyUint8Array,
    encodeAny: encodeAny,
    decodeAny: decodeAny
  });

  /* eslint-env browser */

  /**
   * @typedef {Object} Channel
   * @property {Set<Function>} Channel.subs
   * @property {any} Channel.bc
   */

  /**
   * @type {Map<string, Channel>}
   */
  const channels = new Map();

  class LocalStoragePolyfill {
    /**
     * @param {string} room
     */
    constructor (room) {
      this.room = room;
      /**
       * @type {null|function({data:ArrayBuffer}):void}
       */
      this.onmessage = null;
      onChange(e => e.key === room && this.onmessage !== null && this.onmessage({ data: fromBase64(e.newValue || '') }));
    }

    /**
     * @param {ArrayBuffer} buf
     */
    postMessage (buf) {
      varStorage.setItem(this.room, toBase64(createUint8ArrayFromArrayBuffer(buf)));
    }
  }

  // Use BroadcastChannel or Polyfill
  const BC = typeof BroadcastChannel === 'undefined' ? LocalStoragePolyfill : BroadcastChannel;

  /**
   * @param {string} room
   * @return {Channel}
   */
  const getChannel = room =>
    setIfUndefined(channels, room, () => {
      const subs = new Set();
      const bc = new BC(room);
      /**
       * @param {{data:ArrayBuffer}} e
       */
      bc.onmessage = e => subs.forEach(sub => sub(e.data));
      return {
        bc, subs
      }
    });

  /**
   * Subscribe to global `publish` events.
   *
   * @function
   * @param {string} room
   * @param {function(any):any} f
   */
  const subscribe = (room, f) => getChannel(room).subs.add(f);

  /**
   * Unsubscribe from `publish` global events.
   *
   * @function
   * @param {string} room
   * @param {function(any):any} f
   */
  const unsubscribe = (room, f) => getChannel(room).subs.delete(f);

  /**
   * Publish data to all subscribers (including subscribers on this tab)
   *
   * @function
   * @param {string} room
   * @param {any} data
   */
  const publish = (room, data) => {
    const c = getChannel(room);
    c.bc.postMessage(data);
    c.subs.forEach(sub => sub(data));
  };

  var broadcastchannel = /*#__PURE__*/Object.freeze({
    __proto__: null,
    subscribe: subscribe,
    unsubscribe: unsubscribe,
    publish: publish
  });

  /**
   * Utility functions for working with EcmaScript objects.
   *
   * @module object
   */

  /**
   * @return {Object<string,any>} obj
   */
  const create$6 = () => Object.create(null);

  /**
   * Object.assign
   */
  const assign = Object.assign;

  /**
   * @param {Object<string,any>} obj
   */
  const keys = Object.keys;

  /**
   * @param {Object<string,any>} obj
   * @param {function(any,string):any} f
   */
  const forEach$1 = (obj, f) => {
    for (const key in obj) {
      f(obj[key], key);
    }
  };

  /**
   * @template R
   * @param {Object<string,any>} obj
   * @param {function(any,string):R} f
   * @return {Array<R>}
   */
  const map$1 = (obj, f) => {
    const results = [];
    for (const key in obj) {
      results.push(f(obj[key], key));
    }
    return results
  };

  /**
   * @param {Object<string,any>} obj
   * @return {number}
   */
  const length = obj => keys(obj).length;

  /**
   * @param {Object<string,any>} obj
   * @param {function(any,string):boolean} f
   * @return {boolean}
   */
  const some = (obj, f) => {
    for (const key in obj) {
      if (f(obj[key], key)) {
        return true
      }
    }
    return false
  };

  /**
   * @param {Object<string,any>} obj
   * @param {function(any,string):boolean} f
   * @return {boolean}
   */
  const every = (obj, f) => {
    for (const key in obj) {
      if (!f(obj[key], key)) {
        return false
      }
    }
    return true
  };

  /**
   * Calls `Object.prototype.hasOwnProperty`.
   *
   * @param {any} obj
   * @param {string|symbol} key
   * @return {boolean}
   */
  const hasProperty = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

  /**
   * @param {Object<string,any>} a
   * @param {Object<string,any>} b
   * @return {boolean}
   */
  const equalFlat = (a, b) => a === b || (length(a) === length(b) && every(a, (val, key) => (val !== undefined || hasProperty(b, key)) && b[key] === val));

  var object = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$6,
    assign: assign,
    keys: keys,
    forEach: forEach$1,
    map: map$1,
    length: length,
    some: some,
    every: every,
    hasProperty: hasProperty,
    equalFlat: equalFlat
  });

  /**
   * Common functions and function call helpers.
   *
   * @module function
   */

  /**
   * Calls all functions in `fs` with args. Only throws after all functions were called.
   *
   * @param {Array<function>} fs
   * @param {Array<any>} args
   */
  const callAll = (fs, args, i = 0) => {
    try {
      for (; i < fs.length; i++) {
        fs[i](...args);
      }
    } finally {
      if (i < fs.length) {
        callAll(fs, args, i + 1);
      }
    }
  };

  const nop = () => {};

  /**
   * @template T
   * @param {function():T} f
   * @return {T}
   */
  const apply = f => f();

  /**
   * @template A
   *
   * @param {A} a
   * @return {A}
   */
  const id = a => a;

  /**
   * @template T
   *
   * @param {T} a
   * @param {T} b
   * @return {boolean}
   */
  const equalityStrict = (a, b) => a === b;

  /**
   * @template T
   *
   * @param {Array<T>|object} a
   * @param {Array<T>|object} b
   * @return {boolean}
   */
  const equalityFlat = (a, b) => a === b || (a != null && b != null && a.constructor === b.constructor && ((a instanceof Array && equalFlat$1(a, /** @type {Array<T>} */ (b))) || (typeof a === 'object' && equalFlat(a, b))));

  /**
   * @param {any} a
   * @param {any} b
   * @return {boolean}
   */
  const equalityDeep = (a, b) => {
    if (a == null || b == null) {
      return equalityStrict(a, b)
    }
    if (a.constructor !== b.constructor) {
      return false
    }
    if (a === b) {
      return true
    }
    switch (a.constructor) {
      case ArrayBuffer:
        a = new Uint8Array(a);
        b = new Uint8Array(b);
      // eslint-disable-next-line no-fallthrough
      case Uint8Array: {
        if (a.byteLength !== b.byteLength) {
          return false
        }
        for (let i = 0; i < a.length; i++) {
          if (a[i] !== b[i]) {
            return false
          }
        }
        break
      }
      case Set: {
        if (a.size !== b.size) {
          return false
        }
        for (const value of a) {
          if (!b.has(value)) {
            return false
          }
        }
        break
      }
      case Map: {
        if (a.size !== b.size) {
          return false
        }
        for (const key of a.keys()) {
          if (!b.has(key) || !equalityDeep(a.get(key), b.get(key))) {
            return false
          }
        }
        break
      }
      case Object:
        if (length(a) !== length(b)) {
          return false
        }
        for (const key in a) {
          if (!hasProperty(a, key) || !equalityDeep(a[key], b[key])) {
            return false
          }
        }
        break
      case Array:
        if (a.length !== b.length) {
          return false
        }
        for (let i = 0; i < a.length; i++) {
          if (!equalityDeep(a[i], b[i])) {
            return false
          }
        }
        break
      default:
        return false
    }
    return true
  };

  var _function = /*#__PURE__*/Object.freeze({
    __proto__: null,
    callAll: callAll,
    nop: nop,
    apply: apply,
    id: id,
    equalityStrict: equalityStrict,
    equalityFlat: equalityFlat,
    equalityDeep: equalityDeep
  });

  /**
   * Efficient diffs.
   *
   * @module diff
   */

  /**
   * A SimpleDiff describes a change on a String.
   *
   * ```js
   * console.log(a) // the old value
   * console.log(b) // the updated value
   * // Apply changes of diff (pseudocode)
   * a.remove(diff.index, diff.remove) // Remove `diff.remove` characters
   * a.insert(diff.index, diff.insert) // Insert `diff.insert`
   * a === b // values match
   * ```
   *
   * @typedef {Object} SimpleDiff
   * @property {Number} index The index where changes were applied
   * @property {Number} remove The number of characters to delete starting
   *                                  at `index`.
   * @property {T} insert The new text to insert at `index` after applying
   *                           `delete`
   *
   * @template T
   */

  /**
   * Create a diff between two strings. This diff implementation is highly
   * efficient, but not very sophisticated.
   *
   * @function
   *
   * @param {string} a The old version of the string
   * @param {string} b The updated version of the string
   * @return {SimpleDiff<string>} The diff description.
   */
  const simpleDiffString = (a, b) => {
    let left = 0; // number of same characters counting from left
    let right = 0; // number of same characters counting from right
    while (left < a.length && left < b.length && a[left] === b[left]) {
      left++;
    }
    while (right + left < a.length && right + left < b.length && a[a.length - right - 1] === b[b.length - right - 1]) {
      right++;
    }
    return {
      index: left,
      remove: a.length - left - right,
      insert: b.slice(left, b.length - right)
    }
  };

  /**
   * @todo Remove in favor of simpleDiffString
   * @deprecated
   */
  const simpleDiff = simpleDiffString;

  /**
   * Create a diff between two arrays. This diff implementation is highly
   * efficient, but not very sophisticated.
   *
   * Note: This is basically the same function as above. Another function was created so that the runtime
   * can better optimize these function calls.
   *
   * @function
   * @template T
   *
   * @param {Array<T>} a The old version of the array
   * @param {Array<T>} b The updated version of the array
   * @param {function(T, T):boolean} [compare]
   * @return {SimpleDiff<Array<T>>} The diff description.
   */
  const simpleDiffArray = (a, b, compare = equalityStrict) => {
    let left = 0; // number of same characters counting from left
    let right = 0; // number of same characters counting from right
    while (left < a.length && left < b.length && compare(a[left], b[left])) {
      left++;
    }
    while (right + left < a.length && right + left < b.length && compare(a[a.length - right - 1], b[b.length - right - 1])) {
      right++;
    }
    return {
      index: left,
      remove: a.length - left - right,
      insert: b.slice(left, b.length - right)
    }
  };

  /**
   * Diff text and try to diff at the current cursor position.
   *
   * @param {string} a
   * @param {string} b
   * @param {number} cursor This should refer to the current left cursor-range position
   */
  const simpleDiffStringWithCursor = (a, b, cursor) => {
    let left = 0; // number of same characters counting from left
    let right = 0; // number of same characters counting from right
    // Iterate left to the right until we find a changed character
    // First iteration considers the current cursor position
    while (
      left < a.length &&
      left < b.length &&
      a[left] === b[left] &&
      left < cursor
    ) {
      left++;
    }
    // Iterate right to the left until we find a changed character
    while (
      right + left < a.length &&
      right + left < b.length &&
      a[a.length - right - 1] === b[b.length - right - 1]
    ) {
      right++;
    }
    // Try to iterate left further to the right without caring about the current cursor position
    while (
      right + left < a.length &&
      right + left < b.length &&
      a[left] === b[left]
    ) {
      left++;
    }
    return {
      index: left,
      remove: a.length - left - right,
      insert: b.slice(left, b.length - right)
    }
  };

  var diff = /*#__PURE__*/Object.freeze({
    __proto__: null,
    simpleDiffString: simpleDiffString,
    simpleDiff: simpleDiff,
    simpleDiffArray: simpleDiffArray,
    simpleDiffStringWithCursor: simpleDiffStringWithCursor
  });

  /**
   * Working with value pairs.
   *
   * @module pair
   */

  /**
   * @template L,R
   */
  class Pair {
    /**
     * @param {L} left
     * @param {R} right
     */
    constructor (left, right) {
      this.left = left;
      this.right = right;
    }
  }

  /**
   * @template L,R
   * @param {L} left
   * @param {R} right
   * @return {Pair<L,R>}
   */
  const create$5 = (left, right) => new Pair(left, right);

  /**
   * @template L,R
   * @param {R} right
   * @param {L} left
   * @return {Pair<L,R>}
   */
  const createReversed = (right, left) => new Pair(left, right);

  /**
   * @template L,R
   * @param {Array<Pair<L,R>>} arr
   * @param {function(L, R):any} f
   */
  const forEach = (arr, f) => arr.forEach(p => f(p.left, p.right));

  /**
   * @template L,R,X
   * @param {Array<Pair<L,R>>} arr
   * @param {function(L, R):X} f
   * @return {Array<X>}
   */
  const map = (arr, f) => arr.map(p => f(p.left, p.right));

  var pair = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Pair: Pair,
    create: create$5,
    createReversed: createReversed,
    forEach: forEach,
    map: map
  });

  /* eslint-env browser */

  /* istanbul ignore next */
  /**
   * @type {Document}
   */
  const doc = /** @type {Document} */ (typeof document !== 'undefined' ? document : {});

  /**
   * @param {string} name
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const createElement = name => doc.createElement(name);

  /**
   * @return {DocumentFragment}
   */
  /* istanbul ignore next */
  const createDocumentFragment = () => doc.createDocumentFragment();

  /**
   * @param {string} text
   * @return {Text}
   */
  /* istanbul ignore next */
  const createTextNode = text => doc.createTextNode(text);

  /* istanbul ignore next */
  const domParser = /** @type {DOMParser} */ (typeof DOMParser !== 'undefined' ? new DOMParser() : null);

  /**
   * @param {HTMLElement} el
   * @param {string} name
   * @param {Object} opts
   */
  /* istanbul ignore next */
  const emitCustomEvent = (el, name, opts) => el.dispatchEvent(new CustomEvent(name, opts));

  /**
   * @param {Element} el
   * @param {Array<pair.Pair<string,string|boolean>>} attrs Array of key-value pairs
   * @return {Element}
   */
  /* istanbul ignore next */
  const setAttributes = (el, attrs) => {
    forEach(attrs, (key, value) => {
      if (value === false) {
        el.removeAttribute(key);
      } else if (value === true) {
        el.setAttribute(key, '');
      } else {
        // @ts-ignore
        el.setAttribute(key, value);
      }
    });
    return el
  };

  /**
   * @param {Element} el
   * @param {Map<string, string>} attrs Array of key-value pairs
   * @return {Element}
   */
  /* istanbul ignore next */
  const setAttributesMap = (el, attrs) => {
    attrs.forEach((value, key) => { el.setAttribute(key, value); });
    return el
  };

  /**
   * @param {Array<Node>|HTMLCollection} children
   * @return {DocumentFragment}
   */
  /* istanbul ignore next */
  const fragment = children => {
    const fragment = createDocumentFragment();
    for (let i = 0; i < children.length; i++) {
      appendChild(fragment, children[i]);
    }
    return fragment
  };

  /**
   * @param {Element} parent
   * @param {Array<Node>} nodes
   * @return {Element}
   */
  /* istanbul ignore next */
  const append = (parent, nodes) => {
    appendChild(parent, fragment(nodes));
    return parent
  };

  /**
   * @param {HTMLElement} el
   */
  /* istanbul ignore next */
  const remove = el => el.remove();

  /**
   * @param {EventTarget} el
   * @param {string} name
   * @param {EventListener} f
   */
  /* istanbul ignore next */
  const addEventListener$1 = (el, name, f) => el.addEventListener(name, f);

  /**
   * @param {EventTarget} el
   * @param {string} name
   * @param {EventListener} f
   */
  /* istanbul ignore next */
  const removeEventListener = (el, name, f) => el.removeEventListener(name, f);

  /**
   * @param {Node} node
   * @param {Array<pair.Pair<string,EventListener>>} listeners
   * @return {Node}
   */
  /* istanbul ignore next */
  const addEventListeners = (node, listeners) => {
    forEach(listeners, (name, f) => addEventListener$1(node, name, f));
    return node
  };

  /**
   * @param {Node} node
   * @param {Array<pair.Pair<string,EventListener>>} listeners
   * @return {Node}
   */
  /* istanbul ignore next */
  const removeEventListeners = (node, listeners) => {
    forEach(listeners, (name, f) => removeEventListener(node, name, f));
    return node
  };

  /**
   * @param {string} name
   * @param {Array<pair.Pair<string,string>|pair.Pair<string,boolean>>} attrs Array of key-value pairs
   * @param {Array<Node>} children
   * @return {Element}
   */
  /* istanbul ignore next */
  const element = (name, attrs = [], children = []) =>
    append(setAttributes(createElement(name), attrs), children);

  /**
   * @param {number} width
   * @param {number} height
   */
  /* istanbul ignore next */
  const canvas = (width, height) => {
    const c = /** @type {HTMLCanvasElement} */ (createElement('canvas'));
    c.height = height;
    c.width = width;
    return c
  };

  /**
   * @param {string} t
   * @return {Text}
   */
  /* istanbul ignore next */
  const text = createTextNode;

  /**
   * @param {pair.Pair<string,string>} pair
   */
  /* istanbul ignore next */
  const pairToStyleString = pair => `${pair.left}:${pair.right};`;

  /**
   * @param {Array<pair.Pair<string,string>>} pairs
   * @return {string}
   */
  /* istanbul ignore next */
  const pairsToStyleString = pairs => pairs.map(pairToStyleString).join('');

  /**
   * @param {Map<string,string>} m
   * @return {string}
   */
  /* istanbul ignore next */
  const mapToStyleString = m => map$2(m, (value, key) => `${key}:${value};`).join('');

  /**
   * @todo should always query on a dom element
   *
   * @param {HTMLElement|ShadowRoot} el
   * @param {string} query
   * @return {HTMLElement | null}
   */
  /* istanbul ignore next */
  const querySelector = (el, query) => el.querySelector(query);

  /**
   * @param {HTMLElement|ShadowRoot} el
   * @param {string} query
   * @return {NodeListOf<HTMLElement>}
   */
  /* istanbul ignore next */
  const querySelectorAll = (el, query) => el.querySelectorAll(query);

  /**
   * @param {string} id
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const getElementById = id => /** @type {HTMLElement} */ (doc.getElementById(id));

  /**
   * @param {string} html
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const _parse = html => domParser.parseFromString(`<html><body>${html}</body></html>`, 'text/html').body;

  /**
   * @param {string} html
   * @return {DocumentFragment}
   */
  /* istanbul ignore next */
  const parseFragment = html => fragment(/** @type {any} */ (_parse(html).childNodes));

  /**
   * @param {string} html
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const parseElement = html => /** @type HTMLElement */ (_parse(html).firstElementChild);

  /**
   * @param {HTMLElement} oldEl
   * @param {HTMLElement|DocumentFragment} newEl
   */
  /* istanbul ignore next */
  const replaceWith = (oldEl, newEl) => oldEl.replaceWith(newEl);

  /**
   * @param {HTMLElement} parent
   * @param {HTMLElement} el
   * @param {Node|null} ref
   * @return {HTMLElement}
   */
  /* istanbul ignore next */
  const insertBefore = (parent, el, ref) => parent.insertBefore(el, ref);

  /**
   * @param {Node} parent
   * @param {Node} child
   * @return {Node}
   */
  /* istanbul ignore next */
  const appendChild = (parent, child) => parent.appendChild(child);

  const ELEMENT_NODE = doc.ELEMENT_NODE;
  const TEXT_NODE = doc.TEXT_NODE;
  const CDATA_SECTION_NODE = doc.CDATA_SECTION_NODE;
  const COMMENT_NODE = doc.COMMENT_NODE;
  const DOCUMENT_NODE = doc.DOCUMENT_NODE;
  const DOCUMENT_TYPE_NODE = doc.DOCUMENT_TYPE_NODE;
  const DOCUMENT_FRAGMENT_NODE = doc.DOCUMENT_FRAGMENT_NODE;

  /**
   * @param {any} node
   * @param {number} type
   */
  const checkNodeType = (node, type) => node.nodeType === type;

  /**
   * @param {Node} parent
   * @param {HTMLElement} child
   */
  const isParentOf = (parent, child) => {
    let p = child.parentNode;
    while (p && p !== parent) {
      p = p.parentNode;
    }
    return p === parent
  };

  var dom = /*#__PURE__*/Object.freeze({
    __proto__: null,
    doc: doc,
    createElement: createElement,
    createDocumentFragment: createDocumentFragment,
    createTextNode: createTextNode,
    domParser: domParser,
    emitCustomEvent: emitCustomEvent,
    setAttributes: setAttributes,
    setAttributesMap: setAttributesMap,
    fragment: fragment,
    append: append,
    remove: remove,
    addEventListener: addEventListener$1,
    removeEventListener: removeEventListener,
    addEventListeners: addEventListeners,
    removeEventListeners: removeEventListeners,
    element: element,
    canvas: canvas,
    text: text,
    pairToStyleString: pairToStyleString,
    pairsToStyleString: pairsToStyleString,
    mapToStyleString: mapToStyleString,
    querySelector: querySelector,
    querySelectorAll: querySelectorAll,
    getElementById: getElementById,
    parseFragment: parseFragment,
    parseElement: parseElement,
    replaceWith: replaceWith,
    insertBefore: insertBefore,
    appendChild: appendChild,
    ELEMENT_NODE: ELEMENT_NODE,
    TEXT_NODE: TEXT_NODE,
    CDATA_SECTION_NODE: CDATA_SECTION_NODE,
    COMMENT_NODE: COMMENT_NODE,
    DOCUMENT_NODE: DOCUMENT_NODE,
    DOCUMENT_TYPE_NODE: DOCUMENT_TYPE_NODE,
    DOCUMENT_FRAGMENT_NODE: DOCUMENT_FRAGMENT_NODE,
    checkNodeType: checkNodeType,
    isParentOf: isParentOf
  });

  /**
   * Error helpers.
   *
   * @module error
   */

  /* istanbul ignore next */
  /**
   * @param {string} s
   * @return {Error}
   */
  const create$4 = s => new Error(s);

  /* istanbul ignore next */
  /**
   * @throws {Error}
   * @return {never}
   */
  const methodUnimplemented = () => {
    throw create$4('Method unimplemented')
  };

  /* istanbul ignore next */
  /**
   * @throws {Error}
   * @return {never}
   */
  const unexpectedCase = () => {
    throw create$4('Unexpected case')
  };

  var error = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$4,
    methodUnimplemented: methodUnimplemented,
    unexpectedCase: unexpectedCase
  });

  /* global requestIdleCallback, requestAnimationFrame, cancelIdleCallback, cancelAnimationFrame */

  /**
   * Utility module to work with EcmaScript's event loop.
   *
   * @module eventloop
   */

  /**
   * @type {Array<function>}
   */
  let queue = [];

  const _runQueue = () => {
    for (let i = 0; i < queue.length; i++) {
      queue[i]();
    }
    queue = [];
  };

  /**
   * @param {function():void} f
   */
  const enqueue = f => {
    queue.push(f);
    if (queue.length === 1) {
      setTimeout(_runQueue, 0);
    }
  };

  /**
   * @typedef {Object} TimeoutObject
   * @property {function} TimeoutObject.destroy
   */

  /**
   * @param {function(number):void} clearFunction
   */
  const createTimeoutClass = clearFunction => class TT {
    /**
     * @param {number} timeoutId
     */
    constructor (timeoutId) {
      this._ = timeoutId;
    }

    destroy () {
      clearFunction(this._);
    }
  };

  const Timeout = createTimeoutClass(clearTimeout);

  /**
   * @param {number} timeout
   * @param {function} callback
   * @return {TimeoutObject}
   */
  const timeout = (timeout, callback) => new Timeout(setTimeout(callback, timeout));

  const Interval = createTimeoutClass(clearInterval);

  /**
   * @param {number} timeout
   * @param {function} callback
   * @return {TimeoutObject}
   */
  const interval = (timeout, callback) => new Interval(setInterval(callback, timeout));

  /* istanbul ignore next */
  const Animation = createTimeoutClass(arg => typeof requestAnimationFrame !== 'undefined' && cancelAnimationFrame(arg));

  /* istanbul ignore next */
  /**
   * @param {function(number):void} cb
   * @return {TimeoutObject}
   */
  const animationFrame = cb => typeof requestAnimationFrame === 'undefined' ? timeout(0, cb) : new Animation(requestAnimationFrame(cb));

  /* istanbul ignore next */
  // @ts-ignore
  const Idle = createTimeoutClass(arg => typeof cancelIdleCallback !== 'undefined' && cancelIdleCallback(arg));

  /* istanbul ignore next */
  /**
   * Note: this is experimental and is probably only useful in browsers.
   *
   * @param {function} cb
   * @return {TimeoutObject}
   */
  // @ts-ignore
  const idleCallback = cb => typeof requestIdleCallback !== 'undefined' ? new Idle(requestIdleCallback(cb)) : timeout(1000, cb);

  /**
   * @param {number} timeout Timeout of the debounce action
   * @return {function(function():void):void}
   */
  const createDebouncer = timeout => {
    let timer = -1;
    return f => {
      clearTimeout(timer);
      if (f) {
        timer = /** @type {any} */ (setTimeout(f, timeout));
      }
    }
  };

  var eventloop = /*#__PURE__*/Object.freeze({
    __proto__: null,
    enqueue: enqueue,
    timeout: timeout,
    interval: interval,
    Animation: Animation,
    animationFrame: animationFrame,
    idleCallback: idleCallback,
    createDebouncer: createDebouncer
  });

  /**
   * Utility module to convert metric values.
   *
   * @module metric
   */

  const prefixUp = ['', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'];
  const prefixDown = ['', 'm', 'μ', 'n', 'p', 'f', 'a', 'z', 'y'];

  /**
   * Calculate the metric prefix for a number. Assumes E.g. `prefix(1000) = { n: 1, prefix: 'k' }`
   *
   * @param {number} n
   * @param {number} [baseMultiplier] Multiplier of the base (10^(3*baseMultiplier)). E.g. `convert(time, -3)` if time is already in milli seconds
   * @return {{n:number,prefix:string}}
   */
  const prefix = (n, baseMultiplier = 0) => {
    const nPow = n === 0 ? 0 : log10(n);
    let mult = 0;
    while (nPow < mult * 3 && baseMultiplier > -8) {
      baseMultiplier--;
      mult--;
    }
    while (nPow >= 3 + mult * 3 && baseMultiplier < 8) {
      baseMultiplier++;
      mult++;
    }
    const prefix = baseMultiplier < 0 ? prefixDown[-baseMultiplier] : prefixUp[baseMultiplier];
    return {
      n: round((mult > 0 ? n / exp10(mult * 3) : n * exp10(mult * -3)) * 1e12) / 1e12,
      prefix
    }
  };

  /**
   * Utility module to work with time.
   *
   * @module time
   */

  /**
   * Return current time.
   *
   * @return {Date}
   */
  const getDate = () => new Date();

  /**
   * Return current unix time.
   *
   * @return {number}
   */
  const getUnixTime = Date.now;

  /**
   * Transform time (in ms) to a human readable format. E.g. 1100 => 1.1s. 60s => 1min. .001 => 10μs.
   *
   * @param {number} d duration in milliseconds
   * @return {string} humanized approximation of time
   */
  const humanizeDuration = d => {
    if (d < 60000) {
      const p = prefix(d, -1);
      return round(p.n * 100) / 100 + p.prefix + 's'
    }
    d = floor(d / 1000);
    const seconds = d % 60;
    const minutes = floor(d / 60) % 60;
    const hours = floor(d / 3600) % 24;
    const days = floor(d / 86400);
    if (days > 0) {
      return days + 'd' + ((hours > 0 || minutes > 30) ? ' ' + (minutes > 30 ? hours + 1 : hours) + 'h' : '')
    }
    if (hours > 0) {
      /* istanbul ignore next */
      return hours + 'h' + ((minutes > 0 || seconds > 30) ? ' ' + (seconds > 30 ? minutes + 1 : minutes) + 'min' : '')
    }
    return minutes + 'min' + (seconds > 0 ? ' ' + seconds + 's' : '')
  };

  var time = /*#__PURE__*/Object.freeze({
    __proto__: null,
    getDate: getDate,
    getUnixTime: getUnixTime,
    humanizeDuration: humanizeDuration
  });

  /**
   * Utility helpers to work with promises.
   *
   * @module promise
   */

  /**
   * @template T
   * @callback PromiseResolve
   * @param {T|PromiseLike<T>} [result]
   */

  /**
   * @template T
   * @param {function(PromiseResolve<T>,function(Error):void):any} f
   * @return {Promise<T>}
   */
  const create$3 = f => /** @type {Promise<T>} */ (new Promise(f));

  /**
   * @param {function(function():void,function(Error):void):void} f
   * @return {Promise<void>}
   */
  const createEmpty = f => new Promise(f);

  /**
   * `Promise.all` wait for all promises in the array to resolve and return the result
   * @template T
   * @param {Array<Promise<T>>} arrp
   * @return {Promise<Array<T>>}
   */
  const all = arrp => Promise.all(arrp);

  /**
   * @param {Error} [reason]
   * @return {Promise<never>}
   */
  const reject = reason => Promise.reject(reason);

  /**
   * @template T
   * @param {T|void} res
   * @return {Promise<T|void>}
   */
  const resolve = res => Promise.resolve(res);

  /**
   * @template T
   * @param {T} res
   * @return {Promise<T>}
   */
  const resolveWith = res => Promise.resolve(res);

  /**
   * @todo Next version, reorder parameters: check, [timeout, [intervalResolution]]
   *
   * @param {number} timeout
   * @param {function():boolean} check
   * @param {number} [intervalResolution]
   * @return {Promise<void>}
   */
  const until = (timeout, check, intervalResolution = 10) => create$3((resolve, reject) => {
    const startTime = getUnixTime();
    const hasTimeout = timeout > 0;
    const untilInterval = () => {
      if (check()) {
        clearInterval(intervalHandle);
        resolve();
      } else if (hasTimeout) {
        /* istanbul ignore else */
        if (getUnixTime() - startTime > timeout) {
          clearInterval(intervalHandle);
          reject(new Error('Timeout'));
        }
      }
    };
    const intervalHandle = setInterval(untilInterval, intervalResolution);
  });

  /**
   * @param {number} timeout
   * @return {Promise<undefined>}
   */
  const wait = timeout => create$3((resolve, reject) => setTimeout(resolve, timeout));

  /**
   * Checks if an object is a promise using ducktyping.
   *
   * Promises are often polyfilled, so it makes sense to add some additional guarantees if the user of this
   * library has some insane environment where global Promise objects are overwritten.
   *
   * @param {any} p
   * @return {boolean}
   */
  const isPromise = p => p instanceof Promise || (p && p.then && p.catch && p.finally);

  var promise = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$3,
    createEmpty: createEmpty,
    all: all,
    reject: reject,
    resolve: resolve,
    resolveWith: resolveWith,
    until: until,
    wait: wait,
    isPromise: isPromise
  });

  /* eslint-env browser */

  /* istanbul ignore next */
  /**
   * IDB Request to Promise transformer
   *
   * @param {IDBRequest} request
   * @return {Promise<any>}
   */
  const rtop = request => create$3((resolve, reject) => {
    /* istanbul ignore next */
    // @ts-ignore
    request.onerror = event => reject(new Error(event.target.error));
    /* istanbul ignore next */
    // @ts-ignore
    request.onblocked = () => location.reload();
    // @ts-ignore
    request.onsuccess = event => resolve(event.target.result);
  });

  /* istanbul ignore next */
  /**
   * @param {string} name
   * @param {function(IDBDatabase):any} initDB Called when the database is first created
   * @return {Promise<IDBDatabase>}
   */
  const openDB = (name, initDB) => create$3((resolve, reject) => {
    const request = indexedDB.open(name);
    /**
     * @param {any} event
     */
    request.onupgradeneeded = event => initDB(event.target.result);
    /* istanbul ignore next */
    /**
     * @param {any} event
     */
    request.onerror = event => reject(create$4(event.target.error));
    /* istanbul ignore next */
    request.onblocked = () => location.reload();
    /**
     * @param {any} event
     */
    request.onsuccess = event => {
      /**
       * @type {IDBDatabase}
       */
      const db = event.target.result;
      /* istanbul ignore next */
      db.onversionchange = () => { db.close(); };
      /* istanbul ignore if */
      if (typeof addEventListener !== 'undefined') {
        addEventListener('unload', () => db.close());
      }
      resolve(db);
    };
  });

  /* istanbul ignore next */
  /**
   * @param {string} name
   */
  const deleteDB = name => rtop(indexedDB.deleteDatabase(name));

  /* istanbul ignore next */
  /**
   * @param {IDBDatabase} db
   * @param {Array<Array<string>|Array<string|IDBObjectStoreParameters|undefined>>} definitions
   */
  const createStores = (db, definitions) => definitions.forEach(d =>
    // @ts-ignore
    db.createObjectStore.apply(db, d)
  );

  /**
   * @param {IDBDatabase} db
   * @param {Array<string>} stores
   * @param {"readwrite"|"readonly"} [access]
   * @return {Array<IDBObjectStore>}
   */
  const transact = (db, stores, access = 'readwrite') => {
    const transaction = db.transaction(stores, access);
    return stores.map(store => getStore(transaction, store))
  };

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange} [range]
   * @return {Promise<number>}
   */
  const count = (store, range) =>
    rtop(store.count(range));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {String | number | ArrayBuffer | Date | Array<any> } key
   * @return {Promise<String | number | ArrayBuffer | Date | Array<any>>}
   */
  const get = (store, key) =>
    rtop(store.get(key));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {String | number | ArrayBuffer | Date | IDBKeyRange | Array<any> } key
   */
  const del = (store, key) =>
    rtop(store.delete(key));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {String | number | ArrayBuffer | Date | boolean} item
   * @param {String | number | ArrayBuffer | Date | Array<any>} [key]
   */
  const put = (store, item, key) =>
    rtop(store.put(item, key));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {String | number | ArrayBuffer | Date | boolean}  item
   * @param {String | number | ArrayBuffer | Date | Array<any>}  key
   * @return {Promise<any>}
   */
  const add = (store, item, key) =>
    rtop(store.add(item, key));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {String | number | ArrayBuffer | Date}  item
   * @return {Promise<number>} Returns the generated key
   */
  const addAutoKey = (store, item) =>
    rtop(store.add(item));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange} [range]
   * @return {Promise<Array<any>>}
   */
  const getAll = (store, range) =>
    rtop(store.getAll(range));

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange} [range]
   * @return {Promise<Array<any>>}
   */
  const getAllKeys = (store, range) =>
    rtop(store.getAllKeys(range));

  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange|null} query
   * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
   * @return {Promise<any>}
   */
  const queryFirst = (store, query, direction) => {
    /**
     * @type {any}
     */
    let first = null;
    return iterateKeys(store, query, key => {
      first = key;
      return false
    }, direction).then(() => first)
  };

  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange?} [range]
   * @return {Promise<any>}
   */
  const getLastKey = (store, range = null) => queryFirst(store, range, 'prev');

  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange?} [range]
   * @return {Promise<any>}
   */
  const getFirstKey = (store, range = null) => queryFirst(store, range, 'next');

  /**
   * @typedef KeyValuePair
   * @type {Object}
   * @property {any} k key
   * @property {any} v Value
   */

  /* istanbul ignore next */
  /**
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange} [range]
   * @return {Promise<Array<KeyValuePair>>}
   */
  const getAllKeysValues = (store, range) =>
    // @ts-ignore
    all([getAllKeys(store, range), getAll(store, range)]).then(([ks, vs]) => ks.map((k, i) => ({ k, v: vs[i] })));

  /* istanbul ignore next */
  /**
   * @param {any} request
   * @param {function(IDBCursorWithValue):void|boolean} f
   * @return {Promise<void>}
   */
  const iterateOnRequest = (request, f) => create$3((resolve, reject) => {
    /* istanbul ignore next */
    request.onerror = reject;
    /**
     * @param {any} event
     */
    request.onsuccess = event => {
      const cursor = event.target.result;
      if (cursor === null || f(cursor) === false) {
        return resolve()
      }
      cursor.continue();
    };
  });

  /* istanbul ignore next */
  /**
   * Iterate on keys and values
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange|null} keyrange
   * @param {function(any,any):void|boolean} f Callback that receives (value, key)
   * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
   */
  const iterate = (store, keyrange, f, direction = 'next') =>
    iterateOnRequest(store.openCursor(keyrange, direction), cursor => f(cursor.value, cursor.key));

  /* istanbul ignore next */
  /**
   * Iterate on the keys (no values)
   *
   * @param {IDBObjectStore} store
   * @param {IDBKeyRange|null} keyrange
   * @param {function(any):void|boolean} f callback that receives the key
   * @param {'next'|'prev'|'nextunique'|'prevunique'} direction
   */
  const iterateKeys = (store, keyrange, f, direction = 'next') =>
    iterateOnRequest(store.openKeyCursor(keyrange, direction), cursor => f(cursor.key));

  /* istanbul ignore next */
  /**
   * Open store from transaction
   * @param {IDBTransaction} t
   * @param {String} store
   * @returns {IDBObjectStore}
   */
  const getStore = (t, store) => t.objectStore(store);

  /* istanbul ignore next */
  /**
   * @param {any} lower
   * @param {any} upper
   * @param {boolean} lowerOpen
   * @param {boolean} upperOpen
   */
  const createIDBKeyRangeBound = (lower, upper, lowerOpen, upperOpen) => IDBKeyRange.bound(lower, upper, lowerOpen, upperOpen);

  /* istanbul ignore next */
  /**
   * @param {any} upper
   * @param {boolean} upperOpen
   */
  const createIDBKeyRangeUpperBound = (upper, upperOpen) => IDBKeyRange.upperBound(upper, upperOpen);

  /* istanbul ignore next */
  /**
   * @param {any} lower
   * @param {boolean} lowerOpen
   */
  const createIDBKeyRangeLowerBound = (lower, lowerOpen) => IDBKeyRange.lowerBound(lower, lowerOpen);

  var indexeddb = /*#__PURE__*/Object.freeze({
    __proto__: null,
    rtop: rtop,
    openDB: openDB,
    deleteDB: deleteDB,
    createStores: createStores,
    transact: transact,
    count: count,
    get: get,
    del: del,
    put: put,
    add: add,
    addAutoKey: addAutoKey,
    getAll: getAll,
    getAllKeys: getAllKeys,
    queryFirst: queryFirst,
    getLastKey: getLastKey,
    getFirstKey: getFirstKey,
    getAllKeysValues: getAllKeysValues,
    iterate: iterate,
    iterateKeys: iterateKeys,
    getStore: getStore,
    createIDBKeyRangeBound: createIDBKeyRangeBound,
    createIDBKeyRangeUpperBound: createIDBKeyRangeUpperBound,
    createIDBKeyRangeLowerBound: createIDBKeyRangeLowerBound
  });

  /**
   * Utility module to create and manipulate Iterators.
   *
   * @module iterator
   */

  /**
   * @template T,R
   * @param {Iterator<T>} iterator
   * @param {function(T):R} f
   * @return {IterableIterator<R>}
   */
  const mapIterator = (iterator, f) => ({
    /**
     * @param {function(T):R} f
     */
    [Symbol.iterator] () {
      return this
    },
    // @ts-ignore
    next () {
      const r = iterator.next();
      return { value: r.done ? undefined : f(r.value), done: r.done }
    }
  });

  /**
   * @template T
   * @param {function():IteratorResult<T>} next
   * @return {IterableIterator<T>}
   */
  const createIterator = next => ({
    /**
     * @return {IterableIterator<T>}
     */
    [Symbol.iterator] () {
      return this
    },
    // @ts-ignore
    next
  });

  /**
   * @template T
   * @param {Iterator<T>} iterator
   * @param {function(T):boolean} filter
   */
  const iteratorFilter = (iterator, filter) => createIterator(() => {
    let res;
    do {
      res = iterator.next();
    } while (!res.done && !filter(res.value))
    return res
  });

  /**
   * @template T,M
   * @param {Iterator<T>} iterator
   * @param {function(T):M} fmap
   */
  const iteratorMap = (iterator, fmap) => createIterator(() => {
    const { done, value } = iterator.next();
    return { done, value: done ? undefined : fmap(value) }
  });

  var iterator = /*#__PURE__*/Object.freeze({
    __proto__: null,
    mapIterator: mapIterator,
    createIterator: createIterator,
    iteratorFilter: iteratorFilter,
    iteratorMap: iteratorMap
  });

  /**
   * JSON utility functions.
   *
   * @module json
   */

  /**
   * Transform JavaScript object to JSON.
   *
   * @param {any} object
   * @return {string}
   */
  const stringify = JSON.stringify;

  /**
   * Parse JSON object.
   *
   * @param {string} json
   * @return {any}
   */
  const parse = JSON.parse;

  var json = /*#__PURE__*/Object.freeze({
    __proto__: null,
    stringify: stringify,
    parse: parse
  });

  /**
   * Utility module to work with EcmaScript Symbols.
   *
   * @module symbol
   */

  /**
   * Return fresh symbol.
   *
   * @return {Symbol}
   */
  const create$2 = Symbol;

  /**
   * @param {any} s
   * @return {boolean}
   */
  const isSymbol = s => typeof s === 'symbol';

  var symbol = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create$2,
    isSymbol: isSymbol
  });

  /**
   * Isomorphic logging module with support for colors!
   *
   * @module logging
   */

  const BOLD = create$2();
  const UNBOLD = create$2();
  const BLUE = create$2();
  const GREY = create$2();
  const GREEN = create$2();
  const RED = create$2();
  const PURPLE = create$2();
  const ORANGE = create$2();
  const UNCOLOR = create$2();

  /**
   * @type {Object<Symbol,pair.Pair<string,string>>}
   */
  const _browserStyleMap = {
    [BOLD]: create$5('font-weight', 'bold'),
    [UNBOLD]: create$5('font-weight', 'normal'),
    [BLUE]: create$5('color', 'blue'),
    [GREEN]: create$5('color', 'green'),
    [GREY]: create$5('color', 'grey'),
    [RED]: create$5('color', 'red'),
    [PURPLE]: create$5('color', 'purple'),
    [ORANGE]: create$5('color', 'orange'), // not well supported in chrome when debugging node with inspector - TODO: deprecate
    [UNCOLOR]: create$5('color', 'black')
  };

  const _nodeStyleMap = {
    [BOLD]: '\u001b[1m',
    [UNBOLD]: '\u001b[2m',
    [BLUE]: '\x1b[34m',
    [GREEN]: '\x1b[32m',
    [GREY]: '\u001b[37m',
    [RED]: '\x1b[31m',
    [PURPLE]: '\x1b[35m',
    [ORANGE]: '\x1b[38;5;208m',
    [UNCOLOR]: '\x1b[0m'
  };

  /* istanbul ignore next */
  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<string|object|number>}
   */
  const computeBrowserLoggingArgs = args => {
    const strBuilder = [];
    const styles = [];
    const currentStyle = create$7();
    /**
     * @type {Array<string|Object|number>}
     */
    let logArgs = [];
    // try with formatting until we find something unsupported
    let i = 0;

    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _browserStyleMap[arg];
      if (style !== undefined) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          const style = mapToStyleString(currentStyle);
          if (i > 0 || style.length > 0) {
            strBuilder.push('%c' + arg);
            styles.push(style);
          } else {
            strBuilder.push(arg);
          }
        } else {
          break
        }
      }
    }

    if (i > 0) {
      // create logArgs with what we have so far
      logArgs = styles;
      logArgs.unshift(strBuilder.join(''));
    }
    // append the rest
    for (; i < args.length; i++) {
      const arg = args[i];
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs
  };

  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<string|object|number>}
   */
  const computeNodeLoggingArgs = args => {
    const strBuilder = [];
    const logArgs = [];

    // try with formatting until we find something unsupported
    let i = 0;

    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _nodeStyleMap[arg];
      if (style !== undefined) {
        strBuilder.push(style);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          strBuilder.push(arg);
        } else {
          break
        }
      }
    }
    if (i > 0) {
      // create logArgs with what we have so far
      strBuilder.push('\x1b[0m');
      logArgs.push(strBuilder.join(''));
    }
    // append the rest
    for (; i < args.length; i++) {
      const arg = args[i];
      /* istanbul ignore else */
      if (!(arg instanceof Symbol)) {
        logArgs.push(arg);
      }
    }
    return logArgs
  };

  /* istanbul ignore next */
  const computeLoggingArgs = isNode ? computeNodeLoggingArgs : computeBrowserLoggingArgs;

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const print = (...args) => {
    console.log(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.print(args));
  };

  /* istanbul ignore next */
  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const warn = (...args) => {
    console.warn(...computeLoggingArgs(args));
    args.unshift(ORANGE);
    vconsoles.forEach(vc => vc.print(args));
  };

  /* istanbul ignore next */
  /**
   * @param {Error} err
   */
  const printError = err => {
    console.error(err);
    vconsoles.forEach(vc => vc.printError(err));
  };

  /* istanbul ignore next */
  /**
   * @param {string} url image location
   * @param {number} height height of the image in pixel
   */
  const printImg = (url, height) => {
    if (isBrowser) {
      console.log('%c                      ', `font-size: ${height}px; background-size: contain; background-repeat: no-repeat; background-image: url(${url})`);
      // console.log('%c                ', `font-size: ${height}x; background: url(${url}) no-repeat;`)
    }
    vconsoles.forEach(vc => vc.printImg(url, height));
  };

  /* istanbul ignore next */
  /**
   * @param {string} base64
   * @param {number} height
   */
  const printImgBase64 = (base64, height) => printImg(`data:image/gif;base64,${base64}`, height);

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const group = (...args) => {
    console.group(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.group(args));
  };

  /**
   * @param {Array<string|Symbol|Object|number>} args
   */
  const groupCollapsed = (...args) => {
    console.groupCollapsed(...computeLoggingArgs(args));
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.groupCollapsed(args));
  };

  const groupEnd = () => {
    console.groupEnd();
    /* istanbul ignore next */
    vconsoles.forEach(vc => vc.groupEnd());
  };

  /* istanbul ignore next */
  /**
   * @param {function():Node} createNode
   */
  const printDom = createNode =>
    vconsoles.forEach(vc => vc.printDom(createNode()));

  /* istanbul ignore next */
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {number} height
   */
  const printCanvas = (canvas, height) => printImg(canvas.toDataURL(), height);

  const vconsoles = new Set();

  /* istanbul ignore next */
  /**
   * @param {Array<string|Symbol|Object|number>} args
   * @return {Array<Element>}
   */
  const _computeLineSpans = args => {
    const spans = [];
    const currentStyle = new Map();
    // try with formatting until we find something unsupported
    let i = 0;
    for (; i < args.length; i++) {
      const arg = args[i];
      // @ts-ignore
      const style = _browserStyleMap[arg];
      if (style !== undefined) {
        currentStyle.set(style.left, style.right);
      } else {
        if (arg.constructor === String || arg.constructor === Number) {
          // @ts-ignore
          const span = element('span', [create$5('style', mapToStyleString(currentStyle))], [text(arg)]);
          if (span.innerHTML === '') {
            span.innerHTML = '&nbsp;';
          }
          spans.push(span);
        } else {
          break
        }
      }
    }
    // append the rest
    for (; i < args.length; i++) {
      let content = args[i];
      if (!(content instanceof Symbol)) {
        if (content.constructor !== String && content.constructor !== Number) {
          content = ' ' + stringify(content) + ' ';
        }
        spans.push(element('span', [], [text(/** @type {string} */ (content))]));
      }
    }
    return spans
  };

  const lineStyle = 'font-family:monospace;border-bottom:1px solid #e2e2e2;padding:2px;';

  /* istanbul ignore next */
  class VConsole {
    /**
     * @param {Element} dom
     */
    constructor (dom) {
      this.dom = dom;
      /**
       * @type {Element}
       */
      this.ccontainer = this.dom;
      this.depth = 0;
      vconsoles.add(this);
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     * @param {boolean} collapsed
     */
    group (args, collapsed = false) {
      enqueue(() => {
        const triangleDown = element('span', [create$5('hidden', collapsed), create$5('style', 'color:grey;font-size:120%;')], [text('▼')]);
        const triangleRight = element('span', [create$5('hidden', !collapsed), create$5('style', 'color:grey;font-size:125%;')], [text('▶')]);
        const content = element('div', [create$5('style', `${lineStyle};padding-left:${this.depth * 10}px`)], [triangleDown, triangleRight, text(' ')].concat(_computeLineSpans(args)));
        const nextContainer = element('div', [create$5('hidden', collapsed)]);
        const nextLine = element('div', [], [content, nextContainer]);
        append(this.ccontainer, [nextLine]);
        this.ccontainer = nextContainer;
        this.depth++;
        // when header is clicked, collapse/uncollapse container
        addEventListener$1(content, 'click', event => {
          nextContainer.toggleAttribute('hidden');
          triangleDown.toggleAttribute('hidden');
          triangleRight.toggleAttribute('hidden');
        });
      });
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     */
    groupCollapsed (args) {
      this.group(args, true);
    }

    groupEnd () {
      enqueue(() => {
        if (this.depth > 0) {
          this.depth--;
          // @ts-ignore
          this.ccontainer = this.ccontainer.parentElement.parentElement;
        }
      });
    }

    /**
     * @param {Array<string|Symbol|Object|number>} args
     */
    print (args) {
      enqueue(() => {
        append(this.ccontainer, [element('div', [create$5('style', `${lineStyle};padding-left:${this.depth * 10}px`)], _computeLineSpans(args))]);
      });
    }

    /**
     * @param {Error} err
     */
    printError (err) {
      this.print([RED, BOLD, err.toString()]);
    }

    /**
     * @param {string} url
     * @param {number} height
     */
    printImg (url, height) {
      enqueue(() => {
        append(this.ccontainer, [element('img', [create$5('src', url), create$5('height', `${round(height * 1.5)}px`)])]);
      });
    }

    /**
     * @param {Node} node
     */
    printDom (node) {
      enqueue(() => {
        append(this.ccontainer, [node]);
      });
    }

    destroy () {
      enqueue(() => {
        vconsoles.delete(this);
      });
    }
  }

  /* istanbul ignore next */
  /**
   * @param {Element} dom
   */
  const createVConsole = dom => new VConsole(dom);

  const loggingColors = [GREEN, PURPLE, ORANGE, BLUE];
  let nextColor = 0;
  let lastLoggingTime = getUnixTime();

  /**
   * @param {string} moduleName
   * @return {function(...any):void}
   */
  const createModuleLogger = moduleName => {
    const color = loggingColors[nextColor];
    const debugRegexVar = getVariable('log');
    const doLogging = debugRegexVar !== null && (debugRegexVar === '*' || debugRegexVar === 'true' || new RegExp(debugRegexVar, 'gi').test(moduleName));
    nextColor = (nextColor + 1) % loggingColors.length;
    moduleName += ': ';

    return !doLogging ? nop : (...args) => {
      const timeNow = getUnixTime();
      const timeDiff = timeNow - lastLoggingTime;
      lastLoggingTime = timeNow;
      print(color, moduleName, UNCOLOR, ...args.map(arg => (typeof arg === 'string' || typeof arg === 'symbol') ? arg : JSON.stringify(arg)), color, ' +' + timeDiff + 'ms');
    }
  };

  var logging = /*#__PURE__*/Object.freeze({
    __proto__: null,
    BOLD: BOLD,
    UNBOLD: UNBOLD,
    BLUE: BLUE,
    GREY: GREY,
    GREEN: GREEN,
    RED: RED,
    PURPLE: PURPLE,
    ORANGE: ORANGE,
    UNCOLOR: UNCOLOR,
    print: print,
    warn: warn,
    printError: printError,
    printImg: printImg,
    printImgBase64: printImgBase64,
    group: group,
    groupCollapsed: groupCollapsed,
    groupEnd: groupEnd,
    printDom: printDom,
    printCanvas: printCanvas,
    vconsoles: vconsoles,
    VConsole: VConsole,
    createVConsole: createVConsole,
    createModuleLogger: createModuleLogger
  });

  /**
   * Mutual exclude for JavaScript.
   *
   * @module mutex
   */

  /**
   * @callback mutex
   * @param {function():void} cb Only executed when this mutex is not in the current stack
   * @param {function():void} [elseCb] Executed when this mutex is in the current stack
   */

  /**
   * Creates a mutual exclude function with the following property:
   *
   * ```js
   * const mutex = createMutex()
   * mutex(() => {
   *   // This function is immediately executed
   *   mutex(() => {
   *     // This function is not executed, as the mutex is already active.
   *   })
   * })
   * ```
   *
   * @return {mutex} A mutual exclude function
   * @public
   */
  const createMutex = () => {
    let token = true;
    return (f, g) => {
      if (token) {
        token = false;
        try {
          f();
        } finally {
          token = true;
        }
      } else if (g !== undefined) {
        g();
      }
    }
  };

  var mutex = /*#__PURE__*/Object.freeze({
    __proto__: null,
    createMutex: createMutex
  });

  /**
   * @module prng
   */

  /**
   * Xorshift32 is a very simple but elegang PRNG with a period of `2^32-1`.
   */
  class Xorshift32 {
    /**
     * @param {number} seed Unsigned 32 bit number
     */
    constructor (seed) {
      this.seed = seed;
      /**
       * @type {number}
       */
      this._state = seed;
    }

    /**
     * Generate a random signed integer.
     *
     * @return {Number} A 32 bit signed integer.
     */
    next () {
      let x = this._state;
      x ^= x << 13;
      x ^= x >> 17;
      x ^= x << 5;
      this._state = x;
      return (x >>> 0) / (BITS32 + 1)
    }
  }

  /**
   * @module prng
   */

  /**
   * This is a variant of xoroshiro128plus - the fastest full-period generator passing BigCrush without systematic failures.
   *
   * This implementation follows the idea of the original xoroshiro128plus implementation,
   * but is optimized for the JavaScript runtime. I.e.
   * * The operations are performed on 32bit integers (the original implementation works with 64bit values).
   * * The initial 128bit state is computed based on a 32bit seed and Xorshift32.
   * * This implementation returns two 32bit values based on the 64bit value that is computed by xoroshiro128plus.
   *   Caution: The last addition step works slightly different than in the original implementation - the add carry of the
   *   first 32bit addition is not carried over to the last 32bit.
   *
   * [Reference implementation](http://vigna.di.unimi.it/xorshift/xoroshiro128plus.c)
   */
  class Xoroshiro128plus {
    /**
     * @param {number} seed Unsigned 32 bit number
     */
    constructor (seed) {
      this.seed = seed;
      // This is a variant of Xoroshiro128plus to fill the initial state
      const xorshift32 = new Xorshift32(seed);
      this.state = new Uint32Array(4);
      for (let i = 0; i < 4; i++) {
        this.state[i] = xorshift32.next() * BITS32;
      }
      this._fresh = true;
    }

    /**
     * @return {number} Float/Double in [0,1)
     */
    next () {
      const state = this.state;
      if (this._fresh) {
        this._fresh = false;
        return ((state[0] + state[2]) >>> 0) / (BITS32 + 1)
      } else {
        this._fresh = true;
        const s0 = state[0];
        const s1 = state[1];
        const s2 = state[2] ^ s0;
        const s3 = state[3] ^ s1;
        // function js_rotl (x, k) {
        //   k = k - 32
        //   const x1 = x[0]
        //   const x2 = x[1]
        //   x[0] = x2 << k | x1 >>> (32 - k)
        //   x[1] = x1 << k | x2 >>> (32 - k)
        // }
        // rotl(s0, 55) // k = 23 = 55 - 32; j = 9 =  32 - 23
        state[0] = (s1 << 23 | s0 >>> 9) ^ s2 ^ (s2 << 14 | s3 >>> 18);
        state[1] = (s0 << 23 | s1 >>> 9) ^ s3 ^ (s3 << 14);
        // rol(s1, 36) // k = 4 = 36 - 32; j = 23 = 32 - 9
        state[2] = s3 << 4 | s2 >>> 28;
        state[3] = s2 << 4 | s3 >>> 28;
        return (((state[1] + state[3]) >>> 0) / (BITS32 + 1))
      }
    }
  }

  /*
  // Reference implementation
  // Source: http://vigna.di.unimi.it/xorshift/xoroshiro128plus.c
  // By David Blackman and Sebastiano Vigna
  // Who published the reference implementation under Public Domain (CC0)

  #include <stdint.h>
  #include <stdio.h>

  uint64_t s[2];

  static inline uint64_t rotl(const uint64_t x, int k) {
      return (x << k) | (x >> (64 - k));
  }

  uint64_t next(void) {
      const uint64_t s0 = s[0];
      uint64_t s1 = s[1];
      s1 ^= s0;
      s[0] = rotl(s0, 55) ^ s1 ^ (s1 << 14); // a, b
      s[1] = rotl(s1, 36); // c
      return (s[0] + s[1]) & 0xFFFFFFFF;
  }

  int main(void)
  {
      int i;
      s[0] = 1111 | (1337ul << 32);
      s[1] = 1234 | (9999ul << 32);

      printf("1000 outputs of genrand_int31()\n");
      for (i=0; i<100; i++) {
          printf("%10lu ", i);
          printf("%10lu ", next());
          printf("- %10lu ", s[0] >> 32);
          printf("%10lu ", (s[0] << 32) >> 32);
          printf("%10lu ", s[1] >> 32);
          printf("%10lu ", (s[1] << 32) >> 32);
          printf("\n");
          // if (i%5==4) printf("\n");
      }
      return 0;
  }
  */

  /**
   * Fast Pseudo Random Number Generators.
   *
   * Given a seed a PRNG generates a sequence of numbers that cannot be reasonably predicted.
   * Two PRNGs must generate the same random sequence of numbers if  given the same seed.
   *
   * @module prng
   */

  /**
   * Description of the function
   *  @callback generatorNext
   *  @return {number} A 32bit integer
   */

  /**
   * A random type generator.
   *
   * @typedef {Object} PRNG
   * @property {generatorNext} next Generate new number
   */

  const DefaultPRNG = Xoroshiro128plus;

  /**
   * Create a Xoroshiro128plus Pseudo-Random-Number-Generator.
   * This is the fastest full-period generator passing BigCrush without systematic failures.
   * But there are more PRNGs available in ./PRNG/.
   *
   * @param {number} seed A positive 32bit integer. Do not use negative numbers.
   * @return {PRNG}
   */
  const create$1 = seed => new DefaultPRNG(seed);

  /**
   * Generates a single random bool.
   *
   * @param {PRNG} gen A random number generator.
   * @return {Boolean} A random boolean
   */
  const bool = gen => (gen.next() >= 0.5);

  /**
   * Generates a random integer with 53 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive).
   * @return {Number} A random integer on [min, max]
   */
  const int53 = (gen, min, max) => floor(gen.next() * (max + 1 - min) + min);

  /**
   * Generates a random integer with 53 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive).
   * @return {Number} A random integer on [min, max]
   */
  const uint53 = (gen, min, max) => abs(int53(gen, min, max));

  /**
   * Generates a random integer with 32 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive).
   * @return {Number} A random integer on [min, max]
   */
  const int32 = (gen, min, max) => floor(gen.next() * (max + 1 - min) + min);

  /**
   * Generates a random integer with 53 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive).
   * @return {Number} A random integer on [min, max]
   */
  const uint32 = (gen, min, max) => int32(gen, min, max) >>> 0;

  /**
   * @deprecated
   * Optimized version of prng.int32. It has the same precision as prng.int32, but should be preferred when
   * openaring on smaller ranges.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Number} min The lower bound of the allowed return values (inclusive).
   * @param {Number} max The upper bound of the allowed return values (inclusive). The max inclusive number is `binary.BITS31-1`
   * @return {Number} A random integer on [min, max]
   */
  const int31 = (gen, min, max) => int32(gen, min, max);

  /**
   * Generates a random real on [0, 1) with 53 bit resolution.
   *
   * @param {PRNG} gen A random number generator.
   * @return {Number} A random real number on [0, 1).
   */
  const real53 = gen => gen.next(); // (((gen.next() >>> 5) * binary.BIT26) + (gen.next() >>> 6)) / MAX_SAFE_INTEGER

  /**
   * Generates a random character from char code 32 - 126. I.e. Characters, Numbers, special characters, and Space:
   *
   * @param {PRNG} gen A random number generator.
   * @return {string}
   *
   * (Space)!"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[/]^_`abcdefghijklmnopqrstuvwxyz{|}~
   */
  const char = gen => fromCharCode(int31(gen, 32, 126));

  /**
   * @param {PRNG} gen
   * @return {string} A single letter (a-z)
   */
  const letter = gen => fromCharCode(int31(gen, 97, 122));

  /**
   * @param {PRNG} gen
   * @param {number} [minLen=0]
   * @param {number} [maxLen=20]
   * @return {string} A random word (0-20 characters) without spaces consisting of letters (a-z)
   */
  const word = (gen, minLen = 0, maxLen = 20) => {
    const len = int31(gen, minLen, maxLen);
    let str = '';
    for (let i = 0; i < len; i++) {
      str += letter(gen);
    }
    return str
  };

  /**
   * TODO: this function produces invalid runes. Does not cover all of utf16!!
   *
   * @param {PRNG} gen
   * @return {string}
   */
  const utf16Rune = gen => {
    const codepoint = int31(gen, 0, 256);
    return fromCodePoint(codepoint)
  };

  /**
   * @param {PRNG} gen
   * @param {number} [maxlen = 20]
   */
  const utf16String = (gen, maxlen = 20) => {
    const len = int31(gen, 0, maxlen);
    let str = '';
    for (let i = 0; i < len; i++) {
      str += utf16Rune(gen);
    }
    return str
  };

  /**
   * Returns one element of a given array.
   *
   * @param {PRNG} gen A random number generator.
   * @param {Array<T>} array Non empty Array of possible values.
   * @return {T} One of the values of the supplied Array.
   * @template T
   */
  const oneOf = (gen, array) => array[int31(gen, 0, array.length - 1)];

  /**
   * @param {PRNG} gen
   * @param {number} len
   * @return {Uint8Array}
   */
  const uint8Array = (gen, len) => {
    const buf = createUint8ArrayFromLen(len);
    for (let i = 0; i < buf.length; i++) {
      buf[i] = int32(gen, 0, BITS8);
    }
    return buf
  };

  /**
   * @param {PRNG} gen
   * @param {number} len
   * @return {Uint16Array}
   */
  const uint16Array = (gen, len) => new Uint16Array(uint8Array(gen, len * 2).buffer);

  /**
   * @param {PRNG} gen
   * @param {number} len
   * @return {Uint32Array}
   */
  const uint32Array = (gen, len) => new Uint32Array(uint8Array(gen, len * 4).buffer);

  var prng = /*#__PURE__*/Object.freeze({
    __proto__: null,
    DefaultPRNG: DefaultPRNG,
    create: create$1,
    bool: bool,
    int53: int53,
    uint53: uint53,
    int32: int32,
    uint32: uint32,
    int31: int31,
    real53: real53,
    char: char,
    letter: letter,
    word: word,
    utf16Rune: utf16Rune,
    utf16String: utf16String,
    oneOf: oneOf,
    uint8Array: uint8Array,
    uint16Array: uint16Array,
    uint32Array: uint32Array
  });

  /**
   * Utility module to work with sets.
   *
   * @module set
   */

  const create = () => new Set();

  /**
   * @template T
   * @param {Set<T>} set
   * @return {Array<T>}
   */
  const toArray = set => Array.from(set);

  /**
   * @template T
   * @param {Set<T>} set
   * @return {T}
   */
  const first = set => {
    return set.values().next().value || undefined
  };

  /**
   * @template T
   * @param {Iterable<T>} entries
   * @return {Set<T>}
   */
  const from = entries => {
    return new Set(entries)
  };

  var set = /*#__PURE__*/Object.freeze({
    __proto__: null,
    create: create,
    toArray: toArray,
    first: first,
    from: from
  });

  /**
   * Efficient sort implementations.
   *
   * Note: These sort implementations were created to compare different sorting algorithms in JavaScript.
   * Don't use them if you don't know what you are doing. Native Array.sort is almost always a better choice.
   *
   * @module sort
   */

  /**
   * @template T
   * @param {Array<T>} arr
   * @param {number} lo
   * @param {number} hi
   * @param {function(T,T):number} compare
   */
  const _insertionSort = (arr, lo, hi, compare) => {
    for (let i = lo + 1; i <= hi; i++) {
      for (let j = i; j > 0 && compare(arr[j - 1], arr[j]) > 0; j--) {
        const tmp = arr[j];
        arr[j] = arr[j - 1];
        arr[j - 1] = tmp;
      }
    }
  };

  /**
   * @template T
   * @param {Array<T>} arr
   * @param {function(T,T):number} compare
   * @return {void}
   */
  const insertionSort = (arr, compare) => {
    _insertionSort(arr, 0, arr.length - 1, compare);
  };

  /**
   * @template T
   * @param {Array<T>} arr
   * @param {number} lo
   * @param {number} hi
   * @param {function(T,T):number} compare
   */
  const _quickSort = (arr, lo, hi, compare) => {
    if (hi - lo < 42) {
      _insertionSort(arr, lo, hi, compare);
    } else {
      const pivot = arr[floor((lo + hi) / 2)];
      let i = lo;
      let j = hi;
      while (true) {
        while (compare(pivot, arr[i]) > 0) {
          i++;
        }
        while (compare(arr[j], pivot) > 0) {
          j--;
        }
        if (i >= j) {
          break
        }
        // swap arr[i] with arr[j]
        // and increment i and j
        const arri = arr[i];
        arr[i++] = arr[j];
        arr[j--] = arri;
      }
      _quickSort(arr, lo, j, compare);
      _quickSort(arr, j + 1, hi, compare);
    }
  };

  /**
   * This algorithm beats Array.prototype.sort in Chrome only with arrays with 10 million entries.
   * In most cases [].sort will do just fine. Make sure to performance test your use-case before you
   * integrate this algorithm.
   *
   * Note that Chrome's sort is now a stable algorithm (Timsort). Quicksort is not stable.
   *
   * @template T
   * @param {Array<T>} arr
   * @param {function(T,T):number} compare
   * @return {void}
   */
  const quicksort = (arr, compare) => {
    _quickSort(arr, 0, arr.length - 1, compare);
  };

  var sort = /*#__PURE__*/Object.freeze({
    __proto__: null,
    _insertionSort: _insertionSort,
    insertionSort: insertionSort,
    quicksort: quicksort
  });

  /**
   * Utility helpers for generating statistics.
   *
   * @module statistics
   */

  /**
   * @param {Array<number>} arr Array of values
   * @return {number} Returns null if the array is empty
   */
  const median = arr => arr.length === 0 ? NaN : (arr.length % 2 === 1 ? arr[(arr.length - 1) / 2] : (arr[floor((arr.length - 1) / 2)] + arr[ceil((arr.length - 1) / 2)]) / 2);

  /**
   * @param {Array<number>} arr
   * @return {number}
   */
  const average = arr => arr.reduce(add$1, 0) / arr.length;

  var statistics = /*#__PURE__*/Object.freeze({
    __proto__: null,
    median: median,
    average: average
  });

  /**
   * Red-black-tree implementation.
   *
   * @module tree
   */
  // @ts-nocheck TODO: remove or refactor this file

  const rotate = (tree, parent, newParent, n) => {
    if (parent === null) {
      tree.root = newParent;
      newParent._parent = null;
    } else if (parent.left === n) {
      parent.left = newParent;
    } else if (parent.right === n) {
      parent.right = newParent;
    } else {
      throw new Error('The elements are wrongly connected!')
    }
  };

  class N {
    // A created node is always red!
    constructor (val) {
      this.val = val;
      this.color = true;
      this._left = null;
      this._right = null;
      this._parent = null;
    }

    isRed () { return this.color }
    isBlack () { return !this.color }
    redden () { this.color = true; return this }
    blacken () { this.color = false; return this }
    get grandparent () {
      return this.parent.parent
    }

    get parent () {
      return this._parent
    }

    get sibling () {
      return (this === this.parent.left)
        ? this.parent.right : this.parent.left
    }

    get left () {
      return this._left
    }

    get right () {
      return this._right
    }

    set left (n) {
      if (n !== null) {
        n._parent = this;
      }
      this._left = n;
    }

    set right (n) {
      if (n !== null) {
        n._parent = this;
      }
      this._right = n;
    }

    rotateLeft (tree) {
      const parent = this.parent;
      const newParent = this.right;
      const newRight = this.right.left;
      newParent.left = this;
      this.right = newRight;
      rotate(tree, parent, newParent, this);
    }

    next () {
      if (this.right !== null) {
        // search the most left node in the right tree
        var o = this.right;
        while (o.left !== null) {
          o = o.left;
        }
        return o
      } else {
        var p = this;
        while (p.parent !== null && p !== p.parent.left) {
          p = p.parent;
        }
        return p.parent
      }
    }

    prev () {
      if (this.left !== null) {
        // search the most right node in the left tree
        var o = this.left;
        while (o.right !== null) {
          o = o.right;
        }
        return o
      } else {
        var p = this;
        while (p.parent !== null && p !== p.parent.right) {
          p = p.parent;
        }
        return p.parent
      }
    }

    rotateRight (tree) {
      const parent = this.parent;
      const newParent = this.left;
      const newLeft = this.left.right;
      newParent.right = this;
      this.left = newLeft;
      rotate(tree, parent, newParent, this);
    }

    getUncle () {
      // we can assume that grandparent exists when this is called!
      if (this.parent === this.parent.parent.left) {
        return this.parent.parent.right
      } else {
        return this.parent.parent.left
      }
    }
  }

  const isBlack = node =>
    node !== null ? node.isBlack() : true;

  const isRed = (node) =>
    node !== null ? node.isRed() : false;

  /**
   * This is a Red Black Tree implementation
   *
   * @template K,V
   */
  class Tree {
    constructor () {
      this.root = null;
      this.length = 0;
    }

    /**
     * @param {K} id
     */
    findNext (id) {
      var nextID = id.clone();
      nextID.clock += 1;
      return this.findWithLowerBound(nextID)
    }

    /**
     * @param {K} id
     */
    findPrev (id) {
      const prevID = id.clone();
      prevID.clock -= 1;
      return this.findWithUpperBound(prevID)
    }

    /**
     * @param {K} from
     */
    findNodeWithLowerBound (from) {
      var o = this.root;
      if (o === null) {
        return null
      } else {
        while (true) {
          if (from === null || (from.lessThan(o.val._id) && o.left !== null)) {
            // o is included in the bound
            // try to find an element that is closer to the bound
            o = o.left;
          } else if (from !== null && o.val._id.lessThan(from)) {
            // o is not within the bound, maybe one of the right elements is..
            if (o.right !== null) {
              o = o.right;
            } else {
              // there is no right element. Search for the next bigger element,
              // this should be within the bounds
              return o.next()
            }
          } else {
            return o
          }
        }
      }
    }

    /**
     * @param {K} to
     */
    findNodeWithUpperBound (to) {
      if (to === undefined) {
        throw new Error('You must define from!')
      }
      var o = this.root;
      if (o === null) {
        return null
      } else {
        while (true) {
          if ((to === null || o.val._id.lessThan(to)) && o.right !== null) {
            // o is included in the bound
            // try to find an element that is closer to the bound
            o = o.right;
          } else if (to !== null && to.lessThan(o.val._id)) {
            // o is not within the bound, maybe one of the left elements is..
            if (o.left !== null) {
              o = o.left;
            } else {
              // there is no left element. Search for the prev smaller element,
              // this should be within the bounds
              return o.prev()
            }
          } else {
            return o
          }
        }
      }
    }

    /**
     * @return {V}
     */
    findSmallestNode () {
      var o = this.root;
      while (o != null && o.left != null) {
        o = o.left;
      }
      return o
    }

    /**
     * @param {K} from
     * @return {V}
     */
    findWithLowerBound (from) {
      var n = this.findNodeWithLowerBound(from);
      return n == null ? null : n.val
    }

    /**
     * @param {K} to
     * @return {V}
     */
    findWithUpperBound (to) {
      var n = this.findNodeWithUpperBound(to);
      return n == null ? null : n.val
    }

    /**
     * @param {K} from
     * @param {V} from
     * @param {function(V):void} f
     */
    iterate (from, to, f) {
      var o;
      if (from === null) {
        o = this.findSmallestNode();
      } else {
        o = this.findNodeWithLowerBound(from);
      }
      while (
        o !== null &&
        (
          to === null || // eslint-disable-line no-unmodified-loop-condition
          o.val._id.lessThan(to) ||
          o.val._id.equals(to)
        )
      ) {
        f(o.val);
        o = o.next();
      }
    }

    /**
     * @param {K} id
     * @return {V|null}
     */
    find (id) {
      const n = this.findNode(id);
      if (n !== null) {
        return n.val
      } else {
        return null
      }
    }

    /**
     * @param {K} id
     * @return {N<V>|null}
     */
    findNode (id) {
      var o = this.root;
      if (o === null) {
        return null
      } else {
        while (true) {
          if (o === null) {
            return null
          }
          if (id.lessThan(o.val._id)) {
            o = o.left;
          } else if (o.val._id.lessThan(id)) {
            o = o.right;
          } else {
            return o
          }
        }
      }
    }

    /**
     * @param {K} id
     */
    delete (id) {
      var d = this.findNode(id);
      if (d == null) {
        // throw new Error('Element does not exist!')
        return
      }
      this.length--;
      if (d.left !== null && d.right !== null) {
        // switch d with the greates element in the left subtree.
        // o should have at most one child.
        var o = d.left;
        // find
        while (o.right !== null) {
          o = o.right;
        }
        // switch
        d.val = o.val;
        d = o;
      }
      // d has at most one child
      // let n be the node that replaces d
      var isFakeChild;
      var child = d.left || d.right;
      if (child === null) {
        isFakeChild = true;
        child = new N(null);
        child.blacken();
        d.right = child;
      } else {
        isFakeChild = false;
      }

      if (d.parent === null) {
        if (!isFakeChild) {
          this.root = child;
          child.blacken();
          child._parent = null;
        } else {
          this.root = null;
        }
        return
      } else if (d.parent.left === d) {
        d.parent.left = child;
      } else if (d.parent.right === d) {
        d.parent.right = child;
      } else {
        throw new Error('Impossible!')
      }
      if (d.isBlack()) {
        if (child.isRed()) {
          child.blacken();
        } else {
          this._fixDelete(child);
        }
      }
      this.root.blacken();
      if (isFakeChild) {
        if (child.parent.left === child) {
          child.parent.left = null;
        } else if (child.parent.right === child) {
          child.parent.right = null;
        } else {
          throw new Error('Impossible #3')
        }
      }
    }

    _fixDelete (n) {
      if (n.parent === null) {
        // this can only be called after the first iteration of fixDelete.
        return
      }
      // d was already replaced by the child
      // d is not the root
      // d and child are black
      var sibling = n.sibling;
      if (isRed(sibling)) {
        // make sibling the grandfather
        n.parent.redden();
        sibling.blacken();
        if (n === n.parent.left) {
          n.parent.rotateLeft(this);
        } else if (n === n.parent.right) {
          n.parent.rotateRight(this);
        } else {
          throw new Error('Impossible #2')
        }
        sibling = n.sibling;
      }
      // parent, sibling, and children of n are black
      if (n.parent.isBlack() &&
        sibling.isBlack() &&
        isBlack(sibling.left) &&
        isBlack(sibling.right)
      ) {
        sibling.redden();
        this._fixDelete(n.parent);
      } else if (n.parent.isRed() &&
        sibling.isBlack() &&
        isBlack(sibling.left) &&
        isBlack(sibling.right)
      ) {
        sibling.redden();
        n.parent.blacken();
      } else {
        if (n === n.parent.left &&
          sibling.isBlack() &&
          isRed(sibling.left) &&
          isBlack(sibling.right)
        ) {
          sibling.redden();
          sibling.left.blacken();
          sibling.rotateRight(this);
          sibling = n.sibling;
        } else if (n === n.parent.right &&
          sibling.isBlack() &&
          isRed(sibling.right) &&
          isBlack(sibling.left)
        ) {
          sibling.redden();
          sibling.right.blacken();
          sibling.rotateLeft(this);
          sibling = n.sibling;
        }
        sibling.color = n.parent.color;
        n.parent.blacken();
        if (n === n.parent.left) {
          sibling.right.blacken();
          n.parent.rotateLeft(this);
        } else {
          sibling.left.blacken();
          n.parent.rotateRight(this);
        }
      }
    }

    put (v) {
      var node = new N(v);
      if (this.root !== null) {
        var p = this.root; // p abbrev. parent
        while (true) {
          if (node.val._id.lessThan(p.val._id)) {
            if (p.left === null) {
              p.left = node;
              break
            } else {
              p = p.left;
            }
          } else if (p.val._id.lessThan(node.val._id)) {
            if (p.right === null) {
              p.right = node;
              break
            } else {
              p = p.right;
            }
          } else {
            p.val = node.val;
            return p
          }
        }
        this._fixInsert(node);
      } else {
        this.root = node;
      }
      this.length++;
      this.root.blacken();
      return node
    }

    _fixInsert (n) {
      if (n.parent === null) {
        n.blacken();
        return
      } else if (n.parent.isBlack()) {
        return
      }
      var uncle = n.getUncle();
      if (uncle !== null && uncle.isRed()) {
        // Note: parent: red, uncle: red
        n.parent.blacken();
        uncle.blacken();
        n.grandparent.redden();
        this._fixInsert(n.grandparent);
      } else {
        // Note: parent: red, uncle: black or null
        // Now we transform the tree in such a way that
        // either of these holds:
        //   1) grandparent.left.isRed
        //     and grandparent.left.left.isRed
        //   2) grandparent.right.isRed
        //     and grandparent.right.right.isRed
        if (n === n.parent.right && n.parent === n.grandparent.left) {
          n.parent.rotateLeft(this);
          // Since we rotated and want to use the previous
          // cases, we need to set n in such a way that
          // n.parent.isRed again
          n = n.left;
        } else if (n === n.parent.left && n.parent === n.grandparent.right) {
          n.parent.rotateRight(this);
          // see above
          n = n.right;
        }
        // Case 1) or 2) hold from here on.
        // Now traverse grandparent, make parent a black node
        // on the highest level which holds two red nodes.
        n.parent.blacken();
        n.grandparent.redden();
        if (n === n.parent.left) {
          // Case 1
          n.grandparent.rotateRight(this);
        } else {
          // Case 2
          n.grandparent.rotateLeft(this);
        }
      }
    }
  }

  var tree = /*#__PURE__*/Object.freeze({
    __proto__: null,
    Tree: Tree
  });

  /**
   * Observable class prototype.
   *
   * @module observable
   */

  /**
   * Handles named events.
   *
   * @template N
   */
  class Observable {
    constructor () {
      /**
       * Some desc.
       * @type {Map<N, any>}
       */
      this._observers = create$7();
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    on (name, f) {
      setIfUndefined(this._observers, name, create).add(f);
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    once (name, f) {
      /**
       * @param  {...any} args
       */
      const _f = (...args) => {
        this.off(name, _f);
        f(...args);
      };
      this.on(name, _f);
    }

    /**
     * @param {N} name
     * @param {function} f
     */
    off (name, f) {
      const observers = this._observers.get(name);
      if (observers !== undefined) {
        observers.delete(f);
        if (observers.size === 0) {
          this._observers.delete(name);
        }
      }
    }

    /**
     * Emit a named event. All registered event listeners that listen to the
     * specified name will receive the event.
     *
     * @todo This should catch exceptions
     *
     * @param {N} name The event name.
     * @param {Array<any>} args The arguments that are applied to the event listener.
     */
    emit (name, args) {
      // copy all listeners to an array first to make sure that no event is emitted to listeners that are subscribed while the event handler is called.
      return from$1((this._observers.get(name) || create$7()).values()).forEach(f => f(...args))
    }

    destroy () {
      this._observers = create$7();
    }
  }

  /* eslint-env browser */

  const reconnectTimeoutBase = 1200;
  const maxReconnectTimeout = 2500;
  // @todo - this should depend on awareness.outdatedTime
  const messageReconnectTimeout = 30000;

  /**
   * @param {WebsocketClient} wsclient
   */
  const setupWS = (wsclient) => {
    if (wsclient.shouldConnect && wsclient.ws === null) {
      const websocket = new WebSocket(wsclient.url);
      const binaryType = wsclient.binaryType;
      /**
       * @type {any}
       */
      let pingTimeout = null;
      if (binaryType) {
        websocket.binaryType = binaryType;
      }
      wsclient.ws = websocket;
      wsclient.connecting = true;
      wsclient.connected = false;
      websocket.onmessage = event => {
        wsclient.lastMessageReceived = getUnixTime();
        const data = event.data;
        const message = typeof data === 'string' ? JSON.parse(data) : data;
        if (message && message.type === 'pong') {
          clearTimeout(pingTimeout);
          pingTimeout = setTimeout(sendPing, messageReconnectTimeout / 2);
        }
        wsclient.emit('message', [message, wsclient]);
      };
      /**
       * @param {any} error
       */
      const onclose = error => {
        if (wsclient.ws !== null) {
          wsclient.ws = null;
          wsclient.connecting = false;
          if (wsclient.connected) {
            wsclient.connected = false;
            wsclient.emit('disconnect', [{ type: 'disconnect', error }, wsclient]);
          } else {
            wsclient.unsuccessfulReconnects++;
          }
          // Start with no reconnect timeout and increase timeout by
          // log10(wsUnsuccessfulReconnects).
          // The idea is to increase reconnect timeout slowly and have no reconnect
          // timeout at the beginning (log(1) = 0)
          setTimeout(setupWS, min(log10(wsclient.unsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout), wsclient);
        }
        clearTimeout(pingTimeout);
      };
      const sendPing = () => {
        if (wsclient.ws === websocket) {
          wsclient.send({
            type: 'ping'
          });
        }
      };
      websocket.onclose = () => onclose(null);
      websocket.onerror = error => onclose(error);
      websocket.onopen = () => {
        wsclient.lastMessageReceived = getUnixTime();
        wsclient.connecting = false;
        wsclient.connected = true;
        wsclient.unsuccessfulReconnects = 0;
        wsclient.emit('connect', [{ type: 'connect' }, wsclient]);
        // set ping
        pingTimeout = setTimeout(sendPing, messageReconnectTimeout / 2);
      };
    }
  };

  /**
   * @extends Observable<string>
   */
  class WebsocketClient extends Observable {
    /**
     * @param {string} url
     * @param {object} [opts]
     * @param {'arraybuffer' | 'blob' | null} [opts.binaryType] Set `ws.binaryType`
     */
    constructor (url, { binaryType } = {}) {
      super();
      this.url = url;
      /**
       * @type {WebSocket?}
       */
      this.ws = null;
      this.binaryType = binaryType || null;
      this.connected = false;
      this.connecting = false;
      this.unsuccessfulReconnects = 0;
      this.lastMessageReceived = 0;
      /**
       * Whether to connect to other peers or not
       * @type {boolean}
       */
      this.shouldConnect = true;
      this._checkInterval = setInterval(() => {
        if (this.connected && messageReconnectTimeout < getUnixTime() - this.lastMessageReceived) {
          // no message received in a long time - not even your own awareness
          // updates (which are updated every 15 seconds)
          /** @type {WebSocket} */ (this.ws).close();
        }
      }, messageReconnectTimeout / 2);
      setupWS(this);
    }

    /**
     * @param {any} message
     */
    send (message) {
      if (this.ws) {
        this.ws.send(JSON.stringify(message));
      }
    }

    destroy () {
      clearInterval(this._checkInterval);
      this.disconnect();
      super.destroy();
    }

    disconnect () {
      this.shouldConnect = false;
      if (this.ws !== null) {
        this.ws.close();
      }
    }

    connect () {
      this.shouldConnect = true;
      if (!this.connected && this.ws === null) {
        setupWS(this);
      }
    }
  }

  var websocket = /*#__PURE__*/Object.freeze({
    __proto__: null,
    WebsocketClient: WebsocketClient
  });

  exports.array = array;
  exports.binary = binary;
  exports.broadcastchannel = broadcastchannel;
  exports.buffer = buffer;
  exports.conditions = conditions;
  exports.decoding = decoding;
  exports.diff = diff;
  exports.dom = dom;
  exports.encoding = encoding;
  exports.environment = environment;
  exports.error = error;
  exports.eventloop = eventloop;
  exports.func = _function;
  exports.indexeddb = indexeddb;
  exports.iterator = iterator;
  exports.json = json;
  exports.logging = logging;
  exports.map = map$3;
  exports.math = math;
  exports.mutex = mutex;
  exports.number = number;
  exports.object = object;
  exports.pair = pair;
  exports.prng = prng;
  exports.promise = promise;
  exports.set = set;
  exports.sort = sort;
  exports.statistics = statistics;
  exports.string = string;
  exports.symbol = symbol;
  exports.time = time;
  exports.tree = tree;
  exports.websocket = websocket;

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;

})({});
