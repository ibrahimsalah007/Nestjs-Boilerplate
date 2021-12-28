import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { FilterQuery, Model } from 'mongoose';

import { CreateUserDto, UpdateUserDto, UserResponse } from './dto/';
import { User } from './schemas/user.schema';

@Injectable()
export default class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    const users = this.userModel.find().exec();

    return users;
  }

  async findOne(options: FilterQuery<User>): Promise<User> {
    const user = this.userModel.findOne(options);

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = this.userModel.findById(id);

    if (!user)
      throw new NotFoundException(`User with given ${id} is not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    const updatedUser = this.userModel.findByIdAndUpdate(id, updateUserDto);

    return updatedUser;
  }

  async remove(id: string): Promise<void> {
    await this.findById(id);

    await this.userModel.findByIdAndDelete(id);

    return;
  }

  userResponseBuilder(user: User): UserResponse {
    return {
      _id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
}
