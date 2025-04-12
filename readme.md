# Telegram Advertiser

Recoge un mensaje de una cola de RabbitMQ y lo envía a un canal de Telegram.

## Requisitos

Deben existir las siguientes variables de entorno:

- `RABBITMQ_HOST`: Host de RabbitMQ.
- `RABBITMQ_USER`: Usuario de RabbitMQ.
- `RABBITMQ_PASSWORD`: Contraseña de RabbitMQ.
- `RABBITMQ_QUEUE`: Nombre de la cola de RabbitMQ.
- `TELEGRAM_TOKEN`: Token de la API de Telegram.
- `TELEGRAM_CHAT_ID`: ID del chat de Telegram al que se enviará el mensaje.