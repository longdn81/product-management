// change status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]");
if (buttonChangeStatus) {
    const formChangeStatus = document.querySelector("#form-change-status");
    const path = formChangeStatus.getAttribute("data-path");


    buttonChangeStatus.forEach(button => {
        button.addEventListener("click", () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent == "active" ? "inactive" : "active";
            // console.log(statusChange);
            // console.log(id);

            const action = path + `/${statusChange}/${id}?_method=PATCH`
            formChangeStatus.action = action;

            formChangeStatus.submit();
        });
    });
}
// end change status




// Delete item
const buttonsDelete = document.querySelectorAll("[button-delete]");
if (buttonsDelete.length > 0) {
    buttonsDelete.forEach(button => {
        const formDeleteItem = document.querySelector("#form-delete-item");
        const path = formDeleteItem.getAttribute("data-path");


        button.addEventListener("click", () => {
            const isConfirm = confirm("Bạn có chắc muốn xóa sản phẩm này ?");
            if (isConfirm) {
                const id = button.getAttribute("data-id");

                const action = `${path}/${id}?_method=DELETE`;
                formDeleteItem.action = action;

                formDeleteItem.submit();
            }
        })
    })
}
// End delete item