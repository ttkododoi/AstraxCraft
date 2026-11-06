"""Original small pixel garments/faces. No game texture input; model is skinview3d's."""
from PIL import Image,ImageDraw
from pathlib import Path
out=Path(__file__).resolve().parents[1]/'site/assets/skins';out.mkdir(parents=True,exist_ok=True)
for model,arm,hair,tunic in [('classic',4,'#473145','#8769ad'),('slim',3,'#a55840','#527b87')]:
 im=Image.new('RGBA',(64,64));d=ImageDraw.Draw(im);skin='#bc896e';pants='#343345';boots='#26232f'
 def cube(x,y,w,h,z,color):
  for rect in [(x+z,y,x+z+w-1,y+z-1),(x+z+w,y,x+z+w*2-1,y+z-1),(x,y+z,x+z-1,y+z+h-1),(x+z,y+z,x+z+w-1,y+z+h-1),(x+z+w,y+z,x+z+w+z-1,y+z+h-1),(x+z+w+z,y+z,x+z+w*2+z-1,y+z+h-1)]:d.rectangle(rect,fill=color)
 cube(0,0,8,8,8,hair);d.rectangle((8,10,15,15),fill=skin);d.point((9,12),fill='#ede4df');d.point((14,12),fill='#ede4df');d.point((10,12),fill='#3b3551');d.point((13,12),fill='#3b3551');d.rectangle((11,14,12,14),fill='#85575b');d.rectangle((40,8,47,9),fill=hair)
 cube(16,16,8,12,4,tunic);d.rectangle((23,20,24,21),fill=skin);d.rectangle((23,23,24,25),fill='#d1b9eb')
 for x,y in [(40,16),(32,48)]:
  cube(x,y,arm,12,4,tunic);d.rectangle((x+4,y+12,x+3+arm,y+15),fill=skin)
 for x,y in [(0,16),(16,48)]:
  cube(x,y,4,12,4,pants);d.rectangle((x,y+13,x+15,y+15),fill=boots)
 # Original jacket piping and cuffs on transparent outer layers.
 for x,y,w in [(16,32,8),(40,32,arm),(48,48,arm)]:
  d.rectangle((x+4,y+4,x+4,y+15),fill='#c8afe7');d.rectangle((x+4,y+14,x+3+w,y+15),fill='#c8afe7')
 im.save(out/f'{model}.png')
