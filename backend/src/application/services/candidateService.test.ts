import { CandidateService } from './candidateService';
import { ConflictError } from '../errors';
import type { CandidateRepository } from '../../domain/repositories/candidateRepository';
import type { CreateCandidateInput } from '../validator';

function buildRepository(
  overrides?: Partial<CandidateRepository>,
): CandidateRepository {
  return {
    findByEmailNormalized: async () => null,
    create: async (input: CreateCandidateInput) =>
      ({
        id: 'id',
        fullName: input.fullName,
        email: input.email,
        phone: input.phone ?? null,
        location: input.location ?? null,
        linkedInUrl: input.linkedInUrl ?? null,
        notes: input.notes ?? null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }) as const,
    ...overrides,
  };
}

describe('CandidateService - createCandidate', () => {
  it('should create candidate when email not taken', async () => {
    const repository = buildRepository();
    const service = new CandidateService(repository);

    const input: CreateCandidateInput = {
      fullName: 'Ada Lovelace',
      email: 'ada@example.com',
      emailNormalized: 'ada@example.com',
    };

    const result = await service.createCandidate(input);
    expect(result.email).toBe('ada@example.com');
  });

  it('should throw ConflictError when email already exists', async () => {
    const repository = buildRepository({
      findByEmailNormalized: async () =>
        ({
          id: 'id',
          fullName: 'Existing',
          email: 'ada@example.com',
          phone: null,
          location: null,
          linkedInUrl: null,
          notes: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        }) as const,
    });
    const service = new CandidateService(repository);

    const input: CreateCandidateInput = {
      fullName: 'Ada Lovelace',
      email: 'Ada@Example.com',
      emailNormalized: 'ada@example.com',
    };

    await expect(service.createCandidate(input)).rejects.toThrow(ConflictError);
  });
});
