import { BambooService } from '../services/bamboo.service';
import { Tree } from './Tree';

export class TreeList {
  public trees: Tree[] | undefined;
  public emailToTreeMap: object | undefined;

  constructor(trees: Tree[] | undefined, emailToTreeMap: object | undefined) {
    this.trees = trees;
    this.emailToTreeMap = emailToTreeMap;
  }

  public async addBambooEmployeeList(bambooService: BambooService) {
    const bambooDirectory = await bambooService.getBambooDirectory();
    // console.log({ MOCKEDDIR: bambooDirectory });
    // console.log(
    //   bambooService.generateEmailToTreeMap(bambooDirectory as object[]),
    // );
    this.emailToTreeMap = Object.fromEntries(
      bambooService.generateEmailToTreeMap(bambooDirectory as object[]),
    );
    // console.log({ EMAILTOTREEMAP: this.emailToTreeMap });
  }

  public async addBambooCustomReport(bambooService: BambooService) {
    const bambooCustomReport = await bambooService.getBambooCustomReport();
    this.emailToTreeMap = new Map<string, Object>();
    bambooService.addBambooCustomReport(
      bambooCustomReport as object[],
      this.emailToTreeMap as object,
    );
  }
}
