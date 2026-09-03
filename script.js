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
    const headerIndex=r.findIndex(row=>Array.isArray(row) && row[0]==="Product" && row.length>=18);
    if(headerIndex<0) return `<div class="sheet-error"><strong>Demo data could not be read.</strong><p>Please use the latest portfolio package.</p></div>`;
    const header=r[headerIndex];
    const rows=r.slice(headerIndex+1).filter(row=>Array.isArray(row) && row[0] && row[0]!=="Summary").map(row=>{
      const copy=row.slice(0,header.length);
      while(copy.length<header.length) copy.push("");
      return copy;
    });
    const products=rows.map(q=>{
      const cost=Number(q[2])||0, ship=Number(q[3])||0, landed=cost+ship;
      const wmPrice=Number(q[5])||0, wmFeeRate=Number(q[6])||0, wmFee=wmPrice*wmFeeRate;
      const wmProfit=wmPrice-wmFee-landed, wmMargin=wmPrice?wmProfit/wmPrice*100:0;
      const ttPrice=Number(q[10])||0, ttFeeRate=Number(q[11])||0, ttFee=ttPrice*ttFeeRate;
      const ttProfit=ttPrice-ttFee-landed, ttMargin=ttPrice?ttProfit/ttPrice*100:0;
      const best=ttMargin>wmMargin?"TikTok Shop":"Walmart Marketplace";
      return {name:q[0],supplier:q[1],cost,ship,landed,wmPrice,wmFeeRate,wmFee,wmProfit,wmMargin,ttPrice,ttFeeRate,ttFee,ttProfit,ttMargin,demand:Number(q[15])||0,score:Number(q[16])||0,best:q[17]||best};
    });
    if(!products.length) return `<div class="sheet-error"><strong>No product rows were found.</strong><p>The workbook appears to contain headers but no readable product data.</p></div>`;
    const avgW=products.reduce((a,p)=>a+p.wmMargin,0)/products.length,avgT=products.reduce((a,p)=>a+p.ttMargin,0)/products.length;
    const bestW=[...products].sort((a,b)=>b.wmMargin-a.wmMargin)[0],bestT=[...products].sort((a,b)=>b.ttMargin-a.ttMargin)[0];
    return `<div class="sheet-note"><strong>What this demo does:</strong> compares the same product on Walmart Marketplace and TikTok Shop using sample numbers. <strong>Landed cost</strong> = product cost + shipping. <strong>Net profit</strong> = selling price − marketplace fee − landed cost. <strong>Margin</strong> = net profit ÷ selling price.</div>
      <div class="demo-summary"><div><span>Average Walmart margin</span><strong>${pct(avgW)}</strong></div><div><span>Average TikTok Shop margin</span><strong>${pct(avgT)}</strong></div><div><span>Best Walmart sample</span><strong>${esc(bestW.name)}</strong></div><div><span>Best TikTok sample</span><strong>${esc(bestT.name)}</strong></div></div>
      <div class="demo-table-intro"><strong>How to read it</strong><span>Start with landed cost, then compare selling price, profit and margin. Green values show stronger sample margins. Demand score is a simple 1–5 planning score, not a verified sales forecast.</span></div>
      <div class="sheet-scroll-hint"><strong>Complete table</strong><span class="arrow">↕ Scroll up/down &nbsp; ↔ Scroll left/right &nbsp; • &nbsp; Drag, touch, mouse wheel or use arrow keys</span></div><div class="sheet-controls" aria-label="Table controls"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><span data-zoom-label>100%</span><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset">Reset</button></div><div class="sheet-wrap" tabindex="0" aria-label="Product research table. Use arrow keys or scroll to move in both directions."><table class="sheet-table research-table"><thead><tr><th>Product</th><th>Supplier</th><th>Unit Cost</th><th>Shipping / Unit</th><th>Landed Cost</th><th>Walmart Price</th><th>WM Fee Rate</th><th>WM Fee</th><th>WM Profit</th><th>WM Margin</th><th>TikTok Price</th><th>TT Fee Rate</th><th>TT Fee</th><th>TT Profit</th><th>TT Margin</th><th>Est. Monthly Demand</th><th>Demand Score</th><th>Higher Sample Margin</th></tr></thead><tbody>${products.map(p=>`<tr><td><strong>${esc(p.name)}</strong></td><td>${esc(p.supplier)}</td><td>${money(p.cost)}</td><td>${money(p.ship)}</td><td><strong>${money(p.landed)}</strong></td><td>${money(p.wmPrice)}</td><td>${pct(p.wmFeeRate*100)}</td><td>${money(p.wmFee)}</td><td>${money(p.wmProfit)}</td><td class="${p.wmMargin>=30?'metric-good':''}">${pct(p.wmMargin)}</td><td>${money(p.ttPrice)}</td><td>${pct(p.ttFeeRate*100)}</td><td>${money(p.ttFee)}</td><td>${money(p.ttProfit)}</td><td class="${p.ttMargin>=30?'metric-good':''}">${pct(p.ttMargin)}</td><td>${p.demand.toLocaleString()}</td><td>${p.score}/5</td><td><strong>${esc(p.best)}</strong></td></tr>`).join("")}</tbody></table></div>
      <details class="demo-help"><summary>Example: how one row is calculated</summary><p><strong>${esc(products[0].name)}</strong>: ${money(products[0].cost)} product cost + ${money(products[0].ship)} shipping = <strong>${money(products[0].landed)} landed cost</strong>. On Walmart, ${money(products[0].wmPrice)} selling price − ${money(products[0].wmFee)} sample fee − ${money(products[0].landed)} landed cost = <strong>${money(products[0].wmProfit)} sample profit</strong>, or ${pct(products[0].wmMargin)} margin.</p></details>`;
  }

  function supplierDemo(r){
    const headerIndex=r.findIndex(row=>Array.isArray(row) && row[0]==="Product" && row.length>=10);
    if(headerIndex<0) return `<div class="sheet-error"><strong>Supplier data could not be read.</strong><p>Please use the latest portfolio package.</p></div>`;
    const header=r[headerIndex];
    const rows=r.slice(headerIndex+1).filter(row=>Array.isArray(row) && row[0]);
    return `<div class="sheet-note"><strong>What this demo does:</strong> gives you a simple supplier-comparison checklist. Blank fields mean evidence still needs to be collected and verified before a buying decision.</div>
      <div class="demo-steps"><div><b>1. Compare cost</b><span>Unit price + shipping = your starting landed cost.</span></div><div><b>2. Check MOQ</b><span>MOQ means the minimum number of units a supplier requires you to order.</span></div><div><b>3. Verify supplier</b><span>Check evidence, history, specifications and terms.</span></div><div><b>4. Keep a backup</b><span>A second source reduces dependency on one supplier.</span></div></div>
      <div class="sheet-scroll-hint"><strong>Complete supplier table</strong><span class="arrow">↕ Scroll up/down &nbsp; ↔ Scroll left/right &nbsp; • &nbsp; Drag, touch, mouse wheel or use arrow keys</span></div><div class="sheet-controls" aria-label="Table controls"><button type="button" data-zoom="out" aria-label="Zoom out">−</button><span data-zoom-label>100%</span><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="reset">Reset</button></div><div class="sheet-wrap" tabindex="0" aria-label="Supplier comparison table. Use arrow keys or scroll to move in both directions."><table class="sheet-table supplier-table"><thead><tr>${header.map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map(q=>`<tr>${header.map((_,i)=>`<td>${i===0?`<strong>${esc(q[i])}</strong>`:esc(q[i]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <details class="demo-help"><summary>Beginner tip: what should I verify?</summary><p>Ask for product specifications, current pricing, shipping terms, MOQ, lead time, business verification and any relevant marketplace or brand authorization. A supplier badge or rating alone is not proof of product quality or compliance.</p></details>`;
  }

  function genericDemo(k,r){
    let header=r[0],rows=r.slice(1),note="Portfolio demonstration using sample/dummy data. Verify current marketplace rules, fees and supplier evidence before live decisions.";
    if(r[0]?.length===1 && r[1]?.length===1){note=r[1][0];header=r[2]||r[0];rows=r.slice(3)}
    return `<div class="sheet-note"><strong>Demo:</strong> ${esc(note)}</div><div class="sheet-wrap"><table class="sheet-table"><thead><tr>${header.map(x=>`<th>${esc(x)}</th>`).join("")}</tr></thead><tbody>${rows.map(q=>`<tr>${header.map((_,i)=>`<td>${esc(q[i]||"—")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  }

  function setupSheetControls(){
    const wrap=body?.querySelector(".sheet-wrap");
    const controls=body?.querySelector(".sheet-controls");
    if(!wrap||!controls)return;
    let zoom=100;
    const table=wrap.querySelector("table");
    const applyZoom=()=>{table?.style.setProperty("--demo-zoom",zoom/100);table?.style.setProperty("font-size",`${13*zoom/100}px`);wrap.dataset.zoom=String(zoom);const label=controls.querySelector("[data-zoom-label]");if(label)label.textContent=zoom+"%"};
    controls.querySelector('[data-zoom="in"]')?.addEventListener("click",()=>{zoom=Math.min(160,zoom+10);applyZoom()});
    controls.querySelector('[data-zoom="out"]')?.addEventListener("click",()=>{zoom=Math.max(70,zoom-10);applyZoom()});
    controls.querySelector('[data-zoom="reset"]')?.addEventListener("click",()=>{zoom=100;applyZoom();wrap.scrollTo({left:0,top:0,behavior:"smooth"})});
    applyZoom();
    let dragging=false,startX=0,startY=0,startLeft=0,startTop=0;
    wrap.addEventListener("pointerdown",e=>{if(e.target.closest("button,a,input,select,textarea"))return;dragging=true;startX=e.clientX;startY=e.clientY;startLeft=wrap.scrollLeft;startTop=wrap.scrollTop;wrap.classList.add("is-dragging");wrap.setPointerCapture?.(e.pointerId)});
    wrap.addEventListener("pointermove",e=>{if(!dragging)return;wrap.scrollLeft=startLeft-(e.clientX-startX);wrap.scrollTop=startTop-(e.clientY-startY)});
    const stop=()=>{dragging=false;wrap.classList.remove("is-dragging")};
    wrap.addEventListener("pointerup",stop);wrap.addEventListener("pointercancel",stop);wrap.addEventListener("lostpointercapture",stop);
    wrap.addEventListener("wheel",e=>{if(Math.abs(e.deltaX)<Math.abs(e.deltaY) && e.shiftKey){e.preventDefault();wrap.scrollLeft+=e.deltaY}}, {passive:false});
    wrap.addEventListener("keydown",e=>{const step=60;let handled=true;switch(e.key){case"ArrowRight":wrap.scrollLeft+=step;break;case"ArrowLeft":wrap.scrollLeft-=step;break;case"ArrowDown":wrap.scrollTop+=step;break;case"ArrowUp":wrap.scrollTop-=step;break;case"PageDown":wrap.scrollTop+=wrap.clientHeight*.8;break;case"PageUp":wrap.scrollTop-=wrap.clientHeight*.8;break;case"Home":wrap.scrollLeft=0;wrap.scrollTop=0;break;case"End":wrap.scrollLeft=wrap.scrollWidth;wrap.scrollTop=wrap.scrollHeight;break;default:handled=false}if(handled)e.preventDefault()});
  }
  function close(){m?.classList.remove("open");document.body.style.overflow=""}
  function open(k){if(!m||!window.DEMO_DATA?.[k])return;title.textContent=k+" — On-site demo";const r=DEMO_DATA[k];body.innerHTML=k==="Product Research"?researchDemo(r):k==="Supplier Comparison"?supplierDemo(r):genericDemo(k,r);m.classList.add("open");document.body.style.overflow="hidden";requestAnimationFrame(setupSheetControls)}
  document.querySelectorAll("[data-demo]").forEach(x=>x.onclick=q=>{q.preventDefault();open(x.dataset.demo)});
  document.querySelectorAll("[data-close]").forEach(x=>x.onclick=close);
  m?.addEventListener("click",x=>{if(x.target===m)close()});
  document.addEventListener("keydown",x=>{if(x.key==="Escape")close()});
});
