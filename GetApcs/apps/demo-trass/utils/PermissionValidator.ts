export class PermissionValidator {
  /**
   * Validates if user has required permission
   */
  static validatePermission(userPermissions: string[], requiredPermission: string): boolean {
    return userPermissions.includes(requiredPermission) || userPermissions.includes('all');
  }

  /**
   * Validates multiple permissions
   */
  static validateMultiplePermissions(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.every(perm => this.validatePermission(userPermissions, perm));
  }

  /**
   * Check if user has any of the permissions
   */
  static hasAnyPermission(userPermissions: string[], requiredPermissions: string[]): boolean {
    return requiredPermissions.some(perm => this.validatePermission(userPermissions, perm));
  }
}