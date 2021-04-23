// code to build and initialize DB goes here
const { client, createLink, createTag, createLinkTag } = require("./index");

async function buildTables() {
  try {
    client.connect();

    console.log("Dropping All Tables...");
    // drop all tables, in the correct order
    await client.query(`
    DROP TABLE IF EXISTS link_tags;
    DROP TABLE IF EXISTS tags;
    DROP TABLE IF EXISTS links;    
  `);

    console.log("Finished dropping tables!");
    console.log("Starting to build tables...");

    await client.query(`
        CREATE TABLE links (
          id SERIAL PRIMARY KEY,
          link TEXT UNIQUE NOT NULL,
          "clickCount" INTEGER NOT NULL DEFAULT 0,
          comment TEXT,
          date DATE NOT NULL DEFAULT CURRENT_DATE      
        );
        CREATE TABLE tags (
          id SERIAL PRIMARY KEY,                 
          tag varchar(255) UNIQUE NOT NULL              
        );   
        
        CREATE TABLE link_tags( id SERIAL PRIMARY KEY, 
          "linkId" INTEGER REFERENCES links(id) NOT NULL,       
          "tagId"  INTEGER REFERENCES tags(id) NOT NULL,
           UNIQUE("linkId", "tagId") );
      `);

    console.log("Finished building tables!");
  } catch (error) {
    console.log("Error building tables!");
    throw error;
  }
}

async function populateInitialData() {
  try {
    console.log("Starting to create links...");
    createLink({
      link:
        "https://material-ui.com/",
      clickCount: 20,
      comment: "React components for faster and easier web development. Build your own design system, or start with Material Design.",
    });
    createLink({
      link: "https://react.semantic-ui.com/",
      clickCount: 30,
      comment: "Semantic UI React is the official React integration for Semantic UI .",
    });
    createLink({
      link: "https://react-bootstrap.github.io/",
      clickCount: 40,
      comment: "The most popular front-end framework Rebuilt for React.",
    });

    console.log("Links created:");
    // console.log(links);
    console.log("Finished creating links!");

    console.log("starting to create tags...");

    createTag({
      tag: "Front-End",
    });
    createTag({
      tag: "Front-End",
    });
    createTag({
      tag: "Front-End",
    });

    // console.log("Tags Created: ", tags);
    console.log("Finished creating Tags.");
    console.log("starting to create Link_Tags...");

    createLinkTag({
      linkId: 1,
      tagId: 1,
    });
    createLinkTag({
      linkId: 2,
      tagId: 2,
    });

    // console.log("Link Tags Created: ", linkTags);
    console.log("Finished creating Link Tags.");
  } catch (error) {
    console.error("Error creating Initial Data!");
    throw error;
  }
}

buildTables()
  .then(() => { })
  .catch(console.error);
