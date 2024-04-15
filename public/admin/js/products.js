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

// checkbox multi 
const checkboxMulti = document.querySelector("[checkbox-multi]")
if (checkboxMulti) {
    const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']");
    const inputId = checkboxMulti.querySelectorAll("input[name='id']");

    inputCheckAll.addEventListener("click", () => {
        if (inputCheckAll.checked) {
            inputId.forEach(input => {
                input.checked = true;
            });
        } else {
            inputId.forEach(input => {
                input.checked = false;
            });
        }
    })
    inputId.forEach(input => {
        input.addEventListener("click", () => {
            const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

            if (countChecked == inputId.length) {
                inputCheckAll.checked = true;
            } else {
                inputCheckAll.checked = false;
            }
        });
    });

}
// end checkbox multi

// Form checkbox Multi
const formChangeMulti = document.querySelector("[form-change-multi]");
if (formChangeMulti) {
    formChangeMulti.addEventListener("submit", (e) => {
        e.preventDefault();

        const checkboxMulti = document.querySelector("[checkbox-multi]")
        const inputsChecked = checkboxMulti.querySelectorAll(
            "input[name='id']:checked"
        );

        const typeChange = e.target.elements.type.value;
        console.log(typeChange);
        if (typeChange == "delete-all") {
            const isConfirm = confirm("Bạn có chắc muốn xóa những sản phẩm này ?");

            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];
            const inputIds = formChangeMulti.querySelector("input[name='ids']");
            

            inputsChecked.forEach(input => {
                const id = input.value;

                if (typeChange == "change-position") {
                    const position = input.closest("tr").querySelector("input[name='position']").value;

                    
                    ids.push(`${id}-${position}`);
                } else {
                    ids.push(id);
                }


            })


            inputIds.value = ids.join(", ");

            formChangeMulti.submit();
        } else {
            alert("Vui long chon it nhat 1 ban ghi")
        }
    })
}
// End  Form checkbox Multi


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