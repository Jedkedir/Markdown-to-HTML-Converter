import { marked } from "marked";
import * as fs from "fs";
import * as path from "path";


function getFilePathFromArgs() {
  const inputPath = process.argv[2];// get file path from the arguments

  if (inputPath) {
    console.log(`Input file specified: ${inputPath}`);
    return inputPath;// return file path if found 
  } else {
    const defaultPath = "sample.md";
    console.log(`No input file provided. Defaulting to: ${defaultPath}`);
    console.log(
      "To use a different file, run: node markdown_converter.js <your-file.md>"
    );
    return defaultPath;// return a default file path if file is not found
  }
}

function readMarkdownFile(filePath) {
  const markdownContent = fs.readFileSync(filePath, "utf8"); //read content from the file
  return markdownContent;// return the content read from the given file
}

function extractTitle(markdownContent) {
  const titleMatch = markdownContent.match(/^#\s*(.*)/m);// use regEx to get the the title  

  if (titleMatch && titleMatch[1]) {
    return titleMatch[1].trim();// return the title
  } else {
    return "Converted Document";// return a default title
  }
}

function createHtmlTemplate(title, bodyHtml) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <!-- Load Inter font from Google Fonts -->
    <link rel="preconnect" href="https:
    <link rel="preconnect" href="https:
    <link href="https:
    <style>
       
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

       
        pre {
            background-color: #f4f6f8;
            border: 1px solid #e5e7eb;
            border-radius: 6px; 
            overflow-x: auto; 
            padding: 16px; 
            margin: 20px 0;
        }
        code {
            font-family: 'Consolas', 'Courier New', monospace;
            font-size: 0.95rem;
            color: #374151;
        }
       
        p > code, li > code {
            background-color: #f0f0f5; 
            padding: 3px 6px;
            border-radius: 3px;
        }

       
        a { 
            color: #2563eb; 
            text-decoration: none; 
            transition: color 0.2s;
        }
        a:hover { 
            color: #1d4ed8; 
            text-decoration: underline; 
        }

       
        ul, ol { 
            margin: 15px 0 15px 25px; 
            padding-left: 0;
        }
        li {
            margin-bottom: 8px;
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

function convertAndWrap(markdownContent) {
  const pageTitle = extractTitle(markdownContent); // get the title

  const htmlBodyFragments = marked.parse(markdownContent);// get the content

  const fullHtml = createHtmlTemplate(pageTitle, htmlBodyFragments);// get the full html from the template

  return fullHtml;// return the html
}

function writeHtmlFile(outputPath, content) {
  fs.writeFileSync(outputPath, content, "utf8");// create a html file
}

async function main() {
  const OUTPUT_FILENAME = "output.html";

  try {
    const inputPath = getFilePathFromArgs();// get the markdown file path

    const outputPath = path.join(process.cwd(), OUTPUT_FILENAME);// configure the output path using the current working directory and with the name of output.html

    const markdownContent = readMarkdownFile(inputPath);// get the content of the markdown file

    const fullHtmlContent = convertAndWrap(markdownContent);// get the full html code using the template

    writeHtmlFile(outputPath, fullHtmlContent);// create the html file using the configured output path

    console.log("\n======================================================");
    console.log(`Conversion successful!`);
    console.log(`Input: ${path.basename(inputPath)}`);
    console.log(`Output saved to: ${outputPath}`);
    console.log(
      "Open this file in your browser to view the styled documentation."
    );
    console.log("======================================================\n");
  } catch (error) {
    console.error("\n❌ An error occurred during the conversion process:");
    if (error.code === "ENOENT") {
      console.error(`Error: File not found at the specified path.`);
      console.error(`Please ensure the input file exists: "${error.path}"`);
      console.error(
        "If running without arguments, ensure 'sample.md' is present."
      );
    } else {
      console.error(`Detailed Error: ${error.message}`);
    }
    process.exit(1);
  }
}

main();
