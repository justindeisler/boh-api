import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  IEventRepository,
  EventFilter,
} from '../../../domain/repositories/event.repository.interface';
import { Event, EventStatus, EventType } from '../../../domain/entities/event.entity';

@Injectable()
export class EventRepository implements IEventRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({ where: { id } });
    return event ? this.toDomain(event) : null;
  }

  async findBySlug(slug: string): Promise<Event | null> {
    const event = await this.prisma.event.findUnique({ where: { slug } });
    return event ? this.toDomain(event) : null;
  }

  async findAll(filter?: EventFilter, skip = 0, take = 20): Promise<Event[]> {
    const where: any = {};

    if (filter) {
      if (filter.status) {
        where.status = filter.status;
      }
      if (filter.eventType) {
        where.category = filter.eventType;
      }
      if (filter.startDateFrom || filter.startDateTo) {
        where.startDate = {};
        if (filter.startDateFrom) {
          where.startDate.gte = filter.startDateFrom;
        }
        if (filter.startDateTo) {
          where.startDate.lte = filter.startDateTo;
        }
      }
      if (filter.search) {
        where.OR = [
          { title: { contains: filter.search, mode: 'insensitive' } },
          { description: { contains: filter.search, mode: 'insensitive' } },
        ];
      }
      if (filter.tags && filter.tags.length > 0) {
        where.tags = { hasSome: filter.tags };
      }
    }

    const events = await this.prisma.event.findMany({
      where,
      skip,
      take,
      orderBy: { startDate: 'asc' },
    });

    return events.map((event) => this.toDomain(event));
  }

  async findByOrganizer(organizerId: string, skip = 0, take = 20): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { organizerId },
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
    return events.map((event) => this.toDomain(event));
  }

  async create(eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event> {
    const event = await this.prisma.event.create({
      data: {
        title: eventData.title,
        slug: eventData.slug,
        description: eventData.description,
        category: (eventData.category || eventData.eventType) as any,
        status: eventData.status || 'DRAFT',
        startDate: eventData.startDate,
        endDate: eventData.endDate,
        price: eventData.price || eventData.basePrice || 0,
        currency: eventData.currency || 'EUR',
        capacity: eventData.capacity || eventData.totalTickets || 0,
        bookedCount: eventData.bookedCount || 0,
        imageUrl: eventData.imageUrl || eventData.featuredImage,
        videoUrl: eventData.videoUrl,
        organizerId: eventData.organizerId,
        venueId: eventData.venueId,
        publishedAt: eventData.publishedAt,
        tags: eventData.tags || [],
      },
    });
    return this.toDomain(event);
  }

  async update(id: string, data: Partial<Event>): Promise<Event> {
    const updateData: any = {};

    if (data.title) updateData.title = data.title;
    if (data.slug) updateData.slug = data.slug;
    if (data.description) updateData.description = data.description;
    if (data.shortDescription) updateData.shortDescription = data.shortDescription;
    if (data.eventType) updateData.category = data.eventType;
    if (data.status) updateData.status = data.status;
    if (data.startDate) updateData.startDate = data.startDate;
    if (data.endDate) updateData.endDate = data.endDate;
    if (data.timezone) updateData.timezone = data.timezone;
    if (data.basePrice !== undefined) updateData.price = data.basePrice;
    if (data.currency) updateData.currency = data.currency;
    if (data.totalTickets !== undefined) updateData.capacity = data.totalTickets;
    if (data.featuredImage) updateData.imageUrl = data.featuredImage;
    if (data.videoUrl) updateData.videoUrl = data.videoUrl;
    if (data.gallery) updateData.gallery = data.gallery;
    if (data.tags) updateData.tags = data.tags;
    if (data.metaTitle) updateData.metaTitle = data.metaTitle;
    if (data.metaDescription) updateData.metaDescription = data.metaDescription;
    if (data.publishedAt !== undefined) updateData.publishedAt = data.publishedAt;

    const event = await this.prisma.event.update({
      where: { id },
      data: updateData,
    });
    return this.toDomain(event);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.event.delete({ where: { id } });
  }

  async count(filter?: EventFilter): Promise<number> {
    const where: any = {};

    if (filter) {
      if (filter.status) {
        where.status = filter.status;
      }
      if (filter.eventType) {
        where.category = filter.eventType;
      }
      if (filter.tags && filter.tags.length > 0) {
        where.tags = { hasSome: filter.tags };
      }
    }

    return this.prisma.event.count({ where });
  }

  private toDomain(event: any): Event {
    return new Event(
      event.id,
      event.title,
      event.slug,
      event.description,
      event.category as EventType,
      event.status as EventStatus,
      event.startDate,
      event.endDate,
      Number(event.price),
      event.capacity - event.bookedCount, // availableTickets
      event.capacity, // totalTickets
      event.organizerId,
      event.venueId,
      event.shortDescription,
      event.timezone,
      event.currency,
      event.imageUrl,
      event.gallery,
      event.tags,
      event.metaTitle,
      event.metaDescription,
      event.createdAt,
      event.updatedAt,
      event.publishedAt,
    );
  }
}
