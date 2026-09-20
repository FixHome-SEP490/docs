/* Reproducible static inventory. A route match is NOT an integration PASS. */
const fs = require('fs');
const path = require('path');
const ts = require('../Backend-FixHome/node_modules/typescript');
const root = path.resolve(__dirname, '..');
const out = path.join(__dirname, 'integration-audit');
fs.mkdirSync(out, { recursive: true });
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
}
const rel = file => path.relative(root, file).replaceAll('\\', '/');
const source = file => ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
const decorators = node => ts.canHaveDecorators(node) ? ts.getDecorators(node) || [] : [];
const dec = (node, name) => decorators(node).filter(d => ts.isCallExpression(d.expression) && d.expression.expression.getText() === name).map(d => d.expression.arguments.map(a => a.getText()).join(', '));
const unquote = str => (str || '').replace(/^['"`]|['"`]$/g, '');
const paths = (node, name) => decorators(node).filter(d => ts.isCallExpression(d.expression) && d.expression.expression.getText() === name).flatMap(d => {
  const arg = d.expression.arguments[0];
  return arg && ts.isArrayLiteralExpression(arg) ? arg.elements.map(e => unquote(e.getText())) : [unquote(arg?.getText())];
});
const routes = [];
const files = {};
for (const repo of ['Backend-FixHome','Frontend-FixHome','Mobi-FixHome']) {
  files[repo] = walk(path.join(root, repo, 'src')).filter(f => /\.(ts|tsx|vue)$/.test(f) && !/[/\\](ai-diagnosis|chat)[/\\]|CustomerAI(?:Diagnosis|Chat)Screen/.test(f));
}
for (const file of files['Backend-FixHome'].filter(f => f.endsWith('.controller.ts'))) {
  const sf = source(file);
  for (const cls of sf.statements.filter(ts.isClassDeclaration)) {
    for (const prefix of paths(cls, 'Controller')) {
    for (const method of cls.members.filter(ts.isMethodDeclaration)) {
      for (const verb of ['Get','Post','Put','Patch','Delete']) {
        for (const suffix of paths(method, verb)) {
          const route = '/' + [prefix, suffix].filter(Boolean).join('/');
          routes.push({ module: rel(file).split('/')[3], method: verb.toUpperCase(), route, file: rel(file), line: sf.getLineAndCharacterOfPosition(method.getStart()).line + 1, handler: method.name.getText(), guards: [...dec(cls,'UseGuards'),...dec(method,'UseGuards')].join(', '), roles: [...dec(cls,'Roles'),...dec(method,'Roles')].join(', '), permissions: [...dec(cls,'RequirePermission'),...dec(method,'RequirePermission')].join(', '), parameters: method.parameters.map(p => p.getText()).join('; '), body: method.body?.getText() });
        }
      }
    }
    }
  }
}
const calls = [];
for (const repo of ['Frontend-FixHome','Mobi-FixHome']) {
  for (const file of files[repo].filter(f => !/\.(spec|test)\./.test(f))) {
    const text = fs.readFileSync(file, 'utf8');
    // Include script blocks and direct API calls in pages, not only api/ files.
    const code = file.endsWith('.vue') ? text.match(/<script[^>]*>([\s\S]*?)<\/script>/)?.[1] || '' : text;
    const sf = ts.createSourceFile(file, code, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
    const visit = node => {
      if (ts.isCallExpression(node)) {
        const name = node.expression.getText(sf);
        const verb = name.match(/(?:\.|^)(get|post|patch|put|delete)$/i)?.[1];
        const arg = node.arguments[0]?.getText(sf);
        if (verb && arg && /^['"`]\//.test(arg)) {
          const route = unquote(arg).replace(/\$\{[^}]+\}/g, ':param');
          if (/^\/(ai(?:-diagnosis)?|chat)(?:\/|$)/.test(route)) return;
          const normal = p => p.replace(/:[^/]+/g, ':param');
          calls.push({ repo, file: rel(file), line: text.slice(0, Math.max(0,text.indexOf(node.getText(sf)))).split('\n').length, method: verb.toUpperCase(), route, expression: node.getText(sf), matches: routes.filter(r => r.method === verb.toUpperCase() && normal(r.route) === normal(route)).map(r => r.method + ' ' + r.route) });
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(sf);
  }
}
const hits = [];
for (const [repo, list] of Object.entries(files)) for (const file of list) {
  if (/\.(spec|test)\./.test(file)) continue;
  fs.readFileSync(file,'utf8').split(/\r?\n/).forEach((line,i) => {
    if (/mock|dummy|fake|hardcod|TODO|FIXME|setTimeout|Math\.random|localhost|10\.0\.2\.2|sampleData|staticData|temporary/i.test(line) && !/diagnos|gemini|openai|chat/i.test(line)) hits.push({repo,file:rel(file),line:i+1,text:line.trim()});
  });
}
const counts = Object.fromEntries(Object.entries(files).map(([repo,list]) => [repo,{ sourceFiles:list.length, modules:list.filter(f=>f.endsWith('.module.ts')).length, controllers:list.filter(f=>f.endsWith('.controller.ts')).length, services:list.filter(f=>f.endsWith('.service.ts')).length, dtos:list.filter(f=>f.endsWith('.dto.ts')).length, entities:list.filter(f=>f.endsWith('.entity.ts')).length, guards:list.filter(f=>f.endsWith('.guard.ts')).length, gateways:list.filter(f=>f.endsWith('.gateway.ts')).length, pages:list.filter(f=>/[/\\](pages|screens)[/\\]/.test(f)).length }]));
fs.writeFileSync(path.join(out,'inventory.json'),JSON.stringify({counts,routes,calls,hits},null,2));
const cell = v => String(v || '—').replaceAll('|','\\|').replaceAll('\n',' ');
let md = '# Backend route inventory\n\nGenerated from TypeScript AST; implementation evidence in inventory.json. Status PARTIAL means static inventory only, not full UI/DB proof. Prefix `/api/v1`, except health exclusions in setup-app.ts.\n\n| Module | Endpoint | Method | Actor / permission | Auth | Status | Evidence |\n|---|---|---|---|---|---|---|\n';
for (const r of routes) md += `| ${r.module} | ${r.route} | ${r.method} | ${cell(r.roles || r.permissions || 'All/public; inspect service')} | ${cell(r.guards || 'Public')} | PARTIAL | ${r.file}:${r.line} |\n`;
md += '\n# Client HTTP calls and route candidates\n\nEndpoint existence only; includes unused wrappers. Dynamic route composition requires manual review.\n\n| Client | File:line | Method | Path | Backend candidate |\n|---|---|---|---|---|\n';
for (const c of calls) md += `| ${c.repo} | ${c.file}:${c.line} | ${c.method} | ${c.route} | ${cell(c.matches.join(', ') || 'NO STATIC MATCH')} |\n`;
md += '\n# Backend client usage candidates\n\nStatic HTTP references; a wrapper does not prove UI usage.\n\n| Backend Endpoint | Web | Mobile | Recommendation |\n|---|---|---|---|\n';
for (const r of routes) { const key = r.method+' '+r.route; const used = repo => calls.filter(c=>c.repo===repo && c.matches.includes(key)).map(c=>c.file+':'+c.line).join(', '); md += `| ${key} | ${used('Frontend-FixHome') || 'No static call'} | ${used('Mobi-FixHome') || 'No static call'} | Trace page imports; see report |\n`; }
md += '\n# Mock/configuration search hits\n\nIncludes comments, animations, development configuration and test providers: a hit alone is not a defect.\n\n| File | Line | Evidence |\n|---|---|---|\n';
for(const h of hits) md += `| ${h.file} | ${h.line} | ${cell(h.text)} |\n`;
fs.writeFileSync(path.join(out,'INVENTORY.md'),md);
console.log(JSON.stringify({counts,routes:routes.length,calls:calls.length,unmatched:calls.filter(c=>!c.matches.length).map(c=>({file:c.file,line:c.line,method:c.method,route:c.route})),hits:hits.length},null,2));
