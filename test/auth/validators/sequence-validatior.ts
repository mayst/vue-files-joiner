export function containsSubsequence(params: { readonly target: string; readonly pattern: string; readonly subsequenceLength: number }): boolean {
  const { target, pattern, subsequenceLength } = params;

  if (subsequenceLength < 1 || subsequenceLength > target.length || subsequenceLength > pattern.length) {
    return false;
  }

  return Array.from(Array(target.length - subsequenceLength + 1).keys())
    .map((i) => target.substring(i, i + subsequenceLength))
    .some((sequence) => pattern.includes(sequence));
}
