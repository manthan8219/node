var express = require('express');
const app = express()
var router = express.Router();
var nodemailer = require('nodemailer');
var cors = require('cors');
const creds = require('./config');
const { response } = require('express');

app.use(cors())
app.use(express.json())
app.listen(3002)
app.use(express.urlencoded({extended: true}));

var transport = {
    host: 'smtp.gmail.com', // Don’t forget to replace with the SMTP host of your provider
    port: 587,
    auth: {
    user: creds.USER,
    pass: creds.PASS
  }
}

var transporter = nodemailer.createTransport(transport)

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log('Server is ready to take messages');

  }

});

app.get('/',(req,res)=>{
    res.json({message:"this api is used to send mail"});
})

app.post('/send', (req, res) => {
  var name = req.body.name
  var email = req.body.email
  var subject = req.body.subject
  var text = `name: ${name} \n email: ${email} \n message: ${subject} `

  var mail = {
    from: name,
    to: 'manthanbhatia367@gmail.com',  
    subject: subject,
    text: text
  }

  transporter.sendMail(mail, (err, data) => {
    if (err) {
        console.log(err)
      res.json({
        status: 'fail'
      })
    } else {
      res.json({
       status: 'success'
      })
      transporter.sendMail({
    	from: "Manthanbhatia367@gmail.com",
    	to: email,
    	subject: "Submission was successful",
    	text: `Thank you for contacting us!\n\nForm details\nName: ${name}\nEmail: ${email}\nSubject: ${subject}`
  }, function(error, info){
    	if(error) {
      	  console.log(error);
    	} else{
      	  console.log('Message sent: ' + info.response);
    	}
});
    }
  })
})
