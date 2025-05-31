import amqp from 'amqplib';

export async function createRabbitChannel(host: string, port: number, user: string, password: string) {
  const connection = await amqp.connect({
    hostname: host,
    port: port,
    username: user,
    password: password,
  });
  const channel = await connection.createChannel();
  return { connection, channel };
}
