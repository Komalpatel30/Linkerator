// Connect to DB
const { Client } = require('pg');
const DB_NAME = 'testdatabase'
const DB_URL = process.env.DATABASE_URL || `postgres://localhost:5432/${DB_NAME}`;
// const client = new Client(DB_URL);

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: DB_NAME,
  password: '123456',
  port: 5432,
})

// database methods

async function createLink({ link, clickCount, comment }) {
  try {
    const res = await client.query(`INSERT INTO
    links(link, "clickCount",comment)
    VALUES($1, $2,$3)
    returning *`, [link, clickCount, comment]);
    console.log('res:', res)
    // return link;
  } catch (error) {
    throw error;
  }
}

async function getLinks() {
  try {
    const { rows } = await client.query(`WITH L AS
    (SELECT *
      FROM LINKS),
  TL AS
    (SELECT *
      FROM TAGS T,
        LINK_TAGS LT
      WHERE T.ID = LT."tagId")
  SELECT l.id,LINK,
  "clickCount",
  COMMENT,date,TAG
  FROM L
  LEFT JOIN TL ON (L.ID = TL."linkId");`);

    return rows;
  } catch (error) {
    throw error;
  }
}

async function getLinksByTagName(tagName) {
  try {
    const {
      rows: [linksByTag],
    } = await client.query(`WITH L AS
    (SELECT *
      FROM LINKS),
  TL AS
    (SELECT *
      FROM TAGS T,
        LINK_TAGS LT
      WHERE T.ID = LT."tagId"
    )
  SELECT LINK,
  "clickCount",
  COMMENT,date,TAG
  FROM L
  JOIN TL ON (L.ID = TL."linkId") AND tl.tag = $1;`, [tagName]);
    return linksByTag;
  } catch (error) {
    throw error;
  }
}

async function createTag({ tag }) {
  try {
    const res = await client.query(`INSERT INTO
    tags(tag)
    VALUES($1)
    returning *`, [tag]);
    console.log('res:', res);
    //return tag;
  } catch (error) {
    throw error;
  }
}

async function createLinkTag({ linkId, tagId }) {
  try {
    const {
      rows: [linkTag],
    } = await client.query(`INSERT INTO
    link_tags("linkId", "tagId")
    VALUES($1, $2)
    returning *`, [linkId, tagId]);
    return linkTag;
  } catch (error) {
    throw error;
  }
}


async function createLinkAndTag({ link, comment, tag }) {
  try {
    /*check if tag already Exists*/
    const tagExistsQuery = `SELECT * FROM tags WHERE tag=$1`;
    const values = [tag];

    const {
      rows: [tagExists],
    } = await client.query(tagExistsQuery, values);

    if (tagExists) {
      /* Create Link */

      const queryLink = `INSERT INTO  links(link,comment)  VALUES($1, $2) returning id`;
      const linkValues = [link, comment];
      const {
        rows: [linkId],
      } = await client.query(queryLink, linkValues);

      /* create Link tag*/

      const queryLinkTag = `INSERT INTO link_tags("linkId","tagId") VALUES($1,$2) returning id`;
      const linkTagValues = [linkId.id, tagExists.id];

      const {
        rows: [linkTagId],
      } = await client.query(queryLinkTag, linkTagValues);

      return linkTagId;
    } else {

      /* Create tag first */

      const queryTag = `INSERT INTO tags(tag) VALUES($1) returning id`;
      const tagValues = [tag];
      const {
        rows: [tagId],
      } = await client.query(queryTag, tagValues);


      /* Create Link */

      const queryLink = `INSERT INTO links(link,comment) VALUES($1, $2) returning id`;
      const linkValues = [link, comment];
      const {
        rows: [linkId],
      } = await client.query(queryLink, linkValues);



      /* create Link tag*/

      const queryLinkTag = `INSERT INTO link_tags("linkId","tagId") VALUES($1,$2) returning id`;
      const linkTagValues = [linkId.id, tagId.id];

      const {
        rows: [linkTagId],
      } = await client.query(queryLinkTag, linkTagValues);

      return linkTagId;
    }
  } catch (error) {
    throw error;
  }
}

async function updateLinkAndTagByLinkId({ id, comment, tag, addToCount }) {
  try {
    /* Update Link comment or click count*/

    if (comment) {
      const {
        rows: [link],
      } = await client.query(
        `
          UPDATE links
          SET comment = $2
          WHERE id=$1
          RETURNING *;
      `,
        [id, comment]
      );
    }

    /*Add count*/

    if (addToCount) {
      const {
        rows: [link],
      } = await client.query(
        `
            UPDATE links
            SET "clickCount" ="clickCount"+1
            WHERE id=$1
            RETURNING *;
        `,
        [id]
      );
    }

    /*Get Corresponding TagId from Link_Tag*/
    if (tag) {
      const query = `SELECT "tagId" FROM link_tags WHERE "linkId"=$1`;
      const values = [id];

      const {
        rows: [tagId],
      } = await client.query(query, values);

      /* Update Tag */

      const {
        rows: [tagRow],
      } = await client.query(
        `
              UPDATE tags
              SET tag = $2
              WHERE id=$1
              RETURNING id;
          `,
        [tagId.tagId, tag]
      );

      return { tagId: tagRow.id };
    }
  } catch (error) {
    throw error;
  }
}

// export
module.exports = {
  client,
  createLink,
  createTag,
  getLinks,
  createLinkTag,
  updateLinkAndTagByLinkId,
  createLinkAndTag,
  getLinksByTagName,
  // db methods
}
