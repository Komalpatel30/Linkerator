import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";

const useStyles = makeStyles((theme) => ({
  root: {
    fontFamily: "Montserrat",
    fontSize: "20px",
    fontWeight: "600",
    backgroundColor: '#e1bee7',
    justifyContent: 'center',
    color: '#000000'
  },
}));

export default function Header() {
  const classes = useStyles();
  return (
    <Toolbar className={classes.root}>The Great Linkerator Tracker</Toolbar>
  );
}
