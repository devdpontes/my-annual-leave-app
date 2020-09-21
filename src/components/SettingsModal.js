import React, { useContext, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Container,
  Toolbar,
  Dialog,
  Button,
  AppBar,
  IconButton,
  Slide,
  TextField,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import DeleteIcon from "@material-ui/icons/Delete";
import { AppContext } from "./App";
import { colors } from "../styles/variables";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    backgroundColor: colors.primary,
    color: "white",
  },
  title: {
    flex: 1,
  },
  container: {
    marginTop: 10,
  },
  clearButton: {
    marginTop: 20,
  },
  textField: {
    width: "100%",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SettingsModal({ open, handleClose }) {
  const classes = useStyles();
  const { holidaysAllowance, editHolidaysAllowance, clearData } = useContext(
    AppContext
  );
  const [shouldShowClearDataDialog, setShouldShowClearDataDialog] = useState(
    false
  );
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      TransitionComponent={Transition}
    >
      <AppBar className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            Settings
          </Typography>
          <IconButton
            edge="end"
            color="inherit"
            onClick={handleClose}
            aria-label="close"
          >
            <CloseIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container className={classes.container} maxWidth="sm">
        <TextField
          className={classes.textField}
          select
          label="Holidays allowance"
          id="holidays-allowance"
          value={holidaysAllowance}
          SelectProps={{
            native: true,
          }}
          onChange={(event) => {
            editHolidaysAllowance(event.target.value);
          }}
        >
          {Array(100)
            .fill(null)
            .map((_, index) => (
              <option key={index} value={index + 1}>
                {index + 1}
              </option>
            ))}
        </TextField>
        <Button
          className={classes.clearButton}
          variant="outlined"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={() => {
            setShouldShowClearDataDialog(true);
          }}
        >
          Clear data
        </Button>
        {shouldShowClearDataDialog && (
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Are you sure you want to clear all data?
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Warning: This action will clear all saved settings and holidays.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setShouldShowClearDataDialog(false);
                }}
                color="primary"
              >
                No
              </Button>
              <Button
                onClick={() => {
                  setShouldShowClearDataDialog(false);
                  clearData();
                }}
                color="primary"
                autoFocus
              >
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Container>
    </Dialog>
  );
}
