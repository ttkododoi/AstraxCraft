import {installMotion,setMotionPreference,measuredProgress,progressPhase} from './motion.js?v=craft-24';
import {load} from './store.js?v=craft-24';
import {saveBlob} from './transfer.js?v=craft-24';
setMotionPreference(load().value.interfaceMotion);installMotion();
const $=s=>document.querySelector(s),token=location.hash.slice(1);let blob,path,url,autoStart=false,opening=false,expectedBytes=0;
function start(manual=false){
 if(!blob||opening)return;
 if(manual&&!confirm('Execute this third-party HTML? It can access this hosting origin’s storage. Export important worlds first.'))return;
 opening=true;const lifecycle=new BroadcastChannel('astrax-game-'+token);lifecycle.postMessage({type:'executing'});lifecycle.close();url=URL.createObjectURL(blob);$('#message').textContent='Validated. Opening game document…';location.replace(url);
 // Do not revoke during navigation: the document may still need the URL.
}
measuredProgress($('#progress'));
if(!/^[\da-f-]{36}$/i.test(token)){$('#message').textContent='Missing launch session. Open this page with Play in Astrax.';$('#progress').hidden=true;$('#cancel').hidden=true;}else{
 const channel=new BroadcastChannel('astrax-'+token);
 channel.onmessage=event=>{const d=event.data;
  if(d.type==='info'){autoStart=d.autoStart===true;expectedBytes=d.entry.size;measuredProgress($('#progress'),0,d.entry.size);$('#name').textContent=d.entry.path;$('#source').textContent=`Loading ${d.entry.size.toLocaleString()} bytes. No installation needed.`;}
  if(d.type==='progress'){measuredProgress($('#progress'),d.n,d.total);$('#message').textContent=`Loading ${d.n.toLocaleString()} / ${d.total.toLocaleString()} bytes`;}
  if(d.type==='state'){progressPhase($('#progress'),d.state,expectedBytes);$('#message').textContent=d.state==='validating'?'Checking file integrity…':d.state==='ready'?'File validated.':'Loading original game file…';}
  if(d.type==='ready'){blob=d.blob;path=d.path;$('#progress').hidden=true;$('#cancel').hidden=true;channel.close();if(autoStart){start();}else{$('#message').textContent='Ready — file validated. Game has not run.';$('#start').hidden=false;$('#save').hidden=false;}}
  if(d.type==='error'){$('#message').textContent='Could not load: '+d.text;$('#progress').hidden=true;$('#cancel').hidden=true;channel.close();}
 };
 channel.postMessage({type:'hello'});
 $('#cancel').onclick=()=>{channel.postMessage({type:'cancel'});$('#message').textContent='Canceling…';};
 $('#save').onclick=()=>saveBlob(blob,path);$('#start').onclick=()=>start(true);
}
