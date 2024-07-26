const express=require('express');
const app=express();
const dotenv=require("dotenv");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const conn=require("./connect");
const User =  require("./models/User");
var nodemailer = require('nodemailer');

dotenv.config();
const port=process.env.PORT;
app.set("view engine","ejs");
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
app.use(express.static(__dirname + "/public"));

app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));


app.get("/",async(req,res)=>{
    res.render("login");
});
app.get("/register",async (req,res)=>{
    res.render("register");
});
app.post("/register",async (req,res)=>{
  try{
    const {name,username,password,role}=req.body;
        const newUser=new User({
            name,
            username,
            password,
            role
        });
        await newUser.save();
        res.send("User created");
      }catch(err){
        res.redirect("/register");
      }
}
);
app.post("/login",async (req,res)=>{
   const  {username,password}=req.body;
  const user = await User.findOne({username});
  if(!user){
    res.send("User not found");
  }
  if(user.password!=password){
    res.send("Password is incorrect");
  }
  else{
    res.redirect("dashboard");
  }
  });


  app.get("/logout",async(req,res)=>{
    res.redirect("/");
  }
  );

  app.get("/view",async(req,res)=>{
    const users=await User.find();
    res.render("admin/view",{users});
  });

  app.get("/dashboard",async(req,res)=>{
    res.render("admin/dashboard");
  });
  app.get("/attendance",async(req,res)=>{
    res.render("admin/attendance");
  });
  app.get("/mail",async(req,res)=>{
    res.render("admin/mail");
  });


var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

app.post("/mail",async(req,res)=>{
var mailOptions = {
  from:  process.env.EMAIL,
  to: req.body.to,
  subject: req.body.sub,
  text: req.body.desc
};


transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
    res.redirect("/mail");
  } else {
    console.log('Email sent: ' + info.response);
    res.redirect("/dashboard");
  }

});
});
