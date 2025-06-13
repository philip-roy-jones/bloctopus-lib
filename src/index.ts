import amqp from 'amqplib';
import { Request, Response, NextFunction } from 'express';

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

export function injectUserId(req: Request, res: Response, next: NextFunction) {
  try {
    const rawPayload = req.headers['x-jwt-payload'];

    if (!rawPayload || typeof rawPayload !== 'string') {
      return res.status(401).json({ error: 'Missing auth payload' });
    }

    const { userId } = JSON.parse(rawPayload);

    if (!userId) {
      return res.status(403).json({ error: 'Invalid token: no userId' });
    }

    // Attach userId to request (optionally cast to custom type)
    (req as any).userId = userId;

    next();
  } catch (err) {
    return res.status(400).json({ error: 'Malformed JWT payload' });
  }
}
