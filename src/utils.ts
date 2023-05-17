import * as process from 'process';

export function getEnv(): string {
  const environment: string | undefined = process.env.ENV_STAGE;
  if (!environment) {
    throw new Error('ENV_STAGE environment variable is not set.');
  }
  return environment;
}

export function sanitizeProjectResults(txt: string): string {
  const sanitizedTxt: string = txt.replace(/#\w+ | SOW (.*?)-| \((.*?)\)|\)/g, '');
  return sanitizedTxt.trim();
}

export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}