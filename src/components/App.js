import React, { Fragment, useState, useEffect } from "react";
import { get, set, clear } from "idb-keyval";
import { makeStyles } from "@material-ui/core/styles";
import mitt from "mitt";
import {
  Typography,
  Container,
  CssBaseline,
  Button,
  Snackbar,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import AppBar from "./AppBar";
import HolidaysBreakdownCard from "./HolidaysBreakdownCard";
import HolidayCard from "./HolidayCard";
import "./App.css";

export const emitter = mitt();

// {
//   "1": {
//     startingDate: "Mon Jun 22 2020 16:45:14 GMT+0100",
//     startingPeriod: "Morning",
//     endingDate: "Mon Jun 23 2020 16:45:14 GMT+0100",
//     endingPeriod: "End of day",
//   },
//   "2": {
//     startingDate: "Mon Jun 25 2020 16:45:14 GMT+0100",
//     startingPeriod: "Morning",
//     endingDate: "Mon Jun 30 2020 16:45:14 GMT+0100",
//     endingPeriod: "End of day",
//   },
// }

const DEFAULT_HOLIDAYS_ALLOWANCE = 20;

export const AppContext = React.createContext();

const useStyles = makeStyles((theme) => ({
  subtitle: {
    padding: theme.spacing(3, 0, 1),
  },
  updateButton: {
    marginRight: 15,
  },
}));

function App() {
  const classes = useStyles();
  const [serviceWorkerWaiting, setServiceWorkerWaiting] = useState();
  const [holidaysAllowance, setHolidaysAllowance] = useState(
    DEFAULT_HOLIDAYS_ALLOWANCE
  );
  const [holidays, setHolidays] = useState({});
  const hasHolidays = Object.keys(holidays).length > 0;

  const addHolidays = (holidays) => {
    setHolidays((state) => {
      const newState = {
        ...state,
        [Object.keys(state).length + 1]: holidays,
      };
      set("holidays", newState)
        .then(() => console.log("It worked!"))
        .catch((err) => console.log("It failed!", err));
      return newState;
    });
  };

  const editHolidays = (holidays, id) => {
    setHolidays((state) => {
      const newState = { ...state, [id]: holidays };
      set("holidays", newState);
      return newState;
    });
  };

  const removeHolidays = (id) => {
    setHolidays((state) => {
      const newState = { ...state };
      delete newState[id];
      set("holidays", newState);
      return newState;
    });
  };

  const editHolidaysAllowance = (holidaysAllowance) => {
    setHolidaysAllowance(holidaysAllowance);
    set("holidaysAllowance", holidaysAllowance);
  };

  const clearData = () => {
    setHolidaysAllowance(DEFAULT_HOLIDAYS_ALLOWANCE);
    setHolidays({});
    clear();
  };

  const updateApp = () => {
    if (serviceWorkerWaiting) {
      serviceWorkerWaiting.postMessage({ type: "SKIP_WAITING" });
      serviceWorkerWaiting.addEventListener("statechange", (e) => {
        if (e.target.state === "activated") {
          window.location.reload();
        }
      });
    } else {
      setServiceWorkerWaiting(false);
    }
  };

  useEffect(() => {
    get("holidays").then((val = {}) => {
      setHolidays(val);
    });
    get("holidaysAllowance").then((val = DEFAULT_HOLIDAYS_ALLOWANCE) => {
      setHolidaysAllowance(parseFloat(val));
    });

    emitter.on("SERVICE_WORKER_UPDATE", (registration) => {
      const registrationWaiting = registration.waiting;

      if (registrationWaiting) {
        setServiceWorkerWaiting(registrationWaiting);
      }
    });
  }, []);

  return (
    <Fragment>
      <CssBaseline />
      <AppContext.Provider
        value={{
          holidaysAllowance,
          holidays,
          addHolidays,
          editHolidays,
          removeHolidays,
          editHolidaysAllowance,
          clearData,
        }}
      >
        <AppBar />
        <main className="App">
          <Container maxWidth="sm">
            <HolidaysBreakdownCard />
            {hasHolidays && (
              <Fragment>
                <Typography
                  className={classes.subtitle}
                  variant="h6"
                  component="h2"
                  align="left"
                >
                  Holidays
                </Typography>
                <HolidayCard />
              </Fragment>
            )}
            <Snackbar
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              open={serviceWorkerWaiting}
              onClose={() => {}}
              message="New update available!"
              action={
                <Fragment>
                  <Button
                    className={classes.updateButton}
                    color="secondary"
                    size="small"
                    onClick={updateApp}
                  >
                    Update now
                  </Button>
                  <IconButton
                    size="small"
                    aria-label="close"
                    color="inherit"
                    onClick={() => setServiceWorkerWaiting(false)}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Fragment>
              }
            />
          </Container>
        </main>
      </AppContext.Provider>
    </Fragment>
  );
}

export default App;
