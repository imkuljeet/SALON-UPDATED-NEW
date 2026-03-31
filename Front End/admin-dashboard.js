document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in as admin.");
    window.location.href = "login.html";
    return;
  }

  // Load all services and render them in a table
  async function loadServices() {
    try {
      const response = await axios.get(
        "http://localhost:3000/service/get-services",
        {
          headers: { Authorization: token },
        }
      );
      const services = response.data.services;
      const listBody = document.getElementById("serviceList");
      listBody.innerHTML = "";

      if (!services || services.length === 0) {
        listBody.innerHTML = `<tr><td colspan="4">No services listed yet.</td></tr>`;
      } else {
        services.forEach((service) => {
          const row = document.createElement("tr");
          row.innerHTML = `
              <td>${service.name}</td>
              <td>${service.description}</td>
              <td>₹${service.price}</td>
              <td>
                <button class="editBtn">Edit</button>
                <button class="deleteBtn">Delete</button>
              </td>
            `;

          // Attach listeners for edit and delete
          row
            .querySelector(".editBtn")
            .addEventListener("click", () => editService(service.id));
          row
            .querySelector(".deleteBtn")
            .addEventListener("click", () => deleteService(service.id));

          listBody.appendChild(row);
        });
      }
    } catch (error) {
      alert(
        "Failed to load services: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Delete service
  async function deleteService(id) {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await axios.delete(`http://localhost:3000/service/delete-service/${id}`, {
        headers: { Authorization: token },
      });
      alert("Service deleted successfully");
      loadServices();
    } catch (error) {
      alert(
        "Failed to delete service: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Edit service
  async function editService(id) {
    try {
      const response = await axios.get(
        `http://localhost:3000/service/get-service/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      const service = response.data.service;

      // Show form and pre-fill values
      document.getElementById("formContainer").style.display = "block";
      document.getElementById("name").value = service.name;
      document.getElementById("description").value = service.description;
      document.getElementById("price").value = service.price;

      // Override form submit for update
      document.getElementById("serviceForm").onsubmit = async (e) => {
        e.preventDefault();
        const data = {
          name: e.target.name.value,
          description: e.target.description.value,
          price: e.target.price.value,
        };
        try {
          await axios.put(
            `http://localhost:3000/service/edit-service/${id}`,
            data,
            {
              headers: { Authorization: token },
            }
          );
          alert("Service updated successfully");
          e.target.reset();
          document.getElementById("formContainer").style.display = "none";
          loadServices();
        } catch (error) {
          alert(
            "Failed to update service: " +
              (error.response?.data.message || error.message)
          );
        }
      };
    } catch (error) {
      alert(
        "Failed to fetch service details: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Toggle form visibility
  document.getElementById("toggleFormBtn").addEventListener("click", () => {
    const formContainer = document.getElementById("formContainer");
    formContainer.style.display =
      formContainer.style.display === "none" ? "block" : "none";

    // Reset form to "Add" mode
    document.getElementById("serviceForm").onsubmit = async (e) => {
      e.preventDefault();
      const data = {
        name: e.target.name.value,
        description: e.target.description.value,
        price: e.target.price.value,
      };
      try {
        const response = await axios.post(
          "http://localhost:3000/service/add-service",
          data,
          {
            headers: { Authorization: token },
          }
        );
        alert(response.data.message);
        e.target.reset();
        document.getElementById("formContainer").style.display = "none";
        loadServices();
      } catch (error) {
        alert(
          "Failed to add service: " +
            (error.response?.data.message || error.message)
        );
      }
    };
  });

  // Toggle staff form visibility
  document
    .getElementById("toggleStaffFormBtn")
    .addEventListener("click", () => {
      const staffFormContainer = document.getElementById("staffFormContainer");
      staffFormContainer.style.display =
        staffFormContainer.style.display === "none" ? "block" : "none";

      // Reset form submit for "Add Staff"
      document.getElementById("staffForm").onsubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        const data = {
          name: e.target.staffName.value,
          specialization: e.target.specialization.value,
          experience: e.target.experience.value,
          bio: e.target.bio.value,
        };
        try {
          const response = await axios.post(
            "http://localhost:3000/staff/add-staff",
            data,
            {
              headers: { Authorization: token },
            }
          );
          alert(response.data.message);
          e.target.reset();
          document.getElementById("staffFormContainer").style.display = "none";
          // Optionally reload staff list if you display it
        } catch (error) {
          alert(
            "Failed to add staff: " +
              (error.response?.data.message || error.message)
          );
        }
      };
    });

  //--------

  // Load all staff and render them in a table
  async function loadStaff() {
    try {
      const response = await axios.get(
        "http://localhost:3000/staff/get-staff",
        {
          headers: { Authorization: token },
        }
      );
      const staffMembers = response.data.staff;
      const staffBody = document.getElementById("staffList");
      staffBody.innerHTML = "";

      if (!staffMembers || staffMembers.length === 0) {
        staffBody.innerHTML = `<tr><td colspan="5">No staff members listed yet.</td></tr>`;
      } else {
        staffMembers.forEach((staff) => {
          const row = document.createElement("tr");
          row.innerHTML = `
          <td>${staff.name}</td>
          <td>${staff.specialization}</td>
          <td>${staff.experience}</td>
          <td>${staff.bio}</td>
          <td>
            <button class="editStaffBtn">Edit</button>
            <button class="deleteStaffBtn">Delete</button>
          </td>
        `;

          // Attach listeners for edit and delete
          row
            .querySelector(".editStaffBtn")
            .addEventListener("click", () => editStaff(staff.id));
          row
            .querySelector(".deleteStaffBtn")
            .addEventListener("click", () => deleteStaff(staff.id));

          staffBody.appendChild(row);
        });
      }
    } catch (error) {
      alert(
        "Failed to load staff: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Delete staff
  async function deleteStaff(id) {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    try {
      await axios.delete(`http://localhost:3000/staff/delete-staff/${id}`, {
        headers: { Authorization: token },
      });
      alert("Staff member deleted successfully");
      loadStaff();
    } catch (error) {
      alert(
        "Failed to delete staff: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Edit staff
  async function editStaff(id) {
    try {
      const response = await axios.get(
        `http://localhost:3000/staff/get-staff/${id}`,
        {
          headers: { Authorization: token },
        }
      );
      const staff = response.data.staff;

      // Show form and pre-fill values
      document.getElementById("staffFormContainer").style.display = "block";
      document.getElementById("staffName").value = staff.name;
      document.getElementById("specialization").value = staff.specialization;
      document.getElementById("experience").value = staff.experience;
      document.getElementById("bio").value = staff.bio;

      // Override form submit for update
      document.getElementById("staffForm").onsubmit = async (e) => {
        e.preventDefault();
        const data = {
          name: e.target.staffName.value,
          specialization: e.target.specialization.value,
          experience: e.target.experience.value,
          bio: e.target.bio.value,
        };
        try {
          await axios.put(
            `http://localhost:3000/staff/edit-staff/${id}`,
            data,
            {
              headers: { Authorization: token },
            }
          );
          alert("Staff updated successfully");
          e.target.reset();
          document.getElementById("staffFormContainer").style.display = "none";
          loadStaff();
        } catch (error) {
          alert(
            "Failed to update staff: " +
              (error.response?.data.message || error.message)
          );
        }
      };
    } catch (error) {
      alert(
        "Failed to fetch staff details: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });

  // Initial load
  loadServices();
  loadStaff();
});
