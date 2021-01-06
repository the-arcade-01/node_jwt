const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const { isEmail } = require('validator');

const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true, 'Email Required'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password:{
        type:String,
        required: [true,'Password Required'],
        minlength: [6, 'Minimum password length 6 characters']
    }
});

// mongoose hooks
UserSchema.post('save',(doc,next)=>{
    console.log('new user created',doc);
    next();
});

UserSchema.pre('save',async function(next){
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt);
    console.log('user about to created and save',this);
    next();
})

// static function for login

UserSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(!user){
        throw Error('Incorrect email');
    }
    const auth = await bcrypt.compare(password,user.password);
    if(!auth){
        throw Error('Incorrect password');
    }
    return user;
}

module.exports = mongoose.model('User',UserSchema);