(function() {
    "use strict";
    


    window.MyGlobal = {
        ResourceExists: function(url, callback) {
            $.get(url).done(function () {
				if(typeof callback == 'function') {
                    callback(true);
                } else {
                    console.log('The url "'+url+'" is reachable.');
                }
			  }).fail(function () {
                if(typeof callback == 'function') {
                    callback(false);
                } else {
                    console.log('The url "'+url+'" is not reachable.');
                }
			  });
        },
    
        XORCipher: 
        {
            encode: function(data, key) {
              data = MyGlobal.XORCipher.xor_encrypt(key, data);
              return MyGlobal.XORCipher.b64_encode(data);
            },
            decode: function(data, key) {
              data = MyGlobal.XORCipher.b64_decode(data);
              return MyGlobal.XORCipher.xor_decrypt(key, data);
            },

            //
            b64_table: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

            b64_encode: function(data) {
                var o1, o2, o3, h1, h2, h3, h4, bits, r, i = 0, enc = "";

                if (!data) { return data; }

                do {
                    o1 = data[i++];
                    o2 = data[i++];
                    o3 = data[i++];
                    bits = o1 << 16 | o2 << 8 | o3;
                    h1 = bits >> 18 & 0x3f;
                    h2 = bits >> 12 & 0x3f;
                    h3 = bits >> 6 & 0x3f;
                    h4 = bits & 0x3f;
                    enc += MyGlobal.XORCipher.b64_table.charAt(h1) + MyGlobal.XORCipher.b64_table.charAt(h2) + MyGlobal.XORCipher.b64_table.charAt(h3) + MyGlobal.XORCipher.b64_table.charAt(h4);
                } while (i < data.length);

                r = data.length % 3;

                return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
            },
            
            b64_decode: function(data) {
                var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];

                if (!data) { return data; }

                data += "";

                do {
                    h1 = MyGlobal.XORCipher.b64_table.indexOf(data.charAt(i++));
                    h2 = MyGlobal.XORCipher.b64_table.indexOf(data.charAt(i++));
                    h3 = MyGlobal.XORCipher.b64_table.indexOf(data.charAt(i++));
                    h4 = MyGlobal.XORCipher.b64_table.indexOf(data.charAt(i++));
                    bits = h1 << 18 | h2 << 12 | h3 << 6 | h4;
                    o1 = bits >> 16 & 0xff;
                    o2 = bits >> 8 & 0xff;
                    o3 = bits & 0xff;
                    result.push(o1);

                    if (h3 !== 64) {
                        result.push(o2);
                        if (h4 !== 64) {
                            result.push(o3);
                        }
                    }
                } while (i < data.length);

                return result;
            },
        
            keyCharAt: function(key, i) {
                return key.charCodeAt( Math.floor(i % key.length) );
            },
        
            xor_encrypt: function(key, data) {
                return (typeof data == "string" ? data.split("") : data).map(function(c, i) {
                    return c.charCodeAt(0) ^ MyGlobal.XORCipher.keyCharAt(key, i);
                });
            },
        
            xor_decrypt: function(key, data) {
                return (typeof data == "string" ? data.split("") : data).map(function(c, i) {
                    return String.fromCharCode(c ^ MyGlobal.XORCipher.keyCharAt(key, i));
                }).join("");
            }
        },

        hex2a: function(hexx) {
            var hex = hexx.toString();//force conversion
            var str = '';
            for (var i = 0; i < hex.length; i += 2)
                str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            return str;
        },
        a2hex: function(ascii)
        {
            var arr1 = [];
            for (var n = 0, l = ascii.length; n < l; n ++) 
            {
                var hex = Number(ascii.charCodeAt(n)).toString(16);
                arr1.push(hex);
            }

            return arr1.join('');
        },

        GetKey: function() {
            return Cookies.get('passcode_key');
        },
        GetPasscode: function() {
            return Cookies.get('passcode');
        },
        IsEmpty: function(val){
            if((typeof val == 'undefined') || (val == null) 
            || (val == '') || (val === 0) 
            || (val !== val) /*checks for NaN*/ 
            || MyGlobal.isEmptyArray(val) || MyGlobal.isEmptyObject(val)) {
                return true;
            } else {
                return false;
            }
        },
        isEmptyObject: function(val) {
            if (val == null) {
              // null or undefined
              return false;
            }
          
            if (typeof val !== 'object') {
              // boolean, number, string, function, etc.
              return false;
            }
          
            const proto = Object.getPrototypeOf(val);
          
            // consider `Object.create(null)`, commonly used as a safe map
            // before `Map` support, an empty object as well as `{}`
            if (proto !== null && proto !== Object.prototype) {
              return false;
            }
          
            for (const prop in val) {
                if (Object.hasOwn(val, prop)) {
                  return false;
                }
            }
            
            return true;
        },
        isEmptyArray: function(val) {
            if(Object.prototype.toString.call(val) === '[object Array]') {
                return (val.length == 0);
            } else {
                return false;
            }
        }
    };
})();

(function(funcName, baseObj) {
    "use strict";
    // The public function name defaults to window.docReady
    // but you can modify the last line of this function to pass in a different object or method name
    // if you want to put them in a different namespace and those will be used instead of
    // window.docReady(...)
    funcName = funcName || "docReady";
    baseObj = baseObj || window;
    var readyList = [];
    var readyFired = false;
    var readyEventHandlersInstalled = false;

    // call this when the document is ready
    // this function protects itself against being called more than once
    function ready() {
        if (!readyFired) {
            // this must be set to true before we start calling callbacks
            readyFired = true;
            for (var i = 0; i < readyList.length; i++) {
                // if a callback here happens to add new ready handlers,
                // the docReady() function will see that it already fired
                // and will schedule the callback to run right after
                // this event loop finishes so all handlers will still execute
                // in order and no new ones will be added to the readyList
                // while we are processing the list
                readyList[i].fn.call(window, readyList[i].ctx);
            }
            // allow any closures held by these functions to free
            readyList = [];
        }
    }

    function readyStateChange() {
        if ( document.readyState === "complete" ) {
            ready();
        }
    }

    // This is the one public interface
    // docReady(fn, context);
    // the context argument is optional - if present, it will be passed
    // as an argument to the callback
    baseObj[funcName] = function(callback, context) {
        if (typeof callback !== "function") {
            throw new TypeError("callback for docReady(fn) must be a function");
        }
        // if ready has already fired, then just schedule the callback
        // to fire asynchronously, but right away
        if (readyFired) {
            setTimeout(function() {callback(context);}, 1);
            return;
        } else {
            // add the function and context to the list
            readyList.push({fn: callback, ctx: context});
        }
        // if document already ready to go, schedule the ready function to run
        // IE only safe when readyState is "complete", others safe when readyState is "interactive"
        if (document.readyState === "complete" || (!document.attachEvent && document.readyState === "interactive")) {
            setTimeout(ready, 1);
        } else if (!readyEventHandlersInstalled) {
            // otherwise if we don't have event handlers installed, install them
            if (document.addEventListener) {
                // first choice is DOMContentLoaded event
                document.addEventListener("DOMContentLoaded", ready, false);
                // backup is window load event
                window.addEventListener("load", ready, false);
            } else {
                // must be IE
                document.attachEvent("onreadystatechange", readyStateChange);
                window.attachEvent("onload", ready);
            }
            readyEventHandlersInstalled = true;
        }
    }
})("docReady", window);
// modify this previous line to pass in your own method name
// and object for the method to be attached to

(function() {
    "use strict";

    docReady(function() {
        var passcodeContainerElement = $(".passcode-container");

        if((passcodeContainerElement.length == 0) && MyGlobal.IsEmpty(MyGlobal.GetPasscode()) ) {
            window.location = window.location.origin;
            console.log("navigate to origin");
        } else {
            var xorElements = $("[data-xored]");
            var key = MyGlobal.GetKey();

            if(!MyGlobal.IsEmpty(key)) {
                //then attempt to un-xor values
                xorElements.each(function(idx, el) {
                    var $element = $(el);
                    var text = $element.text().trim();
                    text = MyGlobal.XORCipher.decode(text, key);
                    $element.text(text);
                });

                console.log("Un-xored \""+xorElements.length+"\" element content.");
            } else {
                console.log("SKIPPING: Un-xoring of \""+xorElements.length+"\" element content.");
            }
        }
    });

    console.log("critical js loaded");
})();