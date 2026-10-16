
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registerForm = document.getElementById("register-form");

    const USERS_KEY = "fitTrackUsers";
    const SESSION_KEY = "fitTrackCurrentUser";

    // Display messages without changing the CSS layout.
    function showMessage(form, message, success = false) {
        let messageBox = form.querySelector(".auth-message");

        if (!messageBox) {
            messageBox = document.createElement("p");
            messageBox.className = "auth-message";
            messageBox.setAttribute("role", "status");
            messageBox.style.fontSize = "14px";
            messageBox.style.marginTop = "15px";
            messageBox.style.overflowWrap = "anywhere";

            form.appendChild(messageBox);
        }

        messageBox.textContent = message;
        messageBox.style.color = success ? "#4ade80" : "#ff6b6b";
    }

    // Read demo users from browser storage.
    function getUsers() {
        try {
            return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
        } catch {
            return [];
        }
    }

    function normalizeEmail(email) {
        return email.trim().toLowerCase();
    }

    // REGISTER
    registerForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const name = document.getElementById("reg-name").value.trim();
        const email = normalizeEmail(
            document.getElementById("reg-email").value
        );
        const password = document.getElementById("reg-password").value;
        const confirmPassword = document.getElementById("reg-confirm").value;

        if (!name || !email || !password || !confirmPassword) {
            showMessage(registerForm, "Please fill in all fields.");
            return;
        }

        if (password.length < 8) {
            showMessage(
                registerForm,
                "Your password must be at least 8 characters long."
            );
            return;
        }

        if (password !== confirmPassword) {
            showMessage(registerForm, "Your passwords do not match.");
            return;
        }

        const users = getUsers();

        if (users.some(user => user.email === email)) {
            showMessage(
                registerForm,
                "An account with this email already exists."
            );
            return;
        }

        // Demo only: localStorage is not secure password storage.
        users.push({ name, email, password });

        try {
            localStorage.setItem(USERS_KEY, JSON.stringify(users));
        } catch {
            showMessage(
                registerForm,
                "Could not save your account. Check your browser storage."
            );
            return;
        }

        showMessage(
            registerForm,
            "Account created! You can now log in.",
            true
        );

        registerForm.reset();
    });

    // LOGIN
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const email = normalizeEmail(
            document.getElementById("login-email").value
        );
        const password = document.getElementById("login-password").value;

        const users = getUsers();

        const user = users.find(
            user => user.email === email && user.password === password
        );

        if (!user) {
            showMessage(
                loginForm,
                "Incorrect email or password. Please try again."
            );
            return;
        }

        const rememberMe = loginForm.querySelector(
            'input[type="checkbox"]'
        ).checked;

        const session = JSON.stringify({
            name: user.name,
            email: user.email
        });

        try {
            // Remember me persists until cleared; otherwise use a tab session.
            if (rememberMe) {
                localStorage.setItem(SESSION_KEY, session);
                sessionStorage.removeItem(SESSION_KEY);
            } else {
                sessionStorage.setItem(SESSION_KEY, session);
                localStorage.removeItem(SESSION_KEY);
            }
        } catch {
            showMessage(
                loginForm,
                "Could not save your session. Check your browser storage."
            );
            return;
        }

        showMessage(
            loginForm,
            `Welcome back, ${user.name}! Logging you in...`,
            true
        );


        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    });

    // SHOW / HIDE PASSWORD
    document.querySelectorAll(".toggle-password").forEach(button => {
        button.addEventListener("click", () => {
            const input = button.parentElement.querySelector("input");
            const icon = button.querySelector("i");

            const showingPassword = input.type === "password";

            input.type = showingPassword ? "text" : "password";

            icon.classList.toggle("fa-eye", showingPassword);
            icon.classList.toggle("fa-eye-slash", !showingPassword);

            button.setAttribute(
                "aria-label",
                showingPassword ? "Hide password" : "Show password"
            );
        });
    });
});