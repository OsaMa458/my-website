document.addEventListener("DOMContentLoaded",()=>{
  document.querySelectorAll("#year").forEach(x=>x.textContent=new Date().getFullYear());

  const b=document.querySelector(".menu-btn"),n=document.querySelector(".nav");
  if(b&&n)b.onclick=()=>{const o=n.classList.toggle("open");b.setAttribute("aria-expanded",o)};

  const t=document.querySelector("#lead-type"),e=document.querySelector("#existing-fields"),p=document.querySelector("#project-fields");
  function sync(){if(!t)return;e.classList.toggle("hidden",t.value!=="existing");p.classList.toggle("hidden",t.value==="existing")}
  t?.addEventListener("change",sync);sync();
  const pl=document.querySelector("#platform"),po=document.querySelector("#platform-other-wrap");
  function so(){po?.classList.toggle("hidden",pl?.value!=="Other")}
  pl?.addEventListener("change",so);so();

  const f=document.querySelector("#audit-form");
  f?.addEventListener("submit",x=>{x.preventDefault();const d=Object.fromEntries(new FormData(f).entries());const plat=d.platform==="Other"?(d.platform_other||"Other"):d.platform;let a=["Hi Usama, I'd like to request a Free Store Audit.","",`Project type: ${d.lead_type==="existing"?"Existing store":"New project"}`,`Platform: ${plat}`];if(d.lead_type==="existing")a.push(`Store URL: ${d.store_url||"Not provided"}`,`Goal: ${d.goal_existing||"Not provided"}`,`Current situation: ${d.current_situation||"Not provided"}`);else a.push(`Product/category: ${d.product_category||"Not provided"}`,`Goal: ${d.goal_existing||"Not provided"}`,`Required service: ${d.required_service||"Not specified"}`);if(d.notes)a.push(`Additional notes: ${d.notes}`);window.open("https://wa.me/923299132452?text="+encodeURIComponent(a.join("\n")),"_blank")});

  const m=document.querySelector(".modal");
  const body=m?.querySelector(".modal-body"),title=m?.querySelector("[data-title]");
  const esc=s=>String(s??"").replace(/[&<>\"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
  const money=v=>Number(v).toLocaleString("en-US",{style:"currency",currency:"USD",maximumFractionDigits:2});
  const pct=v=>`${Number(v).toFixed(1)}%`;

  function researchDemo(r){
    const header=r.find(row=>row[0]==="Product" && row.length>=18) || [];
    const start=r.indexOf(header)+1;
    const rows=r.slice(start).filter(row=>row[0] && row[0]!=="Summary").map(row=>{const copy=row.slice(); while(copy.length<header.length) copy.push(""); return copy;}).filter(row=>row.length>=18);
    const products=rows.map(q=>{
      const cost=Number(q[2]), ship=Number(q[3]), landed=cost+ship;
      const wmPrice=Number(q[5]), wmFee=wmPrice*Number(q[6]), wmProfit=wmPrice-wmFee-landed, wmMargin=wmProfit/wmPrice*100;
      const ttPrice=Number(q[10]), ttFee=ttPrice*Number(q[11]), ttProfit=ttPrice-ttFee-landed, ttMargin=ttProfit/ttPrice*100;
      const best=ttMargin>wmMargin?"TikTok Shop":"Walmart Marketplace";
      return {name:q[0],supplier:q[1],cost,ship,landed,wmPrice,wmFee,wmProfit,wmMargin,ttPrice,ttFee,ttProfit,ttMargin,demand:Number(q[15]),score:Number(q[16]),best};
    });
    const avgW=products.reduce((a,p)=>a+p.wmMargin,0)/products.length,avgT=products.reduce((a,p)=>a+p.ttMargin,0)/products.length;
    const bestW=[...products].sort((a,b)=>b.wmMargin-a.wmMargin)[0],bestT=[...products].sort((a,b)=>b.ttMargin-a.ttMargin)[0];
    return `<div class="sheet-note"><strong>What this demo does:</strong> compares the same product on Walmart Marketplace and TikTok Shop using sample numbers. <strong>Landed cost</strong> means product cost + shipping. <strong>Net profit</strong> is selling price minus marketplace fee and landed cost. <strong>Margin</strong> is net profit as a percentage of selling price.</div>
      <div class="demo-summary"><div><span>Average Walmart margin</span><strong>${pct(avgW)}</strong></div><div><span>Average TikTok Shop margin</span><strong>${pct(avgT)}</strong></div><div><span>Best Walmart sample</span><strong>${esc(bestW.name)}</strong></div><div><span>Best TikTok sample</span><strong>${esc(bestT.name)}</strong></div></div>
      <div class="demo-table-intro"><strong>How to read it</strong><span>Green = stronger margin in this sample. Demand score is a simple 1–5 planning score, not a verified sales forecast.</span></div>
      <div class="sheet-scroll-hint"><strong>Complete table available</strong><span class="arrow">← Scroll horizontally to see all columns →</span></div><div class="sheet-wrap"><table class="sheet-table research-table"><thead><tr><th>Product</th><th>Landed Cost</th><th>Walmart Price</th><th>WM Profit</th><th>WM Margin</th><th>TikTok Price</th><th>TT Profit</th><th>TT Margin</th><th>Est. Monthly Demand</th><th>Demand Score</th><th>Higher Sample Margin</th></tr></thead><tbody>${products.map(p=>`<tr><td><strong>${esc(p.name)}</strong><small>${esc(p.supplier)}</small></td><td>${money(p.landed)}</td><td>${money(p.wmPrice)}</td><td>${money(p.wmProfit)}</td><td class="${p.wmMargin>=30?'metric-good':''}">${pct(p.wmMargin)}</td><td>${money(p.ttPrice)}</td><td>${money(p.ttProfit)}</td><td class="${p.ttMargin>=30?'metric-good':''}">${pct(p.ttMargin)}</td><td>${p.demand.toLocaleString()}</td><td>${p.score}/5</td><td><strong>${p.best}</strong></td></tr>`).join("")}</tbody></table></div>
      <details class="demo-help"><summary>Example: how one row is calculated</summary><p><strong>${esc(products[0].name)}</strong>: ${money(products[0].cost)} product cost + ${money(products[0].ship)} shipping = <strong>${money(products[0].landed)} landed cost</strong>. On Walmart, ${money(products[0].wmPrice)} selling price − ${money(products[0].wmFee)} sample fee − ${money(products[0].landed)} landed cost = <strong>${money(products[0].wmProfit)} sample profit</strong>, or ${pct(products[0].wmMargin)} margin.</p></details>`;
  }

  function supplierDemo(r){
    const header=r.find(row=>row[0]==="Product" && row.length>=10) || [];
    const rows=r.slice(r.indexOf(header)+1).filter(row=>row[0]);
    return `<div class="sheet-note"><strong>What this demo does:</strong> gives you a simple supplier-comparison checklist. The blank fields are intentionally left blank because supplier evidence should be collected and verified before a buying decision.</div>
      <div class="demo-steps"><div><b>1. Compare cost</b><span>Check unit price + shipping.</span></div><div><b>2. Check MOQ</b><span>MOQ = minimum order quantity.</span></div><div><b>3. Verify supplier</b><span>Check evidence, history and terms.</span></div><div><b>4. Keep a backup</b><span>Reduce dependency on one source.</span></div></div>
      <div class="sheet-scroll-hint"><strong>Complete supplier details available</strong><span class="arrow">← Scroll horizontally to see all columns →</span></div><div class="sheet-wrap"><table class="sheet-table supplier-table"><thead><tr>${header.map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map(q=>`<tr>${header.map((_,i)=>`<td>${i===0?`<strong>${esc(q[i])}</strong>`:esc(q[i]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <details class="demo-help"><summary>Beginner tip: what should I verify?</summary><p>Ask for supplier evidence such as product specifications, current pricing, shipping terms, MOQ, lead time, business verification and any relevant marketplace or brand authorization. Do not treat a supplier badge or rating alone as proof of product quality or compliance.</p></details>`;
  }

  function genericDemo(k,r){
    let header=r[0],rows=r.slice(1),note="Portfolio demonstration using sample/dummy data. Verify current marketplace rules, fees and supplier evidence before live decisions.";
    if(r[0]?.length===1 && r[1]?.length===1){note=r[1][0];header=r[2]||r[0];rows=r.slice(3)}
    return `<div class="sheet-note"><strong>Demo:</strong> ${esc(note)}</div><div class="sheet-wrap"><table class="sheet-table"><thead><tr>${header.map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map(q=>`<tr>${header.map((_,i)=>`<td>${esc(q[i]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function close(){m?.classList.remove("open");document.body.style.overflow=""}
  function open(k){if(!m||!window.DEMO_DATA?.[k])return;title.textContent=k+" — On-site demo";const r=DEMO_DATA[k];body.innerHTML=k==="Product Research"?researchDemo(r):k==="Supplier Comparison"?supplierDemo(r):genericDemo(k,r);m.classList.add("open");document.body.style.overflow="hidden"}
  document.querySelectorAll("[data-demo]").forEach(x=>x.onclick=q=>{q.preventDefault();open(x.dataset.demo)});
  document.querySelectorAll("[data-close]").forEach(x=>x.onclick=close);
  m?.addEventListener("click",x=>{if(x.target===m)close()});
  document.addEventListener("keydown",x=>{if(x.key==="Escape")close()});
});
