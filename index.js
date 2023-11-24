require("dotenv").config();

require("./Model/");
const path         = require("path");
const qrcode       = require("qrcode");
const express      = require("express");
const http         = require("http");
const ejs          = require("ejs-mate");
const jwt          = require("jsonwebtoken");
const { exec }     = require('child_process');
const cookieParser = require("cookie-parser");
const fileUpload   = require("express-fileupload");
const User         = require("./Model/schema.user");
const session      = require("express-session");
const fs           = require("fs");
const Attendance   = require("./Model/attendance");



const app = express();
const server = http.createServer(app);

const { Server } = require("socket.io");
const io = new Server(server);

const sessionConfig = {
    secret: "thisIsASecret",
    resave:false,
    saveUninitialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 7000 * 60 * 60 *24 * 7,
        maxAge:7000 * 60 * 60 *24 * 7
    },
}

app.use(session(sessionConfig));
app.use(express.urlencoded({extended: true}));
app.engine('ejs',ejs);
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.use(express.static(path.join(__dirname,'public')));
// app.use(fileUpload());
app.use(cookieParser());


const authRoutes    = require("./Routes/auth.routes");
const userRoutes    = require("./Routes/user.routes");
const teacherRoutes = require("./Routes/teacher.routes");
const isLoggedIn    = require("./Middlewares/isLoggedIn");
const { match } = require("assert");

app.use(async(req,res,next)=>{
    const { auth } = req.cookies;
    if(auth)
    {
        const payload = jwt.verify(auth,process.env.SECRET);
        const user = await User.findById(payload.id);
        if(user)
        {
            res.locals.user = user._id;
            res.locals.name = user.username;
            res.locals.role = user.role;
        }
    }else{
        res.locals.user = null;
        res.locals.name = null;
        res.locals.role = null;
    }

    console.log("Current User is ",res.locals.user);
    console.log("Current User name is ",res.locals.name);
    console.log("Current User role is ",res.locals.role);
    next();
});

app.get("/",isLoggedIn,(req,res)=>{
    console.log(req.cookies)
    res.render("home");
});

app.get("/video",(req,res)=>{
    res.render("video");
})

app.use("/auth/",authRoutes);
app.use("/user/",userRoutes);
app.use("/teacher/",teacherRoutes);

const pythonScript = "script2.py";
const dataToSend = 'Hello from Node.js!';
const dataToSend2 = 'Hello from Node.js!';

const videoStreamFilePath = 'stream.txt';

io.on("connection",(socket)=>{
    console.log("socket with socket id is connected ",socket.id);

    
    socket.on("video_frame",(data)=>{

        console.log(data)
        if(data.count == '1')
        {
            console.log("HI from sockets") 
            io.to(socket.id).emit("true");
        }else{
            io.to(socket.id).emit('false')
        }
    
    })

})

app.get("/qrcode/:year/:month/:day",isLoggedIn,async(req,res)=>{
    
    const user = await User.findById(res.locals.user);
    const { month , day} = req.params;
    res.render("face_recognize",{user,month,day});
})


app.post("/attendance/:id/2023/:month/:day",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const attendance = new Attendance();
        await attendance.save();

        user.attendance.push(attendance);

        await user.save();

        res.redirect("/user/profile");
    }
    catch(err)
    {
        console.log(err);
    }
})

const PORT = 8080;
server.listen(PORT,()=>{
    console.log(`Listening to PORT ${PORT}`);
})
