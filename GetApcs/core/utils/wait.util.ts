// Wait utility
export class WaitUtil {
  static async wait(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}