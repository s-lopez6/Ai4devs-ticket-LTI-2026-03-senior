import type { Candidate } from '../models/candidate';
import type { CreateCandidateInput } from '../../application/validator';

export interface CandidateRepository {
  findByEmailNormalized(emailNormalized: string): Promise<Candidate | null>;
  create(input: CreateCandidateInput): Promise<Candidate>;
}
