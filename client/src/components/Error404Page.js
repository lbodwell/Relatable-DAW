import {useHistory} from "react-router-dom";

import {Button, Typography} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";

const Error404Page = () => {
	const history = useHistory();

	const handleReturnHome = () => {
		history.push("/");
	};

	return (
		<div className="center-text">
			<Typography variant="h3">Error 404</Typography>
			<Typography variant="h5">The page you are looking for does not exist!</Typography>
			<Button
				variant="contained"
				color="primary"
				startIcon={<HomeIcon/>}
				onClick={handleReturnHome}>
				Back to Home
			</Button>
		</div>
	);
};

export default Error404Page;