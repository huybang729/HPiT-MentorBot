const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getConversations = async (token: string) => {
    const response = await fetch(`${BASE_URL}/conversations`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy danh sách cuộc hội thoại');
    }
    return await response.json();
};

export const newConversation = async (token: string, title?: string) => {
    const response = await fetch(`${BASE_URL}/conversations`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        },
        body: JSON.stringify({ title }) 
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể tạo cuộc hội thoại mới');
    }
    return await response.json(); 
};

export const deleteConversation = async (convId :string, token: string) => {
    const response = await fetch(`${BASE_URL}/conversations/${convId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể xóa cuộc hội thoại');
    }

    return await response.json();
};

export const getListMessages = async (convId: string, token: string, nextToken? : string) => {
    const response = await fetch(`${BASE_URL}/messages/${convId}` + (nextToken ? `/?nextToken=${nextToken}` : ''), {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể lấy danh sách tin nhắn');
    }
    return await response.json();
};

export const sendBPMessage = async (convId: string, text: string, token: string) => {
    const response = await fetch(`${BASE_URL}/messages`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        },
        body: JSON.stringify({
            convId,
            text
        })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể gửi tin nhắn');
    }

    return await response.json();
};

export const updateConversation = async (convId: string, title: string, token: string) => {
    const response = await fetch(`${BASE_URL}/conversations/${convId}/rename`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-user-key': token
        },
        body: JSON.stringify({ title })
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể cập nhật cuộc hội thoại');
    }
    console.log('Update conversation response:', response);
    return await response.json();
}