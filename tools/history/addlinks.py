import sys,json
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
m=json.load(open('/tmp/match.json'))
head,W,R,S=lib.load()
n=0;skipped=[]
for C in W:
  for L in C['lessons']:
    for k in L['khilaf']:
        key='%s/%s'%(L['id'],k['id'])
        if key not in m: continue
        ln,top,sel=m[key]
        if top<5: skipped.append(key); continue
        sel=sorted(sel,key=lambda x:x[2])
        links=' و '.join('https://muslim-library.com/keoj/volume/%d/%d/'%(v,i) for s,v,i in sel)
        old=k.get('note','').strip()
        if old and not old.endswith(('.','؟','!')): old+='.'
        k['note']=(old+' ' if old else '')+'المصدر (الموسوعة الفقهية الكويتية، أقرب الصفحات نصاً): '+links
        n+=1
lib.save(head,W,R,S)
print('added',n,'skipped',len(skipped)); print(skipped)
