import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';

/**
 * Garante que o conteúdo da skill possui frontmatter YAML válido (name e description)
 */
export function ensureStandardFrontmatter(content, skillMeta) {
  const trimmed = content.trim();
  const yamlMatch = trimmed.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  
  if (yamlMatch) {
    const yamlBody = yamlMatch[1];
    if (/name:\s*/.test(yamlBody) && /description:\s*/.test(yamlBody)) {
      return trimmed + '\n';
    }
  }

  const cleanBody = trimmed.replace(/^---\r?\n/, '').replace(/^---\r?\n/, '').trimStart();
  const frontmatter = `---
name: ${skillMeta.targetFolderName}
description: ${skillMeta.description.replace(/\r?\n/g, ' ')}
---

`;

  return frontmatter + cleanBody + '\n';
}

/**
 * Copia recursivamente um diretório completo preservando a árvore de arquivos e subpastas
 */
export function copyDirectoryRecursive(src, dest, overwrite = true) {
  if (!fs.existsSync(src)) return 0;
  fs.mkdirSync(dest, { recursive: true });

  let filesCopied = 0;
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      filesCopied += copyDirectoryRecursive(srcPath, destPath, overwrite);
    } else {
      if (!fs.existsSync(destPath) || overwrite) {
        fs.copyFileSync(srcPath, destPath);
        filesCopied++;
      }
    }
  }

  return filesCopied;
}

/**
 * Copia uma skill completa (pasta com todos os seus subdiretórios e arquivos) para o destino
 */
export function copySkill(skill, destBaseDir, options = {}) {
  const { keepCategoryHierarchy = false, overwrite = true } = options;
  const resolvedBase = path.resolve(process.cwd(), destBaseDir);

  let targetSkillDir;
  if (keepCategoryHierarchy && skill.category && skill.category !== 'Geral') {
    const safeCategory = skill.category.replace(/\s*>\s*/g, path.sep);
    targetSkillDir = path.join(resolvedBase, safeCategory, skill.targetFolderName);
  } else {
    targetSkillDir = path.join(resolvedBase, skill.targetFolderName);
  }

  const isExisting = fs.existsSync(targetSkillDir);
  if (isExisting && !overwrite) {
    return {
      skill,
      targetSkillDir,
      filesCopied: 0,
      status: 'skipped',
      message: 'Diretório já existente (ignorado)'
    };
  }

  const filesCopied = copyDirectoryRecursive(skill.skillDir, targetSkillDir, overwrite);

  // Se a skill não tem SKILL.md mas tem index_master.md, gera o SKILL.md de entrada
  const destSkillMd = path.join(targetSkillDir, 'SKILL.md');
  const destIndexMd = path.join(targetSkillDir, 'index_master.md');
  if (!fs.existsSync(destSkillMd) && fs.existsSync(destIndexMd)) {
    const indexContent = fs.readFileSync(destIndexMd, 'utf-8');
    const formatted = ensureStandardFrontmatter(indexContent, skill);
    fs.writeFileSync(destSkillMd, formatted, 'utf-8');
  }

  return {
    skill,
    targetSkillDir,
    filesCopied,
    status: 'created',
    message: `${filesCopied} arquivo(s) copiado(s)`
  };
}

/**
 * Exibe mensagem de ajuda no terminal
 */
export function printHelp() {
  console.log(`
${pc.bold(pc.cyan('skill-for-agents'))} - Importe skills e diretrizes de IA completas para o seu projeto

${pc.bold('USO:')}
  ${pc.green('npx skill-for-agents')} [opções]

${pc.bold('OPÇÕES:')}
  ${pc.yellow('-a, --all')}                   Importa todas as skills de todas as categorias
  ${pc.yellow('-c, --category <categorias>')}  Importa todas as skills das categorias especificadas (ex: APIs, "Bibliotecas React")
  ${pc.yellow('-s, --skill <nomes>')}          Importa skills específicas (ex: chatgpt, gemini, react-flow, pine-script)
  ${pc.yellow('-d, --dest <caminho>')}         Diretório de destino (padrão: .agent/skills)
  ${pc.yellow('--keep-categories')}            Mantém a estrutura de pastas das categorias no destino
  ${pc.yellow('-l, --list')}                  Lista todas as categorias e skills com contagem de arquivos
  ${pc.yellow('--no-overwrite')}               Não sobrescreve arquivos existentes
  ${pc.yellow('-h, --help')}                  Exibe esta mensagem de ajuda
  ${pc.yellow('-v, --version')}               Exibe a versão instalada

${pc.bold('EXEMPLOS:')}
  ${pc.dim('# Menu interativo completo (selecionar categorias ou skills):')}
  npx skill-for-agents

  ${pc.dim('# Importar todas as skills para o padrão (.agent/skills):')}
  npx skill-for-agents --all

  ${pc.dim('# Importar todas as skills de uma categoria específica:')}
  npx skill-for-agents --category APIs

  ${pc.dim('# Importar múltiplas categorias:')}
  npx skill-for-agents --category "APIs,Bibliotecas React,TradingView"

  ${pc.dim('# Importar skills individuais para uma pasta personalizada:')}
  npx skill-for-agents --skill chatgpt,react-flow --dest ./minhas-skills

  ${pc.dim('# Listar catálogo com categorias e descrições:')}
  npx skill-for-agents --list
`);
}
