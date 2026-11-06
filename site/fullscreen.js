/** User-gesture fullscreen; never claim success before the browser changes state. */
export function fullscreenControl(button,onError=()=>{}){
 const update=()=>{const active=!!document.fullscreenElement;button.textContent=active?'Exit fullscreen':'⛶ Fullscreen';button.setAttribute('aria-label',active?'Exit fullscreen':'Enter fullscreen');button.setAttribute('aria-pressed',String(active));};
 const click=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else if(document.documentElement.requestFullscreen)await document.documentElement.requestFullscreen();else throw Error('This browser does not support fullscreen. Use its browser menu instead.');}catch(error){onError('Fullscreen unavailable: '+error.message);}update();};
 button.addEventListener('click',click);document.addEventListener('fullscreenchange',update);update();return()=>{button.removeEventListener('click',click);document.removeEventListener('fullscreenchange',update);};
}
