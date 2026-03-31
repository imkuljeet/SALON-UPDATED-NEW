const form = document.getElementById("signupForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    fullname: e.target.fullname.value,
    email: e.target.email.value,
    phone: e.target.phone.value,
    password: e.target.password.value,
    role: e.target.role.value
  };

  try {
    const response = await axios.post("http://localhost:3000/user/signup", data);
    alert(response.data.message);
    window.location.href = "login.html";
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Network error: " + error.message);
    }
  }
});
