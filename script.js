/* =====================================================
   FACEBOOK LITE - SCRIPT.JS
   Interactive Social Media Website
===================================================== */


/* =====================================================
   GLOBAL VARIABLES
===================================================== */

let currentUser = {
    name: "Sania",
    initial: "S"
};

let posts = [];
let notificationCount = 5;


/* =====================================================
   DOM READY
===================================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadSavedPosts();

    updateNotificationBadge();

    setupSearch();

    setupKeyboardShortcuts();

    setupOutsideClick();

});


/* =====================================================
   NOTIFICATIONS
===================================================== */

function toggleNotifications() {

    const panel =
        document.getElementById("notificationPanel");

    if (!panel) return;

    panel.classList.toggle("show");

}


function updateNotificationBadge() {

    const badge =
        document.querySelector(".badge");

    if (!badge) return;

    if (notificationCount > 0) {

        badge.textContent = notificationCount;
        badge.style.display = "flex";

    } else {

        badge.style.display = "none";

    }

}


function clearNotifications() {

    notificationCount = 0;

    updateNotificationBadge();

}


/* =====================================================
   MENU
===================================================== */

function toggleMenu() {

    const menu =
        document.getElementById("menuPopup");

    if (!menu) return;

    menu.classList.toggle("show");

}


/* =====================================================
   LIKE SYSTEM
===================================================== */

function likePost(button) {

    if (!button) return;

    const post =
        button.closest(".post");

    if (!post) return;

    const icon =
        button.querySelector("i");

    const stats =
        post.querySelector(".post-stats span");

    let count = getPostLikeCount(post);

    if (button.classList.contains("liked")) {

        button.classList.remove("liked");

        if (icon) {

            icon.className =
                "fa-regular fa-thumbs-up";

        }

        count--;

    } else {

        button.classList.add("liked");

        if (icon) {

            icon.className =
                "fa-solid fa-thumbs-up";

        }

        count++;

    }

    if (stats) {

        stats.innerHTML =
            `👍 ❤️ ${count}`;

    }

}


function getPostLikeCount(post) {

    const stats =
        post.querySelector(".post-stats span");

    if (!stats) return 0;

    const text =
        stats.textContent;

    const numbers =
        text.match(/\d+/g);

    if (!numbers) return 0;

    return parseInt(numbers[0]) || 0;

}


/* =====================================================
   COMMENTS
===================================================== */

function toggleComments(id) {

    const comments =
        document.getElementById(id);

    if (!comments) return;

    comments.classList.toggle("show");

}


function commentEnter(event, input) {

    if (!event) return;

    if (event.key !== "Enter") return;

    if (!input) return;

    const text =
        input.value.trim();

    if (text === "") return;

    addComment(input, text);

    input.value = "";

}


function addComment(input, text) {

    const comments =
        input.closest(".comments");

    if (!comments) return;

    const comment =
        document.createElement("div");

    comment.className =
        "comment";

    comment.innerHTML = `

        <div class="small-avatar">
            ${escapeHTML(currentUser.initial)}
        </div>

        <div class="comment-body">

            <strong>
                ${escapeHTML(currentUser.name)}
            </strong>

            <p>
                ${escapeHTML(text)}
            </p>

        </div>

    `;

    const inputBox =
        input.parentElement;

    comments.insertBefore(
        comment,
        inputBox
    );

}


/* =====================================================
   CREATE POST
===================================================== */

function createPost() {

    const input =
        document.getElementById("postInput");

    if (!input) return;

    const text =
        input.value.trim();

    if (!text) {

        showToast(
            "Please write something first."
        );

        input.focus();

        return;

    }

    const postData = {

        id:
            "post-" +
            Date.now(),

        author:
            currentUser.name,

        text:
            text,

        likes:
            0,

        created:
            new Date().toISOString()

    };

    posts.unshift(postData);

    savePosts();

    renderNewPost(postData);

    input.value = "";

    showToast(
        "Your post was published!"
    );

}


function renderNewPost(postData) {

    const feed =
        document.querySelector(".feed");

    const createPostBox =
        document.querySelector(".create-post");

    if (!feed || !createPostBox) return;

    const post =
        document.createElement("article");

    post.className =
        "post new-post";

    post.dataset.postId =
        postData.id;

    post.innerHTML = `

        <div class="post-header">

            <div class="avatar">
                ${escapeHTML(postData.author.charAt(0))}
            </div>

            <div class="post-user">

                <strong>
                    ${escapeHTML(postData.author)}
                </strong>

                <small>
                    Just now ·
                    <i class="fa-solid fa-earth-americas"></i>
                </small>

            </div>

            <button
                class="more-btn"
                onclick="openPostMenu(this)"
            >
                <i class="fa-solid fa-ellipsis"></i>
            </button>

        </div>


        <div class="post-text">

            <p>
                ${escapeHTML(postData.text)}
            </p>

        </div>


        <div class="post-stats">

            <span>
                👍 ${postData.likes}
            </span>

            <span>
                0 comments
            </span>

        </div>


        <div class="post-actions">

            <button
                onclick="likePost(this)"
            >

                <i class="fa-regular fa-thumbs-up"></i>
                Like

            </button>


            <button
                onclick="showToast('Comment section opened')"
            >

                <i class="fa-regular fa-comment"></i>
                Comment

            </button>


            <button
                onclick="sharePost()"
            >

                <i class="fa-solid fa-share"></i>
                Share

            </button>

        </div>

    `;

    feed.insertBefore(
        post,
        createPostBox.nextElementSibling
    );

}


/* =====================================================
   SAVE POSTS
===================================================== */

function savePosts() {

    try {

        localStorage.setItem(
            "facebookLitePosts",
            JSON.stringify(posts)
        );

    } catch (error) {

        console.log(
            "Could not save posts.",
            error
        );

    }

}


function loadSavedPosts() {

    try {

        const saved =
            localStorage.getItem(
                "facebookLitePosts"
            );

        if (!saved) return;

        posts =
            JSON.parse(saved);

        if (!Array.isArray(posts)) {

            posts = [];

        }

        posts.reverse().forEach(
            post => {

                renderNewPost(post);

            }
        );

        posts.reverse();

    } catch (error) {

        console.log(
            "Could not load saved posts.",
            error
        );

    }

}


/* =====================================================
   SHARE
===================================================== */

async function sharePost() {

    const shareData = {

        title:
            "Facebook Lite",

        text:
            "Check out this post!",

        url:
            window.location.href

    };

    try {

        if (
            navigator.share
        ) {

            await navigator.share(
                shareData
            );

            showToast(
                "Shared successfully!"
            );

        } else {

            await copyToClipboard(
                window.location.href
            );

            showToast(
                "Post link copied!"
            );

        }

    } catch (error) {

        console.log(
            "Share cancelled."
        );

    }

}


/* =====================================================
   COPY TO CLIPBOARD
===================================================== */

async function copyToClipboard(text) {

    try {

        await navigator.clipboard.writeText(
            text
        );

    } catch (error) {

        const textarea =
            document.createElement("textarea");

        textarea.value =
            text;

        document.body.appendChild(
            textarea
        );

        textarea.select();

        document.execCommand(
            "copy"
        );

        textarea.remove();

    }

}


/* =====================================================
   PHOTO
===================================================== */

function addPhoto() {

    const input =
        document.createElement("input");

    input.type =
        "file";

    input.accept =
        "image/*";

    input.onchange =
        function () {

            const file =
                this.files[0];

            if (!file) return;

            const reader =
                new FileReader();

            reader.onload =
                function (event) {

                    createMediaPost(
                        event.target.result,
                        "image"
                    );

                };

            reader.readAsDataURL(
                file
            );

        };

    input.click();

}


/* =====================================================
   VIDEO
===================================================== */

function addVideo() {

    const input =
        document.createElement("input");

    input.type =
        "file";

    input.accept =
        "video/*";

    input.onchange =
        function () {

            const file =
                this.files[0];

            if (!file) return;

            const url =
                URL.createObjectURL(
                    file
                );

            createMediaPost(
                url,
                "video"
            );

        };

    input.click();

}


/* =====================================================
   CREATE MEDIA POST
===================================================== */

function createMediaPost(
    source,
    type
) {

    const feed =
        document.querySelector(".feed");

    const createPostBox =
        document.querySelector(".create-post");

    if (!feed || !createPostBox) return;

    const post =
        document.createElement("article");

    post.className =
        "post";

    let mediaHTML = "";

    if (type === "image") {

        mediaHTML = `

            <img
                src="${source}"
                alt="Uploaded image"
                style="
                    width:100%;
                    max-height:600px;
                    object-fit:cover;
                    display:block;
                "
            >

        `;

    }

    if (type === "video") {

        mediaHTML = `

            <video
                src="${source}"
                controls
                style="
                    width:100%;
                    max-height:600px;
                    display:block;
                "
            ></video>

        `;

    }

    post.innerHTML = `

        <div class="post-header">

            <div class="avatar">
                ${escapeHTML(currentUser.initial)}
            </div>

            <div class="post-user">

                <strong>
                    ${escapeHTML(currentUser.name)}
                </strong>

                <small>
                    Just now ·
                    <i class="fa-solid fa-earth-americas"></i>
                </small>

            </div>

        </div>

        ${mediaHTML}

        <div class="post-stats">

            <span>
                👍 0
            </span>

            <span>
                0 comments
            </span>

        </div>

        <div class="post-actions">

            <button onclick="likePost(this)">
                <i class="fa-regular fa-thumbs-up"></i>
                Like
            </button>

            <button onclick="showToast('Comment section opened')">
                <i class="fa-regular fa-comment"></i>
                Comment
            </button>

            <button onclick="sharePost()">
                <i class="fa-solid fa-share"></i>
                Share
            </button>

        </div>

    `;

    feed.insertBefore(
        post,
        createPostBox.nextElementSibling
    );

    showToast(
        "Media post created!"
    );

}


/* =====================================================
   FEELING
===================================================== */

function addFeeling() {

    const feelings = [

        "😊 Feeling happy",
        "😂 Feeling funny",
        "❤️ Feeling loved",
        "😎 Feeling cool",
        "🔥 Feeling excited",
        "🥰 Feeling blessed",
        "🎉 Celebrating",
        "💪 Feeling strong"

    ];

    const choice =
        prompt(
            "Choose a feeling:\n\n" +
            feelings.join("\n")
        );

    if (!choice) return;

    const input =
        document.getElementById("postInput");

    if (!input) return;

    input.value =
        choice;

    input.focus();

}


/* =====================================================
   SEARCH
===================================================== */

function setupSearch() {

    const input =
        document.getElementById(
            "searchInput"
        );

    if (!input) return;

    input.addEventListener(
        "input",
        function () {

            const query =
                this.value
                    .toLowerCase()
                    .trim();

            const posts =
                document.querySelectorAll(
                    ".post"
                );

            posts.forEach(
                post => {

                    const text =
                        post.innerText
                            .toLowerCase();

                    if (
                        query === "" ||
                        text.includes(query)
                    ) {

                        post.style.display =
                            "";

                    } else {

                        post.style.display =
                            "none";

                    }

                }
            );

        }
    );

}


/* =====================================================
   PAGE NAVIGATION
===================================================== */

function showPage(page) {

    if (page === "home") {

        window.scrollTo({

            top: 0,

            behavior: "smooth"

        });

        return;

    }

    if (page === "friends") {

        showToast(
            "Friends page opened."
        );

        return;

    }

    if (page === "messages") {

        showToast(
            "Messenger opened."
        );

        return;

    }

}


/* =====================================================
   POST MENU
===================================================== */

function openPostMenu(button) {

    const menu =
        document.createElement("div");

    menu.style.position =
        "absolute";

    menu.style.background =
        "white";

    menu.style.padding =
        "8px";

    menu.style.borderRadius =
        "10px";

    menu.style.boxShadow =
        "0 5px 20px rgba(0,0,0,.2)";

    menu.style.zIndex =
        "5000";

    menu.innerHTML = `

        <button
            style="
                border:none;
                background:white;
                padding:10px;
                cursor:pointer;
                display:block;
                width:100%;
                text-align:left;
            "
            onclick="showToast('Post saved!'); this.parentElement.remove();"
        >
            🔖 Save Post
        </button>

        <button
            style="
                border:none;
                background:white;
                padding:10px;
                cursor:pointer;
                display:block;
                width:100%;
                text-align:left;
            "
            onclick="showToast('Post reported.'); this.parentElement.remove();"
        >
            🚩 Report Post
        </button>

    `;

    document.body.appendChild(
        menu
    );

    const rect =
        button.getBoundingClientRect();

    menu.style.top =
        (rect.bottom + window.scrollY) +
        "px";

    menu.style.left =
        (rect.left + window.scrollX - 150) +
        "px";

}


/* =====================================================
   DARK MODE
===================================================== */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark-mode"
    );

    const enabled =
        document.body.classList.contains(
            "dark-mode"
        );

    localStorage.setItem(
        "facebookLiteDarkMode",
        enabled
    );

}


/* Load Dark Mode */

function loadDarkMode() {

    const enabled =
        localStorage.getItem(
            "facebookLiteDarkMode"
        );

    if (enabled === "true") {

        document.body.classList.add(
            "dark-mode"
        );

    }

}

loadDarkMode();


/* =====================================================
   TOAST MESSAGE
===================================================== */

function showToast(message) {

    let toast =
        document.getElementById(
            "toastMessage"
        );

    if (!toast) {

        toast =
            document.createElement(
                "div"
            );

        toast.id =
            "toastMessage";

        toast.style.position =
            "fixed";

        toast.style.bottom =
            "85px";

        toast.style.left =
            "50%";

        toast.style.transform =
            "translateX(-50%)";

        toast.style.background =
            "#1c1e21";

        toast.style.color =
            "white";

        toast.style.padding =
            "12px 20px";

        toast.style.borderRadius =
            "25px";

        toast.style.fontSize =
            "14px";

        toast.style.zIndex =
            "99999";

        toast.style.boxShadow =
            "0 5px 20px rgba(0,0,0,.25)";

        document.body.appendChild(
            toast
        );

    }

    toast.textContent =
        message;

    toast.style.display =
        "block";

    clearTimeout(
        window.toastTimer
    );

    window.toastTimer =
        setTimeout(
            () => {

                toast.style.display =
                    "none";

            },
            2500
        );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );

    div.textContent =
        String(text);

    return div.innerHTML;

}


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

func