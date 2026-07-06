import Mailgen from "mailgen";
import nodemailer from "nodemailer"

const sendingEmail = async (options) => {//options -> obejct
  const mailGenerator = new Mailgen({ // config our email themes and all
    theme : "default",
    product : {
      name : "Task Manager",
      link : "https://taskmanagerlink.com"
    }
  })

  //generator
  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent)
  const emailHtml = mailGenerator.generate(options.mailgenContent)

  const transporter = nodemailer.createTransport({ //this is our transpoert of email
    host : process.env.MAILTRAP_SMTP_HOST,
    port : process.env.MAILTRAP_SMTP_PORT,
    auth : { //authentication
      user : MAILTRAP_SMTP_USER,
      pass : MAILTRAP_SMTP_PASS
    }
  })

  const mail = {
    from : "iit.adv.2024@gmail.com",
    to : options.email,
    subject : options.subject,
    text : emailTextual,//if our browser not support html then its pick text , otherwise it take html
    html : emailHtml
  }

  try{
    await transporter.sendMail(mail)
  }catch(error){
    console.error("email service failed");
    console.error("Error : " , error);
  }
}


//email verification email - content
const emailVerficationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to Project Camp! We are excited to have you on board",
      action: {
        instructions: "To verify email please click on following button",
        button: {
          color: "#22BC66", // Optional action button color
          text: "Confirm your email",
          link: verficationUrl,
        },
      },
      //bottom part of email
      outro:
        "Need help , or have questions? Just reply to this email , we are love to help.",
    },
  };
};

//forgot password email - content
const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "Request to forgot your password",
      action: {
        instructions:
          "To forgot your password please click on following button",
        button: {
          color: "#b72515", // Optional action button color
          text: "forgot your password",
          link: passwordResetUrl,
        },
      },
      //bottom part of email
      outro:
        "Need help , or have questions? Just reply to this email , we are love to help.",
    },
  };
};

export { forgotPasswordMailgenContent
  , emailVerficationMailgenContent 
  , sendingEmail };

// refer npm mailgen doc for format
// for sending them currently to dev enviroment we are using mailtrap , go to sandbox for code template
//and nodemailer for sending (from npm packages)
