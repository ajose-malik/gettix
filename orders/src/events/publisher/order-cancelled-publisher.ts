import { Publisher, Subjects, OrderCancelledEvent } from '@gettix_ma/common'

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	subject: Subjects.OrderCancelled = Subjects.OrderCancelled
}
