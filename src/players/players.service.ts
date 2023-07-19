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

  /**
   * Retrieves all players from the database.
   * @async
   * @returns {Promise<Player[]>} A promise that resolves to an array of player objects.
   * @example
   */
  async findAll() {
    const players = await this.playerModel.find().exec();

    return players;
  }

  /**
   * Retrieves a player by their ID from the database.
   * @async
   * @param {string} playerId - The ID of the player to retrieve.
   * @throws {NotFoundException} If the player with the given ID is not found.
   * @returns {Promise<Player>} A promise that resolves to the player object.
   */
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

  /**
   * Creates a new player in the database.
   * @async
   * @param {CreatePlayerDto} payload - The payload containing player information.
   * @throws {ConflictException} If a player with the same email already exists.
   * @returns {Promise<Player>} A promise that resolves to the created player object.
   */
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

  /**
   * Deletes a player from the database by their ID.
   * @async
   * @param {string} playerId - The ID of the player to delete.
   * @throws {NotFoundException} If the player with the given ID is not found.
   * @returns {Promise<Player>} A promise that resolves to the deleted player object.
   */
  async delete(playerId: string) {
    const deletedPlayer = await this.playerModel.findOneAndRemove({
      _id: playerId,
    });

    this.logger.log(`Player with id: ${playerId} has been deleted`);

    return deletedPlayer;
  }

  /**
   * Updates a player in the database by their ID.
   * @async
   * @param {string} playerId - The ID of the player to update.
   * @param {UpdatePlayerDto} payload - The payload containing player information to update.
   * @throws {NotFoundException} If the player with the given ID is not found.
   * @returns {Promise<Player>} A promise that resolves to the updated player object.
   */
  async update(playerId: string, payload: UpdatePlayerDto) {
    const existPlayer = await this.playerModel
      .findOne({ _id: playerId })
      .exec();

    if (!existPlayer)
      throw new NotFoundException(`Player with _id ${playerId} not found`);

    const updatedPlayer = await this.playerModel
      .findOneAndUpdate({ _id: playerId }, { $set: payload })
      .exec();

    this.logger.log(`Updated player ${payload.name}`);
    this.logger.verbose({ payload });

    return updatedPlayer;
  }
}
