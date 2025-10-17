import { TokenMiddleware } from './token.middleware';

describe('TokenMiddlewareMiddleware', () => {
  it('should be defined', () => {
    expect(new TokenMiddleware()).toBeDefined();
  });
});
