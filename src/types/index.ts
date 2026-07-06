export interface Campaign {
  id: string; name: string; slug: string; system_id: string;
  edition?: string; locale?: string; status: string;
  description: string; settings: Record<string, unknown>;
  state: Record<string, unknown>; revision: number;
}

export interface Investigator {
  id: string; campaign_id?: string; name: string;
  character_type: string; player_name?: string;
  summary: string; sheet: CocSheet; notes: Record<string, unknown>;
  revision: number;
}

export interface CocSheet {
  occupation?: string;
  attributes: { str: number; con: number; siz: number; dex: number; app: number; int: number; pow: number; edu: number };
  hp: { current: number; max: number };
  san: { current: number; max: number; starting: number };
  luck: number; mp: { current: number; max: number };
  move_rate: number; damage_bonus: string; build: number;
  dodging: number; armor?: string;
  skills: Record<string, number>;
  weapons?: CocWeapon[];
  possessions?: string[];
  cash?: { spending: number; assets: number };
  backstory?: { description: string; ideology: string; significant_people: string; meaningful_locations: string; treasured_possessions: string; traits: string; injuries: string; phobias: string; arcane_tomes: string; encounters: string };
}

export interface CocWeapon {
  name: string; skill: string; damage: string; range?: string;
  attacks?: number; ammunition?: number; malfunction?: number;
}

export interface ScenarioScene {
  scene_id: string; title: string; module: string; chapter: string;
  scene_type: string; visibility: string;
  page_start?: number; page_end?: number;
  clues?: ClueInfo[]; checks?: CheckInfo[];
  sanity?: SanityInfo[]; subsections?: SubsectionInfo[];
  tags: string[]; headings: string[];
  content?: string;
}

export interface ClueInfo { title: string; line: number; type: string; }
export interface CheckInfo { title: string; line: number; difficulty?: string; }
export interface SanityInfo { expression: string; success_loss: string; failure_loss: string; }
export interface SubsectionInfo { title: string; line: number; type: string; }

export interface SceneProgress {
  scene_id: string; scope_id: string; status: string;
  progress: number; current_room?: string;
  state_version: number; state: Record<string, unknown>;
}

export interface SaveSlot { slot: number; label: string; parent_slot?: number; created_at?: string; }
export interface EventLog { id: string; campaign_id: string; type: string; summary: string; payload: Record<string, unknown>; }

export const ATTRIBUTE_LABELS: Record<string, string> = {
  str: '力量', con: '体质', siz: '体型', dex: '敏捷',
  app: '外貌', int: '智力', pow: '意志', edu: '教育',
};
export const ATTRIBUTE_EN: Record<string, string> = {
  str: 'STR', con: 'CON', siz: 'SIZ', dex: 'DEX',
  app: 'APP', int: 'INT', pow: 'POW', edu: 'EDU',
};
