/* Pure engine logic: seeded shuffle, answer remapping, scoring. No DOM access, so it is unit-tested. */

export function rng(seed){let h=2166136261;for(const ch of seed){h^=ch.charCodeAt(0);h=Math.imul(h,16777619)}return()=>{h+=0x6D2B79F5;let t=h;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return((t^t>>>14)>>>0)/4294967296}}

export function permute(n,r){const p=[...Array(n).keys()];for(let i=n-1;i>0;i--){const j=Math.floor(r()*(i+1));[p[i],p[j]]=[p[j],p[i]]}return p}

export function inverse(p){const inv=[];p.forEach((old,nw)=>inv[old]=nw);return inv}

export function shuffleQ(q,seed){
 const r=rng(seed);
 if(q.t==="single"||q.t==="multi"){const p=permute(q.opts.length,r),inv=inverse(p);q.opts=p.map(o=>q.opts[o]);q.a=q.t==="single"?inv[q.a]:q.a.map(v=>inv[v]);q._inv=inv}
 else if(q.t==="hot"){q._invSel=[];q.sel=q.sel.map((list,k)=>{const p=permute(list.length,r),inv=inverse(p);q._invSel[k]=inv;q.a[k]=inv[q.a[k]];return p.map(o=>list[o])})}
 else if(q.t==="build"||q.t==="match"){const p=permute(q.pool.length,r),inv=inverse(p);q.pool=p.map(o=>q.pool[o]);q.a=q.a.map(v=>inv[v]);q._inv=inv}
 return q}

export function remap(q,a){ /* old-order answer → shuffled-order answer */
 if(a==null)return a;
 if(q.t==="single")return q._inv?q._inv[a]:a;
 if(q.t==="multi"||q.t==="build"||q.t==="match")return Array.isArray(a)&&q._inv?a.map(v=>v==null||v<0?v:q._inv[v]):a;
 if(q.t==="hot")return Array.isArray(a)&&q._invSel?a.map((v,k)=>v==null||v<0?v:q._invSel[k][v]):a;
 return a}

export function maxPts(q){switch(q.t){case"multi":return q.n;case"hot":return q.sel.length;case"build":return q.a.length;case"match":return q.targets.length;case"yesno":return q.rows.length;default:return 1}}

export function pts(q,a){
 if(a==null)return 0;
 switch(q.t){
  case"single":case"series":return a===q.a?1:0;
  case"multi":return Array.isArray(a)?a.filter(x=>q.a.includes(x)).length:0;
  case"hot":case"match":case"yesno":case"build":return Array.isArray(a)?q.a.reduce((s,v,k)=>s+(a[k]===v?1:0),0):0;
 }return 0}

export function answered(q,a){if(a==null)return false;
 if(q.t==="multi")return Array.isArray(a)&&a.length===q.n;
 if(["hot","match","yesno"].includes(q.t))return Array.isArray(a)&&a.length>0&&a.every(v=>v!=null&&v!==-1);
 if(q.t==="build")return Array.isArray(a)&&a.length===q.a.length;
 return true}

export function missedFrom(st,Qarr){return Qarr.map((q,i)=>i).filter(i=>st&&st.ans&&st.ans[i]!=null&&pts(Qarr[i],st.ans[i])<maxPts(Qarr[i]))}

export function scoreOf(st,Qarr){let t=0,g=0;Qarr.forEach((q,i)=>{t+=maxPts(q);g+=pts(q,st&&st.ans?st.ans[i]:null)});return{got:g,tot:t,scaled:Math.round(1000*g/t)}}
