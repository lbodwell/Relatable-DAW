import React, { useState } from "react";
import "../styles/Pixel.css";

const Pixel = props => {
	const {color} = props;
	console.log(color);

	const [pixelColor, setPixelColor] = useState(color);

	const select = () => {
		setPixelColor("#ffffff");
	};

	const mouseOver = () => {
		//console.log("Moused over");
	};

	return (
		<div
			className="pixel"
			onClick={select}
			onMouseEnter={mouseOver}
			style={{backgroundColor: color}}
		>	
		</div>
	);
};

export default Pixel;