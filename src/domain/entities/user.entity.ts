export enum UserRole {
  USER = 'USER',
  ORGANIZER = 'ORGANIZER',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export class User {
  constructor(
    public readonly id: string,
    public email: string,
    public password: string,
    public firstName: string,
    public lastName: string,
    public role: UserRole,
    public status: UserStatus,
    public emailVerified: boolean,
    public phone?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public lastLoginAt?: Date,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.email || !this.isValidEmail(this.email)) {
      throw new Error('Invalid email address');
    }
    if (!this.firstName || this.firstName.length < 2) {
      throw new Error('First name must be at least 2 characters');
    }
    if (!this.lastName || this.lastName.length < 2) {
      throw new Error('Last name must be at least 2 characters');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  isOrganizer(): boolean {
    return this.role === UserRole.ORGANIZER;
  }

  isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  canManageEvents(): boolean {
    return this.role === UserRole.ADMIN || this.role === UserRole.ORGANIZER;
  }

  updateLastLogin(): void {
    this.lastLoginAt = new Date();
  }
}
