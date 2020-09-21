import React, { Fragment, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Snackbar, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { emitter } from "../lib/event-emitter";

const useStyles = makeStyles((theme) => ({
  updateButton: {
    marginRight: 15,
  },
}));

function AppUpdate() {
  const classes = useStyles();
  const [serviceWorkerWaiting, setServiceWorkerWaiting] = useState();

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
    emitter.on("SERVICE_WORKER_UPDATE", (registration) => {
      const registrationWaiting = registration.waiting;

      if (registrationWaiting) {
        setServiceWorkerWaiting(registrationWaiting);
      }
    });
  }, []);

  return (
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
  );
}

export default AppUpdate;
