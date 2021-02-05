import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema({
  result: [
    {
      type: String
    }
  ],
  players: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    }
  ]
},
{
  timestamps: true,
  collection: 'matches'
});
