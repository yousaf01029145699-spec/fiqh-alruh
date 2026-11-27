import re
import os;os.chdir(os.path.dirname(os.path.abspath(__file__)));os.makedirs('output',exist_ok=True);fonts=open('fonts.css').read();css=open('style.css').read();import glob;data=''.join(open(f,encoding='utf-8',newline='').read() for f in sorted(glob.glob('data/*.js')));open('data.js','w',encoding='utf-8',newline='').write(data);data=data+open('adhkar_data.js').read()+open('calc_engine.js').read().replace("if(typeof module!=='undefined')module.exports={faraidCalc,faraidEstate,frStr,F};",'');app=open('app.js').read()

import json,sys
_ids=set(re.findall(r'"id":\s*"([a-z0-9_]+)"',data))
_exp=set(json.load(open('expected_ids.json')))
_miss=sorted(_exp-_ids)
if _miss and '--approve-removal' not in sys.argv:
    print('BUILD FAILED: ids missing vs expected_ids.json:',_miss[:20],len(_miss)); sys.exit(1)
json.dump(sorted(_exp|_ids if '--approve-removal' not in sys.argv else _ids),open('expected_ids.json','w'))
pat="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cg fill='none' stroke='%23ffffff' stroke-opacity='.12' stroke-width='1'%3E%3Cpath d='M32 6l7 19 19 7-19 7-7 19-7-19-19-7 19-7z'/%3E%3Crect x='14' y='14' width='36' height='36' transform='rotate(45 32 32)'/%3E%3C/g%3E%3C/svg%3E\")"
pat2="url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='90' height='90'%3E%3Cg fill='none' stroke='%23C59B27' stroke-opacity='.18' stroke-width='1'%3E%3Cpath d='M45 5l10 28 28 10-28 10-10 28-10-28-28-10 28-10z'/%3E%3Crect x='20' y='20' width='50' height='50' transform='rotate(45 45 45)'/%3E%3C/g%3E%3C/svg%3E\")"
css=":root{--pat:%s;--pat2:%s}\n"%(pat,pat2)+css
html='''<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#0F4C3A"><title>فِقْهُ الرُّوح</title><style>%s
%s</style></head><body><div id="app"><header><div class="top"><h1>فِقْهُ الرُّوح: العبادات ومعانيها</h1><button class="ib" id="darkbtn" aria-label="الوضع الليلي"></button><button class="ib setb" id="setbtn" aria-label="الإعدادات"></button></div><div class="search"><input id="q" type="search" placeholder="ابحث في الأحكام والمعاني والمواقف" aria-label="بحث"></div></header><main id="view"></main></div><nav id="navbar" aria-label="التنقل"></nav><script>%s
%s</script></body></html>'''%(fonts,css,data,app)
open('output/fiqh-alruh.html','w').write(html)
print(len(html))
