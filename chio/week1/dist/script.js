"use strict";
const input = document.querySelector("input");
const todo = document.querySelector(".todo");
const done = document.querySelector(".done");
function addItem(e) {
    if (e.key === "Enter" && input && todo) {
        const text = input.value.trim();
        const item = document.createElement("div");
        const span = document.createElement("span");
        const button = document.createElement("button");
        item.style.marginBottom = "5px";
        span.style.marginRight = "10px";
        span.textContent = text;
        button.textContent = "완료";
        item.appendChild(span);
        item.appendChild(button);
        todo.appendChild(item);
        input.value = "";
    }
}
if (input)
    input.addEventListener("keydown", addItem);
if (todo) {
    todo.addEventListener("click", (e) => {
        const target = e.target;
        if (target instanceof HTMLButtonElement && done) {
            const item = target.parentElement;
            if (!item)
                return;
            const lastElementChild = item.lastElementChild;
            if (!lastElementChild)
                return;
            item.remove();
            lastElementChild.textContent = "삭제";
            done.appendChild(item);
        }
    });
}
if (done) {
    done.addEventListener("click", (e) => {
        const target = e.target;
        if (target instanceof HTMLButtonElement) {
            const item = target.parentElement;
            if (!item)
                return;
            item.remove();
        }
    });
}
