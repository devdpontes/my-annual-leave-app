import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Typography,
  Container,
  Toolbar,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  AppBar,
  Slide,
  TextField,
  Fab,
  Button,
} from "@material-ui/core";
import DateFnsUtils from "@date-io/date-fns";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";
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
  row: {
    display: "flex",
    alignItems: "baseline",
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    bottom: 30,
    left: 0,
    right: 0,
    margin: "0 auto",
  },
  deleteButton: {
    marginTop: 20,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HolidayModal({ open, handleClose, edit, id }) {
  const classes = useStyles();
  const { holidays, addHolidays, editHolidays, removeHolidays } = useContext(
    AppContext
  );
  const holidaysData = holidays[id] || {};

  const [selectedStartingDate, setSelectedStartingDate] = React.useState(
    holidaysData.startingDate || new Date()
  );
  const [startingPeriod, setStartingPeriod] = React.useState(
    holidaysData.startingPeriod || "Morning"
  );

  const [selectedEndingDate, setSelectedEndingDate] = React.useState(
    holidaysData.endingDate || new Date()
  );
  const [endingPeriod, setEndingPeriod] = React.useState(
    holidaysData.endingPeriod || "Lunchtime"
  );

  const [
    shouldShowRemoveHolidaysDialog,
    setShouldShowRemoveHolidaysDialog,
  ] = React.useState(false);

  const handleSave = () => {
    const payload = {
      startingDate: selectedStartingDate,
      startingPeriod: startingPeriod,
      endingDate: selectedEndingDate,
      endingPeriod: endingPeriod,
    };
    if (id) {
      editHolidays(payload, id);
    } else {
      addHolidays(payload);
    }
    handleClose();
  };

  return (
    <Dialog fullScreen open={open} TransitionComponent={Transition}>
      <AppBar className={classes.appBar} color="inherit">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            {edit ? "Edit holidays" : "Add holidays"}
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
      <Container>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <div className={classes.row}>
            <DatePicker
              margin="normal"
              id="starting-date-picker-dialog"
              label="Starting"
              format="dd/MM/yyyy"
              value={selectedStartingDate}
              onChange={setSelectedStartingDate}
            />
            <TextField
              select
              label="Period"
              id="starting-period-select"
              value={startingPeriod}
              SelectProps={{
                native: true,
              }}
              onChange={(event) => {
                setStartingPeriod(event.target.value);
              }}
            >
              <option value="Morning">Morning</option>
              <option value="Afternoon">Afternoon</option>
            </TextField>
          </div>
          <div className={classes.row}>
            <DatePicker
              margin="normal"
              id="ending-date-picker-dialog"
              label="Ending"
              format="dd/MM/yyyy"
              value={selectedEndingDate}
              onChange={setSelectedEndingDate}
            />
            <TextField
              select
              label="Period"
              id="ending-period-select"
              value={endingPeriod}
              SelectProps={{
                native: true,
              }}
              onChange={(event) => {
                setEndingPeriod(event.target.value);
              }}
            >
              <option value="Lunchtime">Lunchtime</option>
              <option value="End of day">End of day</option>
            </TextField>
          </div>
        </MuiPickersUtilsProvider>
        {edit && (
          <Button
            className={classes.deleteButton}
            variant="outlined"
            color="secondary"
            startIcon={<DeleteIcon />}
            onClick={() => {
              setShouldShowRemoveHolidaysDialog(true);
            }}
          >
            Delete holidays
          </Button>
        )}
      </Container>
      <Fab
        color="secondary"
        aria-label="add"
        className={classes.fabButton}
        onClick={handleSave}
      >
        <SaveIcon />
      </Fab>
      {shouldShowRemoveHolidaysDialog && (
        <Dialog
          open={open}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Are you sure you want to delete this holidays?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={() => {
                setShouldShowRemoveHolidaysDialog(false);
              }}
              color="primary"
            >
              No
            </Button>
            <Button
              onClick={() => {
                handleClose();
                removeHolidays(id);
              }}
              color="primary"
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Dialog>
  );
}
