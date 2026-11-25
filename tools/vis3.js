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

const view=async(name,w,h,hash,pre)=>{await send('Emulation.setDeviceMetricsOverride',{width:w,height:h,deviceScaleFactor:1.5,mobile:w<600});if(pre)await ev(pre);await ev("location.hash='"+hash+"'");await sleep(700);await shot(name);console.log(name,await ev("JSON.stringify({ov:document.documentElement.scrollWidth>innerWidth+1,sw:document.documentElement.scrollWidth,iw:innerWidth})"))};
await send('Page.navigate',{url:'file://'+R+'/output/fiqh-alruh.html'});await sleep(1500);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true});for(const [n,h] of [['g1_adab_khilaf','#/lesson/adabakl/khilaf'],['g3_nafl','#/lesson/naflhajj/khilaf']]){await ev("location.hash='"+h+"'");await sleep(1200);await shot(n)}
console.log('errs',errs);ch.kill();process.exit(0)})();
