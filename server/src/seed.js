import { sequelize, User, Board, BoardMember, List, Card, CardAssignment, ActivityLog } from "./models/index.js";
import { faker } from '@faker-js/faker';

const seed = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log("✅ Database synced");

    const users = [];
    const boards = [];
    const lists = [];
    const cards = [];

    // Create 5 users
    for (let i = 0; i < 15; i++) {
      const user = await User.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        hashedPassword: faker.internet.password(),
      });
      users.push(user);
    }

    // Create 5 boards, each assigned to a different user
    for (let i = 0; i < 15; i++) {
      const board = await Board.create({
        title: faker.word.words(3),
        description: faker.lorem.sentence(),
        visibility: "personal",
        favorite:"true",
        user_id: users[i].id,
      });
      boards.push(board);
    }

    // Create 1 list per board
    for (let i = 0; i < 15; i++) {
      const list = await List.create({
        title: faker.word.words(2),
        position: 1,
        board_id: boards[i].id,
      });
      lists.push(list);
    }

    // Create 1 card per list
    for (let i = 0; i < 15; i++) {
      const card = await Card.create({
        title: faker.word.words(3),
        description: faker.lorem.paragraph(),
        status: faker.helpers.arrayElement(['to-do', 'done', 'missed']),
        start_at: faker.date.past(),
        due_at: faker.date.future(),
        position: 1,
        list_id: lists[i].id,
      });
      cards.push(card);
    }

    // Create 5 board members (1 user per board)
    for (let i = 0; i < 15; i++) {
      await BoardMember.create({
        role: faker.helpers.arrayElement(["admin", "editor", "viewer"]),
        join_at: faker.date.past(),
        board_id: boards[i].id,
        user_id: users[i].id,
      });
    }

    // Create 5 card assignments (assign card i to user i)
    for (let i = 0; i < 15; i++) {
      await CardAssignment.create({
        assigned_at: faker.date.recent(),
        user_id: users[i].id,
        card_id: cards[i].id,
      });
    }

    // Create 5 activity logs
    for (let i = 0; i < 15; i++) {
      await ActivityLog.create({
        action: faker.hacker.verb() + " " + faker.hacker.noun(),
        time: faker.date.recent(),
        board_id: boards[i].id,
        user_id: users[i].id,
        card_id: cards[i].id,
      });
    }

    console.log("🌱 Seeding complete! 15 users, 15 boards, etc.");
  } catch (error) {
    console.error("❌ Seeding failed:", error);
  }
};

seed();
