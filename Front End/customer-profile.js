const token = localStorage.getItem("token");
if (!token) {
  alert("You must be logged in to access this page.");
  window.location.href = "login.html";
}

async function loadProfile() {
  try {
    const response = await axios.get("http://localhost:3000/customer/profile", {
      headers: { Authorization: token }
    });

    const user = response.data.user;
    document.getElementById("fullname").value = user.fullname;
    document.getElementById("email").value = user.email;
    document.getElementById("phone").value = user.phone;
    document.getElementById("preferences").value = user.Preferences?.preferences || "";
  } catch (error) {
    alert("Failed to load profile: " + (error.response?.data.message || error.message));
  }
}

document.getElementById("profileForm").addEventListener("submit", async function(e) {
  e.preventDefault();

  const data = {
    fullname: e.target.fullname.value,
    phone: e.target.phone.value,
    preferences: e.target.preferences.value
  };

  try {
    const response = await axios.put("http://localhost:3000/customer/profile", data, {
      headers: { Authorization: token }   
    });

    alert(response.data.message);
    window.location.href ='customer-dashboard.html';
  } catch (error) {
    alert("Update failed: " + (error.response?.data.message || error.message));
  }
});

loadProfile();
