const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const securePassword = async (password)=>{

    try {
        const passwordHash = await bcrypt.hash(password,10);
        return passwordHash;

    } catch (error) {
        console.log(error.message);
    }

}

//for Send Mail
// const sendVerifyMail = async(name , email,user_id)=>{

//     try {
//         const transporter = nodemailer.createTransport({
//             host:'smtp.gmail.com',
//             port:587,
//             secure:false,
//             requireTLS:true,
//             auth:{
//                 user:'shabzmhmd9@gmail.com',
//                 pass:'lkpg pczz xwnm elvr'
//             }
//         });

//         const mailOptions = {
//             from:"shabzmhmd9@gmail.com",
//             to:email,
//             subject:"For Verification Mail",
//             html:'<P>Hii  '+name+',Please Click Here to <a href="http://localhost:3000/register/verify?id='+user_id+'">Verify</a> Your mail.</p>'
//         }
//         transporter.sendMail(mailOptions,function(error,info){
//             if(error){
//                 console.log(error);
//             }else{
//                 console.log("Email Has been Sent:- ",info.response);
//             }
//         })


//     } catch (error) {
//         console.log(error.message);
//     }

// }

const loadRegister = async(req,res)=>{
    try {
        res.render('registration');

    } catch (error) {
        console.log(error.message);
    }
}

const insertUser = async(req,res)=>{
    try {
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0,
            is_varified:1
        });
        
        const userData = await user.save();

        if (userData){
            res.render('registration',{message:"Your Registration Success,Verify your Email"});

        }else{
            res.render('registration',{message:"Your Registration failed."});
        }


    } catch (error) {
        console.log(error.message);
    }

}

const verifyMail = async (req, res) => {
    try {
        const userId = req.query.id; 
        const updateInfo = await User.updateOne({_id: userId}, { $set: { is_varified: 1 } });
        console.log(updateInfo);
        res.render("email-verified");
    } catch (error) {
        console.log(error.message);
    }
}

//login user method started

const loginLoad = async (req,res)=>{
    try {
        res.render('login')
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req,res)=>{
    try {
        
        const email = req.body.email;
        const password = req.body.password;

        const userData = await User.findOne({email:email});

        if(userData){

            const passwordMatch = bcrypt.compare(password,userData.password);
            if(passwordMatch){
                if(userData.is_varified===0){
                    res.render('login',{message:"please verify Your mail"});
                }else{
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            }else{
                res.render('login',{message:"Email and Password is Incorrect"})
            }


        }else{
            res.render('login',{message:"Email and Password is Incorrect"})
        }

    } catch (error) {
        console.log(error.message);
    }
}

const loadHome = async(req,res)=>{
    try {
        
      const userData = await User.findById({_id:req.session.user_id});
        res.render('home',{user:userData});

    } catch (error) {
        console.log(error.meesage);
    }
}


const userLogout = async (req,res)=>{
    
    try {

        req.session.destroy();
        res.redirect('/')
        
    } catch (error) {
        console.log(error.message);
    }
}

// User Profile edit & update

const editLoad = async(req,res)=>{

    try {
        
        const id = req.query.id;

       const userData = await User.findById({ _id:id });
       if(userData){
        res.render('edit',{user:userData });
       }
       else{
        res.redirect('/home');
       }

    } catch (error) {
        console.log(error.message);
    }
}


const updateProfile = async(req,res)=>{

    try {
        if(req.file){
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}});
        }else{
            const userData = await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}});
        }

        res.redirect('/home');

    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    editLoad,
    updateProfile
}