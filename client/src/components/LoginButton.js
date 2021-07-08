import React from "react";

import GoogleLogin from "react-google-login";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const handleLoginSuccess = async (googleData, onLogin) => {
	const res = await fetch("http://localhost:5000/api/auth/google", {
		method: "POST",
		credentials: "include",
		body: JSON.stringify({
			token: googleData.tokenId
		}),
		headers: {
			"Content-Type": "application/json"
		}
	});

	const data = await res.json();
	if (data) {
		onLogin(data);
	} else {
		console.error("Failed to login");
	}
};

const handleLoginFailure = err => {
	alert("Failed to log in!");
	console.error(err);
};

const LoginButton = props => {
	const {onLogin} = props;

	return (
		<GoogleLogin
			clientId={CLIENT_ID}
			buttonText="Log in with Google"
			onSuccess={googleData => handleLoginSuccess(googleData, onLogin)}
			onFailure={handleLoginFailure}
			isSignedIn={true}
			cookiePolicy={"single_host_origin"}
		/>
	)
};

export default LoginButton;

export {CLIENT_ID, handleLoginSuccess, handleLoginFailure};