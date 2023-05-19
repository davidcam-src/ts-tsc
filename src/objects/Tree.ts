import * as data from './data.json';

export const people: Tree[] = data.employees;

export interface Tree {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  preferredName?: string | null;
  displayName: string;
  jobTitle: string;
  department: string;
  location: string;
  branch: string;
  supervisorId: string;
  supervisor: string;
  photoUrl: string;
  allocations: Allocation[];
  skills: string[];
  employeeStatus: string;
  pronouns: string | null;
  pronunciation: string | null;
}

export interface Allocation {
  client: string;
  project: string;
}
