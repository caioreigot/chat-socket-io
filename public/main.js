/*Script rodado no Front-end*/

const socket = io();

const chat = document.querySelector('#chat');
const authorInput = document.querySelector("input[name=username]");
const messageInput = document.querySelector("input[name=message]");

class Message {
    constructor(author, message) {
        this.author = author;
        this.message = message;
    }
}

/*Adiciona a mensagem ao chat*/
function renderMessage(messageObject) {
    const messagesDiv = document.querySelector('.messages');

    /*Adiciona a mensagem formatada como um elemento HTML depois
    do ultimo filho (se houver) de "messagesDiv"*/
    messagesDiv.insertAdjacentHTML('beforeend', `
        <div class="message">
            <strong>${messageObject.author}</strong>: ${messageObject.message}
        </div>
    `);
}

/*Quando um novo socket é conectado, o servidor envia esse
evento de "previousMessages" para recuperar as mensagens do chat
salvas no servidor*/
socket.on('previousMessages', messages => {
    messages.forEach(message => {
        renderMessage(message);
    });
});

/*Quando o servidor envia um evento de "receivedMessage"
para este socket, r*/
socket.on('receivedMessage', messageObject => {
    renderMessage(messageObject);
});

/*Event listener disparado ao clicar no botão de submit*/
chat.addEventListener("submit", event => {
    event.preventDefault();
    
    let author = authorInput.value;
    let message = messageInput.value;

    if (author.length && message.length) {
        const messageObject = new Message(author, message);
        renderMessage(messageObject);

        /*Limpando o input de mensagem*/
        messageInput.value = '';
        
        /*Enviando os dados ao servidor*/
        socket.emit('sendMessage', messageObject);
    }
});