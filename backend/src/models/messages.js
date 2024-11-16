//models/messages.js
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },       // Contenido del mensaje
    username: { type: String, required: true },      // Nombre de usuario o bot que envió el mensaje
    timestamp: { type: Date, default: Date.now }     // Fecha y hora del mensaje
});

const Message = mongoose.model('Message', messageSchema);

export default Message;