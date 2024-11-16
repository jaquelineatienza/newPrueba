import { getBotResponse, saveMessage } from '../controllers/chatbotcontroller.js';

const socketEvents = (io) => {
    io.on('connection', (socket) => {
        console.log('Un usuario se ha conectado');

        // Enviar un mensaje de bienvenida al usuario
        socket.emit('message', 'Bienvenido al chat de soporte. ¿Cómo podemos ayudarte?');
        sendOptions(socket); // Enviar opciones disponibles al usuario

        socket.on('chat message', async (msg) => {
            try {
                const username = "Cliente"; // Usuario predefinido
                const botUsername = "SoporteBot"; // Nombre del chatbot

                if (!msg) {
                    console.error('El mensaje está vacío.');
                    return;
                }

                console.log('Recibiendo mensaje:', msg, 'por el usuario:', username);
                const botResponse = getBotResponse(msg);

                // Guardar mensajes en la base de datos
                await saveMessage(msg, username); // Guardar mensaje del usuario
                await saveMessage(botResponse, botUsername); // Guardar respuesta del bot

                // Enviar la respuesta del bot al cliente
                socket.emit('message', botResponse);
            } catch (e) {
                console.error('Error al procesar el mensaje:', e);
            }
        });

        // Escuchar las selecciones de opciones del usuario
        socket.on('optionSelected', (selectedOption) => {
            console.log('Opción seleccionada:', selectedOption);
            let response = handleOptionSelection(selectedOption);
            socket.emit('message', response, selectedOption); // Enviar respuesta de la opción seleccionada
            sendOptions(socket); // Volver a enviar opciones después de la selección
        });

        socket.on('disconnect', () => {
            console.log('Un usuario se ha desconectado');
        });
    });
};

// Función para enviar opciones al usuario
const sendOptions = (socket) => {
    socket.emit('options', {
        question: 'Elige una opción:',
        options: ['Métodos de pago', 'Envíos', 'Devoluciones', 'Productos agotados', 'Otros']
    });
};

// Manejar la selección de opciones
const handleOptionSelection = (selectedOption) => {
    switch (selectedOption) {
        case 'Métodos de pago':
            return 'Aceptamos tarjetas de crédito, débito, PayPal y transferencias bancarias.';
            case '¿Cuáles son los horarios de atención al cliente?':
            return 'Podes ingresar y comprar en nuestra tienda online las 24hs del dia.';
        case 'Envíos':
            return 'Hacemos envíos a todas las localidades de Formosa.';
        case 'Devoluciones':
            return 'Puedes devolver tu producto dentro de los primeros 14 días.';
            case '¿Tienen un catálogo actualizado?':
                return 'Si, nuestro catálogo se mantiene actualizado siempre';
            case 'Otros':
            return 'Si tienes alguna otra pregunta, ingresa al siguiente link para una atencion mas personalizada: https://wa.me/3704266289.';
        default:
            return 'Lo siento, no entiendo esa opción.';
    }
};

export default socketEvents;