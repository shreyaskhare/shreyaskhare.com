window.addEventListener('load',()=>{
  setTimeout(()=>{
    const l=document.getElementById('pageLoader');
    if(l)l.classList.add('done');
    initScrollAnimations();
    initSkillBars();
  },1300);
});

const cursorGlow=document.getElementById('cursorGlow');
document.addEventListener('mousemove',e=>{
  if(cursorGlow){cursorGlow.style.left=e.clientX+'px';cursorGlow.style.top=e.clientY+'px';}
});

window.addEventListener('scroll',()=>{
  const nb=document.getElementById('navbar');
  if(nb)nb.classList.toggle('scrolled',window.scrollY>60);
},{passive:true});

let navOpen=false,mobileMenu=null;
function toggleNav(){
  if(!mobileMenu){
    mobileMenu=document.createElement('div');
    mobileMenu.className='nav-mobile';
    mobileMenu.innerHTML=`<ul>
      <li><a href="#about" onclick="toggleNav()">About</a></li>
      <li><a href="#experience" onclick="toggleNav()">Experience</a></li>
      <li><a href="#skills" onclick="toggleNav()">Skills</a></li>
      <li><a href="#achievements" onclick="toggleNav()">Impact</a></li>
      <li><a href="#feed" onclick="toggleNav()">Insights</a></li>
      <li><a href="#media" onclick="toggleNav()">Media</a></li>
      <li><a href="#contact" onclick="toggleNav()">Contact</a></li>
      <li><a href="#" onclick="openResumeModal(event);toggleNav()">Resume</a></li>
    </ul>`;
    document.body.appendChild(mobileMenu);
  }
  navOpen=!navOpen;
  mobileMenu.classList.toggle('open',navOpen);
}

function initScrollAnimations(){
  const targets=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach((entry,i)=>{
      if(entry.isIntersecting){
        setTimeout(()=>entry.target.classList.add('visible'),i*80);
        observer.unobserve(entry.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  targets.forEach(t=>observer.observe(t));
}

function initSkillBars(){
  const bars=document.querySelectorAll('.sfill');
  const obs=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.style.width=entry.target.dataset.w+'%';
        obs.unobserve(entry.target);
      }
    });
  },{threshold:0.3});
  bars.forEach(b=>obs.observe(b));
}

function openResumeModal(e){
  if(e)e.preventDefault();
  const m=document.getElementById('resumeModal');
  if(m){m.classList.add('open');document.body.style.overflow='hidden';}
}
function closeResumeModal(){
  const m=document.getElementById('resumeModal');
  if(m){m.classList.remove('open');document.body.style.overflow='';}
}
document.addEventListener('click',e=>{
  const m=document.getElementById('resumeModal');
  if(m&&e.target===m)closeResumeModal();
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeResumeModal();});

function handleResume(e){
  e.preventDefault();
  const btn=e.target.querySelector('button[type="submit"]');
  if(btn){btn.textContent='Verifying...';btn.disabled=true;}
  const data=new FormData(e.target);
  fetch('https://formspree.io/f/mlgwqwgq',{method:'POST',body:data,headers:{'Accept':'application/json'}})
  .then(r=>{
    if(r.ok){
      closeResumeModal();
      window.open('assets/resume/Shreyas-Khare-Resume.pdf','_blank');
      showToast('✅ Access granted! Resume opening now.');
    } else {
      showToast('Something went wrong. Please email shreyasnkhare@gmail.com');
      if(btn){btn.textContent='Access Resume →';btn.disabled=false;}
    }
  })
  .catch(()=>{
    showToast('Network error. Please email shreyasnkhare@gmail.com');
    if(btn){btn.textContent='Access Resume →';btn.disabled=false;}
  });
}


function submitContact(e){
  e.preventDefault();
  const btn=e.target.querySelector('button[type="submit"]');
  if(btn){btn.textContent='Sending...';btn.disabled=true;}
  const data=new FormData(e.target);
  fetch('https://formspree.io/f/mzdanaeb',{method:'POST',body:data,headers:{'Accept':'application/json'}})
  .then(r=>{
    if(r.ok){
      showToast('✅ Message sent! Shreyas will reply soon.');
      e.target.reset();
      if(btn){btn.textContent='Send Message';btn.disabled=false;}
    } else {
      showToast('Something went wrong. Please email shreyasnkhare@gmail.com');
      if(btn){btn.textContent='Send Message';btn.disabled=false;}
    }
  })
  .catch(()=>{
    showToast('Network error. Please email shreyasnkhare@gmail.com');
    if(btn){btn.textContent='Send Message';btn.disabled=false;}
  });
}


function showToast(msg){
  const t=document.createElement('div');
  t.style.cssText='position:fixed;bottom:28px;right:28px;background:linear-gradient(135deg,#7c3aed,#06b6d4);color:#fff;padding:14px 22px;border-radius:12px;font-size:0.88rem;font-weight:600;z-index:99999;box-shadow:0 8px 30px rgba(124,58,237,0.5);max-width:340px;';
  t.textContent=msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),4500);
}

function showFeedForm(){
  const f=document.getElementById('feedFormWrap');
  if(f){f.style.display='block';f.scrollIntoView({behavior:'smooth',block:'center'});}
}
function hideFeedForm(){
  const f=document.getElementById('feedFormWrap');
  if(f)f.style.display='none';
}
function addFeedItem(){
  const type=document.getElementById('feedType').value;
  const title=document.getElementById('feedTitle').value.trim();
  const excerpt=document.getElementById('feedExcerpt').value.trim();
  const link=document.getElementById('feedLink').value.trim();
  if(!title){alert('Please enter a title.');return;}
  const map={linkedin:['linkedin-badge','LinkedIn Post'],blog:['blog-badge','Blog / Article'],news:['news-badge','News / Feature']};
  const [cls,label]=map[type]||['blog-badge','Post'];
  const card=document.createElement('article');
  card.className='feed-card reveal visible';
  card.innerHTML=`<span class="feed-badge ${cls}">${label}</span><h3 class="feed-title">${title}</h3>${excerpt?`<p class="feed-excerpt">${excerpt}</p>`:''}<div class="feed-footer">${link?`<a href="${link}" target="_blank" rel="noopener" style="color:var(--accent2)">Open Link</a>`:'Added by Shreyas Khare'}</div>`;
  const grid=document.getElementById('feedGrid');
  const addBtn=grid.querySelector('.feed-add-card');
  if(addBtn)grid.insertBefore(card,addBtn);else grid.appendChild(card);
  document.getElementById('feedTitle').value='';
  document.getElementById('feedExcerpt').value='';
  document.getElementById('feedLink').value='';
  hideFeedForm();
  showToast('Post added to your Insights feed!');
}

function getEmbedUrl(url){
  const yt=url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([A-Za-z0-9_-]{11})/);
  if(yt)return`https://www.youtube.com/embed/${yt[1]}?autoplay=1&rel=0`;
  const vi=url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if(vi)return`https://player.vimeo.com/video/${vi[1]}?autoplay=1`;
  return url;
}
function loadMedia(frameId,phId,inputId){
  const url=document.getElementById(inputId).value.trim();
  if(!url){showToast('Please paste a URL first.');return;}
  const frame=document.getElementById(frameId);
  const ph=document.getElementById(phId);
  if(frame&&ph){frame.src=getEmbedUrl(url);frame.style.display='block';ph.style.display='none';}
}
function loadImg(imgId,phId,inputId){
  const url=document.getElementById(inputId).value.trim();
  if(!url){showToast('Please paste an image URL first.');return;}
  const img=document.getElementById(imgId);
  const ph=document.getElementById(phId);
  if(img&&ph){img.src=url;img.style.display='block';ph.style.display='none';}
}

let mediaCount=3;
function addMediaSlot(){
  mediaCount++;
  const n=mediaCount;
  const grid=document.getElementById('mediaGrid');
  const card=document.createElement('div');
  card.className='media-card reveal visible';
  card.innerHTML=`<div class="media-embed-wrap"><div class="media-ph" id="ph${n}"><i class="fas fa-play-circle"></i><span>Media Slot ${n}</span></div><iframe id="fr${n}" style="display:none;position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen allow="autoplay;encrypted-media"></iframe></div><div class="media-info"><div class="media-card-title">Media Slot ${n}</div></div><div class="media-url-row"><input class="media-url-inp" type="url" id="u${n}" placeholder="Paste URL..."/><button class="media-load-btn" onclick="loadMedia('fr${n}','ph${n}','u${n}')">Load</button></div>`;
  grid.appendChild(card);
  card.scrollIntoView({behavior:'smooth',block:'center'});
}

