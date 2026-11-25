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

await send('Page.navigate',{url:'file://'+R+'/output/fiqh-alruh.html'});await sleep(1500);
await send('Emulation.setDeviceMetricsOverride',{width:390,height:1500,deviceScaleFactor:1.5,mobile:true});

await ev("location.hash='#/'");await sleep(900);await shot('pk_home');
await ev("location.hash='#/lesson/itikaf/meaning'");await sleep(800);
console.log(await ev("JSON.stringify([...document.querySelectorAll('button')].map(x=>x.textContent.trim()).filter(x=>x.length<25).slice(0,20))"));
await ev("[...document.querySelectorAll('button')].find(x=>x.textContent.includes('المعنى والروح')).click()");await sleep(700);
await shot('pk_meaning');
await ev("location.hash='#/lesson/zakah1/khilaf'");await sleep(800);
await ev("(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.includes('الخلاف'));if(b)b.click()})()");await sleep(700);
await shot('pk_khilaf');
console.log('errs',errs);ch.kill();process.exit(0)})();
