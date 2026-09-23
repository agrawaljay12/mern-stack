const sendgrid = require("sendgrid");

const sgmail = sendgrid(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html,text) => {
    try{
        const msg = {
            to,
            from: process.env.SENDGRID_EMAIL,
            subject,
            html,
            text
        };
        await sgmail.send(msg);

    }
    catch(error){
        console.log(error);
        throw new Error("Email sending failed");
    }
}