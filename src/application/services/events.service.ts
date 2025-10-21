import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma/prisma.service';
import { CreateEventDto } from '../dtos/events/create-event.dto';
import { EventStatus } from '../../domain/entities/event.entity';
import { Prisma } from '@prisma/client';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(status?: EventStatus, skip = 0, take = 20) {
    const where: any = {};

    if (status) {
      where.status = status;
    } else {
      // Default to published events for public API
      where.status = EventStatus.PUBLISHED;
    }

    const events = await this.prisma.event.findMany({
      where,
      skip,
      take,
      include: {
        venue: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });

    return events;
  }

  async findOne(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        venue: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with ID ${id} not found`);
    }

    return event;
  }

  async findBySlug(slug: string) {
    const event = await this.prisma.event.findUnique({
      where: { slug },
      include: {
        venue: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Event with slug ${slug} not found`);
    }

    return event;
  }

  async create(createEventDto: CreateEventDto, organizerId: string) {
    const event = await this.prisma.event.create({
      data: {
        title: createEventDto.title,
        slug: createEventDto.slug,
        description: createEventDto.description,
        category: createEventDto.category,
        status: EventStatus.DRAFT,
        startDate: new Date(createEventDto.startDate),
        endDate: new Date(createEventDto.endDate),
        price: createEventDto.price,
        capacity: createEventDto.capacity,
        bookedCount: 0,
        organizerId,
        venueId: createEventDto.venueId,
        imageUrl: createEventDto.imageUrl,
        videoUrl: createEventDto.videoUrl,
        tags: createEventDto.tags || [],
      },
      include: {
        venue: true,
        organizer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return event;
  }

  async update(id: string, updateData: Partial<CreateEventDto>) {
    try {
      // First, check if the event exists
      const existingEvent = await this.prisma.event.findUnique({
        where: { id },
      });

      if (!existingEvent) {
        throw new NotFoundException(`Event with ID ${id} not found`);
      }

      // If slug is being updated, check if it's already taken by another event
      if (updateData.slug && updateData.slug !== existingEvent.slug) {
        const slugExists = await this.prisma.event.findUnique({
          where: { slug: updateData.slug },
        });

        if (slugExists) {
          throw new ConflictException(
            `Event with slug '${updateData.slug}' already exists. Please use a different slug.`,
          );
        }
      }

      const event = await this.prisma.event.update({
        where: { id },
        data: {
          title: updateData.title,
          slug: updateData.slug,
          description: updateData.description,
          category: updateData.category,
          startDate: updateData.startDate ? new Date(updateData.startDate) : undefined,
          endDate: updateData.endDate ? new Date(updateData.endDate) : undefined,
          price: updateData.price,
          capacity: updateData.capacity,
          venueId: updateData.venueId,
          imageUrl: updateData.imageUrl,
          videoUrl: updateData.videoUrl,
          tags: updateData.tags,
        },
        include: {
          venue: true,
          organizer: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      return event;
    } catch (error) {
      // Re-throw known errors
      if (
        error instanceof NotFoundException ||
        error instanceof ConflictException
      ) {
        throw error;
      }

      // Handle Prisma errors
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002: Unique constraint violation
        if (error.code === 'P2002') {
          const field = (error.meta?.target as string[])?.[0] || 'field';
          throw new ConflictException(
            `A record with this ${field} already exists. Please use a different value.`,
          );
        }

        // P2025: Record not found
        if (error.code === 'P2025') {
          throw new NotFoundException(`Event with ID ${id} not found`);
        }

        // P2003: Foreign key constraint violation
        if (error.code === 'P2003') {
          const field = error.meta?.field_name as string;
          throw new BadRequestException(
            `Invalid ${field}. The referenced record does not exist.`,
          );
        }
      }

      // Re-throw unexpected errors
      throw error;
    }
  }

  async delete(id: string) {
    await this.prisma.event.delete({ where: { id } });
  }
}
