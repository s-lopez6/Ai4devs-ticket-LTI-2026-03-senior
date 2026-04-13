import type { Request, Response, NextFunction } from 'express';
import { CandidateController } from './candidateController';
import { ValidationError } from '../../application/errors';

describe('CandidateController - createCandidate', () => {
  it('should return 201 with wrapped success response when payload valid', async () => {
    const candidateService = {
      createCandidate: jest.fn().mockResolvedValue({
        id: 'id',
        fullName: 'Ada Lovelace',
        email: 'ada@example.com',
        phone: null,
        location: null,
        linkedInUrl: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }),
    };

    const controller = new CandidateController(candidateService as any);

    const req = {
      body: { fullName: 'Ada Lovelace', email: 'ada@example.com' },
    } as Request;

    const json = jest.fn();
    const status = jest.fn().mockReturnValue({ json });

    const res = { status } as unknown as Response;
    const next = jest.fn() as unknown as NextFunction;

    await controller.createCandidate(req, res, next);

    expect(status).toHaveBeenCalledWith(201);
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: 'Candidate created successfully',
      }),
    );
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next with error when validation fails', async () => {
    const candidateService = { createCandidate: jest.fn() };
    const controller = new CandidateController(candidateService as any);

    const req = { body: {} } as Request;
    const res = {} as Response;
    const next = jest.fn() as unknown as NextFunction;

    await controller.createCandidate(req, res, next);

    expect(next).toHaveBeenCalled();
    const firstArg = (next as unknown as jest.Mock).mock.calls[0][0];
    expect(firstArg).toBeInstanceOf(ValidationError);
  });
});
