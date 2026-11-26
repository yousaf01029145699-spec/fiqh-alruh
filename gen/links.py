import sys,re
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
ML="https://muslim-library.com/keoj/volume/%s/%s/"
URL=re.compile(r'https?://[^\s،)؛]+')
LIST=re.compile(r'(?<![/\d])(\d{4,5}(?:\s*(?:و|إلى)\s*\d{4,5})*)(?![\d/])')
def expand(txt,vol):
    toks=re.findall(r'\d+|و|إلى',txt)
    out=[];i=0
    while i<len(toks):
        if toks[i].isdigit():
            if i+2<len(toks) and toks[i+1]=='إلى':
                a,b=toks[i],toks[i+2]
                out.append(ML%(vol,a)+' إلى '+ML%(vol,b)); i+=3; continue
            out.append(ML%(vol,toks[i]))
        i+=1
    return ' و '.join(out)
def conv(t):
    if not isinstance(t,str): return t
    t=re.sub(r'(?<![/\w.])(muslim-library\.com/[^\s،)]+|islamqa\.info/[^\s،)]+|dar-alifta\.org/[^\s،)]+)',lambda m:'https://'+m.group(1),t)
    if not t.lstrip().startswith(('الموسوعة','المصدر: الموسوعة')) and not re.match(r'^\d{4,5}',t): return t
    # split around urls, convert page lists only in non-url text
    parts=re.split('('+URL.pattern+')',t)
    vol=None
    if 'مدخل حيض' in t: vol='18'
    elif 'مدخل نجاسة' in t: vol='40'
    elif re.match(r'^\d{4,5}',t): vol='27'
    res=[]
    for seg in parts:
        if URL.fullmatch(seg): res.append(seg); continue
        # track volume by nearest preceding mention
        def rep(m):
            return m.group(0)
        out='';pos=0
        for m in re.finditer(r'المجلد\s*(\d+)|'+LIST.pattern,seg):
            if m.group(1) and m.group(0).startswith('المجلد'):
                vol=m.group(1); continue
            lst=m.group(2) if m.lastindex and m.lastindex>=2 else None
            if lst is None: continue
            if not vol: continue
            ctx=seg[max(0,m.start()-12):m.start()]
            if not re.search(r'(صفحات|الصفحات|صفحة|ص|^|[؛،:]\s*|\s)$',ctx): continue
            out+=seg[pos:m.start()]+expand(lst,vol); pos=m.end()
        out+=seg[pos:]
        res.append(out)
    t2=''.join(res)
    t2=re.sub(r'(?:صفحات|الصفحات|صفحة)\s*(?=https?://)','',t2)
    t2=re.sub(r'\s+ص(?=https?://)',' ',t2)
    return t2
def walk(o):
    if isinstance(o,dict):
        for k,v in list(o.items()):
            if k in('ref','note') and isinstance(v,str): o[k]=conv(v)
            else: walk(v)
    elif isinstance(o,list):
        for x in o: walk(x)
walk(W)
lib.save(head,W,R,S)
