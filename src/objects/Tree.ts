import * as data from './data.json';

export const people: Tree[] = data.employees;

export class Tree {
  public id: string;
  public name: string;
  public firstName: string;
  public lastName: string;
  public preferredName?: string | null;
  public displayName: string;
  public jobTitle: string;
  public department: string;
  public location: string;
  public branch: string;
  public supervisorId: string | null = null;
  public supervisor: any;
  public photoUrl: string;
  public allocations: any;
  public employeeStatus: string;
  public pronouns: string | null;
  public pronunciation: string | null;
  public hireDate: string | null;
  public supervisorEmail: string | null;
  public newHireMentor: string | null;
  public longTermMentor: string | null;
  public slackId: string | null;
  public state: string | null;
  public city: string | null;
  public email: string | null;
  public PTOStart: any;
  public PTOEnd: any;
  public skills: any[] | null;
}

// export interface Allocation {
//   client: string;
//   project: string;
// }
