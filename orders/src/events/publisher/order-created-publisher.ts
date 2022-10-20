import { Publisher, Subjects, OrderCreatedEvent } from '@gettix_ma/common'

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	subject: Subjects.OrderCreated = Subjects.OrderCreated
}
