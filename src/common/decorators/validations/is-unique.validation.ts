import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { DataSource } from 'typeorm';

@ValidatorConstraint({ name: 'isUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}
  async validate(value: any, args: ValidationArguments) {
    return this.dataSource
      .getRepository(args.constraints[0])
      .findOne({
        where: {
          [args.property]: value,
        },
        withDeleted: true,
      })
      .then((entity) => {
        if (entity)
          throw new BadRequestException(
            `${args.constraints[0]} already exist ${
              entity.deletedAt
                ? `but deleted at ${entity.deletedAt} make a recover request`
                : ''
            }`,
          );
        return true;
      });
  }
}

export function IsUnique(
  entity: string,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [entity],
      validator: IsUniqueConstraint,
    });
  };
}
