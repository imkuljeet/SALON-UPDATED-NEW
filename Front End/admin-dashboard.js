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
      const section = document.getElementById("serviceSection");

      listBody.innerHTML = "";

      if (!services || services.length === 0) {
        section.style.display = "none"; // hide if empty
      } else {
        section.style.display = "block"; // show if data exists
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
          loadStaff();
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
      const section = document.getElementById("staffSection");

      staffBody.innerHTML = "";

      if (!staffMembers || staffMembers.length === 0) {
        section.style.display = "none"; // hide if empty
      } else {
        section.style.display = "block"; // show if data exists
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

  //--------------------------------------------------------------------

  // Toggle availability form visibility
  document
    .getElementById("toggleAvailabilityFormBtn")
    .addEventListener("click", () => {
      const formContainer = document.getElementById(
        "availabilityFormContainer"
      );
      formContainer.style.display =
        formContainer.style.display === "none" ? "block" : "none";

      // Populate staff dropdown dynamically
      axios
        .get("http://localhost:3000/staff/get-staff", {
          headers: { Authorization: token },
        })
        .then((response) => {
          const staffSelect = document.getElementById("staffSelect");
          staffSelect.innerHTML = "";
          response.data.staff.forEach((staff) => {
            const option = document.createElement("option");
            option.value = staff.id;
            option.textContent = staff.name;
            staffSelect.appendChild(option);
          });
        });
    });

  // Handle availability form submission
  document.getElementById("availabilityForm").onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      staffId: e.target.staffSelect.value,
      dayOfWeek: e.target.dayOfWeek.value,
      startTime: e.target.startTime.value,
      endTime: e.target.endTime.value,
    };
    try {
      const response = await axios.post(
        "http://localhost:3000/availability/add-availability",
        data,
        {
          headers: { Authorization: token },
        }
      );
      alert(response.data.message);
      e.target.reset();
      document.getElementById("availabilityFormContainer").style.display =
        "none";
      // Optionally reload staff availability list
      loadAvailability();
    } catch (error) {
      alert(
        "Failed to add availability: " +
          (error.response?.data.message || error.message)
      );
    }
  };

  // -------------------------------------------------------------------------

  // Load all staff availability and render them in a table
  async function loadAvailability() {
    try {
      const response = await axios.get(
        "http://localhost:3000/staff/get-staff",
        {
          headers: { Authorization: token },
        }
      );
      const staffMembers = response.data.staff;
      const listBody = document.getElementById("availabilityList");
      const section = document.getElementById("availabilitySection");

      listBody.innerHTML = "";

      let hasAvailability = false;

      for (const staff of staffMembers) {
        const availabilityRes = await axios.get(
          `http://localhost:3000/availability/${staff.id}`,
          { headers: { Authorization: token } }
        );

        const availabilitySlots = availabilityRes.data.availability;

        if (availabilitySlots && availabilitySlots.length > 0) {
          hasAvailability = true;
          availabilitySlots.forEach((slot) => {
            const row = document.createElement("tr");
            row.innerHTML = `
            <td>${staff.name}</td>
            <td>${slot.dayOfWeek}</td>
            <td>${slot.startTime}</td>
            <td>${slot.endTime}</td>
            <td>
              <button class="editAvailabilityBtn">Edit</button>
              <button class="deleteAvailabilityBtn">Delete</button>
            </td>
          `;

            row
              .querySelector(".editAvailabilityBtn")
              .addEventListener("click", () => editAvailability(slot.id));
            row
              .querySelector(".deleteAvailabilityBtn")
              .addEventListener("click", () => deleteAvailability(slot.id));

            listBody.appendChild(row);
          });
        }
      }

      // Toggle section visibility
      section.style.display = hasAvailability ? "block" : "none";
    } catch (error) {
      alert(
        "Failed to load availability: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  // Delete availability
  async function deleteAvailability(id) {
    if (!confirm("Are you sure you want to delete this availability slot?"))
      return;
    try {
      await axios.delete(`http://localhost:3000/availability/delete/${id}`, {
        headers: { Authorization: token },
      });
      alert("Availability deleted successfully");
      loadAvailability();
    } catch (error) {
      alert(
        "Failed to delete availability: " +
          (error.response?.data.message || error.message)
      );
    }
  }

  //----------------------------------------------------------------------------------------

  document.getElementById("toggleAssignServiceBtn").addEventListener("click", async () => {
    const formContainer = document.getElementById("assignServiceFormContainer");
    formContainer.style.display = formContainer.style.display === "none" ? "block" : "none";
  
    // Populate staff dropdown
    const staffRes = await axios.get("http://localhost:3000/staff/get-staff", {
      headers: { Authorization: token }
    });
    const staffSelect = document.getElementById("staffSelectAssign");
    staffSelect.innerHTML = "";
    staffRes.data.staff.forEach(staff => {
      const option = document.createElement("option");
      option.value = staff.id;
      option.textContent = staff.name;
      staffSelect.appendChild(option);
    });
  
    // Populate service dropdown
    const serviceRes = await axios.get("http://localhost:3000/service/get-services", {
      headers: { Authorization: token }
    });
    const serviceSelect = document.getElementById("serviceSelectAssign");
    serviceSelect.innerHTML = "";
    serviceRes.data.services.forEach(service => {
      const option = document.createElement("option");
      option.value = service.id;
      option.textContent = service.name;
      serviceSelect.appendChild(option);
    });
  });
  
  // Handle form submission
  document.getElementById("assignServiceForm").onsubmit = async (e) => {
    e.preventDefault();
    const data = {
      staffId: e.target.staffSelectAssign.value,
      serviceId: e.target.serviceSelectAssign.value
    };
    try {
      const response = await axios.post("http://localhost:3000/staff/assign-service", data, {
        headers: { Authorization: token }
      });
      alert(response.data.message);
      e.target.reset();
      document.getElementById("assignServiceFormContainer").style.display = "none";
    } catch (error) {
      alert("Failed to assign service: " + (error.response?.data.message || error.message));
    }
  };  

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "login.html";
  });

  // Initial load
  loadServices();
  loadStaff();
  loadAvailability();
});
