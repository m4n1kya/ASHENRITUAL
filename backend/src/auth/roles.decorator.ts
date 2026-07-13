import { SetMetadata } from '@nestjs/common';

/** Metadata key used by RolesGuard to read required roles. */
export const ROLES_KEY = 'roles';

/**
 * Decorator that marks a route as requiring specific roles.
 * Usage: @Roles('ADMIN')
 */
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
