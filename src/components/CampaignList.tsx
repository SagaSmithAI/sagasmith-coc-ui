import { useState, useEffect } from 'react';
import { listCampaigns, MOCK } from '../lib/api';
import type { Campaign } from '../types';

export default function CampaignList() {
  const [camps, setCamps] = useState<Campaign[]>([]);
  useEffect(() => { listCampaigns().then(setCamps).catch(() => setCamps(MOCK)); }, []);
  return (
    <div style={{maxWidth:800,margin:'0 auto',padding:'24px 16px'}}>
      <div className="page-header"><a href="/" className="btn btn-ghost btn-sm">←</a><h1>调查团</h1></div>
      <div style={{display:'flex',flexDirection:'column',gap:8}}>
        {camps.map(c => (
          <a key={c.id} href={`/campaigns/${c.id}`} className="card" style={{display:'block',textDecoration:'none',color:'inherit'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div><div style={{fontWeight:600,fontSize:'1rem'}}>🕯️ {c.name}</div>
                <div style={{fontSize:'.82rem',color:'#6b7280'}}>CoC 7e · {c.locale==='zh'?'中文':'English'} · Rev {c.revision}</div></div>
              <span className={`badge ${c.status==='active'?'badge-green':'badge-gray'}`}>{c.status==='active'?'进行中':c.status}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
