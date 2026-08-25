import fs from 'node:fs';
import path from 'node:path';
import pc from 'picocolors';

/**
 * Copia uma pasta de skill (incluindo subpastas) para o destino especificado
 */
export function copySkill(skill, destBaseDir, overwrite = true) {
  const targetDir = path.resolve(process.cwd(), destBaseDir);
  const skillFolder = path.join(targetDir, skill.folderName);
  
  if (fs.existsSync(skillFolder) && !overwrite) {
    return {
      skill,
      targetFilePath: skillFolder,
      status: 'skipped',
      message: 'Skill já existente (ignorada)'
    };
  }

  // Copiar o diretório de forma recursiva
  fs.cpSync(skill.sourceFolderPath, skillFolder, { recursive: true, force: overwrite });

  return {
    skill,
    targetFilePath: skillFolder,
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
  npx skill-for-agents --skill front-end,firebase --dest .agent/skills

  ${pc.dim('# Listar catálogo de skills:')}
  npx skill-for-agents --list
`);
}
