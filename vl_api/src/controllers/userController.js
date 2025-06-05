import { StatusCodes } from 'http-status-codes'
import { creatBPUser } from '~/config/botpress'
import bcrypt from 'bcrypt'

import dotenv from "dotenv"
dotenv.config()

import { GET_DB } from '~/config/mongodb';
import { createJwtToken } from '~/middlewares/auth'

export const createUser = async (req, res) => {
  try {
    const { username, password, gmail, imageUrl, conv = [] } = req.body;
    const db = GET_DB();

    if (!username || !password || !gmail) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu thông tin bắt buộc" })
    }
    
    const existingUser = await db.collection("Users").findOne({
      $or: [
        { username },
        { gmail }
      ]
    });

    if (existingUser) {
      let message = "Tài khoản đã tồn tại";
      if (existingUser.username === username) message = "Username đã tồn tại";
      else if (existingUser.gmail === gmail) message = "Gmail đã được sử dụng";
      return res.status(StatusCodes.CONFLICT).json({ message });
    }
    console.log(process.env.NUM_ENSCYPT)
    const hashedPassword = await bcrypt.hash(password, Number(process.env.NUM_ENSCYPT))

    const newUser = {
      username,
      password: hashedPassword,
      gmail,
      imageUrl,
      conv: conv || []
    }

    const result = await db.collection("Users").insertOne(newUser)

    try {
      await creatBPUser({ _id: result.insertedId, username })
      res.status(StatusCodes.CREATED).json({ message: "User created", userId: result.insertedId })
    } catch (bpError) {
      await db.collection("Users").deleteOne({ _id: result.insertedId })
      throw new Error(bpError)
    }
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}
  
export const createGuestUser = async (req, res) => {
  try {
    const { username } = req.body;
    const db = GET_DB();

    if (!username) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu thông tin bắt buộc" })
    }

    const newUser = {
      username,
      password: "guest_password",
      conv: []
    }

    const result = await db.collection("Users").insertOne(newUser)

    try {
      await creatBPUser({ _id: result.insertedId, username })
      const token = await createJwtToken(result.insertedId)
      res.status(StatusCodes.CREATED).json({ message: "User created", userId: result.insertedId, token})
    } catch (bpError) {
      await db.collection("Users").deleteOne({ _id: result.insertedId })
      throw new Error(bpError)
    }
  } catch (error) {
    console.log(error.message)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const db = GET_DB();
    const users = await db.collection("Users").find().toArray()
    res.status(StatusCodes.OK).json(users)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

export const getUser = async (req, res) => {
  try {
    const db = GET_DB()
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: "Thiếu username hoặc password" })
    }

    const user = await db.collection("Users").findOne({ username })

    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Sai username hoặc password" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: "Sai username hoặc password" })
    }
    const token = await createJwtToken(user._id)
    const { password: _, ...safeUser } = user
    res.status(StatusCodes.OK).json({ ...safeUser, token })

  } catch (error) {
    console.error("Lỗi khi xác thực người dùng:", error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: "Lỗi máy chủ nội bộ" })
  }
}

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const db = GET_DB();
    const result = await db.collection("Users").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }
    res.status(StatusCodes.OK).json({ message: "User updated" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const db = GET_DB();
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: "User not found" })
    }

    res.status(StatusCodes, OK).json({ message: "User deleted" });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

export const userController = {
  createUser,
  createGuestUser,
  updateUser,
  deleteUser,
  getAllUsers,
  getUser
}