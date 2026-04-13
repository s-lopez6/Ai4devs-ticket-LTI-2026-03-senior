import type { Router } from 'express';
import { Router as expressRouter } from 'express';
import { CandidateController } from '../presentation/controllers/candidateController';
import { CandidateService } from '../application/services/candidateService';
import { PrismaCandidateRepository } from '../infrastructure/repositories/prismaCandidateRepository';

export function buildCandidateRoutes(): Router {
  const router = expressRouter();

  const candidateRepository = new PrismaCandidateRepository();
  const candidateService = new CandidateService(candidateRepository);
  const candidateController = new CandidateController(candidateService);

  router.post('/candidates', candidateController.createCandidate);

  return router;
}
