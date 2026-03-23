enum SocketRoom{
    USER = "room_user",
    SHOP = "room_shop",
    ADMIN = "room_admin"
}
export const buildRoom = {
    user:(id: number)=> `${SocketRoom.USER}_${id}`,
    shop:(id:number)=> `${SocketRoom.SHOP}_${id}`,
    admin:()=> SocketRoom.ADMIN 
};
export const ChatRoom = (id: number) => `chat_room_${id}`;

export enum SocketRoomName{
    notificationNew = "new_notification",
    notificationRead = "read_notification",
    notificationDelete = "delete_notification",
    forceLogout = "force_logout",
    joinchat = 'join_chat',
    leavechat = 'leave_chat',
    typing = 'typing',
    usertyping = 'user_typing',
    receivemessage = 'receive_message',
    readMessage = 'read_message',
    recallMessage = 'recall_message'
}