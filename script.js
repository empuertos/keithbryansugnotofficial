const CHANNEL_ID = "UCefBEmdYeUm65g9LXWkTFrw";
const YT_API_KEY = "AIzaSyCsn3Xvn8r9vMNn4GgxOU7PUb3xyTpEr6U";

const ytPlayer = document.getElementById("ytPlayer");
const liveStatus = document.getElementById("liveStatus");
const closeBtn = document.getElementById("ytCloseBtn");
const minimizeBtn = document.getElementById("ytMinimizeBtn");
const ytMiniIcon = document.getElementById("ytMiniIcon");

let isMinimized = false;
let idleTimer = null;

// Load latest YouTube video
fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`)
.then(res => res.text())
.then(data => {
    const videoId = data.match(/<yt:videoId>(.*?)<\/yt:videoId>/)?.[1] || "dQw4w9WgXcQ";
    ytPlayer.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&mute=1";
    liveStatus.innerText = "Live Performance (Floating Player)";
});

// Close player
closeBtn.addEventListener("click", () => {
    ytPlayer.style.display = "none";
    closeBtn.style.display = "none";
    minimizeBtn.style.display = "none";
    ytMiniIcon.style.display = "none";
});

// Minimize / maximize
minimizeBtn.addEventListener("click", () => {
    if(!isMinimized){
        localStorage.setItem("lastX", ytPlayer.style.left || "");
        localStorage.setItem("lastY", ytPlayer.style.top || "");
        ytPlayer.style.width = "200px";
        ytPlayer.style.height = "113px";
        ytPlayer.style.bottom = "20px";
        ytPlayer.style.right = "20px";
        ytPlayer.style.left = "auto";
        ytPlayer.style.top = "auto";
        ytPlayer.classList.add("minimized");
        ytPlayer.classList.remove("idle");
        ytMiniIcon.style.display = "flex";
        startIdleTimer();
        isMinimized = true;
    } else restorePlayer();
});

// Mini icon click restores player
ytMiniIcon.addEventListener("click", restorePlayer);

function restorePlayer(){
    ytPlayer.style.width = "450px";
    ytPlayer.style.height = "253px";
    const lastX = localStorage.getItem("lastX");
    const lastY = localStorage.getItem("lastY");
    if(lastX && lastY){
        ytPlayer.style.left = lastX;
        ytPlayer.style.top = lastY;
        ytPlayer.style.right = "auto";
        ytPlayer.style.bottom = "auto";
    }
    ytPlayer.classList.remove("minimized","idle");
    ytMiniIcon.style.display = "flex";
    clearTimeout(idleTimer);
    isMinimized = false;
}

// Auto-hide player and icon after 3s idle
function startIdleTimer(){
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
        if(isMinimized) ytPlayer.classList.add("idle");
    }, 3000);
}

// Reset idle on hover
ytPlayer.addEventListener("mouseenter", () => {
    if(isMinimized){
        ytPlayer.classList.remove("idle");
        startIdleTimer();
    }
});

// ---------- Draggable ----------
let isDragging = false;
let offsetX, offsetY;

const savedX = localStorage.getItem("ytPlayerX");
const savedY = localStorage.getItem("ytPlayerY");
if(savedX && savedY){
    ytPlayer.style.left = savedX + "px";
    ytPlayer.style.top = savedY + "px";
    ytPlayer.style.right = "auto";
    ytPlayer.style.bottom = "auto";
}

ytPlayer.addEventListener("mousedown", (e) => {
    isDragging = true;
    offsetX = e.clientX - ytPlayer.getBoundingClientRect().left;
    offsetY = e.clientY - ytPlayer.getBoundingClientRect().top;
});
document.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    let x = e.clientX - offsetX;
    let y = e.clientY - offsetY;
    const maxX = window.innerWidth - ytPlayer.offsetWidth;
    const maxY = window.innerHeight - ytPlayer.offsetHeight;
    x = Math.max(0, Math.min(x,maxX));
    y = Math.max(0, Math.min(y,maxY));
    ytPlayer.style.left = x + "px";
    ytPlayer.style.top = y + "px";
    ytPlayer.style.right = "auto";
    ytPlayer.style.bottom = "auto";
    localStorage.setItem("ytPlayerX", x);
    localStorage.setItem("ytPlayerY", y);
});
document.addEventListener("mouseup", () => { isDragging = false; });

// ---------- YouTube Subscriber Count ----------
const ytSubsEl = document.getElementById("ytSubs");
async function updateYT(){
    try{
        const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${YT_API_KEY}`);
        const data = await res.json();
        ytSubsEl.innerText = parseInt(data.items[0].statistics.subscriberCount).toLocaleString();
    } catch(e){ytSubsEl.innerText="N/A"; console.log(e);}
}
updateYT(); setInterval(updateYT,120000);