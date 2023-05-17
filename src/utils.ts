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
  const sanitizedTxt: string = txt.replace(/#\w+ | SOW (.*?)-| \((.*?)\)|\)/g, '');



  // Removes parts of the string like: "SOW 16 -" and " (Project - #1977 BSMH - SOW 16 - Ongoing 2022 Retainer (April to June 2022))
  // Leaves hashtags with numbers and the last right parenthesis
  // Demo mis-sanitizedTxt
  // const sanitizedTxt: string = txt.replace(/SOW (.*?)-| \((.*?)\)|/g, '');


  return sanitizedTxt.trim();
}

//Creates a new Date object for the current date and time according to local time zone. 
//Outputs the date in YYYY-MM-DD format using that date object.
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  // Pad Start For Both Month And Day
  // A conversion to string is made to use the padStart() method.
  // padStart() pads the current string with '0' until the resulting string reaches the given length.
  
  // getUTCMonth() returns a 0 based value for the month of the Date object we previously created
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}