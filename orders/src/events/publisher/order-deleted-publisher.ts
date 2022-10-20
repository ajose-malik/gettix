import { Publisher, Subjects, OrderDeletedEvent } from '@gettix_ma/common'

export class OrderDeletedPublisher extends Publisher<OrderDeletedEvent> {
	subject: Subjects.OrderDeleted = Subjects.OrderDeleted
}
