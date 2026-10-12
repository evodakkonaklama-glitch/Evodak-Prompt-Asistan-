#!/usr/bin/env python3
"""Evodak Prompt Asistanı — src/ parçalarından index.html üretir.
Kullanım: python3 tools/build.py   (depo kökünden)"""
import os, json, datetime
R = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
src = lambda n: open(os.path.join(R, 'src', n), encoding='utf-8').read()
ver = datetime.datetime.now().strftime('%Y%m%d%H%M')
head = f'''<!doctype html>
<html lang="tr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>Evodak Prompt Asistanı</title>
<meta name="description" content="Evodak ekibinin prompt, komut ve AI platform kütüphanesi">
<meta name="theme-color" content="#14304A">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="Evodak Prompt">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
<meta name="evodak-build" content="{ver}">
'''
js = '\n'.join(src(n) for n in ['10-core.js', '20-formdata.js', '30-form.js', '40-sections.js'])
html = head + src('01-shell.html').replace('</style>', '</style>\n</head>\n<body>', 1) + '\n<script>\n(function(){\n' + js + '\n})();\n</script>\n</body>\n</html>\n'
if '</body>' in src('01-shell.html'):
    raise SystemExit('shell must not contain </body>')
open(os.path.join(R, 'index.html'), 'w', encoding='utf-8').write(html)
open(os.path.join(R, 'tools', 'app.js'), 'w', encoding='utf-8').write(js)  # syntax check input
sw = open(os.path.join(R, 'tools', 'sw.template.js'), encoding='utf-8').read().replace('__VER__', ver)
open(os.path.join(R, 'sw.js'), 'w', encoding='utf-8').write(sw)
print('index.html', len(html), 'bytes · build', ver)
