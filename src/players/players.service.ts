import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreatePlayerDto, UpdatePlayerDto } from './dto';
import { Player } from './interfaces';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  private logger = new Logger(PlayersService.name);

  constructor(
    @InjectModel('player') private readonly playerModel: Model<Player>,
  ) {}

  async findAll() {
    const players = await this.playerModel.find().exec();

    return players;
  }

  async findById(playerId: string) {
    const existsPlayer = await this.playerModel
      .findOne({ _id: playerId })
      .exec();

    if (!existsPlayer)
      throw new NotFoundException(
        `Player with playerId: ${playerId} not found`,
      );

    return existsPlayer;
  }

  async create(payload: CreatePlayerDto) {
    const { email } = payload;

    const playerIsExist = await this.playerModel.findOne({ email }).exec();

    if (playerIsExist)
      throw new ConflictException(`Player with this email already exists.`);

    const newPlayer = new this.playerModel(payload);

    const createdPlayer = await newPlayer.save();

    this.logger.log(
      `Create player ${payload.name} with email ${payload.email}`,
    );
    this.logger.verbose({ newPlayer });

    return createdPlayer;
  }

  async delete(playerId: string) {
    const deletedPlayer = await this.playerModel.findOneAndRemove({
      _id: playerId,
    });

    this.logger.log(`Player with id: ${playerId} has been deleted`);

    return deletedPlayer;
  }

  async update(playerId: string, payload: UpdatePlayerDto) {
    const updatedPlayer = await this.playerModel
      .findOneAndUpdate({ _id: playerId }, { $set: payload })
      .exec();

    this.logger.log(`Updated player ${payload.name}`);
    this.logger.verbose({ payload });

    return updatedPlayer;
  }
}
