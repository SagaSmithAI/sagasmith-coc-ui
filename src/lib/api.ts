import type { Campaign, Investigator, ScenarioScene, SaveSlot } from '../types';
const API = 'http://127.0.0.1:3001';
async function g<T>(p: string): Promise<T> { const r = await fetch(`${API}${p}`); if (!r.ok) throw new Error(`${r.status}`); return r.json(); }
export function health() { return g<{status:string;version:string;dense:boolean}>('/api/health'); }
export function listCampaigns() { return g<Campaign[]>('/api/campaigns'); }
export function getCampaign(id: string) { return g<Campaign>(`/api/campaigns/${id}`); }
export function listInvestigators(cId: string) { return g<Investigator[]>(`/api/campaigns/${cId}/investigators`); }
export function getInvestigator(id: string) { return g<Investigator>(`/api/investigators/${id}`); }
export function listScenes(cId: string) { return g<ScenarioScene[]>(`/api/campaigns/${cId}/scenes`); }
export function currentScene(cId: string, s = 'party') { return g(`/api/campaigns/${cId}/current-scene?scope=${s}`); }
export function listSaves(cId: string) { return g<SaveSlot[]>(`/api/campaigns/${cId}/saves`); }
export const MOCK: Campaign[] = [
  { id:'c1', name:'阿卡姆疑云', slug:'arkham', system_id:'coc7e', edition:'7e', locale:'zh', status:'active', description:'', settings:{}, state:{}, revision:6 },
  { id:'c2', name:'敦威治恐怖', slug:'dunwich', system_id:'coc7e', edition:'7e', locale:'en', status:'active', description:'', settings:{}, state:{}, revision:4 },
];
