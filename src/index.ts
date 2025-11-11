import * as path from 'path';
import { DocumentProcessor } from './DocumentProcessor';

async function main() {
    console.log('🚀 CV Reader starting...');

    try {
        const filePathArg = process.argv[2];

        if (!filePathArg) {
            console.error('❌ Error: No file path provided.');
            console.log('Usage: npx ts-node src/index.ts documents/my-cv.pdf');
            process.exit(1);
        }

        const filePath = path.resolve(process.cwd(), filePathArg);

        const documentContent = await DocumentProcessor.processDocument(filePath, {
            includeSections: true
        });

        console.log('✅ Document processed successfully!');
        console.log(JSON.stringify(documentContent, null, 2));

        const outputFileName = path.basename(filePath) + '.json';
        const outputPath = path.resolve(process.cwd(), 'output', outputFileName);
        await DocumentProcessor.saveJsonToFile(documentContent, outputPath);

    } catch (error) {
        console.error('❌ An error occurred:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

main();