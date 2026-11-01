#!/usr/bin/env python3
"""Verify release directory members and install exact approved originals atomically."""
import argparse,gzip,hashlib,json,pathlib,shutil
ROOT=pathlib.Path(__file__).resolve().parents[1]
def checksum(path):
 h=hashlib.sha256()
 with path.open('rb') as source:
  while chunk:=source.read(1048576):h.update(chunk)
 return h.hexdigest()
def main():
 p=argparse.ArgumentParser();p.add_argument('directory',type=pathlib.Path);a=p.parse_args();m=json.loads((ROOT/'site/featured-games.json').read_text());expected={f['releaseAsset']:f for f in m['files'] if f['path'] in m['expansion']['paths']}
 actual={x.name for x in a.directory.iterdir() if x.is_file()}
 if actual!=set(expected):raise ValueError('Release directory differs from exact manifest allowlist')
 dest=ROOT/'site/games'/m['commit'];dest.mkdir(parents=True,exist_ok=True)
 for name,f in expected.items():
  if pathlib.PurePosixPath(name).name!=name:raise ValueError('Unsafe game path')
  source=a.directory/name
  if source.is_symlink() or source.stat().st_size!=f['compressedBytes'] or checksum(source)!=f['compressedSHA256']:raise ValueError('Compressed archive mismatch: '+name)
  h=hashlib.sha1(f'blob {f["size"]}\0'.encode());count=0
  with gzip.open(source,'rb') as z:
   while chunk:=z.read(1048576):
    count+=len(chunk)
    if count>f['size']:raise ValueError('Oversized original')
    h.update(chunk)
  if count!=f['size'] or h.hexdigest()!=f['sha']:raise ValueError('Original blob mismatch')
  target=dest/(f['path']+'.gz');part=target.with_name(target.name+'.part');shutil.copyfile(source,part);part.replace(target)
 total=sum(x.stat().st_size for x in (ROOT/'site').rglob('*') if x.is_file())
 if total>=1_000_000_000:raise ValueError('Pages conservative 1 GB ceiling exceeded')
 print(f'Verified release additions; {len(m["files"])} hosted entries. Site: {total:,} bytes. No games executed.')
if __name__=='__main__':main()
