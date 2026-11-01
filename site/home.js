const views = new WeakMap();
const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const action=(label,cls,fn)=>{const b=node('button',cls,label);b.onclick=fn;return b;};
/** Stable home nodes: updating a selection never restarts the hero or replaces the card. */
export function createHome(options){
 const {onBrowse,onUpload}=options;
 const home=node('div','hero quiet-home orbit-home');
 const intro=node('div','quiet-intro'),heading=node('h1');
 const brand=node('div','craft-brand'),mark=node('img','craft-mark');mark.src='assets/craft-mark.svg';mark.alt='';mark.width=mark.height=40;brand.append(mark,node('span','craft-wordmark','ASTRAXCRAFT'));const splash=node('span','craft-splash','One more world!');brand.append(splash);
 heading.append(node('span','hero-line','Pick a world.'),document.createTextNode('\n'),node('span','hero-line','Make it yours.'));
 intro.append(brand,node('span','quiet-eyebrow','YOUR SPACE TO PLAY'),heading,node('p','','Your builds, your favorites, one simple launcher.'));
 const card=node('section','glass-panel play-card');
 const title=node('h2','home-current'),metadata=node('p','home-current-description');
 card.append(node('span','home-kicker','QUICK PLAY'),title,metadata);
 const play=action('Play','home-play',()=>views.get(home).options.onLaunch());play.setAttribute('aria-label','Play selected build');
 const actions=node('div','home-actions'),browse=action('Explore the library ↗','primary-action',()=>onBrowse(''));
 actions.append(play,browse,action('Import local HTML','secondary-action',onUpload));card.append(actions);
 const details=action('View selected source →','text-action',()=>{const state=views.get(home);if(state.options.selected)state.options.onDetails(state.options.selected);});
 details.hidden=true;card.append(details);
 const favorites=node('div','quiet-favorites');favorites.hidden=true;card.append(favorites);
 const menu=node('nav','home-menu');menu.setAttribute('aria-label','Launcher shortcuts');for(const [label,route,hint] of [['Versions',null,'Search all 140 original builds'],['Multiplayer','Servers','Saved server addresses; copy into a compatible game'],['Skins','Skins','Import and preview a local PNG texture'],['Settings','Launcher Settings','Appearance and launch preferences']]){const b=action(label,'menu-action',()=>route?views.get(home).options.onNavigate(route):views.get(home).options.onBrowse(''));b.dataset.hint=hint;menu.append(b);}
 const credit=node('p','scene-credit');credit.append(document.createTextNode('Scenes: Tiny Takeover © Mojang / Microsoft · '));const source=node('a','','26.1 source / credits');source.href='assets/tiny-takeover/CREDITS.md';source.target='_blank';source.rel='noopener';credit.append(source,document.createTextNode(' · Classic screenshot: Xbox México / CC BY 3.0'));

 home.append(intro,card,menu,credit,node('p','minecraft-disclaimer','Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.'),node('p','play-disclosure','Play runs third-party HTML. No installation required. Some games still need an in-game click for sound or controls.'));
 views.set(home,{options,title,metadata,browse,play,details,favorites,favoriteKey:''});
 updateHome(home,options);return home;
}
export function updateHome(home,options){
 const state=views.get(home);if(!state)return;
 state.options=options;state.play.disabled=!!options.busy||!options.selected||!!options.selected.utility;state.play.textContent=options.busy?'Preparing…':'Play';state.play.setAttribute('aria-busy',String(!!options.busy));const {selected,catalog,prefs,onSelect}=options;
 const label=selected?.label||'Choose your build.';
 const detail=selected?`${selected.runtime} · ${(selected.size/1048576).toFixed(2)} MiB`:'Choose a build. Play fetches and verifies the original HTML before opening it.';
 if(state.title.textContent!==label)state.title.textContent=label;
 if(state.metadata.textContent!==detail)state.metadata.textContent=detail;
 state.browse.textContent=selected?'Change build ↗':'Explore the library ↗';
 state.details.hidden=!selected;
 const entries=catalog.entries.filter(e=>prefs.favorites.includes(e.id)).slice(0,3);
 const key=entries.map(e=>e.id).join('|');
 if(key!==state.favoriteKey){
  state.favoriteKey=key;state.favorites.replaceChildren();state.favorites.hidden=!entries.length;
  if(entries.length)state.favorites.append(node('span','home-kicker','FAVORITES'));
  for(const entry of entries){const b=action(entry.label+' ↗','saved-build',()=>onSelect(entry));b.title=entry.path;state.favorites.append(b);}
 }
}
