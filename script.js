
    const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];
    window.addEventListener("load",()=>{
      initPreloader(); initSmooth(); initThree(); initCursor(); initMagnetic(); initReveal(); initCounters(); initStories(); initTilt(); initParallax(); initHeroTurbine(); initNavToggle();
    });

    function initPreloader(){
      const fill=$("#batteryFill"), pre=$("#preloader");
      gsap.to(fill,{width:"100%",duration:2.1,ease:"power2.out",onComplete:()=>pre.classList.add("hide")});
    }

    function initSmooth(){
      const lenis=new Lenis({duration:1.12,smoothWheel:true,smoothTouch:false});
      const raf=t=>{lenis.raf(t);requestAnimationFrame(raf)}; requestAnimationFrame(raf);
      $$(".nav-link,.brand").forEach(link=>link.addEventListener("click",e=>{
        const href=link.getAttribute("href");
        if(!href.startsWith("#")) return; // allow normal navigation for external/page links
        e.preventDefault();
        const node=$(href);
        if(node) node.scrollIntoView({behavior:"smooth"});
      }));
    }

    function initThree(){
      if(matchMedia("(max-width:760px)").matches) return; // avoid heavy 3D on small screens
      const canvas=$("#earth-canvas"); if(!canvas||!window.THREE) return;
      const scene=new THREE.Scene();
      const camera=new THREE.PerspectiveCamera(55,innerWidth/innerHeight,.1,1000);
      const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true});
      renderer.setPixelRatio(Math.min(devicePixelRatio,1.6)); renderer.setSize(innerWidth,innerHeight);
      const geo=new THREE.SphereGeometry(5,64,64);
      const mat=new THREE.MeshStandardMaterial({color:0x37b7ff,metalness:.25,roughness:.35,emissive:0x0c8a62,emissiveIntensity:.45,wireframe:true});
      const earth=new THREE.Mesh(geo,mat); earth.position.set(2.2,-.6,-3.2); scene.add(earth);
      scene.add(new THREE.PointLight(0x6effbc,1.3,100));
      const l2=new THREE.PointLight(0xff8a31,.8,100); l2.position.set(-7,-3,4); scene.add(l2);
      scene.add(new THREE.AmbientLight(0x1a5f4f,.6)); camera.position.z=10;
      let mx=0,my=0; addEventListener("mousemove",e=>{mx=(e.clientX/innerWidth)*2-1; my=-(e.clientY/innerHeight)*2+1});
      (function loop(){earth.rotation.y+=.0024; earth.rotation.x+=.0008; earth.position.x=2.2+mx*.35; earth.position.y=-.6+my*.2; renderer.render(scene,camera); requestAnimationFrame(loop)})();
      addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
    }

    function initCursor(){
      const dot=$(".cursor-dot"); if(!dot||matchMedia("(max-width:760px)").matches) return;
      let mx=innerWidth/2,my=innerHeight/2;
      function createParticle(x,y){
        const p=document.createElement('div');
        p.className='cursor-particle';
        p.style.left=x+'px';
        p.style.top=y+'px';
        document.body.appendChild(p);
        setTimeout(()=>p.remove(),800);
      }
      let lastParticleTime=0;
      addEventListener("mousemove",e=>{
        mx=e.clientX; my=e.clientY;
        dot.style.transform=`translate(${mx}px,${my}px)`;
        const now=Date.now();
        if(now - lastParticleTime > 40){
          createParticle(mx,my);
          lastParticleTime=now;
        }
      });
      // no hover effects since ring removed
    }

    function initHeroTurbine(){
      const wrap=document.querySelector('.hero .turbine .blade-wrap');
      if(!wrap) return;
      gsap.to(wrap,{rotate:1440,ease:"none",repeat:-1,duration:20});
    }

    function initMagnetic(){
      if(matchMedia("(max-width:900px)").matches) return;
      $$(".magnetic").forEach(el=>{
        el.addEventListener("mousemove",e=>{
          const r=el.getBoundingClientRect(), x=e.clientX-r.left-r.width/2, y=e.clientY-r.top-r.height/2;
          gsap.to(el,{x:x*.22,y:y*.22,duration:.3,ease:"power3.out"});
        });
        el.addEventListener("mouseleave",()=>gsap.to(el,{x:0,y:0,duration:.4,ease:"elastic.out(1,.45)"}));
      });
    }

    function initReveal(){
      gsap.registerPlugin(ScrollTrigger);
      gsap.from(".hero-content .tag,.hero-content h1,.hero-content p,.hero-content .btn",{opacity:0,y:34,duration:1,ease:"power3.out",stagger:.14,delay:1.8});
      $$(".reveal-up").forEach(el=>gsap.from(el,{opacity:0,y:34,duration:.8,ease:"power2.out",scrollTrigger:{trigger:el,start:"top 86%",once:true}}));
    }
    function initCounters(){
      $$(".counter").forEach(el=>{
        const target=Number(el.dataset.target||0), obj={v:0};
        gsap.to(obj,{v:target,duration:2,ease:"power3.out",scrollTrigger:{trigger:el,start:"top 85%",once:true},onUpdate:()=>el.textContent=Math.floor(obj.v).toLocaleString()});
      });
    }

    function initStories(){
      $$(".scene-bg").forEach(bg=>gsap.to(bg,{yPercent:14,scale:1.1,ease:"none",scrollTrigger:{trigger:bg.parentElement,start:"top bottom",end:"bottom top",scrub:true}}));
      $$(".scene-content").forEach(c=>gsap.from(c,{opacity:0,y:42,duration:1,ease:"power3.out",scrollTrigger:{trigger:c,start:"top 78%"}}));
      $$(".energy-lines path,.wind-lines path").forEach(path=>gsap.to(path,{strokeDashoffset:0,duration:1.5,ease:"power2.out",scrollTrigger:{trigger:path.closest(".scene"),start:"top 72%"}}));
      $$(".blade-wrap").forEach(b=>gsap.to(b,{rotate:1440,ease:"none",scrollTrigger:{trigger:b.closest(".scene"),start:"top bottom",end:"bottom top",scrub:true}}));
    }

    function initTilt(){
      $$(".tilt-card").forEach(card=>{
        card.addEventListener("mousemove",e=>{
          const r=card.getBoundingClientRect(), px=(e.clientX-r.left)/r.width, py=(e.clientY-r.top)/r.height;
          card.style.setProperty("--sx",`${px*100}%`); card.style.setProperty("--sy",`${py*100}%`);
          gsap.to(card,{rotateX:(py-.5)*-10,rotateY:(px-.5)*10,duration:.25,ease:"power2.out",transformPerspective:800});
        });
        card.addEventListener("mouseleave",()=>gsap.to(card,{rotateX:0,rotateY:0,duration:.35,ease:"power2.out"}));
      });
      $$(".service-card").forEach(card=>card.addEventListener("mousemove",e=>{const r=card.getBoundingClientRect(); card.style.setProperty("--mx",`${(e.clientX-r.left)/r.width*100}%`); card.style.setProperty("--my",`${(e.clientY-r.top)/r.height*100}%`);}));
    }

    function initParallax(){
      const items=$$("[data-speed]");
      addEventListener("scroll",()=>{const y=scrollY; items.forEach(el=>{const s=Number(el.dataset.speed||.2); el.style.transform=`translateY(${y*s*.18}px)`})},{passive:true});
    }

    // show/hide navigation links on small devices
    function initNavToggle(){
      const btn=$('.nav-toggle');
      const links=$('.nav-links');
      if(!btn||!links) return;
      btn.addEventListener('click',()=>{
        links.classList.toggle('open');
      });
      // close menu when a link is clicked
      $$('.nav-link').forEach(l=>l.addEventListener('click',()=>{links.classList.remove('open');}));
    }
  
