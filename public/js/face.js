// const session = require("express-session");

const socket = io();

console.log(image.images[0]);

if(!sessionStorage.getItem('count'))
    sessionStorage.setItem('count',1);
else{
    sessionStorage.setItem('count',2);
}

const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({video: true})
    .then((stream)=>{
        video.srcObject = stream;

        setTimeout(()=>{

            const canvas = document.createElement("canvas");
            const context = canvas.getContext('2d');
            canvas.width = video.width;
            canvas.heihjt = video.clientHeight;
            context.drawImage(video,0,0,video.width,video.height);

            const dataUrl = canvas.toDataURL('image/jpeg');
            socket.emit('video_frame', { count: sessionStorage.getItem('count'), image: image.images[0] });

        },13000);

        // socket.on("end-video",()=>{
        //     clearInterval(id);
        // })
    })
    .catch((err)=>{
        console.log("Something Went Wrong!");
        console.log(err)
    })

socket.on("true",()=>{
    document.getElementById("btn").style.display = "block";
    // alert("HI")
})

socket.on('false',()=>{
    alert("Face did not match");
    window.location.href = '/user/profile';
})