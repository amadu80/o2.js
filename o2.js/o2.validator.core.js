/**
 * @module validator.core
 *
 * <!--
 *  This program is distributed under
 *  the terms of the MIT license.
 *  Please see the LICENSE file for details.
 * -->
 *
 * <p>A validation helper.</p>
 */
(function(framework) {
    'use strict';

    /*
     * Aliases.
     */
    var me = framework;

    /*
     * Module configuration.
     */
    var config = {

        /*
         *
         */
        constants : {

            /*
             * A struct containing all valid
             * EcmaScript types.
             */
            ecmaScriptType : {
                ARRAY : 'Array',
                BOOLEAN : 'Boolean',
                NUMBER : 'Number',
                DATE : 'Date',
                FUNCTION : 'Function',
                OBJECT : 'Object',
                STRING : 'String',
                ARGUMENTS : 'Arguments',
                REGEXP : 'RegExp'
            }
        }
    };

    /*
     * Common constants.
     */
    var kYmdArgumentLength = 3;
    var months = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    var kArray = config.constants.ecmaScriptType.ARRAY;
    var kBoolean = config.constants.ecmaScriptType.BOOLEAN;
    var kDate = config.constants.ecmaScriptType.DATE;
    var kFunction = config.constants.ecmaScriptType.FUNCTION;
    var kNumber = config.constants.ecmaScriptType.NUMBER;
    var kObject = config.constants.ecmaScriptType.OBJECT;
    var kRegExp = config.constants.ecmaScriptType.REGEXP;
    var kString = config.constants.ecmaScriptType.STRING;
    var kArguments = config.constants.ecmaScriptType.ARGUMENTS;

    /**
     * @function {private} o2.Validator.is
     *
     * <p>Returns the type information of the given object.</p>
     * <p>The type can be any of the following:</p>
     * <p><code>Array, Boolean, Date, Error, Function, JSON,
     * Math, Number, Object, RegExp, String, Arguments</code>.</p>
     *
     * @param {Object} obj - the object to check type against.
     * @param {String} type - the type to compare.
     * @return <code>true</code> if the <strong>object</strong>'s type matches
     * the <strong>type</strong> parameter, <code>false</code> otherwise.
     */
    function is(obj, type) {
        var objectNameStartIndex = 8;
        var trimLastBraceIndex = -1;
        var klass = Object.prototype.toString.call(obj).slice(
            objectNameStartIndex, trimLastBraceIndex);

        return obj !== undefined && obj !== null && klass === type;
    }

    /**
     * @class {static} o2.Validator
     *
     * <p>A simple class for validating various kinds of
     * <strong>object</strong>s.</p>
     */
    me.Validator = {

        /**
         * @function {static} o2.Validator.isArray
         *
         * <p>Checks whether the object is an <code>Array</code>.</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is an <code>Array</code>,
         * <code>false</code>
         * otherwise.
         */
        isArray : function(obj) {
            return is(obj, kArray);
        },

        /**
         * @function {static} o2.Validator.isBoolean
         *
         * <p>Checks whether the object is a <code>Boolean</code>.
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is a <code>Boolean</code>,
         * <code>false</code>
         * otherwise.
         */
        isBoolean : function(obj) {
            return is(obj, kBoolean);
        },

        /**
         * @function {static} o2.Validator.isDate
         *
         * <p>Checks whether the object is a <code>Date</code>.</p>
         *
         * @param {Arguments} varargin - if a single argument is given it checks
         * whether it identifies a <code>Date</code> object. Otherwise the
         * function takes
         * three parameters (year, month, date) and cheks whether they denote a
         * valid Date.
         * @return <code>true</code> if obj is a <code>Date</code>,
         * <code>false</code> otherwise.
         */
        isDate : function(objYear, objMonth, objDay) {
            if (arguments.length === kYmdArgumentLength) {
                var maxDay = 0;
                var year = objYear;
                var month = objMonth;
                var day = objDay;

                if (!year || !month || !day) {
                    return false;
                }

                months[1] = ((parseInt(year, 10) % 4 === 0 &&
                    parseInt(year, 10) % 100 !== 0) ||
                    parseInt(year, 10) % 400 === 0) ? 29 : 28;
                maxDay = months[parseInt(month, 10) - 1];

                if (parseInt(day, 10) > maxDay) {
                    return false;
                }

                return true;
            }

            return is(objYear, kDate);
        },

        /**
         * @function {static} o2.Validator.isFunction
         *
         * <p>Checks whether the object is a <code>Function</code>.</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is a <code>Function</code>,
         * <code>false</code> otherwise.
         */
        isFunction : function(obj) {
            return is(obj, kFunction);
        },

        /**
         * @function {static} o2.Validator.isNumber
         *
         * <p>Checks whether the object is a <code>Number</code>.</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is a <code>Number</code>,
         * <code>false</code>
         * otherwise.
         */
        isNumber : function(obj) {
            return is(obj, kNumber);
        },

        /**
         * @function {static} o2.Validator.isObject
         *
         * <p>Checks whether the object is an <code>Object</code>({}).</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is an <code>Object</code> ({}),
         * <code>false</code> otherwise.
         */
        isObject : function(obj) {
            return is(obj, kObject);
        },

        /**
         * @function {static} o2.Validator.isRegExp
         *
         * <p>Checks whether the object is a <code>RegExp</code>.</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is a <code>RegExp</code>,
         * <code>false</code>
         * otherwise.
         */
        isRegExp : function(obj) {
            return is(obj, kRegExp);
        },

        /**
         * @function {static} o2.Validator.isString
         *
         * <p>Checks whether the object is a <code>String</code>.</p>
         *
         * @param {Object} obj - the object to test.
         * @return true if obj is a String, false otherwise.
         */
        isString : function(obj) {
            return is(obj, kString);
        },

        /**
         * @function {static} o2.Validator.isArguments
         *
         * <p>Checks whether the object is an <code>arguments</code> object.</p>
         *
         * @param {Object} obj - the object to test.
         * @return <code>true</code> if obj is an <code>arguments</code> object,
         * <code>false</code> otherwise.
         */
        isArguments : function(obj) {
            return is(obj, kArguments);
        }
    };
}(this.o2));
