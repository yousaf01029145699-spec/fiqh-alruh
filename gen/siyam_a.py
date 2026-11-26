import sys
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
for C in W:
  for L in C['lessons']:
    if L['id']=='siyam1':
      s=[x for x in L['steps'] if x['n']==5][0]
      s['action']='أفطر إذا غربت الشمس ولا تؤخر. وإذا أفطرت فهذا الذكر مروي عن النبي ﷺ عند الفطر.'
      s['dhikr']='ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ'
      s.pop('dhikrNone',None)
      s['ref']='البخاري (1957)، أبو داود (2357). درجة حديث أبي داود على sunnah.com: حسن (الألباني)'
      ids=[e['id'] for e in L['evidence']]
      L['evidence'].append({'id':'e%d'%(len(ids)+1),'type':'hadith','text':'كَانَ رَسُولُ اللَّهِ صلى الله عليه وسلم إِذَا أَفْطَرَ قَالَ: ذَهَبَ الظَّمَأُ وَابْتَلَّتِ الْعُرُوقُ وَثَبَتَ الأَجْرُ إِنْ شَاءَ اللَّهُ','ref':'سنن أبي داود 2357 (من حديث ابن عمر). درجته على sunnah.com: حسن (الألباني)','exact':True})
lib.save(head,W,R,S)
