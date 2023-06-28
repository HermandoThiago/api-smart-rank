import { Body, Controller, Get, Post } from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto';

@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @Get()
  async findAll() {
    return await this.playerService.findAll();
  }

  @Post()
  async createAndUpdate(@Body() payload: CreatePlayerDto) {
    return await this.playerService.createAndUpdatePlayer(payload);
  }
}
