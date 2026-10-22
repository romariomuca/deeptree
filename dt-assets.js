(()=>{
class DtLogo extends HTMLElement{
  static get observedAttributes(){return['size','front','variant']}
  connectedCallback(){
    this.render();
    if(this._wired)return;this._wired=true;
    this.addEventListener('mouseenter',()=>this.spin());
    this.tx=0;this.ty=0;this.cx=0;this.cy=0;
    this._mm=e=>{const r=this.getBoundingClientRect(),ox=r.left+r.width/2,oy=r.top+r.height/2,dx=e.clientX-ox,dy=e.clientY-oy,dist=Math.hypot(dx,dy),Rr=Math.max(180,r.width*1.8);
      let k=Math.max(0,1-dist/Rr);k=k*k*(3-2*k);
      const nx=Math.max(-1,Math.min(1,dx/Rr*1.6)),ny=Math.max(-1,Math.min(1,dy/Rr*1.6));
      this.ty=nx*65*k;this.tx=-ny*60*k};
    this._ml=()=>{this.tx=0;this.ty=0};
    window.addEventListener('mousemove',this._mm);document.addEventListener('mouseleave',this._ml);
    const tick=()=>{if(!this._wired)return;this._raf=requestAnimationFrame(tick);
      const back=Math.abs(this.tx)+Math.abs(this.ty)<Math.abs(this.cx)+Math.abs(this.cy),e=back?.12:.04;this.cx+=(this.tx-this.cx)*e;this.cy+=(this.ty-this.cy)*e;
      const st=this.shadowRoot&&this.shadowRoot.querySelector('.st');if(st)st.style.transform=`rotateX(${this.cx.toFixed(2)}deg) rotateY(${this.cy.toFixed(2)}deg)`};
    this._raf=requestAnimationFrame(tick);
    if(this.hasAttribute('auto'))this._iv=setInterval(()=>this.spin(),9000);
  }
  disconnectedCallback(){if(this._mm)window.removeEventListener('mousemove',this._mm);if(this._ml)document.removeEventListener('mouseleave',this._ml);cancelAnimationFrame(this._raf);clearInterval(this._iv);this._wired=false}
  attributeChangedCallback(){if(this.isConnected)this.render()}
  spin(){
    const now=performance.now();if(this._ls&&now-this._ls<2600)return;this._ls=now;
    this.n=(this.n||0)+1;const n=this.n;
    this.shadowRoot.querySelectorAll('.g').forEach((g,i)=>{g.style.transitionDelay=(i*.08)+'s';g.style.transform=i===0?`rotateY(${n*180}deg)`:`rotateY(${(i%2?1:-1)*n*360}deg)`});
  }
  geo(v){
    const T=v.startsWith('trace')?1.3:(v==='circuitLight'||v==='circuitSymLight'||v==='orbitLight')?1.7:2.4,seg=(x1,y1,x2,y2,ry)=>({cx:(x1+x2)/2,cy:(y1+y2)/2,L:Math.hypot(x2-x1,y2-y1)+T,a:Math.atan2(y2-y1,x2-x1)*180/Math.PI,ry:ry||0,t:T}),disc=(cx,cy,d)=>({cx,cy,d,disc:true}),ring=(cx,cy,d)=>({cx,cy,d,disc:true,ring:1.05}),poly=(...p)=>{const o=[];for(let i=0;i<p.length-2;i+=2)o.push(seg(p[i],p[i+1],p[i+2],p[i+3]));return o},mir=a=>a.map(b=>b.disc?{...b,cx:24-b.cx}:{...b,cx:24-b.cx,a:180-b.a});
    const trunk=[seg(12,1.2,12,22.8)];
    const tiers=[[8.7,4.8,15.3],[4.95,12,19.05],[1.2,19.2,22.8]];
    if(v==='cross')return[trunk,...tiers.map(([x1,y,x2])=>[seg(x1,y,x2,y),seg(x1,y,x2,y,90)])];
    if(v==='chevron')return[trunk,...[[2.5,4],[8.5,6],[14.5,8]].map(([y,dx])=>[seg(12,y,12-dx,y+dx*.75),seg(12,y,12+dx,y+dx*.75)])];
    if(v==='asterisk')return[trunk,[seg(4,5,20,15)],[seg(20,5,4,15)]];
    if(v==='fork'){const L=[[seg(12,22.8,12,13.5)],[],[]];
      const rec=(x,y,ang,len,d)=>{const r=ang*Math.PI/180,x2=x+Math.sin(r)*len,y2=y-Math.cos(r)*len;L[d].push(seg(x,y,x2,y2));if(d<2){rec(x2,y2,ang-30,len*.62,d+1);rec(x2,y2,ang+30,len*.62,d+1)}};
      rec(12,13.5,-34,8.5,1);rec(12,13.5,34,8.5,1);return L}
    if(v==='trace'){const inner=[...poly(12,15,7.2,10.2,7.2,8.3),ring(7.2,6.4,3.8)],outer=[...poly(12,20,2.4,12.4),ring(2.4,10.5,3.8)];return[[seg(12,4.5,12,22.8),ring(12,2.6,3.8)],[...inner,...mir(inner)],[...outer,...mir(outer)]]}
    if(v==='trace2'){const br=poly(6,2.4,2.4,6,2.4,18,6,21.6),inner=[...poly(12,13,7.2,8.2),ring(7.2,6.3,3.8)],low=[...poly(12,17,8.1,17),ring(6.2,17,3.8)];return[[seg(12,4.5,12,19.5),ring(12,2.6,3.8),ring(12,21.4,3.8)],[...inner,...mir(inner)],[...low,...mir(low)],[...br,...mir(br)]]}
    if(v==='circuitLight')return[[seg(12,4.2,12,22.8),disc(12,2.6,3.8)],[seg(7,7,17,7),disc(6.6,7,3.6),disc(17.4,7,3.6)],[seg(4.5,13,19.5,13),disc(4.1,13,3.6),disc(19.9,13,3.6)],[seg(3,19.4,21,19.4),disc(2.6,19.4,3.6),disc(21.4,19.4,3.6)]];
    if(v==='circuitSym')return[[seg(12,4.2,12,19.8),disc(12,2.6,4.4),disc(12,21.4,4.4)],[seg(7,6.5,17,6.5),disc(6.6,6.5,4.2),disc(17.4,6.5,4.2),seg(7,17.5,17,17.5),disc(6.6,17.5,4.2),disc(17.4,17.5,4.2)],[seg(3.2,12,20.8,12),disc(2.8,12,4.2),disc(21.2,12,4.2)]];
    if(v==='circuitSymLight')return[[seg(12,4,12,20),disc(12,2.4,3.8),disc(12,21.6,3.8)],[seg(7,6.5,17,6.5),disc(6.6,6.5,3.6),disc(17.4,6.5,3.6),seg(7,17.5,17,17.5),disc(6.6,17.5,3.6),disc(17.4,17.5,3.6)],[seg(3.2,12,20.8,12),disc(2.8,12,3.6),disc(21.2,12,3.6)]];
    if(v==='orbitLight')return[[seg(12,4,12,20),disc(12,2.4,3.8),disc(12,21.6,3.8)],[{cx:12,cy:6.5,d:10.8,hring:1.4},disc(6.6,6.5,3.6),disc(17.4,6.5,3.6)],[{cx:12,cy:12,d:18.4,hring:1.4},disc(2.8,12,3.6),disc(21.2,12,3.6)],[{cx:12,cy:17.5,d:10.8,hring:1.4},disc(6.6,17.5,3.6),disc(17.4,17.5,3.6)]];
    if(v==='orbit')return[[seg(12,4.2,12,22.8),disc(12,2.6,4.4)],[{cx:12,cy:7,d:10,hring:1.5},disc(7,7,3.6),disc(17,7,3.6)],[{cx:12,cy:13,d:15,hring:1.5},disc(4.5,13,3.6),disc(19.5,13,3.6)],[{cx:12,cy:19.4,d:20,hring:1.5},disc(2,19.4,3.6),disc(22,19.4,3.6)]];
    if(v==='circuit')return[[seg(12,4.2,12,22.8),disc(12,2.6,4.6)],[seg(7,7,17,7),disc(6.6,7,4.4),disc(17.4,7,4.4)],[seg(4.5,13,19.5,13),disc(4.1,13,4.4),disc(19.9,13,4.4)],[seg(3,19.4,21,19.4),disc(2.6,19.4,4.4),disc(21.4,19.4,4.4)]];
    return[trunk,...tiers.map(([x1,y,x2])=>[seg(x1,y,x2,y)])];
  }
  render(){
    const S=+(this.getAttribute('size')||28),u=S/24,F=this.getAttribute('front')||'#171614',v=this.getAttribute('variant')||'pine',T=2.4*u;
    if(!this.shadowRoot)this.attachShadow({mode:'open'});
    const f=(fw,fh,tr,r,rg)=>`<i style="width:${fw}px;height:${fh}px;margin:${-fh/2}px 0 0 ${-fw/2}px;transform:${tr};${r?'border-radius:50%;':''}${rg?`background:transparent;border:${rg}px solid ${F};box-sizing:border-box;`:''}"></i>`;
    const piece=b=>{
      if(b.hring){const r=b.d*u/2,H=b.hring*u,N=56,sw=2*Math.PI*r/N+.6;let h='';for(let i=0;i<N;i++)h+=`<i style="width:${sw}px;height:${H}px;margin:${-H/2}px 0 0 ${-sw/2}px;transform:rotateY(${i*360/N}deg) translateZ(${r}px);backface-visibility:visible"></i>`;return `<div class="p" style="left:${b.cx*u}px;top:${b.cy*u}px;width:0;height:0">${h}</div>`}
      if(b.ring){const D=b.d*u,rg=b.ring*u;return `<div class="p" style="left:${(b.cx-b.d/2)*u}px;top:${(b.cy-b.d/2)*u}px;width:${D}px;height:${D}px">${f(D,D,'translateZ(0)',1,rg)}</div>`}
      if(b.disc){const D=b.d*u;return `<div class="p" style="left:${(b.cx-b.d/2)*u}px;top:${(b.cy-b.d/2)*u}px;width:${D}px;height:${D}px">${[0,45,90,135].map(a=>f(D,D,`rotateY(${a}deg)`,1)).join('')}${[45,90,135].map(a=>f(D,D,`rotateX(${a}deg)`,1)).join('')}</div>`}
      const W=b.L*u,H=b.t*u,D=(b.t<2?b.t*.6:b.t)*u;
      return `<div class="p" style="left:${b.cx*u-W/2}px;top:${b.cy*u-H/2}px;width:${W}px;height:${H}px;transform:rotateY(${b.ry}deg) rotateZ(${b.a}deg)">${f(W,H,`translateZ(${D/2}px)`)}${f(W,H,`rotateY(180deg) translateZ(${D/2}px)`)}${f(D,H,`rotateY(90deg) translateZ(${W/2}px)`)}${f(D,H,`rotateY(-90deg) translateZ(${W/2}px)`)}${f(W,D,`rotateX(90deg) translateZ(${H/2}px)`)}${f(W,D,`rotateX(-90deg) translateZ(${H/2}px)`)}</div>`};
    this.shadowRoot.innerHTML=`<style>:host{display:inline-block;width:${S}px;height:${S}px;perspective:${S*5}px;cursor:pointer;vertical-align:middle}.st{position:relative;width:100%;height:100%;transform-style:preserve-3d;transform:rotateX(0deg) rotateY(0deg);will-change:transform}.g{position:absolute;inset:0;transform-style:preserve-3d;transition:transform 3.2s cubic-bezier(.16,1,.3,1)}.p{position:absolute;transform-style:preserve-3d}i{position:absolute;left:50%;top:50%;background:${F}}</style><div class="st">${this.geo(v).map(g=>`<div class="g">${g.map(piece).join('')}</div>`).join('')}</div>`;
    const n=this.n;if(n){this.n=n-1;this._ls=0;this.spin()}
  }
}
customElements.get('dt-logo')||customElements.define('dt-logo',DtLogo);

class DtVisual extends HTMLElement{
  static get observedAttributes(){return['kind','fg','bg']}
  connectedCallback(){
    if(!this.cv){
      const sh=this.attachShadow({mode:'open'});
      sh.innerHTML='<style>:host{display:block;position:relative;width:100%;height:100%;overflow:hidden}canvas{position:absolute;inset:0;width:100%;height:100%;display:block}</style><canvas></canvas>';
      this.cv=sh.querySelector('canvas');this.ctx=this.cv.getContext('2d');
      this.ro=new ResizeObserver(()=>this.resize());this.ro.observe(this);
      this.io=new IntersectionObserver(e=>{this.vis=e[0].isIntersecting});this.io.observe(this);
    }
    this.resize();this.run=true;
    const loop=t=>{if(!this.run)return;this.raf=requestAnimationFrame(loop);if(this.vis!==false)this.frame(t/1000)};
    this.raf=requestAnimationFrame(loop);
  }
  disconnectedCallback(){this.run=false;cancelAnimationFrame(this.raf)}
  attributeChangedCallback(){if(this.cv)this.reset()}
  resize(){const r=this.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);this.w=Math.max(1,r.width);this.h=Math.max(1,r.height);this.cv.width=this.w*d;this.cv.height=this.h*d;this.ctx.setTransform(d,0,0,d,0,0);this.reset()}
  get fg(){return this.getAttribute('fg')||'236,232,226'}
  get bg(){return this.getAttribute('bg')||'23,22,20'}
  get kind(){return this.getAttribute('kind')||'tree'}
  reset(){
    this.t0=null;this.lt=null;this.cycle=-1;const w=this.w,h=this.h,k=this.kind;
    if(k==='flow'){const N=Math.min(900,Math.floor(w*h/700));this.pts=Array.from({length:N},()=>({x:Math.random()*w,y:Math.random()*h,l:Math.random()*200}));this.cleared=false}
    if(k==='grid'){this.links=[]}
  }
  genTree(){
    const w=this.w,h=this.h,segs=[],sp=Math.max(w,h)*.2;
    const br=(x,y,a,len,d,t0,par)=>{const x2=x+Math.cos(a)*len,y2=y+Math.sin(a)*len,s={x,y,x2,y2,d,t0,t1:t0+len/sp,par,kids:0};segs.push(s);if(par)par.kids++;
      if(d<8&&len>5){const n=Math.random()<.22?3:2;for(let i=0;i<n;i++){const spr=.26+Math.random()*.36;const na=a+(n===2?(i?spr:-spr):(i-1)*spr*1.1)+(Math.random()-.5)*.16;br(x2,y2,na,len*(.68+Math.random()*.14),d+1,s.t1,s)}}};
    br(w>800?w*.7:w*.55,h+2,-Math.PI/2,h*.23,0,0,null);
    this.segs=segs;this.leaves=segs.filter(s=>!s.kids);this.dur=Math.max(...segs.map(s=>s.t1));this.parts=[];
  }
  frame(t){
    if(this.t0==null)this.t0=t;const T=t-this.t0,dt=Math.min(.05,this.lt==null?0:t-this.lt);this.lt=t;
    const c=this.ctx,w=this.w,h=this.h,fg=this.fg,bg=this.bg,k=this.kind;
    if(k==='tree'){
      if(!this.segs)this.genTree();
      const L=this.dur+9,cy=Math.floor(T/L),tt=T-cy*L;
      if(cy!==this.cycle){this.cycle=cy;this.genTree()}
      const fade=tt>L-2?Math.max(0,(L-tt)/2):1;
      c.fillStyle=`rgb(${bg})`;c.fillRect(0,0,w,h);
      c.fillStyle=`rgba(${fg},.07)`;for(let x=24;x<w;x+=48)for(let y=24;y<h;y+=48){c.fillRect(x-3,y,7,1);c.fillRect(x,y-3,1,7)}
      for(const s of this.segs){let p=(tt-s.t0)/(s.t1-s.t0);if(p<=0)continue;p=Math.min(1,p);
        c.strokeStyle=`rgba(${fg},${(.6-s.d*.045)*fade})`;c.lineWidth=Math.max(.6,(9-s.d)*.6);
        c.beginPath();c.moveTo(s.x,s.y);c.lineTo(s.x+(s.x2-s.x)*p,s.y+(s.y2-s.y)*p);c.stroke()}
      c.fillStyle=`rgba(${fg},${.8*fade})`;for(const s of this.leaves)if(tt>s.t1)c.fillRect(s.x2-1.5,s.y2-1.5,3,3);
      if(tt>this.dur*.5&&tt<L-2&&Math.random()<.35){const lf=this.leaves[Math.random()*this.leaves.length|0];if(tt>lf.t1){const path=[];let s=lf;while(s){path.unshift(s);s=s.par}this.parts.push({path,i:0,p:0})}}
      const spd=Math.max(w,h)*.35;c.fillStyle=`rgba(${fg},${fade})`;
      this.parts=this.parts.filter(q=>{const s=q.path[q.i],len=Math.hypot(s.x2-s.x,s.y2-s.y)||1;q.p+=dt*spd/len;while(q.p>=1){q.p-=1;q.i++;if(q.i>=q.path.length)return false}
        const g=q.path[q.i];c.fillRect(g.x+(g.x2-g.x)*q.p-1.5,g.y+(g.y2-g.y)*q.p-1.5,3,3);return true});
    }else if(k==='flow'){
      if(!this.cleared){c.fillStyle=`rgb(${bg})`;c.fillRect(0,0,w,h);this.cleared=true}
      c.fillStyle=`rgba(${bg},.06)`;c.fillRect(0,0,w,h);c.strokeStyle=`rgba(${fg},.32)`;c.lineWidth=.8;c.beginPath();
      for(const p of this.pts){const a=(Math.sin(p.x*.006+T*.15)+Math.cos(p.y*.007-T*.12))*Math.PI;const nx=p.x+Math.cos(a)*1.1,ny=p.y+Math.sin(a)*1.1;c.moveTo(p.x,p.y);c.lineTo(nx,ny);p.x=nx;p.y=ny;p.l--;
        if(p.l<0||nx<0||ny<0||nx>w||ny>h){p.x=Math.random()*w;p.y=Math.random()*h;p.l=100+Math.random()*200}}
      c.stroke();
    }else if(k==='grid'){
      c.fillStyle=`rgb(${bg})`;c.fillRect(0,0,w,h);const g=28,cols=Math.ceil(w/g),rows=Math.ceil(h/g);
      for(let i=0;i<cols;i++)for(let j=0;j<rows;j++){const x=i*g+g/2,y=j*g+g/2,v=.5+.5*Math.sin((x*.018+y*.011)-T*1.3+Math.sin(i*1.7+j*.9)*.6);const s=1+v*2.4;c.fillStyle=`rgba(${fg},${.12+v*.55})`;c.fillRect(x-s/2,y-s/2,s,s)}
      if(Math.random()<.08){const i=Math.random()*cols|0,j=Math.random()*rows|0,di=(Math.random()*7|0)-3,dj=(Math.random()*7|0)-3;this.links.push({a:[i*g+g/2,j*g+g/2],b:[(i+di)*g+g/2,(j+dj)*g+g/2],t:T})}
      this.links=this.links.filter(l=>{const a=T-l.t;if(a>2.4)return false;const p=Math.min(1,a/.6),o=a>1.6?(2.4-a)/.8:1;c.strokeStyle=`rgba(${fg},${.75*o})`;c.lineWidth=1;c.beginPath();c.moveTo(l.a[0],l.a[1]);c.lineTo(l.a[0],l.a[1]+(l.b[1]-l.a[1])*p);c.lineTo(l.a[0]+(l.b[0]-l.a[0])*p,l.a[1]+(l.b[1]-l.a[1])*p);c.stroke();c.fillStyle=`rgba(${fg},${o})`;c.fillRect(l.b[0]-2.5,l.b[1]-2.5,5,5);return true});
    }else if(k==='orbit'){
      c.fillStyle=`rgb(${bg})`;c.fillRect(0,0,w,h);const cx=w/2,cy=h/2,R=Math.min(w,h)*.46;
      for(let r=1;r<=7;r++){const rr=R*r/7;c.strokeStyle=`rgba(${fg},.14)`;c.lineWidth=1;c.beginPath();c.arc(cx,cy,rr,0,Math.PI*2);c.stroke();
        const n=r+2,sp=(r%2?1:-1)*(.5/r+.08);for(let q=0;q<n;q++){const a=T*sp+q*Math.PI*2/n;c.fillStyle=`rgba(${fg},.85)`;c.fillRect(cx+Math.cos(a)*rr-2,cy+Math.sin(a)*rr-2,4,4)}}
      const sa=T*.9;for(let q=0;q<26;q++){const a=sa-q*.018;c.strokeStyle=`rgba(${fg},${.5*(1-q/26)})`;c.beginPath();c.moveTo(cx,cy);c.lineTo(cx+Math.cos(a)*R,cy+Math.sin(a)*R);c.stroke()}
      c.fillStyle=`rgb(${fg})`;c.fillRect(cx-5,cy-5,10,10);
    }
  }
}
customElements.get('dt-visual')||customElements.define('dt-visual',DtVisual);
})();
