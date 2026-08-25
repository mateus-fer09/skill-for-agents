import path from 'node:path';
import fs from 'node:fs';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { loadAllSkills } from './skills-manifest.js';
import { copySkill, printHelp } from './utils.js';

export async function run(args = process.argv.slice(2)) {
  const packageJsonPath = path.resolve(new URL('.', import.meta.url).pathname, '../package.json');
  let version = '1.0.0';
  try {
    const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf-8'));
    version = pkg.version;
  } catch (e) {
    // fallback
  }

  // Parse arguments
  const flags = {
    help: args.includes('-h') || args.includes('--help'),
    version: args.includes('-v') || args.includes('--version'),
    list: args.includes('-l') || args.includes('--list'),
    all: args.includes('-a') || args.includes('--all'),
    dest: null,
    skill: null,
    overwrite: !args.includes('--no-overwrite')
  };

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '-d' || args[i] === '--dest') && args[i + 1]) {
      flags.dest = args[i + 1];
    }
    if ((args[i] === '-s' || args[i] === '--skill') && args[i + 1]) {
      flags.skill = args[i + 1];
    }
  }

  if (flags.help) {
    printHelp();
    return;
  }

  if (flags.version) {
    console.log(`skill-for-agents v${version}`);
    return;
  }

  const allSkills = loadAllSkills();

  if (flags.list) {
    console.log(`\n${pc.bold(pc.cyan('📦 Catálogo de Skills Disponíveis:'))}\n`);
    allSkills.forEach(s => {
      console.log(`  ${pc.bold(pc.green(s.id.padEnd(22)))} ${pc.dim('→')} ${pc.white(s.name)}`);
      console.log(`  ${pc.dim(s.description)}\n`);
    });
    console.log(`${pc.dim(`Total de ${allSkills.length} skills disponíveis.`)}\n`);
    return;
  }

  // Modo Não-Interativo (Flags presentes)
  if (flags.all || flags.skill) {
    const destDir = flags.dest || '.agent/skills';
    let selectedSkills = allSkills;

    if (flags.skill) {
      const requestedIds = flags.skill.split(',').map(s => s.trim().toLowerCase());
      selectedSkills = allSkills.filter(s =>
        requestedIds.includes(s.id.toLowerCase()) ||
        requestedIds.includes(s.folderName.toLowerCase())
      );

      if (selectedSkills.length === 0) {
        console.error(pc.red(`\n❌ Nenhuma skill encontrada para: ${flags.skill}`));
        console.log(pc.yellow(`Use 'npx skill-for-agents --list' para ver os nomes disponíveis.\n`));
        process.exit(1);
      }
    }

    console.log(`\n${pc.cyan('⚡ Importando skills...')}`);
    console.log(`${pc.dim(`Destino: ${path.resolve(process.cwd(), destDir)}`)}\n`);

    const results = selectedSkills.map(skill => copySkill(skill, destDir, flags.overwrite));

    results.forEach(res => {
      if (res.status === 'created') {
        console.log(`  ${pc.green('✔')} ${pc.bold(res.skill.id)} ${pc.dim(`→ ${path.relative(process.cwd(), res.targetFilePath)}`)}`);
      } else {
        console.log(`  ${pc.yellow('⚠')} ${pc.bold(res.skill.id)} ${pc.dim(`(${res.message})`)}`);
      }
    });

    console.log(`\n${pc.green(pc.bold('✨ Concluído com sucesso!'))} ${selectedSkills.length} skill(s) processada(s).\n`);
    return;
  }

  // Modo Interativo (Clack UI)
  console.log();
  p.intro(`${pc.bgCyan(pc.black(' skill-for-agents '))} ${pc.dim(`v${version}`)} - Gerenciador de Skills para Agentes`);

  // 1. Seleção de Destino
  const destChoice = await p.select({
    message: 'Onde você deseja salvar as skills no projeto atual?',
    options: [
      { value: '.agent/skills', label: '.agent/skills/', hint: 'Padrão recomendado para Antigravity / Gemini / Claude' },
      { value: '.gemini/skills', label: '.gemini/skills/', hint: 'Diretório específico do Gemini / Google AI' },
      { value: '.claude/skills', label: '.claude/skills/', hint: 'Diretório específico do Claude' },
      { value: 'skills', label: 'skills/', hint: 'Pasta na raiz do projeto' },
      { value: 'custom', label: 'Outro diretório personalizado...', hint: 'Digitar caminho manual' }
    ]
  });

  if (p.isCancel(destChoice)) {
    p.cancel('Operação cancelada pelo usuário.');
    process.exit(0);
  }

  let finalDest = destChoice;
  if (destChoice === 'custom') {
    const customDest = await p.text({
      message: 'Digite o caminho relativo da pasta de destino:',
      placeholder: './minhas-skills',
      validate: (val) => {
        if (!val || val.trim().length === 0) return 'O caminho não pode ser vazio.';
      }
    });

    if (p.isCancel(customDest)) {
      p.cancel('Operação cancelada pelo usuário.');
      process.exit(0);
    }
    finalDest = customDest.trim();
  }

  // 2. Escolha das Skills
  const selectionMode = await p.select({
    message: 'Quais skills você deseja importar?',
    options: [
      { value: 'all', label: `Todas as skills disponíveis (${allSkills.length} skills)`, hint: 'Recomendado para ter o arsenal completo' },
      { value: 'manual', label: 'Escolher skills manualmente...', hint: 'Selecionar uma ou mais da lista' }
    ]
  });

  if (p.isCancel(selectionMode)) {
    p.cancel('Operação cancelada pelo usuário.');
    process.exit(0);
  }

  let selectedSkills = allSkills;

  if (selectionMode === 'manual') {
    const manualChoices = await p.multiselect({
      message: 'Selecione as skills que deseja incluir (Espaço para marcar, Enter para confirmar):',
      options: allSkills.map(s => ({
        value: s.id,
        label: `${s.id} - ${s.name}`,
        hint: s.description.slice(0, 70) + '...'
      })),
      required: true
    });

    if (p.isCancel(manualChoices)) {
      p.cancel('Operação cancelada pelo usuário.');
      process.exit(0);
    }

    selectedSkills = allSkills.filter(s => manualChoices.includes(s.id));
  }

  // 3. Executar Cópia com Spinner
  const s = p.spinner();
  s.start('Importando skills para o seu projeto...');

  // Pequeno delay para efeito visual agradável
  await new Promise(resolve => setTimeout(resolve, 300));

  const results = selectedSkills.map(skill => copySkill(skill, finalDest, true));

  s.stop(pc.green(`✔ ${results.length} skill(s) importada(s) com sucesso!`));

  // Resumo
  const targetSummary = results.map(r => `  • ${pc.bold(r.skill.id)} → ${pc.dim(path.relative(process.cwd(), r.targetFilePath))}`).join('\n');
  p.note(targetSummary, 'Arquivos Gerados:');

  p.outro(pc.green('🎉 Pronto! Seu agente de IA agora tem acesso a essas diretrizes e skills.'));
}
