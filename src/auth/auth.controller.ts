import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { Request } from 'express';

import { UserResponse } from '../user/dto/';
import AuthService from './auth.service';
import RegisterDto from './dto/request/register.dto';
import { JwtAuthenticationGuard } from '../common/guards/jwt-authentication.guard';
import { LocalAuthenticationGuard } from './guards';

@Controller('auth')
export default class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async register(@Body() registerDto: RegisterDto): Promise<UserResponse> {
    return this.authService.signUp(registerDto);
  }

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthenticationGuard)
  @Post('login')
  async login(@Req() request: Request) {
    const user = request.user;

    return this.authService.login(user);
  }

  @UseGuards(JwtAuthenticationGuard)
  @HttpCode(HttpStatus.OK)
  @Post('test')
  async test(@Req() request: Request) {
    const user = request.user;
    return user;
  }
}
