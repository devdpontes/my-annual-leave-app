import React, { Fragment, useState, useContext } from "react";
import { format } from "date-fns";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import EditIcon from "@material-ui/icons/Edit";
import { colors } from "../styles/variables";
import AddHolidayModal from "./HolidayModal";
import { AppContext } from "./App";
import { getHolidayDays } from "./helpers";

const useStyles = makeStyles({
  root: {
    maxWidth: 500,
    marginBottom: 10,
  },
  subtitle: {
    paddingBottom: 0,
    color: colors.primary,
  },
});

export default function HolidayCard() {
  const classes = useStyles();
  const { holidays } = useContext(AppContext);

  const [open, setOpen] = useState(false);
  const [holidaysId, setHolidaysId] = useState(null);

  const handleClickOpen = (id) => {
    setHolidaysId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Fragment>
      {Object.keys(holidays).map((holidayId, index) => {
        const {
          startingDate,
          startingPeriod,
          endingDate,
          endingPeriod,
        } = holidays[holidayId];
        const holidayDays = getHolidayDays({
          startingDate,
          startingPeriod,
          endingDate,
          endingPeriod,
        });

        return (
          <Card className={classes.root} key={index}>
            <List>
              <ListItem className={classes.subtitle}>
                <Typography
                  variant="h5"
                  component="h3"
                  align="left"
                  color="inherit"
                >
                  {holidayDays} days
                </Typography>
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={format(new Date(startingDate), "dd/MM/yyyy")}
                  secondary={startingPeriod}
                />
                <ListItemText
                  primary={format(new Date(endingDate), "dd/MM/yyyy")}
                  secondary={endingPeriod}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => handleClickOpen(holidayId)}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </List>
          </Card>
        );
      })}
      {open && (
        <AddHolidayModal
          open={open}
          handleClose={handleClose}
          edit={true}
          id={holidaysId}
        />
      )}
    </Fragment>
  );
}
