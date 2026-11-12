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

// SVG morphing uses GSAP MorphSVG + ScrollTrigger's documented scrub pattern.
// Upstream: https://github.com/greensock/GSAP (see vendor/LICENSE-GSAP.txt).
const hero=document.querySelector('.hero');
const heroPhoto=document.querySelector('.hero-photo');
const svgNS='http://www.w3.org/2000/svg';
const heroSVG=document.createElementNS(svgNS,'svg');
heroSVG.setAttribute('class','hero-morph-svg');
heroSVG.setAttribute('role','img');heroSVG.setAttribute('aria-label','Setor and Eunice smiling together');
heroSVG.innerHTML='<defs><clipPath id="hero-morph-mask" clipPathUnits="userSpaceOnUse"><path id="hero-morph-path"/></clipPath></defs><image id="hero-morph-image" href="assets/hero.webp" preserveAspectRatio="xMidYMin slice" clip-path="url(#hero-morph-mask)"/>';
heroPhoto.replaceChildren(heroSVG);
if(window.gsap&&window.ScrollTrigger&&window.MorphSVGPlugin){
 gsap.registerPlugin(ScrollTrigger,MorphSVGPlugin);
 const media=gsap.matchMedia();
 media.add({mobile:'(max-width:700px)',desktop:'(min-width:701px)',reduced:'(prefers-reduced-motion:reduce)'},context=>{
  const {mobile,reduced}=context.conditions;
  const stage=document.querySelector('.hero-stage');
  const w=stage.clientWidth,h=stage.clientHeight;
  heroSVG.setAttribute('viewBox',`0 0 ${w} ${h}`);
  const size=mobile?Math.min(w*.96,h*.51):Math.min(w*.48,h*.85);
  const x=mobile?(w-size)/2:w*.51+(w*.46-size)/2;
  const y=mobile?18:(h-size)/2;
  const pt=(a,b)=>`${(x+a*size).toFixed(2)} ${(y+b*size).toFixed(2)}`;
  const curves=[[[.5,.19],[.24,-.06],[-.08,.12],[.06,.41]],[[.06,.41],[.14,.60],[.37,.80],[.5,.94]],[[.5,.94],[.63,.80],[.86,.60],[.94,.41]],[[.94,.41],[1.08,.12],[.76,-.06],[.5,.19]]];
  const mid=(a,b)=>a.map((v,i)=>(v+b[i])/2);
  const halves=curves.flatMap(([a,b,c,d])=>{const ab=mid(a,b),bc=mid(b,c),cd=mid(c,d),abc=mid(ab,bc),bcd=mid(bc,cd),center=mid(abc,bcd);return [[a,ab,abc,center],[center,bcd,cd,d]]});
  const heart='M'+pt(...halves[0][0])+halves.map(curve=>' C'+curve.slice(1).map(point=>pt(...point)).join(' ')).join('')+' Z';
  const corners=[[w/2,0],[0,0],[0,h/2],[0,h],[w/2,h],[w,h],[w,h/2],[w,0],[w/2,0]];
  const rectangle='M'+corners[0].join(' ')+corners.slice(1).map((b,i)=>{const a=corners[i];const point=t=>a.map((v,k)=>v+(b[k]-v)*t).join(' ');return ' C'+point(1/3)+' '+point(2/3)+' '+b.join(' ')}).join('')+' Z';
  gsap.set('#hero-morph-path',{attr:{d:rectangle}});
  gsap.set('#hero-morph-image',{attr:{x:0,y:0,width:w,height:h}});
  gsap.set(hero,{'--morph':0,'--hero-ink':'rgb(255,255,255)'});
  const timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{trigger:hero,start:'top top',end:'+=300',scrub:reduced?true:.35,invalidateOnRefresh:true}});
  timeline.to('#hero-morph-path',{morphSVG:{shape:heart,type:'linear',shapeIndex:0},duration:1},0)
   .to('#hero-morph-image',{attr:{x,y,width:size,height:size},duration:1},0)
   .to(hero,{'--morph':1,'--hero-ink':'rgb(48,57,45)',duration:1},0)
   .to('.hero-copy',{opacity:0,duration:.18},0)
   .to('.hero-copy',{opacity:1,duration:.3},.7);
  return ()=>timeline.kill();
 });
 window.addEventListener('load',()=>ScrollTrigger.refresh());
 window.addEventListener('hashchange',()=>requestAnimationFrame(()=>ScrollTrigger.refresh()));
}else{heroPhoto.innerHTML='<img src="assets/hero.webp" alt="Setor and Eunice smiling together">';}

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
  gsap.fromTo(photo,{scale:1.15,yPercent:-6},{scale:1,yPercent:6,ease:'none',scrollTrigger:{trigger:'.photo-break',start:'top bottom',end:'bottom top',scrub:.6}});
  gsap.to('.orbit-art',{rotation:35,ease:'none',scrollTrigger:{trigger:'.countdown',start:'top bottom',end:'bottom top',scrub:1}});
  return ()=>{};
 });
 document.fonts.ready.then(()=>ScrollTrigger.refresh());
}
