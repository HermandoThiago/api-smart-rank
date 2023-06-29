import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto';
import { Player } from './interfaces';

@Injectable()
export class PlayersService {
  private players: Player[] = [];

  private logger = new Logger(PlayersService.name);

  async findAll(email?: string) {
    if (email) return this.findByEmail(email);

    return this.players;
  }

  async createAndUpdatePlayer(payload: CreatePlayerDto) {
    const { email } = payload;

    const playerIsExist = this.players.find((player) => player.email === email);

    if (playerIsExist) {
      const updatedPlayer = this.update(playerIsExist, payload);

      return updatedPlayer;
    }

    const createdPlayer = await this.create(payload);

    return createdPlayer;
  }

  async delete(playerId: string) {
    const existsPlayer = this.players.find((player) => player._id === playerId);

    if (!existsPlayer)
      throw new NotFoundException(`Player with id ${playerId} not found!`);

    const updatedPlayers = this.players.filter(
      (player) => player._id !== playerId,
    );

    this.players = updatedPlayers;

    this.logger.log(`Player with id ${playerId} has been removed!`);
  }

  private async findByEmail(email: string) {
    const existsPlayer = this.players.find((player) => player.email === email);

    if (!existsPlayer)
      throw new NotFoundException(`Player with email: ${email} not found`);

    return existsPlayer;
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

  private async update(existsPlayer: Player, updatePlayer: CreatePlayerDto) {
    const { name } = updatePlayer;

    existsPlayer.name = name;

    this.logger.log(`Player with id ${existsPlayer._id} has been updated.`);
    this.logger.verbose({ updatePlayer });

    return existsPlayer;
  }
}
