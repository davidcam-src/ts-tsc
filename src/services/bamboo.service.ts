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

    const customReportList: any[] = response.data.employees;
    return customReportList;
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

  //   public addBambooEmployeeListDraft(
  //     employeesFromBambooDirectory: object[],
  //   ): Promise<object> {
  //     const emailToTreeMap = new Map<string, object>();
  //   }

  public generateEmailToTreeMap(
    employeesFromBambooDirectory: object[],
  ): Map<string, object> {
    const emailToTreeMap = new Map<string, object>();

    employeesFromBambooDirectory.forEach((employee) => {
      const workEmail = employee['workEmail'];
      if (workEmail) {
        if (emailToTreeMap.has(workEmail)) {
          console.log('Multiple trees in bamboo with the same email.');
        }
        const workEmailAsLowerCase = (workEmail as string).toLowerCase();
        // console.log({
        //   workEmailAsLowerCase: workEmailAsLowerCase,
        //   treeObject: this.bambooObjectToTree(employee, workEmailAsLowerCase),
        // });
        emailToTreeMap.set(
          workEmailAsLowerCase,
          this.bambooObjectToTree(employee, workEmailAsLowerCase),
        );
        // console.log(emailToTreeMap);
      }
    });

    //Drafting: add emailToTreeMap to the TreeList Object
    console.log(
      'Email To Tree Logging HERE:',
      JSON.stringify(emailToTreeMap, null, 2),
    );
    return emailToTreeMap;
  }

  public bambooObjectToTree(
    employee: object,
    workEmailAsLowerCase: string,
  ): Tree {
    const tree = new Tree();

    tree.email = workEmailAsLowerCase;
    tree.name = employee['displayName'];
    tree.firstName = employee['firstName'];
    tree.lastName = employee['lastName'];
    tree.preferredName = employee['preferredName'] || null;
    tree.displayName = employee['displayName'];
    tree.department = employee['department'] || null;
    tree.jobTitle = employee['jobTitle'] || null;
    tree.location = employee['location'] || null;
    tree.pronouns = employee['pronouns'] || null;
    tree.photoUrl = employee['photoUrl'] || null;
    tree.supervisor = employee['supervisor'] || null;
    tree.location = employee['location'] || 'NA';
    tree.employeeStatus = 'default';
    tree.PTOStart = null;
    tree.PTOEnd = null;

    if (!tree.preferredName || tree.preferredName === tree.lastName) {
      tree.displayName = tree.name;
    } else {
      tree.displayName = `${tree.preferredName} ${tree.lastName}`;
    }

    // tree.branch = employee['branch'];
    // tree.supervisorId = employee['supervisorEId'];
    // tree.allocations = employee['allocations'];
    // tree.skills = employee['skills'];
    // tree.employeeStatus = employee['employeeStatus'];
    // tree.pronunciation = employee['pronunciation'];

    return tree;
  }
}
