import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { getAllLinks } from "../api";
import { DisplayLinks, Header } from "../components";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
  const [links, setLinks] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await getAllLinks();
    if (data) {
      setLinks(data);
    }
  }

  return (
    <div className="app">
      <ToastContainer />
      <Router>
        <Header />
        <Switch>
          <Route path="/">
            <DisplayLinks
              setLinks={setLinks}
              links={links}
              setSearchValue={setSearchValue}
              searchValue={searchValue}
            />
          </Route>
        </Switch>
      </Router>
    </div>
  );
};

export default App;
