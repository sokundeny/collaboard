import { List } from "../models/index.js";
import { Op } from "sequelize";

export const createList=async(req,res)=>{
    try {
        const {title, board_id} = req.body

        if(!title||!board_id){
            return res.status(400).json({message: "missing requirement"})
        }

        const existList = await List.findAll({where: {board_id}})

        const isDuplicate = existList.some((list) => list.title === title);
        
		if (isDuplicate) {
        	return res.status(409).json({ message: "List name already exists" });
        }

        const position = existList.length + 1;
        await List.create({
            title,
            position,
            board_id
        })
        return res.status(201).json({message: "list has been created."})
    } catch (error) {
        res.status(500).json({message: "something went wrong"})
    }
}

export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;

    const list = await List.findByPk(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const board_id = list.board_id;
    const deletedPosition = list.position;

    await list.destroy();

    // Update positions of remaining lists in the same board
    const listsToUpdate = await List.findAll({
      where: {
        board_id,
      },
    });

    for (const l of listsToUpdate) {
      if (l.position > deletedPosition) {
        l.position -= 1;
        await l.save();
      }
    }

    return res.status(200).json({ message: "List deleted and positions updated" });
  } catch (error) {
    return res.status(500).json({ message: "something went wrong" });
  }
};

export const getList=async(req,res)=>{
    try {
        const board_id=req.params.id
        if(!board_id){
            return res.status(400).json({message:"missing requirement"})
        }
        const lists=await List.findAll({
            where:{board_id},
            order: [["position", "ASC"]],
        })
        res.status(200).json(lists)
    } catch (error) {
        return res.status(500).json({ message: "something went wrong" });
    }
}

export const updateList = async (req, res) => {
  try {
    const {id}=req.params
    const { title, position } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing list ID" });
    }

    const list = await List.findByPk(id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    const board_id = list.board_id;

    // === Check for duplicate title if title is changing ===
    if (title && title !== list.title) {
      const duplicate = await List.findOne({
        where: {
          board_id,
          title,
          id: { [Op.ne]: id },
        },
      });
      if (duplicate) {
        return res.status(409).json({ message: "List title already exists" });
      }
      list.title = title;
    }

    // === Reorder positions if position is changing ===
    if (position && position !== list.position) {
      const allLists = await List.findAll({
        where: { board_id },
        order: [["position", "ASC"]],
      });

      // Remove current list from the array
      const filtered = allLists.filter((l) => l.id !== list.id);

      // Insert list at new position (1-based)
      filtered.splice(position - 1, 0, list);

      // Reassign positions
      for (let i = 0; i < filtered.length; i++) {
        filtered[i].position = i + 1;
        await filtered[i].save();
      }
    } else {
      // Just save title change if no position change
      await list.save();
    }

    return res.status(200).json({ message: "List updated successfully"});
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
