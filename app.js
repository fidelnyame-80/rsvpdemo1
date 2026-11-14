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

// The hero is a large, static heart: no morph, pinning, or scroll timeline.
const heroPhoto=document.querySelector('.hero-photo');
heroPhoto.innerHTML=`<svg class="hero-heart-svg" viewBox="0 0 1000 1000" role="img" aria-label="Setor and Eunice smiling together"><defs><clipPath id="static-heart"><path d="M500 190C240 -60 -80 120 60 410C140 600 370 800 500 940C630 800 860 600 940 410C1080 120 760 -60 500 190Z"/></clipPath></defs><image href="assets/hero.webp" x="0" y="0" width="1000" height="1000" preserveAspectRatio="xMidYMin slice" clip-path="url(#static-heart)"/></svg>`;

// GSAP ScrollTrigger entrance choreography; no timer-based auto-play.
if(window.gsap&&window.ScrollTrigger){
 gsap.registerPlugin(ScrollTrigger);
 const mm=gsap.matchMedia();
 mm.add('(prefers-reduced-motion: no-preference)',()=>{
  const enter=(selector,from,extra={})=>gsap.utils.toArray(selector).forEach(el=>{
   gsap.fromTo(el,{...from,autoAlpha:0},{x:0,y:0,rotation:0,autoAlpha:1,duration:1.15,ease:'power3.out',...extra,scrollTrigger:{trigger:el,start:'top 92%',end:'top 48%',toggleActions:'play none none reverse'}});
  });
  enter('.story-photo',{x:-100,y:45,rotation:-9},{rotation:-2});
  enter('.story-copy>.eyebrow,.story-copy>h2',{x:85,y:12});
  enter('.story-copy>p:not(.eyebrow)',{x:65,y:15});
  enter('.opening-note',{x:-45,y:25,rotation:-6},{rotation:-2});
  enter('.paper-note',{x:-60,y:35,rotation:-7},{rotation:-2});
  enter('.handwritten-note',{x:90,y:50,rotation:9},{rotation:2});
  enter('.rsvp-intro>.eyebrow,.rsvp-intro>h2,.rsvp-intro>p',{x:-75,y:15});
  enter('.rsvp-keepsake',{x:-100,y:55,rotation:-14},{rotation:-4,duration:1.4});
  enter('#rsvp-form',{x:95,y:30,rotation:3});
  enter('.photo-break>div',{x:-100,y:30});
  gsap.utils.toArray('.sketch-heart,.botanical-art,.orbit-art,.section-divider svg,.floral-corner,.ribbon-art').forEach(svg=>{
   gsap.fromTo(svg,{autoAlpha:0,rotation:-12,y:25},{autoAlpha:1,rotation:0,y:0,duration:1,scrollTrigger:{trigger:svg,start:'top 93%',toggleActions:'play none none reverse'}});
   svg.querySelectorAll('path,circle,ellipse').forEach(path=>{
    const length=path.getTotalLength();gsap.set(path,{strokeDasharray:length,strokeDashoffset:length});
    gsap.to(path,{strokeDashoffset:0,ease:'none',scrollTrigger:{trigger:svg,start:'top 90%',end:'top 40%',scrub:.5}});
   });
  });
  gsap.utils.toArray('.partial-underline').forEach(el=>gsap.fromTo(el,{'--ink-progress':0},{'--ink-progress':1,scrollTrigger:{trigger:el,start:'top 90%',end:'top 55%',scrub:.35}}));
  const photo=document.querySelector('.photo-break img');
  if(photo)gsap.fromTo(photo,{scale:1.15,yPercent:-6},{scale:1,yPercent:6,ease:'none',scrollTrigger:{trigger:'.photo-break',start:'top bottom',end:'bottom top',scrub:.6}});
  gsap.to('.orbit-art',{rotation:35,ease:'none',scrollTrigger:{trigger:'.countdown',start:'top bottom',end:'bottom top',scrub:1}});
  return ()=>{};
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
