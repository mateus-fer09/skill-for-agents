import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

export function getSkillsDirectory() {
  return SKILLS_DIR;
}

/**
 * Conta recursivamente o número de arquivos em um diretório
 */
export function countFiles(dir) {
  let count = 0;
  if (!fs.existsSync(dir)) return 0;
  
  const items = fs.readdirSync(dir, { withFileTypes: true });
  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      count += countFiles(fullPath);
    } else {
      count++;
    }
  }
  return count;
}

/**
 * Extrai metadados de um arquivo SKILL.md ou markdown principal
 */
export function parseSkillMetadata(folderName, content, defaultCategory = 'Geral') {
  let name = folderName.replace(/^skill_/, '');
  let description = '';

  // 1. Tentar extrair do frontmatter YAML (--- name: ... description: ... ---)
  const yamlMatch = content.match(/^---\s*([\s\S]*?)\s*---/);
  if (yamlMatch) {
    const yamlContent = yamlMatch[1];
    const nameMatch = yamlContent.match(/name:\s*([^\n\r]+)/);
    const descMatch = yamlContent.match(/description:\s*([^\n\r]+)/);

    if (nameMatch) name = nameMatch[1].trim();
    if (descMatch) description = descMatch[1].trim();
  }

  // 2. Se não encontrou no YAML, tentar extrair de seções conhecidas ou primeiro parágrafo relevante
  if (!description) {
    const descBlockMatch = content.match(/>\s*\*\*Descrição:\*\*\s*(.+)/i) ||
                           content.match(/##\s*Propósito[^\n]*\r?\n+([^\n#]+)/i) ||
                           content.match(/##\s*Objetivo[^\n]*\r?\n+([^\n#]+)/i);
    if (descBlockMatch) {
      description = descBlockMatch[1].trim();
    } else {
      const cleanContent = content
        .replace(/^---[\s\S]*?---/, '')
        .replace(/^#[^\n]+/gm, '')
        .replace(/^Fonte[^\n]+/gm, '')
        .trim();

      const paragraphs = cleanContent.split(/\r?\n\s*\r?\n/);
      for (const p of paragraphs) {
        const text = p.trim().replace(/^>\s*/, '').replace(/\r?\n/g, ' ');
        if (text.length > 20 && !text.startsWith('http')) {
          description = text;
          break;
        }
      }
    }
  }

  if (description.length > 160) {
    description = description.slice(0, 157) + '...';
  }

  const cleanId = folderName.replace(/^skill_/, '').toLowerCase().replace(/[\s_]+/g, '-');

  return {
    id: cleanId,
    rawDirName: folderName,
    name,
    description: description || 'Skill com documentação modular para agentes de IA',
    targetFolderName: cleanId
  };
}

/**
 * Escaneia recursivamente a pasta skills/ identificando Categorias e Skills
 */
export function loadAllSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    return [];
  }

  const skills = [];

  function scanDirectory(currentDir, currentCategory = '') {
    const items = fs.readdirSync(currentDir, { withFileTypes: true });

    for (const item of items) {
      if (!item.isDirectory()) continue;

      const fullPath = path.join(currentDir, item.name);
      const skillMdPath = path.join(fullPath, 'SKILL.md');
      const indexMdPath = path.join(fullPath, 'index_master.md');

      // Verifica se esta pasta em si é uma Skill (tem SKILL.md ou index_master.md)
      if (fs.existsSync(skillMdPath) || fs.existsSync(indexMdPath)) {
        const mdToRead = fs.existsSync(skillMdPath) ? skillMdPath : indexMdPath;
        const content = fs.readFileSync(mdToRead, 'utf-8');
        
        let categoryName = currentCategory || (item.name.startsWith('skill_') ? 'Geral' : item.name);
        categoryName = categoryName.replace(/\s*>\s*[a-zA-Z0-9_-]+-docs/g, '').trim();

        const meta = parseSkillMetadata(item.name, content, categoryName);

        skills.push({
          ...meta,
          category: categoryName,
          skillDir: fullPath,
          fileCount: countFiles(fullPath),
          hasSkillMd: fs.existsSync(skillMdPath)
        });
      } else {
        // É uma pasta de categoria ou agrupador (ex: APIs, Banco de Dados, Bibliotecas React, etc.)
        let nextCategory = currentCategory ? `${currentCategory} > ${item.name}` : item.name;
        
        // Verifica se tem subdiretórios
        const subdirs = fs.readdirSync(fullPath, { withFileTypes: true }).filter(d => d.isDirectory());
        if (subdirs.length > 0) {
          scanDirectory(fullPath, nextCategory);
        } else {
          // Pasta vazia ou apenas com arquivos sem SKILL.md
          const mdFiles = fs.readdirSync(fullPath).filter(f => f.endsWith('.md'));
          if (mdFiles.length > 0) {
            const firstMd = path.join(fullPath, mdFiles[0]);
            const content = fs.readFileSync(firstMd, 'utf-8');
            let categoryName = currentCategory || 'Geral';
            categoryName = categoryName.replace(/\s*>\s*[a-zA-Z0-9_-]+-docs/g, '').trim();

            const meta = parseSkillMetadata(item.name, content, categoryName);
            skills.push({
              ...meta,
              category: categoryName,
              skillDir: fullPath,
              fileCount: countFiles(fullPath),
              hasSkillMd: false
            });
          }
        }
      }
    }
  }

  scanDirectory(SKILLS_DIR);
  return skills;
}

/**
 * Retorna lista de categorias únicas disponíveis e suas skills associadas
 */
export function getCategoriesWithSkills() {
  const allSkills = loadAllSkills();
  const categoryMap = new Map();

  for (const skill of allSkills) {
    const cat = skill.category;
    if (!categoryMap.has(cat)) {
      categoryMap.set(cat, []);
    }
    categoryMap.get(cat).push(skill);
  }

  return Array.from(categoryMap.entries()).map(([category, skills]) => ({
    category,
    skills,
    skillCount: skills.length,
    totalFiles: skills.reduce((sum, s) => sum + s.fileCount, 0)
  }));
}
