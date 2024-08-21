const Chat = require("../../models/chat.model")

const uploadToCloudinary = require("../../helpers/uploadToCloudinary")

module.exports = (res) => {
    const userId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
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
            });
            await chat.save();

            // Send data cho client
            _io.emit("SERVER_RETURN", {
                userId: userId,
                fullName: fullName,
                content: data.content,
                images : images ,
            });
        });

        // Typing 
        socket.on("CLIENT_SEND_TYPING", async (type) => {
            socket.broadcast.emit("SERVER_RETURN_TYPING" , {
                userId: userId,
                fullName: fullName,
                type: type,
            })
        });
        // End typing
    });
}