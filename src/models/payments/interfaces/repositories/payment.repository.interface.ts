import { Payment } from '../../entities/payment.entity';

export interface IPaymentRepository {
  find(): Promise<Payment[]>;
}
