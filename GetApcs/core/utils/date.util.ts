// Date utility
export class DateUtil {
  static getCurrentDate(): string {
    return new Date().toISOString().split('T')[0];
  }
}