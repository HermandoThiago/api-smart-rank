import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PlayersModule],
  controllers: [],
})
export class AppModule {}
