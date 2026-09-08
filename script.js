const $=(s,p=document)=>p.querySelector(s), $$=(s,p=document)=>[...p.querySelectorAll(s)];

const header=$("#header"), progress=$("#progress");
addEventListener("scroll",()=>{
  const h=document.documentElement.scrollHeight-innerHeight;
  progress.style.width=(h>0?(scrollY/h)*100:0)+"%";
  header.classList.toggle("scrolled",scrollY>10);
},{passive:true});

const menuBtn=$("#menuBtn"), mobileNav=$("#mobileNav");
menuBtn.addEventListener("click",()=>{
  const open=mobileNav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded",open);
});
$$(".mobile-nav a").forEach(a=>a.addEventListener("click",()=>mobileNav.classList.remove("open")));

const items=[
 ["Graphic Design","Social Media","Design showcase","assets/portfolio/design-01.svg"],
 ["Graphic Design","Graphic Design","Creative asset","assets/portfolio/design-02.svg"],
 ["Graphic Design","Real Estate","Property marketing","assets/portfolio/realestate-01.svg"],
 ["Social Media","Social Media","Social content","assets/portfolio/social-01.svg"],
 ["Social Media","Social Media","Content campaign","assets/portfolio/social-02.svg"],
 ["Presentations","Presentations","Presentation design","assets/portfolio/deck-01.svg"],
 ["Presentations","Presentations","Business deck","assets/portfolio/deck-02.svg"],
 ["Real Estate","Real Estate","Real estate creative","assets/portfolio/realestate-02.svg"],
 ["Video Editing","Video Editing","Video project","assets/portfolio/video-01.svg"]
];

const workGrid=$("#workGrid");
function render(filter="all"){
  workGrid.innerHTML="";
  items.filter(x=>filter==="all"||x[1]===filter).forEach((x,i)=>{
    const card=document.createElement("article");
    card.className="work-card";
    card.innerHTML=`<div class="work-image"><img src="${x[3]}" alt="${x[2]}" loading="lazy"></div><div class="work-info"><small>${x[0]}</small><h3>${x[2]}</h3><p>Selected FUSE portfolio work</p></div>`;
    card.addEventListener("click",()=>window.open(x[3],"_blank"));
    workGrid.appendChild(card);
  });
}
render();

$$(".work-tabs button").forEach(btn=>btn.addEventListener("click",()=>{
  $$(".work-tabs button").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  render(btn.dataset.filter);
}));

// Subtle reveal animation. Elements remain visible if JS is unavailable.
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");observer.unobserve(e.target)}});
},{threshold:.08});
$$(".service,.person,.work-card,.steps>div,.values span").forEach(el=>{
  el.style.opacity="0";el.style.transform="translateY(16px)";el.style.transition="opacity .6s ease, transform .6s ease";
  observer.observe(el);
});
document.addEventListener("animationend",()=>{});
const style=document.createElement("style");
style.textContent=".in{opacity:1!important;transform:none!important}";
document.head.appendChild(style);
