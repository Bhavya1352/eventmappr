const themeToggle = document.getElementById("themeToggle");

themeToggle.addEventListener("click", () => {
document.body.classList.toggle("dark-mode");

if (document.body.classList.contains("dark-mode")) {
    themeToggle.textContent = "☀️";
    themeToggle.classList.replace("btn-light", "btn-dark");
} else {
    themeToggle.textContent = "🌙";
    themeToggle.classList.replace("btn-dark", "btn-light");
}
});