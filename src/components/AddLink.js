import React, { useState } from "react";
import { addLinkAndTag, getAllLinks } from "../api";
import { toast } from 'react-toastify';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
    padding: 20
  },
  fieldStyle: {
    width: '90%',
  }
}));


const AddLink = (props) => {
  const classes = useStyles();

  const [link, setLink] = useState('');
  const [comment, setComment] = useState('');
  const [tag, setTag] = useState('');
  const { setLinks, setModal } = props;

  async function handleSubmit(e) {
    e.preventDefault();
    if ((link.length || link.length || link.length) <= 0) {
      toast.error("Fillup all fields to add link");
    } else {
      try {
        await addLinkAndTag(link, comment, tag);
        toast.success("Link successfully Added");
        setModal(false);
        try {
          Promise.all([getAllLinks()]).then(([data]) => {
            setLinks(data);
          });
        } catch (error) {
          console.log(error);
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to Add Link");
      }
    }
  }
  return (
    <div className={classes.root} style={{ background: '#FFFFFF' }}>
      <h2>Add Link</h2>
      <Grid container xs={12} spacing={2} >
        <Grid item xs={12}>
          <TextField className={classes.fieldStyle} id="outlined-basic" label="Link" variant="outlined" value={link} onChange={(e) => setLink(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField className={classes.fieldStyle} id="outlined-basic" label="Comment" variant="outlined" value={comment} onChange={(e) => setComment(e.target.value)} />
        </Grid>
        <Grid item xs={12}>
          <TextField className={classes.fieldStyle} id="outlined-basic" label="Tag" variant="outlined" value={tag} onChange={(e) => setTag(e.target.value)} />
        </Grid>
      </Grid>

      <div style={{ marginTop: "10px" }}>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
};

export default AddLink;
