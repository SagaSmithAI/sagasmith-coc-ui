import { useState, useEffect } from 'react';
import { getCampaign, listInvestigators, listScenes, listSaves, currentScene } from '../lib/api';
import type { Campaign, Investigator, ScenarioScene, SaveSlot } from '../types';

export default function CampaignDetail() {
  const id = typeof window !== 'undefined' ? window.location.pathname.split('/').pop() : '';
  const [cam, setCam] = useState<Campaign|null>(null);
  const [investigators, setInv] = useState<Investigator[]>([]);
  const [scenes, setScenes] = useState<ScenarioScene[]>([]);
  const [saves, setSaves] = useState<SaveSlot[]>([]);
  const [scene, setScene] = useState<any>(null);
  const [tab, setTab] = useState<'overview'|'timeline'>('overview');

  useEffect(() => {
    if (!id) return;
    getCampaign(id).then(setCam).catch(()=>{});
    listInvestigators(id).then(setInv).catch(()=>{});
    listScenes(id).then(setScenes).catch(()=>{});
    listSaves(id).then(setSaves).catch(()=>{});
    currentScene(id).then(setScene).catch(()=>{});
  }, [id]);

  if (!cam) return <div style={{padding:40,textAlign:'center',color:'#9ca3af'}}>加载中...</div>;
  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
      <div className="page-header">
        <a href="/campaigns" className="btn btn-ghost btn-sm">←</a>
        <div><h1>🕯️ {cam.name}</h1><div className="subtitle">CoC 7e · Rev {cam.revision}</div></div>
        <span style={{marginLeft:'auto'}} className={`badge ${cam.status==='active'?'badge-green':'badge-gray'}`}>{cam.status==='active'?'进行中':cam.status}</span>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginBottom:16}}>
        <div className="card">
          <div className="card-header">调查员 ({investigators.length})</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {investigators.slice(0,8).map(i => (
              <a key={i.id} href={`/characters/${i.id}`} style={{display:'flex',alignItems:'center',gap:8,padding:'8px 10px',borderRadius:6,background:'#f9fafb',textDecoration:'none',color:'inherit',fontSize:'.9rem'}}>
                <span>🕵️</span><span style={{fontWeight:500}}>{i.name}</span>
                <span style={{fontSize:'.8rem',color:'#6b7280'}}>{i.sheet?.occupation||(i as any).occupation||''}</span>
              </a>
            ))}
            {investigators.length===0 && <p style={{color:'#9ca3af',fontSize:'.85rem',padding:'8px 0'}}>暂无调查员</p>}
          </div>
        </div>
        <div className="card">
          <div className="card-header">模组 ({scenes.length} 场景)</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {[...new Set(scenes.map(s=>s.module||'未知'))].map(m => (
              <div key={m} style={{padding:'8px 10px',borderRadius:6,background:'#f9fafb',fontSize:'.9rem'}}>📖 {m}</div>
            ))}
            {scenes.length===0 && <p style={{color:'#9ca3af',fontSize:'.85rem',padding:'8px 0'}}>暂无导入情景</p>}
          </div>
        </div>
      </div>
      {scene && scene.title && (
        <div className="card" style={{marginBottom:16}}>
          <div className="card-header">当前场景 · scope: {scene.scope_id||scene.scope||'party'}</div>
          <div style={{fontSize:'.9rem',marginBottom:4}}>📍 {scene.title}</div>
          {scene.progress?.progress !== undefined && (
            <div><div style={{display:'flex',justifyContent:'space-between',fontSize:'.8rem',color:'#6b7280',marginBottom:4}}><span>进度</span><span>{scene.progress.progress}%</span></div>
            <div className="progress-bar"><div className="progress-fill" style={{width:`${scene.progress.progress}%`}}/></div></div>
          )}
        </div>
      )}
      <div style={{display:'flex',gap:0,borderBottom:'2px solid #e5e7eb'}}>
        {(['overview','timeline'] as const).map(t => (
          <button key={t} onClick={()=>setTab(t)} style={{padding:'10px 20px',border:'none',background:'transparent',cursor:'pointer',fontWeight:tab===t?600:400,color:tab===t?'#7c3aed':'#6b7280',borderBottom:tab===t?'2px solid #7c3aed':'2px solid transparent',marginBottom:-2,transition:'all .15s'}}>
            {t==='overview'?'概览':'存档时间线'}
          </button>
        ))}
      </div>
      {tab==='overview' ? <div style={{marginTop:16}}><div className="card"><div className="card-header">调查团信息</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:'.85rem'}}>
          <div><span style={{color:'#6b7280'}}>Slug</span><br/>{cam.slug}</div>
          <div><span style={{color:'#6b7280'}}>修订</span><br/>{cam.revision}</div>
          <div><span style={{color:'#6b7280'}}>语⾔</span><br/>{cam.locale==='zh'?'中文':'English'}</div>
        </div></div></div>
      : <div style={{marginTop:16}}><div className="card" style={{padding:0}}>
          <div style={{padding:16,borderBottom:'1px solid #e5e7eb',fontSize:'.9rem',fontWeight:600}}>存档 · {saves.length}</div>
          {saves.length===0 ? <div style={{padding:'40px 20px',textAlign:'center',color:'#9ca3af'}}>暂无存档</div>
          : <div style={{padding:20,display:'flex',flexDirection:'column',gap:0,position:'relative'}}>
              <div style={{position:'absolute',left:28,top:20,bottom:20,width:2,background:'#e5e7eb'}}/>
              {saves.map((s,i)=>(
                <div key={s.slot} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'10px 0',position:'relative'}}>
                  <div style={{width:12,height:12,borderRadius:'50%',background:i===0?'#7c3aed':'#d1d5db',border:'2px solid #fff',boxShadow:'0 0 0 2px #e5e7eb',flexShrink:0,marginTop:4,zIndex:1}}/>
                  <div><div style={{fontWeight:500,fontSize:'.9rem'}}>Slot {s.slot}{s.label?` · ${s.label}`:''}</div>
                    <div style={{fontSize:'.78rem',color:'#6b7280'}}>{s.parent_slot?`父存档: Slot ${s.parent_slot}`:'初始存档'}</div></div>
                </div>
              ))}
            </div>}
        </div></div>}
    </div>
  );
}
