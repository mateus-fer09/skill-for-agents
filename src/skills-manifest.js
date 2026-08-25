import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

export function getSkillsDirectory() {
  return SKILLS_DIR;
}

export function parseSkillMetadata(skillFolderName, content) {
  let name = skillFolderName;
  let description = '';

  const yamlMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (yamlMatch) {
    const yamlContent = yamlMatch[1];
    const nameMatch = yamlContent.match(/name:\s*([^\n\r]+)/);
    const descMatch = yamlContent.match(/description:\s*([^\n\r]+)/);

    if (nameMatch) name = nameMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }

  // Normaliza o tamanho da descrição
  if (description.length > 160) {
    description = description.slice(0, 157) + '...';
  }

  return {
    id: skillFolderName,
    name,
    description: description || 'Skill para agentes de IA',
    folderName: skillFolderName
  };
}

export function loadAllSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  const items = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
  const skills = [];

  for (const item of items) {
    if (item.isDirectory()) {
      const skillPath = path.join(SKILLS_DIR, item.name);
      const skillMdPath = path.join(skillPath, 'SKILL.md');
      
      if (fs.existsSync(skillMdPath)) {
        const content = fs.readFileSync(skillMdPath, 'utf-8');
        const meta = parseSkillMetadata(item.name, content);
        
        skills.push({
          ...meta,
          sourceFolderPath: skillPath,
          content
        });
      }
    }
  }
  
  return skills;
}
