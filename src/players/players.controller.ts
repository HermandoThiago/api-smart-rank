import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto, UpdatePlayerDto } from './dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('players')
@Controller('/players')
export class PlayersController {
  constructor(private readonly playerService: PlayersService) {}

  @ApiOperation({ description: 'Find all players' })
  @ApiResponse({ status: 200, description: 'Successful search' })
  @Get()
  async findAll() {
    return await this.playerService.findAll();
  }

  @ApiOperation({ description: 'Find player by id' })
  @ApiResponse({ status: 200, description: 'Successful search' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Get(':playerId')
  async findByEmail(@Param('playerId') playerId: string) {
    return await this.playerService.findById(playerId);
  }

  @ApiOperation({ description: 'Create a new player' })
  @ApiResponse({ status: 201, description: 'Player created successfully' })
  @Post()
  async create(@Body() payload: CreatePlayerDto) {
    return await this.playerService.create(payload);
  }

  @ApiOperation({ description: 'Update player by id' })
  @ApiResponse({ status: 200, description: 'Player updated successfully' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Patch(':playerId')
  async update(
    @Param('playerId') playerId: string,
    @Body() payload: UpdatePlayerDto,
  ) {
    return await this.playerService.update(playerId, payload);
  }

  @ApiOperation({ description: 'Delete player by id' })
  @ApiResponse({ status: 200, description: 'Successfully deleted player' })
  @ApiResponse({ status: 404, description: 'Player not found' })
  @Delete(':playerId')
  async delete(@Param('playerId') playerId: string) {
    return await this.playerService.delete(playerId);
  }
}
