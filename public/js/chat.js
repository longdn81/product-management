// CLIENT_SENT
const formSendData = document.querySelector(".chat .inner-form");
if(formSendData){
    formSendData.addEventListener("submit" , (e) => {
        e.preventDefault();
        const content = e.target.elements.content.value ;
        if(content) {
            socket.emit("CLIENT_SENT", content);
            e.target.elements.content.value = "";
        }
    });
   
}
//End CLIENT_SENT

// SERVER_RETURN
socket.on("SERVER_RETURN", (data) => {
    const myId = document.querySelector("[my-id]").getAttribute("my-id");
    const body = document.querySelector(".chat .inner-body")
    
    const div = document.createElement("div");
    let htmlFullName = "" ;

    if(myId == data.userId){
        div.classList.add("inner-outgoing")
    }else{
        htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
        div.classList.add("inner-incoming")
    };
    div.innerHTML = `
        ${htmlFullName}
        <div class="inner-content">${data.content}</div>
    `;

    body.appendChild(div);
    body.scrollTop = body.scrollHeight;

});
// End SERVER_RETURN
// Scroll chat 
const bodyChat = document.querySelector(".chat .inner-body")
if(bodyChat){
    bodyChat.scrollTop = bodyChat.scrollHeight;
}
// end Scroll