import { ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { JwtAuthGuard } from './jwt-auth.guard';

describe('JwtAuthGuard', () => {
  let guard: JwtAuthGuard;

  beforeEach(() => {
    jest.clearAllMocks();

    guard = new JwtAuthGuard();
  });

  describe('getRequest', () => {
    it('should return the request from the GraphQL context', () => {
      const request = {
        headers: {
          authorization: 'Bearer access-token',
        },
      };

      const gqlContextMock = {
        getContext: jest.fn().mockReturnValue({
          req: request,
        }),
      };

      jest
        .spyOn(GqlExecutionContext, 'create')
        .mockReturnValue(gqlContextMock as unknown as GqlExecutionContext);

      const executionContext = {} as ExecutionContext;

      const result = guard.getRequest(executionContext);

      expect(result).toBe(request);
      expect(GqlExecutionContext.create).toHaveBeenCalledWith(
        executionContext,
      );
      expect(gqlContextMock.getContext).toHaveBeenCalledTimes(1);
    });
  });
});