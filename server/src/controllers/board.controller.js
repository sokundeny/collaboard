import { where } from "sequelize"
import { Board, BoardMember, User, UserProfile, Card } from "../models/index.js";
import validator from "validator"

// const getBoard = async (req, res) => {
//     const { id } = req.user
//     const result = await BoardMember.findAll(
//         {
//             where: { user_id: id }, include: [{
//                 model: Board,
//                 attributes: ["title", "favorite"]
//             }],
//         }

//     );
//     res.json(result);
// }

const getBoard = async (req, res) => {
    const { id: userId } = req.user;

    try {
        const userBoards = await BoardMember.findAll({
            where: { user_id: userId },
            attributes: ["board_id"]
        });

        const boardIds = userBoards.map(bm => bm.board_id);

        if (boardIds.length === 0) {
            return res.json([]);
        }

        const boardMembers = await BoardMember.findAll({
            where: { board_id: boardIds },
            attributes: ["board_id", "role"],
            include: [
                {
                    model: User,
                    attributes: ["id", "name", "email"],
                    include: [{
                        model: UserProfile,
                        attributes: ["public_id", "secure_url"]
                    }]
                },
                {
                    model: Board,
                    attributes: ["id", "title", "favorite"]
                }
            ]
        });

        const boardsMap = {};

        boardMembers.forEach(({ board_id, role, User, Board }) => {
            if (!boardsMap[board_id]) {
                boardsMap[board_id] = {
                    id: Board.id,
                    title: Board.title,
                    favorite: Board.favorite,
                    members: []
                };
            }

            boardsMap[board_id].members.push({
                id: User.id,
                name: User.name,
                email: User.email,
                role: role,
                profile: User.UserProfile
            });
        });

        const groupedBoards = Object.values(boardsMap);

        res.json(groupedBoards);

    } catch (error) {
        console.error(error);
        res.status(500).json({ errorMessage: error.message });
    }
};


const getBoardById = async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const result = await Board.findOne({ where: { id },
        include:[{
            model: BoardMember,
            include:[{
                model: User,
                attributes:["id","name","email"],
                include: [{
                    model: UserProfile,
                    attributes: ["public_id","secure_url"]
                }]
            }],
            attributes:["role"]
        }]
        });
        res.json(result);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
}

const getPersonalBoard = async (req, res) => {
    const id = parseInt(req.user.id)
    try {
        const result = await Board.findOne({ where: { user_id: id, visibility:'personal' }});
        res.json(result);
    } catch (error) {
        res.status(500).json({ message:error });
    }
}

const addBoard = async (req, res) => {
    const { title, description, visibility,favorite } = req.body;
    const user_id = req.user.id
    try {
        if (!title || !visibility || !user_id) {
            return res.status(400).json({ message: 'Missing required fields' });
        }
        const result = await Board.create({ title, description, visibility, favorite, user_id })
        const boardMember = await BoardMember.create({
            user_id: user_id,
            board_id: result.id,
            role: 'admin'
        });
        res.json(result);
    } catch (error) {
        console.log(error)
        res.status(500).json({ errorMessage: error.message });
    }
}
const inviteUser = async (req, res) => {
    const { invitedUser, role } = req.body;
    const boardId = parseInt(req.params.boardId)

    try {
        if (validator.isEmail(invitedUser)) {
            const foundUser = await User.findOne({ where: { email: invitedUser } })
            if (foundUser) {
                const newBoardMember = await BoardMember.create({
                    user_id: foundUser.id,
                    board_id: boardId,
                    role: role
                })
                res.json(newBoardMember);
            } else {
                res.status(400).json({ message: "user not found" })
            }
        } else {
            const foundUser = await User.findOne({ where: { name: invitedUser } })
            if (foundUser) {
                const newBoardMember = await BoardMember.create({
                    user_id: foundUser.id,
                    board_id: boardId,
                    role: role
                })
                res.json(newBoardMember);
            } else {
                res.status(400).json({ message: "user not found" })
            }
        }
    } catch (error) {
        console.log(error)
        res.json({ "error": `${error}` })
    }

}

const updateBoard = async (req, res) => {

    const id = parseInt(req.params.id);
    const { title, description, visibility,favorite, user_id } = req.body;
    try {
        const updateBoard = await Board.update(
            { title, description, visibility,favorite, user_id },
            { where: { id } })
        res.json(updateBoard);
    } catch (error) {
        res.status(500).json({ errorMessage: error.message });
    }
    // res.json({message: `Edit board ID ${req.params.id} with ${req.body}`})
}
const deleteBoard = async (req, res) => {
    const Id = parseInt(req.params.id);
    try {
        const result = await Board.destroy({ where: { id: Id } })
        if (result) {
            return res.status(200).json({ message: 'Board deleted successfully' });
        } else {
            return res.status(404).json({ message: 'Board not found' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export {
    getBoard,
    getBoardById,
    updateBoard,
    addBoard,
    deleteBoard,
    inviteUser,
    getPersonalBoard
}