const User = require("../Model/schema.user");


const get_profile = async(req,res)=>{
    try{
        console.log(res.locals.user);
        const user = await User.findById(res.locals.user).populate({path:'attendance'});
        console.log(user);
        res.render("profile",{ profile: user });
    }
    catch(err){
        console.log(err);
    }
}

module.exports = {
    get_profile,
}