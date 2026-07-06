import { useState, useEffect } from 'react';
import { health, listCampaigns, listInvestigators, listScenes, listSaves, MOCK } from '../lib/api';
import type { Campaign } from '../types';

export default function Dashboard() {
  const [c, setC] = useState<'loading'|'connected'|'disconnected'>('loading');
  const [camps, setCamps] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({ inv:0, sc:0, sv:0 });

  useEffect(() => {
    health().then(() => setC('connected')).catch(() => setC('disconnected'));
    listCampaigns().then(setCamps).catch(() => setCamps(MOCK));
  }, []);

  useEffect(() => {
    camps.forEach(cam => {
      listInvestigators(cam.id).then(v => setStats(s => ({...s, inv: s.inv + v.length}))).catch(()=>{});
      listScenes(cam.id).then(v => setStats(s => ({...s, sc: s.sc + v.length}))).catch(()=>{});
      listSaves(cam.id).then(v => setStats(s => ({...s, sv: s.sv + v.length}))).catch(()=>{});
    });
  }, [camps]);

  return (
    <div style={{maxWidth:1000,margin:'0 auto',padding:'24px 16px'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
        <div><h1 style={{fontSize:'1.5rem',fontWeight:700}}>🕯️ SagaSmith CoC</h1><p style={{fontSize:'.85rem',color:'#6b7280'}}>守秘人控制台</p></div>
        <div style={{display:'flex',alignItems:'center',gap:6,fontSize:'.8rem',color:c==='connected'?'#059669':'#dc2626'}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:c==='connected'?'#059669':'#dc2626'}}/>
          {c==='connected'?'已连接':'API 不可用'}
        </div>
      </div>
      <div className="stat-grid" style={{marginBottom:24}}>
        <div className="stat-card"><div className="stat-number">{camps.length}</div><div className="stat-label">调查团</div></div>
        <div className="stat-card"><div className="stat-number">{stats.inv}</div><div className="stat-label">调查员</div></div>
        <div className="stat-card"><div className="stat-number">{stats.sc}</div><div className="stat-label">场景</div></div>
        <div className="stat-card"><div className="stat-number">{stats.sv}</div><div className="stat-label">存档</div></div>
      </div>
      <div className="card" style={{marginBottom:16}}>
        <div className="card-header">调查团列表</div>
        {camps.length===0?<p style={{color:'#9ca3af',padding:'20px 0',textAlign:'center'}}>暂无调查团</p>
        :<div style={{display:'flex',flexDirection:'column',gap:8}}>
          {camps.map(cam=>(
            <a key={cam.id} href={`/campaigns/${cam.id}`} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 16px',borderRadius:8,background:'#f9fafb',textDecoration:'none',color:'inherit'}}>
              <div><div style={{fontWeight:600}}>🕯️ {cam.name}</div><div style={{fontSize:'.8rem',color:'#6b7280'}}>CoC 7e · {cam.locale==='zh'?'中文':'EN'} · Rev {cam.revision}</div></div>
              <span className={`badge ${cam.status==='active'?'badge-green':'badge-gray'}`}>{cam.status==='active'?'进行中':cam.status}</span>
            </a>
          ))}
        </div>}
      </div>
      <div className="card">
        <div className="card-header">快速操作</div>
        <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
          <a href="/campaigns" className="btn btn-primary">管理调查团</a>
        </div>
      </div>
    </div>
  );
}
