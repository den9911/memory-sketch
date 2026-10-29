import {cp, mkdir, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {join, relative} from 'node:path';
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? process.env.PAGES_REPO;
if(!repo || !/^[a-zA-Z0-9_.-]+$/.test(repo)) throw new Error('Set GITHUB_REPOSITORY or PAGES_REPO');
const base=`/${repo}/`,out='dist';
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});await cp('public',out,{recursive:true});
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const p=join(dir,entry.name);if(entry.isDirectory())await walk(p);else if(/\.(html|js|css)$/.test(p)){
 let s=await readFile(p,'utf8');
 if(relative(out,p).replaceAll("\\","/")==="shared/boot.js") s=s.replace("const path=location.pathname.endsWith('/')?`${location.pathname}index.html`:location.pathname;",`const raw=location.pathname.slice(${base.length-1}); const path=raw.endsWith('/')?raw+'index.html':raw;`);
 s=s.replace(/(["'`])\/(shared|locales|about|memory|papers|mischief|admin|assets)\//g,(_,quote,name)=>`${quote}${base}${name}/`);
 s=s.replace(/href="\/"/g,`href="${base}"`);
 await writeFile(p,s);
}}}
await walk(out);await writeFile(join(out,'.nojekyll'),'');
console.log(`Pages build at ${base}`);
