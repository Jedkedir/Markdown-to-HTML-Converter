# 📝 Markdown to HTML Converter

The Markdown to HTML Converter is a command-line tool designed to take Markdown files and transform them into clean, styled HTML output, making them ready for web viewing and sharing.

## ✨ Features

- **Markdown Parsing**: Converts standard Markdown syntax into corresponding HTML elements.
- **Clean Output**: Generates structured HTML with embedded CSS for immediate, aesthetic presentation.
- **Simple Interface**: Command-line driven for easy integration into build scripts or manual use.
- **Syntax Highlighting**: Features code block syntax highlighting using highlight.js for improved readability.

## 🏗️ How It Works

The converter follows a simple, three-step process to generate the final HTML document:

1. **Read Input**: The script first reads the raw Markdown content from the file path provided as a command-line argument.
2. **Parse Markdown**: The raw text is passed to the marked parsing library, which converts all Markdown syntax (such as `#` for headings or `*` for lists) into a raw HTML string.
3. **Generate Output**: The resulting raw HTML is then wrapped inside a full, styled HTML template (including the `<head>`, CSS, and `<body>` structure) before being saved as the final output file.

## ⚙️ Prerequisites

To run this tool, you need Node.js installed on your system.

### Dependencies

This project relies on the following key modules:

- `marked`: Used for the core Markdown parsing functionality.
- `highlight.js`: Provides syntax highlighting for code blocks.

### Installation

1. Clone this repository (if applicable) or ensure you have the project files.
2. Install the required dependencies using npm:

```bash
npm install marked highlight.js
```

## 🚀 Usage

To convert a Markdown file, run the main script (`markdown_converter.js`) followed by the path to your Markdown file and any optional flags.

### Command-Line Arguments

The converter supports the following argument structure for controlling input and output:

| Argument / Flag | Type | Description |
|----------------|------|-------------|
| `<input_file>` | Required | The path to the Markdown file (`.md`) to be converted. This must be the first argument. |
| `-o, --output <file>` | Optional | Specifies the desired filepath for the generated HTML. |

### Examples

Assuming you have a Markdown file named `report.md` in the same directory, here are two ways to run the converter:

**Default Output** (prints to a generated file, e.g., `report.html`):

```bash
node markdown_converter.js report.md
```

**Custom Output File**:

```bash
node markdown_converter.js report.md -o output/final_report.html
```

**Using npm scripts** (if configured in package.json):

```bash
npm start -- report.md -o output/final_report.html
```

## 🎨 Output Features

The generated HTML includes:

- **Modern Styling**: Clean, responsive design with Inter font
- **Code Syntax Highlighting**: Professionally highlighted code blocks with GitHub theme
- **Mobile Responsive**: Adapts to different screen sizes
- **Table Styling**: Properly formatted tables with alternating row colors
- **Link Styling**: Hover effects and proper link formatting

## 🔮 Next Steps

The next major planned features for this tool are:

- **Custom Themes**: Support for different color schemes and styling options
- **Batch Processing**: Convert multiple Markdown files at once
- **PDF Export**: Additional output format options
- **Live Preview**: Real-time preview during conversion