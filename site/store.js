export const defaults={schema:1,name:'Player',theme:'Default',scale:1,mode:'Blob',scanlines:true,selected:null,favorites:[],servers:[]};
export const themes=['Default','Green','Blue','Orange','All Red','All Green','All Blue','All Orange','Ash','Light'];
export function clean(value){
 const v=value&&typeof value==='object'?value:{};
 return {...defaults,name:typeof v.name==='string'?v.name.slice(0,32):defaults.name,theme:themes.includes(v.theme)?v.theme:'Default',scale:[.75,1,1.25,1.5].includes(v.scale)?v.scale:1,mode:['Blob','Popup'].includes(v.mode)?v.mode:'Blob',scanlines:typeof v.scanlines==='boolean'?v.scanlines:true,selected:typeof v.selected==='string'?v.selected:null,favorites:Array.isArray(v.favorites)?v.favorites.filter(x=>typeof x==='string').slice(0,1000):[],servers:Array.isArray(v.servers)?v.servers.filter(x=>x&&typeof x.name==='string'&&typeof x.address==='string').flatMap(x=>{try{return [{name:x.name.slice(0,64),address:serverAddress(x.address)}];}catch{return [];}}).slice(0,100):[]};
}
export function serverAddress(value){const u=new URL(value.trim());if(!['ws:','wss:'].includes(u.protocol)||u.username||u.password||u.hash||!u.hostname)throw Error('Use ws:// or wss:// without credentials or fragments.');return u.href;}
export function load(){try{return {value:clean(JSON.parse(localStorage.getItem('astrax-v1'))),temporary:false};}catch{return {value:clean(null),temporary:true};}}
export function persist(value){try{localStorage.setItem('astrax-v1',JSON.stringify(value));return true;}catch{return false;}}
