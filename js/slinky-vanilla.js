"use strict";

function _classCallCheck(e, t) {
    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
}

var _extends = Object.assign || function (e) {
    for (var t = 1; t < arguments.length; t++) {
        var i = arguments[t];
        for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (e[n] = i[n]);
    }
    return e;
};

var _createClass = function () {
    function e(e, t) {
        for (var i = 0; i < t.length; i++) {
            var n = t[i];
            n.enumerable = n.enumerable || false;
            n.configurable = true;
            "value" in n && (n.writable = true);
            Object.defineProperty(e, n.key, n);
        }
    }
    return function (t, i, n) {
        return i && e(t.prototype, i), n && e(t, n), t;
    };
}();

// DOM helper functions
var $ = function (selector, context) {
    if (typeof selector === 'string') {
        return (context || document).querySelectorAll(selector);
    }
    return selector;
};

var $one = function (selector, context) {
    if (typeof selector === 'string') {
        return (context || document).querySelector(selector);
    }
    return selector;
};

var domEach = function (elements, callback) {
    if (elements && elements.forEach) {
        elements.forEach(function (el, index) {
            callback.call(el, el, index);
        });
    } else if (elements && elements.length) {
        for (var i = 0; i < elements.length; i++) {
            callback.call(elements[i], elements[i], i);
        }
    }
};

var addClass = function (el, className) {
    if (el.classList) {
        el.classList.add(className);
    } else {
        el.className += ' ' + className;
    }
};

var removeClass = function (el, className) {
    if (el.classList) {
        el.classList.remove(className);
    } else {
        el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
};

var hasClass = function (el, className) {
    if (el.classList) {
        return el.classList.contains(className);
    }
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
};

var on = function (el, event, selector, handler) {
    if (typeof selector === 'function') {
        handler = selector;
        selector = null;
    }

    el.addEventListener(event, function (e) {
        if (selector) {
            var target = e.target.closest(selector);
            if (target && el.contains(target)) {
                handler.call(target, e);
            }
        } else {
            handler.call(el, e);
        }
    });
};

var css = function (el, property, value) {
    if (typeof property === 'object') {
        for (var key in property) {
            el.style[key] = property[key];
        }
    } else {
        el.style[property] = value;
    }
};

var attr = function (el, name, value) {
    if (value !== undefined) {
        el.setAttribute(name, value);
    }
    return el.getAttribute(name);
};

var text = function (el, value) {
    if (value !== undefined) {
        el.textContent = value;
    }
    return el.textContent;
};

var wrapInner = function (el, wrapper) {
    var inner = el.innerHTML;
    el.innerHTML = wrapper + inner + wrapper.replace(/<(\/)?([^>]+)>/, function (match, closing, tag) {
        return closing ? match : '</' + tag + '>';
    });
};

var prepend = function (parent, child) {
    parent.insertBefore(child, parent.firstChild);
};

var append = function (parent, child) {
    parent.appendChild(child);
};

var find = function (el, selector) {
    return el.querySelectorAll(selector);
};

var children = function (el, selector) {
    var childNodes = Array.from(el.children);
    if (selector) {
        return childNodes.filter(function (child) {
            return child.matches(selector);
        });
    }
    return childNodes;
};

var parent = function (el) {
    return el.parentElement;
};

// Исправленная parentsUntil - принимает элемент в качестве стоп-условия
var parentsUntil = function (el, stopElement) {
    var parents = [];
    var current = el.parentElement;
    while (current && current !== stopElement) {
        parents.push(current);
        current = current.parentElement;
    }
    return parents;
};

var prev = function (el, selector) {
    var prevEl = el.previousElementSibling;
    if (selector && prevEl && !prevEl.matches(selector)) {
        return null;
    }
    return prevEl;
};

var outerHeight = function (el) {
    var height = el.offsetHeight;
    var style = getComputedStyle(el);
    height += parseInt(style.marginTop) + parseInt(style.marginBottom);
    return height;
};

var getLeftPercent = function (el) {
    var leftValue = el.style.left;
    if (!leftValue) return 0;
    var match = leftValue.match(/^(-?\d+(?:\.\d+)?)%$/);
    if (match) {
        return parseFloat(match[1]);
    }
    return 0;
};

var SlinkyVanilla = function () {
    function e(t, i) {
        _classCallCheck(this, e);
        i = i !== undefined ? i : {};
        this.settings = _extends({}, this.options, i);
        this._currentPosition = 0;
        this._init(t);
    }

    _createClass(e, [{
        key: "options",
        get: function () {
            return { resize: true, speed: 300, theme: "slinky-theme-default", title: false };
        }
    }]);

    _createClass(e, [{
        key: "_init",
        value: function (e) {
            this.menu = typeof e === 'string' ? document.querySelector(e) : e;
            if (!this.menu) return;

            this.base = children(this.menu)[0];
            if (!this.base) return;

            var t = this.menu;
            var i = this.settings;

            addClass(t, "slinky-menu");
            addClass(t, i.theme);
            this._transition(i.speed);

            // Find all a + ul and add next class
            var allLinks = find(t, "a");
            domEach(allLinks, function (link) {
                var nextUl = link.nextElementSibling;
                if (nextUl && nextUl.tagName === 'UL') {
                    addClass(link, "next");
                }
            });

            // Wrap inner content of links
            domEach(find(t, "li > a"), function (link) {
                var span = document.createElement('span');
                var content = Array.from(link.childNodes);
                for (var i = 0; i < content.length; i++) {
                    span.appendChild(content[i]);
                }
                link.appendChild(span);
            });

            // Add header to each submenu
            domEach(find(t, "li > ul"), function (subUl) {
                var headerLi = document.createElement('li');
                addClass(headerLi, "header");
                prepend(subUl, headerLi);

                var backLink = document.createElement('a');
                attr(backLink, "href", "#");
                addClass(backLink, "back");
                prepend(headerLi, backLink);
            });

            // Add title to headers
            if (i.title) {
                domEach(find(t, "li > ul"), function (subUl) {
                    var parentLi = subUl.parentElement;
                    var parentLink = find(parentLi, "a")[0];
                    if (parentLink) {
                        var linkText = text(parentLink);
                        if (linkText) {
                            var titleElement;
                            var href = attr(parentLink, 'href');
                            if (href) {
                                titleElement = document.createElement('a');
                                attr(titleElement, "href", href);
                                addClass(titleElement, "title");
                                text(titleElement, linkText);
                            } else {
                                titleElement = document.createElement('div');
                                addClass(titleElement, "title");
                                text(titleElement, linkText);
                            }
                            var header = find(subUl, ".header")[0];
                            if (header) {
                                append(header, titleElement);
                            }
                        }
                    }
                });
            }

            this._addListeners();
            this._jumpToInitial();
        }
    }, {
        key: "_addListeners",
        value: function () {
            var e = this;
            var t = this.menu;
            var i = this.settings;

            on(t, "click", "a", function (n) {
                if (e._clicked && e._clicked + i.speed > Date.now()) return false;
                e._clicked = Date.now();

                var s = this;
                var href = attr(s, "href");

                if ((href && href.indexOf("#") === 0) || hasClass(s, "next") || hasClass(s, "back")) {
                    n.preventDefault();
                }

                if (hasClass(s, "next")) {
                    var activeUl = find(t, ".active")[0];
                    if (activeUl) removeClass(activeUl, "active");
                    var nextUl = s.nextElementSibling;
                    if (nextUl && nextUl.tagName === 'UL') {
                        css(nextUl, "display", "block");
                        addClass(nextUl, "active");
                        e._move(1);
                        if (i.resize) e._resize(nextUl);
                    }
                } else if (hasClass(s, "back")) {
                    var currentUl = s.closest('ul');
                    // Находим родительский UL (предыдущий уровень меню)
                    var parentLi = currentUl ? currentUl.parentElement : null;
                    var targetUl = parentLi ? parentLi.closest('ul') : null;
                    // Если нет родительского UL, используем base
                    var targetForResize = targetUl || e.base;

                    e._move(-1, function () {
                        var active = find(t, ".active")[0];
                        if (active) removeClass(active, "active");
                        if (currentUl) {
                            css(currentUl, "display", "none");
                            if (targetUl) {
                                addClass(targetUl, "active");
                            } else {
                                addClass(e.base, "active");
                            }
                        }
                    });

                    if (i.resize && targetForResize) {
                        e._resize(targetForResize);
                    }
                }
            });
        }
    }, {
        key: "_jumpToInitial",
        value: function () {
            var e = find(this.menu, ".active")[0];
            if (e) {
                removeClass(e, "active");
                this.jump(e, false);
            }
        }
    }, {
        key: "_move",
        value: function () {
            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
            var t = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : function () { };

            if (e !== 0) {
                var i = this.settings;
                var n = this.base;
                this._currentPosition = this._currentPosition - 100 * e;
                css(n, "left", this._currentPosition + "%");
                if (typeof t === "function") {
                    setTimeout(t, i.speed);
                }
            }
        }
    }, {
        key: "_resize",
        value: function (e) {
            if (!e) return;
            // Сохраняем оригинальный display
            var wasHidden = css(e, "display") === "none";
            // Временно показываем элемент для корректного расчета высоты
            if (wasHidden) {
                css(e, "display", "block");
            }
            // Получаем высоту с учетом всех дочерних элементов
            var height = e.scrollHeight;
            // Добавляем отступы
            var style = getComputedStyle(e);
            height += parseInt(style.marginTop) || 0;
            height += parseInt(style.marginBottom) || 0;
            // Устанавливаем высоту меню
            css(this.menu, "height", height + "px");
            // Восстанавливаем оригинальный display
            if (wasHidden) {
                css(e, "display", "none");
            }
        }
    }, {
        key: "_transition",
        value: function () {
            var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 300;
            var t = this.menu;
            var i = this.base;
            css(t, "transition-duration", e + "ms");
            css(i, "transition-duration", e + "ms");
        }
    }, {
        key: "jump",
        value: function (e) {
            var t = !(arguments.length > 1 && arguments[1] !== undefined) || arguments[1];
            if (e) {
                var i = this.menu;
                var n = this.settings;
                var s = typeof e === 'string' ? find(i, e)[0] : e;
                if (!s) return;

                var a = find(i, ".active")[0];
                var r = 0;
                if (a) {
                    r = parentsUntil(a, i).length;
                }

                domEach(find(i, "ul"), function (ul) {
                    removeClass(ul, "active");
                    css(ul, "display", "none");
                });

                var l = parentsUntil(s, i);
                domEach(l, function (ul) {
                    css(ul, "display", "block");
                });
                css(s, "display", "block");
                addClass(s, "active");

                this._currentPosition = -(l.length - r) * 100;

                if (!t) this._transition(0);
                this._move(l.length - r);
                if (n.resize) this._resize(s);
                if (!t) this._transition(n.speed);
            }
        }
    }, {
        key: "home",
        value: function () {
            var e = !(arguments.length > 0 && arguments[0] !== undefined) || arguments[0];
            var t = this.base;
            var i = this.menu;
            var n = this.settings;

            if (!e) this._transition(0);
            var s = find(i, ".active")[0];
            var a = s ? parentsUntil(s, i) : [];

            this._currentPosition = 0;

            this._move(-a.length, function () {
                if (s) {
                    removeClass(s, "active");
                    css(s, "display", "none");
                }
                domEach(a, function (ul) {
                    if (ul !== t) css(ul, "display", "none");
                });
            });

            if (n.resize) this._resize(t);
            if (e === false) this._transition(n.speed);
        }
    }, {
        key: "destroy",
        value: function () {
            var e = this;
            var t = this.base;
            var i = this.menu;

            // Remove headers
            domEach(find(i, ".header"), function (header) {
                header.remove();
            });

            // Remove next class
            domEach(find(i, "a"), function (link) {
                removeClass(link, "next");
            });

            // Reset styles
            css(i, {
                height: "",
                transitionDuration: ""
            });
            css(t, {
                left: "",
                transitionDuration: ""
            });

            // Unwrap spans
            domEach(find(i, "li > a > span"), function (span) {
                var parent = span.parentNode;
                while (span.firstChild) {
                    parent.insertBefore(span.firstChild, span);
                }
                parent.removeChild(span);
            });

            // Remove active class
            var active = find(i, ".active")[0];
            if (active) removeClass(active, "active");

            // Remove slinky classes
            var classes = i.className.split(" ");
            domEach(classes, function (cls) {
                if (cls.indexOf("slinky") === 0) {
                    removeClass(i, cls);
                }
            });

            // Clean up instance properties
            ["settings", "menu", "base", "_currentPosition"].forEach(function (prop) {
                delete e[prop];
            });
        }
    }]);

    return e;
}();

// Plugin initialization for vanilla JS
window.SlinkyVanilla = SlinkyVanilla;

// Optional: add as a method to HTMLElement prototype for jQuery-like usage
if (typeof HTMLElement !== 'undefined') {
    HTMLElement.prototype.slinky = function (options) {
        return new SlinkyVanilla(this, options);
    };
}
