import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { buildCandidateRoutes } from './routes/candidateRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';
import { requestContextMiddleware } from './middleware/requestContext';
import { requestLoggerMiddleware } from './middleware/requestLogger';
import { logger } from './infrastructure/logger';

dotenv.config();

export const app = express();
const port = 3010;

const defaultAllowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
];

const allowedOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (no Origin header), e.g. curl, server-to-server.
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0) {
        return callback(null, defaultAllowedOrigins.includes(origin));
      }
      return callback(null, allowedOrigins.includes(origin));
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(requestContextMiddleware);
app.use(requestLoggerMiddleware);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(buildCandidateRoutes());
app.use(errorMiddleware);

if (require.main === module) {
  app.listen(port, () => {
    logger.info({ port }, `Server is running at http://localhost:${port}`);
  });
}
