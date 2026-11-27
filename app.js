(function(){
const $=s=>document.querySelector(s);
const lk=s=>{const DN={'muslim-library.com':'الموسوعة الفقهية الكويتية','shamela.ws':'المكتبة الشاملة','sunnah.com':'موقع السنة','quran.ksu.edu.sa':'مجمع الملك فهد','islamqa.info':'الإسلام سؤال وجواب','fatihsyuhud.org':'fatihsyuhud.org','dar-alifta.org':'دار الإفتاء المصرية','iifa-aifi.org':'مجمع الفقه الإسلامي الدولي','fatawa-al-lajnah.com':'اللجنة الدائمة','azhar.eg':'الأزهر'};const names=[];s=String(s).replace(/https?:\/\/(?:www\.|read\.)?([^\/\s،)]+)[^\s،)]*/g,(u,d)=>{const n=DN[d]||d;if(names.indexOf(n)<0)names.push(n);return ' '});s=s.replace(/\b[\w-]+(?:\.[\w-]+)*\.(?:org|info|com|ws|sa|eg)\b(?:\/[^\s،)]*)?/g,' ').replace(/صفحات الشاملة/g,'').replace(/\s+(و|،|؛|\|)(?=\s|$)/g,' ').replace(/\s*[:：]\s*(?=[؛،|]|$)/g,'').replace(/[\s،؛|]+$/,'').replace(/\s{2,}/g,' ').replace(/^[\s،؛|:]+/,'').trim();if(!/[\u0621-\u064A]{3}/.test(s))s=names.join('، ');return esc(s)};
const esc=s=>String(s).replace(/\s*\(?\s*https?:\/\/[^\s)،؛]+\s*\)?/g,' ').replace(/\s{2,}/g,' ').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
/* storage with fallback */
const KEY='fiqh_alruh_v1';let mem=null,persist=true;
function load(){if(window.__FIQH_HOST){persist=!!window.__FIQH_HOST.ok;try{if(window.__FIQH_HOST.init)return JSON.parse(window.__FIQH_HOST.init)}catch(e){}return null}try{const r=localStorage.getItem(KEY);if(r)return JSON.parse(r)}catch(e){persist=false}return null}
let S=load()||{dark:false,fs:1,school:'none',bm:[],notes:[],prog:{},last:null,study:null};
const CONTACT_NOTE=null; /* pending user-approved wording + phone; when set: {text:'...'} */
const todayStr=()=>{const d=new Date();return d.getFullYear()+'-'+(d.getMonth()+1)+'-'+d.getDate()};
function study(){const t=todayStr();if(!S.study||S.study.day!==t)S.study={day:t,opened:[],secs:0};return S.study}
let lastAct=Date.now();
const defCfg=()=>({kmode:'all',ev:true,lh:1.85,font:'sans',comfy:false,sound:true,vib:true,deco:true,hide:[],goal:0,colors:{light:{},dark:{}}});const DEF=defCfg();
S.cfg=Object.assign(defCfg(),S.cfg||{});S.adhkar=S.adhkar&&typeof S.adhkar==='object'?S.adhkar:{};S.adhkar.prog=S.adhkar.prog||{};S.adhkar.tasbih=S.adhkar.tasbih||{i:0,n:0};S.adhkar.rem=S.adhkar.rem||{};S.adhkar.my=Array.isArray(S.adhkar.my)?S.adhkar.my:[];S.adhkar.mytasbih=Array.isArray(S.adhkar.mytasbih)?S.adhkar.mytasbih:[];S.adhkar.mysel=S.adhkar.mysel||null;if(!Array.isArray(S.cfg.hide))S.cfg.hide=[];if(!S.cfg.colors||!S.cfg.colors.light||!S.cfg.colors.dark)S.cfg.colors={light:{},dark:{}};
const COLS=[['bg','الخلفية'],['card','البطاقات'],['tx','النص'],['pri','الأزرار والعناصر المحددة والرأس'],['hd','العناوين والروابط'],['ic','الأيقونات'],['acc','اللون الذهبي (الخطوط المميزة)'],['bd','الحدود']];
const DEFCOL={light:{bg:'#FAF8F5',card:'#FFFFFF',tx:'#1C2420',pri:'#0F4C3A',acc:'#C59B27',bd:'#E8E2D5',hd:'#0F4C3A',ic:'#0F4C3A'},dark:{bg:'#0B1411',card:'#13211B',tx:'#F2EFE9',pri:'#D8B54F',acc:'#E0BE62',bd:'#25382F',hd:'#D8B54F',ic:'#D8B54F'}};
const HEX=/^#[0-9a-fA-F]{6}$/;
const lum=h=>{const c=[1,3,5].map(i=>parseInt(h.substr(i,2),16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const ctr=(a,b)=>{const x=lum(a),y=lum(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05)};
const mix=(a,b,t)=>'#'+[1,3,5].map(i=>Math.round(parseInt(a.substr(i,2),16)*(1-t)+parseInt(b.substr(i,2),16)*t).toString(16).padStart(2,'0')).join('');
const mode=()=>S.dark?'dark':'light';
const colv=(k,o)=>{o=o||S.cfg.colors[mode()];return o[k]||((k==='hd'||k==='ic')&&o.pri)||DEFCOL[mode()][k]};
function warnCol(o){o=o||S.cfg.colors[mode()];const w=[];const r1=ctr(colv('tx',o),colv('bg',o)),r2=ctr(colv('tx',o),colv('card',o)),pri=colv('pri',o),on=lum(pri)>.4?'#0B1411':'#FFFFFF',r3=ctr(pri,colv('bg',o)),r4=ctr(colv('hd',o),colv('bg',o)),r5=ctr(colv('hd',o),colv('card',o));if(r1<4.5)w.push('النص على الخلفية ضعيف الوضوح');if(r2<4.5)w.push('النص على البطاقات ضعيف الوضوح');if(r3<3)w.push('لون الأزرار قريب من الخلفية');if(r4<3||r5<3)w.push('لون العناوين قريب من الخلفية');if(S.dark&&ctr(colv('tx',o),'#0F2019')<4.5)w.push('النص على شريط العنوان الداكن ضعيف الوضوح');return w}
const visW=w=>S.cfg.hide.indexOf(w.id)<0;
function save(){const j=JSON.stringify(S);if(window.__FIQH_HOST){try{persist=!!window.__FIQH_HOST.save(j)}catch(e){persist=false}return}try{localStorage.setItem(KEY,j)}catch(e){persist=false}}
const LESSONS=[];WORSHIPS.forEach(w=>(w.lessons||[]).forEach(l=>{l._w=w;LESSONS.push(l)}));
const STATUSLINE=()=>{const r=WORSHIPS.filter(w=>w.status==='ready').map(w=>w.title),o=WORSHIPS.filter(w=>w.status!=='ready').map(w=>w.title);return 'دروس مفصلة: '+r.join('، ')+'.'+(o.length?' والباقي نظرات عامة: '+o.join('، ')+'.':'')};
const lesson=id=>LESSONS.find(l=>l.id===id);
const P=id=>S.prog[id]||(S.prog[id]={steps:{},quiz:null,opened:false});
/* icons */
const IC={drop:'<path d="M12 3c3 4 6 7 6 11a6 6 0 0 1-12 0c0-4 3-7 6-11z"/>',arch:'<path d="M4 21V10a8 8 0 0 1 16 0v11M8 21v-9a4 4 0 0 1 8 0v9"/>',coin:'<circle cx="12" cy="12" r="8"/><path d="M12 7v10M9.5 9.5c0-1 1-1.6 2.5-1.6s2.5.6 2.5 1.6-1 1.4-2.5 1.8-2.5.8-2.5 1.8 1 1.6 2.5 1.6 2.5-.6 2.5-1.6"/>',crescent:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',kaaba:'<path d="M4 8l8-3 8 3v11l-8 2-8-2z"/><path d="M4 8l8 3 8-3M12 11v10"/>',home:'<path d="M4 11l8-7 8 7v9H4z"/><path d="M10 20v-6h4v6"/>',list:'<path d="M5 6h14M5 12h14M5 18h14"/>',help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.4-1 .9-1 1.7M12 17h.01"/>',pen:'<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="M14 6l3 3"/>',bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.7 21a2 2 0 0 1-3.4 0"/>',moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h.01a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h.01a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v.01a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>'};
const ico=n=>'<svg viewBox="0 0 24 24">'+IC[n]+'</svg>';
/* helpers */
const norm=s=>String(s).replace(/[\u064B-\u065F\u0670\u0640]/g,'').replace(/[أإآ]/g,'ا').replace(/ؤ/g,'و').replace(/ئ/g,'ي').replace(/ء/g,'').replace(/ى/g,'ي').replace(/ة/g,'ه').toLowerCase();
const KGAP=/لم (تنص|تقرأ|يقرأ|تذكر|تستكمل|يستكمل)|لم أقرأ|غير مقروء|مقطوع|لم يفصل|لم تفصل|قيد الاستكمال|يحتاج إلى مراجعة مصدر/;
const kHas=(k,s)=>{const t=((k.v||{})[s]||'').replace(/[\u064B-\u0652\u0670\u0640]/g,'');return !!t.trim()&&!KGAP.test(t)};
function toast(t){if(window.__FIQH_HOST){const m=document.getElementById('hostmsg');if(m){m.textContent=t;m.style.display='block';clearTimeout(toast._t);toast._t=setTimeout(()=>{m.style.display='none'},3500)}return}const d=document.createElement('div');d.className='toast';d.textContent=t;document.body.appendChild(d);setTimeout(()=>d.remove(),1800)}
function toastClear(){clearTimeout(toast._t);const m=document.getElementById('hostmsg');if(m)m.style.display='none';document.querySelectorAll('.toast').forEach(d=>d.remove())}
const isBM=id=>S.bm.some(b=>b.id===id);
const SK=['hanafi','maliki','shafii','hanbali'];
function orderedSchools(){return S.school!=='none'?[S.school].concat(SK.filter(k=>k!==S.school)):SK}
/* lesson index: all searchable/bookmarkable entries */
function entries(l){const out=[],f=l.fiqh,M=l.meaning;
 const add=(sec,tab,arr,lab)=>arr.forEach(c=>out.push({id:l.id+'.'+sec+'.'+c.id,lesson:l.id,tab,sec:lab,title:c.t,text:c.d,ref:c.ref||''}));
 add('c','fiqh',f.conditions,(l.labels&&l.labels.c)||'الشروط');add('p','fiqh',f.pillars,(l.labels&&l.labels.p)||'الأركان');add('o','fiqh',f.obligations,(l.labels&&l.labels.o)||'الواجبات');add('s','fiqh',f.sunan,(l.labels&&l.labels.s)||'السنن');add('n','fiqh',f.nullifiers,(l.labels&&l.labels.n)||'المبطلات والنواقض');
 add('mw','meaning',M.why,'المعنى');add('ms','meaning',M.symbols,'المعنى');add('mi','meaning',M.impact,'الأثر');
 l.steps.forEach(s=>out.push({id:l.id+'.step.'+s.n,lesson:l.id,tab:'steps',sec:'خطوة',title:s.name,text:s.action+' '+(s.dhikrNone?'':s.dhikr),ref:s.ref||''}));
 l.evidence.forEach(e=>out.push({id:l.id+'.e.'+e.id,lesson:l.id,tab:'fiqh',sec:'دليل',title:e.ref,text:e.text,ref:e.ref}));
 l.khilaf.forEach(k=>out.push({id:l.id+'.k.'+k.id,lesson:l.id,tab:'khilaf',sec:'خلاف',title:k.issue,text:SK.filter(x=>kHas(k,x)).map(x=>SCHOOLS[x].name+': '+k.v[x]).join(' | '),ref:''}));
 l.mistakes.forEach(m=>out.push({id:l.id+'.x.'+m.id,lesson:l.id,tab:'fiqh',sec:'أخطاء شائعة',title:m.t,text:m.d,ref:''}));
 return out}
const ALL=[];LESSONS.forEach(l=>entries(l).forEach(e=>{e.lt=l.title;ALL.push(e)}));
SITUATIONS.forEach(s=>ALL.push({id:'sit.'+s.id,lesson:null,tab:'sit',sec:'موقف',title:s.q,text:s.a+' '+s.d,ref:s.ref,lt:'مواقف سريعة'}));
const byId=id=>ALL.find(e=>e.id===id);
/* routing */
let R={r:'home',a:'',b:''};
let curHash=(location.hash||'').slice(1);function go(h){curHash=h;try{history.replaceState(null,'','#'+h)}catch(e){}parse();render(true)}
function parse(){const h=curHash.replace(/^#\/?/,'').split('/');R={r:h[0]||'home',a:h[1]||'',b:h[2]||''}}
window.addEventListener('hashchange',()=>{if(window.__FIQH_HOST)return;curHash=location.hash;parse();render(true)});
let lens='fiqh',stepIdx=0,qState=null,sitCat='الكل',sitQ='',mineTab='bm',searchQ='';
function lessonLens(){return lens}
/* count helpers (all from data) */
const cnt=l=>({rul:l.fiqh.conditions.length+l.fiqh.pillars.length+l.fiqh.obligations.length+l.fiqh.sunan.length+l.fiqh.nullifiers.length,men:l.meaning.why.length+l.meaning.symbols.length+l.meaning.impact.length});
function lessonPct(l){const p=P(l.id);const done=Object.keys(p.steps).filter(k=>p.steps[k]).length;const tot=l.steps.length+1;return Math.round((done+(p.quiz?1:0))/tot*100)}
/* views */
function cardActs(id,title){return '<div class="acts"><button data-bm="'+id+'" class="'+(isBM(id)?'on':'')+'" aria-label="حفظ في المفضلة">'+(isBM(id)?'★':'☆')+'</button><button data-note="'+id+'" aria-label="إضافة ملاحظة">✎</button></div>'}
function infoCard(l,c,secKey){return infoCard0(l,c,secKey)+(l.pt?'<div class="under">'+underPoint(l,c)+'</div>':'')}
function infoCard0(l,c,secKey){const id=l.id+'.'+secKey+'.'+c.id;return '<div class="card has-acts" id="c-'+id.replace(/\./g,'_')+'">'+cardActs(id)+'<h3>'+esc(c.t)+(c.kind?' <span class="tag '+(c.kind==='تأمل'?'':'gold')+'">'+esc(c.kind)+'</span>':'')+'</h3><p>'+esc(c.d)+'</p>'+(c.ref?'<div class="ev">المصدر: '+lk(c.ref)+'</div>':'')+'</div>'}
const GLOSS_SRC="الموسوعة الفقهية الكويتية: حكم (ج18 ص65-66) https://shamela.ws/book/11430bu/10761 و https://shamela.ws/book/11430bu/10762 | فرض (ج32 ص95-96) https://shamela.ws/book/11430bu/20273 و https://shamela.ws/book/11430bu/20274 | استحباب (ج3 ص214-215) https://shamela.ws/book/11430bu/1761 و https://shamela.ws/book/11430bu/1762 و https://shamela.ws/book/11430bu/1763 | سنة (ج25 ص264-265) https://shamela.ws/book/11430bu/15646 و https://shamela.ws/book/11430bu/15647 و https://shamela.ws/book/11430bu/15648 | ندب (ج40 ص128) https://shamela.ws/book/11430bu/26113 | كراهة (ج34 ص221-222) https://shamela.ws/book/11430bu/21889 و https://shamela.ws/book/11430bu/21890 و https://shamela.ws/book/11430bu/21891 | تحريم (ج10 ص205-206) https://shamela.ws/book/11430bu/6077 و https://shamela.ws/book/11430bu/6078 | الحرام والمكروه عند الحنفية (واجب، ج42 ص330) https://shamela.ws/book/11430bu/28077 | إباحة (ج1) https://muslim-library.com/keoj/volume/1/185/ و https://muslim-library.com/keoj/volume/1/178/ | نفل (ج41 ص100-101) https://shamela.ws/book/11430bu/26813 و https://shamela.ws/book/11430bu/26814";
const GLOSS_WARN=[
["لا يعني \"ليس حراماً\" أن الأمر سواء","الأحكام الخمسة ليست درجات متساوية. فعل المندوب وترك المكروه مطلوبان من الشارع طلباً غير جازم، والمباح ليس مطلوباً فعلاً ولا تركاً. فمن قال لغيره: لا حرج، فمعناه نفي الإثم فقط، ولا يقول إن الفعل والترك عند الشرع سواء."],
["المندوب: مطلوب ومحبوب للشارع","قالت الموسوعة: سمي مستحباً من حيث إن الشارع يحبه ويؤثره (ندب، ج40 ص128). وغير الحنفية: يمدح فاعله ويثاب ولا يذم تاركه ولا يعاقب. فترك المندوب لا إثم فيه، لكنه تفويت لثواب مطلوب، وليس مثل ترك المباح الذي لا طلب فيه."],
["المكروه: تركه أولى","عرفت الموسوعة الكراهة بأنها خطاب الشارع المقتضي الكف عن الفعل اقتضاء غير جازم (كراهة، ج34 ص221)، وقالت إن المكروه راجح الترك (واجب، ج42 ص330). فالشرع طلب تركه، وإن لم يعاقب فاعله. فليس مثل المباح الذي يستوي فيه الفعل والترك. والعبارة المباشرة \"يكرهه الله\" أو \"يبغضه الله\" لم ترد في الصفحات المعتمدة هنا، فلا تنسب في التطبيق."],
["ولا تسوّ بين المباح والمندوب","المباح: تخيير بين الفعل والترك، ولا طلب فيه. المندوب: مطلوب فعله وفيه ثواب. فمن ترك مندوباً فقد ترك ثواباً مطلوباً، لا مباحاً."]];
const GLOSS=[
{t:"الفرض والواجب",d:"طلب الفعل طلباً جازماً، أي لا يجوز تركه. مثال: الصلوات الخمس.",x:"عند الجمهور الفرض والواجب بمعنى واحد (إلا في الحج). وعند الحنفية، وفي رواية عن أحمد، يفترقان: الفرض ما ثبت بدليل قطعي، والواجب ما ثبت بدليل ظني. وعند الحنفية يكفر جاحد الفرض ولا يكفر جاحد الواجب، ويفسق تاركه. ومثال الواجب عندهم الوتر عند أبي حنيفة."},
{t:"المندوب والمستحب والسنة والنافلة",d:"طلب الفعل طلباً غير جازم. يمدح فاعله ويثاب، ولا يذم تاركه ولا يعاقب (عند غير الحنفية). مثال: صلاة الضحى مستحبة بحسب الموسوعة.",x:"عند الشافعية والحنابلة هذه الألفاظ مترادفة: المندوب والمستحب والسنة والتطوع. وذكرت الموسوعة في مرادفات المستحب أيضاً: الطاعة والنافلة والنفل والقربة والمرغب فيه والإحسان والفضيلة والرغيبة والأدب والحسن. وفرق القاضي حسين من الشافعية: السنة ما واظب عليه النبي ﷺ، والمستحب ما فعله مرة أو مرتين، والتطوع ما ينشئه الإنسان من الأوراد، وقالت الموسوعة إن هذا الخلاف لفظي. وعند الحنفية: المستحب ما فعله النبي ﷺ مرة وتركه أخرى، ودون السنن المؤكدة، ويسمى مندوباً وتطوعاً ونفلاً، ولا يكره تركه أصلاً. وعند المالكية: السنة ما فعله النبي ﷺ وواظب عليه وأظهره في جماعة ولم يدل دليل على وجوبه، والرغيبة ما رغب فيه الشارع ولم يظهره في جماعة، والنفل ما فعله ولم يداوم عليه."},
{t:"السنة المؤكدة وغير المؤكدة",d:"درجتان داخل المندوب بحسب المواظبة. مثال: التراويح سنة مؤكدة عند الحنفية والحنابلة وبعض المالكية بحسب الموسوعة.",x:"الحنفية: سنة الهدى (يتعلق بتركها كراهة أو إساءة، وتسمى المؤكدة، كالجماعة والأذان والإقامة) وسنن الزوائد (لا كراهة ولا إساءة في تركها، كأفعاله ﷺ العادية في لباسه وأكله). الشافعية والحنابلة يقسمون السنن إلى مؤكدة وغير مؤكدة، والحنابلة يقولون: ترك المؤكدة مكروه وترك غير المؤكدة ليس مكروهاً."},
{t:"المباح",d:"ما ليس مطلوب الفعل ولا الترك، أي الشرع خيّر فيه. مثال في الموسوعة: إباحة الأكل والشرب (إباحة شرعية).",x:"الإباحة تخيير المكلف بين الفعل والترك. ومن ألفاظها الصريحة في النصوص نفي الجناح والإثم والمؤاخذة، وغير الصريحة: الأمر بعد الحظر كقوله تعالى ﴿وإذا حللتم فاصطادوا﴾. وسماه بعض الأصوليين كالآمدي: الحكم التخييري."},
{t:"المكروه وخلاف الأولى",d:"طلب الترك طلباً غير جازم، وهو ما كان راجح الترك. وعند الحنفية نوعان: مكروه تحريماً (أقرب إلى الحرام، ورتبته رتبة الواجب، فلا يثبت إلا بدليل ظني) ومكروه تنزيهاً (أقرب إلى الحل، تركه أولى، ويقابل المندوب). مثال في الموسوعة: ترك تحية المسجد (ركعتين) لمن دخل المسجد وجلس، لحديث النهي المخصوص.",x:"الحنفية: ذكر ابن عابدين عن البحر أن المكروه تحريماً هو المحمل عند إطلاقهم الكراهة في مكروهات الصلاة، وأن محمداً يسميه حراماً ظنياً، وأنه إذا ذكروا مكروهاً نظروا في دليله: فإن كان نهياً ظنياً حكموا بكراهة التحريم إلا لصارف إلى الندب، وإن لم يكن الدليل نهياً بل طلب ترك غير جازم فهي تنزيهية. وقد يطلق المكروه على الحرام (ذكر الزركشي ذلك عن عبارة الشافعي ومالك، وعن المتقدمين كراهة إطلاق لفظ التحريم). وذكر الزركشي أن المكروه يطلق على الحرام، وعلى ما نهي عنه نهي تنزيه، وعلى ترك الأولى (وأمر رابع في صفحة لم تدخل في هذا المفتاح). إذا ورد في ترك المستحب نهي غير مخصوص (يفهم من الأمر بالمستحب عموماً) فهو خلاف الأولى، كترك صلاة الضحى. والمتقدمون يطلقون المكروه على النهي المخصوص وغيره. وعند الحنفية: الكراهة التنزيهية، وبينها وبين الحرمة الكراهة التحريمية."},
{t:"الحرام (المحرم)",d:"طلب الترك طلباً جازماً، أي لا يجوز فعله. مثال: تحريم الخمر والميسر (المائدة 90) وتحريم الربا (البقرة 275)، أوردتهما الموسوعة مثالين لتحريم ثبت بنص قطعي عند أصوليي الحنفية.",x:"الجمهور: الحرام ما يذم شرعاً فاعله. الحنفية: ما ثبت الكف عنه بدليل قطعي لا شبهة فيه، وهو مقابل للفرض عندهم، ويقع بينه وبين المكروه تنزيهاً المكروه تحريماً الذي يقابل الواجب عندهم."}];
const GLOSS_NOTE="الأقسام عند الجمهور خمسة: الفرض والندب والإباحة والحرمة والكراهة. وتزيد عند الحنفية قسمين: الوجوب (بين الفرض والندب) والكراهة التحريمية (بين الحرمة والكراهة التنزيهية). والمندوب والمستحب لفظان لمعنى واحد عند الجمهور، لا قسمان مختلفان. ومن الأصوليين من يخرج المندوب من الحكم التكليفي لأنه ليس فيه إلزام (الآمدي).";
function glossCard(o){return '<div class="card"><span class="tag gold">مفتاح المصطلحات</span><h3>معنى الفرض والمندوب والمباح والمكروه والحرام</h3><details'+(o?' open':'')+'><summary>افتح المفتاح: الفرض، المندوب والمستحب والسنة، المباح، المكروه، الحرام</summary><div style="border:1px solid var(--gold,#c9a24a);border-radius:12px;padding:8px 12px;margin:8px 0"><b>تنبيه: الفرق بين ما ليس حراماً وما هو سواء</b>'+GLOSS_WARN.map(w=>'<p style="margin:6px 0"><b>'+esc(w[0])+'.</b> '+esc(w[1])+'</p>').join('')+'</div><p class="mut">كل درس في التطبيق يستعمل هذه الألفاظ. الألفاظ هنا أحكام الفعل نفسه، والخلاف بين المذاهب في بعضها مذكور.</p>'+GLOSS.map(g=>'<div style="margin-top:10px"><b>'+esc(g.t)+'</b><p style="margin:4px 0">'+esc(g.d)+'</p><details><summary>الفروق بين المذاهب</summary><p>'+esc(g.x)+'</p></details></div>').join('')+'<p class="mut" style="margin-top:10px">'+esc(GLOSS_NOTE)+'</p><div class="ev">المصادر: '+esc(GLOSS_SRC)+'</div></details></div>'}
function vHome(){
 const last=S.last&&lesson(S.last.lesson);
 const day=Math.floor(Date.now()/864e5)%REFLECTIONS.length,r=REFLECTIONS[day];
 let h='<div class="card" style="background:var(--green,#0f4d3a);color:#fff;text-align:center;border:0;padding:10px"><p class="ar" style="font-size:1rem;line-height:1.7;margin:2px 0">الجنة تُطلب بالعمل، والنار تُتَّقى بالطاعة. فاحرص على فرضك، وزد من نوافلك، وابتعد عمّا حرّم الله.</p><div style="font-size:.7rem;opacity:.85">عبارة تذكيرية من إعداد التطبيق، وليست آية ولا حديثاً.</div></div>';
 if(last){const l=last;h+='<button class="card" style="width:100%;text-align:right" data-go="lesson/'+l.id+'"><span class="tag gold">أين توقفت؟</span><h3>'+esc(l.title)+'</h3><div class="mut">'+(S.last.tab==='steps'?'دليل الأداء، الخطوة '+AR(S.last.step+1)+' من '+AR(l.steps.length):'آخر ما فتحته: '+tabName(S.last.tab))+'</div><div class="bar"><i style="width:'+lessonPct(l)+'%"></i></div></button>'}
 else h+='<div class="card"><span class="tag gold">أين توقفت؟</span><p class="mut">لم تفتح درساً بعد. ابدأ بدرس الوضوء.</p><button class="btn pri" data-go="lesson/wudu">ابدأ الوضوء</button></div>';
 if(S.cfg.goal){const st=study();h+='<div class="card"><b>هدف اليوم:</b> '+AR(st.opened.length)+' من '+AR(S.cfg.goal)+' درس<div class="bar"><i style="width:'+Math.min(100,Math.round(st.opened.length/S.cfg.goal*100))+'%"></i></div></div>'}
 h+='<button class="card" style="width:100%;text-align:right" data-go="gloss"><span class="tag gold">مفتاح المصطلحات</span><h3>معنى الفرض والمندوب والمباح والمكروه والحرام</h3><div class="mut">افتحها مباشرة بضغطة واحدة</div></button>';h+='<h2>العبادات</h2><div class="grid">'+WORSHIPS.filter(visW).map(w=>{let tags,pct='';if(w.status==='ready'){const ls=w.lessons;const c=ls.reduce((a,l)=>({r:a.r+cnt(l).rul,m:a.m+cnt(l).men}),{r:0,m:0});tags='<span class="tag">'+AR(ls.length)+' درس</span><span class="tag">'+AR(c.r)+' بطاقة حكم</span><span class="tag">'+AR(c.m)+' معاني</span>';pct='<div class="bar"><i style="width:'+Math.round(ls.reduce((a,l)=>a+lessonPct(l),0)/ls.length)+'%"></i></div>'}else tags='<span class="tag">نظرة عامة فقط</span>';
 return '<button class="wcard" data-go="worship/'+w.id+'"><div class="ico">'+ico(w.icon)+'</div><h3>'+esc(w.title)+'</h3><div>'+tags+'</div>'+pct+'</button>'}).join('')+'</div>';
h+='<details class="card"><summary><b>مفتاح المصطلحات</b> (فرض، مندوب، مباح، مكروه)</summary>'+glossCard()+'</details>';
 h+='<details class="card"><summary><b>معنى اليوم</b></summary><div><span class="tag gold">تأمل</span><h3>'+esc(r.t)+'</h3><p class="ar" style="font-size:1.2rem">'+esc(r.d)+'</p><div class="ev">'+esc(r.kind)+' | '+lk(r.ref)+'</div><div class="row" style="margin-top:8px"><button class="btn" data-bm="refl.'+r.id+'">'+(isBM('refl.'+r.id)?'محفوظ ★':'احفظ ☆')+'</button><button class="btn" data-go="lesson/'+r.lesson+'">افتح الدرس</button></div></div></details>';
 h+='<details class="card"><summary><b>قراءات للاستزادة في المعاني</b></summary><div class="mut">هذه روابط أرسلتها للاطلاع على المعاني والأسرار، ولم يؤخذ منها حكم فقهي في التطبيق. قراءتها تحتاج إنترنت.<ul><li>أثر العبادات في تهذيب النفوس (إسلام ويب)</li><li>العلاقة بين العبادات والأخلاق (إسلام ويب)</li><li>أسرار العبادات (شبكة الفكر)</li></ul></div></details>';
 return h}
const disc=()=>'<p class="disc">'+DISCLAIMER+'</p>';
const tabName=t=>({fiqh:'الحكم الفقهي',meaning:'المعنى والروح',steps:'دليل الأداء',khilaf:'الخلاف',quiz:'الاختبار'}[t]||t);
function vGloss(){return '<button class="back" data-go="home">‹ الرئيسية</button><h2 style="margin-top:0">مفتاح المصطلحات</h2>'+glossCard(1)}
function vWorship(){
 if(R.a){const w=WORSHIPS.find(x=>x.id===R.a);if(!w)return'<p>غير موجود</p>';
  let h='<button class="back" data-go="worship">‹ العبادات</button><h2 style="margin-top:0">'+esc(w.title)+'</h2>';
  if(w.status==='ready')h+=w.lessons.map(l=>'<button class="card" style="width:100%;text-align:right" data-go="lesson/'+l.id+'"><h3>'+esc(l.title)+'</h3><div class="mut">'+esc(l.hukm)+'</div><div class="bar"><i style="width:'+lessonPct(l)+'%"></i></div><div class="ev">التقدم: '+AR(lessonPct(l))+'٪ (خطوات الأداء والاختبار)</div></button>').join('');
  else{const o=w.overview;h+='<div class="banner">هذه نظرة عامة مختصرة. الدرس التفصيلي بالأركان والخلاف والاختبار لم يُكتب بعد.</div><div class="card"><h3>التعريف</h3><p>'+esc(o.definition)+'</p></div><div class="card"><h3>أهم ما يُعرف الآن</h3>'+o.points.map(p=>'<p>• '+esc(p)+'</p>').join('')+'</div>'+o.evidence.map(e=>evCard(e)).join('')+(o.sources?'<div class="card mut">المصادر: '+esc(o.sources)+'</div>':'')+'<div class="card mut">'+esc(o.next)+'</div>'}
  return h}
 return '<h2 style="margin-top:0">العبادات</h2><button class="card" style="width:100%;text-align:right" data-go="gloss"><span class="tag gold">مفتاح المصطلحات</span><h3>معنى الفرض والمندوب والمباح والمكروه والحرام</h3><div class="mut">افتحها مباشرة بضغطة واحدة</div></button>'+WORSHIPS.filter(visW).map(w=>'<button class="card" style="width:100%;text-align:right;display:flex;gap:12px;align-items:center" data-go="worship/'+w.id+'"><div class="ico" style="color:var(--pri)">'+ico(w.icon)+'</div><div><h3>'+esc(w.title)+'</h3><div class="mut">'+esc(w.blurb)+'</div></div></button>').join('')}
function evCard(e){return '<div class="card"><div class="q">'+(e.type==='quran'?'﴿ ':'')+esc(e.text)+(e.type==='quran'?' ﴾':'')+'<small>'+(e.type==='quran'?'آية':'حديث')+' | '+esc(e.ref)+(e.exact===false?' | نقل بالمعنى':'')+'</small></div></div>'}
function vLesson(){
 const l=lesson(R.a);if(!l)return'<p>غير موجود</p>';
 P(l.id).opened=true;
 const st=study();if(st.opened.indexOf(l.id)<0)st.opened.push(l.id);
 const tab=lens;
 S.last={lesson:l.id,tab:lens,step:stepIdx};save();
 const tabs=[['fiqh','الحكم الفقهي'],['meaning','المعنى والروح']];
 let h='<button class="back" data-go="worship/'+l._w.id+'">‹ '+esc(l._w.title)+'</button><h2 style="margin:0">'+esc(l.title)+'</h2>';
 h+='<div class="seg" role="tablist"><span class="pill" style="right:'+(tab==='meaning'?'50%':'4px')+'"></span>'+tabs.map(t=>'<button role="tab" data-lens="'+t[0]+'" class="'+(tab===t[0]?'on':'')+'">'+t[1]+'</button>').join('')+'</div>';
 h+='<div class="sub">'+[['steps','دليل الأداء'],['khilaf','الخلاف بين المذاهب'],['quiz','اختبار قصير']].filter(t=>t[0]!=='khilaf'||l.khilaf.length).map(t=>'<button class="chip" data-go="lesson/'+l.id+'/'+t[0]+'">'+t[1]+'</button>').join('')+'</div>';
 const bk='<button class="back" data-go="lesson/'+l.id+'">‹ '+esc(l.title)+'</button>';
 if(R.b==='steps')return bk+vSteps(l);
 if(R.b==='khilaf')return bk+vKhilaf(l);
 if(R.b==='quiz')return bk+vQuiz(l);
 if(tab==='fiqh'){
  h+='<div class="card"><h3>التعريف</h3><p>'+esc(l.definition)+'</p><h3 style="margin-top:8px">الحكم</h3><p>'+esc(l.hukm)+'</p><div class="ev">'+lk(l.hukmRef)+'</div></div>';
  if(l.pt)h+='<div class="under">'+underPoint(l,{ev:l.hukmEv,kh:l.hukmKh},1)+'</div>';
  const sec=(t,arr,k)=>(k==='n'&&!arr.length)?'':'<h2>'+t+' <span class="tag">'+AR(arr.length)+'</span></h2>'+arr.map(c=>infoCard(l,c,k)).join('');
  h+=sec((l.labels&&l.labels.c)||'الشروط',l.fiqh.conditions,'c')+sec((l.labels&&l.labels.p)||'الأركان',l.fiqh.pillars,'p')+sec((l.labels&&l.labels.o)||'الواجبات',l.fiqh.obligations,'o')+sec((l.labels&&l.labels.s)||'السنن',l.fiqh.sunan,'s')+sec((l.labels&&l.labels.n)||'المبطلات والنواقض',l.fiqh.nullifiers,'n');
  h+=(l.pt?'<details class="allev"><summary><b>جميع أدلة الدرس في موضع واحد</b></summary>':'')+'<h2>الدليل من القرآن والسنة</h2>'+(S.cfg.ev?l.evidence.map(evCard).join(''):'<div class="card mut">الأدلة مخفية حسب إعداداتك. فعّلها من الإعدادات، ولا تعتمد على الحكم دون دليله.</div>');
  if(l.pt)h+='</details>';
  h+='<h2>أخطاء شائعة وتنبيهات</h2>'+l.mistakes.map(m=>'<div class="card has-acts">'+cardActs(l.id+'.x.'+m.id)+'<h3>'+esc(m.t)+'</h3><p>'+esc(m.d)+'</p></div>').join('');
 }else{
  const emptyM=!l.meaning.why.length&&!l.meaning.symbols.length&&!l.meaning.impact.length;
  if(!emptyM)h+='<div class="banner">في هذا التبويب: آيات وأحاديث مصنّفة كذلك، وتأملات موسومة بـ«تأمل». التأملات اجتهاد تربوي وليست أحكاماً شرعية.</div>';
  const sec=(t,arr,k)=>arr.length?'<h2>'+t+'</h2>'+arr.map(c=>infoCard(l,c,k)).join(''):'';
  h+=sec('لماذا شُرعت؟',l.meaning.why,'mw')+sec('ما الذي تعنيه الأفعال والأذكار؟',l.meaning.symbols,'ms')+sec('الأثر في القلب والسلوك',l.meaning.impact,'mi')
  if(!l.meaning.why.length&&!l.meaning.symbols.length&&!l.meaning.impact.length)h+='<div class="card"><p>هذا الدرس في الأحكام وأدلتها. الأحكام في تبويب «الحكم الفقهي»، والخلاف في تبويب «الخلاف بين المذاهب».</p></div>';
 }
 return h}
function khCard(l,k,ord,mine,inl){
 ord=ord.filter(x=>kHas(k,x));if(!ord.length)return '';
 if(mine&&!kHas(k,S.school))mine=false;
 const cell=(k,s)=>'<b class="'+(s===S.school?'pref':'')+'">'+SCHOOLS[s].name+'</b><span class="'+(s===S.school?'pref':'')+'">'+esc(k.v[s])+'</span>';
 return '<div class="card has-acts'+(inl?' kin':'')+'">'+(inl?'':cardActs(l.id+'.k.'+k.id))+'<h3>'+esc(k.issue)+'</h3>'+(mine?'<div class="sch">'+cell(k,S.school)+'</div><details><summary>أقوال المذاهب الأخرى</summary><div class="sch">'+ord.filter(x=>x!==S.school).map(x=>cell(k,x)).join('')+'</div></details>':'<div class="sch">'+ord.map(x=>cell(k,x)).join('')+'</div>')+(k.note?'<div class="ev k">'+lk(k.note)+'</div>':'')+'</div>'}
function underPoint(l,c,top){
 let h='';
 if(c.ev&&c.ev.length){h+='<div class="uev"><h4>الدليل على هذه المسألة</h4>'+(S.cfg.ev?c.ev.map(id=>evCard(l.evidence.find(e=>e.id===id))).join(''):'<div class="card mut">الأدلة مخفية حسب إعداداتك.</div>')+'</div>'}

 if(c.kh&&c.kh.length){const ord=orderedSchools();const mine=S.cfg.kmode==='mine'&&S.school!=='none';const body=c.kh.map(id=>khCard(l,l.khilaf.find(k=>k.id===id),ord,mine,true)).join('');h+='<div class="ukh">'+(c.kh.length>4?'<details><summary><b>'+(top?'مسائل خلافية عامة في الدرس':'أقوال المذاهب في هذه المسألة')+' ('+AR(c.kh.length)+' مسائل)</b></summary>'+body+'</details>':'<h4>'+(top?'مسائل خلافية عامة في الدرس':'أقوال المذاهب في هذه المسألة')+'</h4>'+body)+'</div>'}
 return h}
function vKhilaf(l){
 if(!l.khilaf.length)return '<h2>الخلاف</h2><div class="card mut">هذا الدرس يعرض قرارات وفتاوى منسوبة إلى جهاتها، وليست أقوال المذاهب الأربعة، فلا يوجد جدول خلاف مذاهب هنا. الاختلاف بين الجهات مذكور في بطاقات الحكم الفقهي.</div>';
 let h='<h2>الخلاف بين المذاهب</h2><div class="banner">لا نرجّح هنا. تُعرض في كل مسألة المذاهب التي وُثّق لها قول فيها فقط. اختيارك للمذهب المفضل (في الإعدادات) يغيّر الترتيب فقط. مصدر كل مسألة تحتها. <details><summary>حدود التوثيق</summary>'+esc(SOURCE_NOTE)+'</details></div>';
 const ord=orderedSchools();
 const mine=S.cfg.kmode==='mine'&&S.school!=='none';
 if(mine)h+='<div class="card mut">عرض مذهبك فقط ('+SCHOOLS[S.school].name+') مع بقية المذاهب تحت كل مسألة في «أقوال المذاهب الأخرى». غيّر ذلك من الإعدادات.</div>';
 const cell=(k,s)=>'<b class="'+(s===S.school?'pref':'')+'">'+SCHOOLS[s].name+'</b><span class="'+(s===S.school?'pref':'')+'">'+esc(k.v[s])+'</span>';
 h+=l.khilaf.map(k=>khCard(l,k,ord,mine)).join('');
 const _unused=l.khilaf.map(k=>'<div class="card has-acts">'+cardActs(l.id+'.k.'+k.id)+'<h3>'+esc(k.issue)+'</h3><div class="sch">'+ord.map(s=>'<b class="'+(s===S.school?'pref':'')+'">'+SCHOOLS[s].name+'</b><span class="'+(s===S.school?'pref':'')+'">'+esc(k.v[s])+'</span>').join('')+'</div>'+(k.note?'<div class="ev k">'+lk(k.note)+'</div>':'')+'</div>').join('');
 h+='<div class="card mut">مصدر كل مسألة مذكور تحتها. أكثر الخلايا منقول من الموسوعة الفقهية الكويتية كما هي، وبعض الخلايا رُوجعت فرادى من صفحات كتب المذاهب المطبوعة مقروءة من مصورات منشورة، والمراجعة من المصادر مستمرة ولم تكتمل.</div>';
 return h}
function vSteps(l){
 const p=P(l.id);if(stepIdx>=l.steps.length)stepIdx=0;const s=l.steps[stepIdx];const done=!!p.steps[s.n];
 S.last={lesson:l.id,tab:'steps',step:stepIdx};save();
 let h='<h2>دليل الأداء خطوة بخطوة</h2><div class="mut">أكملت '+AR(Object.keys(p.steps).filter(k=>p.steps[k]).length)+' من '+AR(l.steps.length)+' خطوة</div>';
 h+='<div class="dots">'+l.steps.map((x,i)=>'<button data-step="'+i+'" class="'+(i===stepIdx?'on ':'')+(p.steps[x.n]?'done':'')+'" aria-label="خطوة '+x.n+'">'+AR(x.n)+'</button>').join('')+'</div>';
 h+='<div class="card step"><span class="tag gold">الخطوة '+AR(s.n)+'</span><h3 style="font-size:1.2rem">'+esc(s.name)+'</h3>'+String(s.action).split('\n').map((ln,ix)=>{const k=ln.indexOf('::');return '<p style="text-align:right;margin:6px 0">'+(k>0?'<b>'+esc(ln.slice(0,k))+':</b> '+esc(ln.slice(k+2)):(ix===0?'<b>الفعل:</b> ':'')+esc(ln))+'</p>'}).join('')
 +'<div class="dh '+(s.dhikrNone?'mut':'')+'" style="'+(s.dhikrNone?'font-family:inherit;font-size:.95rem':'')+'">'+esc(s.dhikr)+(s.dhikrNone?'':'<small class="ev" style="display:block;font-family:inherit">'+(s.dhikrExact?'الذكر':'الذكر (سنة)')+'</small>')+'</div>'
 +(s.whisper?'<div class="wh"><b>همسة روحية</b> <span class="tag">'+esc(s.wkind||'تأمل، وليست حكماً')+'</span><br>'+esc(s.whisper)+'</div>':'')+(s.ref?'<div class="ev" style="margin-top:6px;text-align:right">المصدر: '+lk(s.ref)+'</div>':'')
 +'<div class="row" style="margin-top:12px;justify-content:space-between"><button class="btn" data-sp="-1" '+(stepIdx===0?'disabled':'')+'>السابق</button><button class="btn '+(done?'':'pri')+'" data-sdone="'+s.n+'">'+(done?'تم ✓ (إلغاء)':'تمّت هذه الخطوة')+'</button><button class="btn" data-sp="1" '+(stepIdx===l.steps.length-1?'disabled':'')+'>التالي</button></div></div>';
 return h}
function vQuiz(l){
 if(!qState||qState.l!==l.id)qState={l:l.id,i:0,score:0,pick:null,fin:false,qs:l.quiz.map((x,i)=>[Math.random(),i]).sort((a,b)=>a[0]-b[0]).slice(0,5).map(x=>l.quiz[x[1]])};
 const q=qState.qs;let h='<h2>اختبار قصير</h2>';
 if(qState.fin){const best=P(l.id).quiz;return h+'<div class="card"><div class="big">نتيجتك: '+AR(qState.score)+' من '+AR(q.length)+'</div><p>أفضل نتيجة محفوظة: '+AR(best.best)+' من '+AR(best.of)+'</p><div class="row"><button class="btn pri" data-qretry="1">أعد الاختبار</button><button class="btn" data-go="lesson/'+l.id+'">رجوع للدرس</button></div></div>'}
 const c=q[qState.i];h+='<div class="mut">السؤال '+AR(qState.i+1)+' من '+AR(q.length)+'</div><div class="card"><h3>'+esc(c.q)+'</h3>'+c.o.map((o,i)=>{let cl='';if(qState.pick!==null){if(i===c.a)cl='right';else if(i===qState.pick)cl='wrong'}return '<button class="opt '+cl+'" data-opt="'+i+'" '+(qState.pick!==null?'disabled':'')+'>'+esc(o)+'</button>'}).join('');
 if(qState.pick!==null)h+='<div class="banner">'+(qState.pick===c.a?'إجابة صحيحة. ':'إجابة غير صحيحة. ')+esc(c.why)+'</div><button class="btn pri" data-qnext="1">'+(qState.i===q.length-1?'النتيجة':'السؤال التالي')+'</button>';
 return h+'</div>'}
function vSit(){
 const cats=['الكل'].concat([...new Set(SITUATIONS.map(s=>s.cat))]);
 const toks=norm(sitQ).split(/\s+/).filter(Boolean);
 const list=SITUATIONS.filter(s=>(sitCat==='الكل'||s.cat===sitCat)&&(!toks.length||toks.every(t=>norm(s.q+' '+s.a).includes(t))));
 let h='<h2 style="margin-top:0">مواقف وأحكام سريعة</h2><div class="banner">إجابات موجزة للمواقف الشائعة، مع ذكر الخلاف حيث يوجد. ليست بديلاً عن سؤال أهل العلم في حالتك.</div><input type="search" id="sitq" placeholder="ابحث في المواقف" value="'+esc(sitQ)+'" style="width:100%;height:46px;border-radius:12px;border:1px solid var(--bd);padding:0 12px;background:var(--card);color:var(--tx)"><div class="chips" style="margin:8px 0">'+cats.map(c=>'<button class="chip '+(c===sitCat?'on':'')+'" data-cat="'+c+'">'+c+'</button>').join('')+'</div>';
 if(!list.length)h+='<div class="card mut">لا توجد مواقف مطابقة. <button class="btn" data-catreset="1">مسح التصفية</button></div>';
 h+=list.map(s=>'<details id="d-'+s.id+'"><summary>'+esc(s.q)+'</summary><div class="has-acts" style="position:relative;padding-left:90px;padding-bottom:10px">'+cardActs('sit.'+s.id)+'<p><b>'+esc(s.a)+'</b></p><p class="mut">'+esc(s.d)+'</p><div class="ev">'+lk(s.ref)+'</div></div></details>').join('');
 return h}
function vMine(){
 let h='<h2 style="margin-top:0">تأملاتي</h2><div class="seg" style="margin-top:0"><span class="pill" style="right:'+(mineTab==='notes'?'50%':'4px')+'"></span><button data-mt="bm" class="'+(mineTab==='bm'?'on':'')+'">المحفوظات ('+AR(S.bm.length)+')</button><button data-mt="notes" class="'+(mineTab==='notes'?'on':'')+'">ملاحظاتي ('+AR(S.notes.length)+')</button></div>';
 if(!persist)h+='<div class="banner">تنبيه: الحفظ الدائم غير متاح هنا (أو تجاوز الحد المسموح)، فما تكتبه يبقى حتى تغلق الصفحة فقط.</div>';
 if(mineTab==='bm'){
  if(!S.bm.length)h+='<div class="card mut">لا شيء محفوظ بعد. اضغط ☆ على أي حكم أو معنى لحفظه هنا.</div>';
  h+=S.bm.map(b=>'<div class="card"><span class="tag">'+esc(b.sec)+'</span><h3>'+esc(b.title)+'</h3><p>'+esc(b.text)+'</p><div class="row"><button class="btn" data-open="'+esc(b.id)+'">افتح في مكانه</button><button class="btn" data-bm="'+esc(b.id)+'">إزالة</button></div></div>').join('')}
 else{
  h+='<button class="btn pri" data-note="free" style="margin-bottom:10px">ملاحظة جديدة</button>';
  if(!S.notes.length)h+='<div class="card mut">لا ملاحظات بعد.</div>';
  h+=S.notes.map(n=>'<div class="card"><div class="ev">'+esc(new Date(n.ts).toLocaleDateString('ar-EG'))+(n.title?' | على: '+esc(n.title):'')+'</div><p style="white-space:pre-wrap">'+esc(n.text)+'</p><div class="row">'+(n.ref&&n.ref!=='free'?'<button class="btn" data-open="'+esc(n.ref)+'">افتح</button>':'')+'<button class="btn" data-ndel="'+n.id+'" id="nd-'+n.id+'">حذف</button></div></div>').join('')}
 return h}
function tg(k,label,desc,locked){const on=locked?true:!!S.cfg[k];return '<div class="srow"><div><b>'+label+'</b>'+(desc?'<div class="mut">'+desc+'</div>':'')+'</div><button class="tgl'+(on?' on':'')+'" role="switch" aria-label="'+label+'" aria-checked="'+on+'" '+(locked?'disabled':'data-cfg="'+k+'"')+'><i></i></button></div>'}
function chs(k,opts,cur,attr){return '<div class="chips wrap">'+opts.map(o=>'<button class="chip '+(cur===o[0]?'on':'')+'" '+attr+'="'+k+':'+o[0]+'">'+o[1]+'</button>').join('')+'</div>'}
function soon(t,why){return '<div class="srow off"><div><b>'+t+'</b><div class="mut">'+why+'</div></div><span class="tag">غير متاح بعد</span></div>'}
function sec(n,title,icon,body,open){return '<details class="card sset"'+(open?' open':'')+'><summary><span class="sico">'+ico(icon)+'</span><span>'+n+' '+title+'</span></summary>'+body+'</details>'}
function vColors(){const o=S.cfg.colors[mode()],w=warnCol();let h='<h3>ألوان التطبيق ('+(S.dark?'الوضع الداكن':'الوضع الفاتح')+')</h3><p class="mut">اختر لوناً لكل عنصر، ويظهر أثره فوراً. الألوان تُحفظ لكل وضع على حدة. لا يُقبل نص أقل تبايناً من الحد الأدنى للقراءة.</p>';
 h+=COLS.map(c=>'<div class="srow"><b>'+c[1]+'</b><span class="crow"><input type="color" data-col="'+c[0]+'" value="'+colv(c[0]).toLowerCase()+'" aria-label="'+c[1]+'"><button class="chip" data-colreset="'+c[0]+'">'+(o[c[0]]?'الأصلي':'أصلي')+'</button></span></div>').join('');
 h+='<div class="prev" id="colprev"><b style="color:var(--hd)">معاينة: عنوان</b> <span style="color:var(--ic);display:inline-block;width:22px;vertical-align:middle">'+ico('list')+'</span><p>هذا نص تجريبي بلون النص على البطاقة.</p><button class="btn pri" type="button">زر</button> <span class="tag">وسم</span></div><p class="mut" id="colwarn" style="color:var(--bad)">'+(w.length?'تنبيه: '+w.join('، ')+'.':'')+'</p><button class="btn" data-colreset="all">استعادة الألوان الأصلية</button><p class="mut">العناوين والأيقونات تتبع لون الأزرار ما لم تختر لها لوناً مستقلاً. الثابت حالياً وسببه: لونا الصح والخطأ في الاختبارات (حتى لا يلتبس الصحيح بالخطأ)، ولون نص الأزرار (يتحول تلقائياً إلى الأسود أو الأبيض بحسب لون الزر لضمان الوضوح)، وخلفية الرأس في الوضع الداكن. زخرفة النجوم يمكن إخفاؤها من الخيار التالي.</p>'+tg('deco','إظهار زخرفة النجوم','في الرأس وعلى البطاقات')+'<p class="mut">';
 return h}

/* ===== الأذكار والتسبيح ===== */
const REM_SECTIONS=[['sabah','أذكار الصباح'],['masaa','أذكار المساء'],['nawm','أذكار النوم'],['istiqaz','أذكار الاستيقاظ']];
const asec=id=>window.ADHKAR_SECTIONS.find(s=>s.id===id);
const PEND='قيد التحقق';
const gradeAr=g=>{if(Array.isArray(g))g=g[1]||g[0];return String(g).replace(/Sahih/g,'صحيح').replace(/Hasan/g,'حسن').replace(/Da'?if/g,'ضعيف').replace(/Al-Albani/g,'الألباني').replace(/Darussalam/g,'دار السلام')};
function metaCard(it){
 if(!it||it.gr==null)return '';
 const rows=[];
 const add=(lab,val)=>{if(val==null||val===''||val===PEND)return;rows.push('<div class="mrow"><span class="mlab">'+lab+'</span><span class="mval">'+esc(val)+'</span></div>')};
 add('النوع',it.tp);
 if(it.gr==='قرآن')add('المصدر','القرآن الكريم');else add('الدرجة',it.gr!==PEND?gradeAr(it.gr):null);
 add('الراوي',it.nr);
 add('العدد الثابت',it.fc);
 add('التوقيت',it.tc);
 add('المناسبة',it.oc);
 add('الفضل',it.mt);
 if(it.vr&&it.vr!==PEND&&!(it.s&&String(it.s).indexOf(it.vr)>=0)&&!/^\d+:\d+$/.test(it.vr))add('الرواية',it.vr);
 add('المعاني',it.mn);
 if(!rows.length)return '';
 return '<details class="meta"><summary>بطاقة التوثيق</summary>'+rows.join('')+'</details>'}

const remNative=()=>!!(window.__FIQH_REMIND&&window.__FIQH_REMIND.available&&window.__FIQH_REMIND.available());
function remLabel(id){
 if(id.indexOf('i:')===0){const k=id.slice(2),sid=k.split('|')[0];
  if(sid==='my'){const it=(S.adhkar.my||[]).find(x=>x.u===k.split('|')[1]);if(!it)return 'دعائي';const w=it.t.split(/\s+/);return 'دعائي: '+w.slice(0,8).join(' ')+(w.length>8?'…':'')}
  if(sid==='myt'){const it=(S.adhkar.mytasbih||[]).find(x=>x.u===k.split('|')[1]);if(!it)return 'سبحتي';const w=it.t.split(/\s+/);return 'سبحتي: '+w.slice(0,8).join(' ')+(w.length>8?'…':'')}
  const sec=asec(sid),it=sec&&sec.items[+k.split('|')[1]];if(!it)return id;
  const w=it.t.split(/\s+/);return sec.title+': '+w.slice(0,8).join(' ')+(w.length>8?'\u2026':'')}
 const s=asec(id);return s?s.title:id}
function remStateText(id){
 const r=S.adhkar.rem[id];
 if(!r||!r.on||r.hh==null)return 'حدّد الوقت ليعمل التنبيه. الوقت اختياري.';
 if(remNative()){
  if(!window.__FIQH_REMIND.stopControlReady())return 'التنبيه الصوتي متوقف حتى تفعيل الإشعارات (زر الإيقاف يظهر معها).';
  const st=r.native;
  if(st==='exact')return 'تنبيه دقيق ينطق اسم الذكر، ويعمل والتطبيق مغلق.';
  if(st==='inexact')return 'تنبيه تقريبي. فعّل «المنبهات والتذكيرات» من إعدادات النظام ليصير دقيقاً.';
  return 'التنبيه غير مفعّل من النظام.';
 }
 return 'ينطق اسم الذكر ويعمل والتطبيق مفتوح فقط.'}
function remSyncOne(id){
 const r=S.adhkar.rem[id];
 if(!remNative())return;
 try{
  if(r&&r.on&&r.hh!=null){r.native=window.__FIQH_REMIND.schedule(id,r.hh,r.mm||0,remLabel(id),true)}
  else{window.__FIQH_REMIND.cancel(id);if(r)delete r.native}
 }catch(e){if(r)r.native='disabled'}}
function remSyncAll(){if(!remNative())return;Object.keys(S.adhkar.rem).forEach(remSyncOne)}
function remAskPerm(){if(remNative()&&!window.__FIQH_REMIND.notificationsGranted()){try{window.__FIQH_REMIND.requestNotifications()}catch(e){}}}
let remFired={};
function remTick(){
 const now=new Date(),hh=now.getHours(),mm=now.getMinutes(),key=todayStr();
 Object.keys(S.adhkar.rem).forEach(id=>{
  const r=S.adhkar.rem[id];
  if(!r||!r.on||r.hh==null)return;
  if(remNative())return; /* النظام يتولى التنبيه حين يتوفر الجسر */
  if(r.hh===hh&&(r.mm||0)===mm&&remFired[id]!==key+' '+hh+':'+mm){
   remFired[id]=key+' '+hh+':'+mm;
   const t='حان الآن وقت '+remLabel(id);
   try{if(window.speechSynthesis){const u=new SpeechSynthesisUtterance(t);u.lang='ar';speechSynthesis.cancel();speechSynthesis.speak(u)}}catch(e){}
   toast(t)}})}
const pad2=n=>String(n).padStart(2,'0');
function adhkarRemRows(){
 let h='<p class="mut">تنبيه يومي ينطق اسم الذكر في وقته. الوقت اختياري: لا تنبيه بلا وقت تحدده أنت. ولأي ذكر منفرد زر جرس بجانبه في صفحته يضبط تنبيهاً خاصاً به.</p>';
 REM_SECTIONS.forEach(x=>{
  const id=x[0],r=S.adhkar.rem[id]||{},on=!!r.on,val=r.hh!=null?pad2(r.hh)+':'+pad2(r.mm||0):'';
  h+='<div class="srow"><div><b>'+esc(x[1])+'</b><div class="mut">'+esc(remStateText(id))+'</div></div><input type="time" dir="ltr" data-remtime="'+id+'" value="'+val+'" aria-label="وقت تنبيه '+esc(x[1])+'"><button class="tgl'+(on?' on':'')+'" role="switch" aria-label="تنبيه '+esc(x[1])+'" aria-checked="'+on+'" data-rem="'+id+'"><i></i></button></div>'});
 if(remNative()){
  h+='<div class="row">';
  if(!window.__FIQH_REMIND.stopControlReady())h+='<button class="btn" data-remfix="1">فتح إعدادات الإشعارات</button>';
  if(!window.__FIQH_REMIND.canExact())h+='<button class="btn" data-remexact="1">تفعيل المنبهات الدقيقة</button>';
  if(!window.__FIQH_REMIND.notificationsGranted())h+='<button class="btn" data-remperm="1">السماح بالإشعارات</button>';
  h+='</div><p class="mut">عند إغلاق الإشعارات من النظام يتوقف الصوت تماماً حتى تعيد تفعيلها، لأن زر الإيقاف يظهر مع الإشعار.</p>'}
 else h+='<p class="mut">في هذه النسخة (المتصفح) التنبيه يعمل والتطبيق مفتوح فقط. في نسخة أندرويد يعمل والتطبيق مغلق إن سمحت له.</p>';
 return h}
let mtbEditing=null;
function vMyTasbih(){
 const myt=S.adhkar.mytasbih;
 let h='<button class="back" data-go="adhkar">‹ رجوع</button><h2 style="margin-top:0">سبحتي</h2>';
 h+='<div class="banner">هذه تسابيح تكتبها أنت بنفسك وتحدد عددها. تُحفظ على جهازك فقط، وهي ليست من المحتوى الموثق في التطبيق.</div>';
 h+='<div class="card"><textarea id="mtbtext" rows="2" placeholder="اكتب التسبيحة هنا" style="min-height:70px"></textarea><div class="srow" style="margin-top:8px"><div><b>العدد المستهدف</b></div><input type="number" id="mtbcnt" class="ninput" dir="ltr" min="1" max="99999" value="33" inputmode="numeric" aria-label="العدد المستهدف"></div><button class="btn pri" data-mtbadd="1" style="margin-top:8px">+ أضف تسبيحة</button></div>';
 if(!myt.length){h+='<p class="mut" style="text-align:center">لم تضف تسبيحة بعد. اكتبها أعلاه وحدد عددها ثم اضغط «أضف».</p>';return h}
 const it=myt.find(x=>x.u===S.adhkar.mysel)||myt[0];S.adhkar.mysel=it.u;
 h+='<div class="card tbcard"><p class="dhikr tbdhikr">'+esc(it.t)+'</p>'
  +'<button class="tbwrap" data-mtb="1" aria-label="زر التسبيح، العدد '+AR(it.n||0)+' من '+AR(it.c)+'">'
  +'<svg class="tbring" viewBox="0 0 200 200" aria-hidden="true"><circle class="tbring-bg" cx="100" cy="100" r="90"></circle><circle class="tbring-fg" cx="100" cy="100" r="90" style="stroke-dashoffset:'+(565.49*(1-(it.n||0)/it.c)).toFixed(1)+'"></circle></svg>'
  +'<span class="tbface"><span class="tbnum">'+((it.n||0)===0?'<i class="tbo"></i>':AR(it.n))+'</span><span class="tbof">الهدف '+AR(it.c)+'</span><span class="tbhint">اضغط للتسبيح</span></span></button>'
  +'<div class="row" style="justify-content:center"><button class="btn" data-mtbrst="1">تصفير</button>'+(myt.length>1?'<button class="btn" data-mtbpick="1">تسبيحة أخرى</button>':'')+'</div>'
  +'<p class="mut" style="text-align:center">اضغط الدائرة الكبيرة مع كل تسبيحة، وعند بلوغ الهدف يُعلمك التطبيق ويبدأ العد من جديد.</p></div>';
 h+='<h3>كل تسابيحي</h3>'+myt.map(x=>{
  const iRem=S.adhkar.rem['i:myt|'+x.u]||{};
  if(mtbEditing===x.u)return '<div class="card"><textarea id="mtbedit" rows="2" style="min-height:70px">'+esc(x.t)+'</textarea><div class="srow" style="margin-top:8px"><div><b>العدد المستهدف</b></div><input type="number" id="mtbeditcnt" class="ninput" dir="ltr" min="1" max="99999" value="'+x.c+'" inputmode="numeric" aria-label="العدد المستهدف"></div><div class="row" style="margin-top:8px"><button class="btn pri" data-mtbsave="'+x.u+'">حفظ</button><button class="btn" data-mtbcancel="1">إلغاء</button></div></div>';
  return '<div class="card'+(x.u===it.u?' cur':'')+'"><div class="srow"><div><b>'+esc(x.t)+'</b><div class="mut">'+AR(x.c)+' — العداد: '+AR(x.n||0)+' — تسبيحة خاصة بك (غير موثقة)</div></div>'+(x.u===it.u?'<span class="tag">الحالية</span>':'')+'</div>'
  +'<div class="srow wrap" style="margin-top:6px;justify-content:flex-start"><button class="ibell'+(iRem.on?' on':'')+'" data-irem="myt|'+x.u+'" aria-label="تنبيه يومي لهذه التسبيحة" aria-pressed="'+!!iRem.on+'">'+ico('bell')+'</button>'
  +(iRem.on?'<input type="time" dir="ltr" class="itime" data-iremtime="myt|'+x.u+'" value="'+(iRem.hh!=null?pad2(iRem.hh)+':'+pad2(iRem.mm||0):'')+'" aria-label="وقت تنبيه هذه التسبيحة">':'')
  +'<span style="flex:1"></span><button class="btn" data-mtbsel="'+x.u+'">اختيار</button><button class="btn" data-mtbedit="'+x.u+'">تعديل</button><button class="btn" data-mtbdel="'+x.u+'">حذف</button></div></div>'}).join('');
 return h}
let myEditing=null;
function vMyDua(){
 const my=S.adhkar.my;
 let h='<button class="back" data-go="adhkar">‹ رجوع</button><h2 style="margin-top:0">دعائي</h2>';
 h+='<div class="banner">هذه أدعية تكتبها أنت بنفسك. تُحفظ على جهازك فقط، وهي ليست من المحتوى الموثق في التطبيق.</div>';
 h+='<div class="card"><textarea id="myta" rows="3" placeholder="اكتب دعاءك هنا"></textarea><button class="btn pri" data-myadd="1" style="margin-top:8px">+ أضف إلى دعائي</button></div>';
 if(!my.length)h+='<p class="mut" style="text-align:center">لم تضف دعاءً بعد. اكتب دعاءك أعلاه واضغط «أضف».</p>';
 my.forEach(it=>{
  const iRem=S.adhkar.rem['i:my|'+it.u]||{};
  if(myEditing===it.u){h+='<div class="card"><textarea id="myedit" rows="3">'+esc(it.t)+'</textarea><div class="row" style="margin-top:8px"><button class="btn pri" data-mysave="'+it.u+'">حفظ</button><button class="btn" data-mycancel="1">إلغاء</button></div></div>';return}
  h+='<div class="card"><p class="dhikr">'+esc(it.t)+'</p><div class="srow" style="margin-top:6px">'
   +'<button class="ibell'+(iRem.on?' on':'')+'" data-irem="my|'+it.u+'" aria-label="تنبيه يومي لهذا الدعاء" aria-pressed="'+!!iRem.on+'">'+ico('bell')+'</button>'
   +(iRem.on?'<input type="time" dir="ltr" class="itime" data-iremtime="my|'+it.u+'" value="'+(iRem.hh!=null?pad2(iRem.hh)+':'+pad2(iRem.mm||0):'')+'" aria-label="وقت تنبيه هذا الدعاء">':'')
   +'<span style="flex:1"></span><button class="btn" data-myedit="'+it.u+'">تعديل</button><button class="btn" data-mydel="'+it.u+'">حذف</button></div></div>'});
 return h}
function vAdhkar(){
 let h='<h2>الأذكار والأدعية</h2><div class="banner">مجموعة مختارة من الأذكار والأدعية وليست كل ما ورد في القرآن والسنة. المحتوى من كتاب حصن المسلم لسعيد القحطاني، والنص القرآني من المصحف. مصدر كل ذكر مكتوب تحته. التنبيهات تُضبط من الإعدادات لكل قسم، وبزر الجرس بجانب أي ذكر لذكرٍ منفرد، والوقت اختياري.</div>';
 window.ADHKAR_SECTIONS.forEach(s=>{
  let extra='';
  if(s.id==='tasbih'){const tb=S.adhkar.tasbih;extra='<div class="mut">العداد: '+AR(tb.n)+' من '+AR(s.items[tb.i]?s.items[tb.i].c:33)+'</div>'}
  else{const done=s.items.filter((_,i)=>(S.adhkar.prog[s.id+'|'+i]||0)<=0&&S.adhkar.prog[s.id+'|'+i]!=null).length;extra='<div class="mut">'+AR(s.items.length)+' ذكراً'+(done?'، أتممت '+AR(done):'')+'</div>'}
  h+='<button class="card linkc" data-go="adhkar/'+s.id+'"><div class="srow"><div><b>'+esc(s.title)+'</b>'+extra+'</div><span class="tag">فتح</span></div></button>'});
 h+='<button class="card linkc" data-go="adhkar/my"><div class="srow"><div><b>دعائي</b><div class="mut">أدعية تكتبها بنفسك، تُحفظ على جهازك فقط وليست من المحتوى الموثق'+(S.adhkar.my.length?' — '+AR(S.adhkar.my.length)+' دعاء':'')+'</div></div><span class="tag">+ أضف</span></div></button>';
 h+='<button class="card linkc" data-go="adhkar/myt"><div class="srow"><div><b>سبحتي</b><div class="mut">تسابيح تكتبها بنفسك بعدّادها الخاص، تُحفظ على جهازك فقط وليست من المحتوى الموثق'+(S.adhkar.mytasbih.length?' — '+AR(S.adhkar.mytasbih.length)+' تسبيحة':'')+'</div></div><span class="tag">+ أضف</span></div></button>';
 return h}
function vAdhkarSec(){
 if(R.a==='my')return vMyDua();
 if(R.a==='myt')return vMyTasbih();
 const s=asec(R.a);if(!s)return vAdhkar();
 let h='<button class="back" data-go="adhkar">‹ رجوع</button><h2 style="margin-top:0">'+esc(s.title)+'</h2>';
 if(s.id==='tasbih'){
  const tb=S.adhkar.tasbih;tb.i=Math.min(tb.i,s.items.length-1);const it=s.items[tb.i];
  h+='<div class="card tbcard"><p class="dhikr tbdhikr">'+esc(it.t)+'</p>'
   +'<div class="mut">'+esc(it.s)+'</div>'+metaCard(it)
   +'<button class="tbwrap" data-tb="1" aria-label="زر التسبيح، العدد '+AR(tb.n)+' من '+AR(it.c)+'">'
   +'<svg class="tbring" viewBox="0 0 200 200" aria-hidden="true"><circle class="tbring-bg" cx="100" cy="100" r="90"></circle><circle class="tbring-fg" cx="100" cy="100" r="90" style="stroke-dashoffset:'+(565.49*(1-tb.n/it.c)).toFixed(1)+'"></circle></svg>'
   +'<span class="tbface"><span class="tbnum">'+(tb.n===0?'<i class="tbo"></i>':AR(tb.n))+'</span><span class="tbof">الهدف '+AR(it.c)+'</span><span class="tbhint">اضغط للتسبيح</span></span></button>'
   +'<div class="row" style="justify-content:center"><button class="btn" data-tbrst="1">تصفير</button><button class="btn" data-tbpick="1">تسبيحة أخرى</button></div>'
   +'<p class="mut" style="text-align:center">اضغط الدائرة الكبيرة مع كل تسبيحة، وعند بلوغ الهدف يُعلمك التطبيق ويبدأ العد من جديد.</p></div>';
  h+='<h3>كل التسابيح</h3>'+s.items.map((x,i)=>{const iRem=S.adhkar.rem['i:'+s.id+'|'+i]||{};return '<div class="card'+(i===tb.i?' cur':'')+'"><div class="srow"><div><b>'+esc(x.t)+'</b><div class="mut">'+AR(x.c)+' — '+esc(x.s)+'</div></div>'+(i===tb.i?'<span class="tag">الحالية</span>':'')+'</div>'+metaCard(x)+'<div class="srow wrap" style="margin-top:6px;justify-content:flex-start"><button class="ibell'+(iRem.on?' on':'')+'" data-irem="'+s.id+'|'+i+'" aria-label="تنبيه يومي لهذه التسبيحة" aria-pressed="'+!!iRem.on+'">'+ico('bell')+'</button>'+(iRem.on?'<input type="time" dir="ltr" class="itime" data-iremtime="'+s.id+'|'+i+'" value="'+(iRem.hh!=null?pad2(iRem.hh)+':'+pad2(iRem.mm||0):'')+'" aria-label="وقت تنبيه هذه التسبيحة">':'')+'</div></div>'}).join('');
  return h}
 s.items.forEach((it,i)=>{
  const k=s.id+'|'+i,rem=S.adhkar.prog[k]==null?it.c:S.adhkar.prog[k],done=rem<=0,iRem=S.adhkar.rem['i:'+k]||{};
  h+='<div class="card'+(done?' done':'')+'"><p class="dhikr">'+esc(it.t)+'</p>'
   +(it.f?'<p class="mut">'+esc(it.f)+'</p>':'')
   +metaCard(it)
   +'<div class="srow src"><div class="mut">'+esc(it.s)+(it.c>1?' — '+AR(it.c)+' مرّة':'')+'</div>'
   +'<button class="ibell'+(iRem.on?' on':'')+'" data-irem="'+s.id+'|'+i+'" aria-label="تنبيه يومي لهذا الذكر" aria-pressed="'+!!iRem.on+'">'+ico('bell')+'</button>'
   +(iRem.on?'<input type="time" dir="ltr" class="itime" data-iremtime="'+s.id+'|'+i+'" value="'+(iRem.hh!=null?pad2(iRem.hh)+':'+pad2(iRem.mm||0):'')+'" aria-label="وقت تنبيه هذا الذكر">':'')
   +'<button class="btn'+(done?'':' pri')+'" data-aitem="'+s.id+'|'+i+'"'+(done?' disabled':'')+'>'+(done?'✓ تم الذكر':'قرأتها'+(it.c>1?' ('+AR(rem)+')':''))+'</button></div></div>'});
 h+='<div class="card"><button class="btn" data-arsec="'+s.id+'">إعادة من البداية</button></div>';
 return h}
function vSettings(){
 const done=LESSONS.filter(l=>S.prog[l.id]&&S.prog[l.id].opened).length,quz=LESSONS.filter(l=>S.prog[l.id]&&S.prog[l.id].quiz).length;
 let h='<button class="back" data-go="home">‹ رجوع</button><h2 style="margin-top:0">الإعدادات</h2><div class="banner">كل ما هنا يُحفظ على جهازك فقط. الخيارات التي لم تُبنَ بعد مكتوب عليها «غير متاح بعد» ولا تعمل، حتى لا تظن أنها تؤدي شيئاً.</div>';
 h+=sec('أولاً:','الحساب','home',soon('الملف الشخصي وكلمة المرور وإدارة الحساب وتسجيل الخروج','التطبيق يعمل بدون حساب وبدون خادم، فلا يوجد ما يُسجَّل الدخول إليه. لو أُضيف حساب لاحقاً سيحتاج بناءً حقيقياً وسياسة خصوصية.')+'<p class="mut">بياناتك (المحفوظات والملاحظات والتقدم) على هذا الجهاز، وتجدها في قسم الخصوصية.</p>');
 h+=sec('ثانياً:','المذهب الفقهي','list','<h3>المذهب المفضل</h3>'+chs('',[['none','غير محدد (كل المذاهب)']].concat(SK.map(k=>[k,SCHOOLS[k].name])),S.school,'data-school').replace(/data-school=":([^"]*)"/g,'data-school="$1"')+'<p class="mut">يمكن تغييره في أي وقت. يغيّر ترتيب الأقوال في الخلاف ولا يعني ترجيحاً.</p><h3>طريقة عرض المسائل الخلافية</h3>'+chs('kmode',[['all','المذاهب الأربعة معاً'],['mine','مذهبي أولاً والباقي تحته']],S.cfg.kmode,'data-cfgv')+(S.cfg.kmode==='mine'&&S.school==='none'?'<p class="mut">اختر مذهباً حتى يعمل هذا الخيار، وإلا تُعرض كل المذاهب.</p>':'')+tg('ev','إظهار أدلة الدروس','الآيات والأحاديث في تبويب الحكم الفقهي')+tg('','عرض المصادر مع كل مسألة','يبقى ظاهراً دائماً لأنه من أمانة التوثيق، ولا يمكن إخفاؤه.',true)+'<p class="mut">يميّز التطبيق بين النص الشرعي والشرح، ولا يعرض المسائل الخلافية كأنها إجماع. موضع الاتفاق يُذكر في الدرس صراحةً، وما لم يُقرأ مصدره مكتوب أنه خارج ما قُرئ.</p>',true);
 h+=sec('ثالثاً:','المحتوى العلمي','pen',soon('مستوى الشرح (مبتدئ، متوسط، متقدم)','الدروس مكتوبة بمستوى واحد حالياً. لا يوجد محتوى بثلاثة مستويات.')+soon('تخريج الأحاديث ودرجتها','تظهر الدرجة حيث نُقلت من المصدر، والأحاديث التي نقلتها الموسوعة بلا تخريج مكتوب عليها ذلك. لا يوجد تخريج شامل.')+soon('الشرح اللغوي والنصوص الأصلية بجانب الشرح','لم يُبنَ بعد.')+tg('ev','أدلة القرآن والسنة','نفس مفتاح قسم المذهب'));
 const names=[['taharah','الطهارة'],['salah','الصلاة'],['zakah','الزكاة'],['siyam','الصيام'],['hajj','الحج والعمرة']];
 const ws=WORSHIPS.map(w=>[w.id,w.title]);
 h+=sec('رابعاً:','العبادات الظاهرة','list','<p class="mut">اختر الأقسام التي تريد رؤيتها في الرئيسية وقائمة العبادات.</p>'+ws.map(w=>'<div class="srow"><b>'+esc(w[1])+'</b><button class="tgl'+(S.cfg.hide.indexOf(w[0])<0?' on':'')+'" role="switch" aria-label="'+esc(w[1])+'" aria-checked="'+(S.cfg.hide.indexOf(w[0])<0)+'" data-sec="'+w[0]+'"><i></i></button></div>').join('')+soon('الأذكار والأدعية المتعلقة بالعبادات، وأحكام الجنائز','لم تُكتب دروسها بعد، فلا يوجد ما يُظهر أو يُخفى.'));
 h+=sec('خامساً:','الدراسة والمراجعة','pen','<div class="srow"><div><b>تقدمك</b><div class="mut">درسٌ فتحته: '+AR(done)+' من '+AR(LESSONS.length)+'. اختبارات أنهيتها: '+AR(quz)+'.</div></div></div><div class="srow"><div><b>المفضلة والملاحظات</b><div class="mut">'+AR(S.bm.length)+' محفوظة، '+AR(S.notes.length)+' ملاحظة. تجدها في «تأملاتي».</div></div><button class="btn" data-go="mine">فتح</button></div>'+(function(){const st=study();const goal=S.cfg.goal||0;const mins=Math.floor(st.secs/60);let h='<div class="srow"><div><b>الهدف اليومي</b><div class="mut">'+(goal?('اليوم: '+AR(st.opened.length)+' من '+AR(goal)+' '+(st.opened.length>=goal?'، اكتمل الهدف':'درساً')):'غير مضبوط')+'</div></div></div>';h+='<div class="row">'+[[0,'بلا هدف'],[1,'درس'],[2,'درسان'],[3,'٣'],[5,'٥']].map(g=>'<button class="chip '+(goal===g[0]?'on':'')+'" data-goal="'+g[0]+'">'+g[1]+'</button>').join('')+'</div>';h+='<div class="srow"><div><b>مدة القراءة اليوم</b><div class="mut">'+AR(mins)+' دقيقة تقريباً، تُحسب والتطبيق مفتوح ونشط، وتبدأ من صفر كل يوم.</div></div></div>';return h})()+soon('التذكير بالمراجعة','يحتاج إشعارات على الهاتف ولم تُبنَ.')+soon('قوائم مخصصة للمسائل المهمة','المحفوظات قائمة واحدة حالياً.'));
 h+=sec('سادساً:','الإشعارات','gear','<h3>تنبيهات الأذكار</h3>'+adhkarRemRows()+soon('تذكير التعلم اليومي ومراجعة المحفوظات','لم تُبنَ بعد.'));
 h+=sec('سابعاً:','القراءة','pen','<h3>حجم الخط</h3><div class="row">'+[[.9,'صغير'],[1,'عادي'],[1.15,'كبير'],[1.3,'أكبر']].map(f=>'<button class="chip '+(S.fs===f[0]?'on':'')+'" data-fs="'+f[0]+'">'+f[1]+'</button>').join('')+'</div><h3>نوع الخط</h3>'+chs('font',[['sans','عصري (IBM Plex)'],['naskh','نسخ (أميري)']],S.cfg.font,'data-cfgv')+'<h3>تباعد الأسطر</h3>'+chs('lh',[['1.6','ضيق'],['1.85','عادي'],['2.2','واسع']],String(S.cfg.lh),'data-cfgv')+'<h3>الوضع</h3><div class="row"><button class="chip '+(!S.dark?'on':'')+'" data-dark="0">فاتح</button><button class="chip '+(S.dark?'on':'')+'" data-dark="1">داكن</button></div>'+tg('comfy','وضع القراءة المريح','خلفية دافئة أخف على العين')+tg('sound','صوت الزجاج عند اللمس','نغمة زجاجية قصيرة عند الضغط على الأزرار والبطاقات')+tg('vib','الاهتزاز عند الأذكار','اهتزاز خفيف مع كل عدّة، واهتزاز أطول مع نغمة هادئة عند إتمام الذكر')+'<p class="mut">يمكنك تحديد أي نص ونسخه من الشاشة. أما زر المشاركة مع المصدر فلم يُبنَ، وإن نسخت مسألة فانسخ معها مصدرها المكتوب تحتها.</p>'+vColors());
 h+=sec('ثامناً:','الخصوصية والبيانات','gear','<p class="mut">لا يرسل التطبيق أي بيانات خارج جهازك، ولا يحتاج إنترنت.'+(persist?'':' متصفحك الحالي يمنع الحفظ الدائم.')+'</p><div class="srow"><b>مسح سجل القراءة</b><button class="btn" data-clr="hist">مسح</button></div><div class="srow"><b>مسح نتائج الاختبارات</b><button class="btn" data-clr="quiz">مسح</button></div><div class="srow"><b>حذف المفضلة</b><button class="btn" data-clr="bm">حذف</button></div><div class="srow"><b>حذف الملاحظات</b><button class="btn" data-clr="notes">حذف</button></div><div class="srow"><b>حذف كل البيانات المحفوظة</b><button class="btn" data-clr="all">حذف الكل</button></div><p class="mut">كل زر حذف يطلب ضغطة تأكيد ثانية.</p><h3>نسخة احتياطية</h3><p class="mut">لا تنتقل بياناتك بين الأجهزة، وتُحذف عند حذف التطبيق. اضغط «تجهيز النسخة» ثم انسخ النص واحفظه في مكان آمن (ملاحظات هاتفك مثلاً). لاسترجاعها الصق النص واضغط «استرجاع».</p><div class="row"><button class="btn" data-exp="1">تجهيز النسخة</button><button class="btn" data-imp="1">استرجاع</button></div><textarea id="bk" dir="ltr" rows="5" style="width:100%;margin-top:8px" placeholder="الصق النسخة هنا للاسترجاع"></textarea><p class="mut" id="bkmsg"></p>');
 h+=sec('تاسعاً:','المساعدة والتواصل','help','<details><summary>دليل الاستخدام</summary><p class="mut">من «العبادات» اختر عبادة ثم درساً. في الدرس: تبويب الحكم الفقهي، وتبويب المعنى والروح (تأمل منفصل عن الأحكام)، ودليل الأداء خطوة خطوة، والخلاف بين المذاهب، واختبار قصير. زر النجمة يحفظ البطاقة، والقلم يضيف ملاحظة. «مواقف سريعة» تربط مواقف الحياة بالأحكام.</p></details><details><summary>أسئلة شائعة</summary><p class="mut"><b>هل التطبيق فتوى؟</b> لا، هو مادة تعليمية موثّقة بمصادرها، فارجع لعالم في حالتك. <b>لماذا يختلف الحكم؟</b> لأن المذاهب تختلف، ونعرض كلاً بمصدره دون ترجيح. <b>لماذا تقول «لم يُقرأ»؟</b> يعني أن المصدر المقروء لم يذكر المسألة، ولا يعني أنها غير واجبة. <b>هل أحتاج إنترنت؟</b> لا.</p></details>'+(CONTACT_NOTE?'<div class="srow"><div><b>الإبلاغ عن خطأ علمي</b><div class="mut">'+esc(CONTACT_NOTE.text)+'</div></div></div>':soon('ملاحظاتكم وتوضيحاتكم','لا توجد قناة إرسال داخل التطبيق بعد. يمكنك كتابة الملاحظة في «تأملاتي» الآن، وإرسالها بنفسك لمن أعطاك التطبيق.'))+'<details><summary>سياسة الخصوصية</summary><p class="mut">لا يجمع التطبيق بيانات شخصية ولا يرسل شيئاً إلى أي جهة. ما تكتبه يُحفظ على جهازك فقط ويُحذف بحذف التطبيق أو من قسم الخصوصية.</p></details><details><summary>حول التطبيق</summary><p class="mut">فِقْهُ الرُّوح: تطبيق تعليمي. المصادر: الموسوعة الفقهية الكويتية (أغلب الدروس)، والفقه الإسلامي وأدلته للزحيلي (درس سجود السهو)، وآيات من api.alquran.cloud، وأحاديث من sunnah.com. موثّق بمصادره.</p></details>');
 h+='<div class="card"><button class="btn pri" data-defaults="1">استعادة الإعدادات الافتراضية</button><p class="mut">يعيد الخط والمذهب والعرض والأقسام إلى الأصل. لا يحذف محفوظاتك أو ملاحظاتك.</p></div>';
 return h}
function searchAll(q0){
 const q=norm(q0.trim());if(!q)return[];
 const toks=q.split(/\s+/).filter(Boolean);
 const score=e=>{
  const T=norm(e.title),L=norm(e.lt||''),X=norm(e.text+' '+e.ref);
  let s=0,tw=0,xw=0;
  if(T.includes(q))s+=120;
  if(L.includes(q))s+=80;
  if(X.includes(q))s+=40;
  for(const t of toks){
   const inT=T.split(/\s+/).some(w=>w.indexOf(t)===0)||T.includes(t);
   const inL=L.split(/\s+/).some(w=>w.indexOf(t)===0);
   const inX=X.includes(t);
   if(!inT&&!inL&&!inX)return -1;
   if(inT)tw+=2;else if(inL)tw+=1;else xw+=1;
  }
  return s+tw*8+xw*3;
 };
 let scored=[];
 ALL.forEach(e=>{const s=score(e);if(s>=0)scored.push([s,e])});
 if(!scored.length&&toks.length>1){
  ALL.forEach(e=>{
   const T=norm(e.title),L=norm(e.lt||''),X=norm(e.text+' '+e.ref);
   let s=0,hit=0;
   for(const t of toks){
    const inT=T.includes(t),inL=L.includes(t),inX=X.includes(t);
    if(inT||inL||inX){hit++;s+=(inT?20:0)+(inL?12:0)+(inX?4:0)}
   }
   if(hit)scored.push([s*hit,e]);
  });
 }
 scored.sort((a,b)=>b[0]-a[0]);
 return scored.slice(0,60).map(x=>x[1]);
}
function vSearch(){
 let h='<h2 style="margin-top:0">نتائج البحث</h2>';
 const res=searchAll(searchQ);
 const nq=norm(searchQ);const glh=['مفتاح','مصطلح','مندوب','مستحب','مباح','مكروه','حرام','معني الفرض'].some(w=>nq.includes(norm(w)));
 h+='<div class="mut">'+AR(res.length)+' نتيجة لـ «'+esc(searchQ)+'»'+(res.length===60?' (أول ٦٠)':'')+'</div>';
 if(glh)h+='<button class="card" style="width:100%;text-align:right" data-go="gloss"><span class="tag gold">مفتاح المصطلحات</span><h3>معنى الفرض والمندوب والمباح والمكروه والحرام</h3></button>';
 if(!res.length)h+='<div class="card mut">لا نتائج. جرّب كلمة أقصر مثل: نية، سجود، صيام.</div>';
 h+=res.map(e=>'<button class="card" style="width:100%;text-align:right" data-open="'+esc(e.id)+'"><span class="tag">'+esc(e.lt)+'</span><span class="tag">'+esc(e.sec)+'</span><h3>'+esc(e.title)+'</h3><div class="mut">'+esc(e.text.slice(0,140))+(e.text.length>140?'…':'')+'</div></button>').join('');
 return h}
function render(scroll){
 const m=$('#view');let h;const keepY=window.scrollY||0;const openSecs=[...m.querySelectorAll('details.sset')].map(d=>d.open);
 if(searchQ&&R.r!=='search'&&false){}
 switch(R.r){case 'home':h=vHome();break;case 'worship':h=vWorship();break;case 'lesson':h=vLesson();break;case 'sit':h=vSit();break;case 'gloss':h=vGloss();break;case 'mine':h=vMine();break;case 'settings':h=vSettings();break;case 'search':h=vSearch();break;case 'adhkar':h=R.a?vAdhkarSec():vAdhkar();break;default:h=vHome()}
 m.innerHTML=h;m.querySelectorAll('details.sset').forEach((d,i)=>{if(openSecs[i])d.open=true});
 const nav={home:'home',worship:'worship',lesson:'worship',sit:'sit',mine:'mine',adhkar:'adhkar'}[R.r];
 document.querySelectorAll('nav button').forEach(b=>b.classList.toggle('on',b.dataset.go===nav));
 if(scroll){try{window.scrollTo(0,0)}catch(e){}try{if(window.__FIQH_HOST){const t=document.getElementById('navbar');t&&t.scrollIntoView({block:'start'})}}catch(e){}}else{try{window.scrollTo(0,keepY)}catch(e){}}}
function openEntry(id){
 if(id.startsWith('refl.')){go('lesson/'+REFLECTIONS.find(r=>'refl.'+r.id===id).lesson);return}
 const e=byId(id);if(!e)return;
 if(e.tab==='sit'){sitCat='الكل';sitQ='';go('sit');setTimeout(()=>{const d=document.getElementById('d-'+id.slice(4));if(d){d.open=true;d.scrollIntoView({block:'center'})}},50);return}
 if(e.tab==='steps'){stepIdx=+id.split('.step.')[1]-1;go('lesson/'+e.lesson+'/steps');return}
 if(e.tab==='khilaf'){go('lesson/'+e.lesson+'/khilaf');return}
 lens=e.tab;const target='#lesson/'+e.lesson;
 if(curHash===target.replace(/^#/,''))render();else go('lesson/'+e.lesson);
 setTimeout(()=>{const el=document.getElementById('c-'+id.replace(/\./g,'_'));if(el)el.scrollIntoView({block:'center'})},80)}
function noteSheet(ref){
 const e=ref==='free'?null:byId(ref);const sh=document.createElement(window.__FIQH_HOST?'dialog':'div');sh.className='sheet';
 sh.innerHTML='<div role="dialog" aria-label="ملاحظة"><h3>'+(e?'ملاحظة على: '+esc(e.title):'ملاحظة جديدة')+'</h3><textarea id="nt" maxlength="2000" placeholder="اكتب ملاحظتك هنا"></textarea><div class="row" style="margin-top:8px"><button class="btn pri" id="ns">حفظ</button><button class="btn" id="nc">إلغاء</button></div></div>';
 document.body.appendChild(sh);if(window.__FIQH_HOST&&sh.showModal)sh.showModal();const t=sh.querySelector('textarea');t.focus();
 sh.querySelector('#nc').onclick=()=>sh.remove();sh.onclick=ev=>{if(ev.target===sh)sh.remove()};
 sh.querySelector('#ns').onclick=()=>{const v=t.value.trim();if(!v){toast('اكتب شيئاً أولاً');return}S.notes.unshift({id:'n'+Date.now(),ts:Date.now(),text:v,ref,title:e?e.title:''});save();sh.remove();toast('تم حفظ الملاحظة');render()}}
document.addEventListener('click',ev=>{
 const t=ev.target.closest('[data-go],[data-lens],[data-bm],[data-note],[data-step],[data-sp],[data-sdone],[data-opt],[data-qnext],[data-qretry],[data-cat],[data-catreset],[data-mt],[data-open],[data-ndel],[data-fs],[data-school],[data-dark],[data-reset],[data-settings],[data-exp],[data-imp],[data-cfg],[data-cfgv],[data-colreset],[data-sec],[data-clr],[data-defaults],[data-goal],[data-aitem],[data-arsec],[data-tb],[data-tbrst],[data-tbpick],[data-rem],[data-remfix],[data-remexact],[data-remperm],[data-irem],[data-myadd],[data-myedit],[data-mysave],[data-mycancel],[data-mydel],[data-mtbadd],[data-mtb],[data-mtbrst],[data-mtbpick],[data-mtbsel],[data-mtbedit],[data-mtbsave],[data-mtbcancel],[data-mtbdel]');
 if(!t)return;const d=t.dataset;
 if(d.go!==undefined){if(d.go.startsWith('lesson/')&&R.r!=='lesson'){}if(d.go.startsWith('lesson/')&&d.go.split('/').length===2)stepIdx=stepIdx;go(d.go);return}
 if(d.lens){lens=d.lens;render();return}
 if(d.bm){const id=d.bm;const i=S.bm.findIndex(b=>b.id===id);if(i>=0){S.bm.splice(i,1);toast('أُزيل من المحفوظات')}else{let rec;if(id.startsWith('refl.')){const r=REFLECTIONS.find(x=>'refl.'+x.id===id);rec={id,sec:'معنى اليوم',title:r.t,text:r.d}}else{const e=byId(id);rec={id,sec:e.sec,title:e.title,text:e.text}}S.bm.unshift(rec);toast('تم الحفظ في تأملاتي')}save();render();return}
 if(d.note){noteSheet(d.note);return}
 if(d.step!==undefined){stepIdx=+d.step;render();return}
 if(d.sp){stepIdx+=+d.sp;render();return}
 if(d.sdone){const l=lesson(R.a),p=P(l.id);if(p.steps[d.sdone])delete p.steps[d.sdone];else{p.steps[d.sdone]=true;if(stepIdx<l.steps.length-1)stepIdx++}save();render();return}
 if(d.opt!==undefined&&qState&&qState.pick===null){const l=lesson(R.a);qState.pick=+d.opt;if(qState.pick===qState.qs[qState.i].a)qState.score++;render();return}
 if(d.qnext){const l=lesson(R.a);if(qState.i===qState.qs.length-1){qState.fin=true;const p=P(l.id);if(!p.quiz||qState.score>p.quiz.best)p.quiz={best:qState.score,of:qState.qs.length};save()}else{qState.i++;qState.pick=null}render();return}
 if(d.qretry){qState=null;render();return}
 if(d.cat){sitCat=d.cat;render();return}
 if(d.catreset){sitCat='الكل';sitQ='';render();return}
 if(d.mt){mineTab=d.mt;render();return}
 if(d.open){openEntry(d.open);return}
 if(d.ndel){if(t.dataset.arm){S.notes=S.notes.filter(n=>n.id!==d.ndel);save();render()}else{t.dataset.arm=1;t.textContent='اضغط للتأكيد';}return}
 if(d.colreset){const m=mode();if(d.colreset==='all')S.cfg.colors[m]={};else delete S.cfg.colors[m][d.colreset];applyCfg();save();render();return}
 if(d.cfg){S.cfg[d.cfg]=!S.cfg[d.cfg];applyCfg();save();render();return}
 if(d.cfgv){const i=d.cfgv.indexOf(':'),k=d.cfgv.slice(0,i),v=d.cfgv.slice(i+1);S.cfg[k]=k==='lh'?+v:v;applyCfg();save();render();return}
 if(d.sec){const i=S.cfg.hide.indexOf(d.sec);if(i>=0)S.cfg.hide.splice(i,1);else if(S.cfg.hide.length<WORSHIPS.length-1)S.cfg.hide.push(d.sec);else toast('أبقِ قسماً واحداً على الأقل');applyCfg();save();render();return}
 if(d.defaults){if(t.dataset.arm){S.cfg=defCfg();S.school='none';S.fs=1;S.dark=false;document.documentElement.style.setProperty('--fs',1);applyCfg();applyTheme();save();toast('تمت استعادة الإعدادات');render()}else{t.dataset.arm=1;t.textContent='اضغط مرة أخرى للتأكيد'}return}
 if(d.clr){if(!t.dataset.arm){t.dataset.arm=1;t.textContent='اضغط للتأكيد';return}
  if(d.clr==='hist'){S.last=null;Object.keys(S.prog).forEach(k=>{if(S.prog[k]){delete S.prog[k].opened;S.prog[k].steps={}}})}
  if(d.clr==='quiz'){Object.keys(S.prog).forEach(k=>{if(S.prog[k])delete S.prog[k].quiz})}
  if(d.clr==='bm')S.bm=[];if(d.clr==='notes')S.notes=[];if(d.clr==='all'){S.bm=[];S.notes=[];S.prog={};S.last=null}
  save();toast('تم');render();return}
 if(d.goal!==undefined){S.cfg.goal=+d.goal;save();render();return}
 if(d.fs){S.fs=+d.fs;document.documentElement.style.setProperty('--fs',S.fs);save();render();return}
 if(d.school){S.school=d.school;save();render();return}
 if(d.dark){S.dark=d.dark==='1'?true:d.dark==='0'?false:!S.dark;applyTheme();save();render();return}
 if(d.exp){const o={app:'fiqh-alruh',v:1,bm:S.bm,notes:S.notes,prog:S.prog,school:S.school,dark:S.dark,fs:S.fs,cfg:S.cfg,adhkar:S.adhkar};const bk=$('#bk');bk.value=JSON.stringify(o);bk.focus();bk.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}$('#bkmsg').textContent=ok?'تم نسخ النص. الصقه في مكان آمن.':'انسخ النص الظاهر في الخانة (اضغط مطولاً ثم «نسخ») واحفظه.';return}
 if(d.imp){const bk=$('#bk'),m=$('#bkmsg');let o;try{o=JSON.parse(bk.value)}catch(e){m.textContent='النص غير صالح.';return}
  if(!o||o.app!=='fiqh-alruh'||o.v!==1||!Array.isArray(o.bm)||!Array.isArray(o.notes)||typeof o.prog!=='object'||o.prog===null){m.textContent='هذه ليست نسخة احتياطية لهذا التطبيق.';return}
  const okn=o.notes.every(n=>n&&typeof n.text==='string'&&typeof n.id==='string'),okb=o.bm.every(b=>b&&typeof b.id==='string');if(!okn||!okb){m.textContent='بيانات النسخة غير صالحة.';return}
  if(!t.dataset.arm){t.dataset.arm=1;t.textContent='اضغط مرة أخرى لاستبدال ما عندك';return}
  S.bm=o.bm;S.notes=o.notes;S.prog=o.prog;if(typeof o.school==='string')S.school=o.school;if(o.dark===true||o.dark===false){S.dark=o.dark;applyTheme()}if(typeof o.fs==='number'&&o.fs>0){S.fs=o.fs;document.documentElement.style.setProperty('--fs',S.fs)}if(o.adhkar&&typeof o.adhkar==='object')S.adhkar={prog:o.adhkar.prog&&typeof o.adhkar.prog==='object'?o.adhkar.prog:{},tasbih:o.adhkar.tasbih&&typeof o.adhkar.tasbih==='object'?o.adhkar.tasbih:{i:0,n:0},rem:o.adhkar.rem&&typeof o.adhkar.rem==='object'?o.adhkar.rem:{},my:Array.isArray(o.adhkar.my)?o.adhkar.my:[],mytasbih:Array.isArray(o.adhkar.mytasbih)?o.adhkar.mytasbih:[],mysel:o.adhkar.mysel||null};if(o.cfg&&typeof o.cfg==='object'&&Array.isArray(o.cfg.hide)){S.cfg=Object.assign(defCfg(),o.cfg);if(!S.cfg.colors||!S.cfg.colors.light||!S.cfg.colors.dark)S.cfg.colors={light:{},dark:{}};['light','dark'].forEach(m=>Object.keys(S.cfg.colors[m]).forEach(k=>{if(!HEX.test(S.cfg.colors[m][k]))delete S.cfg.colors[m][k]}));applyCfg()}save();toast('تم الاسترجاع');render();return}
 if(d.mtbadd){const ta=$('#mtbtext'),cn=$('#mtbcnt'),v=ta?(ta.value||'').trim():'';let c=cn?parseInt(cn.value,10):0;if(!v){toast('اكتب التسبيحة أولاً');return}if(!c||c<1||c>99999){toast('حدد عدداً صحيحاً بين 1 و 99999');return}const u=Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36);S.adhkar.mytasbih.push({u:u,t:v,c:c,n:0});S.adhkar.mysel=u;save();render();toast('أُضيفت إلى سبحتي');return}
 if(d.mtb){const myt=S.adhkar.mytasbih,it=myt.find(x=>x.u===S.adhkar.mysel)||myt[0];if(!it)return;it.n=(it.n||0)+1;vib(12);let dn=false;if(it.n>=it.c){toast('أتممت العدد');doneFx();it.n=0;dn=true}save();const w=t.closest('.tbwrap');if(w){const num=w.querySelector('.tbnum'),fg=w.querySelector('.tbring-fg');if(num){if(it.n===0)num.innerHTML='<i class="tbo"></i>';else num.textContent=AR(it.n)}if(fg)fg.style.strokeDashoffset=(565.49*(1-it.n/it.c)).toFixed(1);w.setAttribute('aria-label','زر التسبيح، العدد '+AR(it.n)+' من '+AR(it.c));if(dn){w.classList.add('tbdone');setTimeout(()=>w.classList.remove('tbdone'),700)}}else render();return}
 if(d.mtbrst){const myt=S.adhkar.mytasbih,it=myt.find(x=>x.u===S.adhkar.mysel)||myt[0];if(it){it.n=0;save();render()}return}
 if(d.mtbpick){const myt=S.adhkar.mytasbih,i=myt.findIndex(x=>x.u===S.adhkar.mysel);if(myt.length>1){S.adhkar.mysel=myt[(i+1)%myt.length].u;save();render()}return}
 if(d.mtbsel){S.adhkar.mysel=d.mtbsel;save();window.scrollTo(0,0);render();return}
 if(d.mtbedit){mtbEditing=d.mtbedit;render();return}
 if(d.mtbcancel){mtbEditing=null;render();return}
 if(d.mtbsave){const it=S.adhkar.mytasbih.find(x=>x.u===d.mtbsave),ta=$('#mtbedit'),cn=$('#mtbeditcnt');if(it&&ta){const v=(ta.value||'').trim();let c=cn?parseInt(cn.value,10):0;if(v)it.t=v;else toast('النص فارغ، لم يُحفظ');if(c>=1&&c<=99999){it.c=c;if((it.n||0)>c)it.n=0}else toast('العدد غير صالح، لم يتغير');save()}mtbEditing=null;render();return}
 if(d.mtbdel){if(t.dataset.arm){const i=S.adhkar.mytasbih.findIndex(x=>x.u===d.mtbdel);if(i>=0){const it=S.adhkar.mytasbih[i];delete S.adhkar.rem['i:myt|'+it.u];remSyncOne('i:myt|'+it.u);S.adhkar.mytasbih.splice(i,1);if(S.adhkar.mysel===it.u)S.adhkar.mysel=S.adhkar.mytasbih.length?S.adhkar.mytasbih[0].u:null;save();render();toast('حُذفت من سبحتي')}}else{t.dataset.arm=1;t.textContent='اضغط للتأكيد'}return}
 if(d.myadd){const ta=$('#myta'),v=ta?(ta.value||'').trim():'';if(!v){toast('اكتب الدعاء أولاً');return}S.adhkar.my.push({u:Date.now().toString(36)+Math.floor(Math.random()*1296).toString(36),t:v});save();render();toast('أُضيف إلى دعائي');return}
 if(d.myedit){myEditing=d.myedit;render();return}
 if(d.mycancel){myEditing=null;render();return}
 if(d.mysave){const it=S.adhkar.my.find(x=>x.u===d.mysave),ta=$('#myedit');if(it&&ta){const v=(ta.value||'').trim();if(v)it.t=v;else toast('الدعاء فارغ، لم يُحفظ');save()}myEditing=null;render();return}
 if(d.mydel){if(t.dataset.arm){const i=S.adhkar.my.findIndex(x=>x.u===d.mydel);if(i>=0){const it=S.adhkar.my[i];delete S.adhkar.rem['i:my|'+it.u];remSyncOne('i:my|'+it.u);S.adhkar.my.splice(i,1);save();render();toast('حُذف من دعائي')}}else{t.dataset.arm=1;t.textContent='اضغط للتأكيد'}return}
 if(d.aitem){const k=d.aitem,sec0=k.split('|')[0],it=asec(sec0).items[+k.split('|')[1]];const cur=S.adhkar.prog[k]==null?it.c:S.adhkar.prog[k];if(cur>0){S.adhkar.prog[k]=cur-1;const fin=cur-1===0;if(fin){toast('تم');doneFx()}else vib(10);save();render();if(fin){const bb=document.querySelector('[data-aitem="'+k+'"]'),cc=bb&&bb.closest('.card');if(cc){cc.classList.add('adone');setTimeout(()=>cc.classList.remove('adone'),900)}}}return}
 if(d.arsec){Object.keys(S.adhkar.prog).forEach(k=>{if(k.startsWith(d.arsec+'|'))delete S.adhkar.prog[k]});save();render();return}
 if(d.tb){const s=asec('tasbih'),tb=S.adhkar.tasbih,it=s.items[tb.i];tb.n++;vib(12);let dn=false;if(tb.n>=it.c){toast('أتممت العدد');doneFx();tb.n=0;dn=true}save();const w=t.closest('.tbwrap');if(w){const num=w.querySelector('.tbnum'),fg=w.querySelector('.tbring-fg');if(num){if(tb.n===0)num.innerHTML='<i class="tbo"></i>';else num.textContent=AR(tb.n)}if(fg)fg.style.strokeDashoffset=(565.49*(1-tb.n/it.c)).toFixed(1);w.setAttribute('aria-label','زر التسبيح، العدد '+AR(tb.n)+' من '+AR(it.c));if(dn){w.classList.add('tbdone');setTimeout(()=>w.classList.remove('tbdone'),700)}}else render();return}
 if(d.tbrst){S.adhkar.tasbih.n=0;save();render();return}
 if(d.tbpick){const s=asec('tasbih'),tb=S.adhkar.tasbih;tb.i=(tb.i+1)%s.items.length;tb.n=0;save();render();return}
 if(d.rem){const id=d.rem,r=S.adhkar.rem[id]=S.adhkar.rem[id]||{};r.on=!r.on;if(r.on&&r.hh==null)toast('حدّد الوقت من الخانة بجانبه ليبدأ التنبيه');remSyncOne(id);if(r.on)remAskPerm();save();render();return}
 if(d.irem){const ik='i:'+d.irem,r=S.adhkar.rem[ik]=S.adhkar.rem[ik]||{};r.on=!r.on;if(r.on&&r.hh==null)toast('حدّد الوقت من الخانة ليبدأ تنبيه هذا الذكر');remSyncOne(ik);if(r.on)remAskPerm();save();render();return}
 if(d.remfix){if(remNative())window.__FIQH_REMIND.openNotificationSettings();return}
 if(d.remexact){if(remNative())window.__FIQH_REMIND.requestExact();return}
 if(d.remperm){if(remNative())window.__FIQH_REMIND.requestNotifications();return}
 if(d.reset){if(t.dataset.arm){S.bm=[];S.notes=[];S.prog={};S.last=null;save();toast('تم المسح');render()}else{t.dataset.arm=1;t.textContent='اضغط مرة أخرى للتأكيد'}return}
});
document.addEventListener('input',ev=>{const cc=ev.target.dataset&&ev.target.dataset.col;if(cc&&HEX.test(ev.target.value)){const o=Object.assign({},S.cfg.colors[mode()]);o[cc]=ev.target.value;const st=document.body.style;st.setProperty('--'+cc,ev.target.value);if(cc==='pri')st.setProperty('--onpri',lum(ev.target.value)>.4?'#0B1411':'#FFFFFF');if(cc==='card'||cc==='tx')st.setProperty('--soft',mix(colv('card',o),colv('tx',o),.07));const w=warnCol(o);const e=$('#colwarn');if(e)e.textContent=w.length?'تنبيه: '+w.join('، ')+'.':'';return}
 if(ev.target.id==='sitq'){sitQ=ev.target.value;const pos=ev.target.selectionStart;render();const i=$('#sitq');i.focus();i.setSelectionRange(pos,pos)}});
document.addEventListener('change',ev=>{const irt=ev.target.dataset&&ev.target.dataset.iremtime;
 if(irt){const v=ev.target.value,m=/^(\d{2}):(\d{2})$/.exec(v);const r=S.adhkar.rem['i:'+irt]=S.adhkar.rem['i:'+irt]||{};
  if(m){r.hh=+m[1];r.mm=+m[2];r.on=true;toastClear();remAskPerm()}else{r.hh=null;r.mm=null}
  remSyncOne('i:'+irt);save();render();return}
 const rt=ev.target.dataset&&ev.target.dataset.remtime;
 if(rt){const v=ev.target.value,m=/^(\d{2}):(\d{2})$/.exec(v);const r=S.adhkar.rem[rt]=S.adhkar.rem[rt]||{};
  if(m){r.hh=+m[1];r.mm=+m[2];r.on=true;toastClear();remAskPerm()}else{r.hh=null;r.mm=null}
  remSyncOne(rt);save();render();return}
 const cc=ev.target.dataset&&ev.target.dataset.col;if(!cc||!HEX.test(ev.target.value))return;const m=mode(),o=Object.assign({},S.cfg.colors[m]);o[cc]=ev.target.value.toLowerCase();
 if(ctr(colv('tx',o),colv('bg',o))<3||ctr(colv('tx',o),colv('card',o))<3||(S.dark&&ctr(colv('tx',o),'#0F2019')<3)){toast('هذا اللون يجعل النص غير مقروء، فلم يُحفظ');applyCfg();render();return}
 S.cfg.colors[m]=o;applyCfg();save();render()});
function applyCfg(){document.body.classList.toggle('nodeco',S.cfg.deco===false);const st=document.body.style;['bg','card','tx','pri','acc','bd','hd','ic','onpri','soft'].forEach(k=>st.removeProperty('--'+k));const o=S.cfg.colors[mode()]||{};Object.keys(o).forEach(k=>{if(HEX.test(o[k]))st.setProperty('--'+k,o[k])});if(o.pri&&HEX.test(o.pri))st.setProperty('--onpri',lum(o.pri)>.4?'#0B1411':'#FFFFFF');if((o.card&&HEX.test(o.card))||(o.tx&&HEX.test(o.tx)))st.setProperty('--soft',mix(colv('card',o),colv('tx',o),.07));document.documentElement.style.setProperty('--lh',S.cfg.lh);document.body.classList.toggle('f-naskh',S.cfg.font==='naskh');document.body.classList.toggle('comfy',!!S.cfg.comfy)}
function applyTheme(){document.body.classList.toggle('dark',S.dark);applyCfg();$('#darkbtn').innerHTML=ico('moon');$('#darkbtn').setAttribute('aria-pressed',S.dark)}
function init(){
 document.documentElement.style.setProperty('--fs',S.fs);
 $('#navbar').innerHTML=[['home','الرئيسية','home'],['worship','العبادات','list'],['adhkar','الأذكار','crescent'],['sit','مواقف سريعة','help'],['mine','تأملاتي','pen']].map(n=>'<button data-go="'+n[0]+'">'+ico(n[2])+n[1]+'</button>').join('');
 ['click','input','scroll','keydown','touchstart'].forEach(e=>document.addEventListener(e,()=>{lastAct=Date.now()},{passive:true}));
 setInterval(()=>{if(document.visibilityState==='visible'&&Date.now()-lastAct<12e4){study().secs+=30;save()}},3e4);
 $('#setbtn').innerHTML=ico('gear')+'<span class="setlab">الإعدادات</span>';$('#setbtn').onclick=()=>go('settings');
 $('#darkbtn').onclick=()=>{S.dark=!S.dark;applyTheme();save();render()};
 const si=$('#q');si.addEventListener('input',()=>{searchQ=si.value;if(searchQ.trim().length>=1){if(R.r!=='search'){R.r='search';history.replaceState(null,'','#/search')}render()}else{go('home')}});
 setInterval(remTick,3e4);remSyncAll();
 applyCfg();applyTheme();parse();render()}

/* حاسبة الفرائض: واجهة */
const CS={h:{},madhhab:'jumhur',radd:true,v:{value:'',funeral:'',debts:'',will:''}};
const iso=x=>'\u2066'+AR(x)+'\u2069';
function vCalc(){
 let h='<button class="back" data-go="worship/faraid">‹ باب الفرائض</button><h2 style="margin-top:0">حاسبة الفرائض</h2>';
 h+='<div class="banner">تطبق الحاسبة قواعد كتاب «فقه الفرائض: درس مختصر» فقط: الحجب، والفروض، والعصبات، والعَول، والرد، ومسألتي العمريتين والمشتركة. لا تشمل الحمل والخنثى والمفقود وذوي الأرحام والمناسخات. وليست بديلاً عن مراجعة مختص في المسائل المعقدة.</div>';
 h+='<div class="card"><h3>المذهب</h3><div class="chips wrap"><button class="chip '+(CS.madhhab==="hanafi"?"on":"")+'" data-cm="hanafi">الحنفية</button><button class="chip '+(CS.madhhab==="jumhur"?"on":"")+'" data-cm="jumhur">الجمهور (كما في الكتاب)</button></div><div class="mut">يؤثر في ميراث الجد مع الإخوة، والمشتركة. الكتاب ينسب القول الثاني إلى «الجمهور» دون تعيين المالكية والشافعية والحنابلة.</div>'
  +'<div class="srow"><div><b>الرد على أصحاب الفروض</b><div class="mut">عند عدم العصبة. المالكية لا يردون، والشافعية يردون إن لم ينتظم بيت المال.</div></div><button class="tgl'+(CS.radd?' on':'')+'" role="switch" aria-label="الرد على أصحاب الفروض" aria-checked="'+CS.radd+'" data-cr="1"><i></i></button></div></div>';
 h+='<div class="card"><h3>التركة (اختياري)</h3>'+[['value','قيمة التركة'],['funeral','تجهيز وتكفين'],['debts','الديون'],['will','الوصية']].map(x=>'<div class="srow"><b>'+x[1]+'</b><input class="ninput" type="number" inputmode="decimal" min="0" id="ce_'+x[0]+'" value="'+CS.v[x[0]]+'" style="max-width:150px"></div>').join('')+'<div class="mut">الترتيب كما في الكتاب: التجهيز، ثم الديون، ثم الوصية (حتى الثلث، وما زاد موقوف على إجازة الورثة)، ثم القسمة على الصافي.</div></div>';
 h+='<div class="card"><h3>الورثة</h3>'+FR_HEIRS.map(x=>'<div class="srow"><b>'+x[1]+'</b><span class="crow"><button class="chip" data-cc="'+x[0]+':-1" aria-label="إنقاص">−</button><b id="cv_'+x[0]+'" style="min-width:28px;text-align:center">'+AR(CS.h[x[0]]||0)+'</b><button class="chip" data-cc="'+x[0]+':1" aria-label="زيادة">+</button></span></div>').join('')+'</div>';
 h+='<div class="row" style="justify-content:center"><button class="btn pri" data-ccalc="1">احسب</button><button class="btn" data-creset="1">مسح</button></div><div id="cres"></div>';
 return h}
function calcRun(){
 ['value','funeral','debts','will'].forEach(k=>{const e=document.getElementById('ce_'+k);if(e)CS.v[k]=e.value});
 const r=faraidCalc(CS.h,{madhhab:CS.madhhab,radd:CS.radd});const box=document.getElementById('cres');if(!box)return;
 if(r.error){box.innerHTML='<div class="card" style="border-color:var(--bad)"><b>'+esc(r.error)+'</b></div>';return}
 const est=faraidEstate(CS.v),has=(+CS.v.value)>0;
 const fs=f=>f.d===1n?iso(f.n.toString()):iso(f.n.toString()+'/'+f.d.toString());
 const amt=f=>has?(est.net*Number(f.n)/Number(f.d)).toLocaleString('en-US',{maximumFractionDigits:2}):'';
 let o='<h3>النتيجة</h3>';
 if(has){o+='<div class="card"><b>صافي التركة: '+iso(est.net.toLocaleString("en-US",{maximumFractionDigits:2}))+'</b><div class="mut">بعد التجهيز والديون والوصية ('+iso(est.wEff.toLocaleString("en-US",{maximumFractionDigits:2}))+' نافذة)'+(est.wOver>0?'. تنبيه: الوصية زادت عن الثلث بمقدار '+iso(est.wOver.toLocaleString("en-US",{maximumFractionDigits:2}))+' وهو موقوف على إجازة الورثة ولم يُحسب':'')+'</div></div>'}
 o+=r.rows.map(x=>'<div class="card"><h3>'+esc(x.label)+(x.count>1?' ('+AR(x.count)+')':'')+' <span class="tag '+(x.status==='محجوب'||x.status.indexOf('لا شيء')===0?'':'gold')+'">'+esc(x.status)+'</span></h3>'+(x.reason?'<div class="mut">سبب الحجب: '+esc(x.reason)+'</div>':'<div>نصيب المجموع: <b>'+fs(x.frac)+'</b>'+(has?' = '+iso(amt(x.frac)):'')+(x.count>1?'<br>نصيب الواحد: <b>'+fs(x.per)+'</b>'+(has?' = '+iso(amt(x.per)):''):'')+'</div>')+'</div>').join('');
 o+='<div class="card"><h3>خطوات الحل</h3><p>أصل المسألة (من مقامات الفروض): <b>'+iso(r.asl.toString())+'</b>'+(r.awl?' ثم عالت':'')+'. بعد التصحيح تُقسم التركة إلى <b>'+iso(r.sahm.toString())+'</b> سهماً.</p>'+r.steps.map(t=>'<p>• '+esc(t)+'</p>').join('')+'</div>';
 if(r.warn.length)o+='<div class="card" style="border-color:var(--acc)"><h3>تنبيهات</h3>'+r.warn.map(t=>'<p>• '+esc(t)+'</p>').join('')+'</div>';
 box.innerHTML=o;box.scrollIntoView&&box.scrollIntoView({behavior:'smooth',block:'start'})}
document.addEventListener('click',ev=>{const t=ev.target.closest&&ev.target.closest('[data-cc],[data-cm],[data-cr],[data-ccalc],[data-creset]');if(!t||R.r!=='calc')return;
 if(t.dataset.cc){const p=t.dataset.cc.split(':'),k=p[0],d=+p[1],x=FR_HEIRS.find(y=>y[0]===k),max=x?x[2]:1;CS.h[k]=Math.max(0,Math.min(max,(CS.h[k]||0)+d));if(k==='husband'&&CS.h[k])CS.h.wife=0;if(k==='wife'&&CS.h[k])CS.h.husband=0;FR_HEIRS.forEach(y=>{const e=document.getElementById('cv_'+y[0]);if(e)e.textContent=AR(CS.h[y[0]]||0)});return}
 if(t.dataset.cm){CS.madhhab=t.dataset.cm;['value','funeral','debts','will'].forEach(k=>{const e=document.getElementById('ce_'+k);if(e)CS.v[k]=e.value});render();return}
 if(t.dataset.cr){CS.radd=!CS.radd;['value','funeral','debts','will'].forEach(k=>{const e=document.getElementById('ce_'+k);if(e)CS.v[k]=e.value});render();return}
 if(t.dataset.ccalc){calcRun();return}
 if(t.dataset.creset){CS.h={};CS.v={value:'',funeral:'',debts:'',will:''};render()}
});

/* completion feedback */
function vib(p){try{if(S.cfg.vib===false)return;navigator.vibrate&&navigator.vibrate(p)}catch(e){}}
function chime(){try{if(S.cfg.sound===false)return;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!_ac)_ac=new AC();if(_ac.state==='suspended')_ac.resume();const t0=_ac.currentTime,out=_ac.createGain();out.gain.value=.35;out.connect(_ac.destination);[[660,0],[990,.16]].forEach(n=>{const o=_ac.createOscillator(),g=_ac.createGain();o.type='sine';o.frequency.value=n[0];g.gain.setValueAtTime(0,t0+n[1]);g.gain.linearRampToValueAtTime(.5,t0+n[1]+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+n[1]+.7);o.connect(g);g.connect(out);o.start(t0+n[1]);o.stop(t0+n[1]+.75)})}catch(e){}}
function doneFx(){vib([40,60,90]);chime()}
/* glass tap sound (WebAudio, synthesized) */
let _ac=null,_lastTink=0;
function tink(){try{if(S.cfg.sound===false)return;const now=Date.now();if(now-_lastTink<45)return;_lastTink=now;const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!_ac)_ac=new AC();if(_ac.state==='suspended')_ac.resume();const t=_ac.currentTime,base=2300+Math.random()*500,out=_ac.createGain();out.gain.value=.5;out.connect(_ac.destination);[[1,.16,.16],[2.76,.09,.11],[5.4,.05,.07],[8.9,.025,.04]].forEach(p=>{const o=_ac.createOscillator(),g=_ac.createGain();o.type='sine';o.frequency.value=base*p[0];g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(p[1],t+.003);g.gain.exponentialRampToValueAtTime(.0001,t+p[2]+.12);o.connect(g);g.connect(out);o.start(t);o.stop(t+p[2]+.15)})}catch(e){}}
document.addEventListener('pointerdown',ev=>{const t=ev.target&&ev.target.closest&&ev.target.closest('button,summary,a,.card[data-go],.wcard,.opt,.linkc,.chip,[data-go],[data-tb],[role=button],nav *');if(t&&!t.disabled)tink()},true);
window.__tink=tink;
/* opening splash */
(function(){try{const d=document.createElement('div');d.id='splash';d.setAttribute('role','button');d.setAttribute('aria-label','متابعة');d.innerHTML='<div class="sp-in"><div class="sp-orn">&#10022;</div><p class="sp-t">اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ<br>فِي الْأَوَّلِينَ<br>وَفِي الْآخِرِينَ<br>وَفِي الْمَلَأِ الْأَعْلَى<br>إِلَى يَوْمِ الدِّينِ</p><div class="sp-orn">&#10022;</div></div>';document.body.appendChild(d);let gone=false;const go=()=>{if(gone)return;gone=true;d.classList.add('out');setTimeout(()=>d.remove(),600)};d.addEventListener('click',go);setTimeout(go,3800)}catch(e){}})();
init();
})();
