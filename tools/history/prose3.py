import sys,re
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
by={L['id']:L for C in W for L in C['lessons']}
def clone(src,dst,group='why',tweak=None):
    it=None
    for g,v in by[src]['meaning'].items():
        for x in v:
            if x['id']==tweak[0]: it=dict(x)
    ids={x['id'] for g in by[dst]['meaning'].values() for x in g}
    n=max([int(i[1:]) for i in ids]+[0])+1; it['id']='m%d'%n
    if len(tweak)>1: it['d']=it['d']+' '+tweak[1]
    by[dst]['meaning'][group].append(it)
# jumua1 m1,m2 -> jumua2, jumua3
for d in('jumua2','jumua3'): clone('jumua1',d,tweak=('m1',)); clone('jumua1',d,tweak=('m2',))
for d in('jamaa2','jamaa3','jamaa4'): clone('jamaa1',d,tweak=('m1',))
for d in('safar2','safar3'): clone('safar1',d,tweak=('m1',))
for d in('sunan2','sunan3','sunan4'): clone('sunan1',d,tweak=('m2',))
for d in('mubtilat1','mubtilat2'): clone('arkan',d,tweak=('m2',))
by['sahw2']['meaning']['why'].append({'id':'m1','t':'ترغيماً للشيطان','d':'في حديث أبي سعيد الخدري: إذا شك أحدكم في صلاته فلم يدر كم صلى ثلاثاً أم أربعاً فليطرح الشك وليبن على ما استيقن، ثم يسجد سجدتين قبل أن يسلم، فإن كان صلى خمساً شفعن له صلاته، وإن كان صلى إتماماً لأربع كانتا ترغيماً للشيطان. فنص الحديث على أثر السجدتين في الحالتين.','kind':'حديث','ref':'مسلم (571أ). https://sunnah.com/muslim:571a'})
lib.save(head,W,R,S)
