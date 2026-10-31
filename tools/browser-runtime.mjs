// Browser tests only. Extract Linux libraries supplied by the locked Chromium package.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';import {brotliDecompressSync} from 'node:zlib';import {execFileSync} from 'node:child_process';import chromium from '@sparticuz/chromium';
export async function options(){
 if(process.env.PLAYWRIGHT_EXECUTABLE_PATH)return {executablePath:process.env.PLAYWRIGHT_EXECUTABLE_PATH,headless:true};
 if(process.platform!=='linux'||process.arch!=='x64')throw Error('Set PLAYWRIGHT_EXECUTABLE_PATH to a local Chromium on non-Linux-x64 systems.');
 const target='/tmp/astrax-browser-libs';mkdirSync(target,{recursive:true});writeFileSync(target+'/libs.tar',brotliDecompressSync(readFileSync(new URL('../node_modules/@sparticuz/chromium/bin/al2023.tar.br',import.meta.url))));execFileSync('tar',['-xf',target+'/libs.tar','-C',target]);
 return {executablePath:await chromium.executablePath(),headless:true,env:{...process.env,LD_LIBRARY_PATH:target+'/lib'+(process.env.LD_LIBRARY_PATH?':'+process.env.LD_LIBRARY_PATH:'')},args:['--no-sandbox','--disable-dev-shm-usage','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
}
