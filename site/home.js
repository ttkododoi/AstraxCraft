const node=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const action=(label,cls,fn)=>{const b=node('button',cls,label);b.onclick=fn;return b;};
/** Quiet, chart-free home. Selection never executes HTML; Play is the execution action. */
export function createHome({catalog,prefs,selected,onBrowse,onUpload,onSelect,onDetails}){
 const home=node('div','hero quiet-home orbit-home');
 const intro=node('div','quiet-intro');intro.append(node('span','quiet-eyebrow','YOUR SPACE TO PLAY'),node('h1','','Pick a world.\nMake it yours.'),node('p','','Your builds, your favorites, one simple launcher.'));
 const card=node('section','glass-panel play-card');card.append(node('span','home-kicker','NEXT UP'),node('h2','home-current',selected?.label||'Something new is waiting.'),node('p','home-current-description',selected?`${selected.runtime} · ${(selected.size/1048576).toFixed(2)} MiB`:'Choose a build. Press Play. We’ll load and validate the original file, then open it automatically.'));
 const actions=node('div','home-actions');actions.append(action(selected?'Change build ↗':'Explore the library ↗','primary-action',()=>onBrowse('')),action('Import local HTML','secondary-action',onUpload));card.append(actions);if(selected)card.append(action('View selected source →','text-action',()=>onDetails(selected)));
 const favorites=catalog.entries.filter(e=>prefs.favorites.includes(e.id)).slice(0,3);if(favorites.length){const list=node('div','quiet-favorites');list.append(node('span','home-kicker','FAVORITES'));for(const e of favorites){const b=action(e.label+' ↗','saved-build',()=>onSelect(e));b.title=e.path;list.append(b);}card.append(list);}
 home.append(intro,card,node('p','play-disclosure','Play runs third-party HTML. No installation required. Some games still need an in-game click for sound or controls.'));return home;
}
