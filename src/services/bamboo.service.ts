import axios, { Axios, AxiosResponse } from 'axios';
import { getCurrentDate } from './utils.service';
import { Tree } from '../objects/Tree';

export class BambooService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getBambooCustomReport(): Promise<object> {
    const response: AxiosResponse<any> = await axios.post(
      `https://${this.apiKey}:@api.bamboohr.com/api/gateway.php/willowtree/v1/reports/custom?format=JSON&onlyCurrent=true`,
      {
        fields: [
          'workEmail',
          'state',
          'city',
          'supervisorEId',
          'supervisorEmail',
          'hireDate',
          'customNamePronunciation(PhoneticSpelling)',
          'customPronoun',
          '4476',
          '4472',
        ],
      },
      {
        headers: { Accept: 'application/json' },
      },
    );

    console.log(JSON.stringify(response));

    const customReportList: any[] = response.data['employees'];
    return customReportList;
  }

  public addBambooCustomReport(
    employeesFromCustomReport: object[],
    existingEmailToTreeList: any,
  ) {
    employeesFromCustomReport.forEach((employee) => {
      const workEmail = employee['workEmail'];
      if (workEmail) {
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();

        if (existingEmailToTreeList['workEmailAsLowerCase']) {
          console.log('Multiple trees in bamboo with the same email.');

          let existingTree = existingEmailToTreeList.get(workEmailAsLowerCase);

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
              : undefined;
        }
      }
    });

    return existingEmailToTreeList;
  }

  public async getBambooWhosOutList(): Promise<object> {
    const currentDate = getCurrentDate();
    const response = await axios.get(
      `https://${this.apiKey}:@api.bamboohr.com/api/gateway.php/willowtree/v1/time_off/whos_out/?end=${currentDate}`,
      {
        headers: { Accept: 'application/json' },
      },
    );
    const whosOutList: any[] = response.data.employees;
    return whosOutList;
  }

  public async getBambooDirectory(): Promise<object> {
    const response = await axios.get(
      `https://${this.apiKey}:@api.bamboohr.com/api/gateway.php/willowtree/v1/employees/directory?`,
      {
        headers: { Accept: 'application/json' },
      },
    );
    const employeesList: any[] = response.data['employees'];
    return employeesList;
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
          console.log('Multiple trees in bamboo with the same email.');
        }
        emailToTreeMap.set(
          workEmailAsLowerCase,
          this.bambooObjectToTree(employee, workEmailAsLowerCase) as Object,
        );
      }
    });
    return emailToTreeMap;
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
