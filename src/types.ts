// src/types.ts
export type Entry = {
  id: string;
  text?: string;            // backend uses "text"
  raw_text?: string;        // some places use "raw_text"
  user_email: string;
  timestamp: string;
  tone?: string;
  emotion?: string;
  overall_tone?: string;
  key_ideas?: string[];
  insight?: string;
  dig_deep?: string;
  reflection?: string;
  embedding?: number[];
};
