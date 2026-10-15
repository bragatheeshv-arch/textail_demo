import re, urllib.request
urls = re.findall(r"'(https://[^']+)'", open('src/data/fabricImages.ts', encoding='utf-8').read())
for u in urls:
    try:
        req = urllib.request.Request(u, method='HEAD', headers={'User-Agent': 'Mozilla/5.0'})
        code = urllib.request.urlopen(req, timeout=15).status
    except Exception as e:
        code = 'FAIL %s' % str(getattr(e, 'code', e))[:80]
    print(code, u.split('/photo-')[1][:30] if '/photo-' in u else u[:60])
