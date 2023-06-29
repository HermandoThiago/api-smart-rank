import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Players')
@Controller('api/v1/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @ApiOperation({ description: 'Find all players' })
  @Get()
  async findAll(@Query('email') email: string) {
    return await this.playerService.findAll(email);
  }

  @ApiOperation({ description: 'Create a new player' })
  @Post()
  async createAndUpdate(@Body() payload: CreatePlayerDto) {
    return await this.playerService.createAndUpdatePlayer(payload);
  }

  @ApiOperation({ description: 'Delete player by id' })
  @Delete(':playerId')
  async delete(@Param('playerId') playerId: string) {
    return await this.playerService.delete(playerId);
  }
}
