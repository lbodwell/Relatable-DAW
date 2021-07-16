import React from "react";

import {Button, Icon} from "@material-ui/core";
import GoogleLogin from "react-google-login";


const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const handleLoginSuccess = async (googleData, onLogin) => {
	window.localStorage.setItem("tokenId", googleData.tokenId);
	
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
			// Experimental custom button CSS
			// render={renderProps => (
			// 	<Button
			// 		variant="contained"
			// 		color="primary"
			// 		onClick={renderProps.onClick}
			// 		disabled={renderProps.disabled}>
			// 		Log in with Google
			// 	</Button>
			// )}
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