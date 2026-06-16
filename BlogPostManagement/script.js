let posts = JSON.parse(localStorage.getItem("posts")) || [];
let editIndex = -1;

const form = document.getElementById("blogForm");
const title = document.getElementById("title");
const author = document.getElementById("author");
const date = document.getElementById("date");
const content = document.getElementById("content");

const previewTitle = document.getElementById("previewTitle");
const previewAuthor = document.getElementById("previewAuthor");
const previewDate = document.getElementById("previewDate");
const previewContent = document.getElementById("previewContent");

const postsContainer = document.getElementById("postsContainer");

title.addEventListener("input", updatePreview);
author.addEventListener("input", updatePreview);
date.addEventListener("input", updatePreview);
content.addEventListener("input", updatePreview);

function updatePreview() {
    previewTitle.textContent = title.value || "Untitled Post";
    previewAuthor.textContent = author.value || "Anonymous";
    previewContent.textContent = content.value || "Start writing to see preview...";

    if (date.value) {
        const formattedDate = new Date(date.value).toDateString();
        previewDate.textContent = formattedDate;
    } else {
        previewDate.textContent = "No date selected";
    }
}

form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (
        title.value.trim() === "" ||
        author.value.trim() === "" ||
        date.value.trim() === "" ||
        content.value.trim() === ""
    ) {
        alert("❌ Please fill all fields before publishing!");
        return;
    }

    const post = {
        title: title.value,
        author: author.value,
        date: date.value,
        content: content.value
    };

    if (editIndex === -1) {
        posts.push(post);
    } else {
        posts[editIndex] = post;
        editIndex = -1;
    }

    saveToLocalStorage();
    renderPosts();
    form.reset();
    updatePreview();
});

function saveToLocalStorage() {
    localStorage.setItem("posts", JSON.stringify(posts));
}

function renderPosts() {
    postsContainer.innerHTML = "";

    posts.forEach((post, index) => {
        const card = document.createElement("div");
        card.classList.add("post-card");

        card.innerHTML = `
            <h3>${post.title}</h3>
            <small>${new Date(post.date).toDateString()}</small>
            <p>${post.content.substring(0, 100)}...</p>
            <p><b>Author:</b> ${post.author}</p>

            <button onclick="editPost(${index})">Edit</button>
            <button onclick="deletePost(${index})" style="background:red;">Delete</button>
        `;

        postsContainer.appendChild(card);
    });
}

function deletePost(index) {
    if (confirm("Are you sure you want to delete this post?")) {
        posts.splice(index, 1);
        saveToLocalStorage();
        renderPosts();
    }
}

function editPost(index) {
    const post = posts[index];

    title.value = post.title;
    author.value = post.author;
    date.value = post.date;
    content.value = post.content;

    editIndex = index;
    updatePreview();

    window.scrollTo({ top: 0, behavior: "smooth" });
}

renderPosts();
updatePreview();