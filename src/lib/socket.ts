import { QueryClient } from "@tanstack/react-query";

type MessageHandler = (message: any) => void;

class SocketClient {
    private ws: WebSocket | null = null;
    private handlers: Set<MessageHandler> = new Set();
    private reconnectTimer: any = null;
    private userId: string | null = null;
    private queryClient: QueryClient | null = null;

    connect(userId: string, queryClient: QueryClient) {
        if (this.ws?.readyState === WebSocket.OPEN && this.userId === userId) return;

        this.userId = userId;
        this.queryClient = queryClient;

        const apiBase = import.meta.env.VITE_API_URL || "";
        let url: string;

        if (apiBase.startsWith("http")) {
            // Replace http with ws for the socket connection
            url = apiBase.replace(/^http/, "ws") + `/ws?userId=${userId}`;
        } else {
            const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
            url = `${protocol}//${window.location.host}/ws?userId=${userId}`;
        }

        this.ws = new WebSocket(url);

        this.ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                this.handlers.forEach(h => h(data));
                this.handleGlobalEvents(data);
            } catch (e) {
                console.error("Socket parse error", e);
            }
        };

        this.ws.onclose = () => {
            this.reconnectTimer = setTimeout(() => this.connect(userId, queryClient), 3000);
        };
    }

    private handleGlobalEvents(data: any) {
        if (!this.queryClient) return;

        if (data.type === 'community_message') {
            // Invalidate or update cache
            const roomId = data.payload.roomId;
            this.queryClient.invalidateQueries({ queryKey: [`/api/community/rooms/${roomId}/messages`] });
        }

        if (data.type === 'new_message') {
            const coupleId = data.payload.coupleId;
            this.queryClient.invalidateQueries({ queryKey: [`/api/messages`, coupleId] }); // Assuming this is the key used in Couple page
        }
    }

    joinRoom(roomId: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'join_room', roomId }));
        }
    }

    leaveRoom(roomId: string) {
        if (this.ws?.readyState === WebSocket.OPEN) {
            this.ws.send(JSON.stringify({ type: 'leave_room', roomId }));
        }
    }

    addHandler(handler: MessageHandler) {
        this.handlers.add(handler);
        return () => this.handlers.delete(handler);
    }
}

export const socket = new SocketClient();
