import sys
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
def E_(i,t,d,ref): return {'id':i,'t':t,'d':d,'kind':'الموسوعة','ref':ref}
Q=' والحديث المنقول فيها لم يُراجع هنا في أصله ولم تُحكم درجته.'
add={
'mufattirat':[
('why',E_('m3','الأكل ناسياً: هل يفسد الصوم؟','تذكر الموسوعة أن من شرط فساد الصوم بالأكل والشرب أن يكون الصائم قاصداً ذاكراً لصومه، فمن أكل أو شرب ناسياً أنه صائم لم يفسد صومه عند الجمهور، ويستوي في ذلك الفرض والنفل لعموم الأدلة. وخالف مالك في صوم رمضان فقال: من نسي فأكل أو شرب فعليه القضاء، أما في غير رمضان فيتم صومه ولا قضاء عليه. والحديث المنقول في الباب (من نسي وهو صائم فأكل أو شرب فليتم صومه فإنما أطعمه الله وسقاه) منقول في الموسوعة، ولم يُراجع هنا في أصله ولم تُحكم درجته.','الموسوعة الفقهية الكويتية، المجلد 28: https://muslim-library.com/keoj/volume/28/18498/')),
],
}
cnt=0
for C in W:
  for L in C['lessons']:
    if L['id'] in add:
      ids={x['id'] for g in L['meaning'].values() for x in g}
      for g,it in add[L['id']]:
        if it['id'] in ids:
          n=max(int(i[1:]) for i in ids)+1; it['id']='m%d'%n
        ids.add(it['id']); L['meaning'][g].append(it); cnt+=1
lib.save(head,W,R,S);print(cnt)
