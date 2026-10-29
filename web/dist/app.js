import {lessons} from './lessons.js';
import {generateData, fitLine, toCSV} from './model.js';
const $ = id => document.getElementById(id);
let completed = new Set();
try { const saved = JSON.parse(localStorage.getItem('notebook-lab-progress') || '[]'); if (Array.isArray(saved)) completed = new Set(saved.filter(id => lessons.some(l => l.id === id))); } catch { /* Browsing without storage is supported. */ }
let topic = 'All', active = null, points = [];
function renderLessons() {
  const query = $('search').value.trim().toLowerCase();
  const filtered = lessons.filter(l => (topic === 'All' || l.category === topic) && `${l.title} ${l.description} ${l.category}`.toLowerCase().includes(query));
  $('lesson-grid').replaceChildren(...filtered.map((l) => {
    const b = document.createElement('button'); b.className='lesson-card'; b.setAttribute('aria-label', `Open ${l.title}`);
    // All lesson strings are authored static content, never visitor input.
    b.innerHTML=`<span class="lesson-icon">${l.icon}</span><span class="lesson-meta">${l.category} / Foundations</span><h3>${l.title}</h3><p>${l.description}</p><span class="card-foot"><span>${completed.has(l.id) ? 'Completed ✓' : 'Explore lesson'}</span><span>↗</span></span>`;
    b.addEventListener('click', () => openLesson(l)); return b;
  }));
  $('empty').hidden = filtered.length !== 0;
  $('progress').textContent=`${completed.size} of ${lessons.length} lessons completed`;
}
function openLesson(l) {
  active=l; $('lesson-title').textContent=l.title; $('lesson-description').textContent=l.description;
  $('lesson-category').textContent=`${l.category} / Inspired by ${l.file}`;
  $('lesson-code').textContent=l.code;
  $('lesson-status').textContent=completed.has(l.id)?'You have completed this lesson.':'';
  $('complete').textContent=completed.has(l.id)?'Mark as incomplete':'Mark as completed ✓';
  $('lesson-dialog').showModal();
}
$('close-dialog').addEventListener('click', () => $('lesson-dialog').close());
$('complete').addEventListener('click', () => {
  if (!active) return;
  completed.has(active.id) ? completed.delete(active.id) : completed.add(active.id);
  let persistent=true; try { localStorage.setItem('notebook-lab-progress',JSON.stringify([...completed])); } catch { persistent=false; }
  $('lesson-status').textContent=(completed.has(active.id)?'Lesson completed.':'Lesson marked incomplete.')+(persistent?' Progress saved on this device.':' Progress kept for this session only.');
  $('complete').textContent=completed.has(active.id)?'Mark as incomplete':'Mark as completed ✓'; renderLessons();
});
function download(text,name,type) {const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('download-example').addEventListener('click',()=>{if(active)download(active.code+'\n',active.id+'.'+active.extension,'text/plain');});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{topic=b.dataset.filter;document.querySelectorAll('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));renderLessons();}));
$('search').addEventListener('input',renderLessons);
function updateModel() {
  const slope=Number($('slope').value),noise=Number($('noise').value),count=Number($('samples').value);
  $('slope-value').value=slope.toFixed(1); $('noise-value').value=noise.toFixed(1);
  points=generateData(slope,noise,count);const fit=fitLine(points);
  $('metric-slope').textContent=fit.slope.toFixed(3);$('metric-r2').textContent=fit.r2===null?'N/A':fit.r2.toFixed(3);$('metric-rmse').textContent=fit.rmse.toFixed(3);
  const ys=[...points.map(p=>p.y),fit.intercept,fit.slope*10+fit.intercept];
  let ymin=Math.min(...ys),ymax=Math.max(...ys);const padding=Math.max((ymax-ymin)*.15,1);ymin-=padding;ymax+=padding;
  const sx=x=>55+x/10*600,sy=y=>280-(y-ymin)/(ymax-ymin)*250;
  let svg='<title>Generated data and least-squares fitted line</title><desc>Horizontal axis x from zero to ten; vertical axis y. Green dots are observations, purple line is the fitted model.</desc>';
  for(let i=0;i<=5;i++){const y=ymin+(ymax-ymin)*i/5;svg+=`<line x1="55" y1="${sy(y)}" x2="655" y2="${sy(y)}" stroke="#e5e9df"/><text x="45" y="${sy(y)+4}" text-anchor="end" font-size="10" fill="#687067">${y.toFixed(1)}</text>`;}
  for(let x=0;x<=10;x+=2)svg+=`<text x="${sx(x)}" y="300" text-anchor="middle" font-size="10" fill="#687067">${x}</text>`;
  svg+='<text x="350" y="325" font-size="11" fill="#687067">x</text><text x="16" y="160" font-size="11" fill="#687067">y</text>';
  svg+=`<path d="M${sx(0)},${sy(fit.intercept)} L${sx(10)},${sy(fit.slope*10+fit.intercept)}" stroke="#9c70cb" stroke-width="2.5" fill="none"/>`;
  for(const p of points)svg+=`<circle cx="${sx(p.x)}" cy="${sy(p.y)}" r="4.5" fill="#708e45" fill-opacity=".8"/>`;
  $('regression').innerHTML=svg;
}
['slope','noise','samples'].forEach(id=>$(id).addEventListener('input',updateModel));
$('reset').addEventListener('click',()=>{$('slope').value='2';$('noise').value='1.5';$('samples').value='30';updateModel();});
$('export').addEventListener('click',()=>download(toCSV(points),'regression-experiment.csv','text/csv'));
renderLessons();updateModel();
