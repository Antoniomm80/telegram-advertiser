const amqp = require('amqplib');
const {sendMessage} = require('./telegram');

let connection, channel;

async function startListener({url, exchange, queue}) {
    connection = await amqp.connect(url);
    channel = await connection.createChannel();
    await channel.assertExchange(exchange, 'fanout', {durable: true});
    await channel.assertQueue(queue, {durable: true});

    await channel.bindQueue(queue, exchange, '#'); // Use '#' to receive all routing keys

    console.log(`[*] Listening on queue "${queue}" bound to exchange "${exchange}"`);

    channel.consume(queue, async (msg) => {
        if (msg !== null) {
            const content = JSON.parse(msg.content.toString());
            const {message, createDate} = content;
            console.log(`[x] Received: ${message} created on ${createDate} from queue ${queue}. Sending to Telegram...`);
            await sendMessage(message);
            channel.ack(msg);
        }
    });
}

async function stopListener() {
    await channel?.close();
    await connection?.close();
}

module.exports = {startListener, stopListener};
