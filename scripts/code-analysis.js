#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const PATTERNS = {
  unsafeArrayAccess: /\w+\[0\](?!\?)/g,
  unsafePropertyAccess: /\w+\[\w+\]\.\w+(?!\?)/g,
  unsafeParse: /parse\([^,]+\.\w+[^?]/g,
  unsafeHourAccess: /\.hour(?!\?)/g,
  unsafeObjectAccess: /\.\w+\[\d+\](?!\?)/g,
  chainedAccess: /\w+\.\w+\.\w+\.\w+(?!\?)/g,
};

function analyzeFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const issues = [];

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    
    Object.entries(PATTERNS).forEach(([patternName, regex]) => {
      const matches = line.match(regex);
      if (matches) {
        matches.forEach(match => {
          issues.push({
            file: filePath,
            line: lineNumber,
            type: patternName,
            code: line.trim(),
            match: match.trim()
          });
        });
      }
    });
  });

  return issues;
}

function analyzeCodebase() {
  const files = glob.sync('app/**/*.{ts,tsx}', { ignore: ['**/*.test.*', '**/*.spec.*'] });
  let allIssues = [];

  console.log(`🔍 Analizando ${files.length} archivos...\n`);

  files.forEach(file => {
    const issues = analyzeFile(file);
    allIssues = allIssues.concat(issues);
  });

  // Group by type
  const groupedIssues = allIssues.reduce((acc, issue) => {
    if (!acc[issue.type]) acc[issue.type] = [];
    acc[issue.type].push(issue);
    return acc;
  }, {});

  console.log('📊 RESUMEN DE PROBLEMAS POTENCIALES:\n');
  
  Object.entries(groupedIssues).forEach(([type, issues]) => {
    console.log(`\n🚨 ${type.toUpperCase()} (${issues.length} ocurrencias):`);
    console.log('=' + '='.repeat(50));
    
    issues.slice(0, 10).forEach(issue => { // Limit to 10 per type
      console.log(`📍 ${issue.file}:${issue.line}`);
      console.log(`   ${issue.code}`);
      console.log(`   ⚠️  Patrón problemático: "${issue.match}"`);
      console.log('');
    });
    
    if (issues.length > 10) {
      console.log(`   ... y ${issues.length - 10} más\n`);
    }
  });

  // High priority issues
  const highPriority = allIssues.filter(issue => 
    ['unsafeArrayAccess', 'unsafePropertyAccess', 'unsafeParse'].includes(issue.type)
  );

  console.log('\n🔥 PROBLEMAS DE ALTA PRIORIDAD:');
  console.log('=' + '='.repeat(40));
  console.log(`Total: ${highPriority.length} problemas que pueden causar errores en runtime\n`);

  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalFiles: files.length,
    totalIssues: allIssues.length,
    highPriorityIssues: highPriority.length,
    issuesByType: Object.fromEntries(
      Object.entries(groupedIssues).map(([type, issues]) => [type, issues.length])
    ),
    details: groupedIssues
  };

  fs.writeFileSync('code-analysis-report.json', JSON.stringify(report, null, 2));
  console.log('📝 Reporte completo guardado en: code-analysis-report.json');
  
  return allIssues.length;
}

if (require.main === module) {
  const issueCount = analyzeCodebase();
  process.exit(issueCount > 0 ? 1 : 0);
}

module.exports = { analyzeCodebase };