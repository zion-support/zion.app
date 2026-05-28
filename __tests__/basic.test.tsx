// Simple test to verify Jest setup works
describe('Basic Test', () => {
  it('should pass', () => {
    expect(true).toBe(true);
  });

  it('should add numbers correctly', () => {
    expect(2 + 2).toBe(4);
  });

  it('should handle strings', () => {
    const message = 'Hello World';
    expect(message).toBe('Hello World');
  });
});