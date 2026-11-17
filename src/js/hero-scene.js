import * as THREE from 'three';
export function initHeroScene(){
 const host=document.querySelector('[data-scene]'),canvas=host.querySelector('canvas'),fallback=host.querySelector('img');
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});}catch{return()=>{};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(35,1,.1,100);camera.position.z=8;
 scene.add(new THREE.AmbientLight(0xffffff,2));const light=new THREE.DirectionalLight(0xffffff,3);light.position.set(3,5,6);scene.add(light);
 const group=new THREE.Group();scene.add(group);group.rotation.set(.2,-.35,-.3);
 const materials=[new THREE.MeshStandardMaterial({color:0x23778b,roughness:.55,metalness:.3}),new THREE.MeshStandardMaterial({color:0x1e293b,roughness:.6}),new THREE.MeshStandardMaterial({color:0xe8f5f7,roughness:.9})];
 const panel=new THREE.Mesh(new THREE.BoxGeometry(1.65,2.5,.13),materials[2]);group.add(panel);
 const edge=new THREE.LineSegments(new THREE.EdgesGeometry(panel.geometry),new THREE.LineBasicMaterial({color:0x23778b}));panel.add(edge);
 const visual=new THREE.Group();panel.add(visual);
 const graphic=new THREE.Mesh(new THREE.CircleGeometry(.48,32),materials[0]);graphic.position.set(-.14,.25,.08);visual.add(graphic);
 const tile=new THREE.Mesh(new THREE.PlaneGeometry(.65,.65),materials[1]);tile.position.set(.22,-.35,.09);tile.rotation.z=.35;visual.add(tile);
 const borderPlane=new THREE.PlaneGeometry(1.35,2.15);const border=new THREE.LineSegments(new THREE.EdgesGeometry(borderPlane),new THREE.LineBasicMaterial({color:0x23778b}));borderPlane.dispose();border.position.z=.08;panel.add(border);
 for(let i=0;i<3;i++){const ring=new THREE.Mesh(new THREE.TorusGeometry(1.95+i*.13,.013,6,96),materials[i%2]);ring.rotation.set(.6+i*.7,.3+i*.5,.2);group.add(ring);}
 const sphere=new THREE.Mesh(new THREE.SphereGeometry(.075,12,8),materials[0]);sphere.position.set(-1.8,.8,.5);group.add(sphere);
 let visible=true,disposed=false,contextLost=false,frame=0;const start=performance.now();const render=()=>{frame=0;if(!disposed&&!contextLost&&visible&&!document.hidden){const t=Math.min(1,(performance.now()-start)/1100);group.scale.setScalar(.85+.15*(1-Math.pow(1-t,3)));panel.scale.setScalar(.7+.3*Math.min(1,t*1.5));group.children.filter(o=>o.geometry?.type==='TorusGeometry').forEach((ring,i)=>{ring.position.x=(i-1)*(1-t)*.55;});renderer.render(scene,camera);if(t<1)requestRender();}};const requestRender=()=>{if(!frame&&!disposed)frame=requestAnimationFrame(render);};
 const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();requestRender();});resize.observe(host);
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;requestRender();});observer.observe(host);
 let pointerX=0,pointerY=0;
 const pose=()=>{const progress=Math.min(1,Math.max(0,scrollY/(host.offsetHeight+150)));group.rotation.y=-.35+progress*.7+pointerX;group.rotation.x=.2+progress*.3+pointerY;group.rotation.z=-.3+progress*.25;group.children.filter(o=>o.geometry?.type==='TorusGeometry').forEach((ring,i)=>{ring.rotation.z=progress*(i+1)*.25;});};
 const move=e=>{pointerX=(e.clientX/innerWidth-.5)*.12;pointerY=(e.clientY/innerHeight-.5)*.1;pose();requestRender();};
 const scroll=()=>{pose();requestRender();};
 requestRender();
 window.addEventListener('scroll',scroll,{passive:true});
 const visibility=()=>requestRender();const lost=e=>{e.preventDefault();contextLost=true;canvas.hidden=true;fallback.hidden=false;};
 canvas.addEventListener('webglcontextlost',lost);document.addEventListener('visibilitychange',visibility);host.addEventListener('pointermove',move);
 try{const {width,height}=host.getBoundingClientRect();renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();renderer.render(scene,camera);canvas.hidden=false;fallback.hidden=true;}catch{disposed=true;window.removeEventListener('scroll',scroll);renderer.dispose();resize.disconnect();observer.disconnect();canvas.removeEventListener('webglcontextlost',lost);document.removeEventListener('visibilitychange',visibility);host.removeEventListener('pointermove',move);return()=>{};}
 return()=>{disposed=true;cancelAnimationFrame(frame);window.removeEventListener('scroll',scroll);resize.disconnect();observer.disconnect();host.removeEventListener('pointermove',move);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',lost);scene.traverse(o=>{o.geometry?.dispose();if(o.material&&!materials.includes(o.material))o.material.dispose();});materials.forEach(m=>m.dispose());renderer.dispose();canvas.hidden=true;fallback.hidden=false;};
}
