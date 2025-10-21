export enum EventStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum EventType {
  CONCERT = 'CONCERT',
  CONFERENCE = 'CONFERENCE',
  WORKSHOP = 'WORKSHOP',
  SPORTS = 'SPORTS',
  FESTIVAL = 'FESTIVAL',
  EXHIBITION = 'EXHIBITION',
  OTHER = 'OTHER',
}

export class Event {
  constructor(
    public readonly id: string,
    public title: string,
    public slug: string,
    public description: string,
    public eventType: EventType,
    public status: EventStatus,
    public startDate: Date,
    public endDate: Date,
    public basePrice: number,
    public availableTickets: number,
    public totalTickets: number,
    public organizerId: string,
    public venueId: string,
    public shortDescription?: string,
    public timezone?: string,
    public currency?: string,
    public featuredImage?: string,
    public gallery?: any,
    public tags?: string[],
    public metaTitle?: string,
    public metaDescription?: string,
    public createdAt?: Date,
    public updatedAt?: Date,
    public publishedAt?: Date,
    // New schema fields (aliases)
    public category?: EventType,
    public price?: number,
    public capacity?: number,
    public bookedCount?: number,
    public imageUrl?: string,
    public videoUrl?: string,
  ) {
    this.validate();
  }

  private validate(): void {
    if (!this.title || this.title.length < 3) {
      throw new Error('Title must be at least 3 characters');
    }
    if (!this.description || this.description.length < 10) {
      throw new Error('Description must be at least 10 characters');
    }
    if (this.startDate >= this.endDate) {
      throw new Error('Start date must be before end date');
    }
    if (this.basePrice < 0) {
      throw new Error('Base price cannot be negative');
    }
    if (this.availableTickets < 0 || this.availableTickets > this.totalTickets) {
      throw new Error('Invalid available tickets count');
    }
  }

  isPublished(): boolean {
    return this.status === EventStatus.PUBLISHED;
  }

  isCancelled(): boolean {
    return this.status === EventStatus.CANCELLED;
  }

  isCompleted(): boolean {
    return this.status === EventStatus.COMPLETED;
  }

  isSoldOut(): boolean {
    return this.availableTickets === 0;
  }

  hasTicketsAvailable(): boolean {
    return this.availableTickets > 0;
  }

  canBookTickets(quantity: number): boolean {
    return (
      this.isPublished() &&
      !this.isSoldOut() &&
      this.availableTickets >= quantity &&
      this.startDate > new Date()
    );
  }

  reserveTickets(quantity: number): void {
    if (!this.canBookTickets(quantity)) {
      throw new Error('Cannot reserve tickets for this event');
    }
    this.availableTickets -= quantity;
  }

  releaseTickets(quantity: number): void {
    this.availableTickets += quantity;
    if (this.availableTickets > this.totalTickets) {
      this.availableTickets = this.totalTickets;
    }
  }

  publish(): void {
    if (this.status !== EventStatus.DRAFT) {
      throw new Error('Only draft events can be published');
    }
    this.status = EventStatus.PUBLISHED;
    this.publishedAt = new Date();
  }

  cancel(): void {
    if (this.status === EventStatus.COMPLETED) {
      throw new Error('Cannot cancel completed events');
    }
    this.status = EventStatus.CANCELLED;
  }
}
