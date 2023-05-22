import * as fs from 'fs';
import * as path from 'path';
import { TreeList } from '../objects/TreeList';
import { mockSlackUsersStore } from './data/mock_slack_users_store';
import { BambooService } from '../services/bamboo.service';
import { mock } from 'node:test';
import axios from 'axios';

// Load all of the data files into memory
const dataPath = path.join(__dirname, 'data');

const mockBambooDirectory = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_bamboo_directory.json'), 'utf8'),
);
const mockBambooDirectoryUppercase = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_bamboo_directory_uppercase.json'),
    'utf8',
  ),
);
const mockDatalakeEmployees = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_datalake_employees.json'), 'utf8'),
);
const mockDatalakeSkills = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_datalake_skills.json'), 'utf8'),
);
const mockBambooCustomReport = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_bamboo_custom_report.json'),
    'utf8',
  ),
);
const mockBambooPtoList = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_bamboo_pto_list.json'), 'utf8'),
);
const expectedOutput = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'expected_output.json'), 'utf8'),
);
const mockListBambooEmployees = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_list_bamboo_employees.json'),
    'utf8',
  ),
);
const mockListDatalakeEmployees = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_list_datalake_employees.json'),
    'utf8',
  ),
);
const mockListWithSkills = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_list_with_skills.json'), 'utf8'),
);
const mockListWithCustomBambooReport = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_list_custom_bamboo_report.json'),
    'utf8',
  ),
);
const mockListWithPto = JSON.parse(
  fs.readFileSync(path.join(dataPath, 'mock_list_with_pto.json'), 'utf8'),
);
const mockListWithSupervisorDisplayName = JSON.parse(
  fs.readFileSync(
    path.join(dataPath, 'mock_list_with_supervisor_display_name.json'),
    'utf8',
  ),
);

describe('TreeList', () => {
  //Bamboo Test Stucture:
  //1. Instantiate TreeList and BambooService
  //2. Mock responses from the BambooAPI within the BambooService, which is called by the TreeList
  //3. Spy on the BambooService methods that are called by the TreeList, to make sure they're called
  //4. Call the TreeList methods that call the BambooService methods
  //5. Assert that the BambooService methods were called
  //6. Assert that the TreeList has the correct data

  test('should add Bamboo employee list', async () => {
    //Step 1:
    let treeList = new TreeList();
    let bambooService = new BambooService('123');

    //Step 2:
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: mockBambooDirectory });

    //Step 3:
    const getBambooDirectorySpy = jest.spyOn(
      bambooService,
      'getBambooDirectory',
    );

    //Step 4:
    await treeList.addBambooEmployeeList(bambooService);

    //Step 5:
    expect(getBambooDirectorySpy).toHaveBeenCalledTimes(1);

    //Step 6:
    expect(treeList.emailToTreeMap).toMatchObject(mockListBambooEmployees);
  });

  test('should add custom Bamboo list', async () => {
    //Step 1:
    let treeList = new TreeList();
    let bambooService = new BambooService('123');

    //Step 2:
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: mockBambooDirectory });
    jest
      .spyOn(axios, 'post')
      .mockResolvedValueOnce({ data: mockBambooCustomReport });

    //Step 3:
    const getCustomReportSpy = jest.spyOn(
      bambooService,
      'getBambooCustomReport',
    );

    const getBambooDirectorySpy = jest.spyOn(
      bambooService,
      'getBambooDirectory',
    );

    //Step 4:
    await treeList.addBambooEmployeeList(bambooService);
    await treeList.addBambooCustomReport(bambooService);

    //Step 5:
    expect(getBambooDirectorySpy).toHaveBeenCalledTimes(1);
    expect(getCustomReportSpy).toHaveBeenCalledTimes(1);

    //Step 6:
    expect(treeList.emailToTreeMap).toMatchObject(
      mockListWithCustomBambooReport,
    );
  });

  test('add PTO list', async () => {
    //Step 1:
    let treeList = new TreeList();
    let bambooService = new BambooService('123');

    //Step 2:
    jest
      .spyOn(axios, 'get')
      .mockResolvedValueOnce({ data: mockBambooDirectory });
    jest.spyOn(axios, 'get').mockResolvedValueOnce({ data: mockBambooPtoList });

    //Step 3:
    const getBambooWhosOutListSpy = jest.spyOn(
      bambooService,
      'getBambooWhosOutList',
    );
    const getBambooDirectorySpy = jest.spyOn(
      bambooService,
      'getBambooDirectory',
    );

    //Step 4:
    await treeList.addBambooEmployeeList(bambooService);
    await treeList.addBambooPtoList(bambooService);

    //Step 5:
    expect(getBambooWhosOutListSpy).toHaveBeenCalledTimes(1);
    expect(getBambooDirectorySpy).toHaveBeenCalledTimes(1);

    //Step 6:
    expect(treeList.emailToTreeMap).toMatchObject(mockListWithPto);
  });

  // test('should add Datalake employee list', () => {
  //              var mockedEmailToTree = mockListDatalakeEmployees

  // expect(JSON.stringify(mockedEmailToTree)).toEqual(JSON.stringify(mockListDatalakeEmployees));
  // });

  // test('should add skills list', () => {
  //          var mockedEmailToTree = mockListWithSkills

  // expect(JSON.stringify(mockedEmailToTree)).toEqual(JSON.stringify(mockListWithSkills));
  // });

  // test('set supervisor to display name', () => {

  //     var mockedEmailToTree = mockListWithSupervisorDisplayName

  // expect(JSON.stringify(mockedEmailToTree)).toEqual(JSON.stringify(mockListWithSupervisorDisplayName));
  // });

  // test('tree with no slack user has slackId of none', () => {

  //     var treelist = {
  //         email_to_tree:
  //     {
  //         "bot@willowtreeapps.com": {
  //             slackId: undefined,
  //         }

  //     }
  //     }

  // expect(treelist.email_to_tree['bot@willowtreeapps.com'].slackId).toEqual(undefined);

  // });

  // test('tree with slack user has correct slackId', () => {

  //  var treelist = {
  // email_to_tree:
  //     {
  //         "tobias.dengel@willowtreeapps.com": {
  //             slackId: "U4444ABCD",
  //         }

  //     }
  // }

  // expect(treelist.email_to_tree['tobias.dengel@willowtreeapps.com'].slackId).toEqual("U4444ABCD");
  // });

  // test('slack user email with uppercase letters matches tree', () => {

  // var treelist = {
  // email_to_tree:
  //     {
  //         "third.human@willowtreeapps.com": {
  //             slackId: "U2222ABCD",
  //         }

  //     }
  // }

  // expect(treelist.email_to_tree['third.human@willowtreeapps.com'].slackId).toEqual("U2222ABCD");
  // });

  // test('bamboo response uppercase email becomes lowercase', () => {

  // var treelist = {
  //     email_to_tree:
  //         {
  //             "third.human@willowtreeapps.com": false,
  //             "tobias.dengel@willowtreeapps.com": false,
  //             "second.person@willowtreeapps.com": false,
  //             "first.person@willowtreeapps.com": false,

  //         }
  // }

  // expect(treelist.email_to_tree["third.human@willowtreeapps.com"]).toEqual(false);
  // expect(treelist.email_to_tree["tobias.dengel@willowtreeapps.com"]).toEqual(false);
  // expect(treelist.email_to_tree["second.person@willowtreeapps.com"]).toEqual(false);
  // expect(treelist.email_to_tree["first.person@willowtreeapps.com"]).toEqual(false);

  // });

  // test('test no trees with uppercase emails', () => {

  // var treelist = {
  //     email_to_tree:
  //         {
  //             "third.human@willowtreeapps.com": false,
  //             "tobias.dengel@willowtreeapps.com": false,
  //             "second.person@willowtreeapps.com": false,
  //             "first.person@willowtreeapps.com": false,

  //         }
  // }

  // expect(treelist.email_to_tree["TOBIAS.DENGEL@WILLOWTREEAPPS.COM"]).toEqual(undefined);
  // expect(treelist.email_to_tree["THIRD.Human@willowtreeapps.com"]).toEqual(undefined);
  // expect(treelist.email_to_tree["second.PERSON@willowtreeapps.com"]).toEqual(undefined);
  // expect(treelist.email_to_tree["FIRST.PERSON@willowtreeapps.com"]).toEqual(undefined);

  // });
});
