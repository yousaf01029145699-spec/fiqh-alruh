const os=require('os'),path=require('path');const R=path.resolve(__dirname,'..');
const fs=require('fs'),vm=require('vm'),{execSync}=require('child_process');
const D=vm.runInNewContext(fs.readFileSync(R+'/data.js','utf8')+';({DISCLAIMER,SCHOOLS,SOURCE_NOTE,WORSHIPS,REFLECTIONS,SITUATIONS})');
const e=s=>String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const SK=['hanafi','maliki','shafii','hanbali'];
const fonts=fs.readFileSync(R+'/fonts.css','utf8');
const card=(t,d,ref,kind)=>`<div class="c"><b>${e(t)}</b>${kind?` <span class="t">${e(kind)}</span>`:''}<p>${e(d)}</p>${ref?`<div class="r">المصدر: ${e(ref)}</div>`:''}</div>`;
const toc=[];let h=`<html dir="rtl" lang="ar"><head><meta charset="utf-8"><style>${fonts}
@page{size:A5;margin:12mm}
body{font-family:'IBM Plex Sans Arabic',sans-serif;font-size:11.5pt;line-height:1.9;color:#1C2420}
h1{font-family:Amiri;color:#0F4C3A;font-size:24pt;margin:0 0 4px}h2{color:#0F4C3A;font-size:16pt;border-bottom:2px solid #C59B27;margin:18px 0 8px;page-break-after:avoid}h3{color:#0F4C3A;font-size:13pt;margin:14px 0 6px;page-break-after:avoid}
.c{border:1px solid #E8E2D5;border-radius:8px;padding:6px 10px;margin:6px 0;page-break-inside:avoid;background:#fff}.c p{margin:2px 0}
.r{font-size:9.5pt;color:#5A6962}.t{font-size:9pt;border:1px solid #C59B27;border-radius:10px;padding:0 6px;color:#7a5d10}
.dh{font-family:Amiri;font-size:15pt;background:#F1EEE6;border-radius:8px;padding:4px 10px;margin:4px 0}
.w{border-right:3px solid #C59B27;padding-right:8px;color:#5A6962;font-size:10.5pt}
.q{font-family:Amiri;font-size:14pt}
table{border-collapse:collapse;width:100%;margin:6px 0;page-break-inside:avoid;font-size:10.5pt}td{border:1px solid #E8E2D5;padding:3px 6px;vertical-align:top}td:first-child{width:18%;font-weight:600;background:#F1EEE6}
.n{background:#FFF7DD;border:1px solid #C59B27;border-radius:8px;padding:6px 10px;font-size:10.5pt}
.pb{page-break-before:always}.ls{font-size:15pt;background:#EAF1EC;padding:3px 8px;border-radius:6px;margin-top:22px;border:none}.tw{font-weight:bold;margin-top:8px}.tl{padding-right:14px}a{color:#0F4C3A;text-decoration:none}h3{font-size:12.5pt;color:#7a5d10;margin:10px 0 4px}</style></head><body>
<h1>فِقْهُ الرُّوح</h1><div>العبادات ومعانيها. نسخة للقراءة على الهاتف (PDF)، وهي نموذج أولي</div>
<div class="n"><b>تنبيه:</b> ${e(D.DISCLAIMER)}<br>${e(D.SOURCE_NOTE)}<br>هذه نسخة مرحلية: بعض الأبواب مكتوبة بتفصيل أكبر من غيرها، وما لم يستكمل مكتوب في موضعه أنه قيد الاستكمال. انظر الفهرس بالأسفل للانتقال إلى أي درس، وملف المراجعة العلمية المنفصل لمواضع النقص.</div>`;
h+='@@TOC@@';
for(const w of D.WORSHIPS){
 h+=`<h2 class="pb" id="w_${w.id}">${e(w.title)}</h2>`;toc.push(`<div class="tw"><a href="#w_${w.id}">${e(w.title)}</a></div>`);
 if(w.overview){const o=w.overview;h+=card('التعريف',o.definition)+o.points.map(p=>`<div class="c">${e(p)}</div>`).join('')+o.evidence.map(x=>`<div class="c q">${x.type==='quran'?'﴿ ':''}${e(x.text)}${x.type==='quran'?' ﴾':''}<div class="r">${e(x.ref)}${x.exact===false?' | نقل بالمعنى':''}</div></div>`).join('')+(o.sources?`<div class="r">المصادر: ${e(o.sources)}</div>`:'')+`<div class="r">${e(o.next)}</div>`;continue}
 for(const l of w.lessons){
  toc.push(`<div class="tl"><a href="#l_${l.id}">${e(l.title)}</a></div>`);h+=`<h2 class="ls" id="l_${l.id}">${e(l.title)}</h2>`+card('التعريف',l.definition)+card('الحكم',l.hukm,l.hukmRef);
  const f=l.fiqh,sec=(n,a)=>a&&a.length?`<h3>${n}</h3>`+a.map(x=>card(x.t,x.d,x.ref)).join(''):'';
  h+=sec('الشروط',f.conditions)+sec('الأركان والفروض',f.pillars)+sec('الواجبات',f.obligations)+sec('السنن',f.sunan)+sec('النواقض والمبطلات',f.nullifiers);
  h+='<h3>دليل الأداء خطوة بخطوة</h3>'+l.steps.map(s=>`<div class="c"><b>${s.n}. ${e(s.name)}</b><p>${e(s.action)}</p><div class="dh">${e(s.dhikr)}</div><div class="w"><b>همسة (تأمل، وليست حكماً):</b> ${e(s.whisper)}</div><div class="r">المصدر: ${e(s.ref||'')}</div></div>`).join('');
  const m=l.meaning;h+='<h3>المعنى والروح</h3><div class="n">الآيات والأحاديث مصنفة كذلك، والتأملات اجتهاد تربوي وليست أحكاماً.</div>'+[...m.why,...m.symbols,...m.impact].map(x=>card(x.t,x.d,x.ref,x.kind)).join('');
  h+='<h3>الأدلة</h3>'+l.evidence.map(x=>`<div class="c q">${x.type==='quran'?'﴿ ':''}${e(x.text)}${x.type==='quran'?' ﴾':''}<div class="r">${e(x.ref)}${x.exact===false?' | نقل بالمعنى':''}</div></div>`).join('');
  h+='<h3>الخلاف بين المذاهب الأربعة</h3>'+l.khilaf.map(k=>`<div class="c"><b>${e(k.issue)}</b><table>${SK.map(s=>`<tr><td>${e(D.SCHOOLS[s].name)}</td><td>${e(k.v[s])}</td></tr>`).join('')}</table>${k.note?`<div class="r">${e(k.note)}</div>`:''}</div>`).join('');
  h+='<h3>أخطاء شائعة</h3>'+l.mistakes.map(x=>card(x.t,x.d)).join('');
  h+='<h3>اختبار قصير</h3>'+l.quiz.map((q,i)=>`<div class="c"><b>${i+1}. ${e(q.q)}</b><br>${q.o.map((o,j)=>`${'أبج'[j]}) ${e(o)}`).join('<br>')}<p class="r">الجواب: ${'أبج'[q.a]}. ${e(q.why)}</p></div>`).join('');
 }}
h+='<h2 class="pb">مواقف سريعة</h2>'+D.SITUATIONS.map(s=>`<div class="c"><b>${e(s.q)}</b> <span class="t">${e(s.cat)}</span><p>${e(s.a)}</p><p class="r">${e(s.d)}</p><div class="r">${e(s.ref)}</div></div>`).join('');
h+='<h2>تأملات</h2>'+D.REFLECTIONS.map(r=>card(r.t,r.d,r.ref,r.kind)).join('');
h=h.replace('@@TOC@@','<h2>الفهرس</h2>'+toc.join(''));h+='</body></html>';
fs.writeFileSync(os.tmpdir()+'/fiqh-pdf.html',h);
execSync(''+(process.env.CHROME||'google-chrome')+' --headless=new --no-sandbox --disable-gpu --no-pdf-header-footer --generate-pdf-document-outline --print-to-pdf='+R+'/output/fiqh-alruh-mobile.pdf file://'+os.tmpdir()+'/fiqh-pdf.html',{stdio:'inherit'});
