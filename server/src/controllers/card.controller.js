import { Card,User,CardAssignment} from "../models/index.js";

export const getCardsByListId = async (req, res) => {
  try {
    const  list_id  = req.params.id;

    const cards = await Card.findAll({
      where: { list_id },
      order: [["position", "ASC"]],
      include: [
        {
          model: CardAssignment,
          attributes:["user_id"],
          include: [
            {
              model: User, // Optional: include assigned user info
              attributes: ["name"], // Customize as needed
            },
          ],
        },
      ],
    });

    return res.status(200).json(cards);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const createCard = async (req, res) => {
  try {
    const { title, description, status, start_at, due_at, list_id } = req.body;

    if (!title || !list_id) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingCards = await Card.findAll({ where: { list_id } });
    
    const position = existingCards.length + 1;

    await Card.create({
      title,
      description,
      status,
      start_at,
      due_at,
      list_id,
      position,
    });

    return res.status(201).json({ message: "Card created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};


export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, start_at, due_at, position } = req.body;

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    if (title) card.title = title;
    if (description) card.description = description;
    if (status) card.status = status;
    if (start_at) card.start_at = start_at;
    if (due_at) card.due_at = due_at;

    // Reorder cards if position changes
    if (position && position !== card.position) {
      const cardsInList = await Card.findAll({
        where: { list_id: card.list_id },
        order: [["position", "ASC"]],
      });

      const filtered = cardsInList.filter((c) => c.id !== card.id);
      filtered.splice(position - 1, 0, card);

      for (let i = 0; i < filtered.length; i++) {
        filtered[i].position = i + 1;
        await filtered[i].save();
      }
    } else {
      await card.save();
    }

    return res.status(200).json({ message: "Card updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;

    const card = await Card.findByPk(id);
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    const list_id = card.list_id;
    const deletedPosition = card.position;

    await card.destroy();

    // Reorder remaining cards
    const cardsToUpdate = await Card.findAll({ where: { list_id } });
    for (const c of cardsToUpdate) {
      if (c.position > deletedPosition) {
        c.position -= 1;
        await c.save();
      }
    }

    return res.status(200).json({ message: "Card deleted and positions updated" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};