import axios, { AxiosResponse } from 'axios';

export class BambooService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  public async getBambooCustomReport(): Promise<any[]> {
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

  public async getBambooWhosOutList() {}
  public async getBambooDirectory() {}
}
