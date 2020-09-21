import React, { Fragment, useState, useEffect } from "react";
import { get, set, clear } from "idb-keyval";
import { makeStyles } from "@material-ui/core/styles";
import { Typography, Container, CssBaseline } from "@material-ui/core";
import AppBar from "./AppBar";
import HolidaysBreakdownCard from "./HolidaysBreakdownCard";
import HolidayCard from "./HolidayCard";
import AppUpdate from "./AppUpdate";
import "./App.css";

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

  useEffect(() => {
    get("holidays").then((val = {}) => {
      setHolidays(val);
    });
    get("holidaysAllowance").then((val = DEFAULT_HOLIDAYS_ALLOWANCE) => {
      setHolidaysAllowance(parseFloat(val));
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
            <AppUpdate />
          </Container>
        </main>
      </AppContext.Provider>
    </Fragment>
  );
}

export default App;
