import React, { useState } from "react";
import { fade, makeStyles } from "@material-ui/core/styles";
import InputBase from "@material-ui/core/InputBase";
import Button from "@material-ui/core/Button";

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import AddLink from "./AddLink";
import FilterList from "@material-ui/icons/FilterList";


const useStyles = makeStyles((theme) => ({
  appBar: {
    maxWidth: "100%",
    margin: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: '#f2f2f2',
    marginRight: theme.spacing(2),
    width: "100%",
  },
  inputInput: {
    padding: theme.spacing(1),
    transition: theme.transitions.create("width"),
    width: "75%",
    [theme.breakpoints.up("md")]: {
      width: "50ch",
    },
  },
  toolBar: {
    // background: 'red',
    display: 'flex',
    justifyContent: 'space-between'
  },
}));

export default function SearchBar({
  setLinks,
  searchValue,
  setSearchValue,
  sortByHits,
}) {
  const classes = useStyles();
  const [modal, setModal] = useState(false);

  const handleOpen = () => {
    setModal(true);
  };

  const handleClose = () => {
    setModal(false);
  };

  return (
    <div className={classes.appBar}>
      <div className={classes.toolBar}>
        <div className={classes.search}>
          <InputBase
            placeholder="Search Link Here…"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            onClick={handleOpen}
            style={{ color: "white", margin: '0 20px' }}
          >
            Add Link
          </Button>
          <Button color="inherit" style={{ color: "white", margin: '0 20px' }} onClick={sortByHits} >
            SORT <FilterList />
          </Button>
        </div>
      </div>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={modal}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <AddLink setLinks={setLinks} setModal={(e) => setModal(e)} />
      </Modal>
    </div>
  );
}
