#!/usr/bin/env python3
"""Stream pinned blobs; no downloaded code is executed. Python 3.11+, standard library."""
import argparse, concurrent.futures, hashlib, json, os, pathlib, time, urllib.request, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
def digest(path,size):
    h=hashlib.sha1(('blob '+str(size)+'\0').encode())
    with path.open('rb') as f:
        for b in iter(lambda:f.read(1024*1024),b''): h.update(b)
    return h.hexdigest()
def mirror(f,commit,dest,transport):
    rel=pathlib.PurePosixPath(f['path'])
    if rel.is_absolute() or '..' in rel.parts: raise ValueError('Unsafe upstream path')
    target=dest.joinpath(*rel.parts)
    if not target.resolve().is_relative_to(dest.resolve()): raise ValueError('Unsafe destination')
    target.parent.mkdir(parents=True,exist_ok=True)
    if target.exists() and target.stat().st_size==f['size'] and digest(target,f['size'])==f['sha']: return dict(path=f['path'],status='verified-skip')
    path='/'.join(urllib.parse.quote(s,safe='') for s in rel.parts)
    url=f'https://raw.githubusercontent.com/UserArham/version/{commit}/{path}' if transport=='raw' else f'https://api.github.com/repos/UserArham/version/git/blobs/{f["sha"]}'
    part=target.with_name(target.name+'.part')
    for attempt in range(3):
        try:
            req=urllib.request.Request(url,headers={'User-Agent':'Astrax-mirror','Accept':'application/vnd.github.raw+json'})
            with urllib.request.urlopen(req,timeout=90) as r,part.open('wb') as out:
                count=0
                while b:=r.read(1024*1024):
                    count+=len(b)
                    if count>f['size']: raise ValueError('Unexpected oversized response')
                    out.write(b)
            if part.stat().st_size!=f['size'] or digest(part,f['size'])!=f['sha']: raise ValueError('Byte count / Git blob SHA mismatch')
            os.replace(part,target); return dict(path=f['path'],status='verified')
        except Exception as e:
            part.unlink(missing_ok=True); error=str(e)
            if attempt<2: time.sleep(2**attempt)
    return dict(path=f['path'],status='failed',error=error)
def main():
    p=argparse.ArgumentParser(); g=p.add_mutually_exclusive_group(required=True); g.add_argument('--all',action='store_true'); g.add_argument('--file'); p.add_argument('--destination',type=pathlib.Path,default=ROOT/'mirror'); p.add_argument('--workers',type=int,choices=range(1,9),default=3); p.add_argument('--transport',choices=['raw','api'],default='raw'); p.add_argument('--report',type=pathlib.Path,default=ROOT/'mirror-report.json'); a=p.parse_args()
    c=json.loads((ROOT/'site/catalog.json').read_text()); files=[f for f in c['files'] if a.all or f['path']==a.file]
    if not files: p.error('Exact filename not in pinned inventory')
    with concurrent.futures.ThreadPoolExecutor(max_workers=a.workers) as ex: results=list(ex.map(lambda f:mirror(f,c['commit'],a.destination,a.transport),files))
    a.report.write_text(json.dumps(dict(commit=c['commit'],results=results),indent=2)+'\n')
    for r in results: print(r['status'],r['path'],r.get('error',''))
    return int(any(r['status']=='failed' for r in results))
if __name__=='__main__': raise SystemExit(main())
