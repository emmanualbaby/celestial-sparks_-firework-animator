
export interface AnalysisResult {
  text: string;
  timestamp: Date;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  color: string;
  size: number;
  decay: number;
}

export interface Firework {
  x: number;
  y: number;
  color: string;
  particles: Particle[];
}
