import { Publisher, Subjects, PaymentCreatedEvent } from '@gettix_ma/common'

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	subject: Subjects.PaymentCreated = Subjects.PaymentCreated
}
