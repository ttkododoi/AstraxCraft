#!/usr/bin/env python3
"""Build an authorized, size-bounded expansion; originals are never executed."""
import concurrent.futures,gzip,hashlib,json,pathlib,tarfile,sys
from mirror import mirror,digest
ROOT=pathlib.Path(__file__).resolve().parents[1]
def main():
 if '--confirm-redistribution-rights' not in sys.argv:raise SystemExit('Pass --confirm-redistribution-rights')
 c=json.loads((ROOT/'site/catalog.json').read_text());old=json.loads((ROOT/'site/featured-games.json').read_text());seen={f['sha'] for f in old['files']};candidates=[]
 for e in sorted(c['entries'],key=lambda e:({'Clients':0,'Release':1,'Beta':2,'Alpha & early':3}.get(e['category'],4),e['size'])):
  if e.get('utility') or e['sha'] in seen or e['path'].lower().startswith('wisp'):continue
  seen.add(e['sha']);candidates.append(e)
 dest=ROOT/'game-host/expanded';dest.mkdir(parents=True,exist_ok=True)
 def prepare(e):
  r=mirror(e,c['commit'],ROOT/'mirror','api')
  if r['status']=='failed':return e,None,r.get('error')
  target=dest/(e['path']+'.gz');source=ROOT/'mirror'/e['path']
  with source.open('rb') as inp,target.open('wb') as out,gzip.GzipFile(filename='',mode='wb',fileobj=out,compresslevel=9,mtime=0) as z:
   while chunk:=inp.read(1048576):z.write(chunk)
  sha=hashlib.sha1(f'blob {e["size"]}\0'.encode());count=0
  with gzip.open(target,'rb') as z:
   while chunk:=z.read(1048576):sha.update(chunk);count+=len(chunk)
  if count!=e['size'] or sha.hexdigest()!=e['sha']:raise ValueError('Round trip mismatch: '+e['path'])
  return e,{'path':e['path'],'size':e['size'],'sha':e['sha'],'compressedBytes':target.stat().st_size,'compressedSHA256':hashlib.sha256(target.read_bytes()).hexdigest()},None
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:results=list(pool.map(prepare,candidates))
 files=list(old['files']);total=sum(f['compressedBytes'] for f in files);omitted=[];budget=900_000_000
 for e,f,error in results:
  if error:omitted.append({'path':e['path'],'reason':error});continue
  if total+f['compressedBytes']>budget:omitted.append({'path':e['path'],'reason':'Site size budget'});continue
  files.append(f);total+=f['compressedBytes']
 # Release carries only additions, original eight archives stay in Git.
 package=ROOT/'game-host/astrax-expanded-games.tar'
 with tarfile.open(package,'w') as tar:
  for f in files[len(old['files']):]:tar.add(dest/(f['path']+'.gz'),arcname=f['path']+'.gz',recursive=False)
 sha=hashlib.sha256(package.read_bytes()).hexdigest()
 report={**old,'selection':'Distinct clients and release versions first, then earlier builds. Skip WISP-prefixed variants and identical Git blobs; bounded to 900,000,000 compressed game bytes. Not a measured popularity ranking.','files':files,'originalBytes':sum(f['size'] for f in files),'hostedBytes':total,'omitted':omitted,'expansion':{'tag':'astrax-games-2026-11-01','asset':package.name,'sha256':sha,'bytes':package.stat().st_size,'paths':[f['path'] for f in files[len(old['files']):]]}}
 (ROOT/'site/featured-games.json').write_text(json.dumps(report,indent=2)+'\n')
 config=json.loads((ROOT/'site/hosting.json').read_text());config['files']=[f['path'] for f in files];config['note']='Size-bounded administrator-authorized hosted collection; release archives are verified and assembled at deployment. Unlisted catalog paths stay pinned upstream.';(ROOT/'site/hosting.json').write_text(json.dumps(config,indent=2)+'\n')
 print(json.dumps({'hostedEntries':len(files),'originalBytes':report['originalBytes'],'hostedBytes':total,'releaseBytes':package.stat().st_size,'omitted':omitted},indent=2),flush=True)
 if any(error for _,_,error in results):print('Some upstream downloads failed; listed transparently in omitted.',file=sys.stderr)
if __name__=='__main__':main()
