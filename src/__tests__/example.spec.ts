function sum(a: number, b: number): number {
  return a + b;
}

test('sum adds two numbers correctly', () => {
  expect(sum(1, 2)).toBe(3);
});
