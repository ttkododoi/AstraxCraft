/** Small, dependency-free SVG charts. Every datum comes from the pinned catalog. */
const NS='http://www.w3.org/2000/svg';
const svgNode=(name,attrs={})=>{const n=document.createElementNS(NS,name);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,String(v));return n;};
const textNode=(tag,cls,text)=>{const n=document.createElement(tag);n.className=cls;n.textContent=text;return n;};
let floatingTip;
function scrubChart(svg,values,label,width,height,max) {
 let index=values.length-1;
 svg.setAttribute('tabindex','0');
 svg.setAttribute('aria-label',label+'. Use left and right arrows to inspect the values.');
 const cursor=svgNode('g',{class:'chart-cursor',visibility:'hidden'}),line=svgNode('line',{class:'chart-cursor-line',y1:0,y2:height}),point=svgNode('circle',{class:'chart-cursor-point',r:3});cursor.append(line,point);svg.append(cursor);
 const hide=()=>{cursor.setAttribute('visibility','hidden');if(floatingTip)floatingTip.hidden=true;};
 const show=(next,event)=>{
  index=Math.max(0,Math.min(values.length-1,next));const x=values.length===1?width/2:4+index*(width-8)/(values.length-1),y=height-5-values[index]/max*(height-14);
  line.setAttribute('x1',x);line.setAttribute('x2',x);point.setAttribute('cx',x);point.setAttribute('cy',y);cursor.setAttribute('visibility','visible');
  const value=values[index]>=1048576?(values[index]/1048576).toFixed(2)+' MiB':values[index].toLocaleString()+' bytes';
  const caption=`Point ${index+1} of ${values.length} · ${value}`;
  if(!floatingTip){floatingTip=document.createElement('div');floatingTip.className='chart-tooltip';floatingTip.setAttribute('aria-hidden','true');document.body.append(floatingTip);document.addEventListener('pointerdown',()=>floatingTip.hidden=true);}
  floatingTip.textContent=caption;floatingTip.hidden=false;const rect=svg.getBoundingClientRect();
  floatingTip.style.left=Math.max(8,Math.min(innerWidth-210,event?.clientX??rect.left+rect.width/2))+'px';floatingTip.style.top=Math.max(8,Math.min(innerHeight-50,(event?.clientY??rect.top)-37))+'px';
  if(!event)svg.setAttribute('aria-label',`${label}. ${caption}. Use arrow keys to inspect.`);
 };
 svg.addEventListener('pointermove',e=>{const rect=svg.getBoundingClientRect();show(Math.round((e.clientX-rect.left)/(rect.width||1)*(values.length-1)),e);});
 svg.addEventListener('pointerleave',hide);svg.addEventListener('focus',()=>show(index));svg.addEventListener('blur',hide);
 svg.addEventListener('keydown',e=>{const next=e.key==='ArrowLeft'?index-1:e.key==='ArrowRight'?index+1:e.key==='Home'?0:e.key==='End'?values.length-1:null;if(next!==null){e.preventDefault();show(next);}});
}
export const chartColors=['#7655d6','#a389ec','#779ed8','#66adac','#c38fbd','#ac9bce','#a5adbc'];
export function areaChart(values,label,{width=240,height=64,interactive=true}={}){
 const svg=svgNode('svg',{viewBox:`0 0 ${width} ${height}`,role:'img','aria-label':label,class:'area-chart',preserveAspectRatio:'none'}),title=svgNode('title');title.textContent=values.length?`${label}; ${values.length} values; minimum ${Math.min(...values).toLocaleString()} bytes; maximum ${Math.max(...values).toLocaleString()} bytes`:label;svg.append(title);
 if(!values.length){svg.append(svgNode('path',{d:`M0 ${height-4}H${width}`,class:'chart-baseline'}));return svg;}
 const max=Math.max(...values,1),points=values.map((v,i)=>[values.length===1?width/2:4+i*(width-8)/(values.length-1),height-5-(v/max)*(height-14)]);
 if(points.length===1)points.unshift([0,points[0][1]]);
 const line=points.map(([x,y],i)=>`${i?'L':'M'}${x.toFixed(2)} ${y.toFixed(2)}`).join(' ');
 svg.append(svgNode('path',{d:`${line} L${points.at(-1)[0]} ${height} L${points[0][0]} ${height} Z`,class:'chart-area'}),svgNode('path',{d:line,class:'chart-line',pathLength:1}));if(interactive)scrubChart(svg,values,label,width,height,max);return svg;
}
export function distributionChart(items,{label='Catalog distribution',center='',caption='builds'}={}){
 const wrap=document.createElement('div');wrap.className='distribution-chart';const svg=svgNode('svg',{viewBox:'0 0 180 180',role:'img','aria-label':label,class:'donut-chart'}),title=svgNode('title');title.textContent=items.map(i=>`${i.label}: ${i.value}`).join('; ');svg.append(title);
 const total=items.reduce((n,i)=>n+i.value,0),radius=66,circ=2*Math.PI*radius;let offset=0;
 svg.append(svgNode('circle',{cx:90,cy:90,r:radius,fill:'none',class:'donut-track','stroke-width':17}));
 items.forEach((item,i)=>{if(item.value<=0)return;const length=item.value/(total||1)*circ;const circle=svgNode('circle',{cx:90,cy:90,r:radius,fill:'none',stroke:chartColors[i%chartColors.length],'stroke-width':17,'stroke-dasharray':`${Math.max(0,length-3)} ${circ}`,'stroke-dashoffset':-offset,transform:'rotate(-90 90 90)',class:'donut-segment'});const t=svgNode('title');t.textContent=`${item.label}: ${item.value}`;circle.append(t);svg.append(circle);offset+=length;});
 const number=svgNode('text',{x:90,y:89,'text-anchor':'middle',class:'donut-number'});number.textContent=center||String(total);const sub=svgNode('text',{x:90,y:109,'text-anchor':'middle',class:'donut-caption'});sub.textContent=caption;svg.append(number,sub);wrap.append(svg);
 const legend=document.createElement('dl');legend.className='chart-legend';items.forEach((item,i)=>{const row=document.createElement('div'),dt=document.createElement('dt'),dot=document.createElement('i'),dd=document.createElement('dd');dot.style.background=chartColors[i%chartColors.length];dt.append(dot,document.createTextNode(item.label));dd.textContent=item.value;row.append(dt,dd);legend.append(row);});wrap.append(legend);return wrap;
}
export function sizeMeter(size,max,label,unit='bytes'){
 const meter=document.createElement('div');meter.className='size-meter';meter.setAttribute('role','img');meter.setAttribute('aria-label',`${label}: ${size.toLocaleString()} ${unit}; maximum ${max.toLocaleString()} ${unit}`);const fill=document.createElement('span');fill.style.setProperty('--meter-value',`${Math.min(100,Math.max(0,size/(max||1)*100))}%`);meter.append(fill);return meter;
}
export function categorySummary(entries){const counts=new Map();for(const e of entries)counts.set(e.category,(counts.get(e.category)||0)+1);return [...counts].map(([label,value])=>({label,value}));}
export function runtimeSummary(entries){return [{label:'WASM-named',value:entries.filter(e=>e.runtime.startsWith('WASM')).length},{label:'JS-named',value:entries.filter(e=>e.runtime.startsWith('JavaScript')).length},{label:'Unspecified',value:entries.filter(e=>e.runtime==='Unspecified').length}];}
export function transferChart(){
 const panel=document.createElement('section');panel.id='transferPanel';panel.className='transfer-panel';panel.hidden=true;panel.setAttribute('aria-label','Live download progress');const top=document.createElement('div');top.className='transfer-heading';const title=textNode('strong','','Transfer'),state=textNode('span','transfer-state','Waiting');state.id='transferState';const close=document.createElement('button');close.className='transfer-close';close.textContent='×';close.setAttribute('aria-label','Dismiss transfer graph');close.onclick=()=>panel.hidden=true;top.append(title,state,close);const visual=document.createElement('div');visual.id='transferGraph';const progress=document.createElement('progress');progress.id='transferProgress';progress.setAttribute('aria-label','Bytes received');const note=textNode('small','', 'No transfer yet.');note.id='transferBytes';panel.append(top,visual,progress,note);return panel;
}
export function updateTransfer(panel,{received,total,samples,state}){
 panel.hidden=false;panel.querySelector('#transferState').textContent=state;panel.querySelector('.transfer-close').disabled=['Preparing','Receiving bytes','fetching','validating'].includes(state);
 const graph=panel.querySelector('#transferGraph');graph.replaceChildren(areaChart(samples,'Cumulative received bytes, sample order',{width:500,height:60,interactive:false}));const progress=panel.querySelector('progress');if(total>0){progress.max=total;progress.value=received;}else progress.removeAttribute('value');panel.querySelector('#transferBytes').textContent=total>0?`${received.toLocaleString()} / ${total.toLocaleString()} bytes · ${Math.floor(received/total*100)}% received (not game readiness)`:'Waiting for response · total unknown';
}
