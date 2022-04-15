import fs from "fs";
import { writeFile } from 'fs/promises';

export async function writeErrorLogs(message: string, stack?: string) {
    await fs.promises.mkdir('./../log/errors');
    await writeFile('../log/errors', message);
}