/** Interaction-only motion: no timers, endless animation loops or game-time background work. */
export function installMotion({onSearch}){
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 reduced.addEventListener('change',()=>{if(reduced.matches)document.querySelectorAll('.click-ripple').forEach(n=>n.remove());});
 document.addEventListener('click',event=>{
  if(reduced.matches)return;
  const target=event.target.closest('button');if(!target||target.disabled)return;
  const rect=target.getBoundingClientRect(),ripple=document.createElement('span');ripple.className='click-ripple';ripple.setAttribute('aria-hidden','true');
  const radius=Math.max(rect.width,rect.height)*2;ripple.style.width=ripple.style.height=radius+'px';ripple.style.left=(event.detail?event.clientX-rect.left:rect.width/2)+'px';ripple.style.top=(event.detail?event.clientY-rect.top:rect.height/2)+'px';target.append(ripple);
  const motion=ripple.animate([{opacity:.25,transform:'translate(-50%,-50%) scale(0)'},{opacity:0,transform:'translate(-50%,-50%) scale(1)'}],{duration:620,easing:'cubic-bezier(.16,1,.3,1)'});motion.onfinish=()=>ripple.remove();
 });
 document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();onSearch();}});
 // Parallax follows deliberate pointer movement only; it never runs on touch or in the background.
 document.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType!=='mouse')return;const visual=event.target.closest('.orbit-visual');if(!visual)return;const rect=visual.getBoundingClientRect();visual.style.setProperty('--tilt-x',((event.clientY-rect.top)/rect.height-.5)*-10+'deg');visual.style.setProperty('--tilt-y',((event.clientX-rect.left)/rect.width-.5)*12+'deg');});
 document.addEventListener('pointerout',event=>{const visual=event.target.closest('.orbit-visual');if(visual&&!visual.contains(event.relatedTarget)){visual.style.setProperty('--tilt-x','0deg');visual.style.setProperty('--tilt-y','0deg');}});
}
