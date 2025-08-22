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



