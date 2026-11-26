import sys,copy
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
def find(lid):
    for C in W:
        for L in C['lessons']:
            if L['id']==lid: return L
src={}
for lid in ('arkan','sunan1','sunan2','sunan3'):
    for k in find(lid)['khilaf']: src[lid+':'+k['id']]=k
L=find('salah1')
B="https://shamela.ws/book/11430bu/"
mp={'k1':'arkan:a5','k3':'arkan:a14','k4':'arkan:a13','k5':'arkan:a12','k6':'sunan2:v1','k7':'sunan1:u4','k8':'sunan3:t4'}
for k in L['khilaf']:
    if k['id'] in mp:
        s=src[mp[k['id']]]
        k['issue']=s['issue']; k['v']=copy.deepcopy(s['v']); k['note']=s['note']
    if k['id']=='k2':
        k['issue']='البسملة في الصلاة'
        k['v']={"hanafi":"تسن قراءتها سراً في أول الفاتحة من كل ركعة للإمام والمنفرد، وليست آية من الفاتحة.",
                "maliki":"تكره في الفرض قبل الفاتحة وقبل السورة على المشهور، وفي قول تجب، وفي قول تجوز. وتجوز في النفل. وليست آية من الفاتحة.",
                "shafii":"آية من الفاتحة. والأظهر أنها تجب في كل ركعة قبل الفاتحة، فرضاً أو نفلاً، والجهر بها تابع للقراءة.",
                "hanbali":"تسن قراءتها سراً في الصلاة السرية والجهرية، وليست آية من الفاتحة."}
        k['note']="المصدر: الموسوعة الفقهية الكويتية: البسملة في الصلاة (ج8 ص86-88): %s4753 ؛ آية من الفاتحة (ج32 ص8): %s20100 ؛ الجهر بالبسملة (ج16 ص181-182): %s9691 و %s9693 ؛ الإسرار (ج4 ص171): https://shamela.ws/book/11430/2337 . وقال القرافي من المالكية إن الأورع البسملة أول الفاتحة خروجاً من الخلاف، ويكره الجهر بها. وفي قول عند الحنفية: تجب بداية القراءة بها. تفصيل كل مذهب في ج8 ص86-88 لم يُقرأ كاملاً هنا." % (B,B,B,B)
lib.save(head,W,R,S)
print('ok')
