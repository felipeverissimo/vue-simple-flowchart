(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vue-flowchart"] = factory();
	else
		root["vue-flowchart"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "01f9":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__("2d00");
var $export = __webpack_require__("5ca1");
var redefine = __webpack_require__("2aba");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var $iterCreate = __webpack_require__("41a0");
var setToStringTag = __webpack_require__("7f20");
var getPrototypeOf = __webpack_require__("38fd");
var ITERATOR = __webpack_require__("2b4c")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "0a49":
/***/ (function(module, exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__("9b43");
var IObject = __webpack_require__("626a");
var toObject = __webpack_require__("4bf8");
var toLength = __webpack_require__("9def");
var asc = __webpack_require__("cd1c");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "0d58":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__("ce10");
var enumBugKeys = __webpack_require__("e11e");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "1169":
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__("2d95");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "11e9":
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__("52a7");
var createDesc = __webpack_require__("4630");
var toIObject = __webpack_require__("6821");
var toPrimitive = __webpack_require__("6a99");
var has = __webpack_require__("69a8");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__("9e1e") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "1495":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var anObject = __webpack_require__("cb7c");
var getKeys = __webpack_require__("0d58");

module.exports = __webpack_require__("9e1e") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "16be":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "1eb2":
/***/ (function(module, exports, __webpack_require__) {

// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var i
  if ((i = window.document.currentScript) && (i = i.src.match(/(.+\/)[^/]+\.js$/))) {
    __webpack_require__.p = i[1] // eslint-disable-line
  }
}


/***/ }),

/***/ "20d6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.9 Array.prototype.findIndex(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(6);
var KEY = 'findIndex';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  findIndex: function findIndex(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "210a":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartLink_vue_vue_type_style_index_0_id_7aea48ba_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("f6fa");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartLink_vue_vue_type_style_index_0_id_7aea48ba_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartLink_vue_vue_type_style_index_0_id_7aea48ba_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartLink_vue_vue_type_style_index_0_id_7aea48ba_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "230e":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var document = __webpack_require__("7726").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "2621":
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),

/***/ "2aba":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var has = __webpack_require__("69a8");
var SRC = __webpack_require__("ca5a")('src');
var TO_STRING = 'toString';
var $toString = Function[TO_STRING];
var TPL = ('' + $toString).split(TO_STRING);

__webpack_require__("8378").inspectSource = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "2aeb":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__("cb7c");
var dPs = __webpack_require__("1495");
var enumBugKeys = __webpack_require__("e11e");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__("230e")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__("fab2").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "2b4c":
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__("5537")('wks');
var uid = __webpack_require__("ca5a");
var Symbol = __webpack_require__("7726").Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "2d00":
/***/ (function(module, exports) {

module.exports = false;


/***/ }),

/***/ "2d95":
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "32e9":
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__("86cc");
var createDesc = __webpack_require__("4630");
module.exports = __webpack_require__("9e1e") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "37b2":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartNode_vue_vue_type_style_index_0_id_0595dfe7_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("16be");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartNode_vue_vue_type_style_index_0_id_0595dfe7_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartNode_vue_vue_type_style_index_0_id_0595dfe7_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_FlowchartNode_vue_vue_type_style_index_0_id_0595dfe7_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "3872":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SimpleFlowchart_vue_vue_type_style_index_0_id_bbe421b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("4fdb");
/* harmony import */ var _node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SimpleFlowchart_vue_vue_type_style_index_0_id_bbe421b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SimpleFlowchart_vue_vue_type_style_index_0_id_bbe421b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0__);
/* unused harmony reexport * */
 /* unused harmony default export */ var _unused_webpack_default_export = (_node_modules_mini_css_extract_plugin_dist_loader_js_ref_8_oneOf_1_0_node_modules_css_loader_index_js_ref_8_oneOf_1_1_node_modules_vue_loader_lib_loaders_stylePostLoader_js_node_modules_postcss_loader_lib_index_js_ref_8_oneOf_1_2_node_modules_sass_loader_lib_loader_js_ref_8_oneOf_1_3_node_modules_cache_loader_dist_cjs_js_ref_0_0_node_modules_vue_loader_lib_index_js_vue_loader_options_SimpleFlowchart_vue_vue_type_style_index_0_id_bbe421b4_scoped_true_lang_scss___WEBPACK_IMPORTED_MODULE_0___default.a); 

/***/ }),

/***/ "38fd":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__("69a8");
var toObject = __webpack_require__("4bf8");
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "41a0":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__("2aeb");
var descriptor = __webpack_require__("4630");
var setToStringTag = __webpack_require__("7f20");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__("32e9")(IteratorPrototype, __webpack_require__("2b4c")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "4588":
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "4630":
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "4bf8":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "4fdb":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "52a7":
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "5537":
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__("8378");
var global = __webpack_require__("7726");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__("2d00") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "5ca1":
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__("7726");
var core = __webpack_require__("8378");
var hide = __webpack_require__("32e9");
var redefine = __webpack_require__("2aba");
var ctx = __webpack_require__("9b43");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "5dbc":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var setPrototypeOf = __webpack_require__("8b97").set;
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "613b":
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__("5537")('keys');
var uid = __webpack_require__("ca5a");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "626a":
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__("2d95");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "6821":
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__("626a");
var defined = __webpack_require__("be13");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "69a8":
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "6a99":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__("d3f4");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "7333":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__("0d58");
var gOPS = __webpack_require__("2621");
var pIE = __webpack_require__("52a7");
var toObject = __webpack_require__("4bf8");
var IObject = __webpack_require__("626a");
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__("79e5")(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),

/***/ "7514":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__("5ca1");
var $find = __webpack_require__("0a49")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__("9c6c")(KEY);


/***/ }),

/***/ "7726":
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "77f1":
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__("4588");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "79e5":
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "7f20":
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__("86cc").f;
var has = __webpack_require__("69a8");
var TAG = __webpack_require__("2b4c")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "8378":
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "84f2":
/***/ (function(module, exports) {

module.exports = {};


/***/ }),

/***/ "86cc":
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__("cb7c");
var IE8_DOM_DEFINE = __webpack_require__("c69a");
var toPrimitive = __webpack_require__("6a99");
var dP = Object.defineProperty;

exports.f = __webpack_require__("9e1e") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "8b97":
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__("d3f4");
var anObject = __webpack_require__("cb7c");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__("9b43")(Function.call, __webpack_require__("11e9").f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "9093":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__("ce10");
var hiddenKeys = __webpack_require__("e11e").concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "9b43":
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__("d8e8");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "9c6c":
/***/ (function(module, exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__("2b4c")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__("32e9")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "9def":
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__("4588");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "9e1e":
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__("79e5")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "aa77":
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__("5ca1");
var defined = __webpack_require__("be13");
var fails = __webpack_require__("79e5");
var spaces = __webpack_require__("fdef");
var space = '[' + spaces + ']';
var non = '\u200b\u0085';
var ltrim = RegExp('^' + space + space + '*');
var rtrim = RegExp(space + space + '*$');

var exporter = function (KEY, exec, ALIAS) {
  var exp = {};
  var FORCE = fails(function () {
    return !!spaces[KEY]() || non[KEY]() != non;
  });
  var fn = exp[KEY] = FORCE ? exec(trim) : spaces[KEY];
  if (ALIAS) exp[ALIAS] = fn;
  $export($export.P + $export.F * FORCE, 'String', exp);
};

// 1 -> String#trimLeft
// 2 -> String#trimRight
// 3 -> String#trim
var trim = exporter.trim = function (string, TYPE) {
  string = String(defined(string));
  if (TYPE & 1) string = string.replace(ltrim, '');
  if (TYPE & 2) string = string.replace(rtrim, '');
  return string;
};

module.exports = exporter;


/***/ }),

/***/ "ac6a":
/***/ (function(module, exports, __webpack_require__) {

var $iterators = __webpack_require__("cadf");
var getKeys = __webpack_require__("0d58");
var redefine = __webpack_require__("2aba");
var global = __webpack_require__("7726");
var hide = __webpack_require__("32e9");
var Iterators = __webpack_require__("84f2");
var wks = __webpack_require__("2b4c");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "be13":
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "c366":
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__("6821");
var toLength = __webpack_require__("9def");
var toAbsoluteIndex = __webpack_require__("77f1");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "c5f6":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var global = __webpack_require__("7726");
var has = __webpack_require__("69a8");
var cof = __webpack_require__("2d95");
var inheritIfRequired = __webpack_require__("5dbc");
var toPrimitive = __webpack_require__("6a99");
var fails = __webpack_require__("79e5");
var gOPN = __webpack_require__("9093").f;
var gOPD = __webpack_require__("11e9").f;
var dP = __webpack_require__("86cc").f;
var $trim = __webpack_require__("aa77").trim;
var NUMBER = 'Number';
var $Number = global[NUMBER];
var Base = $Number;
var proto = $Number.prototype;
// Opera ~12 has broken Object#toString
var BROKEN_COF = cof(__webpack_require__("2aeb")(proto)) == NUMBER;
var TRIM = 'trim' in String.prototype;

// 7.1.3 ToNumber(argument)
var toNumber = function (argument) {
  var it = toPrimitive(argument, false);
  if (typeof it == 'string' && it.length > 2) {
    it = TRIM ? it.trim() : $trim(it, 3);
    var first = it.charCodeAt(0);
    var third, radix, maxCode;
    if (first === 43 || first === 45) {
      third = it.charCodeAt(2);
      if (third === 88 || third === 120) return NaN; // Number('+0x1') should be NaN, old V8 fix
    } else if (first === 48) {
      switch (it.charCodeAt(1)) {
        case 66: case 98: radix = 2; maxCode = 49; break; // fast equal /^0b[01]+$/i
        case 79: case 111: radix = 8; maxCode = 55; break; // fast equal /^0o[0-7]+$/i
        default: return +it;
      }
      for (var digits = it.slice(2), i = 0, l = digits.length, code; i < l; i++) {
        code = digits.charCodeAt(i);
        // parseInt parses a string to a first unavailable symbol
        // but ToNumber should return NaN if a string contains unavailable symbols
        if (code < 48 || code > maxCode) return NaN;
      } return parseInt(digits, radix);
    }
  } return +it;
};

if (!$Number(' 0o1') || !$Number('0b1') || $Number('+0x1')) {
  $Number = function Number(value) {
    var it = arguments.length < 1 ? 0 : value;
    var that = this;
    return that instanceof $Number
      // check on 1..constructor(foo) case
      && (BROKEN_COF ? fails(function () { proto.valueOf.call(that); }) : cof(that) != NUMBER)
        ? inheritIfRequired(new Base(toNumber(it)), that, $Number) : toNumber(it);
  };
  for (var keys = __webpack_require__("9e1e") ? gOPN(Base) : (
    // ES3:
    'MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,' +
    // ES6 (in case, if modules with ES6 Number statics required before):
    'EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,' +
    'MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger'
  ).split(','), j = 0, key; keys.length > j; j++) {
    if (has(Base, key = keys[j]) && !has($Number, key)) {
      dP($Number, key, gOPD(Base, key));
    }
  }
  $Number.prototype = proto;
  proto.constructor = $Number;
  __webpack_require__("2aba")(global, NUMBER, $Number);
}


/***/ }),

/***/ "c69a":
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__("9e1e") && !__webpack_require__("79e5")(function () {
  return Object.defineProperty(__webpack_require__("230e")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "ca5a":
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "cadf":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__("9c6c");
var step = __webpack_require__("d53b");
var Iterators = __webpack_require__("84f2");
var toIObject = __webpack_require__("6821");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__("01f9")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "cb7c":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "cd1c":
/***/ (function(module, exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__("e853");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "ce10":
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__("69a8");
var toIObject = __webpack_require__("6821");
var arrayIndexOf = __webpack_require__("c366")(false);
var IE_PROTO = __webpack_require__("613b")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "d3f4":
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "d53b":
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "d8e8":
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "e11e":
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "e853":
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__("d3f4");
var isArray = __webpack_require__("1169");
var SPECIES = __webpack_require__("2b4c")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "f6fa":
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ }),

/***/ "f751":
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__("5ca1");

$export($export.S + $export.F, 'Object', { assign: __webpack_require__("7333") });


/***/ }),

/***/ "fab2":
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__("7726").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);

// EXTERNAL MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
var setPublicPath = __webpack_require__("1eb2");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d50f023a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SimpleFlowchart.vue?vue&type=template&id=bbe421b4&scoped=true&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{key:_vm.keyFlowChart,staticClass:"flowchart-container",on:{"mousemove":_vm.handleMove,"mouseup":_vm.handleUp,"mousedown":_vm.handleDown}},[(!_vm.consultOn)?_c('div',{staticClass:"tool-wrapper"},_vm._l((_vm.nodeCategory),function(item,index){return _c('div',{key:index,staticClass:"config-tool",attrs:{"value":index},on:{"click":function($event){_vm.chosedNodes(item, index)}}},[(index == 0)?_c('div',{staticClass:"button-end"}):_vm._e(),(index == 1)?_c('div',{staticClass:"button-end-workflow"},[_c('div')]):_vm._e()])})):_vm._e(),_c('svg',{attrs:{"width":"100%","height":(_vm.height + "px"),"tabindex":"0"},on:{"keyup":function($event){if(!('button' in $event)&&_vm._k($event.keyCode,"delete",[8,46],$event.key,["Backspace","Delete"])){ return null; }return _vm.removeItems($event)}}},_vm._l((_vm.lines),function(link,index){return _c('flowchart-link',_vm._b({key:("link" + index),attrs:{"label":link.label,"state":link.state,"consultMode":_vm.consultOn,"linking":_vm.action.linking,"selectedLine":link.selectedLine},on:{"changeLineSelect":function($event){_vm.linkLabel(link, $event)},"linkSelected":function($event){_vm.linkSelected($event)}}},'flowchart-link',link,false,true))})),_vm._l((_vm.scene.nodes),function(node,index){return _c('flowchart-node',_vm._b({key:("node" + index),attrs:{"options":_vm.nodeOptions,"consultMode":_vm.consultOn},on:{"update:type":function (newType) {node.type = newType;},"linkingStart":function($event){_vm.linkingStart(node.id, node.type)},"linkingStop":function($event){_vm.linkingStop(node.id, node.type)},"nodeSelected":function($event){_vm.nodeSelected(node.id, $event, node)},"nodeTransition":function($event){_vm.nodeTransition()}}},'flowchart-node',node,false,true))})],2)}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/SimpleFlowchart.vue?vue&type=template&id=bbe421b4&scoped=true&

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.object.assign.js
var es6_object_assign = __webpack_require__("f751");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find-index.js
var es6_array_find_index = __webpack_require__("20d6");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/arrayWithoutHoles.js
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  }
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/iterableToArray.js
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/nonIterableSpread.js
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/toConsumableArray.js



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/web.dom.iterable.js
var web_dom_iterable = __webpack_require__("ac6a");

// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.array.find.js
var es6_array_find = __webpack_require__("7514");

// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/arrayWithHoles.js
function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/iterableToArrayLimit.js
function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/nonIterableRest.js
function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/builtin/es6/slicedToArray.js



function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}
// EXTERNAL MODULE: ./node_modules/core-js/modules/es6.number.constructor.js
var es6_number_constructor = __webpack_require__("c5f6");

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d50f023a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FlowchartLink.vue?vue&type=template&id=7aea48ba&scoped=true&
var FlowchartLinkvue_type_template_id_7aea48ba_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('g',{on:{"click":function($event){_vm.linkSelect($event)},"dblclick":_vm.changeLink}},[_c('defs',[_c('marker',{attrs:{"id":"arrow","viewBox":"0 0 10 10","refX":"5","refY":"5","markerWidth":"6","markerHeight":"6","orient":"auto-start-reverse"}},[_c('path',{attrs:{"d":"M 0 0 L 10 5 L 0 10 z"}})])]),_c('path',{style:(_vm.pathStyle),attrs:{"d":_vm.dAttr,"marker-end":"url(#arrow)"}}),_c('a',[_c('text',{attrs:{"text-anchor":"middle","transform":_vm.horizontal? _vm.textTransformHorizontal : _vm.textTransform,"font-size":"22"}},[_vm._v(_vm._s(_vm.text))])])])}
var FlowchartLinkvue_type_template_id_7aea48ba_scoped_true_staticRenderFns = []


// CONCATENATED MODULE: ./src/components/FlowchartLink.vue?vue&type=template&id=7aea48ba&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FlowchartLink.vue?vue&type=script&lang=js&


//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FlowchartLinkvue_type_script_lang_js_ = ({
  name: "FlowchartLink",
  props: {
    label: {
      type: String,
      default: function _default() {
        return this.text;
      }
    },
    // start point position [x, y]
    start: {
      type: Array,
      default: function _default() {
        return [0, 0];
      }
    },
    // end point position [x, y]
    end: {
      type: Array,
      default: function _default() {
        return [0, 0];
      }
    },
    type: {
      type: String,
      default: function _default() {
        return "Default";
      }
    },
    id: Number,
    horizontal: Boolean,
    linking: Boolean,
    selectedLine: {
      type: Boolean,
      default: false
    },
    consultMode: {
      type: Boolean,
      default: false
    },
    dragLine: Number
  },
  data: function data() {
    return {
      text: this.label,
      line: this.dragLine,
      select: this.selectedLine,
      show: {
        delete: false
      }
    };
  },
  methods: {
    linkSelect: function linkSelect(e) {
      this.show.delete = true;

      if (this.select === false) {
        this.select = true;
      }

      this.$emit('linkSelected', this.id);
    },
    handleMouseOver: function handleMouseOver() {
      if (this.id) {
        this.show.delete = true;
      }
    },
    handleMouseLeave: function handleMouseLeave() {
      this.show.delete = false;
      this.select = false;
    },
    caculateCenterPoint: function caculateCenterPoint() {
      // caculate arrow position: the center point between start and end
      var dx = (this.end[0] - this.start[0]) / 2;
      var dy = (this.end[1] - this.start[1]) / 2;
      return [this.start[0] + dx, this.start[1] + dy];
    },
    caculateBottomPoint: function caculateBottomPoint() {
      // caculate arrow position: the center point between start and end
      var dx = (this.end[0] - this.start[0]) / 2;
      var dy = (this.end[1] - this.start[1]) / 2;
      return [this.start[0] + dx, dy];
    },
    caculateRotation: function caculateRotation() {
      // caculate arrow rotation
      var angle = -Math.atan2(this.end[0] - this.start[0], this.end[1] - this.start[1]);
      var degree = angle * 180 / Math.PI;
      return degree < 0 ? degree + 360 : degree;
    },
    changeLink: function changeLink() {
      if (!this.consultMode) {
        this.text = prompt();
      }
    },
    deleteLink: function deleteLink() {
      this.$emit("deleteLink");
    }
  },
  watch: {
    text: function text() {
      this.$emit("changeLineLabel", this.text);
    },
    select: function select() {
      this.$emit("changeLineSelected", this.select);
    }
  },
  computed: {
    pathStyle: function pathStyle() {
      return {
        stroke: this.selectedLine ? "rgb(2, 136, 8)" : "rgb(255, 136, 85)",
        strokeWidth: 2.73205,
        fill: "none"
      };
    },
    arrowStyle: function arrowStyle() {
      return {
        stroke: "rgb(255, 136, 85)",
        strokeWidth: 5.73205,
        fill: "none"
      };
    },
    arrowTransform: function arrowTransform() {
      var _this$caculateBottomP = this.caculateBottomPoint(),
          _this$caculateBottomP2 = _slicedToArray(_this$caculateBottomP, 2),
          arrowX = _this$caculateBottomP2[0],
          arrowY = _this$caculateBottomP2[1];

      var degree = this.caculateRotation();
      return "translate(".concat(arrowX, ", ").concat(arrowY, ") rotate(").concat(degree, ")");
    },
    arrowTransformHorizontal: function arrowTransformHorizontal() {
      var _this$caculateCenterP = this.caculateCenterPoint(),
          _this$caculateCenterP2 = _slicedToArray(_this$caculateCenterP, 2),
          arrowX = _this$caculateCenterP2[0],
          arrowY = _this$caculateCenterP2[1];

      var degree = this.caculateRotation();
      return "translate(".concat(arrowX, ", ").concat(arrowY + 25, ")");
    },
    textTransform: function textTransform() {
      var _this$caculateCenterP3 = this.caculateCenterPoint(),
          _this$caculateCenterP4 = _slicedToArray(_this$caculateCenterP3, 2),
          arrowX = _this$caculateCenterP4[0],
          arrowY = _this$caculateCenterP4[1];

      var sideText = arrowX;
      var degree = this.caculateRotation();
      return "translate(".concat(sideText, ", ").concat(arrowY, ") rotate(").concat(degree, " )");
    },
    textTransformHorizontal: function textTransformHorizontal() {
      var _this$caculateCenterP5 = this.caculateCenterPoint(),
          _this$caculateCenterP6 = _slicedToArray(_this$caculateCenterP5, 2),
          arrowX = _this$caculateCenterP6[0],
          arrowY = _this$caculateCenterP6[1];

      var sideText = arrowX;
      var degree = this.caculateRotation();
      return "translate(".concat(sideText, ", ").concat(arrowY, ")");
    },
    changeTransform: function changeTransform() {
      var _this$caculateCenterP7 = this.caculateCenterPoint(),
          _this$caculateCenterP8 = _slicedToArray(_this$caculateCenterP7, 2),
          arrowX = _this$caculateCenterP8[0],
          arrowY = _this$caculateCenterP8[1];

      var change = arrowY + 35;
      var degree = this.caculateRotation();
      return "translate(".concat(arrowX, ", ").concat(change, ") rotate(").concat(degree, ")");
    },
    changeTransformHorizontal: function changeTransformHorizontal() {
      var _this$caculateCenterP9 = this.caculateCenterPoint(),
          _this$caculateCenterP10 = _slicedToArray(_this$caculateCenterP9, 2),
          arrowX = _this$caculateCenterP10[0],
          arrowY = _this$caculateCenterP10[1];

      var change = arrowY;
      var degree = this.caculateRotation();
      return "translate(".concat(arrowX, ", ").concat(change, ")");
    },
    compText: function compText() {
      var change = this.text;
      return this.$props.label = "".concat(change);
    },
    // select () {
    //   return this.$props.selectedLine = this.select;
    // },
    dAttr: function dAttr() {
      if (this.horizontal) {
        var cx = this.start[0],
            cy = this.start[1] - 45,
            ex = this.linking ? this.end[0] : this.end[0],
            ey = this.linking ? this.end[1] : this.end[1] + 33;
        var x1 = cx,
            y1 = cy,
            x2 = ex,
            y2 = ey;
        var calc = (x1 + x2) / 2;

        if (x1 < x2) {
          if (this.type === "Action" || this.type === "Join" || this.type === "Decision") {
            if (this.$parent.browser === 'firefox') {
              return "M".concat(cx, " ").concat(cy, "  H ").concat(Math.round(calc), " ").concat(calc, "  V ").concat(y2, " ").concat(ey, " H ").concat(ex - 70);
            } else {
              return "M ".concat(cx, ", ").concat(cy, " H ").concat(Math.round(calc), ",").concat(calc, ", V ").concat(y2, ",").concat(ey, " H ").concat(ex - 70);
            }
          }

          if (this.type === "End" || this.type === "endWorkflow") {
            if (this.$parent.browser === 'firefox') {
              return "M ".concat(cx, " ").concat(cy, " H ").concat(Math.round(calc), " ").concat(calc, " V ").concat(y2, " ").concat(ey - 5, " H ").concat(ex - 40);
            } else {
              return "M ".concat(cx, ", ").concat(cy, " H ").concat(Math.round(calc), ",").concat(calc, ", V ").concat(y2, ",").concat(ey - 5, " H ").concat(ex - 40);
            }
          } else {
            if (this.$parent.browser === 'firefox') {
              return "M".concat(cx, " ").concat(cy, "  H ").concat(Math.round(calc), " ").concat(calc, "  V ").concat(y2, " ").concat(ey, " H ").concat(this.dragLine ? ex : ex - 150);
            } else {
              console.log('chrome contruindo o cara salvo');
              console.log(this.dragLine);
              var mountedLine = ex - 80;
              console.log(mountedLine);
              return "M ".concat(cx, ", ").concat(cy, " H ").concat(Math.round(calc), ",").concat(calc, ", V ").concat(y2, ",").concat(ey, " H ").concat(this.dragLine ? ex - 80 : ex - 150);
            }
          }
        } else {
          cy = this.start[1];
          var nodeHeight = -100;
          var verticalLine = y1 - 150;

          if (y1 < y2 && y1 + nodeHeight > y2) {
            // console.log(verticalLine)
            // console.log(y2)
            return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(y2 + 75);
          } // 60 - 67 
          else if (y1 < y2 && y1 - y2 > nodeHeight) {
              // console.log(verticalLine, 'menor')
              // console.log(y2, 'menor')
              return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(y2 + 75);
            } else if (y1 < y2 && y1 - y2 < nodeHeight) {
              return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(y2 - 45);
            } else if (y1 < y2) {
              return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(y2 - 45);
            } else if (y1 > y2 && x2 > y2) {
              return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(y2 + 75);
            } else {
              console.log('teste');
              var yModificado = y2 + 75;
              return "M".concat(x1, " ").concat(y1, "  V").concat(this.dragLine ? y1 + this.dragLine : verticalLine, " H").concat(x2, " V").concat(yModificado);
            }
        }
      } else {
        var _cx = this.start[0],
            _cy = this.start[1] - 10,
            _ex = this.end[0],
            _ey = this.end[1];

        var _x = _cx,
            _y = _cy + 50,
            _x2 = _ex,
            _y2 = _ey - 50;

        return "M ".concat(_cx, ", ").concat(_cy, " C ").concat(_x, ", ").concat(_y, ", ").concat(_x2, ", ").concat(_y2, ", ").concat(_ex, ", ").concat(_ey);
      }
    }
  }
});
// CONCATENATED MODULE: ./src/components/FlowchartLink.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FlowchartLinkvue_type_script_lang_js_ = (FlowchartLinkvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FlowchartLink.vue?vue&type=style&index=0&id=7aea48ba&scoped=true&lang=scss&
var FlowchartLinkvue_type_style_index_0_id_7aea48ba_scoped_true_lang_scss_ = __webpack_require__("210a");

// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () { injectStyles.call(this, this.$root.$options.shadowRoot) }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functioal component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/FlowchartLink.vue






/* normalize component */

var component = normalizeComponent(
  components_FlowchartLinkvue_type_script_lang_js_,
  FlowchartLinkvue_type_template_id_7aea48ba_scoped_true_render,
  FlowchartLinkvue_type_template_id_7aea48ba_scoped_true_staticRenderFns,
  false,
  null,
  "7aea48ba",
  null
  
)

component.options.__file = "FlowchartLink.vue"
/* harmony default export */ var FlowchartLink = (component.exports);
// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules//.cache//vue-loader","cacheIdentifier":"d50f023a-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FlowchartNode.vue?vue&type=template&id=0595dfe7&scoped=true&
var FlowchartNodevue_type_template_id_0595dfe7_scoped_true_render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('div',{directives:[{name:"show",rawName:"v-show",value:(_vm.options.transition),expression:"options.transition"}],staticClass:"node-delete color"}),(_vm.type !== 'Start'&& _vm.type !== 'End' && _vm.type !== 'EndWorkflow')?_c('div',{staticClass:"flowchart-node flowchart-actions",class:{full: _vm.options.transition, selected: _vm.options.selected === _vm.id, horizontal: _vm.options.horizontal  },style:(_vm.nodeStyle),on:{"mousedown":_vm.handleMousedown,"mouseover":_vm.handleMouseOver,"mouseleave":_vm.handleMouseLeave,"dblclick":_vm.handleContent,"contextmenu":function($event){_vm.menu($event)}}},[(_vm.show.menu)?_c('div',{staticClass:"contextMenu",attrs:{"id":"context-menu"}},[_c('ul',[_c('li',{class:{active:_vm.actionType === 'Decision'},on:{"click":function($event){_vm.actionType = 'Decision'}}},[_c('p',[_vm._v("Decisão")])]),_c('li',{class:{active:_vm.actionType === 'Join'},on:{"click":function($event){_vm.actionType = 'Join'}}},[_c('p',[_vm._v("Junção")])]),_c('li',{class:{active:_vm.actionType === 'Action'},on:{"click":function($event){_vm.actionType = 'radio'}}},[_c('p',[_vm._v("Ação")])])])]):_vm._e(),(!_vm.consultMode)?_c('div',{staticClass:"node-port node-input top",on:{"mousedown":_vm.inputMouseDown,"mouseup":_vm.inputMouseUp}}):_vm._e(),(!_vm.consultMode)?_c('div',{staticClass:"node-port node-input left",on:{"mousedown":_vm.inputMouseDown,"mouseup":_vm.inputMouseUp}}):_vm._e(),_c('div',{staticClass:"node-main node-delete"},[(_vm.consultMode)?_c('div',{staticClass:"node-type-state",class:{ waiting: _vm.state === 'WAITING', pending: _vm.state === 'PENDING', approved: _vm.state === 'APPROVED', unapproved: _vm.state === 'UNAPPROVED', discontinued: _vm.state === 'DISCONTINUED', closed: _vm.state === 'CLOSED' }},[_c('div',{staticClass:"tooltip"},[(_vm.state ==='WAITING')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Aguardando\n          ")]):_vm._e(),(_vm.state ==='PENDING')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Andamento\n          ")]):_vm._e(),(_vm.state ==='APPROVED')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Concluida\n          ")]):_vm._e(),(_vm.state ==='UNAPPROVED')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Cancelada\n          ")]):_vm._e(),(_vm.state ==='CLOSED')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Encerrada\n          ")]):_vm._e(),(_vm.state ==='DISCONTINUED')?_c('span',{staticClass:"tooltiptext"},[_vm._v("Status: Não Executada\n          ")]):_vm._e()])]):_vm._e(),(_vm.type ==='Join')?_c('div',{staticClass:"node-type-icon"},[_vm._v("🞅")]):_vm._e(),(_vm.type ==='Decision')?_c('div',{staticClass:"node-type-icon desicion-node"},[_vm._v("✖")]):_vm._e(),_c('div',{staticClass:"node-label",domProps:{"textContent":_vm._s(_vm.label)}})]),(!_vm.consultMode)?_c('div',{staticClass:"node-port node-output right",on:{"mousedown":_vm.outputMouseDown}}):_vm._e(),(!_vm.consultMode)?_c('div',{staticClass:"node-port node-output bottom",on:{"mousedown":_vm.outputMouseDown}}):_vm._e()]):_vm._e(),_c('div',[(_vm.type === 'Start')?_c('div',{staticClass:"flowchart-node flowchart-start",class:{ selected: _vm.options.selected === _vm.id, horizontal: _vm.options.horizontal },style:(_vm.startStyle),on:{"mousedown":_vm.handleMousedown,"mouseover":_vm.handleMouseOver,"mouseleave":_vm.handleMouseLeave}},[_c('div',{staticClass:"node-main"},[_c('div',{staticClass:"node-label"}),(!_vm.consultMode)?_c('div',{staticClass:"node-port node-output",on:{"mousedown":_vm.outputMouseDown}}):_vm._e()])]):_vm._e()]),(_vm.type === 'End')?_c('div',{staticClass:"flowchart-node flowchart-end",class:{ selected: _vm.options.selected === _vm.id, horizontal: _vm.options.horizontal },style:(_vm.endStyle),on:{"mousedown":_vm.handleMousedown,"mouseover":_vm.handleMouseOver,"mouseleave":_vm.handleMouseLeave}},[(!_vm.consultMode)?_c('div',{staticClass:"node-port node-input",on:{"mousedown":_vm.inputMouseDown,"mouseup":_vm.inputMouseUp}}):_vm._e(),_c('div',{staticClass:"node-main"})]):_vm._e(),(_vm.type === 'EndWorkflow')?_c('div',{staticClass:"flowchart-node flowchart-end-workflow",class:{ selected: _vm.options.selected === _vm.id, horizontal: _vm.options.horizontal },style:(_vm.endStyle),on:{"mousedown":_vm.handleMousedown,"mouseover":_vm.handleMouseOver,"mouseleave":_vm.handleMouseLeave}},[(!_vm.consultMode)?_c('div',{staticClass:"node-port node-input",on:{"mousedown":_vm.inputMouseDown,"mouseup":_vm.inputMouseUp}}):_vm._e(),_vm._m(0)]):_vm._e()])}
var FlowchartNodevue_type_template_id_0595dfe7_scoped_true_staticRenderFns = [function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"node-main"},[_c('div',{staticClass:"node-label"},[_vm._v("⏺")])])}]


// CONCATENATED MODULE: ./src/components/FlowchartNode.vue?vue&type=template&id=0595dfe7&scoped=true&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/FlowchartNode.vue?vue&type=script&lang=js&

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
/* harmony default export */ var FlowchartNodevue_type_script_lang_js_ = ({
  name: "FlowchartNode",
  props: {
    id: {
      type: Number,
      default: 1000,
      validator: function validator(val) {
        return typeof val === "number";
      }
    },
    x: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return typeof val === "number";
      }
    },
    y: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return typeof val === "number";
      }
    },
    type: {
      type: String,
      default: "Default"
    },
    label: {
      type: String,
      default: "input name"
    },
    rotate: {
      type: Number,
      default: 0
    },
    disabled: {
      type: Boolean,
      default: false
    },
    consultMode: {
      type: Boolean,
      default: false
    },
    state: {
      type: String,
      default: ""
    },
    options: {
      type: Object,
      default: function _default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          rotate: 90,
          width: 400
        };
      }
    }
  },
  data: function data() {
    return {
      actionType: this.type,
      show: {
        delete: false,
        fullContent: false,
        menu: false
      }
    };
  },
  watch: {
    type: function type(value) {
      this.$emit('update:type', value);
    },
    actionType: function actionType(value) {
      this.type = value;
    }
  },
  mounted: function mounted() {},
  computed: {
    nodeStyle: function nodeStyle() {
      if (this.show.fullContent) {
        return {
          top: this.options.centerY - 2 + this.y * this.options.scale + "px",
          // remove: this.options.offsetTop +
          left: this.options.centerX - 160 + this.x * this.options.scale + "px",
          // remove: this.options.offsetLeft +
          transform: "scale(".concat(this.options.scale, ")"),
          width: this.options.width + "px"
        };
      } else {
        return {
          top: this.options.centerY - 2 + this.y * this.options.scale + "px",
          // remove: this.options.offsetTop +
          left: this.options.centerX - 20 + this.x * this.options.scale + "px",
          // remove: this.options.offsetLeft +
          transform: "scale(".concat(this.options.scale, ")"),
          width: 120 + "px"
        };
      }
    },
    startStyle: function startStyle() {
      return {
        top: this.options.centerY - 2 + this.y * this.options.scale + "px",
        // remove: this.options.offsetTop +
        left: this.options.centerX + 15 + this.x * this.options.scale + "px",
        // remove: this.options.offsetLeft +
        transform: "scale(".concat(this.options.scale, ")")
      };
    },
    endStyle: function endStyle() {
      return {
        top: this.options.centerY + this.y * this.options.scale + "px",
        // remove: this.options.offsetTop +
        left: this.options.centerX + 15 + this.x * this.options.scale + "px",
        // remove: this.options.offsetLeft +
        transform: "scale(".concat(this.options.scale, ")")
      };
    }
  },
  methods: {
    menu: function menu($event) {
      var _this = this;

      if (!this.consultMode) {
        $event.preventDefault();
        this.show.menu = true;
        window.addEventListener("click", function () {
          _this.show.menu = false;
        });
      }
    },
    handleContent: function handleContent() {
      if (!this.show.fullContent) {
        this.$emit('nodeTransition');
        this.show.fullContent = true;
      } else {
        this.$emit('nodeTransition'); // alert('to aqui ')

        this.show.fullContent = false;
        this.$emit('canvasClick');
      }
    },
    handleMousedown: function handleMousedown(e) {
      var target = e.target || e.srcElement; // console.log(target);

      if (target.className.indexOf("node-input") < 0 && target.className.indexOf("node-output") < 0) {
        this.$emit("nodeSelected", e);
      }

      e.preventDefault();
    },
    handleMouseOver: function handleMouseOver() {
      this.show.delete = true;
    },
    handleMouseLeave: function handleMouseLeave() {
      this.show.delete = false;
    },
    outputMouseDown: function outputMouseDown(e) {
      this.$emit("linkingStart");
      e.preventDefault();
    },
    inputMouseDown: function inputMouseDown(e) {
      e.preventDefault();
    },
    inputMouseUp: function inputMouseUp(e) {
      this.$emit("linkingStop");
      e.preventDefault();
    }
  }
});
// CONCATENATED MODULE: ./src/components/FlowchartNode.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_FlowchartNodevue_type_script_lang_js_ = (FlowchartNodevue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/FlowchartNode.vue?vue&type=style&index=0&id=0595dfe7&scoped=true&lang=scss&
var FlowchartNodevue_type_style_index_0_id_0595dfe7_scoped_true_lang_scss_ = __webpack_require__("37b2");

// CONCATENATED MODULE: ./src/components/FlowchartNode.vue






/* normalize component */

var FlowchartNode_component = normalizeComponent(
  components_FlowchartNodevue_type_script_lang_js_,
  FlowchartNodevue_type_template_id_0595dfe7_scoped_true_render,
  FlowchartNodevue_type_template_id_0595dfe7_scoped_true_staticRenderFns,
  false,
  null,
  "0595dfe7",
  null
  
)

FlowchartNode_component.options.__file = "FlowchartNode.vue"
/* harmony default export */ var FlowchartNode = (FlowchartNode_component.exports);
// CONCATENATED MODULE: ./src/assets/utilty/position.js
/**
 * @param element {HTMLElement}
 * @return {{top: number, left: number}}
 */
function getOffsetRect(element) {
  var box = element.getBoundingClientRect();
  var scrollTop = window.pageYOffset;
  var scrollLeft = window.pageXOffset;
  var top = box.top + scrollTop;
  var left = box.left + scrollLeft;
  return {
    top: Math.round(top),
    left: Math.round(left)
  };
}
/**
 * @param event {MouseEvent}
 * @param element {HTMLElement}
 * @return {{x: number, y: number}}
 */


function getMousePosition(element, event) {
  var mouseX = event.pageX || event.clientX + document.documentElement.scrollLeft;
  var mouseY = event.pageY || event.clientY + document.documentElement.scrollTop;
  var offset = getOffsetRect(element);
  var x = mouseX - offset.left;
  var y = mouseY - offset.top;
  return [x, y];
}


// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/vue-loader/lib??vue-loader-options!./src/components/SimpleFlowchart.vue?vue&type=script&lang=js&







//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//



/* harmony default export */ var SimpleFlowchartvue_type_script_lang_js_ = ({
  name: "VueFlowchart",
  props: {
    nodesAction: {
      type: Object,
      default: function _default() {
        return {};
      }
    },
    scene: {
      type: Object,
      default: function _default() {
        return {
          centerX: 1024,
          scale: 1,
          centerY: 140,
          nodes: [],
          links: []
        };
      }
    },
    height: {
      type: Number,
      default: 400
    },
    horizontalStyle: {
      type: Boolean,
      default: false
    },
    consult: {
      type: Boolean,
      default: false
    },
    activeNode: {
      type: Object,
      required: false
    }
  },
  data: function data() {
    return {
      newNodeType: 0,
      newNodeLabel: "",
      consultOn: this.consult,
      keyFlowChart: 0,
      browser: '',
      nodeCategory: ["End", "EndWorkflow"],
      action: {
        linking: false,
        dragging: false,
        scrolling: false,
        selected: 0,
        transition: false
      },
      item: {
        text: ""
      },
      mouse: {
        x: 0,
        y: 0,
        lastX: 0,
        lastY: 0
      },
      offset: 150,
      draggingLink: null,
      selectedLine: null,
      idSelectedLine: 0,
      selectedNode: this.nodeSelected,
      rootDivOffset: {
        top: 0,
        left: 0
      }
    };
  },
  components: {
    FlowchartLink: FlowchartLink,
    FlowchartNode: FlowchartNode
  },
  watch: {
    selectedNode: function selectedNode() {
      this.$emit('update:activeNode', this.selectedNode);
    }
  },
  computed: {
    nodeOptions: function nodeOptions() {
      return {
        centerY: this.scene.centerY,
        centerX: this.scene.centerX,
        scale: this.scene.scale,
        offsetTop: this.rootDivOffset.top,
        offsetLeft: this.rootDivOffset.left,
        selected: this.selectedNode.id,
        width: 400,
        transition: this.action.transition,
        horizontal: this.horizontalStyle
      };
    },
    lines: function lines() {
      var _this = this;

      // this.scene.links.map(element => { });
      var lines = this.scene.links.map(function (link) {
        var fromNode = _this.findNodeWithID(link.from);

        var toNode = _this.findNodeWithID(link.to); // let labelLine = this


        var x, y, cy, cx, ex, ey;
        x = _this.scene.centerX + fromNode.x;
        y = _this.scene.centerY + fromNode.y;

        var _this$getPortPosition = _this.getPortPosition("bottom", x, y);

        var _this$getPortPosition2 = _slicedToArray(_this$getPortPosition, 2);

        cx = _this$getPortPosition2[0];
        cy = _this$getPortPosition2[1];
        x = _this.scene.centerX + toNode.x;
        y = _this.scene.centerY + toNode.y;

        var _this$getPortPosition3 = _this.getPortPosition("top", x, y);

        var _this$getPortPosition4 = _slicedToArray(_this$getPortPosition3, 2);

        ex = _this$getPortPosition4[0];
        ey = _this$getPortPosition4[1];
        // console.log(link.selectedLine)
        return {
          start: [cx, cy],
          end: [ex, ey],
          id: link.id,
          label: link.label,
          state: link.state,
          from: fromNode,
          horizontal: _this.horizontalStyle,
          dragLine: _this.offset,
          selectedLine: link.selectedLine,
          type: link.type
        };
      });

      if (this.draggingLink) {
        var x, y, cy, cx;
        var fromNode = this.findNodeWithID(this.draggingLink.from);
        x = this.scene.centerX + fromNode.x;
        y = this.scene.centerY + fromNode.y;

        var _this$getPortPosition5 = this.getPortPosition("bottom", x, y);

        var _this$getPortPosition6 = _slicedToArray(_this$getPortPosition5, 2);

        cx = _this$getPortPosition6[0];
        cy = _this$getPortPosition6[1];
        // push temp dragging link, mouse cursor postion = link end postion
        lines.push({
          start: [cx, cy],
          end: [this.draggingLink.mx, this.draggingLink.my],
          label: "",
          horizontal: this.horizontalStyle,
          dragLine: 200
        });
      }

      return lines;
    }
  },
  mounted: function mounted() {
    this.rootDivOffset.top = this.$el ? this.$el.offsetTop : 0;
    this.rootDivOffset.left = this.$el ? this.$el.offsetLeft : 0; // console.log(22222, this.rootDivOffset);

    this.identific_nav();
  },
  methods: {
    removeItems: function removeItems() {
      // alert('estrutura ta funcionando ')
      if (this.action.selected != null) {
        this.deleteNodeButtom();
      } else {
        this.deleteButtom();
      }
    },
    identific_nav: function identific_nav() {
      var nav = navigator.userAgent.toLowerCase();
      var browser = "";

      if (nav.indexOf("msie") != -1) {
        browser = "msie";
      } else if (nav.indexOf("opera") != -1) {
        browser = "opera";
      } else if (nav.indexOf("mozilla") != -1) {
        if (nav.indexOf("firefox") != -1) {
          browser = "firefox";
        } else if (nav.indexOf("firefox") != -1) {
          browser = "mozilla";
        } else if (nav.indexOf("chrome") != -1) {
          browser = "chrome";
        }
      } else {
        alert("Navegador desconhecido!");
      }

      this.browser = browser;
    },
    deleteButtom: function deleteButtom() {
      this.linkDelete(this.idSelectedLine);
    },
    deleteNodeButtom: function deleteNodeButtom() {
      this.nodeDelete(this.selectedNode.id);
      this.selectedNode = {};
    },
    nodeDelete: function nodeDelete(id) {
      // console.log(id)
      if (!this.consultOn) {
        var findNodeFrom = this.scene.nodes.find(function (node) {
          return node.id;
        });
        findNodeFrom['disabled'] = false;
        this.scene.nodes = this.scene.nodes.filter(function (node) {
          return node.id !== id;
        });
        this.scene.links = this.scene.links.filter(function (link) {
          return link.to !== id;
        });
        this.scene.links = this.scene.links.filter(function (link) {
          return link.from !== id;
        });
        this.$emit("nodeDelete", id);
      }
    },
    linkLabel: function linkLabel(link, payload) {
      if (!this.consultOn) {
        var deletedLink = this.scene.links.find(function (item) {
          return item.id === link.id;
        });

        if (deletedLink) {
          deletedLink.label = payload;
        }
      }
    },
    linkSelected: function linkSelected(id) {
      var _this2 = this;

      if (!this.consultOn) {
        var me = this;
        me.idSelectedLine = id;
        me.selectedNode = {};
        me.action.selected = null;
        me.$nextTick(function () {
          _this2.scene.links.forEach(function (element) {
            if (element.id === id) {
              element.selectedLine = !element.selectedLine;
            } else {
              element.selectedLine = false;
            }
          });
        });
      }
    },
    chosedNodes: function chosedNodes(item, index) {
      this.newNodeType = index;
      this.addNode();
    },
    addNode: function addNode() {
      var max = Math.max.apply(Math, this.scene.nodes.map(function (o) {
        return o.id;
      }));
      this.scene.nodes.push({
        id: max + 1,
        x: -400,
        y: 50,
        type: this.nodeCategory[this.newNodeType],
        label: this.newNodeLabel ? this.newNodeLabel : "test".concat(max + 1)
      });
    },
    findNodeWithID: function findNodeWithID(id) {
      return this.scene.nodes.find(function (item) {
        return id === item.id;
      });
    },
    getPortPosition: function getPortPosition(type, x, y) {
      if (type === "top") {
        return [x + 40, y];
      } else if (type === "bottom") {
        return [x + 40, y + 80];
      }
    },
    linkingStart: function linkingStart(index, type) {
      this.action.linking = true;
      this.draggingType = type;
      this.draggingLink = {
        from: index,
        mx: 0,
        my: 0,
        dragLine: 0
      };
    },
    linkingStop: function linkingStop(index, type) {
      var _this3 = this;

      // add new Link
      if (this.draggingLink && this.draggingLink.from !== index) {
        // check link existence
        var existed = this.scene.links.find(function (link) {
          return link.from === _this3.draggingLink.from && link.to === index;
        });

        if (type === "Decision") {
          existed = this.scene.links.find(function (link) {
            return link.to === index;
          });
        }

        if (!existed) {
          var maxID = Math.max.apply(Math, [0].concat(_toConsumableArray(this.scene.links.map(function (link) {
            return link.id;
          })))); // console.log(type)

          var newLink = {
            id: maxID + 1,
            from: this.draggingLink.from,
            to: index,
            type: type,
            selectedLine: false
          };
          var findNodeFrom = this.scene.nodes.find(function (node) {
            return node.id === _this3.draggingLink.from;
          });
          var parentNodes = this.scene.links.map(function (element) {
            return element.from;
          });
          var disabled = findNodeFrom.disabled;

          if (this.draggingType === "Start") {
            if (type === 'Action') {
              if (!disabled) {
                findNodeFrom['disabled'] = true;
                this.scene.links.push(newLink);
                this.$emit("linkAdded", newLink);
              } else {
                this.$emit('not-allowed');
              }
            } else {
              this.$emit('not-allowed');
            }
          }

          if (this.draggingType === "Action") {
            if (!disabled) {
              findNodeFrom['disabled'] = true;
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            } else if (disabled && type === "Action") {
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            } else {
              this.$emit('not-allowed');
            }
          }

          if (this.draggingType === "Join") {
            if (type !== "Action") {
              this.$emit('not-allowed');
            } else if (disabled && type === "Action") {
              this.$emit('not-allowed');
            } else {
              findNodeFrom['disabled'] = true;
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
          }

          if (this.draggingType === "Decision") {
            if (type === "Join" || type === "Decision") {
              this.$emit('not-allowed');
            } else {
              this.scene.links.push(newLink);
              this.$emit("linkAdded", newLink);
            }
          }
        } else {
          this.$emit('not-allowed');
        }
      }

      this.draggingLink = null;
    },
    linkDelete: function linkDelete(id) {
      // debugger
      if (!this.consultOn) {
        var deletedLink = this.scene.links.find(function (item) {
          return item.id === id;
        });
        var findNodeFromDelete = this.scene.nodes.find(function (node) {
          return node.id === deletedLink.from;
        });
        var deletedLinkChild = this.scene.nodes.find(function (item) {
          return item.id === deletedLink.to;
        });

        if (deletedLink) {
          this.scene.links = this.scene.links.filter(function (item) {
            return item.id !== id;
          });
          this.selectedLine = {};

          if (deletedLinkChild.type === 'End' || deletedLinkChild.type === 'EndWorkflow') {
            findNodeFromDelete['disabled'] = false;
            this.$emit("linkBreak", deletedLink);
          } else if (findNodeFromDelete.type === "Start" || findNodeFromDelete.type === "Action") {
            findNodeFromDelete['disabled'] = false;
          } else {
            this.$emit("linkBreak", deletedLink);
          }
        }
      }
    },
    nodeTransition: function nodeTransition() {
      var me = this;
      this.action.transition = !this.action.transition;
      setTimeout(function () {
        me.action.transition = false;
      }, 500);
    },
    nodeSelected: function nodeSelected(id, e, node) {
      this.selectedNode = node;
      this.action.selected = node.id;
      this.action.dragging = id;
      this.$emit("nodeClick", id);
      this.mouse.lastX = e.pageX || e.clientX + document.documentElement.scrollLeft;
      this.mouse.lastY = e.pageY || e.clientY + document.documentElement.scrollTop; // if (this.consultOn) {
      //   this.selectedNode =
      // }
    },
    handleMove: function handleMove(e) {
      if (this.action.linking) {
        var _getMousePosition = getMousePosition(this.$el, e);

        var _getMousePosition2 = _slicedToArray(_getMousePosition, 2);

        this.mouse.x = _getMousePosition2[0];
        this.mouse.y = _getMousePosition2[1];
        var _ref = [this.mouse.x, this.mouse.y];
        this.draggingLink.mx = _ref[0];
        this.draggingLink.my = _ref[1];
      }

      if (this.action.dragging) {
        this.mouse.x = e.pageX || e.clientX + document.documentElement.scrollLeft;
        this.mouse.y = e.pageY || e.clientY + document.documentElement.scrollTop;
        var diffX = this.mouse.x - this.mouse.lastX;
        var diffY = this.mouse.y - this.mouse.lastY;
        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.moveSelectedNode(diffX, diffY);
      }

      if (this.action.scrolling) {
        var _getMousePosition3 = getMousePosition(this.$el, e);

        var _getMousePosition4 = _slicedToArray(_getMousePosition3, 2);

        this.mouse.x = _getMousePosition4[0];
        this.mouse.y = _getMousePosition4[1];

        var _diffX = this.mouse.x - this.mouse.lastX;

        var _diffY = this.mouse.y - this.mouse.lastY;

        this.mouse.lastX = this.mouse.x;
        this.mouse.lastY = this.mouse.y;
        this.scene.centerX += _diffX;
        this.scene.centerY += _diffY; // this.hasDragged = true
      } // if (this.selectedLine.selectedLine) {
      //   debugger
      //   this.action.scrolling = false
      //   this.mouse.x =
      //     e.pageX || e.clientX + document.documentElement.scrollLeft;
      //   this.mouse.y =
      //     e.pageY || e.clientY + document.documentElement.scrollTop;
      //   let diffX = this.mouse.x - this.mouse.lastX;
      //   let diffY = this.mouse.y - this.mouse.lastY;
      //   this.mouse.lastX = this.mouse.x;
      //   this.mouse.lastY = this.mouse.y;
      //   this.moveSelectedLine(this.mouse.y);
      // }

    },
    handleUp: function handleUp(e) {
      var target = e.target || e.srcElement;

      if (this.$el.contains(target)) {
        if (typeof target.className !== "string" || target.className.indexOf("node-input") < 0) {
          this.draggingLink = null;
        } // if (
        //   typeof target.className === "string" &&
        //   target.className.indexOf("node-delete") > -1
        // ) {
        //   // console.log('delete2', this.action.dragging);
        //   this.nodeDelete(this.action.dragging);
        // }

      }

      this.action.linking = false;
      this.action.dragging = null;
      this.action.scrolling = false; // this.selectedLine.selectedLine = false;
    },
    handleDown: function handleDown(e) {
      var target = e.target || e.srcElement; // console.log('for scroll', target, e.keyCode, e.which)

      if ((target === this.$el || target.matches("svg, svg *")) && e.which === 1) {
        this.action.scrolling = true;

        var _getMousePosition5 = getMousePosition(this.$el, e);

        var _getMousePosition6 = _slicedToArray(_getMousePosition5, 2);

        this.mouse.lastX = _getMousePosition6[0];
        this.mouse.lastY = _getMousePosition6[1];
      } //descelectLine
      // this.selectedLine.selectedLine = false


      this.selectedLine = {};
      this.$emit("canvasClick", e);
    },
    moveSelectedLine: function moveSelectedLine(dy) {
      var _this4 = this;

      var index = this.scene.links.findIndex(function (item) {
        return item.id === _this4.selectedLine.id;
      }); // alert(index)

      var top = dy / this.scene.scale;
      this.offset = top;
    },
    moveSelectedNode: function moveSelectedNode(dx, dy) {
      var _this5 = this;

      var index = this.scene.nodes.findIndex(function (item) {
        return item.id === _this5.action.dragging;
      });
      var left = this.scene.nodes[index].x + dx / this.scene.scale;
      var top = this.scene.nodes[index].y + dy / this.scene.scale;
      this.$set(this.scene.nodes, index, Object.assign(this.scene.nodes[index], {
        x: left,
        y: top
      }));
    }
  }
});
// CONCATENATED MODULE: ./src/components/SimpleFlowchart.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_SimpleFlowchartvue_type_script_lang_js_ = (SimpleFlowchartvue_type_script_lang_js_); 
// EXTERNAL MODULE: ./src/components/SimpleFlowchart.vue?vue&type=style&index=0&id=bbe421b4&scoped=true&lang=scss&
var SimpleFlowchartvue_type_style_index_0_id_bbe421b4_scoped_true_lang_scss_ = __webpack_require__("3872");

// CONCATENATED MODULE: ./src/components/SimpleFlowchart.vue






/* normalize component */

var SimpleFlowchart_component = normalizeComponent(
  components_SimpleFlowchartvue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  "bbe421b4",
  null
  
)

SimpleFlowchart_component.options.__file = "SimpleFlowchart.vue"
/* harmony default export */ var SimpleFlowchart = (SimpleFlowchart_component.exports);
// CONCATENATED MODULE: ./src/index.js

/* harmony default export */ var src = (SimpleFlowchart);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (src);



/***/ }),

/***/ "fdef":
/***/ (function(module, exports) {

module.exports = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
  '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029\uFEFF';


/***/ })

/******/ });
});
//# sourceMappingURL=vue-flowchart.umd.js.map