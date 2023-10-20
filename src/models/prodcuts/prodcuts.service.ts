import { Injectable } from '@nestjs/common';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';

@Injectable()
export class ProdcutsService {
  create(createProdcutDto: CreateProdcutDto) {
    return 'This action adds a new prodcut';
  }

  findAll() {
    return `This action returns all prodcuts`;
  }

  findOne(id: number) {
    return `This action returns a #${id} prodcut`;
  }

  update(id: number, updateProdcutDto: UpdateProdcutDto) {
    return `This action updates a #${id} prodcut`;
  }

  remove(id: number) {
    return `This action removes a #${id} prodcut`;
  }
}
