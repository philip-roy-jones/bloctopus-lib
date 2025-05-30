import amqp from 'amqplib';

export async function createRabbitChannel() {
  const connection = await amqp.connect('amqp://rabbitmq'); // hostname from docker-compose
  const channel = await connection.createChannel();
  return { connection, channel };
}
