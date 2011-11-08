/**
 * @module eventhandler.core
 * @requires stringhelper.core
 *
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 * -->
 *
 * <p>A cross-browser event management object.</p>
 */
(function(framework, window) {
    'use strict';

    /*
     * Aliases.
     */
    var me = framework;
    var $ = framework.$;
    var nill = framework.nill;
    var format = framework.StringHelper.format;

    /*
     * Module configuration.
     */
    var config = {
        constants : {
            text : {
                err : {
                    CALLBACK_NOT_DEFINED : '{0}: Callback is not defined!'
                }
            }
        }
    };

    /*
     * Common constants.
     */
    var kRemoveEventListener = 'removeEventListener';
    var kAddEventListener = 'addEventListener';
    var kOn = 'on';
    var kEmpty = '';
    var kCallbackTemplate = config.constants.text.err.CALLBACK_NOT_DEFINED;

    /**
     * @class {static} o2.EventHandler
     *
     * <p>A cross-browser event handling and event utilities class.</p>
     */
    me.EventHandler = {

        /**
         * @struct {static} o2.EventHandler.keyCode
         */
         //TODO: move me.
        keyCode : {

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.ENTER - enter key.
             */
            ENTER : 13,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.LEFT - left arrow key.
             */
            LEFT : 37,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.RIGHT - right arrow key.
             */
            RIGHT : 39,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.TOP - up arrow key.
             */
            TOP : 38,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.BOTTOM - down arrow key.
             */
            BOTTOM : 40,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.UP - up arrow key.
             */
            UP : 38,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.DOWN - down arrow key.
             */
            DOWN : 40,
            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.BACKSPACE - backspace key.
             */
            BACKSPACE : 8,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.TAB - TAB key.
             */
            TAB : 9,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.SHIFT - shift key.
             */
            SHIFT : 16,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.CTRL - CTRL key.
             */
            CTRL : 17,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.ALT - ALT key.
             */
            ALT : 18,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.CAPS_LOCK - caps lock key.
             */
            CAPS_LOCK : 20,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.ESCAPE - ESC key.
             */
            ESCAPE : 27,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.DELETE - DEL key.
             */
            DELETE : 46,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.SPACE - SPACE key.
             */
            SPACE : 32,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.PAGE_UP - PAGE UP key.
             */
            PAGE_UP : 33,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.PAGE_DOWN - PAGE DOWN key.
             */
            PAGE_DOWN : 34,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.END - END key.
             */
            END : 35,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.HOME - HOME key.
             */
            HOME : 36,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.NUMPAD_ENTER - NUMPAD ENTER key.
             */
            NUMPAD_ENTER : 108,

            /**
             * @property {static const Integer}
             * o2.EventHandler.keyCode.COMMA - COMMA key.
             */
            COMMA : 188
        },

        /**
         * @function {static} o2.EventHandler.addEventListener
         *
         * <p>Adds a new event listener to the <strong>DOM</strong> Node.</p>
         *
         * @param {DomNode} node - the <strong>DOM</strong> object (or its
         * <code>String</code> id) the evet shall be attached.
         * @param {String} evt - the name of the event (like "click",
         * "mousemove"...)
         * @param {Function} fn - a reference to the on[event] callback action.
         *
         * @throws exception - if <strong>fn</strong> callback is not defined.
         */
        addEventListener : function(node, evt, fn) {
            var kCallbackNotDefined = format(kCallbackTemplate, kAddEventListener);

            var obj = $(node);

            if (!obj) {
                return;
            }

            if (obj.addEventListener) {
                me.EventHandler.addEventListener = function(node, evt, fn) {

                    var obj = $(node);

                    if (!obj) {
                        return;
                    }

                    if (!fn) {
                        throw kCallbackNotDefined;
                    }

                    // 'false' is for not to use event capturing.
                    // Event capturing is not very useful, since its
                    // implementation vastly deviates among vendors'
                    // implementations.
                    //
                    // See:
                    // http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-flow

                    obj.addEventListener(evt, fn, false);
                };

                me.EventHandler.addEventListener(obj, evt, fn);

                return;
            }

            if (obj.attachEvent) {
                me.EventHandler.addEventListener = function(node, evt, fn) {

                    var obj = $(node);

                    if (!obj) {
                        return;
                    }

                    if (!fn) {
                        throw kCallbackNotDefined;
                    }

                    var onEvent = [kOn, evt].join(kEmpty);
                    obj.attachEvent(onEvent, fn);
                };

                me.EventHandler.addEventListener(obj, evt, fn);

                return;
            }

            me.EventHandler.addEventListener = function(node, evt, fn) {
                var obj = $(node);

                if (!obj) {
                    return;
                }

                if (!fn) {
                    throw kCallbackNotDefined;
                }

                var onEvent = [kOn, evt].join(kEmpty);

                obj[onEvent] = fn;
            };

            me.EventHandler.addEventListener(obj, evt, fn);
        },

        /**
         * @function {static} o2.EventHandler.addEventListeners
         *
         * <p>Adds a set of event handlers the the <strong>eventName</strong> of
         * the given <strong>collection</strong>.</p>
         *
         * @param {Object} collection - an <code>Object</code> or an
         * <code>Array</code> of <strong>DOM</strong> nodes, or their
         * <strong>id</strong>s.
         * @param {String} eventName - the name of the <strong>event</strong> to
         * attach to.
         * @param {Function} handler - the common event handling
         * <strong>callback</strong>.
         *
         * @throws exception - if the <strong>handler</strong> callback is not
         * defined.
         */
        addEventListeners : function(collection, eventName, handler) {
            if (!collection) {
                return;
            }

            var listen = me.EventHandler.addEventListener;
            var key = null;

            for (key in collection) {
                if (collection.hasOwnProperty(key)) {
                    listen(collection[key], eventName, handler);
                }
            }

        },

        /**
         * @function {static} o2.EventHandler.removeEventListener
         *
         * <p>Removes an already-added new event listener from the DOM Node.</p>
         *
         * @param {DomNode} node - the DOM object (or its <code>String</code>
         * reference) the evet shall be removed.
         * @param {String} evt - the name of the event (like "click",
         * "mousemove"...)
         * @param {Function} fn - a reference to the on[event] callback action.
         *
         * @throws exception - if <strong>fn</strong> callback is not defined.
         */
        removeEventListener : function(node, evt, fn) {
            var kCallbackNotDefined = format(kCallbackTemplate, kRemoveEventListener);
            var obj = $(node);

            if (!obj) {
                return;
            }

            if (obj.removeEventListener) {
                me.EventHandler.removeEventListener = function(node, evt, fn) {
                    var obj = $(node);

                    if (!obj) {
                        return;
                    }

                    if (!fn) {
                        throw kCallbackNotDefined;
                    }

                    obj.removeEventListener(evt, fn, false);
                };


                me.EventHandler.removeEventListener(obj, evt, fn);

                return;
            }

            if (obj.detachEvent) {
                me.EventHandler.removeEventListener = function(node, evt, fn) {
                    var obj = $(node);

                    if (!obj) {
                        return;
                    }

                    if (!fn) {
                        throw kCallbackNotDefined;
                    }

                    var onEvent = [kOn, evt].join(kEmpty);
                    obj.detachEvent(onEvent, fn);
                };


                me.EventHandler.removeEventListener(obj, evt, fn);

                return;
            }

            me.EventHandler.removeEventListener = function(node, evt, fn) {
                var obj = $(node);

                if (!obj) {
                    return;
                }

                if (!fn) {
                    throw kCallbackNotDefined;
                }

                var onEvent = [kOn, evt].join(kEmpty);

                obj[onEvent] = nill;
            };

            me.EventHandler.removeEventListener(obj, evt, fn);
        },

        /**
         * @function {static} o2.EventHandler.getEventObject
         *
         * <p>Gets the actual event object.</p>
         *
         * @param {Event} evt - the actual <code>DOM Event</code> object used
         * internally in {@link EventHandler.addEventListener}
         *
         * @return the actual <code>DOM Event</code> object.
         */
        getEventObject : function(evt) {
            me.EventHandler.getEventObject = window.event ? function() {
                return window.event;
            } : function(e) {
                return e;
            };

            return me.EventHandler.getEventObject(evt);
        },

        /**
         * @function {static} o2.EventHandler.getTarget
         *
         * <p>Gets the originating source of the event.</p>
         *
         * @param {Event} evt - the actual <code>DOM Event</code> object used
         * internally in {@link EventHandler.addEventListener}
         *
         * @return the actual <strong>DOM</strong> target of the event object.
         */
        getTarget : function(evt) {
            if (window.event) {
                me.EventHandler.getTarget = function() {
                    return window.event.srcElement;
                };
            } else {
                me.EventHandler.getTarget = function(e) {
                    return e ? e.target : null;
                };
            }

            return me.EventHandler.getTarget(evt);
        },

        /**
         * @function {static} o2.EventHandler.preventDefault
         *
         * <p>Prevents the default action. When this method is called inside an
         * even
         * handling
         * callback, the default action associated with that event is not
         * triggered.
         * Like, if it is an <code>onclick</code> event on a link, then the
         * browser does
         * not go to the <code>href</code> of that link.</p>
         *
         * @param {Event} evt - the actual <code>DOM Event</code> object used
         * internally in {@link EventHandler.addEventListener}
         */
        preventDefault : function(evt) {
            me.EventHandler.preventDefault = window.event ? function() {
                window.event.returnValue = false;

                return false;
            } : function(e) {
                if (!e) {
                    return false;
                }

                if (e.preventDefault) {
                    e.preventDefault();
                }

                return false;
            };

            // Cancel event's default action.
            me.EventHandler.preventDefault(evt);
        },

        /**
         * @function {static} o2.EventHandler.stopPropagation
         *
         * <p>Stops the propagation of the event upwards in the DOM
         * hierarchy.</p>
         *
         * <p>Note that "change" event does not bubble.</p>
         *
         * <p>Also, events: change, submit, reset, focus, blur do not bubble
         * in Internet Explorer.</p>
         *
         * <p>According to specification, "focus" and "blur" should not bubble,
         * while "change", "submit", "reset" should.</p>
         *
         * <p>This behavior implemented properly in all web browsers but IE.</p>
         *
         * <p>See {@link
         * http://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-flow}
         * for details.</p>
         *
         * @param {Event} evt - the actual <code>DOM Event</code> object used
         * internally in {@link EventHandler.addEventListener}
         */
        stopPropagation : function(evt) {
            me.EventHandler.stopPropagation = window.event ? function() {
                window.event.cancelBubble = true;
            } : function(e) {
                if (!e) {
                    return;
                }

                e.stopPropagation();
            };

            // This stops event bubbling.
            me.EventHandler.stopPropagation(evt);
        }
    };
}(this.o2, this));
