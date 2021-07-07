import {useEffect, useState} from "react";

import {GoogleLogin, GoogleLogout} from "react-google-login";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

const HomePage = props => {
	const {user, loggedIn, loggedOut, projectSelected} = props;

	const [projects, setProjects] = useState([]);

	const fetchProjects = async () => {
		const res = await fetch("http://localhost:5000/api/projects", {
			method: "GET",
			credentials: "include",
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

	useEffect(() => {
		if (user) {
			fetchProjects();
		}
	}, [user]);

	useEffect(() => {
		console.log(projects);
	}, [projects]);

	const handleLogin = async googleData => {
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
			loggedIn(data);
		} else {
			console.error("Failed to login");
		}
	};

	const createNewProject = async () => {
		const res = await fetch("http://localhost:5000/api/projects", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		});

		const data = await res.json();
		if (data) {
			setProjects(data);
		} else {
			console.error("Failed to create new project");
		}
	};

	const deleteProject = async projectId => {
		const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json"
			}
		});

		const data = await res.json();
		console.log(data);
		if (data) {
			setProjects(data)
		} else {
			console.error("Failed to delete project");
		}
	};

	const goToProject = projectId => {
		console.log("redirect to project " + projectId);
	};

	return (
		<div className="center-text">
			<h1>Relatable DAW</h1>
			{user ?
				<div>
					<GoogleLogout
						clientId={CLIENT_ID}
						buttonText="Logout"
						onLogoutSuccess={loggedOut}
					/>
					<h1>Hello {user?.name ?? "{name}"}</h1>
					<h2>Projects</h2>
					<button onClick={createNewProject}>New Project</button>
					<ul>
						{projects?.map((project, index) => (
							<li key={index}>
								<button onClick={() => goToProject(project._id)}>{project.name}</button>
								<button onClick={() => deleteProject(project._id)}>Delete</button>
							</li>
						))}
					</ul>
				</div>
				:
				<div>
					<GoogleLogin
						clientId={CLIENT_ID}
						buttonText="Log in with Google"
						onSuccess={handleLogin}
						onFailure={handleLogin}
						isSignedIn={true}
						cookiePolicy={"single_host_origin"}
					/>
				</div>
			}
		</div>
	);
}

export default HomePage;