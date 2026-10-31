/** Small spring-based transitions; no continuous global animation loop. */
export function installMotion({onSearch}){
 const visibility=()=>document.body.classList.toggle('tab-hidden',document.hidden);document.addEventListener('visibilitychange',visibility);visibility();
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const spring=[{transform:'scale(.985)',opacity:.8},{transform:'scale(1.008)',opacity:1,offset:.65},{transform:'scale(1)',opacity:1}];
 document.addEventListener('keydown',e=>{if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();onSearch();}});
 document.addEventListener('click',e=>{if(reduced.matches)return;const target=e.target.closest('button');if(!target||target.disabled||!target.isConnected)return;target.animate(spring,{duration:300,easing:'cubic-bezier(.2,.7,.3,1)'});});
 // A refractive highlight follows a pointer only while hovering a glass card.
 document.addEventListener('pointermove',e=>{if(reduced.matches||e.pointerType!=='mouse')return;const panel=e.target.closest('.glass-panel');if(!panel)return;const r=panel.getBoundingClientRect();panel.style.setProperty('--light-x',((e.clientX-r.left)/r.width*100).toFixed(1)+'%');panel.style.setProperty('--light-y',((e.clientY-r.top)/r.height*100).toFixed(1)+'%');});
 document.addEventListener('pointerout',e=>{const panel=e.target.closest('.glass-panel');if(panel&&!panel.contains(e.relatedTarget)){panel.style.removeProperty('--light-x');panel.style.removeProperty('--light-y');}});
 reduced.addEventListener('change',()=>{if(reduced.matches)document.getAnimations().forEach(a=>a.cancel());});
}
