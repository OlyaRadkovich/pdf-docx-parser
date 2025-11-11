import {DocumentContent, ConversionOptions} from './types/types';
import {FileUtils} from './utils/fileUtils';
import * as fs from 'fs';
import * as path from 'path';

import {DocxParseConverter} from './converters/DocxParseConverter';
import {PdfParseConverter} from './converters/PdfParseConverter';

export class DocumentProcessor {
    static async processDocument(
        filePath: string,
        options: ConversionOptions = {}
    ): Promise<DocumentContent> {
        const extension = FileUtils.getFileExtension(filePath);

        console.log(`Processing file: ${path.basename(filePath)}`);
        console.log(`File type: ${extension}`);

        switch (extension) {
            case '.pdf':
                return await PdfParseConverter.convertToJson(filePath, options);

            case '.docx':
                return await DocxParseConverter.convertToJson(filePath, options);

            default:
                throw new Error(`Unsupported file format: ${extension}. Only .pdf and .docx are supported`);
        }
    }

    static async saveJsonToFile(data: DocumentContent, outputPath: string): Promise<void> {
        const outputDir = path.dirname(outputPath);

        if (!await FileUtils.fileExists(outputDir)) {
            await fs.promises.mkdir(outputDir, {recursive: true});
        }

        const jsonString = JSON.stringify(data, null, 2);
        await fs.promises.writeFile(outputPath, jsonString, 'utf-8');
        console.log(`JSON saved to: ${outputPath}`);
    }
}