import {DocumentContent, DocumentSection, ConversionOptions} from '../types/types';
import {FileUtils} from '../utils/fileUtils';

/**
 * Handles the conversion of DOCX files to DocumentContent objects
 * using the 'mammoth' library.
 */
export class DocxParseConverter {
    /**
     * Reads a DOCX file, extracts its text and metadata, and formats it.
     * @param filePath The path to the DOCX file.
     * @param options Conversion options (e.g., includeSections).
     * @returns A Promise resolving to a DocumentContent object.
     */
    static async convertToJson(
        filePath: string,
        options: ConversionOptions = {}
    ): Promise<DocumentContent> {
        try {
            console.log(`Reading DOCX file: ${filePath}`);

            if (!(await FileUtils.fileExists(filePath))) {
                throw new Error(`File not found: ${filePath}`);
            }

            const mammoth = require('mammoth');

            const result = await mammoth.extractRawText({path: filePath});
            const text = result.value;

            const fileName = FileUtils.getFileName(filePath);

            console.log(`DOCX read successfully, characters: ${text.length}`);

            const documentContent: DocumentContent = {
                fileName,
                fileType: 'docx',
                text: text,
                metadata: {
                    wordCount: this.countWords(text),
                    characterCount: text.length,
                    extractedAt: new Date().toISOString()
                }
            };

            if (options.includeSections && text.length > 0) {
                documentContent.sections = this.extractSections(text, options);
                console.log(`Sections extracted: ${documentContent.sections.length}`);
            }

            return documentContent;
        } catch (error) {
            console.warn('DOCX parser error, using fallback:', error);
            return await this.fallbackConversion(filePath);
        }
    }

    /**
     * A fallback converter that provides basic file info if parsing fails.
     * @param filePath The path to the DOCX file.
     */
    private static async fallbackConversion(
        filePath: string
    ): Promise<DocumentContent> {
        const fileName = FileUtils.getFileName(filePath);
        const fileBuffer = await FileUtils.readFile(filePath);

        const text = `DOCX File: ${fileName}\nSize: ${fileBuffer.length} bytes\n\nDOCX content extraction failed, using basic file info.`;

        return {
            fileName,
            fileType: 'docx',
            text,
            metadata: {
                wordCount: this.countWords(text),
                characterCount: text.length,
                extractedAt: new Date().toISOString(),
                fileSize: fileBuffer.length
            }
        };
    }

    /**
     * A simple utility to count words.
     */
    private static countWords(text: string): number {
        return text.split(/\s+/).filter(word => word.length > 0).length;
    }

    /**
     * A smarter utility to extract sections based on delimiters and filters.
     */
    private static extractSections(text: string, options: ConversionOptions): DocumentSection[] {
        const sections: DocumentSection[] = [];
        const delimiter = options.sectionDelimiter || /\n\s*\n/;

        const MIN_SECTION_WORD_COUNT = 1;
        const PAGE_MARKER_REGEX = /^-- \d+ of \d+ --$/;

        const textSections = text.split(delimiter);

        textSections.forEach((sectionText, index) => {
            const trimmedText = sectionText.trim();
            const wordCount = this.countWords(trimmedText);

            if (
                trimmedText.length > 0 &&
                wordCount >= MIN_SECTION_WORD_COUNT &&
                !PAGE_MARKER_REGEX.test(trimmedText)
            ) {
                sections.push({
                    title: `Section ${index + 1}`,
                    content: trimmedText,
                    wordCount: wordCount
                });
            }
        });

        return sections;
    }
}