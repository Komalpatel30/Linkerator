const apiRouter = require("express").Router();

const {
  getLinks,
  updateLinkAndTagByLinkId,
  createLinkAndTag,
  getLinksByTagName,
} = require("../db");

apiRouter.get("/", (req, res, next) => {
  res.send({
    message: "API is under construction!",
  });
});

//Get all links

apiRouter.get("/links", async (req, res, next) => {
  try {
    const links = await getLinks();
    res.send(links);
  } catch (error) {
    next(error);
  }
});

//GET links based on tags

apiRouter.get("/tags/:tagName/links", async (req, res, next) => {
  try {
    const { tagName } = req.params;

    const linksByTagName = await getLinksByTagName(tagName);
    res.send(linksByTagName);
  } catch (error) {
    next(error);
  }
});

//POST Create tags when creating link

apiRouter.post("/links", async (req, res, next) => {
  try {
    const { link, comment, tag } = req.body;
    linkAndTag = await createLinkAndTag({ link, comment, tag });
    res.send(linkAndTag);
  } catch (error) {
    next(error);
  }
});

// To update comment , tags and count of link

apiRouter.patch("/links/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment, tag, addToCount } = req.body;

    updateLinkAndTag = await updateLinkAndTagByLinkId({
      id,
      comment,
      tag,
      addToCount,
    });
    res.send(updateLinkAndTag);
  } catch (error) {
    next(error);
  }
});

module.exports = apiRouter;
