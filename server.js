require('dotenv').config();
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');

app.use(express.json());

const users = [
    {
        name: 'wendy',
    },
    {
        name: 'emma'
    }
]

app.post('/login', function(req, res, next) {
    const userName = req.body.name;
    const user = { name: userName };

    const token = generateAccessToken(user);
    const freshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET)
    res.json({token, freshToken})
})

app.get('/getUserData', authenticateToken, function(req, res, next) {
    res.json({
        users
    })
})

function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    console.log('token', token)
    if (token == null) {
        res.status(401)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) {
            return res.status(402)
        }
        req.user = user
        next()
    })
}




app.listen(3000, function() {
    console.log('listen on port 3000')
})