// src/services/sseClient.ts

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

let eventSource: EventSource | null = null;

/**
 * Bắt đầu stream SSE
 * @param convId - ID cuộc hội thoại
 * @param token - Token xác thực
 * @param onEvent - Callback khi có sự kiện message
 * @param onError - Callback khi có lỗi
 */
export function startSSEStream(
  convId: string,
  token: string,
  onEvent: (event: MessageEvent) => void,
  onError?: (error: Event) => void
): void {
  if (eventSource) {
    console.warn('[SSE] Stream đã tồn tại. Đóng trước khi mở lại.');
    return;
  }

  const url = `${BASE_URL}/conversations/${convId}/listen?token=${encodeURIComponent(token)}`;

  eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log('[SSE] Kết nối mở');
  };

  eventSource.onmessage = (event: MessageEvent) => {
    onEvent?.(event);
  };

  eventSource.onerror = (err: Event) => {
    console.error('[SSE] Lỗi kết nối', err);
    onError?.(err);

    stopSSEStream();
  };
}

/**
 * Đóng kết nối SSE nếu đang mở
 */
export function stopSSEStream(): void {
  if (eventSource) {
    eventSource.close();
    eventSource = null;
    console.log('[SSE] Kết nối đóng');
  }
}
