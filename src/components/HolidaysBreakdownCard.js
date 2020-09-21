import React, { useContext } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import { AppContext } from "./App";
import { getHolidayDays } from "./helpers";
import { colors } from "../styles/variables";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    color: colors.primary,
  },
  title: {
    marginBottom: 10,
  },
  subtitle: {
    marginBottom: 5,
  },
  tableRow: {
    display: "flex",
    justifyContent: "space-between",
  },
  divider: {
    marginTop: 10,
    marginBottom: 10,
  },
});

function getHolidaysNumber(holidays) {
  return Object.keys(holidays).reduce((result, key) => {
    const holiday = holidays[key];
    const { startingDate, startingPeriod, endingDate, endingPeriod } = holiday;
    const holidayDays = getHolidayDays({
      startingDate,
      startingPeriod,
      endingDate,
      endingPeriod,
    });
    return result + holidayDays;
  }, 0);
}

export default function HolidaysBreakdownCard() {
  const { holidays, holidaysAllowance } = useContext(AppContext);
  const classes = useStyles();
  const holidaysNumber = getHolidaysNumber(holidays);

  return (
    <Card className={classes.root}>
      <CardContent>
        <Typography
          variant="h4"
          component="h2"
          align="left"
          color="inherit"
          className={classes.title}
        >
          2020
        </Typography>
        <Typography
          variant="h6"
          component="h3"
          color="textSecondary"
          align="left"
          className={classes.subtitle}
        >
          Days
        </Typography>
        <Typography
          variant="body2"
          component="p"
          align="left"
          color="textSecondary"
          className={classes.tableRow}
        >
          <span>Allowance</span>
          <span>{holidaysAllowance}</span>
        </Typography>
        <Typography
          variant="body2"
          component="p"
          align="left"
          color="textSecondary"
          className={classes.tableRow}
        >
          <span>Holidays</span>
          <span>{holidaysNumber}</span>
        </Typography>
        <Divider className={classes.divider} />
        <Typography
          variant="h5"
          component="p"
          align="left"
          color="inherit"
          className={classes.tableRow}
        >
          <span>Days remaining</span>
          <span>{holidaysAllowance - holidaysNumber}</span>
        </Typography>
      </CardContent>
    </Card>
  );
}
