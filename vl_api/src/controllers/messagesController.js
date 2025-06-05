import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import jwt from 'jsonwebtoken';

import dotenv from "dotenv"
import { createBPMessage, getBPListMessages } from '~/config/botpress';
dotenv.config()

const verifyToken = async (req) => {
  const token = req.headers['x-user-key'];
  if (!token) throw new Error('Thiếu token xác thực');
  const decoded = jwt.verify(token, process.env.BP_SECRET);
  return decoded.userId;
};

export const createMessage = async (req, res) => {
  try {
    const token = req.headers['x-user-key'];
    const { convId, text } = req.body;
    const data = await createBPMessage(convId, text, token)

    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const listMessages = async (req, res) => {
  try {
    const token = req.headers['x-user-key'];
    const { id } = req.params;
    const { nextToken } = req.query;
    const messages = await getBPListMessages(id, token, nextToken)
    const meta = messages.meta
    res.status(StatusCodes.OK).json({ messages });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const getMessage = async (req, res) => {
  try {
    const userId = await verifyToken(req);
    const { id } = req.params;
    const db = GET_DB();

    const message = await db.collection('Messages').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (!message) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy tin nhắn' });
    }

    res.status(StatusCodes.OK).json(message);
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const userId = await verifyToken(req);
    const { id } = req.params;
    const db = GET_DB();

    const result = await db.collection('Messages').deleteOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId)
    });

    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Tin nhắn không tồn tại hoặc bạn không có quyền xóa' });
    }

    res.status(StatusCodes.OK).json({ message: 'Đã xóa tin nhắn' });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const messageController = {
  createMessage,
  listMessages,
  getMessage,
  deleteMessage
};