import amqp from 'amqplib';
import { Request, Response, NextFunction, RequestHandler } from 'express';

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

export const injectUserId: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawPayload = req.headers['x-jwt-payload'];

    if (!rawPayload || typeof rawPayload !== 'string') {
      res.status(401).json({ error: 'Missing auth payload' });
      return;
    }

    const { userId } = JSON.parse(rawPayload);

    if (!userId) {
      res.status(403).json({ error: 'Invalid token: no userId' });
      return;
    }

    // Attach userId to request (optionally cast to custom type)
    (req as any).userId = userId;

    next();
  } catch (err) {
    res.status(400).json({ error: 'Malformed JWT payload' });
    return;
  }
}
