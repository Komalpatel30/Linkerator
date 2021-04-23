import React, { useState } from "react";
import SearchBar from "./SearchBar";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
// import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { updateLinkAndTag, getAllLinks } from "../api";

const useStyles = makeStyles((theme) => ({
  wrapper: {
    position: "absolute",
    top: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    textAlign: "center",
    paddingLeft: "100px",
    paddingRight: "100px",
  },
  root: {
    maxWidth: "80%",
    margin: "auto",
    paddingTop: "20px",
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 15,
  },
  details: {
    alignItems: "center",
    paddingLeft: "10px",
    overflowWrap: 'anywhere',
  },
  linkCon: {
    padding: 20,
  },
  items: {
    borderRadius: 20,
    marginBottom: 15,
    backgroundColor: "#e6ebff",
    borderBottom: '5px solid #ba68c8',
  },
  titleStyle: { fontWeight: "600", fontStyle: "bold", fontSize: 16, paddingRight: "14px", color: "#ba68c8" },
  title: { fontWeight: "900", fontStyle: "bold", fontSize: 16, paddingRight: "14px", color: "#3f3c3c" },
}));

const DisplayLinks = (props) => {
  const { setLinks, links, setSearchValue, searchValue } = props;
  const classes = useStyles();
  const [sort, setSort] = useState(false);

  async function onLinkClickHandler(link) {
    try {
      await updateLinkAndTag(link.id, link.comment, link.tag, true);
      try {
        Promise.all([getAllLinks()]).then(([data]) => {
          setLinks(data);
        });
      } catch (error) {
        console.log(error);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const linkMatches = (link, text) => {
    if (!text) return false;
    const lowerCaseText = text.toLowerCase();
    const linkUrl = link.link.toLowerCase();
    const comment = link.comment.toLowerCase();
    const hits = link.clickCount;

    let tag;
    if (link.tag) tag = link.tag.toLowerCase();
    if (
      !tag &&
      (linkUrl.includes(lowerCaseText) ||
        comment.includes(lowerCaseText) ||
        hits === parseInt(text.trim()))
    ) {
      return true;
    } else if (tag) {
      if (
        linkUrl.includes(lowerCaseText) ||
        comment.includes(lowerCaseText) ||
        tag.includes(lowerCaseText) ||
        hits === parseInt(text.trim())
      )
        return true;
    } else {
      return false;
    }
  };

  const filteredLinks = links.filter((link) => linkMatches(link, searchValue));
  const linksToDisplay = searchValue ? filteredLinks : links;

  const sortByHits = () => {
    console.log("🚀 ~ file: DisplayLinks.js ~ line 105 ~ sorted ~ links", links)
    if (sort) {
      const sorted = links.sort((a, b) => {
        return b.clickCount - a.clickCount;
      });
      setSort(false);
      setLinks(sorted);
    } else {
      const sorted = links.sort((a, b) => {
        return a.clickCount - b.clickCount;
      });
      setSort(true);
      setLinks(sorted);
    }
  };

  return (
    <div>
      <SearchBar
        links={links}
        setLinks={setLinks}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        sort={sort}
        sortByHits={sortByHits}
      />
      <div className={classes.root}>
        {linksToDisplay.map((link, index) => {
          return (
            <div key={index} className={classes.items}>
              <div className={classes.details}>
                <Grid xs={12}>
                  <div className={classes.linkCon}>
                    <Typography variant="caption">
                      <Typography variant="caption" className={classes.titleStyle}>
                        <span className={classes.title}>URL:</span>
                        <a
                          href={link.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => onLinkClickHandler(link)}
                        >
                          {link.link}
                        </a>
                      </Typography>
                      <br />
                      <Typography variant="caption" className={classes.titleStyle}>
                        <span className={classes.title}> COMMENT: </span>
                        {link.comment}
                      </Typography>
                      <br />
                      <Typography variant="caption" className={classes.titleStyle}>
                        <span className={classes.title}> DATE CREATED: </span>{" "}
                        {link.date}
                      </Typography>
                      <br />
                      <Typography variant="caption" className={classes.titleStyle}>
                        <span className={classes.title}> TAG NAME:</span>
                        {link.tag}
                      </Typography>
                      <br />
                      <Typography variant="caption" className={classes.titleStyle}>
                        <span className={classes.title}> Total Hits:</span>{" "}
                        {link.clickCount}
                      </Typography>
                      <br />
                    </Typography>
                  </div>
                </Grid>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DisplayLinks;
