import { Injectable } from '@nestjs/common';
import { City, UpdateCityDto } from '..';
import { Repository, DataSource, FindOptionsRelations, In } from 'typeorm';

@Injectable()
export class CityRepository extends Repository<City> {
  constructor(private readonly dataSource: DataSource) {
    super(City, dataSource.createEntityManager());
  }

  async findAll(ids?: string[]) {
    let cities = this.createQueryBuilder('city');
    cities = ids ? cities.andWhereInIds(ids) : cities;

    return cities.getMany();
  }

  async findById(
    id: string,
    withDeleted = false,
    relations?: FindOptionsRelations<City>,
  ) {
    return this.findOne({
      where: { id },
      withDeleted,
      relations,
    });
  }
  async findForDeleteById(id: string, withDeleted = false) {
    return this.findOne({
      where: { id, stores: { products: { is_paid: false } } },
      relations: {
        stores: { products: true },
      },
      withDeleted,
    });
  }
  async updateOne(city: City, dto: UpdateCityDto) {
    Object.assign(city, dto);
    await city.save();
    return this.findById(city.id);
  }
}
