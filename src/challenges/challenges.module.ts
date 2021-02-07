import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CategoriesModule } from 'src/categories/categories.module';
import { MatchesModule } from 'src/matches/matches.module';
import { PlayersModule } from 'src/players/players.module';
import { ChallengesValidatorService } from './challenges-validator.service';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { ChallengeSchema } from './interfaces/challenge.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Challenge',
        schema: ChallengeSchema
      }
    ]),
    PlayersModule,
    CategoriesModule,
    MatchesModule
  ],
  controllers: [ChallengesController],
  providers: [
    ChallengesService,
    ChallengesValidatorService
  ]
})
export class ChallengesModule {}
