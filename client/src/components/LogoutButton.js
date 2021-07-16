import {GoogleLogout} from "react-google-login";

import {CLIENT_ID} from "./LoginButton";

const handleLogoutSuccess = async onLogout => {
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
			buttonText="LOGOUT"
			onLogoutSuccess={() => handleLogoutSuccess(onLogout)}
		/>
	)
}

export default LogoutButton;