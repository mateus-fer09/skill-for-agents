import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

export function getSkillsDirectory() {
  return SKILLS_DIR;
}

export function parseSkillMetadata(fileName, content) {
  let id = fileName.replace(/^skill_/, '').replace(/\.md$/, '');
  let name = id;
  let description = '';

  // 1. Tentar extrair de YAML frontmatter: --- \n name: ... \n description: ... \n ---
  const yamlMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (yamlMatch) {
    const yamlContent = yamlMatch[1];
    const nameMatch = yamlContent.match(/name:\s*([^\n\r]+)/);
    const descMatch = yamlContent.match(/description:\s*([^\n\r]+)/);

    if (nameMatch) name = nameMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }

  // 2. Se não encontrou descrição ou nome no YAML, tentar extrair de headers e blockquotes
  if (!name || name === id) {
    const titleMatch = content.match(/^#\s+(.+)$/m);
    if (titleMatch) {
      name = titleMatch[1].trim();
    }
  }

  if (!description) {
    const descBlockMatch = content.match(/>\s*\*\*Descrição:\*\*\s*(.+)/);
    if (descBlockMatch) {
      description = descBlockMatch[1].trim();
    } else {
      // Pega o primeiro parágrafo de texto após o cabeçalho
      const paragraphs = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/^#[^\n]+/gm, '')
        .trim()
        .split(/\n\s*\n/);
      if (paragraphs.length > 0 && paragraphs[0]) {
        description = paragraphs[0].replace(/\n/g, ' ').trim();
      }
    }
  }

  // Normaliza o tamanho da descrição
  if (description.length > 160) {
    description = description.slice(0, 157) + '...';
  }

  return {
    id,
    fileName,
    name,
    description: description || 'Skill para agentes de IA',
    folderName: id.replace(/_/g, '-')
  };
}

export function loadAllSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  const files = fs.readdirSync(SKILLS_DIR).filter(file => file.endsWith('.md'));
  
  return files.map(file => {
    const filePath = path.join(SKILLS_DIR, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const meta = parseSkillMetadata(file, content);
    return {
      ...meta,
      filePath,
      content
    };
  });
}
