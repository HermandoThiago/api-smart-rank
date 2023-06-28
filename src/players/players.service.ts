import { Injectable, Logger } from '@nestjs/common';
import { CreatePlayerDto } from './dto';
import { Player } from './interfaces';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private logger = new Logger(PlayersService.name);

  async findAll() {
    return this.players;
  }

  async createAndUpdatePlayer(payload: CreatePlayerDto) {
    const createdPlayer = await this.create(payload);

    return createdPlayer;
  }

  private async create(payload: CreatePlayerDto) {
    const { name, phoneNumber, email } = payload;

    const _id = this.players.length + 1;

    const player: Player = {
      _id: _id.toString(),
      name,
      phoneNumber,
      email,
      ranking: 'A',
      rankingPosition: 1,
      urlPhoto: 'https://localhost:3000/photo',
    };

    this.players.push(player);

    this.logger.log(`Create player ${name} with email ${email}`);
    this.logger.verbose({ player });

    return player;
  }
}
