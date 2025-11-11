export interface DocumentContent {
    fileName: string;
    fileType: 'pdf' | 'docx';
    text: string;
    metadata: {
        wordCount: number;
        characterCount: number;
        extractedAt: string;
        fileSize?: number;
        pageCount?: number;
    };
    sections?: DocumentSection[];
}

export interface DocumentSection {
    title?: string;
    content: string;
    page?: number;
    wordCount: number;
}

export interface ConversionOptions {
    includeSections?: boolean;
    maxPages?: number;
    sectionDelimiter?: RegExp;
}