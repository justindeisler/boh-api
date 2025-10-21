import { Event, EventStatus, EventType } from '../entities/event.entity';

export interface EventFilter {
  status?: EventStatus;
  eventType?: EventType;
  startDateFrom?: Date;
  startDateTo?: Date;
  search?: string;
  tags?: string[];
}

export interface IEventRepository {
  findById(id: string): Promise<Event | null>;
  findBySlug(slug: string): Promise<Event | null>;
  findAll(filter?: EventFilter, skip?: number, take?: number): Promise<Event[]>;
  findByOrganizer(organizerId: string, skip?: number, take?: number): Promise<Event[]>;
  create(event: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>): Promise<Event>;
  update(id: string, data: Partial<Event>): Promise<Event>;
  delete(id: string): Promise<void>;
  count(filter?: EventFilter): Promise<number>;
}

export const EVENT_REPOSITORY = Symbol('EVENT_REPOSITORY');
