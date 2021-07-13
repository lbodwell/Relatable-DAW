import {useEffect, useState} from "react";

import {makeStyles} from '@material-ui/core/styles';

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
	ListItemSecondaryAction
} from "@material-ui/core";

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import StopIcon from '@material-ui/icons/Stop';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import VolumeDown from '@material-ui/icons/VolumeDown';
import VolumeUp from '@material-ui/icons/VolumeUp';
import ShareIcon from '@material-ui/icons/Share';

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

// TODO: move to CSS
const useStyles = makeStyles((theme) => ({
	modal: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
	paper: {
		backgroundColor: "darkgray",
		border: "2px solid #000",
		borderRadius: "4px",
		boxShadow: theme.shadows[5],
		padding: "2rem 4rem",
	},
}));

const OptionsManager = props => {
	const {
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
		collaboratorsChanged
	} = props;
	
	const [localBpm, setLocalBPM] = useState(120);
	const [localVolume, setLocalVolume] = useState(100);
	const [shareModalOpen, setShareModalOpen] = useState(false);
	const [collaboratorEmail, setCollaboratorEmail] = useState();

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
		setCollaboratorEmail(evt.target.value);
	};

	const handleRoleChange = (evt, index) => {
		const newCollaborator = collaborators[index];
		newCollaborator.role = evt.target.value;
		const newCollaborators = [...collaborators];
		newCollaborators[index] = newCollaborator;
		collaboratorsChanged(newCollaborators);
		// TODO: update in db
	}

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
								<Typography variant="h6">BPM: {localBpm}</Typography>
							</Grid>
							<Grid item>
								<ChevronLeftIcon/>
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
								<ChevronRightIcon/>
							</Grid>
						</Grid>
					</Grid>
					<Grid item xs={3}>
						<Grid container alignItems="center">
							<Grid item xs={5}>
								<Typography variant="h6">Volume: {localVolume}</Typography>
							</Grid>
							<Grid item>
								<VolumeDown/>
							</Grid>
							<Grid item xs={4}>
								<Slider
									value={localVolume}
									min={0}
									max={100}
									onChange={handleVolumeChange}
									onMouseUp={() => volChanged(localVolume)}
								/>
							</Grid>
							<Grid item>
								<VolumeUp/>
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
						<Typography variant="h4">Collaborators</Typography>
						<Typography variant="h6">Add new</Typography>
						<TextField
							label="Email"
							variant="filled"
							size="small"
							placeholder="someone@example.com"
							value={collaboratorEmail}
							onChange={handleEmailChange}
						/>
						<List>
							{collaborators?.map((user, index) => (
								<ListItem key={index}>
									<ListItemAvatar>
										<Avatar src={user.picture}/>
									</ListItemAvatar>
									<ListItemText primary={user.name} secondary={user.email}/>
									<ListItemSecondaryAction>
									<Select
										value={user.role}
										defaultValue={user.role}
										onChange={evt => handleRoleChange(evt, index)}
									>
										<MenuItem value="viewer">Viewer</MenuItem>
										<MenuItem value="editor">Editor</MenuItem>
									</Select>
									</ListItemSecondaryAction>
								</ListItem>
							))}
						</List>
					</div>
				</Fade>
			</Modal>
		</>
	);
};

export default OptionsManager;