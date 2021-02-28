/**
 * @fileoverview Express-based RFC7523 server
 * @author Joey Whelan <joey.whelan@gmail.com>
 */


const express = require('express');
const expressJwt = require('express-jwt');
const jwt = require('jsonwebtoken');
const app = express();
const issuer = "https://jwtissuer.dummy";
const audience = "https://server.dummy";

app.use(express.urlencoded({
    extended: false
}));
app.use(expressJwt({
    secret: sharedKey,
    issuer: issuer,
    audience: audience,
    algorithms: ['HS256', 'HS384', 'HS512'],    
    requestProperty: 'token',
    getToken: (req) => {
        return req.body.assertion;
    }
}));
app.use(function (err, req, res, next) {
    if (err.name === 'UnauthorizedError') {
        console.log('invalid token received');
        res.status(401).json({error: 'invalid token received'});
    }
    else {
        res.status(400).json({error: err.name});
    }
});

app.post('/rfc7523', (req, res) => {
    if (req.token) {
        console.log(`Received token: ${JSON.stringify(req.token)}`);
        const alg = 'HS512'
        const payload = { 
            "iss": 'oauth issuer',
            "sub": 'oauth authority',
            "aud": 'm2mclient',
            "exp": Date.now() + 60000 //60 second expiration
        };
        const accessToken = jwt.sign(payload, privateKey, {algorithm: alg});
            
        res.status(200)
        .json({
            token_type: 'bearer',
            rec_token: req.token,
            access_token: accessToken
        });
    }
    else {
        res.status(400).json({error: 'no token found'});
    }
});

exports.jwtdemo = app;
