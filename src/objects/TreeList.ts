import { Tree } from './Tree';

export class TreeList {
  public trees: Tree[] | undefined;
  public emailToTreeMap: Map<string, Tree> | undefined;

  constructor(
    trees: Tree[] | undefined,
    emailToTreeMap: Map<string, Tree> | undefined,
  ) {
    this.trees = trees;
    this.emailToTreeMap = emailToTreeMap;
  }

  public addBambooEmployeeList(employees: object) {}
}
