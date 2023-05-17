// import * as process from 'process';

// export function getEnv(): string {
//   const environment: string | undefined = process.env.ENV_STAGE;
//   if (!environment) {
//     throw new Error('ENV_STAGE environment variable is not set.');
//   }
//   return environment;
// }

export function sanitizeProjectResults(txt: string): string {
  // Replaces the following patterns:
  // #\w+: Matches a hashtag followed by one or more word characters (letters, digits, and underscores, ends at the first space) ex: #1234
  // SOW (.*?)-: Matches the string "SOW " followed by any character, zero or more times, followed by a hyphen ex: SOW 16 -
  // \((.*?)\): Matches a left parenthesis followed by any character, zero or more times, followed by a right parenthesis ex: (.....)
  // \): Matches a right parenthesis ex: ), used to remove the last right parenthesis


  //Summary: Searches a given string for patterns and replaces them with an empty string
  // Removes:
  // SOW information
  // hashtags with numbers
  // strings between left and right parenthesis, including the parenthese themselves
  // any right parenthesis

  // const sanitizedTxt: string = txt.replace(/#\w+ | SOW (.*?)-| \((.*?)\)|\)/g, '');


  // DEMO: Mis-sanitized text

  // Only Removes:
  // SOW information
  // strings between left and right parenthesis
  const sanitizedTxt: string = txt.replace(/SOW (.*?)-| \((.*?)\)|/g, '');


  return sanitizedTxt.trim();
}

//Summary: 
// Returns the current date in the format YYYY-MM-DD
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  // Pad Start For Both Month And Day
  // A conversion to string is made to use the padStart() method.
  // padStart() pads the current string with '0' until the resulting string reaches the given length.
  
  // getUTCMonth() returns a 0 based value for the month of the Date object we previously created
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  

  // return `${year}-${month}-${day}`;
  // DEMO: Will cause the format to be MM-DD-YYYY so it won't match our regex pattern in the test.
  return `${month}-${day}-${year}`;
}