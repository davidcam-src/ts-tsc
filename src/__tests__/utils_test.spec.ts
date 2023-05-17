import { sanitizeProjectResults, getCurrentDate } from '../utils';

describe('sanitizeProjectResults', () => {
  it('should return the expected string for test1', () => {
    const result = sanitizeProjectResults(
      '#1977 BSMH - SOW 16 - Ongoing 2022 Retainer (April to June 2022) - BSMH Retainer May 2022 (Project - #1977 BSMH - SOW 16 - Ongoing 2022 Retainer (April to June 2022))'
    );
    expect(result).toEqual('BSMH - Ongoing 2022 Retainer - BSMH Retainer May 2022');
  });

  it('should return the expected string for test2', () => {
    const result = sanitizeProjectResults('#50 WillowTree - Internally Allocated');
    expect(result).toEqual('WillowTree - Internally Allocated');
  });

  it('should return the expected string for test3', () => {
    const result = sanitizeProjectResults(
      '#1902 WillowTree - Internal - New Hires 2022 - Feb New Hires (Project - #1902 WillowTree - Internal - New Hires 2022)'
    );
    expect(result).toEqual('WillowTree - Internal - New Hires 2022 - Feb New Hires');
  });

  it('should return the expected string for test4', () => {
    const result = sanitizeProjectResults('#1837 Capital One - Neon / Fraud Alert Mobile Squad');
    expect(result).toEqual('Capital One - Neon / Fraud Alert Mobile Squad');
  });

  it('should return the expected string for test5', () => {
    const result = sanitizeProjectResults('#2033 Capital One - Slingshot (formerly Snowflake) TiB 1 (Apr 22 - Jul 22)');
    expect(result).toEqual('Capital One - Slingshot TiB 1');
  });

  it('should return the expected string for test6', () => {
    const result = sanitizeProjectResults(
      '#1916 Fox - SOW 59 - CPE FY2022 Q4 (2022 Q2) - Fox CPE - MPF Squad Q2 (Project - #1916 Fox - SOW 59 - CPE FY2022 Q4 (2022 Q2))'
    );
    expect(result).toEqual('Fox - CPE FY2022 Q4 - Fox CPE - MPF Squad Q2');
  });

  it('should return the expected string for test7', () => {
    const result = sanitizeProjectResults(
      '#1898 Wyndham - 2022 Live Oak Support - Wyndham 2022 May Support (0%) (Project - #1898 Wyndham - 2022 Live Oak Support)'
    );
    expect(result).toEqual('Wyndham - 2022 Live Oak Support - Wyndham 2022 May Support');
  });
});

describe('getCurrentDate', () => {
  it('should return a string in the format "yyyy-mm-dd"', () => {
    const result = getCurrentDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
