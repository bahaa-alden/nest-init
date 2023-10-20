import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProdcutsService } from './prodcuts.service';
import { CreateProdcutDto } from './dto/create-prodcut.dto';
import { UpdateProdcutDto } from './dto/update-prodcut.dto';

@Controller('prodcuts')
export class ProdcutsController {
  constructor(private readonly prodcutsService: ProdcutsService) {}

  @Post()
  create(@Body() createProdcutDto: CreateProdcutDto) {
    return this.prodcutsService.create(createProdcutDto);
  }

  @Get()
  findAll() {
    return this.prodcutsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.prodcutsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProdcutDto: UpdateProdcutDto) {
    return this.prodcutsService.update(+id, updateProdcutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.prodcutsService.remove(+id);
  }
}
