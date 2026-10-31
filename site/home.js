const views = new WeakMap();
const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const action=(label,cls,fn)=>{const b=node('button',cls,label);b.onclick=fn;return b;};
/** Stable home nodes: updating a selection never restarts the hero or replaces the card. */
export function createHome(options){
 const {onBrowse,onUpload}=options;
 const home=node('div','hero quiet-home orbit-home');
 const intro=node('div','quiet-intro'),heading=node('h1');
 heading.append(node('span','hero-line','Pick a world.'),document.createTextNode('\n'),node('span','hero-line','Make it yours.'));
 intro.append(node('span','quiet-eyebrow','YOUR SPACE TO PLAY'),heading,node('p','','Your builds, your favorites, one simple launcher.'));
 const card=node('section','glass-panel play-card');
 const title=node('h2','home-current'),metadata=node('p','home-current-description');
 card.append(node('span','home-kicker','NEXT UP'),title,metadata);
 const actions=node('div','home-actions'),browse=action('Explore the library ↗','primary-action',()=>onBrowse(''));
 actions.append(browse,action('Import local HTML','secondary-action',onUpload));card.append(actions);
 const details=action('View selected source →','text-action',()=>{const state=views.get(home);if(state.options.selected)state.options.onDetails(state.options.selected);});
 details.hidden=true;card.append(details);
 const favorites=node('div','quiet-favorites');favorites.hidden=true;card.append(favorites);
 home.append(intro,card,node('p','play-disclosure','Play runs third-party HTML. No installation required. Some games still need an in-game click for sound or controls.'));
 views.set(home,{options,title,metadata,browse,details,favorites,favoriteKey:''});
 updateHome(home,options);return home;
}
export function updateHome(home,options){
 const state=views.get(home);if(!state)return;
 state.options=options;const {selected,catalog,prefs,onSelect}=options;
 const label=selected?.label||'Something new is waiting.';
 const detail=selected?`${selected.runtime} · ${(selected.size/1048576).toFixed(2)} MiB`:'Choose a build. Press Play. We’ll load and validate the original file, then open it automatically.';
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
