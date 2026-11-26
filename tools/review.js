const fs=require('fs'),vm=require('vm');const R=require('path').resolve(__dirname,'..');
const D=vm.runInNewContext(fs.readFileSync(R+'/data.js','utf8')+';({SCHOOLS,WORSHIPS})');
const SK=['hanafi','maliki','shafii','hanbali'],SN={hanafi:'الحنفي',maliki:'المالكي',shafii:'الشافعي',hanbali:'الحنبلي'};
const norm=s=>String(s).replace(/[\u064B-\u0652\u0670\u0640]/g,'');
const gap=/لم (تنص|تقرأ|يقرأ|تذكر|تستكمل|يستكمل)|لم أقرأ|غير مقروء|مقطوع|لم يفصل|لم تفصل|قيد الاستكمال/;
const gapTest=t=>gap.test(norm(t));
const AD=s=>String(s).replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d));
const urlRe=/https?:\/\/[^\s،;)]+/g;
function enc(txt,set){
 const t=AD(txt);const vm_=t.match(/المجلد\s*(\d+)/);if(!vm_)return;const vol=vm_[1];
 const rest=t.replace(/المجلد\s*\d+/,'');const nums=[...rest.matchAll(/(?<![\d\/])(\d{4,5})(?![\d\/])/g)].map(m=>+m[1]);
 if(!nums.length)return;const lo=Math.min(...nums),hi=Math.max(...nums);set.add(vol+':'+lo+':'+hi)}
let toc=[],body=[],tot={l:0,k:0,g:0};
for(const w of D.WORSHIPS){body.push('','## '+w.title);toc.push('- **'+w.title+'**');
 for(const l of w.lessons){tot.l++;toc.push('  - [‫'+l.title+'](#'+l.id+')');
  body.push('','<a id="'+l.id+'"></a>','### '+l.title+' (id: `'+l.id+'`)');
  const refs=new Set(),encs=new Set(),urls=new Set(),other=new Set();
  const add=r=>{if(!r||r==='—')return;r=r.replace(/(?<![\/\w.])muslim-library\.com\/keoj\/volume\/\d+\/\d+\//g,m=>'https://'+m);refs.add(r);enc(r,encs);(r.match(urlRe)||[]).forEach(u=>urls.add(u))};
  add(l.hukmRef);['conditions','pillars','obligations','sunan','nullifiers'].forEach(k=>((l.fiqh||{})[k]||[]).forEach(i=>add(i.ref)));
  (l.evidence||[]).forEach(e=>add(e.ref));(l.steps||[]).forEach(s=>add(s.ref));
  const kh=l.khilaf||[];
  kh.forEach(r=>{[...SK.map(s=>(r.v||{})[s]||''),r.note||''].forEach(t=>{(t.match(urlRe)||[]).forEach(u=>urls.add(u));enc(t,encs)})});
  body.push('','**مصادر الموسوعة الفقهية الكويتية (روابط الصفحات المقروءة، صيغة الرابط تحققت بالجلب):**');
  const eLines=[...new Set([...encs])].map(x=>x.split(':')).map(([v,a,b])=>a===b?'- https://muslim-library.com/keoj/volume/'+v+'/'+a+'/':'- من https://muslim-library.com/keoj/volume/'+v+'/'+a+'/ إلى https://muslim-library.com/keoj/volume/'+v+'/'+b+'/');
  body.push(...(eLines.length?eLines:['- لا يوجد في هذا الدرس.']));
  body.push('','**روابط كاملة مذكورة في نص الدرس:**');
  body.push(...(urls.size?[...urls].map(u=>'- '+u):['- لا يوجد.']));
  body.push('','**مراجع مسجلة بصيغتها (قد تكون بلا رابط كامل موثق؛ لم تُكمل بتخمين):**');
  const rr=[...refs].filter(r=>!/المجلد/.test(r));body.push(...(rr.length?rr.map(r=>'- '+r):['- لا يوجد.']));
  const gaps=[];tot.k+=kh.length;
  for(const r of kh){const gs=SK.filter(s=>gapTest((r.v||{})[s]||''));const miss=SK.filter(s=>!(r.v||{})[s]);if(gs.length||miss.length){tot.g++;gaps.push('- مسألة "'+r.issue+'" (`'+r.id+'`): '+gs.concat(miss).map(s=>SN[s]).join('، ')+' بلا قول موثق في الصفحات المقروءة.')}}
  (l.fiqh&&l.fiqh.conditions||[]).filter(i=>gapTest(i.d)).forEach(i=>gaps.push('- بند قيد الاستكمال: '+i.t+' (`'+i.id+'`)'));
  body.push('','**ثغرات معلنة:**',...(gaps.length?gaps:['- لا شيء معلن.']));
  body.push('','عدد مسائل الخلاف: '+kh.length+'، أسئلة الاختبار: '+(l.quiz||[]).length);}}
const head=['# ملف المراجعة العلمية: فِقْهُ الرُّوح (لم يراجعه عالم)','','يهدف الملف إلى تسهيل مراجعة التطبيق: لكل درس روابطه ومراجعه وثغراته المعلنة. لا يعني أن التطبيق مكتمل أو معتمد، ولم يراجعه أي عالم. لربط التعليقات استعمل رقم الدرس (id) ورقم المسألة (id) المذكورين.','','قراءة الروابط: روابط الموسوعة الفقهية الكويتية مبنية من أرقام الصفحات المسجلة وبصيغة جلبت منها الصفحات فعلاً. المراجع الأخرى تظهر كما سجلت، وبعضها بلا رابط كامل لأنه لم يتحقق، فلم يُخمَّن. الأحاديث المنقولة داخل نصوص الموسوعة لم تُخرَّج ولم تذكر درجتها. الآيات والأحاديث المعروضة بنصها مقارنة بنصوص منشورة (api.alquran.cloud وsunnah.com).','','## الفهرس',...toc];
const tail=['','## ملخص','- عدد الدروس: '+tot.l+'، مسائل الخلاف: '+tot.k+'، مسائل فيها خلية مذهب بلا قول موثق: '+tot.g,'','## ما يحتاج استكمالاً (معلن، وليس خارج الموضوع)','- نجاسة المصلي أثناء الصلاة.','- شروط الإمامة والمسبوق.','- رجوع المالكي للتشهد الأول بعد القيام.','- مكروهات الصلاة (جزء من الصفحات).','- السفر: مدة الإقامة والجمع والمركبات الحديثة.','- الزكاة والصيام: استكمال التفاصيل. صيام التطوع والاعتكاف وزكاة الفطر والمفطرات المعاصرة قيد الاستكمال.','- أحكام التطوع في بقية الأبواب (النوافل، الصدقة، التطوع في الحج والعمرة) قيد الجرد والاستكمال.','- بعض نصوص المذاهب منقولة عن مواقع ثانوية (فتاوى تنقل كتباً حنفية)، وهي موسومة بذلك في خلاياها.'];
fs.writeFileSync('/downloads/fiqh-alruh-review-handoff.md',head.concat(body,tail).join('\n'));console.log(tot)
