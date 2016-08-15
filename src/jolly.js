/*!
 * Jolly - modern responsive carousel with zooming
 * @version  v1.1.1
 * @author   Gerrproger
 * Website:  http://gerrproger.github.io/Jolly
 * Repo:     http://github.com/gerrproger/Jolly
 * Issues:   http://github.com/gerrproger/Jolly/issues
 */
;(function (root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof module.exports === 'object') {
        module.exports = factory(root, document);
    } else if (typeof define === 'function' && define.amd) {
        define(null, function () {
            factory(root, document);
        });
    } else {
        root.jolly = factory(root, document);
    }
}(typeof window !== 'undefined' ? window : this, function (window, document) {
    'use strict';

    var defaults = {
        offset: 300,
        height: false,
        reflected: false,
        reversed: false,
        zooming: true,
        zoomOffset: 5,
        zoomDif: 10,
        zoomAnimDelay: 20,
        zoomAnimIncr: 0.3,

        selectors: {
            targets: '[data-jolly]',
            targetsData: 'data-jolly',
            targetsSettings: 'data-jolly-settings',

            wrapper: 'jolly',
            active: '--active',

            scroller: 'jolly__wrapper',
            scrollerReflected: 'jolly__wrapper--reflected',
            scrollerTransition: 'jolly__wrapper--transition',

            controls: 'jolly__controls',
            controlsZoom: 'jolly__controls--zoom',
            controlPrev: 'jolly__control jolly__control--prev',
            controlNext: 'jolly__control jolly__control--next',
            controlZoomer: 'jolly__zoomer',

            element: 'jolly__element',
            image: 'jolly__img',
            imageTransition: 'jolly__img--transition'
        }
    };


    function _extend() {
        var objects = arguments;

        if (!objects.length) {
            return;
        }

        if (objects.length == 1) {
            return objects[0];
        }

        var destination = Array.prototype.shift.call(objects),
            length = objects.length;

        for (var i = 0; i < length; i++) {
            var source = objects[i];

            for (var property in source) {
                if (source[property] && source[property].constructor && source[property].constructor === Object) {
                    destination[property] = destination[property] || {};
                    _extend(destination[property], source[property]);
                }
                else {
                    destination[property] = source[property];
                }
            }
        }

        return destination;
    }

    function _replaceAll(string, find, replace) {
        return string.replace(new RegExp(find.replace(/([.*+?\^=!:${}()|\[\]\/\\])/g, '\\$1'), 'g'), replace);
    }


    function _prependChild(parent, element, sibling) {
        parent.insertBefore(element, sibling);
    }

    function _appendChild(parent, element) {
        parent.appendChild(element);
    }

    function _setAttributes(element, attributes) {
        for (var key in attributes) {
            element.setAttribute(key, (typeof attributes[key] === 'boolean' && attributes[key]) ? '' : attributes[key]);
        }
    }

    function _createElement(type, attributes, parent) {
        var element = document.createElement(type);

        if (attributes) {
            _setAttributes(element, attributes);
        }

        if (parent) {
            _appendChild(parent, element);
        }

        return element;
    }

    function _toggleClass(element, className, state) {
        if (element) {
            if (element.classList) {
                element.classList[state ? 'add' : 'remove'](className);
            }
            else {
                var name = (' ' + element.className + ' ').replace(/\s+/g, ' ').replace(' ' + className + ' ', '');
                element.className = name + (state ? ' ' + className : '');
            }
        }
    }

    function _toggleListener(element, events, callback, toggle) {
        var eventList = events.split(' ');

        if (element instanceof NodeList) {
            for (var x = 0; x < element.length; x++) {
                if (element[x] instanceof Node) {
                    _toggleListener(element[x], arguments[1], arguments[2]);
                }
            }
            return;
        }

        for (var i = 0; i < eventList.length; i++) {
            element[toggle ? 'addEventListener' : 'removeEventListener'](eventList[i], callback, false);
        }
    }

    function _transitionSupported() {
        var style = _createElement('p').style;
        return 'transition' in style ||
            'WebkitTransition' in style ||
            'MozTransition' in style ||
            'OTransition' in style;
    }


    function Jolly(element, imgs, settings) {
        var loaded = 0;
        var direction = null;
        var zoom = null;
        var zoomState = false;
        var imgsLength = imgs.length;
        var pin = settings.reflected ? 'right' : 'left';
        var moveTime = null;
        var tree = {
            loaded: false,
            zoomActive: false,
            offset: 0,
            height: 0,
            width: 0,
            list: [],
            controls: {},
            active: settings.reversed ? imgsLength - 1 : imgsLength
        };

        tree.wrap = _createElement('div', {class: defaults.selectors.wrapper}, element);
        if (settings.height !== false) {
            tree.wrap.style.height = settings.height + 'px';
        }

        tree.scroller = _createElement('ul', {class: defaults.selectors.scroller}, tree.wrap);
        tree.height = tree.scroller.offsetHeight;

        if (settings.reflected) {
            _toggleClass(tree.wrap, defaults.selectors.scrollerReflected, true);
        }

        tree.controls.block = _createElement('div', {class: defaults.selectors.controls}, tree.wrap);

        tree.controls.prev = _createElement('button', {class: defaults.selectors.controlPrev}, tree.controls.block);
        tree.controls.next = _createElement('button', {class: defaults.selectors.controlNext}, tree.controls.block);
        tree.controls.zoomer = _createElement('div', {class: defaults.selectors.controlZoomer}, tree.controls.block);

        if (settings.reversed) {
            imgs.reverse();
        }
        for (var i = 0; i < 3; i++) {
            for (var key in imgs) {
                var img = imgs[key];
                var obj = {
                    width: 0
                };
                obj.element = _createElement('li', {class: defaults.selectors.element}, tree.scroller);
                obj.image = _createElement('img', {class: defaults.selectors.image, src: img}, obj.element);

                if (i === 0) {
                    _toggleListener(obj.image, 'load', _checkLoaded, true);
                }

                tree.list.push(obj);
            }
        }

        _toggleListener(tree.scroller, 'transitionend webkitTransitionEnd', _scrollerTransition, true);
        _toggleListener(tree.controls.prev, 'click', settings.reversed ? _nextClick : _prevClick, true);
        _toggleListener(tree.controls.next, 'click', settings.reversed ? _prevClick : _nextClick, true);

        if (settings.zooming) {
            _toggleZoom();
        }


        function _scrollerTransition(e) {
            var el = null;
            if (e.target !== tree.scroller) {
                return;
            }
            _toggleClass(tree.scroller, defaults.selectors.scrollerTransition);

            if (direction === 'next') {
                el = tree.list[0];

                _appendChild(tree.scroller, el.element);

                tree.offset += el.width;
                tree.scroller.style[pin] = tree.offset + 'px';

                tree.active--;
                tree.list.push(tree.list.shift());
            }
            else if (direction === 'prev') {

                el = tree.list.slice(-1)[0];

                _prependChild(tree.scroller, el.element, tree.list[0].element);

                tree.offset -= el.width;
                tree.scroller.style[pin] = tree.offset + 'px';

                tree.active++;
                tree.list.unshift(tree.list.pop());
            }

            direction = null;
        }

        function _prevClick() {
            if (direction) {
                return;
            }
            tree.active--;
            tree.offset = tree.offset + tree.list[tree.active].width;

            _move(tree.list[tree.active + 1]);
            direction = 'prev';
        }

        function _nextClick() {
            if (direction) {
                return;
            }
            tree.offset = tree.offset - tree.list[tree.active].width;
            tree.active++;

            _move(tree.list[tree.active - 1]);
            direction = 'next';
        }

        function _zoomerMouseenter(e) {
            var block = tree.list[tree.active];

            if (block.width + settings.zoomDif > block.image.naturalWidth) {
                return;
            }
            tree.zoomActive = true;

            _toggleClass(block.image, defaults.selectors.imageTransition, true);

            block.image.style.height = block.image.naturalHeight + 'px';

            zoom = {
                xRatio: (block.image.naturalWidth - block.width + settings.zoomOffset * 120) / block.width,
                yRatio: (block.image.naturalHeight - tree.height + settings.zoomOffset * 120) / tree.height,
                counter: settings.zoomAnimDelay,
                image: block.image
            };
            _zoom(e);
            _toggleListener(tree.controls.zoomer, 'mousemove', _zoom, true);
        }

        function _zoomerMouseleave() {
            var block = tree.list[tree.active];

            _toggleClass(block.image, defaults.selectors.imageTransition, true);
            _toggleListener(block.image, 'transitionend webkitTransitionEnd', _transitionListener, true);

            block.image.style.height = '';
            block.image.style.left = '';
            block.image.style.top = '';
            zoom = null;

            _toggleListener(tree.controls.zoomer, 'mousemove', _zoom);

            tree.zoomActive = false;
            _toggleZoom();

            function _transitionListener() {
                _toggleClass(block.image, defaults.selectors.imageTransition);
                _toggleListener(block.image, 'transitionend webkitTransitionEnd', _zoom);
                _toggleListener(block.image, 'transitionend webkitTransitionEnd', _transitionListener);
            }
        }


        function _zoom(e) {
            var timestamp = Date.now();

            if ((zoom.counter && (timestamp > (moveTime + zoom.counter * settings.zoomAnimIncr))) || !zoom.counter) {
                var el = tree.list[tree.active];
                var left = (e.offsetX * -zoom.xRatio) + settings.zoomOffset * 60;
                var top = (e.offsetY * -zoom.yRatio) + settings.zoomOffset * 60;

                left = Math.max(Math.min(left, 0), -el.width * zoom.xRatio + settings.zoomOffset * 120);
                top = Math.max(Math.min(top, 0), -tree.height * zoom.yRatio + settings.zoomOffset * 120);
                el.image.style.left = left + 'px';
                el.image.style.top = top + 'px';

                if (zoom.counter) {
                    if (zoom.counter === 1) {
                        _toggleClass(zoom.image, defaults.selectors.imageTransition);
                    }
                    zoom.counter--;
                }

            }
            moveTime = timestamp;
        }

        function _move(old) {
            var block = tree.list[tree.active];
            _toggleClass(tree.scroller, defaults.selectors.scrollerTransition, true);
            _toggleClass(old.element, defaults.selectors.element + defaults.selectors.active);
            _toggleClass(block.element, defaults.selectors.element + defaults.selectors.active, true);

            tree.scroller.style[pin] = tree.offset + 'px';
            tree.controls.block.style.width = block.width + 'px';
        }

        function _start() {
            _setWidth();

            tree.offset = -tree.width + settings.offset + (settings.reversed ? tree.list[tree.active].width : 0);
            tree.controls.block.style[pin] = settings.offset + 'px';
            tree.controls.block.style.width = tree.list[tree.active].width + 'px';
            tree.scroller.style[pin] = tree.offset + 'px';

            _toggleClass(tree.list[tree.active].element, defaults.selectors.element + defaults.selectors.active, true);

            _toggleClass(tree.scroller, defaults.selectors.scroller + defaults.selectors.active, true);
            _toggleClass(tree.controls.block, defaults.selectors.controls + defaults.selectors.active, true);

            tree.loaded = true;
        }

        function _setWidth() {
            for (var i = 0; i < imgsLength; i++) {
                var width = tree.list[i].image.offsetWidth;
                tree.list[i].element.style.width = tree.list[i + imgsLength].element.style.width = tree.list[i + imgsLength * 2].element.style.width = width + 'px';
                tree.list[i].width = tree.list[i + imgsLength].width = tree.list[i + imgsLength * 2].width = width;
                tree.width += width;
            }
        }

        function _checkLoaded() {
            loaded++;
            if (loaded === imgsLength) {
                _start();
            }
        }

        function _destroy() {
            var parent = tree.wrap.parentNode;
            parent.removeChild(tree.wrap);
            delete parent.jolly;
        }

        function _toggleZoom() {
            var toggle = settings.zooming;
            if ((toggle !== zoomState) && (toggle || !tree.zoomActive)) {
                _toggleClass(tree.controls.block, defaults.selectors.controlsZoom, toggle);
                _toggleListener(tree.controls.zoomer, 'mouseenter', _zoomerMouseenter, toggle);
                _toggleListener(tree.controls.zoomer, 'mouseleave', _zoomerMouseleave, toggle);
                zoomState = toggle;
            }
        }

        function _updateOffset(newValue) {
            if (typeof newValue === 'undefined') {
                newValue = settings.offset;
            }
            tree.offset += newValue - settings.offset;
            tree.scroller.style[pin] = tree.offset + 'px';
            tree.controls.block.style[pin] = newValue + 'px';
            settings.offset = newValue;
        }

        function _updateHeight(newValue) {
            var oldOffset = tree.list[tree.active].element.offsetLeft;

            if (typeof newValue !== 'undefined') {
                tree.wrap.style.height = (newValue === false) ? null : newValue + 'px';
            }
            tree.height = tree.scroller.offsetHeight;
            tree.width = 0;

            _setWidth();
            tree.controls.block.style.width = tree.list[tree.active].width + 'px';
            tree.offset += oldOffset - tree.list[tree.active].element.offsetLeft;
            tree.scroller.style[pin] = tree.offset + 'px';
        }

        return {
            settings: settings,
            tree: tree,
            prev: settings.reversed ? _nextClick : _prevClick,
            next: settings.reversed ? _prevClick : _nextClick,
            destroy: _destroy,
            updateOffset: _updateOffset,
            updateHeight: _updateHeight,
            enableZoom: function () {
                settings.zooming = true;
                _toggleZoom();
            },
            disableZoom: function () {
                settings.zooming = false;
                _toggleZoom();
            }
        };
    }


    function setup(p1, p2, p3) {
        var elements = [];
        var targets = null;
        var images = null;
        var settings = null;

        if (!'querySelectorAll' in document || !_transitionSupported()) {
            console.warn('jolly:', 'Not supported browser!');
            return false;
        }


        if (typeof p3 === 'object') {
            settings = p3;
        }
        else if (typeof p2 === 'object' && !Array.isArray(p2)) {
            settings = p2;
        }
        else if (typeof p1 === 'object' && !Array.isArray(p1)) {
            settings = p1;
        }

        if (Array.isArray(p2)) {
            images = p2;
        }
        else if (Array.isArray(p1)) {
            images = p1;
        }

        if (typeof p1 === 'string') {
            targets = document.querySelectorAll(p1);
        }
        else if (p1 instanceof HTMLElement) {
            targets = [p1];
        }
        else if (!(p1 instanceof NodeList)) {
            targets = document.querySelectorAll(defaults.selectors.targets);
        }

        if (targets instanceof NodeList) {
            targets = Array.prototype.slice.call(targets);
        }


        for (var key in targets) {
            var element = targets[key];

            if (!('jolly' in element)) {
                var imgsAttr = element.getAttribute(defaults.selectors.targetsData);
                var imgs = imgsAttr ? JSON.parse(_replaceAll(imgsAttr, '\'', '"')) : null;
                imgs = imgs ? imgs : images;
                var setsAttr = element.getAttribute(defaults.selectors.targetsSettings);
                var sets = setsAttr ? JSON.parse(_replaceAll(setsAttr, '\'', '"')) : {};
                sets = _extend({}, defaults, settings, sets);
                var instance = new Jolly(element, imgs, sets);
                element.jolly = (Object.keys(instance).length ? instance : false);
            }
            elements.push(element);
        }

        return elements;
    }

    return setup;
}));