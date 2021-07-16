import React from "react";

import GoogleLogin from "react-google-login";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const handleLoginSuccess = async (googleData, onLogin) => {
	window.localStorage.setItem("tokenId", googleData.tokenId);
	
	const res = await fetch("/api/auth/google", {
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
		console.error("Failed to log in");
	}
};

const handleLoginFailure = err => {
	alert("Failed to log in!");
	console.error(err);
};

const LoginButton = ({onLogin}) => {
	return (
		<GoogleLogin
			clientId={CLIENT_ID}
			buttonText={"LOG IN WITH GOOGLE"}
			onSuccess={googleData => handleLoginSuccess(googleData, onLogin)}
			onFailure={handleLoginFailure}
			isSignedIn={true}
			cookiePolicy={"single_host_origin"}
		/>
	)
};

export default LoginButton;

export {CLIENT_ID, handleLoginSuccess, handleLoginFailure};