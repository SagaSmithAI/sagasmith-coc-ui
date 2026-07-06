import { useState, useEffect } from 'react';
import { listScenes } from '../lib/api';
import type { ScenarioScene } from '../types';
const TYPE_EMOJI: Record<string,string> = {investigation:'🔍',social:'💬',combat:'⚔️',chase:'🏃',travel:'🚂',reference:'📖',handout:'📄',solo_node:'🎲'};

export default function ScenarioIndex({ campaignId: propId }: { campaignId?: string }) {
  const [scenes, setScenes] = useState<ScenarioScene[]>([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const id = propId || (typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('campaign') : '');
  useEffect(() => { if(id) listScenes(id).then(setScenes).catch(()=>{}); }, [id]);
  const types = [...new Set(scenes.map(s=>s.scene_type))];
  const filtered = scenes.filter(s => (filter==='all'||s.scene_type===filter) && (!search||s.title.toLowerCase().includes(search.toLowerCase())));
  const byMod: Record<string,ScenarioScene[]> = {};
  filtered.forEach(s => { const k = s.module||'未知'; if(!byMod[k]) byMod[k]=[]; byMod[k].push(s); });

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:16,flexWrap:'wrap'}}>
        <button className={`btn btn-sm ${filter==='all'?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter('all')}>全部</button>
        {types.map(t => <button key={t} className={`btn btn-sm ${filter===t?'btn-primary':'btn-ghost'}`} onClick={()=>setFilter(t)}>{TYPE_EMOJI[t]||'📄'} {t}</button>)}
        <input placeholder="搜索场景..." value={search} onChange={e=>setSearch(e.target.value)}
          style={{marginLeft:'auto',padding:'6px 12px',borderRadius:6,border:'1px solid #e5e7eb',fontSize:'.85rem',width:200}}/>
      </div>
      {Object.entries(byMod).map(([mod,ss]) => (
        <div key={mod} className="card" style={{marginBottom:12,padding:0}}>
          <div style={{padding:'12px 16px',borderBottom:'1px solid #e5e7eb',fontWeight:600,fontSize:'.9rem'}}>📂 {mod} · {ss.length}</div>
          <div style={{padding:'8px 0'}}>
            {ss.map((s,i) => (
              <div key={s.scene_id||i} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 16px',borderBottom:i<ss.length-1?'1px solid #f3f4f6':'none',cursor:'pointer',fontSize:'.88rem'}}
                onClick={() => {
                  const msg = [`场景: ${s.title}`,`类型: ${s.scene_type}`,`⻅解度: ${s.visibility}`];
                  if(s.clues?.length) msg.push(`\n线索: ${s.clues.map(c=>c.title).join(', ')}`);
                  if(s.sanity?.length) msg.push(`\nSAN: ${s.sanity.map(x=>x.expression).join(', ')}`);
                  if(s.checks?.length) msg.push(`\n检定: ${s.checks.map(c=>`${c.title}${c.difficulty?` [${c.difficulty}]`:''}`).join(', ')}`);
                  alert(msg.join('\n'));
                }}>
                <span>{TYPE_EMOJI[s.scene_type]||'📄'}</span>
                <div style={{flex:1}}>
                  <div>{s.title}</div>
                  <div style={{fontSize:'.75rem',color:'#9ca3af',display:'flex',gap:4,flexWrap:'wrap'}}>
                    <span className="badge badge-gray">{s.scene_type}</span>
                    {s.tags?.map(t => <span key={t} className="tag">{t}</span>)}
                    {s.clues?.length ? <span className="badge badge-purple">🔍×{s.clues.length}</span> : null}
                    {s.sanity?.length ? <span className="badge badge-purple">🧠×{s.sanity.length}</span> : null}
                    {s.page_start && <span>p.{s.page_start}</span>}
                  </div>
                </div>
                <span style={{fontSize:'.75rem',color:s.visibility==='player'?'#059669':s.visibility==='read_aloud'?'#d97706':'#6b7280'}}>{s.visibility==='keeper'?'Keeper':s.visibility==='player'?'Player':'朗读'}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
      {filtered.length===0 && <p style={{color:'#9ca3af',textAlign:'center',padding:40}}>无匹配场景</p>}
    </div>
  );
}
