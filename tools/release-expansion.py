#!/usr/bin/env python3
"""Rebuild only approved release members from pinned upstream, without executing games."""
import concurrent.futures,gzip,hashlib,json,pathlib,shutil
from mirror import mirror
ROOT=pathlib.Path(__file__).resolve().parents[1]
def main():
 m=json.loads((ROOT/'site/featured-games.json').read_text());dest=ROOT/'game-host/release';dest.mkdir(parents=True,exist_ok=True)
 def prepare(f):
  r=mirror(f,m['commit'],ROOT/'mirror','api')
  if r['status']=='failed':raise ValueError(r)
  target=dest/f['releaseAsset']
  with (ROOT/'mirror'/f['path']).open('rb') as src,target.open('wb') as out,gzip.GzipFile(filename='',mode='wb',fileobj=out,compresslevel=9,mtime=0) as z:shutil.copyfileobj(src,z,1048576)
  if target.stat().st_size!=f['compressedBytes'] or hashlib.sha256(target.read_bytes()).hexdigest()!=f['compressedSHA256']:raise ValueError('Reproducible compression mismatch: '+f['path'])
  return f['path']
 with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
  for path in pool.map(prepare,[f for f in m['files'] if f['path'] in m['expansion']['paths']]):print('verified',path,flush=True)
if __name__=='__main__':main()
