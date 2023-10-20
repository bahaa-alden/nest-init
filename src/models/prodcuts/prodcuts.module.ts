import { Module } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { ProdcutsController } from './prodcuts.controller';

@Module({
  controllers: [ProdcutsController],
  providers: [ProdcutsService]
})
export class ProdcutsModule {}
