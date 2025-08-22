interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimit {
  private store: RateLimitStore = {};
  private windowMs: number;
  private maxRequests: number;

  constructor(windowMs: number = 15 * 60 * 1000, maxRequests: number = 100) {
    this.windowMs = windowMs;
    this.maxRequests = maxRequests;
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;

    // Clean up expired entries
    Object.keys(this.store).forEach(k => {
      if (this.store[k].resetTime < now) {
        delete this.store[k];
      }
    });

    if (!this.store[key]) {
      this.store[key] = {
        count: 1,
        resetTime: now + this.windowMs
      };
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: this.store[key].resetTime
      };
    }

    const entry = this.store[key];
    
    if (entry.resetTime < now) {
      // Reset the window
      entry.count = 1;
      entry.resetTime = now + this.windowMs;
      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime: entry.resetTime
      };
    }

    if (entry.count >= this.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      };
    }

    entry.count++;
    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime
    };
  }
}

// Rate limiters for different endpoints
export const authRateLimit = new RateLimit(15 * 60 * 1000, 5); // 5 attempts per 15 minutes
export const apiRateLimit = new RateLimit(60 * 1000, 60); // 60 requests per minute
export const contentRateLimit = new RateLimit(5 * 60 * 1000, 50); // 30 requests per 5 minutes

export function getRealIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (real) {
    return real.trim();
  }
  
  return 'unknown';
}