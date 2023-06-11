const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const sharp = require("sharp");

app.use(express.json({limit: '50mb'}))
app.use(bodyParser.urlencoded({ extended: false , limit: '50mb'}));

// set the view engine to ejs
app.set('view engine', 'ejs');


// index page
app.get('/', function(req, res) {
  res.render('index.ejs');
})

app.post("/createImage", async function(req, res) {
  let user = JSON.parse(req.body.userData)
  const metadata = await sharp("img.jpeg").metadata();
  let imgData = await addTextOnImage(user, metadata.width, metadata.height)
  console.log(imgData)        
  res.status(200).json({status: 200, message: "Images created successfully"})
})


async function addTextOnImage(user, wdth, heigh) {
  try{
    let width = wdth;
    let height = heigh;
    let email= typeof(user.Email) == "object" ? user.Email.text : user.Email;
    let phone= user.MobileNo
    let name= user.Name
    let msg= user.Message
    let dis= user.Description
    let img= user.Image ? Buffer.from(user.Image).toString("base64") : ""
    let imgType= user.Imgtype
    let fontSize = Math.round(width*20/100)

    const svgImage = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g>  
          <rect x="0" y="80%" width="90%" height="15%" fill="white"></rect>
          <image x="3%" y="72%" width="15%" height="18%" xlink:href="data:image/${imgType};base64,${img}" />
          <path id="name" transform="translate(${width*21/100}, ${height*81/100})"  preserveAspectRatio="none" d="M4 28q0 0.832 0.576 1.44t1.44 0.576h20q0.8 0 1.408-0.576t0.576-1.44q0-1.44-0.672-2.912t-1.76-2.624-2.496-2.144-2.88-1.504q1.76-1.088 2.784-2.912t1.024-3.904v-1.984q0-3.328-2.336-5.664t-5.664-2.336-5.664 2.336-2.336 5.664v1.984q0 2.112 1.024 3.904t2.784 2.912q-1.504 0.544-2.88 1.504t-2.496 2.144-1.76 2.624-0.672 2.912z"></path>
          <text font-size="16" x="25%" y="85%">${name}</text>
          <path transform="translate(${width*55/100},${height*81/100})" d="M12 12.713l-11.985-9.713h23.971l-11.986 9.713zm-5.425-1.822l-6.575-5.329v12.501l6.575-7.172zm10.85 0l6.575 7.172v-12.501l-6.575 5.329zm-1.557 1.261l-3.868 3.135-3.868-3.135-8.11 8.848h23.956l-8.11-8.848z"/>
          <text font-size="${fontSize}%" x="60%" y="85%">${email}</text>
          <path transform="translate(${width*21/100},${height*88/100})" d="M20.629 5h-9.257a1.6 1.6 0 0 0-1.601 1.603V25.4a1.6 1.6 0 0 0 1.601 1.601h9.257c.883 0 1.6-.718 1.6-1.601V6.603c0-.885-.717-1.603-1.6-1.603zm-6.247 1.023h3.302v.768h-3.302v-.768zm1.619 19.395a1.024 1.024 0 0 1-1.023-1.021 1.023 1.023 0 0 1 2.044 0c-.001.494-.46 1.021-1.021 1.021zm5.028-3.501H10.971V7.704h10.058v14.213z"></path>
          <text font-size="${fontSize}%" x="25%" y="91%">${phone}</text>
          <path transform="translate(${width*55/100},${height*88/100})" d="M22.658 10.988h5.172c0.693 1.541 1.107 3.229 1.178 5.012h-5.934c-0.025-1.884-0.181-3.544-0.416-5.012zM20.398 3.896c2.967 1.153 5.402 3.335 6.928 6.090h-4.836c-0.549-2.805-1.383-4.799-2.092-6.090zM16.068 9.986v-6.996c1.066 0.047 2.102 0.216 3.092 0.493 0.75 1.263 1.719 3.372 2.33 6.503h-5.422zM9.489 22.014c-0.234-1.469-0.396-3.119-0.421-5.012h5.998v5.012h-5.577zM9.479 10.988h5.587v5.012h-6.004c0.025-1.886 0.183-3.543 0.417-5.012zM11.988 3.461c0.987-0.266 2.015-0.435 3.078-0.469v6.994h-5.422c0.615-3.148 1.591-5.265 2.344-6.525zM3.661 9.986c1.551-2.8 4.062-4.993 7.096-6.131-0.715 1.29-1.559 3.295-2.114 6.131h-4.982zM8.060 16h-6.060c0.066-1.781 0.467-3.474 1.158-5.012h5.316c-0.233 1.469-0.39 3.128-0.414 5.012zM8.487 22.014h-5.29c-0.694-1.543-1.139-3.224-1.204-5.012h6.071c0.024 1.893 0.188 3.541 0.423 5.012zM8.651 23.016c0.559 2.864 1.416 4.867 2.134 6.142-3.045-1.133-5.557-3.335-7.11-6.142h4.976zM15.066 23.016v6.994c-1.052-0.033-2.067-0.199-3.045-0.46-0.755-1.236-1.736-3.363-2.356-6.534h5.401zM21.471 23.016c-0.617 3.152-1.592 5.271-2.344 6.512-0.979 0.271-2.006 0.418-3.059 0.465v-6.977h5.403zM16.068 17.002h5.998c-0.023 1.893-0.188 3.542-0.422 5.012h-5.576v-5.012zM22.072 16h-6.004v-5.012h5.586c0.235 1.469 0.393 3.126 0.418 5.012zM23.070 17.002h5.926c-0.066 1.787-0.506 3.468-1.197 5.012h-5.152c0.234-1.471 0.398-3.119 0.423-5.012zM27.318 23.016c-1.521 2.766-3.967 4.949-6.947 6.1 0.715-1.276 1.561-3.266 2.113-6.1h4.834z"></path>
          <text font-size="${fontSize}%" x="60%" y="91%">${msg}</text>
          <text x="4%" y="98%" font-size="${fontSize}%" fill="white">${name}</text>
          <text x="55%" y="98%" font-size="${fontSize}%" fill="white">${dis}</text>
          <use xlink:href="#name" width="15" height="15" x="${width*21/100}" y="${height*81/100}" fill="black"/>
        </g>
        </svg>`;
    const svgBuffer = Buffer.from(svgImage, 'utf-8');
    const image = await sharp("img.jpeg")
      .composite([
        {
          input: svgBuffer,
          top: 0,
          left: 0
        }
      ]).resize({ width: 90, height: 20 })
      .toFile("uploads/"+Date.now()+".jpeg");
    return image
  } catch (error) {
    console.log(error);
  }
}


app.listen(8080);
console.log('Server is listening on port 8080')