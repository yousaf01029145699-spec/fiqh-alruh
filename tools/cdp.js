const R=require('path').resolve(__dirname,'..');
const {spawn}=require('child_process');const fs=require('fs');
(async()=>{
const ch=spawn(process.env.CHROME||'google-chrome',['--headless=new','--no-sandbox','--disable-gpu','--remote-debugging-port=9333','--user-data-dir='+require('fs').mkdtempSync(require('os').tmpdir()+'/fiqh-chrome-'),'about:blank'],{stdio:'ignore'});
await new Promise(r=>setTimeout(r,2500));
const tabs=await (await fetch('http://127.0.0.1:9333/json')).json();
const ws=new WebSocket(tabs.find(t=>t.type==='page').webSocketDebuggerUrl);
await new Promise(r=>ws.onopen=r);let id=0;const pend={};const errs=[];
ws.onmessage=e=>{const m=JSON.parse(e.data);if(m.id&&pend[m.id]){pend[m.id](m.result||m.error);delete pend[m.id]}if(m.method==='Runtime.exceptionThrown')errs.push(JSON.stringify(m.params.exceptionDetails.exception&&m.params.exceptionDetails.exception.description));};
const send=(method,params={})=>new Promise(r=>{pend[++id]=r;ws.send(JSON.stringify({id,method,params}))});
const ev=async(x)=>{const r=await send('Runtime.evaluate',{expression:x,awaitPromise:true,returnByValue:true});return r.result&&r.result.value};
const shot=async(n)=>{const r=await send('Page.captureScreenshot',{format:'png'});fs.writeFileSync(R+'/output/'+n+'.png',Buffer.from(r.data,'base64'))};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:2,mobile:true});
await send('Page.navigate',{url:'file://'+R+'/output/fiqh-alruh.html'});await sleep(1500);
const click=s=>ev(`document.querySelector(${JSON.stringify(s)}).click()`);
await shot('s1_home');
await ev("location.hash='#/lesson/wudu'");await sleep(500);await shot('s2_wudu');
await click('[data-lens=meaning]');await sleep(500);await shot('s3_meaning');
await ev("location.hash='#/lesson/wudu/steps'");await sleep(400);await click('[data-sdone="1"]');await sleep(300);await click('[data-sdone="2"]');await sleep(300);await shot('s4_steps');
await ev("location.hash='#/lesson/wudu/khilaf'");await sleep(400);await shot('s5_khilaf');
await ev("location.hash='#/lesson/wudu/quiz'");await sleep(400);await click('[data-opt="1"]');await sleep(200);await shot('s6_quiz');
console.log('quizcheck',await ev("document.querySelector('.opt.right')&&document.querySelector('.banner').textContent.slice(0,40)"));
// generic lesson sweep
for(const L of (process.env.LESSONS||'zakah1').split(',')){
 for(const tab of ['','/steps','/khilaf','/quiz']){await ev("location.hash='#/lesson/"+L+tab+"'");await sleep(350);
  if(tab==='/khilaf')await shot('z_'+L+'_khilaf');if(tab==='')await shot('z_'+L+'_main');
  const info=await ev("JSON.stringify({h:document.querySelector('h2')&&document.querySelector('h2').textContent.slice(0,30),ov:document.documentElement.scrollWidth>innerWidth+1,len:document.body.innerText.length})");console.log('sweep',L,tab||'/',info)}
 await ev("location.hash='#/lesson/"+L+"/quiz'");await sleep(300);
 let n=0;while(await ev("!!document.querySelector('[data-opt]')")&&n<30){await click('[data-opt="0"]');await sleep(80);await click('[data-qnext]');await sleep(80);n++}
 console.log('quizrun',L,n,await ev("(document.querySelector('.big')||{}).textContent"));
}
await ev("location.hash='#/sit'");await sleep(400);await click('summary');await sleep(300);await shot('s7_sit');
// bookmark and note
await ev("location.hash='#/lesson/salah1'");await sleep(400);await click('[data-bm]');await sleep(200);
await click('[data-note]');await sleep(200);await ev("document.querySelector('#nt').value='ملاحظة اختبار';document.querySelector('#ns').click()");await sleep(300);
await ev("location.hash='#/mine'");await sleep(400);await shot('s8_mine');
console.log('bm',await ev("JSON.parse(localStorage.getItem('fiqh_alruh_v1')).bm.length+','+JSON.parse(localStorage.getItem('fiqh_alruh_v1')).notes.length"));
await ev("location.hash='#/settings'");await sleep(400);
await click('[data-exp]');await sleep(300);
const bk1=await ev("document.querySelector('#bk').value");
await ev("document.querySelector('#bk').value='';");
await ev("document.querySelector('#bk').value=JSON.stringify(Object.assign(JSON.parse("+JSON.stringify(bk1)+"),{notes:[{id:'nx',ts:1,text:'restored',ref:'free',title:''}]}))");
await click('[data-imp]');await sleep(200);await click('[data-imp]');await sleep(300);
console.log('exportimport',JSON.parse(bk1).app,await ev("JSON.parse(localStorage.getItem('fiqh_alruh_v1')).notes.map(n=>n.text).join()"));
await ev("document.querySelector('#bk').value='not json'");await click('[data-imp]');await sleep(100);console.log('badimport',await ev("document.querySelector('#bkmsg').textContent"));
await ev("document.querySelector('#darkbtn').click()");await ev("location.hash='#/home'");await sleep(500);await shot('s9_dark');
await ev("document.querySelector('#q').value='نية';document.querySelector('#q').dispatchEvent(new Event('input'))");await sleep(400);await shot('s10_search');
console.log('searchres',await ev("document.querySelectorAll('#view .card').length"));
await send('Emulation.setDeviceMetricsOverride',{width:1280,height:800,deviceScaleFactor:1,mobile:false});await ev("location.hash='#/lesson/salah1'");await sleep(500);await shot('s11_desktop');
console.log('overflow',await ev("document.documentElement.scrollWidth>document.documentElement.clientWidth"));
console.log('errs',errs);
ch.kill();process.exit(0)})();
