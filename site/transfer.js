export const LIMIT=160*1024*1024;
export const encodePath=path=>path.split('/').map(encodeURIComponent).join('/');
export const sourceURL=(commit,path)=>`https://raw.githubusercontent.com/UserArham/version/${commit}/${encodePath(path)}`;
export async function validate(bytes,entry){
 if(bytes.byteLength>LIMIT)throw Error('File exceeds the 160 MiB browser ceiling. Use mirror.py.');
 if(entry.size!==undefined&&bytes.byteLength!==entry.size)throw Error(`Unexpected size: ${bytes.byteLength}, expected ${entry.size}`);
 const head=new TextDecoder().decode(bytes.slice(0,8192)).trimStart();
 if(head.startsWith('version https://git-lfs.github.com/spec'))throw Error('Git LFS pointer, not game bytes');
 if(!/(<!doctype\s+html|<html[\s>])/i.test(head))throw Error('Invalid HTML signature / possible error page');
 if(entry.sha){
  if(!globalThis.crypto?.subtle)throw Error('Integrity verification requires HTTPS or localhost.');
  const prefix=new TextEncoder().encode(`blob ${bytes.byteLength}\0`),all=new Uint8Array(prefix.length+bytes.byteLength);all.set(prefix);all.set(bytes,prefix.length);
  const sha=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-1',all)),b=>b.toString(16).padStart(2,'0')).join('');
  if(sha!==entry.sha)throw Error('Git blob SHA-1 mismatch');
 }
 return new Blob([bytes],{type:'text/html'});
}
export async function fetchGame(entry,commit,signal,progress,state,urlOverride,compression){
 if(entry.size>LIMIT)throw Error('File too large for browser preparation; use mirror.py.');
 state('fetching');let response;
 try{response=await fetch(urlOverride||sourceURL(commit,entry.path),{signal});}catch(e){if(e.name==='AbortError')throw e;throw Error('Network or CORS failure: '+e.message);}
 if(!response.ok)throw Error(`Upstream HTTP ${response.status}`);
 const type=response.headers.get('content-type')||'';
 if(!/text\/|application\/octet-stream|application\/xhtml/i.test(type)&&!(compression==='gzip'&&/application\/(gzip|x-gzip)/i.test(type)))throw Error('Unexpected MIME: '+type);
 if(compression==='gzip'){if(typeof DecompressionStream!=='function')throw Error('This browser cannot decompress hosted games. Choose a browser supporting DecompressionStream.');if(!response.body)throw Error('Compressed response has no stream.');response=new Response(response.body.pipeThrough(new DecompressionStream('gzip')));}
 const chunks=[];let count=0;
 if(response.body){const reader=response.body.getReader();try{for(;;){const {done,value}=await reader.read();if(done)break;count+=value.length;if(count>LIMIT||count>entry.size){await reader.cancel();throw Error('Unexpected oversized response');}chunks.push(value);progress(count,entry.size);}}finally{reader.releaseLock();}}
 else{const v=new Uint8Array(await response.arrayBuffer());chunks.push(v);count=v.length;progress(count,entry.size);}
 signal.throwIfAborted();state('validating');const bytes=new Uint8Array(count);let offset=0;for(const c of chunks){bytes.set(c,offset);offset+=c.length;}chunks.length=0;
 const blob=await validate(bytes,entry);signal.throwIfAborted();state('ready');return blob;
}
export function saveBlob(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.rel='noopener';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);}

export function hostedURL(config,commit,path,base){
 if(!config.baseUrl)return sourceURL(commit,path);
 if(config.commit!==commit)throw Error('Hosted game revision does not match the pinned catalog.');
 if(config.files!==undefined&&(!Array.isArray(config.files)||!config.files.every(f=>typeof f==='string')))throw Error('Invalid hosted file allowlist.');
 if(config.compression!==undefined&&!['gzip','none'].includes(config.compression))throw Error('Invalid host compression.');
 const root=new URL(config.baseUrl,base);if(!['http:','https:'].includes(root.protocol)||root.username||root.password||root.search||root.hash)throw Error('Invalid game hosting URL.');
 if(config.files&&!config.files.includes(path))return sourceURL(commit,path);
 if(!root.pathname.endsWith('/'))root.pathname+='/';return new URL(encodePath(path)+(config.compression==='gzip'?'.gz':''),root).href;
}

export function hostedCompression(config,path){return config.baseUrl&&config.compression==='gzip'&&(!config.files||config.files.includes(path))?'gzip':undefined;}
