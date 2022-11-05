import { Publisher, Subjects, TicketCreatedEvent } from '@gettix_ma/common'

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	subject: Subjects.TicketCreated = Subjects.TicketCreated
}
