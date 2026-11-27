import sys,json,re
sys.path.insert(0,'/downloads/fiqh-alruh-source/gen')
import lib
head,W,R,S=lib.load()
plan=json.load(open('/downloads/hv/plan.json'))
n=0
for C in W:
  for L in C['lessons']:
    r=L.get('hukmRef') or ''
    if 'http' in r or L['id'] not in plan or L['id']=='salah1': continue
    vol=list(plan[L['id']])[0]
    nums=[int(x) for x in re.findall(r'\d{4,5}',r)]
    nums=[x for x in nums if plan[L['id']][vol][0]-40<=x<=plan[L['id']][vol][1]+40]
    if len(nums)<2: print('skip',L['id'],r); continue
    a,b=nums[0],nums[-1]
    L['hukmRef']=r+'. بداية النطاق ونهايته: https://muslim-library.com/keoj/volume/%s/%d/ و https://muslim-library.com/keoj/volume/%s/%d/'%(vol,a,vol,b); n+=1
lib.save(head,W,R,S);print(n)
