import iso4217Data from '../data/iso4217-2018-08-29.json';

type Entity = {
  entity: string;
  currency: string;
  alphabeticCode: string;
  numericCode: number;
  minorUnit: number | null;
};

export const alphabeticCodes = extractCodes(iso4217Data);

function extractCodes(entities: Entity[]): string[] {
  const set = new Set<string>();
  const { length } = entities;
  for (let i = 0; i < length; ++i) {
    set.add(entities[i].alphabeticCode);
  }
  set.delete('');
  return Array.from(set);
}
