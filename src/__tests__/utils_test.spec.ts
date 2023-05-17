import { sanitizeProjectResults, getCurrentDate } from '../utils';

describe('sanitizeProjectResults', () => {
  it('should return the expected string for test1', () => {
    const result = sanitizeProjectResults(
      '#1977 BSMH - SOW 16 - Ongoing 1994 Retainer (April to June 1994) - BSMH Retainer May 1994 (Project - #1977 BSMH - SOW 16 - Ongoing 1994 Retainer (April to June 1994))'
    );
    expect(result).toEqual('BSMH - Ongoing 1994 Retainer - BSMH Retainer May 1994');
  });

  it('should return the expected string for test2', () => {
    const result = sanitizeProjectResults('#50 Comapny - Internally Allocated');
    expect(result).toEqual('Comapny - Internally Allocated');
  });

  it('should return the expected string for test3', () => {
    const result = sanitizeProjectResults(
      '#1902 Comapny - Internal - New Hires 1994 - Feb New Hires (Project - #1902 Comapny - Internal - New Hires 1994)'
    );
    expect(result).toEqual('Comapny - Internal - New Hires 1994 - Feb New Hires');
  });

  it('should return the expected string for test4', () => {
    const result = sanitizeProjectResults('#1837 Bank - Neon / Fraud Alert Mobile Squad');
    expect(result).toEqual('Bank - Neon / Fraud Alert Mobile Squad');
  });

  it('should return the expected string for test5', () => {
    const result = sanitizeProjectResults('#2033 Bank - Slingshot (formerly Snowflake) TiB 1 (Apr 22 - Jul 22)');
    expect(result).toEqual('Bank - Slingshot TiB 1');
  });

  it('should return the expected string for test6', () => {
    const result = sanitizeProjectResults(
      '#1916 Bear - SOW 59 - CPE FY1994 Q4 (1994 Q2) - Bear CPE - MPF Squad Q2 (Project - #1916 Bear - SOW 59 - CPE FY1994 Q4 (1994 Q2))'
    );
    expect(result).toEqual('Bear - CPE FY1994 Q4 - Bear CPE - MPF Squad Q2');
  });

  it('should return the expected string for test7', () => {
    const result = sanitizeProjectResults(
      '#1898 Location - 1994 Potato Support - Location 1994 May Support (0%) (Project - #1898 Location - 1994 Potato Support)'
    );
    expect(result).toEqual('Location - 1994 Potato Support - Location 1994 May Support');
  });
});

describe('getCurrentDate', () => {
  it('should return a string in the format "yyyy-mm-dd"', () => {
    const result = getCurrentDate();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
