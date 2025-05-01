import { Delete, Get } from '@nestjs/common';

export class BaseController<T> {
  constructor(private readonly service: any) {}

  @Get()
  async findAll(): Promise<T[]> {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(id: string): Promise<T> {
    return this.service.findOne(id);
  }

  @Delete(':id')
  async remove(id: string): Promise<void> {
    return this.service.remove(id);
  }
}
