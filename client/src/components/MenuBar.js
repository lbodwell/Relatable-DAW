import {useState} from "react";

import {useHistory} from "react-router-dom";

import {
	AppBar,
	Avatar,
	Grid,
	IconButton,
	Menu,
	MenuItem,
	Toolbar,
	Typography
} from "@material-ui/core";

const MenuBar = ({user}) => {
	const [anchorEl, setAnchorEl] = useState(null);

	const history = useHistory();

  	const isMenuOpen = Boolean(anchorEl);
	
	const handleMenu = evt => {
		setAnchorEl(evt.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const redirectToAccount = () => {
		history.push("/account");
	};

	return (
		<>
			<AppBar className="app-bar" position="static">
				<Toolbar>
					<Grid container justifyContent="space-between" alignItems="center">
						<Grid item>
							<Typography variant="h5">Relatable DAW</Typography>
						</Grid>
						{user &&
							<Grid item>
								<IconButton style={{backgroundColor: "darkgray", borderRadius: "2rem", padding: 0}} onClick={handleMenu}>
									<Avatar src={user.picture}/>
								</IconButton>
								<Menu
									anchorEl={anchorEl}
									anchorOrigin={{
										vertical: "top",
										horizontal: "right"
									}}
									keepMounted
									transformOrigin={{
										vertical: "top",
										horizontal: "right"
									}}
									open={isMenuOpen}
									onClose={handleClose}
								>
									<MenuItem onClick={redirectToAccount}>My account</MenuItem>
								</Menu>
							</Grid>
						}
					</Grid>
				</Toolbar>
			</AppBar>
		</>
	)
}

export default MenuBar;
