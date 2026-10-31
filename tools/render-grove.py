#!/usr/bin/env python3
"""Original voxel grove cubemap. Offline only; requires numpy + Pillow.
No Minecraft geometry, textures, screenshots or other third-party art inputs.
Run: .venv/bin/python tools/render-grove.py
"""
from pathlib import Path
import numpy as np
from PIL import Image
N=768
OUT=Path(__file__).resolve().parents[1]/'site/assets/panorama'
OUT.mkdir(parents=True,exist_ok=True)
rng=np.random.default_rng(261)
textures={}
colors={'grass':(101,143,58),'dirt':(108,79,51),'bark':(66,43,48),'leaf':(211,151,176),'pink':(224,153,168),'white':(230,223,208),'brown':(80,60,46),'black':(31,29,32),'nose':(173,99,121),'flower':(243,180,205),'water':(76,135,162)}
for name,c in colors.items():
 t=np.clip(np.array(c)+rng.integers(-17,18,(16,16,1)),0,255).astype(np.uint8)
 if name=='grass':
  for _ in range(8):
   x,y=rng.integers(1,14,2);t[y:y+2,x:x+2]=[229,165,193];t[y,x]=[246,202,215]
 if name=='bark':t[:,::4]=(np.array(c)*.7).astype('uint8')
 if name=='leaf':
  for _ in range(15):
   x,y=rng.integers(0,14,2);t[y:y+2,x:x+2]=[147,154,95] if x%4==0 else [239,192,209]
 if name=='brown':
  for _ in range(4):
   x,y=rng.integers(0,12,2);t[y:y+4,x:x+4]=[212,205,185]
 textures[name]=t
quads=[]
def quad(v,mat,shade):quads.append((np.array(v,dtype=float),mat,shade))
def box(x,y,z,w,h,d,mat):
 # Four side faces and two caps. All texture coordinates are original 16px patterns.
 quad([(x,y,z),(x+w,y,z),(x+w,y+h,z),(x,y+h,z)],mat,.76)
 quad([(x+w,y,z+d),(x,y,z+d),(x,y+h,z+d),(x+w,y+h,z+d)],mat,.9)
 quad([(x,y,z+d),(x,y,z),(x,y+h,z),(x,y+h,z+d)],mat,.72)
 quad([(x+w,y,z),(x+w,y,z+d),(x+w,y+h,z+d),(x+w,y+h,z)],mat,.86)
 quad([(x,y+h,z),(x+w,y+h,z),(x+w,y+h,z+d),(x,y+h,z+d)],mat,1)
 quad([(x,y,z+d),(x+w,y,z+d),(x+w,y,z),(x,y,z)],mat,.6)
def height(x,z):return 4+int(np.floor(1.3*np.sin(x/9)+1.1*np.cos(z/12)+.6*np.sin((x+z)/7)))
trees=[(-7,8),(9,11),(-13,18),(17,22),(-20,-7),(12,-13),(-7,-15),(22,-23),(-27,22),(26,9),(-24,-25),(7,30),(30,28),(-32,5),(0,-31),(-18,32)]
for x in range(-43,44):
 for z in range(-43,44):
  y=height(x,z);shadow=min([((x-tx+2)**2+(z-tz-2)**2) for tx,tz in trees])<12
  quad([(x,y,z),(x+1,y,z),(x+1,y,z+1),(x,y,z+1)],'grass',.77 if shadow else 1)
  for dx,dz in [(1,0),(-1,0),(0,1),(0,-1)]:
   other=height(x+dx,z+dz)
   if other<y:
    if dx:xx=x+(dx>0);quad([(xx,other,z),(xx,other,z+1),(xx,y,z+1),(xx,y,z)],'dirt',.8)
    else:zz=z+(dz>0);quad([(x,other,zz),(x+1,other,zz),(x+1,y,zz),(x,y,zz)],'dirt',.88)
for x,z in trees:
 y=height(x,z);box(x,y,z,1,5,1,'bark');box(x-2,y+3,z+.1,5,.7,.8,'bark')
 for a in range(-3,4):
  for b in range(-3,4):
   if abs(a)==3 and abs(b)==3:continue
   box(x+a,y+5,z+b,1,1,1,'leaf')
   if abs(a)<3 and abs(b)<3:box(x+a,y+6,z+b,1,1,1,'leaf')
   if (abs(a)==3 or abs(b)==3) and (a+b)%3==0:box(x+a,y+4,z+b,1,1,1,'leaf')
def baby(x,z,kind):
 y=height(int(x),int(z));m={'pig':'pink','calf':'brown','lamb':'white'}[kind]
 for a in [0,.48]:
  for b in [0,.7]:box(x+a,y,z+b,.18,.35,.18,m)
 box(x-.08,y+.28,z-.05,.85,.51,1.05,m)
 box(x-.1,y+.57,z-.45,.9,.67,.6,m)
 box(x-.15,y+1.05,z-.24,.18,.2,.22,m);box(x+.65,y+1.05,z-.24,.18,.2,.22,m)
 for a in [.02,.53]:box(x+a,y+.93,z-.465,.11,.12,.02,'black')
 box(x+.13,y+.65,z-.55,.4,.25,.13,'nose' if kind=='pig' else 'white')
for x,z,k in [(-3,7,'calf'),(-1,9,'calf'),(5,5,'pig'),(7,7,'pig'),(-5,-7,'lamb'),(10,-6,'lamb'),(-8,12,'lamb'),(4,18,'calf')]:baby(x,z,k)
# Distant original geometric cloud banks.
for x,z in [(-28,35),(25,34),(35,-22),(-35,-28),(3,-40)]:box(x,19,z,10,.65,4,'white')
# World geometry is projected from a SINGLE camera to six 90-degree faces.
eye=np.array([0.,height(0,0)+2.2,0.])
bases=[([1,0,0],[0,1,0],[0,0,1]),([0,0,-1],[0,1,0],[1,0,0]),([-1,0,0],[0,1,0],[0,0,-1]),([0,0,1],[0,1,0],[-1,0,0]),([1,0,0],[0,0,-1],[0,1,0]),([1,0,0],[0,0,1],[0,-1,0])]
uv=np.array([[0,1],[1,1],[1,0],[0,0]],float)
for face,basis in enumerate(bases):
 B=np.array(basis).T
 yy,xx=np.mgrid[0:N,0:N];directions=np.stack([xx/(N-1)*2-1,1-yy/(N-1)*2,np.ones((N,N))],axis=-1)@B.T
 sky=np.clip(directions[:,:,1]/np.linalg.norm(directions,axis=2),0,1)
 image=np.zeros((N,N,3),np.uint8);image[:]=np.array([182,207,225])+(np.array([103,158,212])-np.array([182,207,225]))*sky[:,:,None]
 depth=np.full((N,N),np.inf)
 def triangle(p,texcoord,mat,shade):
  screen=np.stack([(p[:,0]/p[:,2]+1)*(N-1)/2,(1-p[:,1]/p[:,2])*(N-1)/2],axis=1)
  lo=np.maximum(0,np.floor(screen.min(axis=0)).astype(int));hi=np.minimum(N-1,np.ceil(screen.max(axis=0)).astype(int))
  if np.any(lo>hi):return
  a,b,c=screen;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
  if abs(den)<1e-6:return
  py,px=np.mgrid[lo[1]:hi[1]+1,lo[0]:hi[0]+1];px=px.astype(float);py=py.astype(float)
  w0=((b[1]-c[1])*(px-c[0])+(c[0]-b[0])*(py-c[1]))/den
  w1=((c[1]-a[1])*(px-c[0])+(a[0]-c[0])*(py-c[1]))/den;w2=1-w0-w1
  inv=w0/p[0,2]+w1/p[1,2]+w2/p[2,2];valid=(w0>=-1e-8)&(w1>=-1e-8)&(w2>=-1e-8)&(inv>0)
  distance=1/np.maximum(inv,1e-10);view=depth[lo[1]:hi[1]+1,lo[0]:hi[0]+1];valid&=distance<view
  if not valid.any():return
  tex=(w0[:,:,None]*texcoord[0]/p[0,2]+w1[:,:,None]*texcoord[1]/p[1,2]+w2[:,:,None]*texcoord[2]/p[2,2])*distance[:,:,None]
  coords=np.clip((tex*16).astype(int),0,15);color=textures[mat][coords[:,:,1],coords[:,:,0]]*shade
  fog=np.clip((distance-23)/45,0,.65)[:,:,None];color=color*(1-fog)+np.array([171,198,211])*fog
  region=image[lo[1]:hi[1]+1,lo[0]:hi[0]+1];region[valid]=color[valid].astype(np.uint8);view[valid]=distance[valid]
 for v,mat,shade in quads:
  p=(v-eye)@B
  if np.all(p[:,2]<=.05):continue
  # Clip near plane before projection, carrying perspective texture coordinates.
  poly=[]
  for i in range(4):
   j=(i-1)%4;inside=p[i,2]>.05;prior=p[j,2]>.05
   if inside!=prior:
    t=(.05-p[j,2])/(p[i,2]-p[j,2]);poly.append((p[j]+(p[i]-p[j])*t,uv[j]+(uv[i]-uv[j])*t))
   if inside:poly.append((p[i],uv[i]))
  for i in range(1,len(poly)-1):triangle(np.array([poly[j][0] for j in [0,i,i+1]]),np.array([poly[j][1] for j in [0,i,i+1]]),mat,shade)
 Image.fromarray(image).save(OUT/f'panorama_{face}.png',optimize=True)
 print('Rendered',face,flush=True)
# Non-WebGL fallback: genuine perspective projection from the same scene, not a poster.
Image.open(OUT/'panorama_0.png').save(OUT/'static.jpg',quality=94)
import hashlib,json
files={p.name:hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(OUT.glob('*.png'))}
files['static.jpg']=hashlib.sha256((OUT/'static.jpg').read_bytes()).hexdigest()
(OUT/'source.json').write_text(json.dumps({'name':'Original Grove','description':'Original procedural block geometry, pixel textures, cherry-colored trees and small cuboid animals. Not the official Tiny Takeover panorama.','generator':'tools/render-grove.py','inputAssets':[],'faceSize':N,'faceOrder':['+Z','+X','-Z','-X','+Y','-Y'],'license':'LICENSE.txt','sha256':files},indent=2)+'\n')
