import { Entity } from 'typeorm';
import { GlobalEntity } from '../../../common';

@Entity({ name: 'products' })
export class Product extends GlobalEntity {}
