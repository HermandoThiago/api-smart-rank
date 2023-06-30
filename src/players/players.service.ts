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

    const playerIsExist = await this.playerModel.findOne({ email }).exec();

    if (playerIsExist) {
      const updatedPlayer = this.update(payload);

      return updatedPlayer;
    }

    const createdPlayer = await this.create(payload);

    return createdPlayer;
  }

  async delete(playerId: string) {
    const deletedPlayer = await this.playerModel.findOneAndRemove({
      _id: playerId,
    });

    return deletedPlayer;
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
  }

  private async update(updatePlayer: CreatePlayerDto) {
    const { email } = updatePlayer;

    const updatedPlayer = await this.playerModel
      .findOneAndUpdate({ email }, { $set: updatePlayer })
      .exec();

    return updatedPlayer;
  }
}
