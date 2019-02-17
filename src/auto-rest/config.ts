import { readFileSync } from 'fs';
import { resolve } from 'path';

const dir: string = resolve(__dirname, '../config.json');
const data: any = JSON.parse(readFileSync(dir, 'utf8'));

export default data;
