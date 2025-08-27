"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var _React = React,
  useState = _React.useState,
  useEffect = _React.useEffect,
  useRef = _React.useRef;
var voiceOptions = ['Zephyr', 'Leda', 'Luca', 'Apollo', 'Charon'];
function App() {
  var _useState = useState('home'),
    _useState2 = _slicedToArray(_useState, 2),
    view = _useState2[0],
    setView = _useState2[1]; // 'home','upload','characters','backgrounds','episodes','play'
  var _useState3 = useState(function () {
      var saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : [];
    }),
    _useState4 = _slicedToArray(_useState3, 2),
    projects = _useState4[0],
    setProjects = _useState4[1];
  var _useState5 = useState(null),
    _useState6 = _slicedToArray(_useState5, 2),
    selectedId = _useState6[0],
    setSelectedId = _useState6[1];
  var _useState7 = useState(null),
    _useState8 = _slicedToArray(_useState7, 2),
    file = _useState8[0],
    setFile = _useState8[1];
  var _useState9 = useState(null),
    _useState0 = _slicedToArray(_useState9, 2),
    novelData = _useState0[0],
    setNovelData = _useState0[1];
  var _useState1 = useState([]),
    _useState10 = _slicedToArray(_useState1, 2),
    scenes = _useState10[0],
    setScenes = _useState10[1];
  var _useState11 = useState(0),
    _useState12 = _slicedToArray(_useState11, 2),
    currentSceneIdx = _useState12[0],
    setCurrentSceneIdx = _useState12[1];
  var _useState13 = useState([]),
    _useState14 = _slicedToArray(_useState13, 2),
    audioSources = _useState14[0],
    setAudioSources = _useState14[1];
  var _useState15 = useState([]),
    _useState16 = _slicedToArray(_useState15, 2),
    publicProjects = _useState16[0],
    setPublicProjects = _useState16[1];
  var _useState17 = useState(8),
    _useState18 = _slicedToArray(_useState17, 2),
    publicCount = _useState18[0],
    setPublicCount = _useState18[1];
  var _useState19 = useState(8),
    _useState20 = _slicedToArray(_useState19, 2),
    showMyCount = _useState20[0],
    setShowMyCount = _useState20[1];
  var _useState21 = useState(false),
    _useState22 = _slicedToArray(_useState21, 2),
    isAudioLoading = _useState22[0],
    setIsAudioLoading = _useState22[1];
  var _useState23 = useState(false),
    _useState24 = _slicedToArray(_useState23, 2),
    playing = _useState24[0],
    setPlaying = _useState24[1];
  var audioRef = useRef(null);
  useEffect(function () {
    localStorage.setItem('projects', JSON.stringify(projects));
  }, [projects]);
  useEffect(function () {
    fetch('data/public-projects.json').then(function (res) {
      return res.json();
    }).then(setPublicProjects);
  }, []);
  useEffect(function () {
    if (view !== 'home') return;
    function onScroll() {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        setPublicCount(function (c) {
          return Math.min(publicProjects.length, c + 8);
        });
      }
    }
    window.addEventListener('scroll', onScroll);
    return function () {
      return window.removeEventListener('scroll', onScroll);
    };
  }, [view, publicProjects.length]);
  function openProject(id) {
    var project = projects.find(function (p) {
      return p.id === id;
    });
    if (!project) return;
    setSelectedId(id);
    setFile(null);
    setNovelData(project.novelData || null);
    setView(project.step || 'upload');
  }
  function handleNewProject() {
    var id = Date.now();
    var project = {
      id: id,
      name: '제목 없음',
      step: 'upload',
      novelText: '',
      novelData: null
    };
    setProjects(function (prev) {
      return [].concat(_toConsumableArray(prev), [project]);
    });
    openProject(id);
  }
  function updateProject(id, data) {
    setProjects(function (prev) {
      return prev.map(function (p) {
        return p.id === id ? _objectSpread(_objectSpread({}, p), data) : p;
      });
    });
  }
  function handleDrop(e) {
    e.preventDefault();
    var f = e.dataTransfer.files && e.dataTransfer.files[0];
    if (f) {
      setFile(f);
      startGenerate(f);
    }
  }
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
            text += content.items.map(function (it) {
              return it.str;
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
  function startGenerate(_x2) {
    return _startGenerate.apply(this, arguments);
  }
  function _startGenerate() {
    _startGenerate = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2(f) {
      var target, text, res, data;
      return _regenerator().w(function (_context2) {
        while (1) switch (_context2.n) {
          case 0:
            target = f || file;
            if (!(!target || selectedId === null)) {
              _context2.n = 1;
              break;
            }
            alert('파일을 선택하세요.');
            return _context2.a(2);
          case 1:
            _context2.n = 2;
            return readFile(target);
          case 2:
            text = _context2.v;
            _context2.n = 3;
            return fetch('data/novel.json');
          case 3:
            res = _context2.v;
            _context2.n = 4;
            return res.json();
          case 4:
            data = _context2.v;
            updateProject(selectedId, {
              step: 'characters',
              novelText: text,
              novelData: data
            });
            setNovelData(data);
            setView('characters');
          case 5:
            return _context2.a(2);
        }
      }, _callee2);
    }));
    return _startGenerate.apply(this, arguments);
  }
  function handleVoiceChange(idx, voice) {
    if (!novelData) return;
    var updated = _objectSpread(_objectSpread({}, novelData), {}, {
      characters: novelData.characters.map(function (c, i) {
        return i === idx ? _objectSpread(_objectSpread({}, c), {}, {
          voice: voice
        }) : c;
      })
    });
    setNovelData(updated);
    updateProject(selectedId, {
      novelData: updated
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
  function generateScene(_x3) {
    return _generateScene.apply(this, arguments);
  }
  function _generateScene() {
    _generateScene = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3(idx) {
      return _regenerator().w(function (_context3) {
        while (1) switch (_context3.n) {
          case 0:
            return _context3.a(2, new Promise(function (resolve) {
              setTimeout(function () {
                var src = "https://placehold.co/800x600?text=Scene+".concat(idx + 1);
                resolve(src);
              }, 500);
            }));
        }
      }, _callee3);
    }));
    return _generateScene.apply(this, arguments);
  }
  function generateAudio(_x4) {
    return _generateAudio.apply(this, arguments);
  }
  function _generateAudio() {
    _generateAudio = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4(text) {
      var voices, res, data;
      return _regenerator().w(function (_context4) {
        while (1) switch (_context4.n) {
          case 0:
            if (novelData) {
              _context4.n = 1;
              break;
            }
            return _context4.a(2, '');
          case 1:
            voices = {};
            novelData.characters.forEach(function (c) {
              return voices[c.name] = c.voice;
            });
            _context4.n = 2;
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
          case 2:
            res = _context4.v;
            _context4.n = 3;
            return res.json();
          case 3:
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
      var project, chunks, newScenes, newAudios, i, sceneSrc, audioSrc;
      return _regenerator().w(function (_context5) {
        while (1) switch (_context5.n) {
          case 0:
            project = projects.find(function (p) {
              return p.id === selectedId;
            });
            if (project) {
              _context5.n = 1;
              break;
            }
            return _context5.a(2);
          case 1:
            chunks = chunkText(project.novelText);
            newScenes = [];
            newAudios = [];
            i = 0;
          case 2:
            if (!(i < chunks.length)) {
              _context5.n = 6;
              break;
            }
            _context5.n = 3;
            return generateScene(i);
          case 3:
            sceneSrc = _context5.v;
            newScenes.push(sceneSrc);
            _context5.n = 4;
            return generateAudio(chunks[i]);
          case 4:
            audioSrc = _context5.v;
            newAudios.push(audioSrc);
          case 5:
            i++;
            _context5.n = 2;
            break;
          case 6:
            setScenes(newScenes);
            setAudioSources(newAudios);
            setCurrentSceneIdx(0);
            setView('play');
            updateProject(selectedId, {
              step: 'play'
            });
            if (newAudios[0]) {
              audioRef.current.src = newAudios[0];
              audioRef.current.play();
              setPlaying(true);
            }
          case 7:
            return _context5.a(2);
        }
      }, _callee5);
    }));
    return _startPlay.apply(this, arguments);
  }
  function skip(sec) {
    var audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + sec));
  }
  function togglePlay() {
    var audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      audio.play();
      setPlaying(true);
    } else {
      audio.pause();
      setPlaying(false);
    }
  }
  function handleFullScreen() {
    var el = document.querySelector('.scene-wrapper');
    if (!document.fullscreenElement) el.requestFullscreen();else document.exitFullscreen();
  }
  function renderControlBar() {
    if (view === 'home' || selectedId === null) return null;
    return /*#__PURE__*/React.createElement("aside", {
      className: "controlbar"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tabs"
    }, /*#__PURE__*/React.createElement("div", {
      className: "tab ".concat(view === 'upload' ? 'active' : ''),
      onClick: function onClick() {
        return setView('upload');
      }
    }, "\uC5C5\uB85C\uB4DC"), /*#__PURE__*/React.createElement("div", {
      className: "tab ".concat(view === 'characters' ? 'active' : ''),
      onClick: function onClick() {
        return setView('characters');
      }
    }, "\uCE90\uB9AD\uD130"), /*#__PURE__*/React.createElement("div", {
      className: "tab ".concat(view === 'backgrounds' ? 'active' : ''),
      onClick: function onClick() {
        return setView('backgrounds');
      }
    }, "\uBC30\uACBD"), /*#__PURE__*/React.createElement("div", {
      className: "tab ".concat(view === 'episodes' ? 'active' : ''),
      onClick: function onClick() {
        return setView('episodes');
      }
    }, "\uC5D0\uD53C\uC18C\uB4DC")), view !== 'play' && /*#__PURE__*/React.createElement("button", {
      className: "play-btn",
      onClick: startPlay
    }, "\uC7AC\uC0DD"));
  }
  function renderWithLayout(content) {
    var username = localStorage.getItem('username');
    return /*#__PURE__*/React.createElement("div", {
      className: "app"
    }, /*#__PURE__*/React.createElement("aside", {
      className: "sidebar"
    }, /*#__PURE__*/React.createElement("h1", {
      onClick: function onClick() {
        setView('home');
        setSelectedId(null);
      }
    }, "VividNovel"), /*#__PURE__*/React.createElement("div", {
      className: "projects"
    }, projects.map(function (p) {
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        className: "project-item ".concat(p.id === selectedId ? 'active' : ''),
        onClick: function onClick() {
          return openProject(p.id);
        }
      }, p.name);
    }), /*#__PURE__*/React.createElement("div", {
      className: "new-project",
      onClick: handleNewProject
    }, "+ \uC0C8 \uD504\uB85C\uC81D\uD2B8"))), /*#__PURE__*/React.createElement("main", {
      className: "main"
    }, content), renderControlBar(), !username && /*#__PURE__*/React.createElement("button", {
      className: "login-btn top-login",
      onClick: function onClick() {
        return location.href = 'login.html';
      }
    }, "\uB85C\uADF8\uC778"));
  }
  function renderHome() {
    var content = /*#__PURE__*/React.createElement("div", {
      className: "home"
    }, /*#__PURE__*/React.createElement("section", {
      className: "my-projects"
    }, /*#__PURE__*/React.createElement("div", {
      className: "section-header"
    }, /*#__PURE__*/React.createElement("h2", null, "\uB0B4 \uD504\uB85C\uC81D\uD2B8")), /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, projects.slice(0, showMyCount).map(function (p) {
      return /*#__PURE__*/React.createElement("div", {
        key: p.id,
        className: "project-card",
        onClick: function onClick() {
          return openProject(p.id);
        }
      }, /*#__PURE__*/React.createElement("div", {
        className: "thumb"
      }), /*#__PURE__*/React.createElement("p", null, p.name));
    })), projects.length > showMyCount && /*#__PURE__*/React.createElement("div", {
      className: "more-wrapper"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return setShowMyCount(function (c) {
          return c + 8;
        });
      }
    }, "\uB354\uBCF4\uAE30"))), /*#__PURE__*/React.createElement("section", {
      className: "public-projects"
    }, /*#__PURE__*/React.createElement("h2", null, "\uB2E4\uB978 \uD504\uB85C\uC81D\uD2B8"), /*#__PURE__*/React.createElement("div", {
      className: "grid"
    }, publicProjects.slice(0, publicCount).map(function (p, idx) {
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "project-card"
      }, /*#__PURE__*/React.createElement("img", {
        src: p.thumbnail,
        alt: p.title
      }), /*#__PURE__*/React.createElement("p", null, p.title));
    }))));
    return renderWithLayout(content);
  }
  function renderUpload() {
    var content = /*#__PURE__*/React.createElement("div", {
      className: "drop-zone",
      onDragOver: function onDragOver(e) {
        return e.preventDefault();
      },
      onDrop: handleDrop
    }, /*#__PURE__*/React.createElement("p", null, "\uC5EC\uAE30\uB85C \uD14D\uC2A4\uD2B8 \uBB38\uC11C\uB098 PDF\uB97C Drag&Drop\uD558\uC138\uC694."));
    return renderWithLayout(content);
  }
  function renderCharacters() {
    if (!novelData) return renderUpload();
    var content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("div", {
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
    })));
    return renderWithLayout(content);
  }
  function renderBackgrounds() {
    if (!novelData) return renderUpload();
    var content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex"
    }, novelData.backgrounds.map(function (bg, idx) {
      return /*#__PURE__*/React.createElement("div", {
        className: "card",
        key: idx
      }, /*#__PURE__*/React.createElement("img", {
        src: bg.image,
        alt: bg.name
      }), /*#__PURE__*/React.createElement("h3", null, bg.name));
    })));
    return renderWithLayout(content);
  }
  function renderEpisodes() {
    var content = /*#__PURE__*/React.createElement("div", {
      className: "main-setup"
    }, /*#__PURE__*/React.createElement("p", {
      className: "empty-info"
    }, "\uC544\uC9C1 \uC815\uBCF4\uAC00 \uC5C6\uC2B5\uB2C8\uB2E4."));
    return renderWithLayout(content);
  }
  function renderPlay() {
    var content = /*#__PURE__*/React.createElement("div", {
      className: "scene-wrapper"
    }, scenes[currentSceneIdx] && /*#__PURE__*/React.createElement("img", {
      src: scenes[currentSceneIdx],
      className: "scene-image",
      alt: "Scene"
    }), isAudioLoading && /*#__PURE__*/React.createElement("div", {
      className: "loading-overlay"
    }, /*#__PURE__*/React.createElement("div", {
      className: "spinner"
    })), /*#__PURE__*/React.createElement("audio", {
      ref: audioRef
    }), /*#__PURE__*/React.createElement("div", {
      className: "video-controls"
    }, /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return skip(-10);
      }
    }, "\u23EA 10s"), /*#__PURE__*/React.createElement("button", {
      onClick: togglePlay
    }, playing ? '❚❚' : '▶'), /*#__PURE__*/React.createElement("button", {
      onClick: function onClick() {
        return skip(10);
      }
    }, "10s \u23E9"), /*#__PURE__*/React.createElement("button", {
      onClick: handleFullScreen
    }, "\u26F6")));
    return renderWithLayout(content);
  }
  if (view === 'home') return renderHome();
  if (view === 'upload') return renderUpload();
  if (view === 'characters') return renderCharacters();
  if (view === 'backgrounds') return renderBackgrounds();
  if (view === 'episodes') return renderEpisodes();
  if (view === 'play') return renderPlay();
  return renderHome();
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));