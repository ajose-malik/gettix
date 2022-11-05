import { Publisher, Subjects, TicketUpdatedEvent } from '@gettix_ma/common'

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	subject: Subjects.TicketUpdated = Subjects.TicketUpdated
}
