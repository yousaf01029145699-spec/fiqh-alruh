/* حاسبة الفرائض: تطبق قواعد كتاب «فقه الفرائض: درس مختصر» فقط، بكسور دقيقة (BigInt). */
const FR_HEIRS=[
 ['husband','الزوج',1],['wife','الزوجة',4],['father','الأب',1],['mother','الأم',1],['grandfather','الجد (أبو الأب)',1],
 ['gm_mother','الجدة (أم الأم)',3],['gm_father','الجدة (أم الأب)',3],
 ['son','الابن',20],['daughter','البنت',20],['son_son','ابن الابن',20],['son_daughter','بنت الابن',20],
 ['full_brother','الأخ الشقيق',20],['full_sister','الأخت الشقيقة',20],['pat_brother','الأخ لأب',20],['pat_sister','الأخت لأب',20],
 ['mat_brother','الأخ لأم',20],['mat_sister','الأخت لأم',20],['uncle','العم الشقيق',20]
];
function _g(a,b){a=a<0n?-a:a;b=b<0n?-b:b;while(b){const t=a%b;a=b;b=t}return a}
function F(n,d){n=BigInt(n);d=BigInt(d===undefined?1:d);if(d<0n){n=-n;d=-d}const g=_g(n,d)||1n;return{n:n/g,d:d/g}}
const fadd=(a,b)=>F(a.n*b.d+b.n*a.d,a.d*b.d),fsub=(a,b)=>F(a.n*b.d-b.n*a.d,a.d*b.d),fmul=(a,b)=>F(a.n*b.n,a.d*b.d),fdiv=(a,b)=>F(a.n*b.d,a.d*b.n);
const fcmp=(a,b)=>{const x=a.n*b.d,y=b.n*a.d;return x<y?-1:x>y?1:0};
const FZ=F(0),FONE=F(1),fz=a=>a.n===0n;
const _lcm=(a,b)=>a/_g(a,b)*b;
const frStr=a=>a.d===1n?String(a.n):a.n+'/'+a.d;
function faraidCalc(inp,opt){
 opt=opt||{};const mz=opt.madhhab==='hanafi'?'hanafi':'jumhur';const useRadd=opt.radd!==false;
 const h={};FR_HEIRS.forEach(x=>{h[x[0]]=Math.min(x[2],Math.max(0,Math.floor(+inp[x[0]]||0)))});
 const warn=[],steps=[];
 if(h.husband&&h.wife)return{error:'لا يجتمع زوج وزوجة في مسألة واحدة.'};
 if(!Object.keys(h).some(k=>h[k]))return{error:'اختر وارثاً واحداً على الأقل.'};
 const B={};const blk=(k,r)=>{if(h[k]&&!B[k])B[k]=r};
 const maleDesc=h.son+h.son_son>0,femDesc=h.daughter+h.son_daughter>0,anyDesc=maleDesc||femDesc;
 const gf=h.grandfather>0&&!h.father;
 if(h.grandfather&&h.father)blk('grandfather','الأب أقرب منه');
 if(h.mother){blk('gm_mother','الأم');blk('gm_father','الأم')}
 if(h.father)blk('gm_father','الأب');
 if(h.son){blk('son_son','الابن');blk('son_daughter','الابن')}
 if(h.son||h.son_son){['full_brother','full_sister','pat_brother','pat_sister','uncle'].forEach(k=>blk(k,h.son?'الابن':'ابن الابن'))}
 if(anyDesc){blk('mat_brother','الفرع الوارث');blk('mat_sister','الفرع الوارث')}
 if(h.father||h.grandfather){blk('mat_brother','الأب أو الجد');blk('mat_sister','الأب أو الجد');blk('uncle','الأب أو الجد')}
 const asc=h.father>0||(gf&&mz==='hanafi');
 if(asc)['full_brother','full_sister','pat_brother','pat_sister'].forEach(k=>blk(k,h.father?'الأب':'الجد عند الحنفية'));
 if(!h.son&&h.daughter>=2&&!h.son_son)blk('son_daughter','البنتان الصلبيتان');
 const L=k=>h[k]&&!B[k]?h[k]:0;
 if(L('full_brother')){blk('pat_brother','الأخ الشقيق');blk('pat_sister','الأخ الشقيق');blk('uncle','الأخ الشقيق')}
 const fsMG=L('full_sister')>0&&!L('full_brother')&&femDesc; // عصبة مع الغير
 if(fsMG){blk('pat_brother','الأخت الشقيقة عصبة مع الفرع المؤنث');blk('pat_sister','الأخت الشقيقة عصبة مع الفرع المؤنث');blk('uncle','الأخت الشقيقة عصبة مع الفرع المؤنث')}
 if(h.full_sister>=2&&!L('full_brother')&&!h.pat_brother)blk('pat_sister','الأختان الشقيقتان');
 if(L('pat_brother'))blk('uncle','الأخ لأب');
 if(L('pat_sister')&&femDesc&&!L('pat_brother')&&!L('full_sister')&&!L('full_brother'))blk('uncle','الأخت لأب عصبة مع الفرع المؤنث');
 const A={};// فروض الفريق كاملاً
 const sibTotal=h.full_brother+h.full_sister+h.pat_brother+h.pat_sister+h.mat_brother+h.mat_sister;
 if(h.husband)A.husband=anyDesc?F(1,4):F(1,2);
 if(h.wife)A.wife=anyDesc?F(1,8):F(1,4);
 let umar=false;
 if(h.mother){
  if(anyDesc||sibTotal>=2)A.mother=F(1,6);
  else if(h.father&&(h.husband||h.wife)){umar=true}
  else A.mother=F(1,3);
 }
 if(L('gm_mother')+L('gm_father'))A.grand=F(1,6);
 if(!h.son&&h.daughter)A.daughter=h.daughter===1?F(1,2):F(2,3);
 if(!h.son&&!h.son_son&&L('son_daughter')){
  if(!h.daughter)A.son_daughter=L('son_daughter')===1?F(1,2):F(2,3);
  else if(h.daughter===1)A.son_daughter=F(1,6);
 }
 if(h.father&&anyDesc)A.father=F(1,6);
 if(gf&&mz==='hanafi'&&anyDesc)A.grandfather=F(1,6);
 const mat=L('mat_brother')+L('mat_sister');
 if(mat)A.mat=mat===1?F(1,6):F(1,3);
 const jadJ=gf&&mz==='jumhur'&&(L('full_brother')+L('full_sister')+L('pat_brother')+L('pat_sister')>0);
 if(gf&&mz==='jumhur'&&!jadJ&&anyDesc)A.grandfather=F(1,6);
 if(!jadJ){
  const fsAs=L('full_sister')>0&&(L('full_brother')||femDesc),psAs=L('pat_sister')>0&&(L('pat_brother')||femDesc);
  if(L('full_sister')&&!fsAs)A.full_sister=h.full_sister===1?F(1,2):F(2,3);
  if(L('pat_sister')&&!psAs&&!L('full_brother')){
   if(L('full_sister')===1)A.pat_sister=F(1,6);
   else if(!L('full_sister'))A.pat_sister=h.pat_sister===1?F(1,2):F(2,3);
  }
 }
 let S=FZ;Object.keys(A).forEach(k=>{S=fadd(S,A[k])});
 if(umar){const sp=A.husband||A.wife;A.mother=fdiv(fsub(FONE,sp),F(3));S=fadd(S,A.mother);steps.push('مسألة العمريتين: للأم ثلث الباقي بعد نصيب أحد الزوجين، لوجود الأب.')}
 const W={};// أوزان العصبة
 let rest=fsub(FONE,S);
 let sibsMuq=null;
 if(jadJ){
  warn.push('الجد مع الإخوة (الجمهور): تطبق الحاسبة ما في الكتاب فقط (المقاسمة أو الباقي أو السدس). الكتاب لا يذكر «ثلث الباقي»، فراجع مختصاً عند وجود ثلاثة إخوة فأكثر.');
  let m=L('full_brother'),f=L('full_sister'),key='full';
  if(!m&&!f){m=L('pat_brother');f=L('pat_sister');key='pat'}
  if(key==='full'){blk('pat_brother','محجوب بالأشقاء في هذه الحاسبة');blk('pat_sister','محجوب بالأشقاء في هذه الحاسبة')}
  const six=F(1,6);
  if(m===0&&!femDesc){
   const fr=f===1?F(1,2):F(2,3);A[key+'_sister']=fr;S=fadd(S,fr);rest=fsub(FONE,S);
   const j=fcmp(six,rest)>0?six:rest;A.grandfather=j;S=fadd(S,j);rest=fsub(FONE,S);
   steps.push('الجد مع الأخوات غير المعصبات: لهن فرضهن وللجد الباقي (أو السدس إن نقص عنه).');
  }else{
   const jm=fdiv(fmul(rest,F(2)),F(2+2*m+f));
   const jd=fcmp(six,jm)>0?six:jm;A.grandfather=jd;S=fadd(S,jd);
   const sib=fcmp(FONE,S)>0?fsub(FONE,S):FZ;rest=FZ;
   sibsMuq={key,m,f,share:sib};
   steps.push(fcmp(six,jm)>0?'المقاسمة تنقص نصيب الجد عن السدس، فأخذ السدس والباقي للإخوة.':'الجد يقاسم الإخوة (كأخ منهم) والمقاسمة خير له من السدس.');
  }
 }
 let grp=null;// فريق العصبة
 if(!sibsMuq){
  const g=(name,m,f)=>({name,m,f});
  if(h.son)grp=g('الابن',['son',h.son],h.daughter?['daughter',h.daughter]:null);
  else if(L('son_son'))grp=g('ابن الابن',['son_son',h.son_son],L('son_daughter')?['son_daughter',h.son_daughter]:null);
  else if(h.father&&!B.father)grp=g('الأب',['father',1],null);
  else if(gf&&(mz==='hanafi'||!jadJ))grp=g('الجد',['grandfather',1],null);
  else if(L('full_brother'))grp=g('الأخ الشقيق',['full_brother',h.full_brother],L('full_sister')?['full_sister',h.full_sister]:null);
  else if(fsMG)grp=g('الأخت الشقيقة',null,['full_sister',h.full_sister]);
  else if(L('pat_brother'))grp=g('الأخ لأب',['pat_brother',h.pat_brother],L('pat_sister')?['pat_sister',h.pat_sister]:null);
  else if(L('pat_sister')&&femDesc&&!L('full_brother')&&!L('full_sister'))grp=g('الأخت لأب',null,['pat_sister',h.pat_sister]);
  else if(L('uncle'))grp=g('العم',['uncle',h.uncle],null);
 }
 const res={};// share بالفريق
 const put=(k,f)=>{res[k]=res[k]?fadd(res[k],f):f};
 // عَول
 if(fcmp(S,FONE)>0){
  Object.keys(A).forEach(k=>put(k,fdiv(A[k],S)));
  steps.push('عَول: مجموع الفروض يزيد على الواحد، فتُنقص الحصص جميعاً بنسبة واحدة (الطريقة الأولى، وهي المعمول بها في الكتاب).');
 }else{
  Object.keys(A).forEach(k=>put(k,A[k]));
  if(sibsMuq&&!fz(sibsMuq.share)){
   const {key,m,f,share}=sibsMuq,tot=2*m+f;
   if(m)put(key+'_brother',fdiv(fmul(share,F(2*m)),F(tot)));
   if(f)put(key+'_sister',fdiv(fmul(share,F(f)),F(tot)));
  }
  if(grp&&fcmp(rest,FZ)>0){
   const mc=grp.m?grp.m[1]:0,fc=grp.f?grp.f[1]:0,tot=2*mc+fc;
   if(mc)put(grp.m[0],fdiv(fmul(rest,F(2*mc)),F(tot)));
   if(fc)put(grp.f[0],fdiv(fmul(rest,F(fc)),F(tot)));
   rest=FZ;
  }else if(fcmp(rest,FZ)>0){
   const nonSp=Object.keys(A).filter(k=>k!=='husband'&&k!=='wife');
   if(useRadd&&nonSp.length){
    let T=FZ;nonSp.forEach(k=>{T=fadd(T,A[k])});
    nonSp.forEach(k=>put(k,fdiv(fmul(rest,A[k]),T)));
    steps.push('رَدّ: لا عصبة في المسألة، فرُدّ الباقي على أصحاب الفروض من غير الزوجين كل بقدر فرضه (قول جماهير العلماء كما في الكتاب).');
    rest=FZ;
   }
  }
 }
 // المشتركة
 let mush=false;
 if(!jadJ&&h.husband&&!anyDesc&&!h.father&&!h.grandfather&&mat>=2&&(h.mother||L('gm_mother')+L('gm_father'))&&L('full_brother')&&grp&&grp.name==='الأخ الشقيق'&&fcmp(S,FONE)===0){
  mush=true;
  if(mz==='jumhur'){
   const third=res.mat,cnt=mat+h.full_brother+(L('full_sister')||0);
   const each=fdiv(third,F(cnt));
   res.mat=fmul(each,F(mat));res.full_brother=fmul(each,F(h.full_brother));if(L('full_sister'))res.full_sister=fmul(each,F(h.full_sister));
   steps.push('المشتركة (اليمية والحمارية): عند الجمهور يُشرَّك الإخوة الأشقاء مع الإخوة لأم في الثلث، الذكر والأنثى سواء (القضاء الثاني لعمر).');
  }else steps.push('المشتركة: عند الحنفية القضاء الأول: الإخوة الأشقاء عصبة ولا شيء لهم بعد الفروض.');
 }
 // حصة الفريق إلى أفراد
 const rows=[];
 const lab=Object.fromEntries(FR_HEIRS.map(x=>[x[0],x[1]]));
 FR_HEIRS.forEach(x=>{
  const k=x[0];if(!h[k])return;
  if(B[k]){rows.push({key:k,label:x[1],count:h[k],status:'محجوب',reason:B[k],frac:FZ,per:FZ});return}
  let fr;
  if(k==='gm_mother'||k==='gm_father'){const t=res.grand||FZ;const c=L('gm_mother')+L('gm_father');fr=fmul(t,F(h[k],c))}
  else if(k==='mat_brother'||k==='mat_sister'){const t=res.mat||FZ;fr=fmul(t,F(h[k],mat))}
  else fr=res[k]||FZ;
  const per=fdiv(fr,F(h[k]));
  let status='فرض';
  if(grp&&((grp.m&&grp.m[0]===k)||(grp.f&&grp.f[0]===k)))status=A[k]?'فرض وتعصيب':'عصبة';
  if(sibsMuq&&(k===sibsMuq.key+'_brother'||k===sibsMuq.key+'_sister'))status='مقاسمة';
  if(k==='grandfather'&&sibsMuq)status='فرض أو مقاسمة';
  if(k==='uncle')status='عصبة';
  if(fz(fr))status='لا شيء بعد الفروض';
  rows.push({key:k,label:x[1],count:h[k],status,reason:'',frac:fr,per});
 });
 let used=FZ;rows.forEach(r=>{used=fadd(used,r.frac)});
 const left=fsub(FONE,used);
 if(fcmp(left,FZ)>0)warn.push('بقي من التركة '+frStr(left)+' ولا وارث يستحقه في هذه الحاسبة: يذهب إلى ذوي الأرحام أو بيت المال (أو الرد على الزوجين عند من قال به)، وهي خارج نطاق الحاسبة.');
 let den=1n;rows.forEach(r=>{den=_lcm(den,r.frac.d)});
 let asl0=1n;Object.keys(A).forEach(k=>{asl0=_lcm(asl0,A[k].d)});
 return{rows,steps,warn,asl:asl0,sahm:den,left,awl:fcmp(S,FONE)>0,madhhab:mz,mushtaraka:mush};
}
function faraidEstate(e){
 const v=+e.value||0,tj=+e.funeral||0,db=+e.debts||0,ws=+e.will||0;
 const afterDebt=Math.max(0,v-tj-db);const wcap=afterDebt/3;const wEff=Math.min(ws,wcap);
 const net=Math.max(0,afterDebt-wEff);
 return{net,wEff,wOver:Math.max(0,ws-wcap),afterDebt}
}
if(typeof module!=='undefined')module.exports={faraidCalc,faraidEstate,frStr,F};
