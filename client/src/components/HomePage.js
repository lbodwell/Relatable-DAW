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
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import DeleteIcon from "@material-ui/icons/Delete";

import MenuBar from "./MenuBar";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const HomePage = props => {
	const {user, loggedIn, loggedOut} = props;

	const [projects, setProjects] = useState([]);

	const history = useHistory();

	const fetchProjects = useCallback(async () => {
		const res = await fetch("/api/projects", {
			method: "GET",
			credentials: "include"
		});

		const projects = await res.json();
		console.log(projects);
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
		const res = await fetch("/api/projects", {
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
		const res = await fetch(`/api/projects/${projectId}`, {
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

	const formatDate = date => {
		const dateString = new Date(date).toISOString().substring(0, 10);

		const month = dateString.substring(5, 7);
		const day = dateString.substring(8, 10);
		const year = dateString.substring(0, 4);

		return `${month}/${day}/${year}`;
	};

	return (
		<>
			<MenuBar user={user} loggedOut={loggedOut}/>
			<div className="center-text">
				{user ?
					<div>
						<Typography variant="h4" style={{marginBottom: "1rem"}}>Projects</Typography>
						<Button
							variant="contained"
							color="primary"
							startIcon={<AddIcon/>}
							onClick={createNewProject}>
							New
						</Button>
						<div className="projects-container" style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "2rem"}}>
							<List className="projects-list" style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
								{projects?.map((project, index) => (
									<div key={index} style={{width: "24rem"}}>
										<ListItem button onClick={() => navigateToProject(project._id)}>
											<ListItemAvatar>
												{project.owner === user._id ?
													<Avatar src={user.picture}/>
												:
													<MusicNoteIcon/>
												}
											</ListItemAvatar>
											<ListItemText 
												primary={project.name}
												secondary={project.owner === user._id ? "Created: " + formatDate(project.dateCreated) : "Shared with you"}
											/>
											<ListItemSecondaryAction>
												<IconButton edge="end" onClick={() => deleteProject(project._id)}>
													<DeleteIcon/>
												</IconButton>
											</ListItemSecondaryAction>
										</ListItem>
										<Divider/>
									</div>
								))}
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