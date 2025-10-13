#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeamento de linguagens para seus labels
const languageLabels = {
  'typescript': 'Typescript',
  'javascript': 'Javascript',
  'js': 'Javascript',
  'ts': 'Typescript',
  'python': 'Python',
  'py': 'Python',
  'java': 'Java',
  'go': 'Go',
  'rust': 'Rust',
  'cpp': 'C++',
  'c': 'C',
  'csharp': 'C#',
  'cs': 'C#',
  'php': 'PHP',
  'ruby': 'Ruby',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'scala': 'Scala',
  'shell': 'Shell',
  'bash': 'Bash',
  'sh': 'Shell',
  'json': 'JSON',
  'yaml': 'YAML',
  'yml': 'YAML',
  'xml': 'XML',
  'html': 'HTML',
  'css': 'CSS',
  'scss': 'SCSS',
  'sass': 'Sass',
  'sql': 'SQL',
  'graphql': 'GraphQL',
  'markdown': 'Markdown',
  'md': 'Markdown',
  'dockerfile': 'Dockerfile',
  'solidity': 'Solidity',
  'sol': 'Solidity',
  'toml': 'TOML',
  'ini': 'INI',
  'plaintext': 'Plain Text',
  'text': 'Plain Text',
  'dart': 'Dart',
  'r': 'R',
  'perl': 'Perl',
  'lua': 'Lua',
  'vim': 'Vim',
  'diff': 'Diff',
  'powershell': 'PowerShell',
  'tsx': 'TSX',
  'jsx': 'JSX',
};

function fixCodeBlocks(content) {
  // Regex para encontrar code blocks que têm apenas o nome da linguagem
  // Captura: ```linguagem (sem mais nada na mesma linha)
  const codeBlockRegex = /^```([a-zA-Z0-9+#-]+)\s*$/gm;

  let modifiedContent = content;
  let modifications = 0;

  modifiedContent = modifiedContent.replace(codeBlockRegex, (match, language) => {
    const langLower = language.toLowerCase();
    const label = languageLabels[langLower] ||
                  language.charAt(0).toUpperCase() + language.slice(1);

    modifications++;
    return '```' + language + ' ' + label;
  });

  return { content: modifiedContent, modifications };
}

function getAllMdxFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Ignora node_modules e .git
      if (file !== 'node_modules' && file !== '.git') {
        getAllMdxFiles(filePath, fileList);
      }
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function processFiles() {
  try {
    // Encontra todos os arquivos .mdx
    const files = getAllMdxFiles(__dirname);

    console.log(`Encontrados ${files.length} arquivos .mdx\n`);

    let totalModifications = 0;
    let filesModified = 0;

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf8');
      const { content: newContent, modifications } = fixCodeBlocks(content);

      if (modifications > 0) {
        fs.writeFileSync(file, newContent, 'utf8');
        filesModified++;
        totalModifications += modifications;
        console.log(`✓ ${path.relative(__dirname, file)}: ${modifications} code block(s) corrigido(s)`);
      }
    }

    console.log(`\n✓ Concluído!`);
    console.log(`  Arquivos modificados: ${filesModified}`);
    console.log(`  Total de code blocks corrigidos: ${totalModifications}`);

  } catch (error) {
    console.error('Erro:', error.message);
    process.exit(1);
  }
}

processFiles();
