const form = document.getElementById("loginForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    email: e.target.email.value,
    password: e.target.password.value,
  };

  try {
    const response = await axios.post("http://localhost:3000/user/login", data);

    alert(response.data.message);

    localStorage.setItem("token", response.data.token);
    localStorage.setItem("role", response.data.role); 

    if (response.data.role === "admin") {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "customer-dashboard.html";
    }
  } catch (error) {
    if (error.response) {
      alert(error.response.data.message);
    } else {
      alert("Network error: " + error.message);
    }
  }
});
