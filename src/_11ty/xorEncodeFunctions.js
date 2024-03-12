const XORCipher = {
    encode: function(data, key) {
      data = XORCipher.xor_encrypt(key, data);
      return XORCipher.b64_encode(data);
    },
    decode: function(data, key) {
      data = XORCipher.b64_decode(data);
      return XORCipher.xor_decrypt(key, data);
    },
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
            enc += XORCipher.b64_table.charAt(h1) + XORCipher.b64_table.charAt(h2) + XORCipher.b64_table.charAt(h3) + XORCipher.b64_table.charAt(h4);
        } while (i < data.length);

        r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + "===".slice(r || 3);
    },
    
    b64_decode: function(data) {
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, result = [];

        if (!data) { return data; }

        data += "";

        do {
            h1 = XORCipher.b64_table.indexOf(data.charAt(i++));
            h2 = XORCipher.b64_table.indexOf(data.charAt(i++));
            h3 = XORCipher.b64_table.indexOf(data.charAt(i++));
            h4 = XORCipher.b64_table.indexOf(data.charAt(i++));
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
            return c.charCodeAt(0) ^ XORCipher.keyCharAt(key, i);
        });
    },

    xor_decrypt: function(key, data) {
        return (typeof data == "string" ? data.split("") : data).map(function(c, i) {
            return String.fromCharCode(c ^ XORCipher.keyCharAt(key, i));
        }).join("");
    }
};

module.exports = () => {
    return {
        XORCipher: XORCipher,
        
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
    };
  };