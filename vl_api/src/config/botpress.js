import dotenv from "dotenv";
import { createJwtToken } from "~/middlewares/auth";
dotenv.config();

export const creatBPUser = async (user) => {
  const token = createJwtToken(user._id);
  console.log(token)
  console.log(`${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/users/get-or-create`);

  try {
    const response = await fetch(
      `${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/users/get-or-create`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': token
        },
        body: JSON.stringify({
          name: user.username,
        })
      }
    );

    console.log('Response data: ', response);
  } catch (error) {
    console.error('API ERROR:', error.response?.data || error.message);
    throw new Error('API ERROR: ' + (error.response?.data?.message || error.message));
  }
};

export const createBPConversation = async (convId, token) => {
  try {
    const response = await fetch(`${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-key': token
      },
      body: JSON.stringify({
        id: convId,
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Tạo cuộc hội thoại thất bại');
    }

    return data;
  } catch (error) {
    console.error('Lỗi tạo hội thoại:', error.message);
    throw error;
  }
}

export const getBPListConversations = async (token) => {
  try {
    const response = await fetch(`${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-key': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy dữ liệu hội thoại thất bại');
    }

    return data;
  } catch (error) {
    console.error('Lỗi lấy hội thoại:', error.message);
    throw error;
  }
}

export const listenBPConversations = async (convId, token) => {
  const url = `${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/${convId}/listen`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'text/event-stream',
      'x-user-key': token
    }
  });

  if (!response.ok || !response.body) {
    throw new Error('Không thể kết nối tới Botpress SSE stream' + response.status);
  }
  return response.body.getReader();
};


export const getBPConversation = async (convId, token) => {
  try {
    const response = await fetch(`${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/${convId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-user-key': token
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lấy dữ liệu hội thoại thất bại');
    }

    return data;
  } catch (error) {
    console.error('Lỗi lấy hội thoại:', error.message);
    throw error;
  }
}

export const deleteBPConversation = async (convId, token) => {
  try {
    const response = await fetch(`${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/${convId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-key': token
      }
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Xóa hội thoại thất bại');
    }

    return { message: 'Xóa thành công hội thoại' };
  } catch (error) {
    console.error('Lỗi xóa hội thoại:', error.message);
    throw error;
  }
}

export const getBPListMessages = async (convId, token, nextToken) => {
  try {
    const response = await fetch(
      `${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/conversations/${convId}/messages` + (nextToken ? `?nextToken=${nextToken}` : ''),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': token
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể lấy danh sách tin nhắn');
    }
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy tin nhắn:', error.message);
    throw error;
  }
};

export const createBPMessage = async (convId, text, token) => {
  try {
    const response = await fetch(
      `${process.env.BP_BASE_API}/${process.env.BP_CHAT_ID}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-key': token
        },
        body: JSON.stringify({
          payload: {
            type: 'text',
            text: text
          },
          conversationId: convId
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Không thể gửi tin nhắn');
    }

    return data;
  } catch (error) {
    console.error('Lỗi khi gửi tin nhắn:', error.message);
    throw error;
  }
};