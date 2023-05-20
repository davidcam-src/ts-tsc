import { BambooService } from '../services/bamboo.service';
import { Tree } from './Tree';

export class TreeList {
  public trees: Tree[] | undefined;
  public emailToTreeMap: any = new Map<string, Object>();

  public async addBambooEmployeeList(bambooService: BambooService) {
    const bambooDirectory = await bambooService.getBambooDirectory();
    this.emailToTreeMap = Object.fromEntries(
      bambooService.generateEmailToTreeMap(bambooDirectory as object[]),
    );
  }

  public async addBambooCustomReport(bambooService: BambooService) {
    const bambooCustomReport = await bambooService.getBambooCustomReport();
    bambooService.addBambooCustomReport(
      bambooCustomReport as object[],
      this.emailToTreeMap,
    );
  }

  // public async addBambooPtoList(bambooService: BambooService) {
  //   const bambooWhosOutList = await bambooService.getBambooWhosOutList();
  //   this.emailToTreeMap = new Map<string, Object>();
  //   bambooService.addBambooCustomReport(
  //     bambooCustomReport as object[],
  //     this.emailToTreeMap as object,
  //   );
  // }
}
