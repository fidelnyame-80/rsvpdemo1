'use strict';
const KEY='setor-eunice-rsvp-v1';
const samples=[{name:'Akosua Mensah',attendance:'yes',guests:2,message:'So happy for you both! See you on the dance floor.',sample:true},{name:'Kwame Asante',attendance:'yes',guests:1,message:'Wouldn’t miss it for the world.',sample:true},{name:'Abena Owusu',attendance:'no',guests:0,message:'Sending all my love from abroad.',sample:true}];
function saved(){try{const value=JSON.parse(localStorage.getItem(KEY)||'[]');return Array.isArray(value)?value.filter(x=>x&&typeof x.name==='string'&&['yes','no'].includes(x.attendance)&&Number.isInteger(x.guests)&&x.guests>=0&&x.guests<=4):[]}catch{return[]}}
function all(){return [...saved(),...samples]}
function text(tag,value,className){const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el}
function render(){const records=all();document.querySelector('#stat-responses').textContent=records.length;document.querySelector('#stat-guests').textContent=records.reduce((n,x)=>n+(x.attendance==='yes'?x.guests:0),0);document.querySelector('#stat-declined').textContent=records.filter(x=>x.attendance==='no').length;const query=document.querySelector('#search').value.toLowerCase();const filter=document.querySelector('#filter').value;const list=document.querySelector('#guest-list');list.replaceChildren();const matches=records.filter(x=>x.name.toLowerCase().includes(query)&&(filter==='all'||x.attendance===filter));for(const item of matches){const row=text('article','','guest-row');const info=text('div','');const title=text('h3',item.name);if(item.sample)title.append(text('span','SAMPLE','sample'));info.append(title,text('p',item.message||'No message added.'));row.append(info,text('span',item.attendance==='yes'?`${item.guests} ${item.guests===1?'guest':'guests'} · Attending`:'Declined',`badge ${item.attendance==='no'?'no':''}`));list.append(row)}if(!matches.length)list.append(text('p','No matching responses.'))}
function route(){const dashboard=location.hash==='#dashboard';document.querySelector('#dashboard').hidden=!dashboard;document.querySelector('#invitation').hidden=dashboard;if(dashboard){render();window.scrollTo(0,0)}}
window.addEventListener('hashchange',route);window.addEventListener('storage',()=>{if(location.hash==='#dashboard')render()});route();
document.querySelector('#search').addEventListener('input',render);document.querySelector('#filter').addEventListener('change',render);
document.querySelectorAll('[name=attendance]').forEach(el=>el.addEventListener('change',()=>{document.querySelector('#guest-field').hidden=document.querySelector('[name=attendance]:checked').value==='no'}));
document.querySelector('#rsvp-form').addEventListener('submit',event=>{event.preventDefault();const form=event.currentTarget;const data=new FormData(form);const name=String(data.get('name')).trim();if(!name){document.querySelector('#name').setCustomValidity('Please enter your name.');document.querySelector('#name').reportValidity();return}const attendance=data.get('attendance');const record={name,attendance,guests:attendance==='yes'?Number(data.get('guests')):0,message:String(data.get('message')).trim(),createdAt:new Date().toISOString()};try{localStorage.setItem(KEY,JSON.stringify([record,...saved()]))}catch{document.querySelector('#form-error').textContent='Your browser could not save this response. Please allow browser storage and try again.';return}form.hidden=true;const success=document.querySelector('#success');success.hidden=false;document.querySelector('#success-title').textContent=attendance==='yes'?'You’re on the list!':'Thank you for letting us know.';document.querySelector('#success-copy').textContent=attendance==='yes'?`Thank you, ${name}. We’ve saved ${record.guests===1?'a seat':`${record.guests} seats`} for you. Let’s make some memories.`:`We’ll miss you, ${name}. Thank you for being part of our story.`;success.focus();success.scrollIntoView({behavior:'smooth',block:'center'})});
document.querySelector('#name').addEventListener('input',event=>event.target.setCustomValidity(''));
document.querySelector('#another').addEventListener('click',()=>{document.querySelector('#success').hidden=true;const form=document.querySelector('#rsvp-form');form.reset();form.hidden=false;document.querySelector('#guest-field').hidden=false;document.querySelector('#name').focus()});
document.querySelector('#export').addEventListener('click',()=>{const safe=value=>'"'+String(value??'').replace(/^[=+@\-\t\r]/,"'$&").replaceAll('"','""')+'"';const rows=[['Name','Attendance','Guests','Message','Source'],...all().map(x=>[x.name,x.attendance==='yes'?'Attending':'Declined',x.guests,x.message,x.sample?'Sample':'Browser submission'])];const blob=new Blob(['\uFEFF'+rows.map(row=>row.map(safe).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='setor-eunice-rsvps.csv';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);document.querySelector('#dash-status').textContent='Guest list exported.'});
function countdown(){const seconds=Math.max(0,Math.floor((new Date('2027-02-20T13:00:00Z')-Date.now())/1000));const values=[Math.floor(seconds/86400),Math.floor(seconds/3600)%24,Math.floor(seconds/60)%60,seconds%60];const root=document.querySelector('#countdown');root.replaceChildren();['DAYS','HOURS','MINUTES','SECONDS'].forEach((label,i)=>{const item=text('div','');item.append(text('strong',String(values[i]).padStart(2,'0')),text('span',label));root.append(item)})}countdown();setInterval(countdown,1000);

// A single scroll-scrubbed shape: rectangle at 0px, heart at 300px.
// Equal point counts make every intermediate outline continuous in both directions.
const hero=document.querySelector('.hero');
const heroPhoto=document.querySelector('.hero-photo');
const heartCurves=[
 [[.5,.14],[.22,-.12],[-.12,.14],[.08,.43]],
 [[.08,.43],[.18,.61],[.38,.80],[.5,.94]],
 [[.5,.94],[.62,.80],[.82,.61],[.92,.43]],
 [[.92,.43],[1.12,.14],[.78,-.12],[.5,.14]]
];
const rectangleStops=[[[.5,0],[0,0],[0,.5]],[[0,.5],[0,1],[.5,1]],[[.5,1],[1,1],[1,.5]],[[1,.5],[1,0],[.5,0]]];
const morphPoints=heartCurves.flatMap((curve,segment)=>Array.from({length:40},(_,i)=>{
 const t=i/40,u=1-t;const heart=[0,1].map(axis=>u*u*u*curve[0][axis]+3*u*u*t*curve[1][axis]+3*u*t*t*curve[2][axis]+t*t*t*curve[3][axis]);
 const stops=rectangleStops[segment],part=t<.5?0:1,f=t<.5?t*2:(t-.5)*2;
 return {heart,rectangle:[0,1].map(axis=>stops[part][axis]+(stops[part+1][axis]-stops[part][axis])*f)};
}));
let morphFrame=0;
function drawHeroMorph(){
 morphFrame=0;
 const p=Math.max(0,Math.min(1,window.scrollY/300));
 const mobile=window.matchMedia('(max-width:700px)').matches;
 hero.style.setProperty('--morph',p.toFixed(4));
 const ink=[48,57,45].map(value=>Math.round(255+(value-255)*p));
 hero.style.setProperty('--hero-ink',`rgb(${ink.join(',')})`);
 heroPhoto.style.clipPath=`polygon(${morphPoints.map(({heart,rectangle})=>[0,1].map(axis=>((rectangle[axis]+(heart[axis]-rectangle[axis])*p)*100).toFixed(3)+'%').join(' ')).join(',')})`;
 // The opening frame fills the screen, then settles beside (or above) the names.
 const end=mobile?[1,5,43,5]:[8,4,10,48];
 heroPhoto.style.inset=end.map(value=>(value*p).toFixed(3)+'%').join(' ');
}
function scheduleHeroMorph(){if(!morphFrame)morphFrame=requestAnimationFrame(drawHeroMorph)}
window.addEventListener('scroll',scheduleHeroMorph,{passive:true});
window.addEventListener('resize',scheduleHeroMorph,{passive:true});
window.addEventListener('pageshow',scheduleHeroMorph);
drawHeroMorph();
