import { Publisher, Subjects, ExpirationCompleteEvent } from '@gettix_ma/common'

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete
}
