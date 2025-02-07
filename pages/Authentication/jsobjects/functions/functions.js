export default {
	defaultTab: 'Sign In',

	setDefaultTab: (newTab) => {
		this.defaultTab = newTab;
	},

	// **Sign In Function**
	signIn: async () => {
		const email = inp_email.text;
		const password = inp_password.text;

		try {
			// Query Firestore to find user by email
			const userData = await VerifyUser.run();

			if (userData.length > 0) {
				const user = userData[0]; // Firestore returns an array

				// Call Firebase Function to verify password
				const verifyResponse = await Firebase_VerifyPassword.run({
					password: password,
					hashedPassword: user.password,
				});

				if (verifyResponse.match) {
					// Store user session in Appsmith
					await storeValue('token', await this.createToken(user));
					await storeValue('user_id', user.id);
					await storeValue('user_role', user.role);

					showAlert('Sign-in successful!', 'success');
					if (user.role === "admin") {
                navigateTo('AdminPage');
            } else {
                navigateTo('Projects');
            }
				} else {
					showAlert('Invalid email or password', 'error');
				}
			} else {
				showAlert('User not found', 'error');
			}
		} catch (error) {
			console.error("Sign-in error:", error);
			showAlert('An error occurred during sign-in', 'error');
		}
	},

	// **Register Function**
	register: async () => {
		try {
			// Hash password using Firebase Function
			const hashResponse = await Firebase_HashPassword.run({
				password: inp_registerPassword.text,
			});

			// Store user in Firestore
			const newUser = await createUser.run({
				id: `${Date.now()}`, // Unique ID
				username: inp_registerEmail.text,
				password: hashResponse.hashedPassword, // Store hashed password
				role: 'user',
				created_at: moment().format('YYYY-MM-DD HH:mm:ss'), // Timestamp format
			});

			if (newUser) {
				// Store session & redirect
				await storeValue('token', await this.createToken(newUser));
				await storeValue('user_id', newUser.id);
				await storeValue('user_role', newUser.role);

				showAlert('Registration Successful', 'success');
				navigateTo('Projects');
			} else {
				showAlert('Error creating new user', 'error');
			}
		} catch (error) {
			console.error("Registration error:", error);
			showAlert("An error occurred during registration", "error");
		}
	},

	// **JWT Token Generation**
	createToken: async (user) => {
		return btoa(JSON.stringify(user)); // Simple Base64 encoding (Replace with JWT if needed)
	},
};
