import { ConflictError } from '../errors';
import type { Candidate } from '../../domain/models/candidate';
import type { CandidateRepository } from '../../domain/repositories/candidateRepository';
import type { CreateCandidateInput } from '../validator';

export class CandidateService {
  constructor(private readonly candidateRepository: CandidateRepository) {}

  async createCandidate(input: CreateCandidateInput): Promise<Candidate> {
    const existing = await this.candidateRepository.findByEmailNormalized(
      input.emailNormalized,
    );
    if (existing) {
      throw new ConflictError('A candidate with this email already exists');
    }

    return await this.candidateRepository.create(input);
  }
}
