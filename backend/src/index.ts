import express from 'express';
import dotenv from 'dotenv';
import { buildCandidateRoutes } from './routes/candidateRoutes';
import { errorMiddleware } from './middleware/errorMiddleware';

dotenv.config();

export const app = express();
const port = 3010;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use(express.json());
app.use(buildCandidateRoutes());
app.use(errorMiddleware);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}
