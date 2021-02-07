import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { PlayersModule } from 'src/players/players.module';
import { MatchSchema } from './interfaces/match.schema';
import { MatchesService } from './matches.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Match',
        schema: MatchSchema
      }
    ]),
    PlayersModule,
    CategoriesModule
  ],
  exports: [MatchesService],
  providers: [MatchesService]
})
export class MatchesModule {}
