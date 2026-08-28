import path from 'node:path';
import fs from 'node:fs';
import * as p from '@clack/prompts';
import pc from 'picocolors';
import { loadAllSkills, getCategoriesWithSkills } from './skills-manifest.js';
import { copySkill, printHelp } from './utils.js';

export async function run(args = process.argv.slice(2)) {
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
    category: null,
    skill: null,
    dest: null,
    keepCategories: args.includes('--keep-categories'),
    overwrite: !args.includes('--no-overwrite')
  };

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '-c' || args[i] === '--category') && args[i + 1]) {
      flags.category = args[i + 1];
    }
    if ((args[i] === '-s' || args[i] === '--skill') && args[i + 1]) {
      flags.skill = args[i + 1];
    }
    if ((args[i] === '-d' || args[i] === '--dest') && args[i + 1]) {
      flags.dest = args[i + 1];
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
  const categoriesWithSkills = getCategoriesWithSkills();

  // Listagem do catálogo
  if (flags.list) {
    console.log(`\n${pc.bold(pc.cyan('📚 Catálogo de Categorias e Skills Disponíveis:'))}\n`);
    
    categoriesWithSkills.forEach(cat => {
      console.log(`  ${pc.bold(pc.yellow(`📁 ${cat.category}`))} ${pc.dim(`(${cat.skillCount} skill(s), ${cat.totalFiles} arquivo(s))`)}`);
      
      cat.skills.forEach(s => {
        console.log(`    ${pc.green('•')} ${pc.bold(pc.white(s.id.padEnd(20)))} ${pc.dim('→')} ${pc.cyan(s.name)} ${pc.dim(`[${s.fileCount} arquivos]`)}`);
        console.log(`      ${pc.dim(s.description)}\n`);
      });
    });

    const totalFiles = allSkills.reduce((sum, s) => sum + s.fileCount, 0);
    console.log(`${pc.dim(`Total: ${allSkills.length} skill(s) e ${totalFiles} arquivo(s) em ${categoriesWithSkills.length} categoria(s).`)}\n`);
    return;
  }

  // Modo Linha de Comando / Flags
  if (flags.all || flags.category || flags.skill) {
    const destDir = flags.dest || '.agent/skills';
    let selectedSkills = [];

    if (flags.all) {
      selectedSkills = allSkills;
    } else {
      const skillsToInclude = new Set();

      if (flags.category) {
        const requestedCats = flags.category.split(',').map(c => c.trim().toLowerCase());
        const catMatchedSkills = allSkills.filter(s =>
          requestedCats.some(req => s.category.toLowerCase().includes(req))
        );
        catMatchedSkills.forEach(s => skillsToInclude.add(s));
      }

      if (flags.skill) {
        const requestedSkills = flags.skill.split(',').map(s => s.trim().toLowerCase());
        const skillMatched = allSkills.filter(s =>
          requestedSkills.some(req =>
            s.id.toLowerCase() === req ||
            s.rawDirName.toLowerCase() === req ||
            s.targetFolderName.toLowerCase() === req ||
            s.name.toLowerCase().includes(req)
          )
        );
        skillMatched.forEach(s => skillsToInclude.add(s));
      }

      selectedSkills = Array.from(skillsToInclude);
    }

    if (selectedSkills.length === 0) {
      console.error(pc.red(`\n❌ Nenhuma skill encontrada para os critérios informados.`));
      console.log(pc.yellow(`Use 'npx skill-for-agents --list' para ver as categorias e skills disponíveis.\n`));
      process.exit(1);
    }

    console.log(`\n${pc.cyan('⚡ Importando skills e documentações...')}`);
    console.log(`${pc.dim(`Destino: ${path.resolve(process.cwd(), destDir)}`)}`);
    console.log(`${pc.dim(`Estrutura: ${flags.keepCategories ? 'Pastas de Categorias' : 'Direto por Skill'}`)}\n`);

    let totalCopiedFiles = 0;
    const results = selectedSkills.map(skill => {
      const res = copySkill(skill, destDir, {
        keepCategoryHierarchy: flags.keepCategories,
        overwrite: flags.overwrite
      });
      totalCopiedFiles += res.filesCopied;
      return res;
    });

    results.forEach(res => {
      if (res.status === 'created') {
        console.log(`  ${pc.green('✔')} ${pc.bold(res.skill.id)} ${pc.dim(`[${res.filesCopied} arquivos]`)} → ${pc.dim(path.relative(process.cwd(), res.targetSkillDir))}`);
      } else {
        console.log(`  ${pc.yellow('⚠')} ${pc.bold(res.skill.id)} ${pc.dim(`(${res.message})`)}`);
      }
    });

    console.log(`\n${pc.green(pc.bold('✨ Concluído com sucesso!'))} ${selectedSkills.length} skill(s) e ${totalCopiedFiles} arquivo(s) importado(s).\n`);
    return;
  }

  // Modo Interativo (Clack Prompts UI)
  console.log();
  p.intro(`${pc.bgCyan(pc.black(' skill-for-agents '))} ${pc.dim(`v${version}`)} - Gerenciador de Skills para Agentes de IA`);

  // 1. Destino
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

  // 2. Modo de Seleção
  const selectionMode = await p.select({
    message: 'Como você deseja selecionar as skills para importar?',
    options: [
      {
        value: 'all',
        label: `📦 Importar TODAS as skills (${allSkills.length} skills em ${categoriesWithSkills.length} categorias)`,
        hint: 'Importa todo o catálogo disponível com todos os manuais'
      },
      {
        value: 'category',
        label: '📁 Escolher por Categoria (Importar categorias inteiras)',
        hint: 'Ex: APIs, Bibliotecas React, TradingView, Banco de Dados...'
      },
      {
        value: 'manual',
        label: '🎯 Selecionar Skills Individuais',
        hint: 'Escolher uma ou mais skills específicas da lista'
      }
    ]
  });

  if (p.isCancel(selectionMode)) {
    p.cancel('Operação cancelada pelo usuário.');
    process.exit(0);
  }

  let selectedSkills = allSkills;

  if (selectionMode === 'category') {
    const categoryChoices = await p.multiselect({
      message: 'Selecione as categorias que deseja importar (Espaço para marcar, Enter para confirmar):',
      options: categoriesWithSkills.map(c => ({
        value: c.category,
        label: `${c.category} (${c.skillCount} skill(s) - ${c.totalFiles} arquivos)`,
        hint: c.skills.map(s => s.id).join(', ')
      })),
      required: true
    });

    if (p.isCancel(categoryChoices)) {
      p.cancel('Operação cancelada pelo usuário.');
      process.exit(0);
    }

    selectedSkills = allSkills.filter(s => categoryChoices.includes(s.category));
  } else if (selectionMode === 'manual') {
    const manualChoices = await p.multiselect({
      message: 'Selecione as skills que deseja incluir (Espaço para marcar, Enter para confirmar):',
      options: allSkills.map(s => ({
        value: s.id,
        label: `[${s.category}] ${s.id} - ${s.name}`,
        hint: `${s.fileCount} arquivos • ${s.description.slice(0, 60)}...`
      })),
      required: true
    });

    if (p.isCancel(manualChoices)) {
      p.cancel('Operação cancelada pelo usuário.');
      process.exit(0);
    }

    selectedSkills = allSkills.filter(s => manualChoices.includes(s.id));
  }

  // 3. Estrutura de Pastas
  const structureChoice = await p.select({
    message: 'Como organizar as pastas no destino?',
    options: [
      {
        value: 'flat',
        label: 'Direto por pasta da skill (Recomendado)',
        hint: `ex: ${finalDest}/<skill-name>/`
      },
      {
        value: 'nested',
        label: 'Organizado em subpastas de categorias',
        hint: `ex: ${finalDest}/<categoria>/<skill-name>/`
      }
    ]
  });

  if (p.isCancel(structureChoice)) {
    p.cancel('Operação cancelada pelo usuário.');
    process.exit(0);
  }

  const keepCategories = structureChoice === 'nested';

  // 4. Executar Cópia com Spinner
  const s = p.spinner();
  s.start(`Importando ${selectedSkills.length} skill(s) e seus subdiretórios de documentação...`);

  await new Promise(resolve => setTimeout(resolve, 300));

  let totalFilesCopied = 0;
  const results = selectedSkills.map(skill => {
    const res = copySkill(skill, finalDest, {
      keepCategoryHierarchy: keepCategories,
      overwrite: true
    });
    totalFilesCopied += res.filesCopied;
    return res;
  });

  s.stop(pc.green(`✔ ${results.length} skill(s) e ${totalFilesCopied} arquivo(s) importados com sucesso!`));

  // Resumo
  const targetSummary = results
    .map(r => `  • ${pc.bold(r.skill.id)} ${pc.dim(`(${r.filesCopied} arquivos)`)} → ${pc.dim(path.relative(process.cwd(), r.targetSkillDir))}`)
    .join('\n');

  p.note(targetSummary, 'Skills Adicionadas ao Projeto:');

  p.outro(pc.green('🎉 Concluído! O seu agente de IA agora possui acesso a todo esse conhecimento técnico e modular.'));
}
