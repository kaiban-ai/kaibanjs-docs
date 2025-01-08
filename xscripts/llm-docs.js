const fs = require('fs');
const path = require('path');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);

// Ensure static directory exists
if (!fs.existsSync('./static')) {
    fs.mkdirSync('./static', { recursive: true });
}

const INSTRUCTIONS_PROMPT = `This is the /llms-full.txt file for KaibanJS documentation, providing a comprehensive snapshot of all documentation content in a format optimized for Large Language Models (LLMs) while maintaining human readability.

**Directory Structure**

The 'Directory Structure' section presents a hierarchical view of the documentation files, organized into main categories:
- Get Started guides
- Tools documentation
  - Custom tools
  - Langchain tools
- API documentation

**Documentation Contents**

The 'Documentation Contents' section contains the full content of each documentation file, organized with:

- Clear section headers (###) with relative file paths
- File separators for improved readability
- Full markdown content including:
  - Installation guides
  - Tool configuration instructions
  - API usage examples
  - Tutorials for React and Node.js
  - Custom tool implementation guides
  - Integration instructions

Each file is clearly demarcated with:
\`\`\`
//--------------------------------------------
// File: ./src/path/to/file.md
//--------------------------------------------
\`\`\`

This format enables:
- Efficient LLM processing and context understanding
- Improved AI-powered documentation search
- Better integration with AI coding assistants
- Enhanced automated documentation analysis`;


const baseDirectory = './docs';  // Adjust the base directory as needed
const outputFilePath = './static/llms-full.txt';  // Place in static directory for Docusaurus

// Function to recursively get all file paths
async function getFiles(dir) {
    const subdirs = await readdir(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (await stat(res)).isDirectory() ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

// Function to generate directory tree structure
async function generateDirStructure(dir, prefix = '') {
    const dirContents = await readdir(dir, { withFileTypes: true });
    let structure = '';
    for (const dirent of dirContents) {
        const filePath = path.resolve(dir, dirent.name);
        if (dirent.isDirectory()) {
            structure += `${prefix}└── ${dirent.name}\n`;
            structure += await generateDirStructure(filePath, `${prefix}    `);
        } else if (!dirent.name.startsWith('_DONTUSE')) {
            structure += `${prefix}└── ${dirent.name}\n`;
        }
    }
    return structure;
}

// Function to create the markdown document
async function createMarkdownFile(files, dirStructure) {
    let markdownContent = `# KaibanJS Documentation - /llms-full.txt\n\n`;
    markdownContent += `${INSTRUCTIONS_PROMPT} \n\n`;
    markdownContent += `## Directory Structure\n\n\`\`\`\n${dirStructure}\`\`\`\n\n`;
    markdownContent += `## File Contents\n\n`;
    for (const file of files) {
        const fileName = path.basename(file);
        if (path.extname(file) === '.md' && !fileName.startsWith('_DONTUSE')) {

            let relativePath = path.relative(baseDirectory, file);
            relativePath = path.normalize(relativePath).replace(/\\/g, '/'); // Normalize and replace backslashes
            relativePath = `./src/${relativePath}`; // Prepend with ./src/

            // // Normalize the path here before printing
            // let relativePath = path.relative(path.resolve(__dirname, baseDirectory), file);
            // // relativePath = `./${relativePath}`; // Ensures path starts with ./
            // relativePath = `./src/${relativePath}`; // Ensures path starts with ./src/
            // relativePath = relativePath.replace(/\\/g, '/'); // Normalize Windows paths

            const content = await readFile(file, 'utf8');
            markdownContent += `### ${relativePath}\n\n`;
            markdownContent += "\n";
            markdownContent += `//--------------------------------------------\n`;
            markdownContent += `// File: ${relativePath}\n`;
            markdownContent += `//--------------------------------------------\n\n`;
            markdownContent += `${content}\n`;
            markdownContent += "\n\n";
        }
    }
    await writeFile(outputFilePath, markdownContent, 'utf8');
}

// Main function to execute the script
async function main() {
    const files = await getFiles(baseDirectory);
    const dirStructure = await generateDirStructure(baseDirectory);
    await createMarkdownFile(files, dirStructure);
}

main().catch(err => console.error(err));
