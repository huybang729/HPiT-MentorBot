import { StatusCodes } from 'http-status-codes';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import jwt from 'jsonwebtoken';

import { createBPConversation, deleteBPConversation, getBPListConversations, listenBPConversations } from '~/config/botpress';

import dotenv from "dotenv"
dotenv.config()

const verifyToken = async (req) => {
  console.log(process.env.BP_SECRET)
  const token = req.headers['x-user-key'];
  if (!token) throw new Error('Thiếu token xác thực');
  const decoded = jwt.verify(token, process.env.BP_SECRET);
  console.log("Decode: ", decoded)
  return decoded.id;
};

export const createConversation = async (req, res) => {
  try {
    const userId = await verifyToken(req);
    console.log(userId)
    const token = req.headers['x-user-key']
    const { title } = req.body;
    const db = GET_DB();

    const newConversation = {
      userId: new ObjectId(userId),
      title: title || 'Cuộc hội thoại mới',
      createdAt: new Date(),
    };

    const result = await db.collection('Conversations').insertOne(newConversation);

    await db.collection('Users').updateOne(
      { _id: new ObjectId(userId) },
      { $push: { conv: result.insertedId } }
    );

    try {
      await createBPConversation(result.insertedId, token);
      res.status(StatusCodes.CREATED).json({ message: 'Tạo cuộc hội thoại thành công', conversationId: result.insertedId, userId: userId });
    } catch (bpError) {
      await db.collection("Conversations").deleteOne({ _id: result.insertedId });
      throw new Error(bpError);
    }
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const listConversations = async (req, res) => {
  try {
    const token = req.headers['x-user-key'];

    const response = await getBPListConversations(token);
    console.log("List conversations: ", response)
    const db = GET_DB();
    const dbConversations = await db.collection('Conversations').find({}).toArray();

    const mergedConversations = response.conversations.map(conv => {
      const match = dbConversations.find(src =>
        src._id.toString() === conv.id
      );
      return {
        ...conv,
        title: match ? match.title : null
      };
    });
    res.status(StatusCodes.OK).json({ conversations: mergedConversations });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const getConversation = async (req, res) => {
  try {
    const userId = await verifyToken(req);
    const { id } = req.params;
    const db = GET_DB();

    const conversation = await db.collection('Conversations').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy cuộc hội thoại' });
    }

    res.status(StatusCodes.OK).json(conversation);
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const listenConversation = async (req, res) => {
  try {
    const { token } = req.query
    const { id } = req.params;

    if (!token) {
      return res.status(401).json({ message: 'Thiếu token xác thực' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    console.log("Start SSE")
    const reader = await listenBPConversations(id, token);

    const decoder = new TextDecoder();

    const readLoop = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          const raw = decoder.decode(value);
          const lines = raw.split('\n');
          const dataLines = lines.filter(line => line.startsWith('data: '));

          const dataPayload = dataLines.map(line => line.slice('data: '.length)).join('\n');

          if (dataPayload.trim() !== '') {
            res.write(`data: ${dataPayload}\n\n`);
            console.log("SSE Data: ", dataPayload);

            try {
              const parsed = JSON.parse(dataPayload);
              if (parsed.type === "message_created") {
                console.log("End [SSE]")
                res.end();
              }
            } catch (e) {
              console.warn('Không parse được JSON:', e);
            }
          }

        }
      } catch (err) {
        console.error('[SSE ERROR]', err);
        res.end();
      }
    };

    await readLoop();

    console.log("End [SSE]")

    req.on('close', () => {
      reader.cancel();
      res.end();
    });

  } catch (error) {
    console.error('[SSE Setup Error]', error.message);
    if (!res.headersSent) {
      res.status(500).json({ message: 'Không thể mở SSE stream' });
    } else {
      res.end();
    }
  }
};

export const deleteConversation = async (req, res) => {
  try {
    const token = req.headers['x-user-key'];
    const userId = await verifyToken(req);
    const { id } = req.params;
    const db = GET_DB();
    console.log("Delete conv: ", id)
    await deleteBPConversation(id, token);
    const result = await db.collection('Conversations').deleteOne({
      _id: new ObjectId(id)
    });

    console.log("result:", result)

    if (result.deletedCount === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Cuộc hội thoại không tồn tại' });
    }

    await db.collection('Users').updateOne(
      { _id: new ObjectId(userId) },
      { $pull: { conv: new ObjectId(id) } }
    );

    res.status(StatusCodes.OK).json({ message: 'Đã xóa cuộc hội thoại' });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
};

export const renameConversation = async (req, res) => {
  try {
    const userId = await verifyToken(req);
    const { id } = req.params;
    const { title } = req.body;
    const db = GET_DB();

    const conversation = await db.collection('Conversations').findOne({
      _id: new ObjectId(id),
      userId: new ObjectId(userId),
    });

    if (!conversation) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: 'Không tìm thấy cuộc hội thoại' });
    }
    console.log("Rename conv: ", id, title)
    await db.collection('Conversations').updateOne(
      { _id: new ObjectId(id) },
      { $set: { title } }
    );

    res.status(StatusCodes.OK).json({ message: 'Đã đổi tên cuộc hội thoại', conversationId: id, title });
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: error.message });
  }
}

export const conversationController = {
  createConversation,
  listConversations,
  getConversation,
  listConversations,
  listenConversation,
  deleteConversation,
  renameConversation
};
