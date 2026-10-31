#!/usr/bin/env python3
"""Generate a reviewable, commit-pinned catalog using GitHub metadata."""
import json, hashlib, urllib.request, pathlib, re
ROOT=pathlib.Path(__file__).resolve().parents[1]
def get(path):
    with urllib.request.urlopen(urllib.request.Request('https://api.github.com/repos/UserArham/version/'+path,headers={'User-Agent':'Astrax-catalog'})) as r: return json.load(r)
def category(p):
    s=p.lower()
    if s.startswith('wispcraft'): return 'WISP-named builds'
    if any(x in s for x in ['injector','minicraft','scratch','mobile','4k']): return 'Extras'
    if any(x in s for x in ['classic','rd-','pre-release']): return 'Classic/pre-Classic'
    if any(x in s for x in ['alpha','indev','infdev']): return 'Alpha & early'
    if 'beta' in s or re.search(r'\bb1\.',s): return 'Beta'
    if any(x in s for x in ['client','novix','wurst','eagly','precision','eaglercraftz']): return 'Clients'
    return 'Release'
def generate(meta,commit,tree):
    assert not tree['truncated'], 'Truncated tree: enumerate subtrees before publishing'
    files=[{'path':x['path'],'size':x['size'],'sha':x['sha']} for x in tree['tree'] if x['type']=='blob']
    entries=[]
    for f in files:
        p=f['path']; s=p.lower()
        if not s.endswith(('.html','.htm')): continue
        entries.append(dict(f,id=hashlib.sha256(p.encode()).hexdigest()[:20],label=re.sub(r'[_-]+',' ',p.rsplit('.',1)[0]).strip(),category=category(p),runtime='WASM (filename)' if 'wasm' in s else 'JavaScript (filename)' if re.search(r'(^|[ _-])(js|javascript)([ ._-]|$)',s) else 'Unspecified',utility=s=='injector.html'))
    for e in entries: e['sameBlobPaths']=[f['path'] for f in files if f['sha']==e['sha'] and f['path']!=e['path']]
    return dict(repository='UserArham/version',commit=commit['sha'],tree=commit['commit']['tree']['sha'],retrieved='2026-10-31',truncated=False,has_pages=meta['has_pages'],license=meta['license'],totalBytes=sum(f['size'] for f in files),files=files,entries=entries)
if __name__=='__main__':
    m=get(''); c=get('commits/'+m['default_branch']); t=get('git/trees/'+c['commit']['tree']['sha']+'?recursive=1')
    out=generate(m,c,t); (ROOT/'site/catalog.json').write_text(json.dumps(out,indent=2)+'\n'); print(len(out['files']),len(out['entries']),out['totalBytes'])
