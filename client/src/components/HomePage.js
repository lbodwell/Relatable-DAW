import {useCallback, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

import {
	Avatar,
	Button,
	Divider,
	Grid,
	IconButton,
	List,
	ListItem,
	ListItemAvatar,
	ListItemSecondaryAction,
	ListItemText,
	Typography
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import DeleteIcon from "@material-ui/icons/Delete";

import MenuBar from "./MenuBar";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const HomePage = props => {
	const {user, loggedIn, loggedOut} = props;

	const [projects, setProjects] = useState([]);

	const history = useHistory();

	const fetchProjects = useCallback(async () => {
		const res = await fetch("https://localhost:5000/api/projects", {
			method: "GET",
			credentials: "include"
		});

		const projects = await res.json();
		if (projects) {
			setProjects(projects);
		} else {
			console.error("Failed to access projects");
		}
	}, []);

	useEffect(() => {
		if (user) {
			fetchProjects();
		}
	}, [user, fetchProjects]);

	const createNewProject = async () => {
		const res = await fetch("https://localhost:5000/api/projects", {
			method: "POST",
			credentials: "include"
		});

		const projects = await res.json();
		if (projects) {
			setProjects(projects);
		} else {
			console.error("Failed to create new project");
		}
	};

	const deleteProject = async projectId => {
		const res = await fetch(`https://localhost:5000/api/projects/${projectId}`, {
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
		<>
		<MenuBar user={user} loggedOut={loggedOut}/>
		<div className="center-text">
			{user ?
				<div>
					<Typography variant="h4">Projects</Typography>
					<Button
						variant="contained"
						color="primary"
						startIcon={<AddIcon/>}
						onClick={createNewProject}>
						New
					</Button>
					<div className="projects-container" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
						<List className="projects-list" style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
							{projects?.map((project, index) => {
								return (
									// TODO: Get owner object from id for each project to display avatar and name
									<div key={index} style={{width: "24rem"}}>
										<ListItem button onClick={() => navigateToProject(project._id)}>
											<ListItemAvatar>
												{/* <Avatar src={owner.picture}/> */}
												<Avatar src={user.picture}/>
											</ListItemAvatar>
											{/* <ListItemText primary={project.name} secondary={"Owner: " + (owner._id === user._id ? "You" : owner.name)}/> */}
											<ListItemText primary={project.name} secondary={"Owner: " + (project.owner === user._id ? "You" : project.owner)}/>
											<ListItemSecondaryAction>
												<IconButton edge="end" onClick={() => deleteProject(project._id)}>
													<DeleteIcon/>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										<Divider/>
									</div>
								);
							})}
						</List>
					</div>
					<LogoutButton onLogout={loggedOut}/>
				</div>
				:
				<Grid container direction="column" justifyContent="center" spacing={2}>
					<Grid item>
						<LoginButton onLogin={loggedIn}/>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							color="primary"
							startIcon={<ArrowForwardIcon/>}
							onClick={() => navigateToProject(null)}>
							Continue as guest
						</Button>
					</Grid>
				</Grid>
			}
		</div>
		</>
	);
}

export default HomePage;