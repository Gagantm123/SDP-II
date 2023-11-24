const mongoose = require("mongoose")
const Schema = mongoose.Schema;


const attendanceSchema =  new Schema({
    data:{
        type:Date,
        default: Date.now(),
    },
    time:{
        type:Date,
        default:Date.now(),
    },
    status:{
        type:String,
        default:"Present"
    }
});

const Attendance = mongoose.model("Attendance",attendanceSchema);
module.exports = Attendance;