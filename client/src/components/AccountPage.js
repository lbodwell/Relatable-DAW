import {useEffect} from "react";

import {useHistory} from "react-router-dom";

import {Grid, Button, Typography, Avatar, IconButton} from "@material-ui/core";

import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import MenuBar from "./MenuBar";
import LogoutButton from "./LogoutButton";

const AccountPage = props => {
	const {user, loggedOut} = props;

	const history = useHistory();

	useEffect(() => {
		if (!user) {
			history.replace("/");
		}
	}, [user, history]);

	const handleRemoveAccount = async () => {
		const res = await fetch("/api/users/", {
			method: "DELETE",
			credentials: "include"
		});
		
		if (res.status === 204) {
			loggedOut();
		} else {
			alert("An error occurred while attempting to remove your account. Please try again later.")
			console.error("Failed to remove account");
		}
	};

	return (
		<>
			<MenuBar loggedOut={loggedOut}/>
			{user &&
				<Grid container direction="column" alignItems="center" spacing={4}>
					<Grid item>
						<Typography variant="h4" style={{fontWeight: "bold"}}>{user.name}</Typography>
					</Grid>
					<Grid item>
						<IconButton style={{backgroundColor: "gray", borderRadius: "2rem", padding: 0}}>
							<Avatar src={user.picture} style={{width: "4rem", height: "4rem"}}/>
						</IconButton>
					</Grid>
					<Grid item>
						<LogoutButton onLogout={loggedOut}/>
					</Grid>
					<Grid item>
						<Button
							variant="contained"
							color="secondary"
							startIcon={<DeleteForeverIcon/>}
							onClick={handleRemoveAccount}>
							Delete Account
						</Button>
					</Grid>
				</Grid>
			}
		</>
	);
}

export default AccountPage;
