const {startListener} = require('./listener');

const RABBITMQ_URL = process.env.RABBITMQ_URL;
const EXCHANGE_NAME = process.env.RABBITMQ_EXCHANGE_NAME;
const QUEUE_NAME = process.env.RABBITMQ_QUEUE_NAME;
const USERNAME = process.env.RABBITMQ_USER;
const PASSWORD = process.env.RABBITMQ_PASSWORD;

async function start() {

    if (!RABBITMQ_URL || !EXCHANGE_NAME || !QUEUE_NAME || !USERNAME || !PASSWORD) {
        throw new Error('RabbitMQ configuration is missing');
    }

    const connectionString = `amqp://${USERNAME}:${PASSWORD}@${RABBITMQ_URL}`;
    await startListener({
        url: connectionString,
        exchange: EXCHANGE_NAME,
        queue: QUEUE_NAME,
    });

}

start();
