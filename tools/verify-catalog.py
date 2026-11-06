#!/usr/bin/env python3
"""Offline structural verification. Does not confuse this with game verification."""
import json,hashlib,pathlib,urllib.parse
c=json.loads((pathlib.Path(__file__).resolve().parents[1]/'site/catalog.json').read_text())
assert c['truncated'] is False
assert len(c['files'])==143 and len(c['entries'])==140
assert sum(f['size'] for f in c['files'])==c['totalBytes']==2877361421
assert len({e['id'] for e in c['entries']})==140
files={f['path']:f for f in c['files']}
for e in c['entries']:
    assert all(e[k]==files[e['path']][k] for k in ['size','sha'])
    assert e['id']==hashlib.sha256(e['path'].encode()).hexdigest()[:20]
    encoded='/'.join(urllib.parse.quote(s,safe='') for s in e['path'].split('/'))
    assert urllib.parse.unquote(encoded)==e['path']
    for p in e['sameBlobPaths']: assert files[p]['sha']==e['sha']
print('Verified 143 inventory blobs, 140 HTML entries, exact sizes, IDs, encoding and duplicate relationships.')
