import * as fs from 'fs';
import * as path from 'path';

export class FileUtils {
    static async readFile(filePath: string): Promise<Buffer> {
        return fs.promises.readFile(filePath);
    }

    static getFileExtension(filePath: string): string {
        return path.extname(filePath).toLowerCase();
    }

    static getFileName(filePath: string): string {
        return path.basename(filePath);
    }

    static async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.promises.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
}