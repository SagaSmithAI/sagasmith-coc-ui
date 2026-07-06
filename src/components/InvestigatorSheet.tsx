import { useState, useEffect } from 'react';
import { getInvestigator } from '../lib/api';
import { ATTRIBUTE_LABELS } from '../types';
import type { Investigator, CocSheet } from '../types';

export default function InvestigatorSheet() {
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  const [inv, setInv] = useState<Investigator|null>(null);
  const [showRaw, setShowRaw] = useState(false);
  useEffect(() => { if (id) getInvestigator(id).then(setInv).catch(()=>{}); }, [id]);
  if (!inv) return <div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>加载中...</div>;
  const s: CocSheet = (inv.sheet || {}) as CocSheet;
  const attrs = s.attributes || {};
  const skills = s.skills || {};

  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:'24px 16px'}}>
      <div className="page-header">
        <a href={`/campaigns/${inv.campaign_id}`} className="btn btn-ghost btn-sm">←</a>
        <div><h1>🕵️ {inv.name}</h1><div className="subtitle">{s.occupation||inv.summary||'调查员'}</div></div>
      </div>
      {/* 8 attributes */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">属性</div>
        <div className="stat-grid" style={{gridTemplateColumns:'repeat(4,1fr)'}}>
          {['str','con','siz','dex','app','int','pow','edu'].map(ab => (
            <div key={ab} className="stat-card" style={{padding:12}}>
              <div style={{fontSize:'.7rem',color:'#6b7280'}}>{ATTRIBUTE_LABELS[ab]||ab}</div>
              <div className="stat-number" style={{fontSize:'1.4rem'}}>{attrs[ab]??'-'}</div>
              <div style={{fontSize:'.7rem',color:'#9ca3af'}}>1/2:{Math.floor((attrs[ab]??0)/2)} 1/5:{Math.floor((attrs[ab]??0)/5)}</div>
            </div>
          ))}
        </div>
      </div>
      {/* HP / SAN / Luck / MP */}
      <div className="stat-grid" style={{marginBottom:16}}>
        <div className="stat-card"><div className="stat-label">HP</div><div className="stat-number" style={{fontSize:'1.2rem'}}>{s.hp?.current??'?'}/{s.hp?.max??'?'}</div></div>
        <div className="stat-card" style={{borderColor:'#7c3aed'}}><div className="stat-label">SAN</div><div className="stat-number" style={{fontSize:'1.2rem',color:'#7c3aed'}}>{s.san?.current??'?'}/{s.san?.max??'?'}</div></div>
        <div className="stat-card"><div className="stat-label">幸运</div><div className="stat-number" style={{fontSize:'1.2rem'}}>{s.luck??'?'}</div></div>
        <div className="stat-card"><div className="stat-label">MP</div><div className="stat-number" style={{fontSize:'1.2rem'}}>{s.mp?.current??'?'}/{s.mp?.max??'?'}</div></div>
      </div>
      {/* Combat stats */}
      <div className="grid-2" style={{marginBottom:16}}>
        <div className="card"><div className="card-header">战斗</div>
          <div style={{fontSize:'.9rem',display:'flex',flexDirection:'column',gap:6}}>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#6b7280'}}>DB</span><span>{s.damage_bonus||'-'}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#6b7280'}}>体格</span><span>{s.build??'-'}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#6b7280'}}>移动</span><span>{s.move_rate??'-'}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#6b7280'}}>闪避</span><span>{s.dodging??'-'}</span></div>
            <div style={{display:'flex',justifyContent:'space-between'}}><span style={{color:'#6b7280'}}>护甲</span><span>{s.armor||'无'}</span></div>
          </div>
        </div>
        <div className="card"><div className="card-header">武器</div>
          {s.weapons && s.weapons.length>0 ? <div style={{fontSize:'.85rem',display:'flex',flexDirection:'column',gap:6}}>
            {s.weapons.map((w,i)=>(
              <div key={i} style={{padding:'6px 8px',background:'#f9fafb',borderRadius:6}}>
                <div style={{fontWeight:500}}>{w.name}</div>
                <div style={{color:'#6b7280',fontSize:'.78rem'}}>{w.skill} · {w.damage}{w.range?` · ${w.range}`:''}</div>
              </div>
            ))}
          </div> : <p style={{color:'#9ca3af',fontSize:'.85rem'}}>无武器数据</p>}
        </div>
      </div>
      {/* Skills */}
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">技能 ({Object.keys(skills).length})</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(150px,1fr))',gap:6}}>
          {Object.entries(skills).length>0 ? Object.entries(skills).map(([k,v])=>(
            <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'4px 8px',background:'#f9fafb',borderRadius:4,fontSize:'.85rem'}}>
              <span>{k}</span><span style={{fontWeight:600}}>{v}%</span>
            </div>
          )) : <p style={{color:'#9ca3af',gridColumn:'1/-1',fontSize:'.85rem'}}>暂无技能数据</p>}
        </div>
      </div>
      {/* Raw */}
      <div className="card">
        <div className="card-header" style={{cursor:'pointer',display:'flex',justifyContent:'space-between'}} onClick={()=>setShowRaw(!showRaw)}>
          <span>Sheet 原始数据</span><span style={{fontSize:'.8rem',color:'#6b7280'}}>{showRaw?'收起':'展开'}</span>
        </div>
        {showRaw && <pre style={{fontSize:'.75rem',overflow:'auto',maxHeight:400,background:'#1a1a2e',color:'#e5e7eb',padding:12,borderRadius:6,marginTop:8}}>{JSON.stringify(s,null,2)}</pre>}
      </div>
    </div>
  );
}
