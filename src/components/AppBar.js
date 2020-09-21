import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Fab from "@material-ui/core/Fab";
import SettingsIcon from "@material-ui/icons/Settings";
import AddIcon from "@material-ui/icons/Add";
import AddHolidayModal from "./HolidayModal";
import SettingsModal from "./SettingsModal";
import { colors } from "../styles/variables";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: 0,
    bottom: "auto",
    marginBottom: 20,
    backgroundColor: colors.primary,
    color: "white",
  },
  title: {
    padding: theme.spacing(2, 0, 2),
  },
  grow: {
    flexGrow: 1,
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    bottom: 30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
}));

export default function BottomAppBar() {
  const classes = useStyles();
  const [openHolidayModal, setOpenHolidayModal] = useState(false);
  const [openSettingsModal, setOpenSettingsModal] = useState(false);

  return (
    <Fragment>
      <AppBar position="static" color="inherit" className={classes.appBar}>
        <Toolbar>
          <header>
            <Typography
              className={classes.title}
              variant="h5"
              component="h1"
              align="left"
            >
              My Annual Leave
            </Typography>
          </header>
          <div className={classes.grow} />
          <IconButton
            color="inherit"
            aria-label="open settings drawer"
            edge="end"
            onClick={() => setOpenSettingsModal(true)}
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Fab
        color="secondary"
        aria-label="add holidays"
        className={classes.fabButton}
        onClick={() => setOpenHolidayModal(true)}
      >
        <AddIcon />
      </Fab>
      <AddHolidayModal
        open={openHolidayModal}
        handleClose={() => setOpenHolidayModal(false)}
      />
      <SettingsModal
        open={openSettingsModal}
        handleClose={() => setOpenSettingsModal(false)}
      />
    </Fragment>
  );
}
