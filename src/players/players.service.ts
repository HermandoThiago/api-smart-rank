import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePlayerDto } from './dto';
import { Player } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}

  async findAll(email?: string) {
    if (email) return this.findByEmail(email);

    const players = await this.playerModel.find().exec();

    return players;
  }

  async createAndUpdatePlayer(payload: CreatePlayerDto) {
    const { email } = payload;

    const playerIsExist = await this.findByEmail(email);

    if (playerIsExist) {
      const updatedPlayer = this.update(playerIsExist, payload);

      return updatedPlayer;
    }

    const createdPlayer = await this.create(payload);

    return createdPlayer;
  }

  async delete(playerId: string) {
    // const existsPlayer = this.players.find((player) => player._id === playerId);
    // if (!existsPlayer)
    //   throw new NotFoundException(`Player with id ${playerId} not found!`);
    // const updatedPlayers = this.players.filter(
    //   (player) => player._id !== playerId,
    // );
    // this.players = updatedPlayers;
    // this.logger.log(`Player with id ${playerId} has been removed!`);
  }

  private async findByEmail(email: string) {
    const existsPlayer = await this.playerModel.findOne({ email }).exec();

    if (!existsPlayer)
      throw new NotFoundException(`Player with email: ${email} not found`);

    return existsPlayer;
  }

  private async create(payload: CreatePlayerDto) {
    const newPlayer = new this.playerModel(payload);

    const createdPlayer = await newPlayer.save();

    this.logger.log(
      `Create player ${payload.name} with email ${payload.email}`,
    );
    this.logger.verbose({ newPlayer });

    return createdPlayer;

    // const _id = this.players.length + 1;

    // const player: Player = {
    //   _id: _id.toString(),
    //   name,
    //   phoneNumber,
    //   email,
    //   ranking: 'A',
    //   rankingPosition: 1,
    //   urlPhoto: 'https://localhost:3000/photo',
    // };

    // this.players.push(player);

    // this.logger.log(`Create player ${name} with email ${email}`);
    // this.logger.verbose({ player });

    // return player;
  }

  private async update(existsPlayer: Player, updatePlayer: CreatePlayerDto) {
    const { name } = updatePlayer;

    existsPlayer.name = name;

    this.logger.log(`Player with id ${existsPlayer._id} has been updated.`);
    this.logger.verbose({ updatePlayer });

    return existsPlayer;
  }
}
