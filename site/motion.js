/** Dusk motion: interruptible, dependency-free, and independent of launcher orchestration. */
// Sample a damped physical spring once, then let WAAPI interpolate on the compositor.
// 60fps public SwiftUI spring/press model, implemented independently in native JS.
export function springFrames(make){const omega=23,zeta=.88,duration=.34,w=omega*Math.sqrt(1-zeta*zeta);return Array.from({length:25},(_,i)=>{const x=i/24,t=x*duration,value=i===24?1:1-Math.exp(-zeta*omega*t)*(Math.cos(w*t)+zeta*omega/w*Math.sin(w*t));return {...make(value),offset:x};});}
const ease = 'cubic-bezier(.22,1,.36,1)';
const snappy = 'cubic-bezier(.16,1,.3,1)';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const running = new Map();
const popovers = new WeakMap();
let preference = 'Standard';
let pendingPage = null;
let pageSerial = 0;
let toastSerial = 0;
let toastTimer;
let highlight;
let activeNav;
const progressTracks = new WeakMap();
export const motionEnabled = () => !reduced.matches && preference !== 'Off';
const ms = duration => duration * (preference === 'Subtle' ? .65 : 1);

function cancel(node, slot) {
  const slots = running.get(node);
  slots?.get(slot)?.cancel();
  slots?.delete(slot);
  if (slots && !slots.size) running.delete(node);
}
function animate(node, slot, frames, duration, delay = 0) {
  if (!node) return null;
  cancel(node, slot);
  if (!motionEnabled() || !node.isConnected) return null;
  const animation = node.animate(frames, {duration:ms(duration), delay:ms(delay), easing:frames.length>3?'linear':ease, fill:'both'});
  let slots = running.get(node);
  if (!slots) running.set(node, slots = new Map());
  slots.set(slot, animation);
  animation.finished.then(() => {
    if (running.get(node)?.get(slot) === animation) cancel(node, slot);
  }).catch(() => {});
  return animation;
}
const settled = animation => animation ? animation.finished.catch(() => {}) : Promise.resolve();
function arrive(node, delay = 0, duration = 360, distance = 8) {
  distance *= preference === 'Subtle' ? .65 : 1;
  return animate(node, 'entrance', [{opacity:0, translate:`0 ${distance}px`}, {opacity:1, translate:'0 0'}], duration, delay);
}
export function setMotionPreference(value) {
  preference = ['Standard','Subtle','Off'].includes(value) ? value : 'Standard';
  document.documentElement.dataset.motion = !motionEnabled() ? 'off' : preference.toLowerCase();
  if (!motionEnabled()) {
    for (const slots of running.values()) for (const a of slots.values()) a.cancel();
    running.clear();
    pendingPage?.commit();
    document.querySelectorAll('.is-pressed').forEach(n => n.classList.remove('is-pressed'));
  }
}
reduced.addEventListener('change', () => setMotionPreference(preference));

export function enterPage(content, {startup = false} = {}) {
  const home = content.querySelector('.quiet-home');
  if (home) {
    const sequence = [home.querySelector('.craft-brand'), home.querySelector('.quiet-eyebrow'), ...home.querySelectorAll('.hero-line'), home.querySelector('.quiet-intro > p'), home.querySelector('.play-card'), home.querySelector('.play-disclosure')];
    sequence.forEach((node, i) => arrive(node, i * (startup ? 42 : 28), startup ? 500 : 330, startup ? 12 : 7));
    return;
  }
  // Animate containers, never the 140 rows inside a long library.
  const root = content.firstElementChild;
  if (!root) return;
  const children = [...root.children].slice(0, 6);
  children.forEach((node, i) => arrive(node, Math.min(i * 38, 150), 340, 7));
}
export function transitionPage(content, render, {initial = false} = {}) {
  const serial = ++pageSerial;
  let committed = false;
  const currentStyle=getComputedStyle(content);
  const exitFrom={opacity:currentStyle.opacity,translate:currentStyle.translate==='none'?'0 0':currentStyle.translate};
  cancel(content, 'page');
  const restoreHeading = content.contains(document.activeElement);
  const commit = () => {
    if (serial !== pageSerial || committed) return;
    committed = true;
    pendingPage = null;
    content.inert = false;
    cancel(content, 'page');
    render();
    if (!initial) enterPage(content);
    if (restoreHeading) {
      const heading = content.querySelector('h1');
      if (heading) { heading.tabIndex = -1; heading.focus({preventScroll:true}); }
    }
  };
  if (initial || !content.firstElementChild || !motionEnabled()) { commit(); return; }
  pendingPage = {commit};
  content.inert = true;
  const exit = animate(content, 'page', [exitFrom, {opacity:0, translate:'0 -5px'}], 110);
  settled(exit).then(commit);
}
export function revealStartup(shell, boot) {
  shell.inert = false;
  shell.setAttribute('aria-busy','false');
  boot.classList.add('is-leaving');
  boot.inert = true;
  // Controls become usable immediately: the exit and coordinated reveal never gate loading.
  animate(shell, 'startup', [{opacity:.65, translate:'0 5px'}, {opacity:1, translate:'0 0'}], 580);
  arrive(shell.querySelector('aside'), 30, 500, 6);
  arrive(shell.querySelector('.launchbar'), 110, 500, 8);
  enterPage(shell.querySelector('#content'), {startup:true});
  const focusedBoot = boot.contains(document.activeElement);
  settled(animate(boot.querySelector('.boot-card'), 'exit', [{opacity:1, scale:1}, {opacity:0, scale:.97}], 190)).then(() => boot.remove());
  animate(boot, 'exit', [{opacity:1}, {opacity:0}], 210);
  if (!motionEnabled()) boot.remove();
  if (focusedBoot) shell.querySelector('.navrow.active')?.focus({preventScroll:true});
}

export function isPopoverOpen(panel) { return popovers.get(panel)?.open === true; }
export function fitPicker(panel) {
  if (!isPopoverOpen(panel)) return;
  const viewport = window.visualViewport;
  const top = (viewport?.offsetTop || 0) + 12;
  const bottom = (viewport?.offsetTop || 0) + (viewport?.height || innerHeight) - 12;
  const parent = panel.offsetParent;
  const anchor = document.querySelector('#version');
  if (!parent || !anchor) return;
  const bounds = parent.getBoundingClientRect();
  const edge = Math.min(anchor.getBoundingClientRect().top - 10, bottom);
  const panelBounds=panel.getBoundingClientRect(),anchorBounds=anchor.getBoundingClientRect();panel.style.transformOrigin=`${Math.max(10,Math.min(90,(anchorBounds.left+anchorBounds.width/2-panelBounds.left)/Math.max(1,panelBounds.width)*100))}% 100%`;
  panel.style.bottom = `${Math.max(12, bounds.bottom - edge)}px`;
  panel.style.maxHeight = `${Math.max(90, Math.min(580, edge - Math.max(top, bounds.top + 8)))}px`;
}
export function showPicker(panel, open) {
  const old = popovers.get(panel);
  const serial = (old?.serial || 0) + 1;
  const style=getComputedStyle(panel);
  const changing=running.get(panel)?.has('popover');
  const from=changing?{opacity:style.opacity,translate:style.translate==='none'?'0 0':style.translate,scale:style.scale==='none'?'1':style.scale}:null;
  popovers.set(panel, {open, serial});
  cancel(panel, 'popover');
  if (open) {
    panel.hidden = false;
    panel.inert = false;
    panel.style.pointerEvents = '';
    panel.dataset.state = 'open';
    fitPicker(panel);
    animate(panel, 'popover', from?[from,{opacity:1,translate:'0 0',scale:1}]:springFrames(t=>({opacity:Math.max(0,Math.min(1,t)),translate:`0 ${9*(1-t)}px`,scale:.985+.015*t})), 300);
    [panel.querySelector('.picker-head'), panel.querySelector('#search'), panel.querySelector('.filters')].forEach((n, i) => arrive(n, 25 + i*24, 220, 4));
  } else {
    panel.dataset.state = 'closed';
    panel.inert = true;
    panel.style.pointerEvents = 'none';
    if (panel.hidden) return;
    const exit = animate(panel, 'popover', [from||{opacity:1, translate:'0 0', scale:1}, {opacity:0, translate:'0 6px', scale:.99}], 175);
    settled(exit).then(() => {
      const current = popovers.get(panel);
      if (!current.open && current.serial === serial) panel.hidden = true;
    });
    if (!motionEnabled()) panel.hidden = true;
  }
}

export function moveNavigation(target, immediate = false) {
  activeNav = target;
  if (!target || !highlight) return;
  const aside = target.closest('aside');
  const box = aside.getBoundingClientRect();
  const bounds = target.getBoundingClientRect();
  // Press scale must not shrink or displace the persistent active backdrop.
  const width=target.offsetWidth,height=target.offsetHeight;
  const left=bounds.left+(bounds.width-width)/2,top=bounds.top+(bounds.height-height)/2;
  const row={left,top,width,height,bottom:top+height};
  const nav = target.closest('nav');
  if (nav) {
    const clip = nav.getBoundingClientRect();
    if (row.top < clip.top || row.bottom > clip.bottom || row.left < clip.left || row.left+row.width > clip.right) { highlight.hidden = true; return; }
  }
  const previous = highlight.hidden ? null : highlight.getBoundingClientRect();
  cancel(highlight, 'nav');
  highlight.hidden = false;
  Object.assign(highlight.style, {left:`${row.left-box.left-1}px`, top:`${row.top-box.top-1}px`, width:`${row.width}px`, height:`${row.height}px`});
  if (previous && !immediate) animate(highlight, 'nav', springFrames(t=>({transform:`translate(${(previous.left-row.left)*(1-t)}px,${(previous.top-row.top)*(1-t)}px) scale(${1+(previous.width/row.width-1)*(1-t)},${1+(previous.height/row.height-1)*(1-t)})`})), 340);
}
export function selectionFeedback(nodes, card) {
  nodes.filter(Boolean).forEach((n, i) => animate(n, 'selection', [{opacity:.5, translate:'0 4px'}, {opacity:1, translate:'0 0'}], 240, i*15));
  if (card) {
    const border = getComputedStyle(card).borderColor;
    const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    animate(card, 'confirmation', [{borderColor:border}, {borderColor:accent, offset:.3}, {borderColor:border}], 440);
  }
}
export function favoriteFeedback(star, enabled) {
  animate(star, 'favorite', [{scale:.84}, {scale:enabled?1.065:1.02, offset:.65}, {scale:1}], 280);
}
export function showToast(node, message, lifetime = 6000) {
  const serial = ++toastSerial;
  const visible = !node.hidden;
  const style = getComputedStyle(node);
  const from = visible ? {opacity:style.opacity,translate:style.translate==='none'?'0 0':style.translate,scale:style.scale==='none'?'1':style.scale} : {opacity:0,translate:'10px 0',scale:.985};
  clearTimeout(toastTimer);
  cancel(node, 'toast');
  node.textContent = message;
  node.hidden = false;
  node.inert = false;
  node.style.pointerEvents = '';
  animate(node, 'toast', [from, {opacity:1, translate:'0 0', scale:1}], visible ? 180 : 290);
  toastTimer = setTimeout(() => dismissToast(node, serial), lifetime);
}
export function dismissToast(node, serial = toastSerial) {
  if (serial !== toastSerial || node.hidden) return;
  node.inert = true;
  node.style.pointerEvents = 'none';
  settled(animate(node, 'toast', [{opacity:1, translate:'0 0'}, {opacity:0, translate:'7px 0'}], 180)).then(() => {
    if (serial === toastSerial) node.hidden = true;
  });
}
export function outcome(node, state) {
  node.dataset.outcome = state;
  if (state === 'success') animate(node, 'outcome', [{opacity:.86}, {opacity:1}], 260);
}
export function measuredProgress(progress, received = 0, total = 0) {
  if (!progress) return;
  let track = progressTracks.get(progress);
  if (!track) {
    track = document.createElement('div');
    track.className = 'measured-track';
    track.setAttribute('aria-hidden','true');
    track.append(document.createElement('span'));
    progress.classList.add('progress-accessible');
    if (!progress.hasAttribute('aria-label')) progress.setAttribute('aria-label','Bytes received');
    progress.after(track);
    progressTracks.set(progress, track);
  }
  if (total > 0) {
    progress.max = total;
    progress.value = Math.min(total, Math.max(0, received));
    track.classList.remove('indeterminate');
    track.firstElementChild.style.transform = `scaleX(${progress.value/total})`;
  } else {
    progress.removeAttribute('value');
    track.classList.add('indeterminate');
  }
}

export function progressPhase(progress,state,total=0) {
  if(state==='validating') { measuredProgress(progress);progress.setAttribute('aria-label','Checking game file integrity'); }
  else { progress.setAttribute('aria-label','Game file bytes received');if(state==='ready')measuredProgress(progress,total,total); }
}

export function installMotion({onSearch} = {}) {
  document.body.classList.add('motion-ready');
  setMotionPreference(preference);
  const aside = document.querySelector('aside');
  if (aside) {
    highlight = document.createElement('div');
    highlight.id = 'navHighlight';
    highlight.hidden = true;
    highlight.setAttribute('aria-hidden','true');
    aside.append(highlight);
    document.querySelector('#nav')?.addEventListener('scroll', () => moveNavigation(activeNav, true), {passive:true});
    new ResizeObserver(() => moveNavigation(activeNav, true)).observe(aside);
  }
  const visibility = () => document.body.classList.toggle('tab-hidden', document.hidden);
  document.addEventListener('visibilitychange', visibility);
  visibility();
  const pressed = new Set();
  const release = button => { button?.classList.remove('is-pressed'); pressed.delete(button); };
  const releaseAll = () => { for (const b of pressed) {b.classList.remove('is-pressed');if(b.isConnected&&motionEnabled())animate(b,'release',springFrames(t=>({scale:String(.985+.015*t)})),340);} pressed.clear(); };
  document.addEventListener('pointerdown', e => {
    if (e.button !== 0) return;
    const button = e.target.closest('button');
    if (!button || button.disabled || !motionEnabled()) return;
    cancel(button,'release');button.classList.add('is-pressed'); pressed.add(button);
  }, true);
  document.addEventListener('pointerup', releaseAll, true);
  document.addEventListener('pointercancel', releaseAll, true);
  window.addEventListener('blur', releaseAll);
  document.addEventListener('keydown', e => {
    if (onSearch && (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); onSearch(); }
    if ((e.key==='Enter'||e.key===' ') && !e.repeat && motionEnabled()) {
      const button = e.target.closest('button');
      if (button && !button.disabled) { cancel(button,'release');button.classList.add('is-pressed'); pressed.add(button); }
    }
  });
  document.addEventListener('keyup', e => { if (e.key==='Enter'||e.key===' ') releaseAll(); });
  let tip,tipAnchor,previousDescription;
  const hideTip=()=>{if(tipAnchor){if(previousDescription===null)tipAnchor.removeAttribute('aria-describedby');else tipAnchor.setAttribute('aria-describedby',previousDescription);tipAnchor=null;}if(tip){cancel(tip,'tooltip');tip.hidden=true;}};
  const showTip=anchor=>{if(!anchor||anchor.disabled||anchor===tipAnchor)return;hideTip();if(!tip){tip=document.createElement('div');tip.id='launcherTooltip';tip.setAttribute('role','tooltip');document.body.append(tip);}tipAnchor=anchor;previousDescription=anchor.getAttribute('aria-describedby');tip.textContent=anchor.dataset.hint;tip.hidden=false;anchor.setAttribute('aria-describedby',[previousDescription,tip.id].filter(Boolean).join(' '));const rect=anchor.getBoundingClientRect(),bounds=tip.getBoundingClientRect();tip.style.left=`${Math.max(12,Math.min(innerWidth-bounds.width-12,rect.left+rect.width/2-bounds.width/2))}px`;tip.style.top=`${Math.max(12,rect.top-bounds.height-8)}px`;animate(tip,'tooltip',[{opacity:0,translate:'0 4px'},{opacity:1,translate:'0 0'}],170);};
  document.addEventListener('pointerover',e=>showTip(e.target.closest('[data-hint]')));
  document.addEventListener('pointerout',e=>{if(tipAnchor&&!tipAnchor.contains(e.relatedTarget))hideTip();});
  document.addEventListener('focusin',e=>showTip(e.target.closest('[data-hint]')));
  document.addEventListener('focusout',hideTip);document.addEventListener('click',hideTip);document.addEventListener('pointerdown',hideTip,true);
  document.addEventListener('keydown',e=>{if(e.key==='Escape')hideTip();});window.addEventListener('resize',hideTip);document.querySelector('#content')?.addEventListener('scroll',hideTip,{passive:true});
  // A short interpolation loop exists only while a pointer is moving or settling.
  let frame = 0;
  let lighting = null;
  const settleLight = () => {
    frame = 0;
    if (!lighting || !lighting.panel.isConnected || !motionEnabled() || document.hidden || document.body.matches('.game-session,.is-preparing')) { lighting=null; return; }
    const l = lighting;
    l.x += (l.toX-l.x)*.18; l.y += (l.toY-l.y)*.18;
    l.panel.style.setProperty('--light-x', `${l.x.toFixed(2)}%`);
    l.panel.style.setProperty('--light-y', `${l.y.toFixed(2)}%`);
    if (Math.abs(l.x-l.toX)+Math.abs(l.y-l.toY)>.12) frame=requestAnimationFrame(settleLight);
    else lighting=null;
  };
  document.addEventListener('pointermove', e => {
    for (const button of pressed) if (!button.contains(e.target)) release(button);
    if (!motionEnabled() || e.pointerType!=='mouse' || document.hidden || document.body.matches('.game-session,.is-preparing')) return;
    const panel=e.target.closest('.play-card,.launchbar,.character-workspace,.profile-panel,.profile-dialog');
    if (!panel) return;
    const rect=panel.getBoundingClientRect();
    if (lighting?.panel!==panel) lighting={panel,x:25,y:0,toX:25,toY:0};
    lighting.toX=(e.clientX-rect.left)/rect.width*100; lighting.toY=(e.clientY-rect.top)/rect.height*100;
    if (!frame) frame=requestAnimationFrame(settleLight);
  });
  document.addEventListener('pointerout', e => {
    const panel=e.target.closest('.play-card,.launchbar,.character-workspace,.profile-panel,.profile-dialog');
    if (panel && !panel.contains(e.relatedTarget) && motionEnabled()) {
      if (lighting?.panel!==panel) lighting={panel,x:50,y:30,toX:25,toY:0};
      lighting.toX=25; lighting.toY=0;
      if (!frame) frame=requestAnimationFrame(settleLight);
    }
  });
  const resize = () => { moveNavigation(activeNav, true); const picker=document.querySelector('#picker'); if (picker) fitPicker(picker); };
  window.addEventListener('resize', resize, {passive:true});
  window.visualViewport?.addEventListener('resize', resize, {passive:true});
  window.visualViewport?.addEventListener('scroll', resize, {passive:true});
}
