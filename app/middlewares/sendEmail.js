const nodemailer = require('nodemailer');
const {
    google
} = require("googleapis");



const CLIENT_ID = "281561802752-e1dk69btdeuvga06eicq0cb7g75htctc.apps.googleusercontent.com";
const CLIENT_SECRET = "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";
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = "1//04XPkiDxGRaTFCgYIARAAGAQSNwF-L9IrnflzMSJgyxs8wK3AW3niVDfmiue3MB-WErBWFrflVN60zJE8ydCDYwDI6cW3cAVCNtk";

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);
oauth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

sendEmail = async (name, email, subject, message) => {
    try {
        const contentHTML = `
            <h1>Nuevo mensaje de contacto</h1>
            <ul>
                <li>Nombre: ${name}</li>
                <li>Email: ${email}</li>
                
            </ul>    
                <p>Mensaje: ${message}</p>
            
            `;
        const access_token = await oauth2Client.getAccessToken();
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'unique.apartments2022@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: access_token
            }
        });

        const mailOptions = {
            from: 'Unique Apartments <unique.apartments2022@gmail.com>',
            to: `${name} <${email}>`,
            subject: subject,
            html: contentHTML
        };

        const result = await transporter.sendMail(mailOptions);
        return result;

    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    sendEmail
}