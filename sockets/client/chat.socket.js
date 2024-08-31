const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = (req, res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;
    const roomChatId =  req.params.roomChatId ;

    _io.once('connection', (socket) => {
        socket.join(roomChatId)
        socket.on("CLIENT_SENT", async (data) => {
            let images = [];

            for (const image of data.image) {
                const link = await uploadToCloudinary(image);
                images.push(link);
            }
            
            // luu vao db
            const chat = new Chat({
                user_id: userId,
                content: data.content,
                images : images ,
                room_chat_id : roomChatId,
            });
            await chat.save();

            // Send data cho client
            _io.to(roomChatId).emit("SERVER_RETURN", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images : images ,
            });
        });

        // Typing 
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.to(roomChatId).emit("SERVER_RETURN_TYPING" , {
                userId: userId,
                fullName: fullName,
                type: type,
            })
        });
        // End typing
    });
}