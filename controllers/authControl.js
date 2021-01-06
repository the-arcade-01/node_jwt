const User = require('../model/User');
const jwt = require('jsonwebtoken');

// function for handling different errors

const handleErrors = (error)=>{
    console.log(error.message,error.code);
    let errors = {
        email: '',
        password: ''
    };
    // incorrect email
    if (error.message === 'Incorrect email'){
        errors.email = 'Email is not registered'
    }
    if (error.message === 'Incorrect password'){
        errors.password = 'Password is incorrect'
    }
    // for duplicate
    if (error.code === 11000) {
        errors.email = "Email is already registered";
        return errors;
    }
    if (error.message.includes('user validation failed')) {
        Object.values(error.errors).forEach(({properties})=>{
            errors[properties.path] = properties.message;
        });
    }
    return errors;
};

const maxAge = 3 * 24 * 60 * 60;

const createToken = (id)=>{
    return jwt.sign({id},process.env.JWT_SECRET_KEY,{
        expiresIn: maxAge
    });
}

const signup_get = (req,res)=>{
    res.render('signup');
}
const login_get = (req,res)=>{
    res.render('login');
}
const signup_post = async (req,res)=>{
    try{
        const user = await User.create({
            email:req.body.email,
            password:req.body.password
        });
        const token = createToken(user.id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge});
        res.status(201).json({user:user._id});
    } catch(error){
        const errors = handleErrors(error);
        res.status(400).json({errors});
    }
}
const login_post = async (req,res)=>{
    const {email,password} = req.body;
    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
        res.status(200).json({user:user._id});
    } catch(error){
        const errors = handleErrors(error);
        console.log(errors);
        res.status(400).json({errors});
    }
}
const logout_get = (req,res)=>{
    res.cookie('jwt','',{httpOnly:true,maxAge:1});
    res.status(200).redirect('/');
}

module.exports = {
    signup_get,signup_post,login_get,login_post,logout_get
};