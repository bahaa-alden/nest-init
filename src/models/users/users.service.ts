import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserImage } from './entities';
import { ROLE } from '../../common/enums';
import { CloudinaryService } from '../../shared/cloudinary';
import { checkIfExist } from '../../common/helpers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserImage)
    private userImageRepository: Repository<UserImage>,
    private cloudinaryService: CloudinaryService,
  ) {}

  findAll(user: User) {
    if (user.role.name === ROLE.SUPER_ADMIN || user.role.name === ROLE.ADMIN) {
      return this.userRepository.find({ withDeleted: true });
    }
    return this.userRepository.find();
  }

  findById(id: string) {
    return this.userRepository.findOne({
      where: { id },
      relations: { role: true, images: true },
    });
  }

  async delete(id: string) {
    return this.userRepository.softDelete(id);
  }

  async recover(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      withDeleted: true,
    });

    if (!user) throw new NotFoundException('user not found');
    await this.userRepository.recover(user);
    return user;
  }

  async updateMe(dto: UpdateUserDto, user: User) {
    if (dto.photo) user.images.push(await this.updatePhoto(dto.photo));
    Object.assign(user, { email: dto.email, name: dto.name });
    await this.userRepository.save(user);
    return this.findById(user.id);
  }

  async deleteMe(user: User) {
    return await this.userRepository.softDelete(user.id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);
    if (dto.photo) user.images.push(await this.updatePhoto(dto.photo));
    Object.assign(user, {
      email: dto.email,
      name: dto.name,
    });
    await this.userRepository.save(user);
    return user;
  }

  async updatePhoto(url: string) {
    const res = await checkIfExist(url);
    const uploaded = await this.cloudinaryService.uploadSingleImage(res);
    const photo = this.userImageRepository.create({
      ...uploaded,
    });
    return photo;
  }
}
