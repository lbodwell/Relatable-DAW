import {useEffect, useState} from "react";

import {makeStyles} from "@material-ui/core/styles";

import {
	Backdrop,
	Button,
	ButtonGroup,
	Fade,
	Grid,
	MenuItem,
	Modal,
	Typography,
	Slider,
	Select,
	TextField,
	List,
	ListItemAvatar,
	Avatar,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Divider,
	IconButton
} from "@material-ui/core";

import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import StopIcon from "@material-ui/icons/Stop";
import RemoveIcon from "@material-ui/icons/Remove";
import AddIcon from "@material-ui/icons/Add";
import VolumeDown from "@material-ui/icons/VolumeDown";
import VolumeUp from "@material-ui/icons/VolumeUp";
import ShareIcon from "@material-ui/icons/Share";
import DeleteIcon from "@material-ui/icons/Delete";

import "../styles/OptionsManager.css"

const keys = [
	"C",
	"G",
	"D",
	"A",
	"E",
	"B",
	"Gb",
	"Db", 
	"Ab",
	"Eb",
	"Bb",
	"F"
];

// TODO: Move to CSS
const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		backgroundColor: "darkgray",
		border: "2px solid #000000",
		borderRadius: "0.5rem",
		boxShadow: theme.shadows[5],
		padding: "2rem",
	},
}));

const OptionsPanel = props => {
	const {
		projectId,
		keyCenter,
		keyChanged,
		bpm,
		bpmChanged,
		volume,
		volChanged,
		updatePlayback,
		stopPlayback,
		playbackStatus,
		collaborators,
		collaboratorAdded,
		collaboratorRemoved
	} = props;
	
	const [localBpm, setLocalBPM] = useState(120);
	const [localVolume, setLocalVolume] = useState(0);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [collaboratorEmail, setCollaboratorEmail] = useState("");
	const [addCollaboratorEnabled, setAddCollaboratorEnabled] = useState(false);

	const classes = useStyles();

	const handleOpen = () => setShareModalOpen(true);
	const handleClose = () => setShareModalOpen(false);

	useEffect(() => {
		if (bpm) {
			setLocalBPM(bpm);
		}
	}, [bpm]);

	useEffect(() => {
		if (volume) {
			setLocalVolume(volume);
		}
	}, [volume]);

	const handleBpmChange = (evt, newValue) => {
		setLocalBPM(newValue);
	};

	const handleVolumeChange = (evt, newValue) => {
		setLocalVolume(newValue);
	};

	const handleEmailChange = evt => {
		const email = evt.target.value;
		setCollaboratorEmail(email);
		
		const regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
		setAddCollaboratorEnabled(email.match(regex));
	};

	const handleKeyPress = evt => {
		if (evt.key === "Enter") {
			handleAddCollaborator();
		}
	}

	const handleAddCollaborator = () => {
		collaboratorAdded(projectId, collaboratorEmail);
		setCollaboratorEmail("");
		setAddCollaboratorEnabled(false);
	};

	const handleRemoveCollaborator = userId => {
		collaboratorRemoved(projectId, userId);
	};

	return (
		<>
			<div className="options">
				<Grid container direction="row" justifyContent="center" alignItems="center">
					<Grid item xs={1}>
						<ButtonGroup variant="contained" size="small" color="primary">
							<Button onClick={updatePlayback} aria-label="play/pause">
								{playbackStatus !== "Playing" ? <PlayArrowIcon/> : <PauseIcon/>}
							</Button>
							<Button onClick={stopPlayback} aria-label="stop">
								<StopIcon/>
							</Button>
						</ButtonGroup>
					</Grid>
					<Grid item xs={2}>
						<Grid container alignItems="center" spacing={2}>
							<Grid item>
								<Typography variant="h6">Key:</Typography>
							</Grid>
							<Grid item>
								<Select
									labelId="keyCenter"
									value={keyCenter}
									onChange={evt => keyChanged(evt.target.value)}
								>
									{keys.map((key, index) => (
										<MenuItem key={index} value={key}>{`${key} Major`}</MenuItem>
									))}
								</Select>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<Grid container alignItems="center">
							<Grid item xs={4}>
								<Typography variant="h6">{localBpm} BPM</Typography>
							</Grid>
							<Grid item>
								<RemoveIcon style={{marginRight: "0.5rem"}}/>
							</Grid>
							<Grid item xs={4}>
								<Slider
									value={localBpm}
									min={60}
									max={200}
									onChange={handleBpmChange}
									onMouseUp={() => bpmChanged(localBpm)}
								/>
							</Grid>
							<Grid item>
								<AddIcon style={{marginLeft: "0.5rem"}}/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<Grid container alignItems="center">
							<Grid item xs={3}>
								<Typography variant="h6">{localVolume} dB</Typography>
							</Grid>
							<Grid item>
								<VolumeDown style={{marginRight: "0.5rem"}}/>
							</Grid>
							<Grid item xs={4}>
								<Slider
									value={localVolume}
									min={-32}
									max={2}
									step={0.1}
									onChange={handleVolumeChange}
									onMouseUp={() => volChanged(localVolume)}
								/>
							</Grid>
							<Grid item>
								<VolumeUp style={{marginLeft: "0.5rem"}}/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs>
						<Button
							variant="contained"
							color="primary"
							startIcon={<ShareIcon/>}
							onClick={handleOpen}
						>
							Share
						</Button>
					</Grid>
				</Grid>
			</div>
			<Modal
				className={classes.modal}
				open={shareModalOpen}
				onClose={handleClose}
				closeAfterTransition
				BackdropComponent={Backdrop}
				BackdropProps={{
					timeout: 500
				}}
			>
				<Fade in={shareModalOpen}>
					<div className={classes.paper}>
						<div className="center-text">
							<Typography variant="h4" style={{paddingBottom: "1rem"}}>Collaborators</Typography>
							<Grid container justifyContent="center" alignItems="center" spacing={2}>
								<Grid item>
									<TextField
										label="Email"
										variant="outlined"
										size="small"
										placeholder="someone@example.com"
										value={collaboratorEmail}
										onChange={handleEmailChange}
										onKeyPress={handleKeyPress}
									/>
								</Grid>
								<Grid item>
									<Button
										variant="contained"
										color="primary"
										startIcon={<AddIcon/>}
										disabled={!addCollaboratorEnabled}
										onClick={handleAddCollaborator}>
										Add
									</Button>
								</Grid>
							</Grid>
						</div>
						<List style={{display: "flex", flexDirection: "column", alignItems: "stretch"}}>
							{collaborators?.map((user, index) => (
								<div key={index} style={{width: "24rem"}}>
									<ListItem>
										<ListItemAvatar>
											<Avatar src={user.picture}/>
										</ListItemAvatar>
										<ListItemText primary={user.name} secondary={user.email}/>
										<ListItemSecondaryAction>
											<IconButton edge="end" onClick={() => handleRemoveCollaborator(user._id)}>
												<DeleteIcon/>
											</IconButton>
										</ListItemSecondaryAction>
									</ListItem>
									<Divider/>
								</div>
							))}
						</List>
					</div>
				</Fade>
			</Modal>
		</>
	);
};

export default OptionsPanel;