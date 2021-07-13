import {GoogleLogout} from "react-google-login";

import {CLIENT_ID} from "./LoginButton";

const handleLogoutSuccess = async onLogout => {
	window.localStorage.removeItem("tokenId");

	const res = await fetch("http://localhost:5000/api/auth/google/logout", {
		method: "DELETE",
		credentials: "include"
	});

	const data = await res.json();
	if (!data) {
		console.error("Failed to log out");
	}
	
	onLogout();
};

const LogoutButton = props => {
	const {onLogout} = props;

	return (
		<GoogleLogout
			clientId={CLIENT_ID}
			buttonText="Logout"
			onLogoutSuccess={() => handleLogoutSuccess(onLogout)}
		/>
	)
}

export default LogoutButton;