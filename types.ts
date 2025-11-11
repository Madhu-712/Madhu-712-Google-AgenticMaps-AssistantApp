export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

// FIX: Make uri and title optional in GroundingChunk.maps to match the type from @google/genai SDK.
// This resolves the TypeScript error in geminiService.ts.
export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
  };
}

export interface TaskResult {
  text: string;
  groundingChunks?: GroundingChunk[];
}

export interface Task {
  id: number;
  description: string;
  status: TaskStatus;
  result?: TaskResult;
}

export interface Geolocation {
  latitude: number;
  longitude: number;
}
