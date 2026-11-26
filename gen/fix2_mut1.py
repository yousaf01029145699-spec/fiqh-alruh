import sys
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()

# 1) duha m3: soften closing paraphrase to النووي's actual scope
OLD_END="فمعنى الحديث أن شكر نعمة المفاصل واجب على العبد كل يوم، وأن الله جعل ركعتين في الضحى كافيتين لأداء ذلك الشكر، وهذا هو سبب فضل هذه الصلاة."
NEW_END="فمعنى يجزئ عند النووي: تكفي، أي تقوم مقام تلك الصدقات المستحقة عن مفاصل الجسد كلها. ولفظ يجزئ يحتمل الضم من الإجزاء والفتح من جزى يجزئ أي كفى. واستخرج النووي من الحديث دليلاً على عظم فضل الضحى وكبير موقعها وأنها تصح ركعتين."
n=0
for w in W:
    for l in w['lessons']:
        if l['id']=='duha':
            for c in l['meaning']['why']:
                if c['id']=='m3':
                    assert OLD_END in c['d']
                    c['d']=c['d'].replace(OLD_END,NEW_END); n+=1

# 2) afw: move raw shamela URLs out of cells into notes (linkified by the app as [رابط N])
A7S="، صفحة الشاملة: https://shamela.ws/book/11444/324)"
A7H="، صفحة الشاملة: https://shamela.ws/book/21642/187)"
A14M="، صفحتا الشاملة: https://shamela.ws/book/569/107 و https://shamela.ws/book/569/108)"
NOTES={
 'a7':"الموسوعة (مدخل نجاسة): https://muslim-library.com/keoj/volume/40/27741/ و https://muslim-library.com/keoj/volume/40/27744/ | مغني المحتاج (ج1 ص408): https://shamela.ws/book/11444/324 | كشاف القناع (ج1 ص194): https://shamela.ws/book/21642/187",
 'a12':"الموسوعة (مدخل نجاسة): https://muslim-library.com/keoj/volume/40/27748/ | مغني المحتاج (ج1 ص408): https://shamela.ws/book/11444/324",
 'a14':"الموسوعة (مدخل نجاسة): https://muslim-library.com/keoj/volume/40/27741/ و https://muslim-library.com/keoj/volume/40/27742/ | كشاف القناع (ج1 ص194): https://shamela.ws/book/21642/187 | مواهب الجليل (ج1 ص108): https://shamela.ws/book/569/107 و https://shamela.ws/book/569/108",
}
for w in W:
    for l in w['lessons']:
        if l['id']=='afw':
            for r in l['khilaf']:
                for k,v in list(r['v'].items()):
                    for pat in (A7S,A7H,A14M):
                        if pat in v:
                            r['v'][k]=v.replace(pat,')'); n+=1
                if r['id'] in NOTES:
                    r['note']=NOTES[r['id']]; n+=1

# 3) mutahayyira fills from pages actually read
MF={
 ('m5','hanbali'):"الناسية لوقتها وعددها تجلس في كل شهر ستة أيام أو سبعة يكون ذلك حيضها ثم تغتسل، وهي فيما بعد ذلك مستحاضة تصوم وتصلي وتطوف، وعن أحمد أنها تجلس أقل الحيض (المغني ج1 ص321 كما نقلته الموسوعة).",
 ('m6','hanbali'):"إذا ذكرت عادتها رجعت إليها وقضت الواجب زمن العادة المنسية، كأن صامت فرضاً فيه فتقضيه، وقضت الواجب أيضاً زمن جلوسها في غيرها فتقتضي الصلاة والصوم ونحوهما (كشاف القناع ج1 ص210). ولم تنص الصفحات المقروءة من الموسوعة على قضاء رمضان للحنابلة.",
 ('m8','hanbali'):"بعد جلوسها ستة أو سبعة أيام وغسلها هي مستحاضة تصوم وتصلي وتطوف (المغني ج1 ص321 كما نقلته الموسوعة). ولم تذكر الصفحات المقروءة حكم دخولها المسجد عندهم.",
 ('m11','shafii'):"المعتادة الناسية لعادتها في النفاس يجري فيها الخلاف الجاري في المتحيرة في الحيض: ففي قول هي كالمبتدأة ترد إلى لحظة، وفي قول إلى أربعين يوماً، وعلى المذهب تؤمر بالاحتياط. ورجح إمام الحرمين الرد إلى مرد المبتدأة لأن أول النفاس معلوم (المجموع ج2 ص531 كما نقلته الموسوعة).",
 ('m11','hanbali'):"إن زاد دم النفساء على أربعين يوماً فصادف عادة الحيض فهو حيض، وإن لم يصادف عادة الحيض فهو استحاضة. وقال أحمد: إذا استمر بها الدم فإن كان في أيام حيضها الذي تقعده أمسكت عن الصلاة ولم يأتها زوجها، وإن لم يكن لها أيام كانت بمنزلة المستحاضة: تتوضأ لكل صلاة، وتصوم وتصلي إن أدركها رمضان ولا تقضي، ويأتيها زوجها (المغني ج1 ص346 كما نقلته الموسوعة).",
}
MNOTES={
 'm5':"الموسوعة (مدخل متحيرة، المجلد 36): https://muslim-library.com/keoj/volume/36/24419/ و https://muslim-library.com/keoj/volume/36/24420/ و https://muslim-library.com/keoj/volume/36/24432/",
 'm6':"الموسوعة (مدخل متحيرة، المجلد 36): https://muslim-library.com/keoj/volume/36/24422/ إلى https://muslim-library.com/keoj/volume/36/24432/ | كشاف القناع (ج1 ص210): https://shamela.ws/book/21642/203",
 'm8':"الموسوعة (مدخل متحيرة، المجلد 36): https://muslim-library.com/keoj/volume/36/24433/ و https://muslim-library.com/keoj/volume/36/24434/ و https://muslim-library.com/keoj/volume/36/24432/",
 'm11':"الموسوعة (مدخل متحيرة، المجلد 36): https://muslim-library.com/keoj/volume/36/24441/ و https://muslim-library.com/keoj/volume/36/24442/ و https://muslim-library.com/keoj/volume/36/24443/ و https://muslim-library.com/keoj/volume/36/24444/",
}
for w in W:
    for l in w['lessons']:
        if l['id']=='mutahayyira':
            l['definition']=l['definition'].replace('صفحات 24406 إلى 24442','صفحات 24406 إلى 24444'); n+=1
            l['hukmRef']=l['hukmRef'].replace('صفحات 24406 إلى 24442','صفحات 24406 إلى 24444'); n+=1
            for r in l['khilaf']:
                for (i,s),v in MF.items():
                    if r['id']==i:
                        r['v'][s]=v; n+=1
                if r['id'] in MNOTES:
                    r['note']=MNOTES[r['id']]; n+=1
            for r in l['fiqh']['nullifiers']:
                if r['id']=='n1':
                    r['d']=r['d'].replace('الصفحات 24425 إلى 24442','الصفحات 24425 إلى 24444'); n+=1
lib.save(head,W,R,S)
print('edits applied:',n)
