import { Payment } from '../../entities/payment.entity';

export interface IPaymentsService {
  find(): Promise<Payment>;
}
