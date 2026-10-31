import {saveBlob} from './transfer.js';
const $=s=>document.querySelector(s),token=location.hash.slice(1);let blob,path,url;
if(!/^[\da-f-]{36}$/i.test(token)){$('#message').textContent='Missing launch session. Open this page using the launcher.';$('#progress').hidden=true;$('#cancel').hidden=true;}else{
 const channel=new BroadcastChannel('astrax-'+token);channel.onmessage=event=>{const d=event.data;if(d.type==='info'){$('#name').textContent=d.entry.path;$('#source').textContent=`Expected size: ${d.entry.size.toLocaleString()} bytes. Fetching and validating in the launcher…`;}
 if(d.type==='progress'){$('#progress').max=d.total;$('#progress').value=d.n;$('#message').textContent=`Fetching ${d.n.toLocaleString()} / ${d.total.toLocaleString()} bytes`; }
 if(d.type==='state'){$('#message').textContent=d.state+' — game not executed';}
 if(d.type==='ready'){blob=d.blob;path=d.path;$('#message').textContent='Ready — HTML and byte count validated; upstream files also passed Git blob SHA-1 verification. Game has not run.';$('#progress').hidden=true;$('#start').hidden=false;$('#save').hidden=false;$('#cancel').hidden=true;channel.close();}
 if(d.type==='error'){$('#message').textContent='Preparation failed: '+d.text;$('#progress').hidden=true;$('#cancel').hidden=true;channel.close();}};
 channel.postMessage({type:'hello'});$('#cancel').onclick=()=>{channel.postMessage({type:'cancel'});$('#message').textContent='Cancellation requested.';};
 $('#save').onclick=()=>saveBlob(blob,path);$('#start').onclick=()=>{if(!blob)return;if(!confirm('Execute this third-party HTML? It can access this origin’s storage. Export important worlds first.'))return;url=URL.createObjectURL(blob);$('#message').textContent='Opening document — game readiness is not verified.';location.assign(url);};
 // Keep the Blob URL alive through navigation. Revoking it during unload can break loading.
}
