/**
 * @fileoverview RFC7523 client
 * @author Joey Whelan <joey.whelan@gmail.com>
 */

const fetch = require('node-fetch');
const jwt = require('jsonwebtoken');
const issuer = "https://jwtissuer.dummy";
const subject = "m2mclient";
const audience = "https://server.dummy";

(async () => {
    const payload = { 
        "iss": issuer,
        "sub": subject,
        "aud": audience,
        "exp": Math.round(Date.now()/1000+3) //3 second expiration        
    };
    const alg = 'HS512'
    const token = jwt.sign(payload, sharedKey, {algorithm: alg});
    const authGrant = encodeURI('urn:ietf:params:oauth:grant-type:jwt-bearer');
    const response = await fetch(url, {
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `grant_type=${authGrant}&assertion=${token}`
    });
    
    const json = await response.json();
    console.log(`Results: ${JSON.stringify(json, null, 4)}`);
})();
