import sequelize from "../config/connectdb.js";
import User from "./user.js";
import Board from "./board.js";
import List from "./list.js";
import Card from "./card.js";
import BoardMember from "./boardMember.js";
import ActivityLog from "./activity_log.js";
import CardAssignment from "./card_assignment.js";
import UserProfile from "./userProfile.js";

// ✅ User <--> Board (one-to-many)
User.hasMany(Board, { foreignKey: 'user_id' });
Board.belongsTo(User, { foreignKey: 'user_id' });
// ✅ User <--> Profile (onr-to-one)
User.hasOne(UserProfile, { foreignKey: 'user_id' });
UserProfile.belongsTo(User, { foreignKey: 'user_id' });

// ✅ Board <--> List (one-to-many)
Board.hasMany(List, { foreignKey: 'board_id' });
List.belongsTo(Board, { foreignKey: 'board_id' });

// ✅ List <--> Card (one-to-many)
List.hasMany(Card, { foreignKey: 'list_id' });
Card.belongsTo(List, { foreignKey: 'list_id' });

// ✅ User <--> Board (many-to-many through BoardMember)
User.belongsToMany(Board, {
  through: BoardMember,
  foreignKey: 'user_id',
  otherKey: 'board_id'
});
Board.belongsToMany(User, {
  through: BoardMember,
  foreignKey: 'board_id',
  otherKey: 'user_id'
});

// ✅ BoardMember belongsTo both
BoardMember.belongsTo(User, { foreignKey: 'user_id' });
BoardMember.belongsTo(Board, { foreignKey: 'board_id' });
User.hasMany(BoardMember, { foreignKey: 'user_id' });
Board.hasMany(BoardMember, { foreignKey: 'board_id' });

// ✅ ActivityLog: belongs to User, Board, Card
User.hasMany(ActivityLog, { foreignKey: 'user_id' });
ActivityLog.belongsTo(User, { foreignKey: 'user_id' });

Board.hasMany(ActivityLog, { foreignKey: 'board_id' });
ActivityLog.belongsTo(Board, { foreignKey: 'board_id' });

Card.hasMany(ActivityLog, { foreignKey: 'card_id' });
ActivityLog.belongsTo(Card, { foreignKey: 'card_id' });

// ✅ CardAssignment: many-to-many User <--> Card
User.belongsToMany(Card, {
  through: CardAssignment,
  foreignKey: 'user_id',
  otherKey: 'card_id'
});
Card.belongsToMany(User, {
  through: CardAssignment,
  foreignKey: 'card_id',
  otherKey: 'user_id'
});

// ✅ CardAssignment belongsTo both
CardAssignment.belongsTo(User, { foreignKey: 'user_id' });
CardAssignment.belongsTo(Card, { foreignKey: 'card_id' });

User.hasMany(CardAssignment, { foreignKey: 'user_id' });
Card.hasMany(CardAssignment, { foreignKey: 'card_id' });

// ✅ Export all
export {
  sequelize,
  User,
  Board,
  List,
  Card,
  BoardMember,
  ActivityLog,
  CardAssignment,
  UserProfile
};
