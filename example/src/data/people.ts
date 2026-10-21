import type { Tone } from '../theme';

export type Person = {
  id: string;
  name: string;
  role: string;
  tone: Tone;
};

export const people: Person[] = [
  { id: '42', name: 'Jayant Kumar', role: 'Library author', tone: 'indigo' },
  { id: '7', name: 'Aarav Mehta', role: 'Android engineer', tone: 'teal' },
  { id: '13', name: 'Mia Chen', role: 'Product designer', tone: 'rose' },
  { id: '21', name: 'Leo Fischer', role: 'iOS engineer', tone: 'amber' },
  { id: '34', name: 'Sara Haddad', role: 'Tech lead', tone: 'sky' },
  { id: '55', name: 'Noah Silva', role: 'QA engineer', tone: 'violet' },
];

export function findPerson(id: string): Person | undefined {
  return people.find((person) => person.id === id);
}
