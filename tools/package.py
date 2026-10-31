#!/usr/bin/env python3
"""Reproducible portable source ZIP from an explicit small-file allowlist."""
import pathlib,zipfile,re,json,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
paths=[]
for folder in ['site','tools','tests','verification','.github/workflows']:
    paths.extend(p for p in (ROOT/folder).rglob('*') if p.is_file() and '__pycache__' not in p.parts)
for name in ['README.md','DESIGN_RESEARCH.md','PANORAMA.md','REFERENCE_AUDIT.md','VERIFICATION.md','THIRD_PARTY_NOTICES.md','package.json','package-lock.json','.gitignore']:
    paths.append(ROOT/name)
out=ROOT/'downloads/Astrax-Launcher-source.zip';out.parent.mkdir(exist_ok=True)
with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in sorted(paths):
        rel=p.relative_to(ROOT).as_posix();data=p.read_bytes()
        assert not any(s in rel.split('/') for s in ['.git','node_modules','mirror','.cache'])
        assert not re.search(rb'(?:gh[pousr]_[A-Za-z0-9]{25,}|github_pat_[A-Za-z0-9_]{25,}|-----BEGIN (?:RSA |OPENSSH )?PRIVATE KEY-----)',data),rel
        info=zipfile.ZipInfo('Astrax-Launcher/'+rel,date_time=(2026,10,31,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;info.external_attr=0o644<<16;z.writestr(info,data)
with zipfile.ZipFile(out) as z:
    assert z.testzip() is None
    c=json.loads(z.read('Astrax-Launcher/site/catalog.json'));assert len(c['files'])==143 and len(c['entries'])==140
print(f'{out.relative_to(ROOT)}: {len(paths)} files, {out.stat().st_size} bytes, SHA-256 {hashlib.sha256(out.read_bytes()).hexdigest()}')
