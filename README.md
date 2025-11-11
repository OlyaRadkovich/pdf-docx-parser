# Document Content Extractor (CV Reader)

A simple CLI application built with TypeScript and Node.js to extract text and basic metadata from `.pdf` and `.docx` files. The application processes a source file and saves the result as a structured `.json` file in the `/output` folder.

This project is ideal for tasks that require feeding raw text from documents (like resumes) into AI agents (LLMs) for further analysis.

## 🚀 Features

* 📄 **Parses .pdf files** to extract text.
* 📄 **Parses .docx files** to extract text.
* 📝 **Extracts full raw text** (ideal for AI).
* 🔍 **Section Splitting**: The text is also split into logical sections (blocks separated by empty lines), with filtering for "junk" (like page footers: `-- 1 of 2 --`).
* 💾 **Saves to JSON**: The result is automatically saved to the `/output` folder as a `.json` file with the same name as the original.

---

## 🛠️ Tech Stack (Core Libraries)

This project uses the following key libraries:

* **For PDF Parsing:**
    * `pdf-parse`: (Version 2+) Used to extract text from `.pdf` files. We are using the modern, class-based API (`new PDFParse(...)`).
* **For DOCX Parsing:**
    * `mammoth`: Used to extract raw text from `.docx` files.
* **Development Environment:**
    * `TypeScript`: For strong typing and modern syntax.
    * `ts-node`: To run TypeScript files directly without a manual compilation step.
    * `@types/*`: Type definition files for Node.js, `pdf-parse`, and `mammoth`.

---

## 🏁 Getting Started

### 1. Prerequisites

* **Node.js** (v16 or newer recommended)
* **npm** (usually included with Node.js)

### 2. Installation

1.  Clone this repository (or just download the ZIP).
2.  Navigate into the project directory:
    ```bash
    cd cv-reader
    ```
3.  Install all required dependencies:
    ```bash
    npm install
    ```

### 3. Usage

1.  Place your `.pdf` or `.docx` files into the `/documents` folder.
2.  Run the script from the **project root** using `ts-node`, pointing it to your file:

    **For PDF:**
    ```bash
    npx ts-node src/index.ts documents/test.pdf
    ```

    **For DOCX:**
    ```bash
    npx ts-node src/index.ts documents/my-resume.docx
    ```
3.  Check the `/output` folder. Your result (e.g., `test.pdf.json`) will appear there.

---

## 📁 Project Structure

/cv-reader
|
|-- /documents/       # (Folder for your source .pdf and .docx files)
|-- /output/          # (This is where the .json results are saved)
|-- /src/
|   |-- /converters/  # (Parsing logic for each file type)
|   |   |-- PdfParseConverter.ts
|   |   |-- DocxParseConverter.ts
|   |
|   |-- /types/       # (Shared TypeScript interfaces)
|   |   |-- types.ts
|   |
|   |-- /utils/       # (Helper utilities, e.g., fileUtils.ts)
|   |   |-- fileUtils.ts
|   |
|   |-- DocumentProcessor.ts # (The main processor that chooses a converter)
|   |-- index.ts           # (The CLI entry point, takes arguments)
|
|-- package.json
|-- tsconfig.json
|-- README.md