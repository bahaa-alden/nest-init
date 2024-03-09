import { Entity } from 'typeorm';
import { GlobalEntity } from '../../../common/entities';

@Entity('payments')
export class Payment extends GlobalEntity {}
