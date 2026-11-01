#!/usr/bin/env python3
"""Stage a small, authorized, hash-verified subset as deterministic gzip originals."""
import argparse,gzip,hashlib,json,pathlib,shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
NAMES=['Eaglercraft 1.8.8 .html','Eaglercraft-1.12.html','Eaglercraft-1.5.2.html','Eaglercraft-4k-JS.html','Aero Client JS.html','PixelClient 1.8.8 JS.html','Koneclient-1.8.8.html','Precision.html']
def main():
 p=argparse.ArgumentParser();p.add_argument('--confirm-redistribution-rights',action='store_true');a=p.parse_args()
 if not a.confirm_redistribution_rights:p.error('Confirm rights before staging public game bytes.')
 c=json.loads((ROOT/'site/catalog.json').read_text());dest=ROOT/'site/games'/c['commit'];dest.mkdir(parents=True,exist_ok=True);files=[]
 for name in NAMES:
  f=next(f for f in c['files'] if f['path']==name);src=ROOT/'mirror'/name
  h=hashlib.sha1(f'blob {f["size"]}\0'.encode());h.update(src.read_bytes())
  if src.stat().st_size!=f['size'] or h.hexdigest()!=f['sha']:raise ValueError('Unverified mirror: '+name)
  target=dest/(name+'.gz');part=target.with_name(target.name+'.part')
  with src.open('rb') as source,part.open('wb') as output,gzip.GzipFile(filename='',mode='wb',fileobj=output,compresslevel=9,mtime=0) as archive:shutil.copyfileobj(source,archive,1024*1024)
  with gzip.open(part,'rb') as restored:
   data=restored.read();actual=hashlib.sha1(f'blob {len(data)}\0'.encode()+data).hexdigest()
  if len(data)!=f['size'] or actual!=f['sha']:raise ValueError('Compressed round-trip mismatch')
  part.replace(target);files.append({**f,'compressedBytes':target.stat().st_size,'compressedSHA256':hashlib.sha256(target.read_bytes()).hexdigest()})
 config={'baseUrl':f'games/{c["commit"]}/','commit':c['commit'],'compression':'gzip','files':[f['path'] for f in files],'note':'Eight featured originals mirrored with repository administrator-confirmed redistribution permission. All other catalog paths use pinned upstream. Gzip transport decompresses to original hash-verified HTML, without patching.'}
 (ROOT/'site/hosting.json').write_text(json.dumps(config,indent=2)+'\n')
 report={'commit':c['commit'],'selection':'Curated shortlist, not an independently measured popularity ranking.','authorization':'Repository administrator confirmed redistribution permission in this session on 2026-11-01. Upstream repository still declares no blanket license; no additional rights are granted.','files':files,'originalBytes':sum(f['size'] for f in files),'hostedBytes':sum(f['compressedBytes'] for f in files)}
 (ROOT/'site/featured-games.json').write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['originalBytes','hostedBytes']},indent=2))
if __name__=='__main__':main()
