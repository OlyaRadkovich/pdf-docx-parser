import { PDFParse } from 'pdf-parse';
import { DocumentContent, DocumentSection, ConversionOptions } from '../types/types';
import { FileUtils } from '../utils/fileUtils';

/**
 * Handles the conversion of PDF files to DocumentContent objects
 * using the 'pdf-parse' library (v2+ API).
 */
export class PdfParseConverter {
    /**
     * Reads a PDF file, extracts its text and metadata, and formats it.
     * @param filePath The path to the PDF file.
     * @param options Conversion options (e.g., includeSections).
     * @returns A Promise resolving to a DocumentContent object.
     */
    static async convertToJson(
        filePath: string,
        options: ConversionOptions = {}
    ): Promise<DocumentContent> {
        try {
            console.log(`Reading PDF file: ${filePath}`);

            if (!(await FileUtils.fileExists(filePath))) {
                throw new Error(`File not found: ${filePath}`);
            }

            // Read the file's binary content
            const dataBuffer = await FileUtils.readFile(filePath);
            console.log(`PDF file size: ${dataBuffer.length} bytes`);

            // Create an instance of the parser and pass it the buffer
            const parser = new PDFParse({ data: dataBuffer });

            // Call the .getText() method to get the data
            const pdfData = await parser.getText();

            const fileName = FileUtils.getFileName(filePath);
            const text = pdfData.text;

            console.log(`PDF read successfully, characters: ${text.length}`);

            // Assemble the final JSON object
            const documentContent: DocumentContent = {
                fileName,
                fileType: 'pdf',
                text: text,
                metadata: {
                    wordCount: this.countWords(text),
                    characterCount: text.length,
                    extractedAt: new Date().toISOString()
                }
            };

            // Optionally, try to split the text into sections
            if (options.includeSections && text.length > 0) {
                documentContent.sections = this.extractSections(text, options);
                console.log(`Sections extracted: ${documentContent.sections.length}`);
            }

            return documentContent;

        } catch (error) {
            console.warn('PDF parser error:', error);
            throw new Error(`PDF conversion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
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
    private static extractSections(
        text: string,
        options: ConversionOptions
    ): DocumentSection[] {

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