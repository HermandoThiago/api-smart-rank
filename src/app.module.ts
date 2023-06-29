import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb://admin:admin@localhost:27017/smartrank',
      {},
    ),
    PlayersModule,
  ],
  controllers: [],
})
export class AppModule {}
