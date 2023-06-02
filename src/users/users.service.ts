import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async updateUser(userId: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new NotFoundException({ message: 'User not found' });
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });
    const { password, ...res } = updatedUser;
    return res;
  }
}
