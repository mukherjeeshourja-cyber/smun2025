// Theme Toggle
const toggleBtn = document.getElementById('theme-toggle');
const body = document.body;

if (localStorage.getItem("theme") === "light") {
  body.classList.add("light-theme");
  toggleBtn.textContent = "☀️";
} else {
  toggleBtn.textContent = "🌙";
}

toggleBtn.addEventListener("click", () => {
  body.classList.toggle("light-theme");
  if (body.classList.contains("light-theme")) {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "☀️";
  } else {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "🌙";
  }
});

// Committee Validation
const firstCommittee = document.getElementById("committee1");
const secondCommittee = document.getElementById("committee2");

function validateCommittees() {
  if (firstCommittee.value && secondCommittee.value && firstCommittee.value === secondCommittee.value) {
    alert("First and Second Preferred Committees must be different!");
    secondCommittee.value = "";
    secondCommittee.focus();
  }
}

firstCommittee.addEventListener("change", validateCommittees);
secondCommittee.addEventListener("change", validateCommittees);
