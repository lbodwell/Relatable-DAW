import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const HomePage = props => {
	const {user, loggedIn, loggedOut} = props;

	const [projects, setProjects] = useState([]);

	const history = useHistory();

	const fetchProjects = useCallback(async () => {
		const res = await fetch("http://localhost:5000/api/projects", {
			method: "GET",
			credentials: "include"
		});

		const data = await res.json();
		if (data) {
			setProjects(data);
		} else {
			console.error("Failed to login");
		}
	}, []);

	useEffect(() => {
		if (user) {
			fetchProjects();
		}
	}, [user, fetchProjects]);

	const createNewProject = async () => {
		const res = await fetch("http://localhost:5000/api/projects", {
			method: "POST",
			credentials: "include"
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
			credentials: "include"
		});

		const data = await res.json();
		if (data) {
			setProjects(data);
		} else {
			console.error("Failed to delete project");
		}
	};

	const navigateToProject = projectId => {
		if (projectId !== null) {
			history.push(`/project/${projectId}`);
		} else {
			history.push("/guest");
		}
	};

	return (
		<div className="center-text">
			<h1>Relatable DAW</h1>
			{user ?
				<div>
					<LogoutButton onLogout={loggedOut}/>
					<h1>Hello {user?.name ?? "{name}"}</h1>
					<h2>Projects</h2>
					<button onClick={createNewProject}>New Project</button>
					<ul>
						{projects?.map((project, index) => (
							<li key={index}>
								<button onClick={() => navigateToProject(project._id)}>{project.name}</button>
								<button onClick={() => deleteProject(project._id)}>Delete</button>
							</li>
						))}
					</ul>
				</div>
				:
				<div>
					<LoginButton onLogin={loggedIn}/>
					<button onClick={() => navigateToProject(null)}>Continue as guest</button>
				</div>
			}
		</div>
	);
}

export default HomePage;