import { marked } from "marked";
import * as fs from "fs";
import * as path from "path";
import hljs from 'highlight.js';


marked.setOptions({
    // Enable GFM (GitHub Flavored Markdown) and breaks
    gfm: true,
    breaks: true,
    
    // Custom highlight function for code blocks
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        // Use highlight.js to process the code
        return hljs.highlight(code, { language }).value;
    }
});

/**
 * Parse command-line arguments to determine input and output file paths.
 * 
 * The function supports the following command-line arguments:
 * -o, --output <filename>: Set a custom output file path.
 * 
 * If no arguments are provided, the function will default to 'sample.md' as the input file and 'output.html' as the output file.
 * 
 * @returns {Object} An object containing the input and output file paths.
 * @property {string} inputPath - The path to the Markdown input file.
 * @property {string} outputPath - The path to the generated HTML output file.
 */
function parseArguments() {
    // Slice off 'node' and 'markdown_converter.js'
    const args = process.argv.slice(2); 
    let inputPath = 'sample.md'; // Default input
    let outputPath = 'output.html'; // Default output
    let positionalArgCount = 0;
    let outputSetByFlag = false;

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === '-o' || arg === '--output') {
            if (i + 1 < args.length) {
                outputPath = args[i + 1];
                outputSetByFlag = true;
                i++; // Skip the next argument since we just processed it
            } else {
                // If flag is last argument, throw an error
                throw new Error('Error: The output flag (-o or --output) requires a file path.');
            }
        } else if (arg.startsWith('-')) {
            console.warn(`Warning: Unrecognized flag ignored: ${arg}`);
        } else {
            positionalArgCount++;

            if (positionalArgCount === 1) {
                // First positional argument is always the input path
                inputPath = arg;
            } else if (positionalArgCount === 2 && !outputSetByFlag) {
                // Second positional argument sets the output path, only if -o was not used
                outputPath = arg;
            } else {
                // Ignore subsequent positional arguments
                console.warn(`Warning: Ignoring extra argument: ${arg}`);
            }
        }
    }
    
    return { inputPath, outputPath };
}

/**
 * Reads the content of a Markdown file and returns it as a string.
 * @param {string} filePath The path to the Markdown file to read.
 * @returns {string} The content of the Markdown file.
 */
function readMarkdownFile(filePath) {
  const markdownContent = fs.readFileSync(filePath, "utf8"); //read content from the file
  return markdownContent;// return the content read from the given file
}

/**
 * Extracts the title from a given Markdown content.
 * The title is expected to be the first line of the document, prefixed with a single #.
 * If no title is found, a default title of "Converted Document" is returned.
 * @param {string} markdownContent The Markdown content to extract the title from.
 * @returns {string} The extracted title, or a default title if none is found.
 */
function extractTitle(markdownContent) {
  const titleMatch = markdownContent.match(/^#\s*(.*)/m);// use regEx to get the the title  

  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();// return the title
  } else {
    return "Converted Document";// return a default title
  }
}

/**
 * Generates a full HTML document with the given title and body content.
 * The HTML template includes all necessary CSS for clean, styled output.
 * @param {string} title The title to be displayed in the generated HTML document.
 * @param {string} bodyHtml The HTML content to be embedded in the generated document.
 * @returns {string} The generated HTML document as a string.
 */
function createHtmlTemplate(title, bodyHtml) {
    // This template embeds all necessary CSS for clean, styled output
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!-- Load Inter font from Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    
    <!-- HIGHLIGHT.JS STYLESHEET  -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">

    <style>
        /* Basic Styling for Readability */
        body { 
            font-family: 'Inter', sans-serif; 
            max-width: 850px; 
            margin: 40px auto; 
            padding: 30px; 
            line-height: 1.7; 
            color: #333;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
        }
        /* Responsive adjustments for smaller screens */
        @media (max-width: 600px) {
            body {
                margin: 20px;
                padding: 15px;
            }
        }
        
        h1, h2, h3 { 
            color: #1f2937; 
            border-bottom: 2px solid #e5e7eb; 
            padding-bottom: 10px; 
            margin-top: 35px; 
            font-weight: 700;
        }
        h1 { font-size: 2.5rem; }
        h2 { font-size: 2rem; }
        h3 { font-size: 1.5rem; }

        /* General Code Block Styling */
        pre {
            /* Remove the custom background here, as highlight.js theme provides it */
            border: 1px solid #e5e7eb;
            border-radius: 6px; 
            overflow-x: auto; 
            padding: 0; /* highlight.js styles the inner code tag */
            margin: 20px 0;
        }
        /* Style for the code tag inside pre added by marked */
        pre code {
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.95rem;
            line-height: 1.4;
            display: block;
            padding: 1em; /* Add padding back inside the highlighted block */
        }
        /* Inline code styling */
        p > code, li > code {
            background-color: #f0f0f5; 
            padding: 3px 6px;
            border-radius: 3px;
        }

        /* Link Styling */
        a { 
            color: #2563eb; 
            text-decoration: none; 
            transition: color 0.2s;
        }
        a:hover { 
            color: #1d4ed8; 
            text-decoration: underline; 
        }

        /* Lists */
        ul, ol { 
            margin: 15px 0 15px 25px; 
            padding-left: 0;
        }
        li {
            margin-bottom: 8px;
        }

        /* Table Styling */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            color: #1f2937;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
    </style>
</head>
<body>
    <div id="content">
        ${bodyHtml}
    </div>
</body>
</html>`;
}


/**
 * Converts a Markdown string to HTML and wraps it in a clean, styled HTML template.
 * @param {string} markdownContent The Markdown string to be converted.
 * @returns {string} The generated HTML document as a string.
 */
function convertAndWrap(markdownContent) {
  const pageTitle = extractTitle(markdownContent); // get the title

  const htmlBodyFragments = marked.parse(markdownContent);// get the content
    
  const fullHtml = createHtmlTemplate(pageTitle, htmlBodyFragments);// get the full html from the template

  return fullHtml;// return the html
}

/**
 * Writes the provided HTML content to a file at the specified output path.
 * @param {string} outputPath The path where the HTML file will be written.
 * @param {string} content The HTML content to be written to the file.
 */
function writeHtmlFile(outputPath, content) {
  fs.writeFileSync(outputPath, content, "utf8");// create a html file
}

/**
 * Validates the file extensions of the input and output file paths.
 * 
 * @throws {Error} If the input file does not have a .md or .markdown extension.
 * @throws {Error} If the output file does not have a .html or .htm extension.
 * @param {string} inputPath The path to the input file.
 * @param {string} outputPath The path to the output file.
 */
function validateFileExtensions(inputPath, outputPath) {
    // 1. Check Input File Extension (.md or .markdown)
    const inputExt = path.extname(inputPath).toLowerCase();
    if (inputExt !== '.md' && inputExt !== '.markdown') {
        throw new Error(`Invalid Input File Extension: Input file must be a Markdown file (.md or .markdown). Found: ${inputExt}`);
    }

    // 2. Check Output File Extension (.html or .htm)
    const outputExt = path.extname(outputPath).toLowerCase();
    if (outputExt !== '.html' && outputExt !== '.htm') {
        throw new Error(`Invalid Output File Extension: Output file must be an HTML file (.html or .htm). Found: ${outputExt}`);
    }
}

/**
 * The main entry point for the Markdown to HTML converter.
 * This function reads the Markdown file content, converts it to full, styled HTML, and writes the final HTML to the output file.
 * It also logs success messages and handles errors gracefully.
 * @throws {Error} If an error occurs during the conversion process.
 */
async function main() {
    try {
        // 1. Determine input and output paths by parsing command-line arguments (NEW LOGIC)
        const { inputPath, outputPath } = parseArguments();

        validateFileExtensions(inputPath, outputPath);
        // Construct the full output path (Handles custom path/name)
        const finalOutputPath = path.join(process.cwd(), outputPath);
        
        
        // 2. Read the Markdown file content
        const markdownContent = readMarkdownFile(inputPath);

        // 3. Convert Markdown to full, styled HTML
        const fullHtmlContent = convertAndWrap(markdownContent);

        // 4. Write the final HTML to the output file
        writeHtmlFile(finalOutputPath, fullHtmlContent);

        // 5. Log success message
        console.log(chalk.yellow('\n======================================================'));
console.log(chalk.green('✅ Conversion successful!'));
console.log(chalk.cyan(`Input: ${path.basename(inputPath)}`));
console.log(chalk.cyan(`Output saved to: ${finalOutputPath}`));
console.log(chalk.dim('Use -o <filename> to customize the output name.'));
console.log(chalk.yellow('======================================================\n'));

    } catch (error) {
        // 6. Handle errors
        console.error('\n❌ An error occurred during the conversion process:');
        if (error.message.startsWith('Error: The output flag')) {
             // Handle explicit argument parsing errors
            console.error(error.message);
        } else if (error.code === 'ENOENT') {
            console.error(chalk.red(`Error: File not found at the specified path.`));
            console.error(chalk.red(`Please ensure the input file exists: "${error.path}"`));
        } else {
            console.error(chalk.red(`Detailed Error: ${error.message}`));
        }
        process.exit(1); // Exit with error code to signal failure
    }
}

main();
