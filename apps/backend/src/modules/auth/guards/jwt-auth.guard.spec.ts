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

      const getContextMock = jest.fn().mockReturnValue({
        req: request,
      });

      const gqlContextMock = {
        getContext: getContextMock,
      };

      const createMock = jest.spyOn(GqlExecutionContext, 'create');

      createMock.mockReturnValue(
        gqlContextMock as unknown as GqlExecutionContext,
      );

      const executionContext = {} as ExecutionContext;

      const result = guard.getRequest(executionContext);

      expect(result).toBe(request);
      expect(createMock).toHaveBeenCalledWith(executionContext);
      expect(getContextMock).toHaveBeenCalledTimes(1);
    });
  });
});
