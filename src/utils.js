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
    // Se já tem name e description válidos, mantém como está
    if (/name:\s*/.test(yamlBody) && /description:\s*/.test(yamlBody)) {
      return trimmed + '\n';
    }
  }

  // Se não tem YAML ou está incompleto, remove delimitadores isolados no início e adiciona o padrão
  const cleanBody = trimmed.replace(/^---\r?\n/, '').replace(/^---\r?\n/, '').trimStart();
  const frontmatter = `---
name: ${skillMeta.folderName}
description: ${skillMeta.description.replace(/\r?\n/g, ' ')}
---

`;

  return frontmatter + cleanBody + '\n';
}

/**
 * Copia uma skill para o destino especificado
 */
export function copySkill(skill, destBaseDir, format = 'folder', overwrite = true) {
  const targetDir = path.resolve(process.cwd(), destBaseDir);
  
  let targetFilePath;
  if (format === 'folder') {
    const skillFolder = path.join(targetDir, skill.folderName);
    fs.mkdirSync(skillFolder, { recursive: true });
    targetFilePath = path.join(skillFolder, 'SKILL.md');
  } else {
    fs.mkdirSync(targetDir, { recursive: true });
    targetFilePath = path.join(targetDir, skill.fileName);
  }

  if (fs.existsSync(targetFilePath) && !overwrite) {
    return {
      skill,
      targetFilePath,
      status: 'skipped',
      message: 'Arquivo já existente (ignorado)'
    };
  }

  const processedContent = ensureStandardFrontmatter(skill.content, skill);
  fs.writeFileSync(targetFilePath, processedContent, 'utf-8');

  return {
    skill,
    targetFilePath,
    status: 'created',
    message: 'Importada com sucesso'
  };
}

/**
 * Exibe mensagem de ajuda no terminal
 */
export function printHelp() {
  console.log(`
${pc.bold(pc.cyan('skill-for-agents'))} - Importe skills de IA / agentes para qualquer projeto

${pc.bold('USO:')}
  ${pc.green('npx skill-for-agents')} [opções]

${pc.bold('OPÇÕES:')}
  ${pc.yellow('-a, --all')}              Importa todas as skills disponíveis
  ${pc.yellow('-d, --dest <caminho>')}    Diretório de destino (padrão: .agent/skills)
  ${pc.yellow('-s, --skill <nomes>')}     Importa skills específicas separadas por vírgula (ex: front-end,firebase)
  ${pc.yellow('-f, --format <formato>')}  Formato de saída: ${pc.cyan('folder')} (pasta/SKILL.md) ou ${pc.cyan('file')} (arquivo.md) [padrão: folder]
  ${pc.yellow('-l, --list')}             Lista todas as skills disponíveis com suas descrições
  ${pc.yellow('--no-overwrite')}          Não sobrescreve arquivos existentes
  ${pc.yellow('-h, --help')}             Exibe esta mensagem de ajuda
  ${pc.yellow('-v, --version')}          Exibe a versão instalada

${pc.bold('EXEMPLOS:')}
  ${pc.dim('# Modo interativo com menu visual:')}
  npx skill-for-agents

  ${pc.dim('# Importar todas as skills para o padrão (.agent/skills):')}
  npx skill-for-agents --all

  ${pc.dim('# Importar para pasta personalizada:')}
  npx skill-for-agents --all --dest ./skills

  ${pc.dim('# Importar apenas skills específicas:')}
  npx skill-for-agents --skill front-end,firebase,ui_ux --dest .agent/skills

  ${pc.dim('# Listar catálogo de skills:')}
  npx skill-for-agents --list
`);
}
