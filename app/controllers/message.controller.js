const db = require("../models");
const eMail = require("../middlewares/sendEmail");

const User = db.user;
const Apartment = db.apartment;
const Booking = db.booking;
const Message = db.message;

exports.postSendMessage = async (req, res) => {
    const { apartment, receiver, messageText } = req.body;

    console.log("data",req.body);

    const user = req.userId;
    //get email from receiver
    const receiverData = await User.findById(receiver);
    const receiverEmail = receiverData.email;
    const receiverName = receiverData.name;

    const senderData = await User.findById(user);
    const senderName = senderData.name;

    //get apartment name from apartment id
    let apartmentData, apartmentName;
        apartmentData = await Apartment.findById(apartment);
        apartmentName = apartmentData.name;
    

    const message = new Message({
        apartment,
        sender: user,
        receiver,
        messageText
    });
    await message.save();

    const emailMesasge = 
    `<h1>You have a new message</h1>
    <p>From: ${senderName}</p>
    <p>To: ${receiverName}</p>
    <p>Apartment: ${apartmentName}</p>
    <p>Message: ${messageText}</p>
    <p>Please visit your profile to answer the message</p>
    <p>Thanks</p>`;
    eMail.sendEmail(senderName, receiverEmail, "You have a new message at Unique Apartments", emailMesasge);

    res.status(200).json(message);
    //res.redirect('back');
}

exports.postConversation = async (req, res) => {
    //get all messages from conversation between two users
    const sender = req.body.sender;
    //console.log("sender",sender);
    //console.log("receiver",req.userId);

    //obtengo todos los mensajes en donde soy el emisor o el receptor y el otros usuario es el emisor o el receptor
    //


    const messages = await Message.find({$or: [{sender: sender, receiver: req.userId}, {sender: req.userId, receiver: sender}]}).populate('sender').populate('receiver');
    console.log("getMessages",messages);

    



    console.log("messages",messages);
    

     res.status(200).json(messages);

}
