const User = require("../../models/user.model");
const RoomChat = require("../../models/rooms-chat.model");

module.exports = (res) => {
    const myUserId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => {

            // add id to acceptFriends
            const existIdAccept = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (!existIdAccept) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        acceptFriends: myUserId
                    }
                });
            };
            // add id to requestFriends
            const existIdRequest = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (!existIdAccept) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        requestFriends: userId
                    }
                });
            };

            // lay list acceptFriends tra ve FE
            const infoUser = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUser.acceptFriends.length;

            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });
            // lay info A tra ve B
            const infoUserA = await User.findOne({
                _id: myUserId
            }).select("id avatar fullName");

            socket.broadcast.emit("SEVER_RETURN_INFO_ACCEPT_FRIEND", {
                userId: userId,
                infoUserA: infoUserA
            });

        });

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => {

            // cancel id in acceptFriends
            const existIdAccept = await User.findOne({
                _id: userId,
                acceptFriends: myUserId
            })

            if (existIdAccept) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        acceptFriends: myUserId
                    }
                });
            };
            // cancel id in requestFriends
            const existIdRequest = await User.findOne({
                _id: myUserId,
                requestFriends: userId
            })

            if (existIdAccept) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        requestFriends: userId
                    }
                });
            };

            // lay list acceptFriends cua b tra ve cho b
            const infoUser = await User.findOne({
                _id: userId
            });

            const lengthAcceptFriends = infoUser.acceptFriends.length;

            socket.broadcast.emit("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", {
                userId: userId,
                lengthAcceptFriends: lengthAcceptFriends
            });
            //   lay id cua a tra ve cho b
            socket.broadcast.emit("SERVER_RETURN_USER_ID_CANCEL_FRIEND", {
                userIdB: userId,
                userIdA: myUserId
            });
        });

        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => {

            // deleted id in acceptFriends
            const existIdAccept = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            if (existIdAccept) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $pull: {
                        acceptFriends: userId
                    }
                });
            };
            // cancel id in requestFriends
            const existIdRequest = await User.findOne({
                _id: userId,
                requestFriends: myUserId
            })

            if (existIdRequest) {
                await User.updateOne({
                    _id: userId
                }, {
                    $pull: {
                        requestFriends: myUserId
                    }
                });
            };

        });

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => {
            //  check exist
            const existIdAccept = await User.findOne({
                _id: myUserId,
                acceptFriends: userId
            })

            const existIdRequest = await User.findOne({
                _id: userId,
                requestFriends: myUserId,
            })
            //  Tao  room chat
            let roomChat ;

            if(existIdAccept && existIdRequest) {
                const dataRoom = {
                    typeRoom: "friend",
                    users: [{
                        user_id: userId,
                        role: "supperAdmin",
                    },{
                        user_id: myUserId,
                        role: "supperAdmin",
                    }
                ]
                }
                roomChat = new RoomChat(dataRoom);
                await roomChat.save();
            }
            
            // xoa id in acceptFriends ,  them id vao friendList 
            

            if (existIdAccept) {
                await User.updateOne({
                    _id: myUserId
                }, {
                    $push: {
                        FriendsList: {
                            user_id: userId,
                            room_chat_ids: roomChat.id,
                        }
                    },
                    $pull: {
                        acceptFriends: userId
                    }
                });
            };


            // xoa id in requestFriends ,them id vao friendList
            if (existIdRequest) {
                await User.updateOne({
                    _id: userId
                }, {
                    $push: {
                        FriendsList: {
                            user_id: myUserId,
                            room_chat_ids: roomChat.id,
                        }
                    },
                    $pull: {
                        requestFriends: myUserId
                    }
                });
            };

        });
    });
};