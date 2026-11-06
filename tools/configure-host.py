#!/usr/bin/env python3
"""Stage verified originals for a separately authorized host; never uploads or executes games."""
import argparse, hashlib, json, pathlib, shutil, urllib.parse
ROOT=pathlib.Path(__file__).resolve().parents[1]
def blob_hash(path,size):
    h=hashlib.sha1(f'blob {size}\0'.encode())
    with path.open('rb') as f:
        for chunk in iter(lambda:f.read(1024*1024),b''):h.update(chunk)
    return h.hexdigest()
def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--mirror',type=pathlib.Path,default=ROOT/'mirror')
    p.add_argument('--prepare',action='store_true',help='Verify and stage the complete tree in ignored game-host/COMMIT/')
    p.add_argument('--base-url',help='Already deployed commit-pinned static origin, e.g. https://games.example/COMMIT/')
    p.add_argument('--confirm-redistribution-rights',action='store_true')
    a=p.parse_args()
    if not a.prepare and not a.base_url:p.error('Use --prepare and/or --base-url')
    if not a.confirm_redistribution_rights:p.error('Confirm permission to republish the third-party collection first.')
    c=json.loads((ROOT/'site/catalog.json').read_text())
    if a.prepare:
        failures=[]
        for f in c['files']:
            src=a.mirror/f['path']
            if not src.resolve().is_relative_to(a.mirror.resolve()):raise ValueError('Unsafe path')
            if not src.is_file() or src.stat().st_size!=f['size'] or blob_hash(src,f['size'])!=f['sha']:failures.append(f['path'])
        if failures:
            print(json.dumps({'status':'incomplete','missingOrInvalid':failures},indent=2));return 1
        dest=ROOT/'game-host'/c['commit'];dest.mkdir(parents=True,exist_ok=True)
        for f in c['files']:
            target=dest/f['path']
            if not target.resolve().is_relative_to(dest.resolve()):raise ValueError('Unsafe destination')
            target.parent.mkdir(parents=True,exist_ok=True);part=target.with_name(target.name+'.part')
            if part.is_symlink():raise ValueError('Unsafe temporary file')
            shutil.copyfile(a.mirror/f['path'],part)
            if part.stat().st_size!=f['size'] or blob_hash(part,f['size'])!=f['sha']:raise ValueError('Staged verification failed')
            part.replace(target)
        print(f'Verified and staged {len(c["files"])} original files ({c["totalBytes"]} bytes) in {dest}. Nothing uploaded.')
    if a.base_url:
        u=urllib.parse.urlsplit(a.base_url)
        if u.scheme not in ['http','https'] or not u.hostname or u.username or u.password or u.query or u.fragment:p.error('Use an HTTP(S) origin without credentials, query or fragment.')
        config={'baseUrl':a.base_url.rstrip('/')+'/','commit':c['commit'],'note':'Configured by administrator; hosting reachability/CORS must be verified separately.'}
        (ROOT/'site/hosting.json').write_text(json.dumps(config,indent=2)+'\n')
        print('Updated site/hosting.json. This command has not deployed or tested the remote host.')
    return 0
if __name__=='__main__':raise SystemExit(main())
