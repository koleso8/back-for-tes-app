import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_MOUNCE = 30 * 24 * 60 * 60 * 1000;

export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
