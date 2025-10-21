import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IUserRepository } from '../../../domain/repositories/user.repository.interface';
import { User, UserRole, UserStatus } from '../../../domain/entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? this.toDomain(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    return user ? this.toDomain(user) : null;
  }

  async findAll(skip = 0, take = 20): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return users.map((user) => this.toDomain(user));
  }

  async create(userData: any): Promise<User> {
    const user = await this.prisma.user.create({
      data: {
        email: userData.email,
        passwordHash: userData.passwordHash,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phone: userData.phone,
        role: userData.role,
        emailVerified: userData.emailVerified,
      },
    });
    return this.toDomain(user);
  }

  async update(id: string, data: any): Promise<User> {
    const updateData: any = {};
    if (data.email) updateData.email = data.email;
    if (data.passwordHash) updateData.passwordHash = data.passwordHash;
    if (data.firstName) updateData.firstName = data.firstName;
    if (data.lastName) updateData.lastName = data.lastName;
    if (data.phone !== undefined) updateData.phone = data.phone;
    if (data.role) updateData.role = data.role;
    if (data.emailVerified !== undefined) updateData.emailVerified = data.emailVerified;

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    return this.toDomain(user);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async count(): Promise<number> {
    return this.prisma.user.count();
  }

  private toDomain(user: any): User {
    return new User(
      user.id,
      user.email,
      user.password,
      user.firstName,
      user.lastName,
      user.role as UserRole,
      user.status as UserStatus,
      user.emailVerified,
      user.phone,
      user.createdAt,
      user.updatedAt,
      user.lastLoginAt,
    );
  }
}
