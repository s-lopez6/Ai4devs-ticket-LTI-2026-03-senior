import type { CandidateRepository } from '../../domain/repositories/candidateRepository';
import type { Candidate } from '../../domain/models/candidate';
import type { CreateCandidateInput } from '../../application/validator';
import { prisma } from '../prismaClient';

export class PrismaCandidateRepository implements CandidateRepository {
  async findByEmailNormalized(
    emailNormalized: string,
  ): Promise<Candidate | null> {
    // Prisma client types may be out of date until `prisma generate` is run.
    // Cast to keep TypeScript compile stable in fresh clones.
    const candidate = await (prisma as any).candidate.findUnique({
      where: { emailNormalized },
    });

    return candidate
      ? {
          ...candidate,
          phone: candidate.phone ?? null,
          location: candidate.location ?? null,
          linkedInUrl: candidate.linkedInUrl ?? null,
          notes: candidate.notes ?? null,
        }
      : null;
  }

  async create(input: CreateCandidateInput): Promise<Candidate> {
    const candidate = await (prisma as any).candidate.create({
      data: {
        fullName: input.fullName,
        email: input.email,
        emailNormalized: input.emailNormalized,
        phone: input.phone,
        location: input.location,
        linkedInUrl: input.linkedInUrl,
        notes: input.notes,
      },
    });

    return {
      ...candidate,
      phone: candidate.phone ?? null,
      location: candidate.location ?? null,
      linkedInUrl: candidate.linkedInUrl ?? null,
      notes: candidate.notes ?? null,
    };
  }
}
