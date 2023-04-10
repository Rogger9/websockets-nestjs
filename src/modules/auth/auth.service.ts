import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash, validateHash } from 'src/utils/encrypt';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';
import { JwtPayload } from './interfaces/payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register({ name, password }: RegisterDto) {
    const hash = await createHash(password);
    const user = this.userRepository.create({ name, password: hash });
    await this.userRepository.save(user);
    return { user, message: 'User created' };
  }

  async login({ name, password }: LoginDto) {
    const user = await this.userRepository.findOne({
      where: { name },
      select: { name: true, password: true },
    });
    const isMatchPass = !!user && (await validateHash(password, user.password));

    if (!user || !isMatchPass)
      throw new UnauthorizedException('Invalid credentials');

    const token = this.generateToken({ id: user.id });
    delete user.password;

    return { user, token };
  }

  generateToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
