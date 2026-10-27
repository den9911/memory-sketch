import { $, $$, action, download, share, storage } from '/locales/en/shared/ui.js';
import { sceneSvg } from '/locales/en/shared/scenes.js';
const targets=[{name:'a bicycle',svg:'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 430" role="img" aria-label="Bicycle"><rect width="600" height="430" fill="#e7eddf"/><g fill="none" stroke="#2b302b" stroke-width="8" stroke-linejoin="round"><circle cx="160" cy="290" r="85"/><circle cx="440" cy="290" r="85"/><path d="M160 290l90-140 80 140H160l50-105h185l45 105m-110 0l65-105-25-60h-50m-90 25h45"/></g></svg>'},{name:'a cat',svg:sceneSvg(3)},{name:'a mug',svg:sceneSvg(4)},{name:'a potted plant',svg:sceneSvg(2)}];
export async function mount(){
  const requested=Number(new URLSearchParams(location.search).get('draw'));
  let target=Number.isInteger(requested)&&requested>=0&&requested<targets.length?requested:0;
  let strokes=[],active=null,running=false,finished=false,deadline=0,ticker=null,color='#252a27';
  $('#app').innerHTML=`<div class="split"><section class="stack"><div class="row between"><span id="instruction">Draw ${targets[target].name}</span><strong id="timer" class="timer counter">00:30</strong></div><canvas id="drawing" class="draw-board" width="600" height="600" aria-label="Drawing area for mouse or touch"></canvas><div class="row drawing-tools"><div class="row" id="colors"></div><div class="row"><button id="undo" class="secondary">Undo</button><button id="erase" class="secondary">Eraser</button></div></div><div class="row"><button id="start">Start 30 seconds ↗</button><button id="finish" class="secondary" disabled>Done</button></div></section><section class="stack"><div class="panel stack"><h2>Trust your memory</h2><p class="muted">Pick an object, press Start, and draw. We reveal the reference when time is up.</p><label>What are we drawing?<select id="target">${targets.map((t,i)=>`<option value="${i}" ${i===target?'selected':''}>${t.name}</option>`).join('')}</select></label><p class="small muted">Your drawing stays on your device. Download it and send it to friends.</p></div><div id="reveal" hidden class="stack"><div class="scene" id="reference"></div><p class="small muted">A reference for comparison. No automatic scoring; your version is what matters.</p><div class="row"><button id="save">Download drawing ↓</button><button id="challenge" class="secondary">Challenge a friend ↗</button></div></div></section></div>`;
  const canvas=$('#drawing'),ctx=canvas.getContext('2d');
  const saved=storage.get('memory-draft');if(saved?.target===target&&Array.isArray(saved.strokes))strokes=saved.strokes.slice(0,100);
  function paint(){ctx.fillStyle='#fff';ctx.fillRect(0,0,600,600);ctx.lineCap='round';ctx.lineJoin='round';for(const stroke of strokes){ctx.strokeStyle=stroke.color;ctx.lineWidth=stroke.color==='#ffffff'?28:5;ctx.beginPath();stroke.points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));if(stroke.points.length===1){const [x,y]=stroke.points[0];ctx.lineTo(x+.1,y+.1);}ctx.stroke();}}
  function persist(){storage.set('memory-draft',{target,strokes,running,deadlineWall:running?Date.now()+Math.max(0,deadline-performance.now()):null,finished});}
  function stop(){if(!running)return;running=false;active=null;finished=true;clearInterval(ticker);$('#timer').textContent='Done';$('#finish').disabled=true;$('#finish').dataset.lock='true';$('#target').disabled=false;$('#start').textContent='Try another round';$('#start').dataset.lock='false';$('#start').disabled=false;$('#reveal').hidden=false;$('#reference').innerHTML=targets[target].svg;persist();}
  function clock(){const left=Math.max(0,deadline-performance.now());$('#timer').textContent=`00:${String(Math.ceil(left/1000)).padStart(2,'0')}`;if(left<=0)stop();}
  function point(e){const rect=canvas.getBoundingClientRect();return [Math.max(0,Math.min(600,(e.clientX-rect.left)*600/rect.width)),Math.max(0,Math.min(600,(e.clientY-rect.top)*600/rect.height))];}
  canvas.addEventListener('pointerdown',e=>{if(!running||strokes.length>=100)return;clock();if(!running)return;e.preventDefault();canvas.setPointerCapture(e.pointerId);active={color,points:[point(e)]};strokes.push(active);paint();});
  canvas.addEventListener('pointermove',e=>{if(!running||!active||active.points.length>=1000)return;active.points.push(point(e));paint();});
  for(const event of ['pointerup','pointercancel'])canvas.addEventListener(event,()=>{active=null;persist();});
  const colors=['#252a27','#d05c43','#49735d','#456ba3'];
  $('#colors').innerHTML=colors.map((c,i)=>`<button class="swatch" data-color="${c}" aria-label="${['Black','Red','Green','Blue'][i]}" aria-pressed="${i===0}"></button>`).join('');
  $$('.swatch').forEach(button=>{button.style.setProperty('--swatch',button.dataset.color);action(button,()=>{color=button.dataset.color;$$('.swatch').forEach(b=>b.setAttribute('aria-pressed',b===button));$('#erase').setAttribute('aria-pressed','false');});});
  action($('#erase'),()=>{color='#ffffff';$('#erase').setAttribute('aria-pressed','true');$$('.swatch').forEach(b=>b.setAttribute('aria-pressed','false'));});
  action($('#undo'),()=>{if(running){strokes.pop();active=null;paint();}});
  action($('#start'),()=>{strokes=[];paint();finished=false;running=true;deadline=performance.now()+30000;$('#reveal').hidden=true;$('#target').disabled=true;$('#start').dataset.lock='true';$('#finish').dataset.lock='false';$('#finish').disabled=false;clock();ticker=setInterval(clock,100);});
  action($('#finish'),stop);
  $('#target').addEventListener('change',()=>{target=Number($('#target').value);$('#instruction').textContent=`Draw ${targets[target].name}`;strokes=[];finished=false;$('#reveal').hidden=true;$('#timer').textContent='00:30';history.replaceState(null,'',`?draw=${target}`);paint();});
  action($('#save'),()=>{if(finished)download(canvas,'memory-sketch.png');});
  action($('#challenge'),()=>share(`${location.origin}/memory/?draw=${target}`,'Memory Sketch',`Try drawing ${targets[target].name} in 30 seconds!`));
  document.addEventListener('visibilitychange',()=>{if(running)clock();});
  window.addEventListener('minute:preferences-changing',persist);
  window.addEventListener('pagehide',()=>{clearInterval(ticker);persist();});paint();
  if(saved?.target===target && saved.running && Number.isFinite(saved.deadlineWall)){
    running=true;deadline=performance.now()+Math.max(0,saved.deadlineWall-Date.now());
    $('#target').disabled=true;$('#start').dataset.lock='true';$('#start').disabled=true;$('#finish').disabled=false;
    clock();if(running)ticker=setInterval(clock,100);
  }else if(saved?.target===target && saved.finished){running=true;stop();}
}
