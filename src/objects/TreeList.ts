import { BambooService } from '../services/bamboo.service';
import { Tree } from './Tree';

export class TreeList {
  public trees: Tree[] | undefined;
  public emailToTreeMap: any = new Map<string, Object>();

  //Working
  public async addBambooEmployeeList(bambooService: BambooService) {
    const bambooDirectory = await bambooService.getBambooDirectory();
    this.emailToTreeMap = Object.fromEntries(
      this.generateEmailToTreeMap(bambooDirectory as object[]),
    );
  }

  public async addBambooCustomReport(bambooService: BambooService) {
    const employeesFromCustomReport =
      (await bambooService.getBambooCustomReport()) as object[];
    const existingEmailToTreeList = this.emailToTreeMap;

    employeesFromCustomReport.forEach((employee) => {
      const workEmail = employee['workEmail'];

      if (workEmail) {
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();

        if (existingEmailToTreeList[workEmailAsLowerCase]) {
          // console.log('Multiple trees in bamboo with the same email.');
          let existingTree = existingEmailToTreeList[workEmailAsLowerCase];
          this.mapBambooCustomReportAttributes(existingTree, employee);
        }
      }
    });
  }

  public async addBambooPtoList(bambooService: BambooService) {
    const bambooWhosOutList =
      (await bambooService.getBambooWhosOutList()) as object[];
    bambooWhosOutList.forEach((employee) => {
      let treeOnPTOId = employee['employeeId'];
      const existingTree = Object.values(this.emailToTreeMap).find(
        (emp) => emp['id'] === treeOnPTOId.toString(),
      );

      if (existingTree) {
        existingTree['employeeStatus'] = 'leave';
        existingTree['PTOStart'] = employee['start'];
        existingTree['PTOEnd'] = employee['end'];
        this.emailToTreeMap[existingTree['workEmail']] = existingTree;
      }
    });
  }

  public treeListToJSON() {
    this.trees = this.trees.filter(
      (tree) =>
        tree.id !== null &&
        tree.department !== 'Test / Bots' &&
        tree.name !== 'Lattice Bot',
    );

    const sortedTrees = this.trees.sort((a, b) =>
      a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()),
    );
    const result = JSON.stringify({ employees: sortedTrees }, null, 4);
    return result;
  }

  public generateEmailToTreeMap(
    employeesFromBambooDirectory: object[],
  ): Map<string, Object> {
    const emailToTreeMap = new Map<string, Object>();

    employeesFromBambooDirectory.forEach((employee) => {
      const workEmail = employee['workEmail'];
      if (workEmail) {
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();

        if (emailToTreeMap.has(workEmailAsLowerCase)) {
          // console.log('Multiple trees in bamboo with the same email.');
        }
        emailToTreeMap.set(
          workEmailAsLowerCase,
          this.bambooObjectToTree(employee, workEmailAsLowerCase) as Object,
        );
      }
    });
    return emailToTreeMap;
  }

  //Reminder: Call this after addBambooPtoList
  public updateTreesArray() {
    this.trees = Object.values(this.emailToTreeMap);
  }

  public mapBambooCustomReportAttributes(existingTree: any, employee: any) {
    existingTree['supervisorId'] = employee['supervisorEId'];
    existingTree['supervisorEmail'] = employee['supervisorEmail'];
    existingTree['city'] = employee['city'];
    existingTree['state'] = employee['state'];
    existingTree['pronunciation'] =
      employee['customNamePronunciation(PhoneticSpelling)'];
    existingTree['hireDate'] = employee['hireDate'];
    existingTree['pronouns'] = employee['customPronoun'];
    existingTree['newHireMentor'] = employee['customNewHireMentor'];
    existingTree['longTermMentor'] = employee['customLongTermMentor'];
    existingTree['state'] =
      existingTree['state'] == '' ? (existingTree['state'] = null) : undefined;
  }

  public bambooObjectToTree(
    employee: object,
    workEmailAsLowerCase: string,
  ): Object {
    const tree = new Tree();

    tree.id = employee['id'];
    tree.name = employee['displayName'];
    tree.firstName = employee['firstName'];
    tree.lastName = employee['lastName'];
    tree.preferredName = employee['preferredName'] || null;
    tree.displayName = employee['displayName'];
    tree.department = employee['department'] || null;
    tree.jobTitle = employee['jobTitle'] || null;
    tree.location = employee['location'] || 'NA';
    tree.pronouns = employee['pronouns'] || null;
    tree.photoUrl = employee['photoUrl'] || null;
    tree.supervisor = employee['supervisor'] || null;
    tree.allocations = employee['allocations'];
    // tree.skills = employee['skills'];
    tree.pronunciation = employee['pronunciation'] || null;
    tree.branch = employee['branch'] || null;
    tree.employeeStatus = 'default';
    tree.PTOStart = null;
    tree.PTOEnd = null;
    tree.hireDate = employee['hireDate'] || null;
    tree.supervisorId = employee['supervisorId'] || null;
    tree.supervisorEmail = employee['supervisorEmail'] || null;
    tree.email = workEmailAsLowerCase;
    tree.allocations = [];

    if (!tree.preferredName || tree.preferredName === tree.lastName) {
      tree.displayName = tree.name;
    } else {
      tree.displayName = `${tree.preferredName} ${tree.lastName}`;
    }

    const retVal = {
      id: employee['id'],
      name: employee['displayName'],
      firstName: employee['firstName'],
      lastName: employee['lastName'],
      preferredName: employee['preferredName'] || null,
      displayName: tree.displayName,
      department: employee['department'] || null,
      jobTitle: employee['jobTitle'] || null,
      location: employee['location'] || 'NA',
      pronouns: employee['pronouns'] || null,
      photoUrl: employee['photoUrl'] || null,
      supervisor: employee['supervisor'] || null,
      allocations: tree.allocations,
      skills: [],
      pronunciation: employee['pronunciation'] || null,
      branch: employee['branch'] || null,
      employeeStatus: 'default',
      PTOStart: null,
      PTOEnd: null,
      hireDate: employee['hireDate'] || null,
      supervisorId: employee['supervisorId'] || null,
      supervisorEmail: employee['supervisorEmail'] || null,
      email: workEmailAsLowerCase,
      state: employee['state'] || null,
      city: employee['city'] || null,
      newHireMentor: employee['newHireMentor'] || null,
      longTermMentor: employee['longTermMentor'] || null,
      slackId: employee['slackId'] || null,
    };
    return retVal;
  }
}
