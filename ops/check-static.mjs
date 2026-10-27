import { readdir, readFile, stat } from 'node:fs/promises';
import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { resolve } from 'node:path';
import { gzipSync } from 'node:zlib';
const exec=promisify(execFile);
async function walk(dir){const paths=[];for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())paths.push(...await walk(path));else paths.push(path);}return paths;}
const files=await walk('public');let raw=0,gzip=0;
for(const file of files){const data=await readFile(file);raw+=data.length;gzip+=gzipSync(data).length;
  if(file.endsWith('.js'))await exec(process.execPath,['--check',file]);
  if(file.endsWith('.html'))for(const match of data.toString().matchAll(/(?:src|href)="(\/[^"?#]*)"/g)){let p=resolve('public',`.${match[1]}`);if(match[1].endsWith('/'))p=resolve(p,'index.html');await stat(p);}
}
if(gzip>40000)throw new Error(`Static project exceeds 40 KB gzip budget: ${gzip}`);
console.log(JSON.stringify({files:files.length,publicBytes:raw,publicGzipBytes:gzip},null,2));
