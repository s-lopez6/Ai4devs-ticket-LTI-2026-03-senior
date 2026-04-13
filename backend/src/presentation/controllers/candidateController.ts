import type { Request, Response, NextFunction } from 'express';
import { validateCreateCandidatePayload } from '../../application/validator';
import type { CandidateService } from '../../application/services/candidateService';

export class CandidateController {
  constructor(private readonly candidateService: CandidateService) {}

  createCandidate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const input = validateCreateCandidatePayload(req.body);
      const candidate = await this.candidateService.createCandidate(input);

      res.status(201).json({
        success: true,
        data: candidate,
        message: 'Candidate created successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
