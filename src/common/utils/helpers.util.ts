export function duplicates(vals: string[]): string[] {
  const counts: { [uuid: string]: number } = {};
  const duplicates: string[] = [];
  for (const val of vals) {
    counts[val] = (counts[val] || 0) + 1;
    if (counts[val] === 2) {
      duplicates.push(val);
    }
  }
  return duplicates;
}
