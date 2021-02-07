import * as mongoose from 'mongoose';

export const MatchSchema = new mongoose.Schema({
  category: {
    type: String
  },
  def: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  },
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
