import { Module } from '@nestjs/common';
import { PlayersController } from './players/players.controller';
import { PlayersModule } from './players/players.module';

@Module({
  imports: [PlayersModule],
  controllers: [PlayersController],
  providers: [],
})
export class AppModule {}
