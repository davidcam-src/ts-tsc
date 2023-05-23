import { BambooService } from '../services/bamboo.service';
import { Tree } from './Tree';

export class TreeList {
  public trees: Tree[] | undefined;
  public emailToTreeMap: any;

  //addBambooEmployeeList, addBambooCustomReport, addBambooProList and treeListToJSON most important

  //Updates the emailToTreeMap with the latest information from Bamboo
  public async addBambooEmployeeList(bambooService: BambooService) {
    const bambooDirectory = await bambooService.getBambooDirectory();
    //Use the response we get back to generate a map of email addresses to tree objects
    //Object.fromEntries() is used to convert the Map into an object since maps seem to be serialized differently from objects. Mostly to get around testing
    this.emailToTreeMap = Object.fromEntries(
      this.generateEmailToTreeMap(bambooDirectory as object[]),
    );
  }

  //Adds the attributes from the bamboo custom report to existing entries in the emailToTreeMap
  public async addBambooCustomReport(bambooService: BambooService) {
    //Converting raw object to array of objects to iterate through
    const employeesFromCustomReport =
      (await bambooService.getBambooCustomReport()) as object[];
    //Getting the map of email addresses to tree objects
    const existingEmailToTreeList = this.emailToTreeMap;

    //Iterating through the employees from the custom report
    employeesFromCustomReport.forEach((employee) => {
      // Getting the email of the employee, and converting it to lowercase after a null check
      const workEmail = employee['workEmail'];
      if (workEmail) {
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();
        // Checking if the email from the custom report is in the map of emails to trees, and if so, adding the custom report attributes to the tree
        if (existingEmailToTreeList[workEmailAsLowerCase]) {
          // console.log('Multiple trees in bamboo with the same email.');
          let existingTree = existingEmailToTreeList[workEmailAsLowerCase];
          this.mapBambooCustomReportAttributes(existingTree, employee);
        }
      }
    });
  }

  //Adds the attributes from the bamboo PTO list to entries in the emailToTreeMap
  public async addBambooPtoList(bambooService: BambooService) {
    const bambooWhosOutList =
      (await bambooService.getBambooWhosOutList()) as object[];
    //Iterating through the employees from the PTO list
    bambooWhosOutList.forEach((employee) => {
      //Retrieving the ID of the employee on PTO to find someone in the existing emailToTreeMap with the same ID
      let treeOnPTOId = employee['employeeId'];
      const existingTree = Object.values(this.emailToTreeMap).find(
        (emp) => emp['id'] === treeOnPTOId.toString(),
      );

      //If the employee is in the emailToTreeMap, then we update the employeeStatus, PTOStart, and PTOEnd attributes
      if (existingTree) {
        existingTree['employeeStatus'] = 'leave';
        existingTree['PTOStart'] = employee['start'];
        existingTree['PTOEnd'] = employee['end'];

        //Bug for Demo #3
        // existingTree['employeeStatus'] = 'fakeLeave';
        // existingTree['PTOStart'] = 'fakeStart';
        // existingTree['PTOEnd'] = 'fakeEnd';
        this.emailToTreeMap[existingTree['workEmail']] = existingTree;
      }
    });
  }

  public treeListToJSON() {
    // Removing trees with null ids, trees with the department 'Test / Bots', and the name 'Lattice Bot'
    this.trees = this.trees.filter(
      (tree) =>
        tree.id !== null &&
        tree.department !== 'Test / Bots' &&
        tree.name !== 'Lattice Bot',
    );
    // Sorting the trees by lower case conversions of display name
    // localeCompare used to compare strings
    const sortedTrees = this.trees.sort((a, b) =>
      a.displayName.toLowerCase().localeCompare(b.displayName.toLowerCase()),
    );
    // sortedTrees is the employee array in our response
    const result = JSON.stringify({ employees: sortedTrees }, null, 4);
    return result;
  }

  public generateEmailToTreeMap(
    employeesFromBambooDirectory: object[],
  ): Map<string, Object> {
    const emailToTreeMap = new Map<string, Object>();
    // Loops through employees from bamboo directory and adds them to the emailToTreeMap
    employeesFromBambooDirectory.forEach((employee) => {
      // Getting the email of the employee, and converting it to lowercase after a null check
      const workEmail = employee['workEmail'];
      if (workEmail) {
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();
        // Adding the employee to the map as a tree with the email as the key
        // bambooObjectToTree converts the employee data to a tree object
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
    //Bug for Demo #2
    // existingTree['supervisorId'] = 'fakeSupervisorId';
    // existingTree['supervisorEmail'] = 'fakeSupervisorEmail';
    // existingTree['city'] = 'fakeCity';

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
      existingTree['state'] == ''
        ? (existingTree['state'] = null)
        : employee['state'];
  }

  public bambooObjectToTree(
    employee: object,
    workEmailAsLowerCase: string,
  ): Object {
    //Instantiates new tree object
    const tree = new Tree();

    //Mapping fields within BambooAPI response to tree object fields

    //Bug for Demo #1
    // tree.id = 'fakeId';
    // tree.name = 'fakeName';
    // tree.firstName = 'fakeFirstName';

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
      //Defaults to Bamboo name if preferred name does not exist or is last name
      tree.displayName = tree.name;
    } else {
      //Display name is preferred name + last name if preferred name exists
      tree.displayName = `${tree.preferredName} ${tree.lastName}`;
    }

    //Changed to object because of serialization issues
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
