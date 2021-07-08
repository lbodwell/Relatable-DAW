import {GoogleLogout} from "react-google-login";

import {CLIENT_ID} from "./LoginButton";

const LogoutButton = props => {
	const {onLogout} = props;

	return (
		<GoogleLogout
			clientId={CLIENT_ID}
			buttonText="Logout"
			onLogoutSuccess={onLogout}
		/>
	)
}

export default LogoutButton;