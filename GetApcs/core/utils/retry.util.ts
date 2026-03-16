// Retry utility
export class RetryUtil {
  static async retry<T>(fn: () => Promise<T>, attempts: number): Promise<T> {
    // Retry logic
    return fn();
  }
}