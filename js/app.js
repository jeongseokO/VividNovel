"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _React = React,
  useState = _React.useState,
  useRef = _React.useRef;
var voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];
function App() {
  var _useState = useState('upload'),
    _useState2 = _slicedToArray(_useState, 2),
    step = _useState2[0],
    setStep = _useState2[1];
  var _useState3 = useState(null),
    _useState4 = _slicedToArray(_useState3, 2),
    file = _useState4[0],
    setFile = _useState4[1];
  var _useState5 = useState(''),
    _useState6 = _slicedToArray(_useState5, 2),
    novelText = _useState6[0],
    setNovelText = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    novelData = _useState8[0],
    setNovelData = _useState8[1];
  var _useState9 = useState([]),
    _useState0 = _slicedToArray(_useState9, 2),
    scenes = _useState0[0],
    setScenes = _useState0[1];
  var audioRef = useRef(null);
  var _useState1 = useState(0),
    _useState10 = _slicedToArray(_useState1, 2),
    currentSceneIdx = _useState10[0],
    setCurrentSceneIdx = _useState10[1];
  var handleFile = function handleFile(e) {
    return setFile(e.target.files[0]);
  };
  function readFile(_x) {
    return _readFile.apply(this, arguments);
  }
  function _readFile() {
    _readFile = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee(f) {
      var array, pdf, text, i, page, content;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            if (!(f.type === 'application/pdf')) {
              _context.n = 8;
              break;
            }
            _context.n = 1;
            return f.arrayBuffer();
          case 1:
            array = _context.v;
            _context.n = 2;
            return pdfjsLib.getDocument({
              data: array
            }).promise;
          case 2:
            pdf = _context.v;
            text = '';
            i = 1;
          case 3:
            if (!(i <= pdf.numPages)) {
              _context.n = 7;
              break;
            }
            _context.n = 4;
            return pdf.getPage(i);
          case 4:
            page = _context.v;
            _context.n = 5;
            return page.getTextContent();
          case 5:
            content = _context.v;
            text += content.items.map(function (item) {
              return item.str;
            }).join(' ') + '\n';
          case 6:
            i++;
            _context.n = 3;
            break;
          case 7:
            return _context.a(2, text);
          case 8:
            _context.n = 9;
            return f.text();
          case 9:
            return _context.a(2, _context.v);
        }
      }, _callee);
    }));
    return _readFile.apply(this, arguments);
  }
  function startGenerate() {
    return _startGenerate.apply(this, arguments);
  }
  function _startGenerate() {
    _startGenerate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
      var text, res, data;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            if (file) {
              _context2.n = 1;
              break;
            }
            alert('파일을 선택하세요.');
            return _context2.a(2);
          case 1:
            _context2.n = 2;
            return readFile(file);
          case 2:
            text = _context2.v;
            setNovelText(text);
            _context2.n = 3;
            return fetch('data/novel.json');
          case 3:
            res = _context2.v;
            _context2.n = 4;
            return res.json();
          case 4:
            data = _context2.v;
            setNovelData(data);
            setStep('setup');
          case 5:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _startGenerate.apply(this, arguments);
  }
  function handleVoiceChange(idx, voice) {
    setNovelData(function (prev) {
      return _objectSpread(_objectSpread({}, prev), {}, {
        characters: prev.characters.map(function (c, i) {
          return i === idx ? _objectSpread(_objectSpread({}, c), {}, {
            voice: voice
          }) : c;
        })
      });
    });
  }
  function chunkText(text) {
    var size = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 300;
    var chunks = [];
    var idx = 0;
    while (idx < text.length) {
      chunks.push(text.slice(idx, idx + size));
      idx += size;
    }
    return chunks;
  }
  function generateScene(_x2) {
    return _generateScene.apply(this, arguments);
  }
  function _generateScene() {
    _generateScene = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(idx) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            return _context3.a(2, new Promise(function (resolve) {
              setTimeout(function () {
                var src = "https://placehold.co/400x300?text=Scene+".concat(idx + 1);
                setScenes(function (prev) {
                  return [].concat(_toConsumableArray(prev), [src]);
                });
                resolve();
              }, 500);
            }));
        }
      }, _callee3);
    }));
    return _generateScene.apply(this, arguments);
  }
  function generateAudio(_x3) {
    return _generateAudio.apply(this, arguments);
  }
  function _generateAudio() {
    _generateAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(text) {
      var voices, res, data;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            voices = {};
            novelData.characters.forEach(function (c) {
              return voices[c.name] = c.voice;
            });
            _context4.n = 1;
            return fetch('/tts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                script: "\uB098\uB808\uC774\uC158: ".concat(text),
                voices: voices
              })
            });
          case 1:
            res = _context4.v;
            _context4.n = 2;
            return res.json();
          case 2:
            data = _context4.v;
            return _context4.a(2, "data:audio/wav;base64,".concat(data.audio));
        }
      }, _callee4);
    }));
    return _generateAudio.apply(this, arguments);
  }
  function startPlay() {
    return _startPlay.apply(this, arguments);
  }
  function _startPlay() {
    _startPlay = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
      var chunks, preloadCount, i, _i, src, nextSceneIdx;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            setStep('play');
            chunks = chunkText(novelText);
            preloadCount = Math.min(5, chunks.length);
            i = 0;
          case 1:
            if (!(i < preloadCount)) {
              _context5.n = 3;
              break;
            }
            _context5.n = 2;
            return generateScene(i);
          case 2:
            i++;
            _context5.n = 1;
            break;
          case 3:
            _i = 0;
          case 4:
            if (!(_i < chunks.length)) {
              _context5.n = 7;
              break;
            }
            setCurrentSceneIdx(_i);
            _context5.n = 5;
            return generateAudio(chunks[_i]);
          case 5:
            src = _context5.v;
            audioRef.current.pause();
            audioRef.current.src = src;
            audioRef.current.play();
            nextSceneIdx = _i + preloadCount;
            if (nextSceneIdx < chunks.length) {
              generateScene(nextSceneIdx);
            }
            _context5.n = 6;
            return new Promise(function (res) {
              return setTimeout(res, 5000);
            });
          case 6:
            _i++;
            _context5.n = 4;
            break;
          case 7:
            audioRef.current.pause();
          case 8:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _startPlay.apply(this, arguments);
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("h1", null, "VividNovel")), /*#__PURE__*/React.createElement("main", {
    className: "main"
  }, step !== 'play' && /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, step === 'upload' && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", null, "\uC18C\uC124 \uD30C\uC77C(txt, pdf)\uC744 \uC5C5\uB85C\uB4DC\uD558\uC138\uC694."), /*#__PURE__*/React.createElement("input", {
    type: "file",
    onChange: handleFile,
    accept: ".txt,.text,.pdf"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: startGenerate
  }, "\uC0DD\uC131 \uC2DC\uC791")), step === 'setup' && novelData && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", null, "\uB4F1\uC7A5\uC778\uBB3C & \uBC30\uACBD"), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, novelData.characters.map(function (ch, idx) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      key: idx
    }, /*#__PURE__*/React.createElement("img", {
      src: ch.profileImage,
      alt: ch.name
    }), /*#__PURE__*/React.createElement("h3", null, ch.name), /*#__PURE__*/React.createElement("p", null, ch.appearance), /*#__PURE__*/React.createElement("p", null, ch.personality), /*#__PURE__*/React.createElement("label", null, "Voice:", /*#__PURE__*/React.createElement("select", {
      value: ch.voice,
      onChange: function onChange(e) {
        return handleVoiceChange(idx, e.target.value);
      }
    }, voiceOptions.map(function (v) {
      return /*#__PURE__*/React.createElement("option", {
        key: v,
        value: v
      }, v);
    }))));
  })), /*#__PURE__*/React.createElement("h2", null, "\uBC30\uACBD"), /*#__PURE__*/React.createElement("div", {
    className: "flex"
  }, novelData.backgrounds.map(function (bg, idx) {
    return /*#__PURE__*/React.createElement("div", {
      className: "card",
      key: idx
    }, /*#__PURE__*/React.createElement("img", {
      src: bg.image,
      alt: bg.name
    }), /*#__PURE__*/React.createElement("h3", null, bg.name), /*#__PURE__*/React.createElement("p", null, bg.mood));
  })), /*#__PURE__*/React.createElement("button", {
    onClick: startPlay
  }, "\uC7AC\uC0DD \uC2DC\uC791"))), step === 'play' && /*#__PURE__*/React.createElement("div", {
    className: "scene-wrapper"
  }, scenes[currentSceneIdx] && /*#__PURE__*/React.createElement("img", {
    src: scenes[currentSceneIdx],
    alt: "Scene ".concat(currentSceneIdx + 1),
    className: "scene-image"
  }), /*#__PURE__*/React.createElement("audio", {
    ref: audioRef
  }))));
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));