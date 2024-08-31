// CN gửi yêu cầu
const listBtnAddFriend = document.querySelectorAll("[btn-add-friend]");
if (listBtnAddFriend.length > 0) {
    listBtnAddFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.add("add");
            const userId = button.getAttribute("btn-add-friend");

            socket.emit("CLIENT_ADD_FRIEND", userId);
        });
    });
}
// End CN gửi yêu cầu

// CN hủy gửi yêu cầu
const listBtnCancelFriend = document.querySelectorAll("[btn-cancel-friend]");
if (listBtnCancelFriend.length > 0) {
    listBtnCancelFriend.forEach(button => {
        button.addEventListener("click", () => {
            button.closest(".box-user").classList.remove("add");
            const userId = button.getAttribute("btn-cancel-friend");

            socket.emit("CLIENT_CANCEL_FRIEND", userId);
        });
    });
}
// End CN hủy gửi yêu cầu

// CN tu choi ket ban
const refuseFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("refuse");
        const userId = button.getAttribute("btn-refuse-friend");

        socket.emit("CLIENT_REFUSE_FRIEND", userId);
    });
}
const listBtnRefuseFriend = document.querySelectorAll("[btn-refuse-friend]");
if (listBtnRefuseFriend.length > 0) {
    listBtnRefuseFriend.forEach(button => {
        refuseFriend(button);
    });
}
// End tu choi ket ban

// CN chap nhan ket ban
const acceptFriend = (button) => {
    button.addEventListener("click", () => {
        button.closest(".box-user").classList.add("accepted");
        const userId = button.getAttribute("btn-accept-friend");

        socket.emit("CLIENT_ACCEPT_FRIEND", userId);
    });
}
const listBtnAcceptFriend = document.querySelectorAll("[btn-accept-friend]");
if (listBtnAcceptFriend.length > 0) {
    listBtnAcceptFriend.forEach(button => {
        acceptFriend(button);
    });
}
// End chap nhan ket ban

// SEVER_RETURN_LENGTH_ACCEPT_FRIEND
const badgeUserAccept = document.querySelector("[badge-users-accept]");
if (badgeUserAccept) {
    const userId = badgeUserAccept.getAttribute("badge-users-accept")
    socket.on("SEVER_RETURN_LENGTH_ACCEPT_FRIEND", (data) => {
        if (userId === data.userId) {
            badgeUserAccept.innerHTML = data.lengthAcceptFriends;
        }
    })
}

// End SEVER_RETURN_LENGTH_ACCEPT_FRIEND

// SEVER_RETURN_INFO_ACCEPT_FRIEND
socket.on("SEVER_RETURN_INFO_ACCEPT_FRIEND", (data) => {
    // trang loi moi ket ban
    const dataUsersAccept = document.querySelector("[data-users-accept]");
    if (dataUsersAccept) {
        const userId = dataUsersAccept.getAttribute("data-users-accept");
        if (userId === data.userId) {
            // Ve user ra giao dien
            const div = document.createElement("div");
            div.classList.add("col-6")
            div.setAttribute("user-id", data.infoUserA._id)
            div.innerHTML = `
                <div class="box-user">
                    <div class="inner-avatar"><img src="/images/avatar-defaulse.png" alt="${data.infoUserA.fullName}"></div>
                    <div class="inner-info">
                        <div class="inner-name">${data.infoUserA.fullName}</div>
                        <div class="inner-buttons">
                            <button class="btn btn-sm btn-primary mr-1"
                                btn-accept-friend="${data.infoUserA._id}">Đồng ý</button>
                            <button class="btn btn-sm btn-secondary mr-1"
                                btn-refuse-friend="${data.infoUserA._id}">Xóa</button>
                            <button class="btn btn-sm btn-secondary mr-1"
                                btn-deleted-friend="btn-deleted-friend" disabled="disabled">Đã xóa</button>
                            <button
                                class="btn btn-sm btn-primary mr-1" btn-accepted-friend="btn-accepted-friend" disabled="disabled">Đã chấp
                                nhận</button>
                        </div>
                    </div>
                </div>
                </div>
            `
            dataUsersAccept.appendChild(div);

            // bat su kien nut bam
            // xoa
            const buttonRefuse = div.querySelector("[btn-refuse-friend]");
            refuseFriend(buttonRefuse)
            // chap nhan
            const buttonAccept = div.querySelector("[btn-accept-friend]");
            acceptFriend(buttonAccept);
        }
    }
    // trang danh sach nguoi dung
    const dataUsersNotFriend = document.querySelector("[data-users-not-friend]")
    if (dataUsersNotFriend) {
        const userId = dataUsersNotFriend.getAttribute("data-users-not-friend");
        if (userId === data.userId) {
            const boxUserRemove = dataUsersNotFriend.querySelector(`[user-id="${data.infoUserA._id}"]`);
            if (boxUserRemove) {
                dataUsersNotFriend.removeChild(boxUserRemove)
            }
        }
    }
});


//End SEVER_RETURN_INFO_ACCEPT_FRIEND

// SEVER_RETURN_USER_ID_CANCEL_FRIEND
socket.on("SERVER_RETURN_USER_ID_CANCEL_FRIEND", (data) => {
    const userIdA = data.userIdA;
    const boxUserRemove = document.querySelector(`[user-id="${userIdA}"]`);
    if (boxUserRemove) {
        const dataUsersAccept = document.querySelector("[data-users-accept]");
        const userIdB = badgeUserAccept.getAttribute("badge-users-accept")
        if (userIdB === data.userIdB) {
            dataUsersAccept.removeChild(boxUserRemove)
        }
    }
});

// END SEVER_RETURN_USER_ID_CANCEL_FRIEND

// SERVER_RETURN_USER_STATUS
socket.on("SERVER_RETURN_USER_STATUS", (data) => {
    const dataUsersFriend = document.querySelector("[data-users-friend]");
    if (dataUsersFriend) {
        const boxUser = dataUsersFriend.querySelector(`[user-id="${data.userId}"]`);
        if (boxUser) {
            const boxStatus = boxUser.querySelector("[status]");
            boxStatus.setAttribute("status", data.status);
        }
    }
});
// END SERVER_RETURN_USER_STATUS