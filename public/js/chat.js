// file-upload-with-preview
const upload = new FileUploadWithPreview.FileUploadWithPreview('upload-image' ,{
    multiple : true ,
    maxFileCount : 8 ,
});

// CLIENT_SENT
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
    formSendData.addEventListener("submit", (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value;
        const image = upload.cachedFileArray ;

        if (content || image.length > 0) {
            socket.emit("CLIENT_SENT", {
                content : content ,
                image : image
            });
            e.target.elements.content.value = "";
            upload.resetPreviewPanel();
            socket.emit("CLIENT_SEND_TYPING", "hidden")
        }
    });

}
//End CLIENT_SENT

// SERVER_RETURN
socket.on("SERVER_RETURN", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body")
    const boxTyping = document.querySelector(".chat .inner-list-typing")

    const div = document.createElement("div");
    let htmlFullName = "";
    let htmlContent = "";
    let htmlImages = "";

    if (myId == data.userId) {
        div.classList.add("inner-outgoing")
    } else {
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming")
    };
    if(data.content){
        htmlContent= `<div class="inner-content">${data.content}</div>`
    }
    if(data.images.length > 0){
        htmlImages += `<div class="inner-images">`
        for (const image of data.images) {
            htmlImages += `<img src="${image}"> `
        } 
        htmlImages += `</div>`
    }
    div.innerHTML = `
        ${htmlFullName}
        ${htmlContent}
        ${htmlImages}
    `;

    body.insertBefore(div, boxTyping);

    body.scrollTop = body.scrollHeight;
    // Preview images
    const gallery = new Viewer(div);

    const tooltip = document.querySelector('.tooltip.shown');
    if (tooltip) {
        tooltip.classList.toggle('shown')
    }
});
// End SERVER_RETURN
// Scroll chat 
const bodyChat = document.querySelector(".chat .inner-body")
if (bodyChat) {
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end Scroll

// show emoji
const buttonIcon = document.querySelector('.button-icon');
if (buttonIcon) {
    const tooltip = document.querySelector('.tooltip');

    Popper.createPopper(buttonIcon, tooltip)

    buttonIcon.onclick = () => {
        tooltip.classList.toggle('shown')
    }
}
//showTyping
var timeOut;
const showTyping = () => {
    socket.emit("CLIENT_SEND_TYPING", "show");

    clearTimeout(timeOut);

    timeOut = setTimeout(() => {
        socket.emit("CLIENT_SEND_TYPING", "hidden")
    }, 3000);
}
// End showTyping
// Insert Icon To Input
const emojiPicker = document.querySelector("emoji-picker");
const inputChat = document.querySelector(".chat .inner-form input[name='content']");
if (emojiPicker) {
    emojiPicker.addEventListener("emoji-click", (event) => {
        const icon = event.detail.unicode;
        inputChat.value = inputChat.value + icon;
        
        const end = inputChat.value.length;
        inputChat.setSelectionRange(end, end);
        inputChat.focus();

        showTyping();
    });
}
// End Insert Icon To Input

//End show emoji

// box Typing 
// Input chat
var timeOut;
inputChat.addEventListener("keyup", () => {
    showTyping();
});

// End input chat
// End box typing

// SERVER_RETURN_TYPING
const elementListTyping = document.querySelector(".chat .inner-list-typing");
if (elementListTyping) {
    socket.on("SERVER_RETURN_TYPING", (data) => {
        // console.log(data);
        if (data.type == "show") {
            const existTyping = elementListTyping.querySelector(`[user-id="${data.userId}"]`);
            const body = document.querySelector(".chat .inner-body")
            if (!existTyping) {
                const boxTyping = document.createElement("div");
                boxTyping.classList.add("box-typing");

                boxTyping.setAttribute("user-id", data.userId);

                boxTyping.innerHTML = ` 
                <div class="inner-name">${data.fullName}</div>
                <div class="inner-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
                `;

                elementListTyping.appendChild(boxTyping);
                body.scrollTop = body.scrollHeight;

            }

        } else {
            const boxTypingRemove = elementListTyping.querySelector(`[user-id="${data.userId}"]`);

            if (boxTypingRemove) {
                elementListTyping.removeChild(boxTypingRemove);
            }
        };
    });
}

// End SERVER_RETURN_TYPING

// Preview full images
const bodyChatPreviewImage = document.querySelector(".chat .inner-body");
if(bodyChatPreviewImage){
    const gallery = new Viewer(bodyChatPreviewImage);
}

// End Preview full images
