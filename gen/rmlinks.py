import sys,re
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load();n=0
for C in W:
  for L in C['lessons']:
    for k in L['khilaf']:
      nt=k.get('note','')
      if 'أقرب الصفحات نصاً' in nt:
        nt=re.sub(r'\s*المصدر \(الموسوعة الفقهية الكويتية، أقرب الصفحات نصاً\):.*$','',nt).strip()
        if nt: k['note']=nt
        else: k.pop('note')
        n+=1
lib.save(head,W,R,S);print(n)
