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

    const customReportList: any[] = response.data['employees'];
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
}
