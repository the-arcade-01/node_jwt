const jwt = require('jsonwebtoken');
const User = require('../model/User');

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;
    // check if jwt exist and valid
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY,(err,decoded)=>{
            if(err){
                console.log(err.message);
                res.redirect('/login');
            } else {
                console.log(decoded);
                next();
            }
        });
    } else {
        res.redirect('/login');
    }
};

// check current user
const checkUser = (req,res,next)=>{
    const token = req.cookies.jwt;
    if(token){
        jwt.verify(token,process.env.JWT_SECRET_KEY, async (err,decoded)=>{
            if(err){
                console.log(err.message);
                res.locals.user = null;
                next();
            } else {
                console.log(decoded);
                const user = await User.findById(decoded.id);
                res.locals.user = user;
                next();
            }
        })
    } else {
        res.locals.user = null;
        next();
    }
}
module.exports = {
    requireAuth, checkUser
};