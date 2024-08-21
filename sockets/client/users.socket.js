const User = require("../../models/user.model");

module.exports = (res) => {
    const myUserId = res.locals.user.id;
    const fullName = res.locals.user.fullName;

    _io.once('connection', (socket) => {
        socket.on("CLIENT_ADD_FRIEND", async (userId) => { 

            // add id to acceptFriends
            const existIdAccept = await User.findOne({
                _id : userId,
                acceptFriends : myUserId
            })

            if(!existIdAccept){
                await User.updateOne({
                    _id : userId 
                },{
                    $push : {acceptFriends : myUserId}
                });
            };
            // add id to requestFriends
            const existIdRequest = await User.findOne({
                _id : myUserId,
                requestFriends : userId
            })

            if(!existIdAccept){
                await User.updateOne({
                    _id : myUserId 
                },{
                    $push : {requestFriends : userId}
                });
            };

        });

        socket.on("CLIENT_CANCEL_FRIEND", async (userId) => { 

            // cancel id in acceptFriends
            const existIdAccept = await User.findOne({
                _id : userId,
                acceptFriends : myUserId
            })

            if(existIdAccept){
                await User.updateOne({
                    _id : userId 
                },{
                    $pull : {acceptFriends : myUserId}
                });
            };
            // cancel id in requestFriends
            const existIdRequest = await User.findOne({
                _id : myUserId,
                requestFriends : userId
            })

            if(existIdAccept){
                await User.updateOne({
                    _id : myUserId 
                },{
                    $pull : {requestFriends : userId}
                });
            };

        });

        socket.on("CLIENT_REFUSE_FRIEND", async (userId) => { 

            // deleted id in acceptFriends
            const existIdAccept = await User.findOne({
                _id : myUserId,
                acceptFriends : userId
            })

            if(existIdAccept){
                await User.updateOne({
                    _id : myUserId 
                },{
                    $pull : {acceptFriends : userId}
                });
            };
            // cancel id in requestFriends
            const existIdRequest = await User.findOne({
                _id : userId,
                requestFriends : myUserId
            })

            if(existIdRequest){
                await User.updateOne({
                    _id : userId 
                },{
                    $pull : {requestFriends : myUserId}
                });
            };

        });

        socket.on("CLIENT_ACCEPT_FRIEND", async (userId) => { 

            // xoa id in acceptFriends ,  them id vao friendList 
            const existIdAccept = await User.findOne({
                _id : myUserId,
                acceptFriends : userId
            })

            if(existIdAccept){
                await User.updateOne({
                    _id : myUserId 
                },{
                    $push :  {
                        FriendsList :{
                            user_id : userId ,
                            room_chat_ids : "",
                        }
                    },
                    $pull : {acceptFriends : userId}
                });
            };


            // xoa id in requestFriends ,them id vao friendList
            const existIdRequest = await User.findOne({
                _id : userId,
                requestFriends : myUserId ,
            })

            if(existIdRequest){
                await User.updateOne({
                    _id : userId 
                },{
                    $push :  {
                        FriendsList :{
                            user_id : myUserId ,
                            room_chat_ids : "",
                        }
                    },
                    $pull : {requestFriends : myUserId}
                });
            };

        });
    }); 
};