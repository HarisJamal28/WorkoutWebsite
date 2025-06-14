document.addEventListener('DOMContentLoaded', () => {
    const baseApiUrl = 'https://workout-backend-g6t2tr83q-haris-jamals-projects.vercel.app/api/auth';

    // document.querySelectorAll('video').forEach(video => {
    //   video.addEventListener('contextmenu', e => e.preventDefault());
    // });

    // NAVIGATION (same as your existing code)
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.main-content-area .content');

    const hideAllContent = () => {
        contentSections.forEach(section => {
            section.style.display = 'none';
        });
    };

    const removeAllActiveClasses = () => {
        navLinks.forEach(link => {
            link.classList.remove('active');
        });
    };

    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                hideAllContent();
                targetSection.style.display = 'block';
                removeAllActiveClasses();
                link.classList.add('active');

            if (targetId === 'userlist') {
                fetchAndDisplayUsers();
            }
            }
        });
    });

    const initialHash = window.location.hash.substring(1);
    let initialSectionId = 'profile-section';
    if (initialHash && document.getElementById(initialHash)) {
        initialSectionId = initialHash;
    }
    const initialLink = document.querySelector(`.sidebar .nav-link[href="#${initialSectionId}"]`);
    const initialContent = document.getElementById(initialSectionId);
    if (initialContent) {
        hideAllContent();
        initialContent.style.display = 'block';
    }
    if (initialSectionId === 'userlist') {
    fetchAndDisplayUsers();
    }
    if (initialLink) {
        removeAllActiveClasses();
        initialLink.classList.add('active');
    }

     const createAdminForm = document.getElementById('createAdminForm');

  if (createAdminForm) {
    createAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = createAdminForm.elements['email'].value.trim();
      const password = createAdminForm.elements['password'].value.trim();
      const token = localStorage.getItem('token');
      const msgDiv = document.getElementById('adminCreateMessage');

      try {
        const response = await fetch(`${baseApiUrl}/create-admin`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
          msgDiv.textContent = `✅ Admin created: ${result.data.email}`;
          msgDiv.style.color = 'green';
          createAdminForm.reset();
        } else {
          msgDiv.textContent = `❌ ${result.message || 'Failed to create admin'}`;
          msgDiv.style.color = 'red';
        }
      } catch (error) {
        console.error('Admin creation failed:', error);
        msgDiv.textContent = '❌ Network error or server is down.';
        msgDiv.style.color = 'red';
      }
    });
  }

    // MESSAGE FORM SUBMISSION
    const messageForm = document.querySelector('#message-form');
    if (messageForm) {
        messageForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullName = messageForm.querySelector('input[name="fullName"]').value.trim();
            const email = messageForm.querySelector('input[name="email"]').value.trim();
            const message = messageForm.querySelector('textarea[name="message"]').value.trim();

            try {
                const res = await fetch(`${baseApiUrl}/message`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ fullName, email, message })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('Message sent successfully!');
                    messageForm.reset();
                } else {
                    alert(`Failed: ${data.message}`);
                }
            } catch (err) {
                console.error('Message submit error:', err);
                alert('An error occurred while sending your message.');
            }
        });
    }


        // USER REGISTRATION FORM SUBMISSION
    const registerForm = document.querySelector('.register-form-frame form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(registerForm);

            const userData = {
                firstName: formData.get('firstName').trim(),
                lastName: formData.get('lastName').trim(),
                username: formData.get('username').trim(),
                email: formData.get('email').trim(),
                password: formData.get('password').trim(),
                confirmpassword: formData.get('confirmpassword').trim(),
                height: parseFloat(formData.get('height')),
                initialWeight: parseFloat(formData.get('initialWeight'))  // Be careful: your input name is "intialWeight" not "initialWeight"
            };

            // Optional: check password confirmation
            if (userData.password !== userData.confirmpassword) {
                alert('Passwords do not match!');
                return;
            }

            // Remove confirmpassword before sending
            delete userData.confirmpassword;

            try {
                const response = await fetch(`${baseApiUrl}/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(userData)
                });

                const data = await response.json();

                if (response.ok) {
                    alert('Registration successful!');
                    registerForm.reset();
                    window.location.href = './login.html'; // redirect to login if needed
                } else {
                    alert(`Error: ${data.message || 'Registration failed'}`);
                    if (data.errors) {
                        console.warn('Validation errors:', data.errors);
                    }
                }
            } catch (err) {
                console.error('Registration error:', err);
                alert('An error occurred during registration.');
            }
        });
    }

        // USER LOGIN FORM SUBMISSION
    const loginForm = document.querySelector('#login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = loginForm.querySelector('input[name="email"]').value.trim();
            const password = loginForm.querySelector('input[name="password"]').value;

            try {
                const response = await fetch(`${baseApiUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // alert('Login successful!');

                    // Save the token (and optionally user info)
                    localStorage.setItem('token', data.data.token);
                    localStorage.setItem('role', data.data.user.role);
                    // localStorage.setItem('user', JSON.stringify(data.data.user));

                    // Redirect to dashboard (or your protected area)
                        if (data.data.user.role === 'admin') {
                            window.location.href = './admindashboard.html';
                        } else {
                            window.location.href = './userdashboard.html';
                        }
                    // fetchUserProfile();

                } else {
                    alert(`Login failed: ${data.message || 'Invalid credentials'}`);
                }
            } catch (err) {
                console.error('Login error:', err);
                alert('An error occurred during login.');
            }
        });
    }

        const logoutBtn = document.getElementById('logoutBtn');
        const logoutBtnAdmin = document.getElementById('logoutBtnAdmin');

    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("You're not logged in.");
            return;
        }

        try {
            const response = await fetch(`${baseApiUrl}/logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const result = await response.json();

            if (!result.success) {
                alert("Logout failed.");
            }
        } catch (error) {
            console.error("Logout error:", error);
            alert("Something went wrong during logout.");
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            window.location.href = './login.html';
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    if (logoutBtnAdmin) {
        logoutBtnAdmin.addEventListener('click', handleLogout);
    }


    if (window.location.pathname.includes('userdashboard.html')) {
        const token = localStorage.getItem('token');
                if (!token) {
        window.location.href = 'index.html';
        }
        fetchUserProfile();
        fetchUserWorkouts();

    }

    if (window.location.pathname.includes('admindashboard.html')) {
        const token = localStorage.getItem('token');
                if (!token) {
        window.location.href = 'index.html';
        }
    fetchAndDisplayUsers();
    fetchAndDisplayMessages();
     fetchAdminStats()

    }

        async function fetchAndDisplayUsers() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You're not authorized to view this.");
        return;
    }

    try {
        const response = await fetch(`${baseApiUrl}/users`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const users = result.data;
            const tableBody = document.querySelector('#adminuserstable tbody');

            // Clear existing rows
            tableBody.innerHTML = '';

            if (users.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7">No users found.</td></tr>`;
                return;
            }

            // Add rows
            users.forEach(user => {
                const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim();
                const joinedDate = new Date(user.createdAt).toLocaleDateString();

                const row = `
                    <tr>
                        <td>${user.username || '-'}</td>
                        <td>${fullName || '-'}</td>
                        <td>${user.email || '-'}</td>
                        <td>${joinedDate || '-'}</td>
                        <td>${user.gender || '-'}</td>
                        <td>${user.country || '-'}</td>
                        <td>${user.age || '-'}</td>
                        
                    </tr>
                `;

                tableBody.insertAdjacentHTML('beforeend', row);
            });

        } else {
            alert(result.message || 'Failed to fetch users.');
        }
    } catch (error) {
        console.error("Error loading users:", error);
        alert("An error occurred while loading users.");
    }
    }


    async function fetchUserProfile() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("User not logged in.");
      return;
    }

    const response = await fetch(`${baseApiUrl}/profile`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "Failed to fetch profile.");
      return;
    }

    const user = result.data.user;

    // Populate form fields
    document.querySelector('[name="firstName"]').value = user.firstName || '';
    document.querySelector('[name="lastName"]').value = user.lastName || '';
    document.querySelector('[name="username"]').value = user.username || '';
    document.querySelector('[name="email"]').value = user.email || '';
    document.querySelector('[name="dateOfBirth"]').value = user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '';
    document.querySelector('[name="gender"]').value = user.gender || '';
    document.querySelector('[name="initialWeight"]').value = user.initialWeight || '';
    document.querySelector('[name="height"]').value = user.height || '';
    document.querySelector('[name="age"]').value = user.age || '';
    document.querySelector('[name="country"]').value = user.country || '';
    document.querySelector('[name="province"]').value = user.province || '';
    document.querySelector('[name="city"]').value = user.city || '';

    const profileImage = document.querySelector('.user-details .img img');
    const pfp = document.getElementById('pfp');

    if (user.gender?.toLowerCase() === 'male') {
      profileImage.src = 'https://hips.hearstapps.com/hmg-prod/images/man-dumbbell-and-weightlifting-in-fitness-workout-royalty-free-image-1741257823.pjpeg?crop=0.533xw:1.00xh;0.304xw,0&resize=640:*';
    } else if (user.gender?.toLowerCase() === 'female') {
      profileImage.src = 'https://hips.hearstapps.com/hmg-prod/images/gym-workout-66d087d56ef90.jpg?crop=0.628xw:1.00xh;0.100xw,0&resize=640:*';
    } else {
      profileImage.src = 'https://img.freepik.com/premium-photo/personal-trainer-motivates-woman-challenging-workout-gym_14117-716131.jpg';
        pfp.style.objectFit = 'cover';
        pfp.style.objectPosition = 'center'
    }

  } catch (error) {
    console.error("Error fetching profile:", error);
    alert("Something went wrong fetching your profile.");
  }
    }

    document.getElementById('updateProfileForm').addEventListener('submit', updateUserProfile);
    async function updateUserProfile(event) {
  event.preventDefault(); // Prevent default form submission

  const token = localStorage.getItem('token');
  if (!token) {
    alert("User not logged in.");
    return;
  }

  // Collect values from form fields
  const formData = {
    firstName: document.querySelector('[name="firstName"]').value.trim(),
    lastName: document.querySelector('[name="lastName"]').value.trim(),
    username: document.querySelector('[name="username"]').value.trim(),
    email: document.querySelector('[name="email"]').value.trim(),
    dateOfBirth: document.querySelector('[name="dateOfBirth"]').value, // should be YYYY-MM-DD
    gender: document.querySelector('[name="gender"]').value.toLowerCase(),
    initialWeight: document.querySelector('[name="initialWeight"]').value,
    height: document.querySelector('[name="height"]').value,
    age: document.querySelector('[name="age"]').value,
    country: document.querySelector('[name="country"]').value.trim(),
    province: document.querySelector('[name="province"]').value.trim(),
    city: document.querySelector('[name="city"]').value.trim()
  };

  // Clean up optional/empty values (remove keys with empty strings)
  Object.keys(formData).forEach(key => {
    if (formData[key] === '') delete formData[key];
  });

  try {
    const response = await fetch(`${baseApiUrl}/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(formData)
    });

    const result = await response.json();

    if (result.success) {
    //   alert("Profile updated successfully!");
      // Optionally: refresh the form with updated data
      fetchUserProfile();
    } else {
      alert(result.message || "Failed to update profile.");
      console.error(result.errors || result.error);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    alert("Something went wrong while updating your profile.");
  }
    }

    async function fetchUserWorkouts() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert("User not logged in.");
    return;
  }

  try {
    const response = await fetch(`${baseApiUrl}/workouts`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const result = await response.json();

    if (!result.success) {
      alert(result.message || "Failed to fetch workouts.");
      return;
    }

    const workouts = result.data;
    const tableBody = document.querySelector('#workouthistory table tbody');

    // Clear any existing rows
    tableBody.innerHTML = '';

    if (workouts.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="8">No workouts logged yet.</td></tr>`;
      return;
    }

    workouts.forEach(workout => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${workout.workoutType || '—'}</td>
        <td>${formatDate(workout.createdAt)}</td>
        <td>${workout.duration || '—'}</td>
        <td>${workout.caloriesBurnt || '—'}</td>
        <td>${workout.exercisesPerformed || '—'}</td>
        <td>${workout.setsReps || '—'}</td>
        <td>${workout.weightUsed || '—'}</td>
        <td>${workout.notes || '—'}</td>
      `;
      tableBody.appendChild(row);
    });

  } catch (error) {
    console.error("Error fetching workouts:", error);
    alert("Something went wrong fetching your workout history.");
  }
    }

    const logWorkoutForm = document.getElementById('logWorkoutForm');
    if (logWorkoutForm) {
    logWorkoutForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('token');
      if (!token) {
        alert("You must be logged in to log a workout.");
        return;
      }

      const formData = new FormData(logWorkoutForm);
      const workoutData = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${baseApiUrl}/workouts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(workoutData)
        });

        const result = await response.json();

        if (result.success) {
          alert("Workout logged successfully!");
          logWorkoutForm.reset();
          fetchUserWorkouts(); // Optional: Refresh workout history
        } else {
          alert(result.message || "Failed to log workout.");
        }
      } catch (error) {
        console.error("Error logging workout:", error);
        alert("Something went wrong.");
      }
    });
  }


    async function fetchAndDisplayMessages() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert("You're not authorized to view messages.");
        return;
    }

    try {
        const response = await fetch(`${baseApiUrl}/messages`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            const messages = result.data;
            const listContainer = document.querySelector('.usermessages');

            listContainer.innerHTML = ''; // Clear previous messages

            if (messages.length === 0) {
                listContainer.innerHTML = '<li><p>No messages found.</p></li>';
                return;
            }

            messages.forEach(msg => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <div class="contact-msg">
                        <p class="message">${msg.message}</p>
                        <div class="reciept">
                            <i class="fullname">${msg.fullName}</i>
                            <i class="email">${msg.email}</i>
                        </div>
                    </div>
                `;
                listContainer.appendChild(li);
            });

        } else {
            alert(result.message || 'Failed to load messages.');
        }
    } catch (error) {
        console.error('Error loading messages:', error);
        alert('An error occurred while fetching messages.');
    }
    }

    async function fetchAdminStats() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch(`${baseApiUrl}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await res.json();

    if (res.ok && result.success) {
      const stats = result.data;
      const adminCardItems = document.querySelectorAll('.admincard li p:last-child');
      if (adminCardItems.length >= 3) {
        adminCardItems[0].textContent = stats.users;
        adminCardItems[1].textContent = stats.admins;
        adminCardItems[2].textContent = stats.messages;
      }
    } else {
      console.error(result.message || 'Could not fetch stats.');
    }
  } catch (err) {
    console.error('Stats fetch error:', err);
  }
    }

    const goalForm = document.getElementById('goalForm');

    if (goalForm) {
    goalForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const weightGoal = parseFloat(document.getElementById('goalInput').value.trim());
        const token = localStorage.getItem('token');

        if (!token) {
            alert('Please login first.');
            return;
        }

        if (!weightGoal || weightGoal <= 0) {
            alert('Please enter a valid weight goal.');
            return;
        }

        try {
            const response = await fetch(`${baseApiUrl}/goal`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ weightGoal })
            });

            const result = await response.json();

            if (response.ok) {
                alert(`🎯 Goal updated to ${weightGoal}kg successfully!`);
                goalForm.reset();
            } else {
                alert(`❌ ${result.message || 'Failed to update goal'}`);
            }
        } catch (err) {
            console.error('Error setting goal:', err);
            alert('An error occurred while setting your goal.');
        }
    });
    }



});


function formatDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
