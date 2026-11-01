/** Genuine bundled Tiny Takeover, licensed classic screenshot or local six-face panorama. */
const modes=['Minecraft Overworld','Original Dusk Aurora','Static Minecraft Scene','Background Off','Imported Panorama','Tiny Takeover (26.1)'];
const tinyStatus='Tiny Takeover · genuine Minecraft Java 26.1 panorama · Mojang / Microsoft';
const isCubemap=()=>selection===modes[4]||selection===modes[5];let bundledFaces;
async function readBundled(){if(!bundledFaces)bundledFaces=Promise.all(Array.from({length:6},async(_,i)=>{const r=await fetch(`assets/tiny-takeover/panorama_${i}.png`);if(!r.ok)throw Error('Tiny Takeover face '+i+' HTTP '+r.status);return r.blob();})).catch(e=>{bundledFaces=null;throw e;});return bundledFaces;}
const photoStatus='Real Minecraft screenshot · Xbox México · CC BY 3.0. Not Tiny Takeover.';
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let uniforms,importSerial=0;
let selection=modes[0],animated=true,canvas,gl,program,textures=[],raf=0,last=0,angle=0,frames=0,serial=0,initialized=false,failed=false,imported=false,assetText=photoStatus;
const notices=new Set();
const tell=text=>{assetText=text;for(const fn of notices)fn(text);};
export function subscribeBackground(fn){notices.add(fn);fn(assetText);return()=>notices.delete(fn);}
export const backgroundModes=modes;
const openDB=()=>new Promise((resolve,reject)=>{
 if(!window.indexedDB)return reject(Error('Local panorama storage is unavailable.'));
 let settled=false;const timer=setTimeout(()=>{settled=true;reject(Error('Panorama storage timed out.'));},3000);
 let r;try{r=indexedDB.open('astrax-panorama',1);}catch(error){clearTimeout(timer);reject(error);return;}
 r.onupgradeneeded=()=>r.result.createObjectStore('faces');
 r.onsuccess=()=>{clearTimeout(timer);if(settled){r.result.close();return;}settled=true;resolve(r.result);};
 r.onerror=()=>{clearTimeout(timer);settled=true;reject(r.error);};
 r.onblocked=()=>{clearTimeout(timer);settled=true;reject(Error('Close other launcher tabs and retry panorama storage.'));};
});
async function readImported(){let db;try{db=await openDB();return await new Promise((resolve,reject)=>{const r=db.transaction('faces').objectStore('faces').get('current');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}catch{return null;}finally{db?.close();}}
async function storeImported(value,epoch){const db=await openDB();try{if(epoch!==importSerial)throw Error('Panorama change superseded by a newer action.');await new Promise((resolve,reject)=>{const t=db.transaction('faces','readwrite');value?t.objectStore('faces').put(value,'current'):t.objectStore('faces').delete('current');t.oncomplete=resolve;t.onerror=()=>reject(t.error);t.onabort=()=>reject(t.error||Error('Could not save panorama.'));});}finally{db.close();}}
async function decode(blob){const url=URL.createObjectURL(blob);try{const image=new Image();image.src=url;await image.decode();return image;}finally{URL.revokeObjectURL(url);}}
export async function importPanorama(files){
 const epoch=++importSerial;
 if(files.length!==6)throw Error('Choose exactly six PNG files: panorama_0.png through panorama_5.png.');
 const ordered=Array(6);let total=0;
 for(const file of files){const match=/^panorama_([0-5])\.png$/i.exec(file.name);if(!match||ordered[+match[1]])throw Error('Each name panorama_0.png through panorama_5.png must appear exactly once.');total+=file.size;if(file.size>8*1024*1024||total>32*1024*1024)throw Error('Panorama exceeds the 8 MiB per-face / 32 MiB total limit.');const bytes=new Uint8Array(await file.slice(0,24).arrayBuffer());if(bytes.length<24||bytes.slice(0,8).join()!=='137,80,78,71,13,10,26,10')throw Error('All six faces must be PNG images.');const view=new DataView(bytes.buffer),width=view.getUint32(16),height=view.getUint32(20);if(width!==height||![256,512,768,1024,2048].includes(width))throw Error('Faces must be equal-size squares, 256, 512, 768, 1024 or 2048 pixels.');ordered[+match[1]]={blob:file,size:width};}
 if(new Set(ordered.map(f=>f.size)).size!==1)throw Error('All six panorama faces must have the same dimensions.');
 // Fully decode before replacing the saved set; corrupt uploads cannot displace a working panorama.
 for(const face of ordered)await decode(face.blob);
 await storeImported(ordered.map(f=>f.blob),epoch);if(epoch!==importSerial)return;
 if(selection===modes[4])invalidateTextures();imported=true;tell('Imported panorama · stored only on this browser. Asset rights remain yours to verify.');
 if(selection===modes[4])await loadSet(ordered.map(f=>f.blob),true);
}
function invalidateTextures(){++serial;stop();textures.forEach(t=>gl?.deleteTexture(t));textures=[];document.documentElement.dataset.panorama='fallback';}
export async function clearPanorama(){const epoch=++importSerial;await storeImported(null,epoch);if(epoch!==importSerial)return;imported=false;if(selection===modes[4]){invalidateTextures();tell(photoStatus);await loadSet(null,false);}else tell(selection===modes[5]?tinyStatus:photoStatus);}
function shader(type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){gl.deleteShader(s);throw Error('Panorama shader unsupported');}return s;}
function createRenderer(){
 if(initialized)return !!gl&&!gl.isContextLost();initialized=true;
 canvas=document.createElement('canvas');canvas.id='panorama';canvas.setAttribute('aria-hidden','true');canvas.setAttribute('role','presentation');document.body.prepend(canvas);
 canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();failed=true;stop();document.documentElement.dataset.panorama='fallback';tell('Graphics context lost · real Minecraft static fallback selected.');});
 canvas.addEventListener('webglcontextrestored',()=>{gl=null;program=null;textures=[];initialized=false;failed=false;canvas.remove();void activate();});
 try{
  gl=canvas.getContext('webgl',{alpha:false,antialias:false,depth:false,stencil:false,powerPreference:'low-power'});if(!gl)throw Error('WebGL unavailable');
  const vs=shader(gl.VERTEX_SHADER,'attribute vec2 position;varying vec2 v;void main(){v=position;gl_Position=vec4(position,0.,1.);}');
  const fs=shader(gl.FRAGMENT_SHADER,`precision mediump float;varying vec2 v;uniform float aspect;uniform float yaw;uniform float pitch;uniform sampler2D face0;uniform sampler2D face1;uniform sampler2D face2;uniform sampler2D face3;uniform sampler2D face4;uniform sampler2D face5;
  void main(){vec3 d=normalize(vec3(v.x*aspect*.916331,v.y*.916331,1.));float c=cos(pitch),s=sin(pitch);d=vec3(d.x,d.y*c-d.z*s,d.y*s+d.z*c);c=cos(yaw);s=sin(yaw);d=vec3(d.x*c+d.z*s,d.y,-d.x*s+d.z*c);vec3 a=abs(d);vec2 uv;vec4 color;
  if(a.z>=a.x&&a.z>=a.y){if(d.z>0.){uv=vec2(d.x,-d.y)/a.z*.5+.5;color=texture2D(face0,uv);}else{uv=vec2(-d.x,-d.y)/a.z*.5+.5;color=texture2D(face2,uv);}}
  else if(a.x>=a.y){if(d.x>0.){uv=vec2(-d.z,-d.y)/a.x*.5+.5;color=texture2D(face1,uv);}else{uv=vec2(d.z,-d.y)/a.x*.5+.5;color=texture2D(face3,uv);}}
  else{if(d.y>0.){uv=vec2(d.x,d.z)/a.y*.5+.5;color=texture2D(face4,uv);}else{uv=vec2(d.x,-d.z)/a.y*.5+.5;color=texture2D(face5,uv);}}gl_FragColor=vec4(color.rgb,1.);}`);
  program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw Error('Panorama linking failed');gl.useProgram(program);
  const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);const p=gl.getAttribLocation(program,'position');gl.enableVertexAttribArray(p);gl.vertexAttribPointer(p,2,gl.FLOAT,false,0,0);
  uniforms=Object.fromEntries(['aspect','yaw','pitch'].map(key=>[key,gl.getUniformLocation(program,key)]));
  for(let i=0;i<6;i++)gl.uniform1i(gl.getUniformLocation(program,`face${i}`),i);
  return true;
 }catch{failed=true;document.documentElement.dataset.panorama='fallback';tell('Panorama graphics unavailable · real Minecraft static fallback selected.');return false;}
}
async function loadSet(blobs,isImported){
 if(!blobs){invalidateTextures();tell(photoStatus);sync();return;}
 const token=++serial;if(!createRenderer())return;
 try{
  const images=await Promise.all(blobs.map(decode));
  if(token!==serial)return;
  const next=[];
  try{for(let i=0;i<6;i++){let image=images[i];const limit=Math.min(1024,gl.getParameter(gl.MAX_TEXTURE_SIZE));if(image.width>limit){const small=document.createElement('canvas');small.width=small.height=limit;const ctx=small.getContext('2d');ctx.imageSmoothingEnabled=false;ctx.drawImage(image,0,0,limit,limit);image=small;}const texture=gl.createTexture();next.push(texture);gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.NEAREST);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.NEAREST);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGB,gl.RGB,gl.UNSIGNED_BYTE,image);if(gl.getError()!==gl.NO_ERROR)throw Error('Texture upload failed');}}
  catch(error){next.forEach(t=>gl.deleteTexture(t));throw error;}
  textures.forEach(t=>gl.deleteTexture(t));textures=next;failed=false;imported=isImported;document.documentElement.dataset.panorama='ready';tell(isImported?'Imported panorama · stored only on this browser. Asset rights remain yours to verify.':selection===modes[5]?tinyStatus:photoStatus);draw();sync();
 }catch{
  if(token!==serial)return;
  if(blobs){tell('Imported faces could not load · using the real Minecraft static image.');await loadSet(null,false);}
  else{failed=true;stop();document.documentElement.dataset.panorama='fallback';tell('Panorama images could not load · real Minecraft static fallback selected.');}
 }
}
function dimensions(){const dpr=Math.min(devicePixelRatio||1,innerWidth<700?1:1.25),factor=Math.min(dpr,1600/innerWidth,1100/innerHeight);const w=Math.max(1,Math.round(innerWidth*factor)),h=Math.max(1,Math.round(innerHeight*factor));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;}gl.viewport(0,0,w,h);}
function draw(){if(!gl||failed||textures.length!==6||!isCubemap())return;dimensions();gl.useProgram(program);textures.forEach((t,i)=>{gl.activeTexture(gl.TEXTURE0+i);gl.bindTexture(gl.TEXTURE_2D,t);});gl.uniform1f(uniforms.aspect,innerWidth/innerHeight);gl.uniform1f(uniforms.yaw,angle);gl.uniform1f(uniforms.pitch,.1745329);gl.drawArrays(gl.TRIANGLES,0,6);canvas.dataset.frames=String(++frames);canvas.dataset.yaw=String(angle);}
function canMove(){return isCubemap()&&animated&&!reduced.matches&&!document.hidden&&!document.body.matches('.is-preparing,.game-session')&&textures.length===6&&!failed;}
function tick(now){raf=0;if(!canMove())return;const interval=1000/(innerWidth<700?24:30);if(now-last>=interval){const elapsed=last?Math.min(now-last,100):0;last=now;angle=(angle+elapsed*.00000523599)%(Math.PI*2);draw();}raf=requestAnimationFrame(tick);}
function stop(){cancelAnimationFrame(raf);raf=0;last=0;}
function sync(){const moving=animated&&!reduced.matches&&!document.hidden&&!document.body.matches('.is-preparing,.game-session')&&(selection===modes[0]||(isCubemap()&&(textures.length!==6||failed)));if(document.body.classList.contains('scene-moving')!==moving)document.body.classList.toggle('scene-moving',moving);if(canMove()){if(!raf)raf=requestAnimationFrame(tick);}else stop();}
async function activate(){if(!isCubemap()){++serial;sync();return;}if(textures.length===6&&!failed){draw();sync();return;}const token=serial;const wanted=selection;let saved;try{saved=selection===modes[5]?await readBundled():await readImported();}catch{if(token===serial){tell('Tiny Takeover could not load · static fallback active.');document.documentElement.dataset.panorama='fallback';sync();}return;}if(selection!==wanted||token!==serial)return;await loadSet(saved,selection===modes[4]&&!!saved);}
let installed=false;
export function setBackground(mode,motion){const previous=selection;selection=mode==='Tiny Takeover Panorama'?modes[4]:modes.includes(mode)?mode:modes[0];if(selection!==previous){invalidateTextures();tell(selection===modes[5]?'Loading genuine Tiny Takeover faces…':selection===modes[4]?'Loading local imported panorama…':photoStatus);}animated=motion!==false;document.documentElement.dataset.panoramaSource=selection===modes[5]?'tiny-takeover':'other';document.documentElement.dataset.background=isCubemap()?'panorama':selection===modes[0]?'photo':selection===modes[1]?'aurora':selection===modes[2]?'static':'off';if(!installed){installed=true;new MutationObserver(sync).observe(document.body,{attributes:true,attributeFilter:['class']});document.addEventListener('visibilitychange',sync);reduced.addEventListener('change',sync);window.addEventListener('resize',()=>{if(!document.hidden&&isCubemap())draw();},{passive:true});}sync();void activate();}
