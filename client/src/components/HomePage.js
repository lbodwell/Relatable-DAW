import {useEffect, useState} from "react";

import GoogleLogin from "react-google-login";

const HomePage = props => {
	const {user, authenticated, projectSelected} = props;

	const [projects, setProjects] = useState([]);

	useEffect(() => {
		const fetchProjects = async () => {
			const res = await fetch("http://localhost:5000/api/projects", {
				method: "GET",
				headers: {
					"Content-Type": "application/json"
				}
			});

			const data = await res.json();
			if (data) {
				setProjects(data);
			} else {
				console.error("Failed to login");
			}
		}

		fetchProjects();
	}, [user]);

	const handleLogin = async googleData => {
		const res = await fetch("http://localhost:5000/api/auth/google", {
			method: "POST",
			body: JSON.stringify({
				token: googleData.tokenId
			}),
			headers: {
				"Content-Type": "application/json"
			}
		});

		const data = await res.json();
		if (data) {
			authenticated(data);
		} else {
			console.error("Failed to login");
		}
	}

	return (
		<div className="center-text">
			<h1>Relatable DAW</h1>
			<GoogleLogin
				clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
				buttonText="Log in with Google"
				onSuccess={handleLogin}
				onFailure={handleLogin}
				cookiePolicy={"single_host_origin"}
			/>
			<h1>Hello {user?.name ?? "{name}"}</h1>
			<h3>Projects</h3>
		</div>
	);
}

export default HomePage;