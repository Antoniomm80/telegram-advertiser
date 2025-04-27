# Telegram Advertiser

Recoge un mensaje de una cola de RabbitMQ y lo envía a un canal de Telegram.

## Project Structure

The project follows JavaScript best practices with a clear separation of concerns:

- `src/`: Contains all production code
  - `app.js`: Main application entry point
  - `listener.js`: RabbitMQ listener implementation
  - `telegram.js`: Telegram API integration

- `tests/`: Contains all test code
  - `unit/`: Unit tests for individual components
  - `integration/`: Integration tests that test multiple components together
  - `e2e/`: End-to-end tests that test the entire application

## Requisitos

Deben existir las siguientes variables de entorno:

- `RABBITMQ_HOST`: Host de RabbitMQ.
- `RABBITMQ_USER`: Usuario de RabbitMQ.
- `RABBITMQ_PASSWORD`: Contraseña de RabbitMQ.
- `RABBITMQ_QUEUE`: Nombre de la cola de RabbitMQ.
- `TELEGRAM_TOKEN`: Token de la API de Telegram.
- `TELEGRAM_CHAT_ID`: ID del chat de Telegram al que se enviará el mensaje.

### Docker

Image creation steps

``` bash
docker build -t telegram-advertiser .
docker tag telegram-advertiser:latest 192.168.4.30:5000/telegram-advertiser:latest
docker push 192.168.4.30:5000/telegram-advertiser:latest
```

### K8s

Port forwarding for accessing RabbitMQ web UI outside the cluster

``` bash
k -n broker port-forward svc/rabbitmq 15672:15672
```
