/*global window, o2*/

/*
 * Copyright © by Volkan Özçelik - http://o2js.com/
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

if(!o2.EventHandler) {
    o2.EventHandler = {};
}

/**
 * @module o2.eventhandler.extend
 * @requires o2
 *
 * <p>Extension methods for the {@link o2.EventHandler} object.</p>
 */
( function(o2, window, UNDEFINED) {
    
    var me = o2.EventHandler;

    /*
     * @function {static} getEventObject
     *
     * <p>Copied from o2.eventhandler.core.js, to eliminate cross-dependency.</p>
     *
     * <p>Gets the actual event object.</p>
     *
     * @param {Event} evt - the actual <code>DOM Event</code> object used
     * internally
     * in {@link o2.EventHandler.addEventListener}
     * @return the actual <code>DOM Event</code> object.
     */
    var getEventObject = function(evt) {
        
        getEventObject = window.event ? function() {
        
            return window.event;
        
        } : function(e) {
        
            return e;
        
        };

        return getEventObject(evt);
    };

    /**
     * @function {static} o2.EventHandler.getMouseCoordinates
     *
     * <p>Gets the current mouse coordinates.</p>
     *
     * @param {Event} evt - the actual <code>DOM Event</code> object used
     * internally
     * in {@link o2.EventHandler.addEventListener}
     * @return the coordinates in the form of <code>{x: mouseX, y: mouseY}</code>
     * where <code>x</code> is the distance from the top of the screen, and
     * <code>y</code> is the distance from the left of the screen.
     */
    me.getMouseCoordinates = function(evt) {
        
        var e = getEventObject(evt);

        if(!e) {
            return {
                x : 0, y : 0
            };
        }

        var posx = 0;
        var posy = 0;

        if(e.pageX) {
            me.getMouseCoordinates = function(e) {
        
                if(!e) {
                    return {
                        x : 0, y : 0
                    };
                }
        
                posx = e.pageX || 0;
                posy = e.pageY || 0;
        
                return {
                    x : posx, y : posy
                };
        
            };

            return me.getMouseCoordinates(evt);
        }

        if(e.clientX) {
            me.getMouseCoordinates = function(e) {
        
                if(!e) {
                    return {
                        x : 0, y : 0
                    };
                }

                var clientX = e.clientX || 0;
                var clientY = e.clientY || 0;
        
                posx = clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
                posy = clientY + document.body.scrollTop + document.documentElement.scrollTop;

                return {
                    x : posx, y : posy
                };
        
            };

            return me.getMouseCoordinates(evt);
        }

        //the current event object neither has pageX, nor clientX defined.
        return {
            x : 0, y : 0
        };
    
    };

    /**
     * @function {static} o2.EventHandler.getKeyCode
     *
     * <p>Gets the key code of the key-related event (keydown, keyup, keypress
     * etc.).</p>
     *
     * @param {Event} evt - the actual <code>DOM Event</code> object used
     * internally
     * in {@link o2.EventHandler.addEventListener}
     * @return the <code>keyCode</code> associated with the event as an
     * <code>Integer</code>
     */
    me.getKeyCode = function(evt) {
    
        var e = getEventObject(evt);

        if(!e) {
            return null;
        }

        if(e.charCode) {
    
            me.getKeyCode = function(e) {
    
                return e.charCode;
    
            };

            return me.getKeyCode(evt);
        }

        if(e.keyCode) {
            me.getKeyCode = function(e) {
    
                return e.keyCode;
    
            };

            return me.getKeyCode(evt);
        }

        if(e.which) {
            me.getKeyCode = function(e) {
    
                return e.which;
    
            };

            return me.getKeyCode(evt);
        }

        return null;
    
    };

    /**
     * @function {static} o2.EventHandler.isRightClick
     *
     * <p>Checks whether or not the curent action is a right click action.</p>
     *
     * @param {Event} evt - the actual <code>DOM Event</code> object used
     * internally
     * in {@link o2.EventHandler.addEventListener}
     * @return <code>true</code> if the event is a right click event,
     * <code>false</code> otherwise.
     */
    me.isRightClick = function(evt) {
    
        var e = getEventObject(evt);

        //
        // According to W3C
        //     Left Button: 0
        //     Middle Button: 1
        //     Right Button: 2 (!)
        //
        // According to M$
        //     Lef Button: 1
        //     Middle Button: 4
        //     Right Button: 2 (!)
        //     Left and Right: 3
        //     Left and Middle: 5
        //     Right and Middle: 6
        //     All three: 7
        //
        // http://msdn.microsoft.com/en-us/library/ms533544(v=vs.85).aspx
        //

        if(!e) {
            return false;
        }

        if(e.which) {
            me.isRightClick = function(e) {
                return e.which == 3;
            };

            return me.isRightClick(evt);
        }

        if(e.button) {
            me.isRightClick = function(e) {
                return e.button == 2;
            };

            return me.isRightClick(evt);
        }

        return false;

    };

}(o2, this));
