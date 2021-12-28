import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { compare, hash } from 'bcryptjs';

import { UserResponse } from '../user/dto/';
import { LoginResponseDto } from './dto/response/login-response.dto';

import UserService from '../user/user.service';
import RegisterDto from './dto/request/register.dto';
import JwtPayloadDto from './dto/jwt-payload.dto';
import { User } from '../user/schemas/user.schema';

@Injectable()
export default class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  /**
   * @description Signing up a user using RegisterDto
   * @param createUserDto
   * @returns Promise: UserResponse
   */
  async signUp(createUserDto: RegisterDto): Promise<UserResponse> {
    const existingUserWithEmail = await this.usersService.findOne({
      email: createUserDto.email,
    });

    if (existingUserWithEmail)
      throw new ConflictException('email already exists');

    createUserDto.password = await this.hashPassword(createUserDto.password);

    const createdUser = await this.usersService.create(createUserDto);

    return this.usersService.userResponseBuilder(createdUser);
  }

  /**
   * @description Validating user login credentials
   * @param email user`s email
   * @param password user`s password
   * @returns Promise: UserResponse
   */
  async validateUser(email: string, password: string): Promise<UserResponse> {
    const user = await this.usersService.findOne({ email });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isPasswordMatch = await this.comparePassword(password, user.password);

    if (!isPasswordMatch) throw new BadRequestException('Invalid credentials');

    return this.usersService.userResponseBuilder(user);
  }

  /**
   * @description Login service
   * @param user User object
   * @returns Promise: LoginResponseDto
   */
  async login(user: Partial<User>): Promise<LoginResponseDto> {
    const payload: JwtPayloadDto = { id: user._id };

    return {
      accessToken: this.generateToken(payload),
    };
  }

  /**
   * @description Hashing user password
   * @param plainPassword plain text password
   * @returns Promise: string
   */
  async hashPassword(plainPassword): Promise<string> {
    try {
      return hash(plainPassword, 10);
    } catch (err) {
      console.log(err.message);
    }
  }

  /**
   * @description Comparing user hashed password with given plain password
   * @param plainPassword plain text password
   * @param hashedPassword hash
   * @returns Promise:boolean
   */
  async comparePassword(plainPassword, hashedPassword): Promise<boolean> {
    return compare(plainPassword, hashedPassword);
  }

  /**
   * @description Generatea a JWT with given payload
   * @param jwtPayloadDto token payload
   * @returns string
   */
  generateToken(jwtPayloadDto: JwtPayloadDto) {
    return this.jwtService.sign(jwtPayloadDto);
  }
}
