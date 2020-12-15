const fs = require("fs");
const path = require("path");
const process = require("process");
const { execSync } = require("child_process");

// Extract arguments
const args = require("minimist")(process.argv.slice(2));
const rootPath = args["path"];
const redux = args["redux"];
const toastify = args["toastify"];
const start = args["start"];

// Check required arguments
if (!rootPath) {
  throw Error("Missing required argument: --path");
}

// Structure: Baseline
const baselineStructure = [
  // index.js
  {
    type: "file",
    name: "index.js",
    template: `import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

${
  redux &&
  `import { Provider } from "react-redux";
import store from "./redux/store";`
}

ReactDOM.render(
  ${
    redux
      ? `<Provider store={store}>
    <App />
  </Provider>,`
      : `<App/>`
  }
  document.getElementById("root")
);`,
  },
  // App.js
  {
    type: "file",
    name: "App.js",
    template: `import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AdminLayout from "./routes/AdminLayout";
import PublicLayout from "./routes/PublicLayout";
import PrivateRoute from "./routes/PrivateRoute";
import AlertMsg from "./components/AlertMsg";

function App() {
  return (
    <Router>
      <AlertMsg />
      <Switch>
        <PrivateRoute path="/admin" component={AdminLayout} />
        <Route path="/" component={PublicLayout} />
      </Switch>
    </Router>
  );
}

export default App;
`,
  },
  // App.css
  { type: "file", name: "App.css", template: "" },
  // apiService.js
  {
    type: "file",
    name: "apiService.js",
    template: `import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_API,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * console.log all requests and responses
 */
api.interceptors.request.use(
  (request) => {
    console.log("Starting Request", request);
    return request;
  },
  function (error) {
    console.log("REQUEST ERROR", error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log("Response:", response);
    return response;
  },
  function (error) {
    error = error.response.data;
    console.log("RESPONSE ERROR", error);

    // Error Handling here

    return Promise.reject(error);
  }
);

export default api;`,
  },
  // Folder: components
  {
    type: "folder",
    name: "components",
    template: [
      // components/PublicNavbar.js
      {
        type: "file",
        name: "PublicNavbar.js",
        template: `import React from "react";
import { Navbar, Nav } from "react-bootstrap";


const PublicNavbar = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand>
        <img src={""} alt="CoderSchool" width="200px" />
      </Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
        <Nav.Link href="#features">Features</Nav.Link>
      </Nav>
      <Nav>
        <a href="#your_github_repo_link" target="_blank">
          <img src={""} alt="Github" width="32px" />
        </a>
      </Nav>
    </Navbar>
  );
};

export default PublicNavbar;`,
      },
      // components/SideMenu.js
      {
        type: "file",
        name: "SideMenu.js",
        template: `import React from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

const SideMenu = () => {
  return (
    <Nav className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse">
      <div className="sidebar-sticky pt-3"></div>
    </Nav>
  );
};

export default SideMenu;
`,
      },
    ],
  },
  // Folder: routes
  {
    type: "folder",
    name: "routes",
    template: [
      // routes/AdminLayout.js
      {
        type: "file",
        name: "AdminLayout.js",
        template: `import React from "react";
import PublicNavbar from "../components/PublicNavbar";
import SideMenu from "../components/SideMenu";
import { Container, Row, Col } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";

import NotFoundPage from "../pages/NotFoundPage";

const AdminLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Container fluid>
        <Row>
          <Col md={3} lg={2}>
            <SideMenu />
          </Col>
          <Col md={9} lg={10}>
            <Switch>
              <Route component={NotFoundPage} />
            </Switch>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminLayout;
`,
      },
      // routes/PublicLayout.js
      {
        type: "file",
        name: "PublicLayout.js",
        template: `import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import HomePage from "../pages/HomePage";
import NotFoundPage from "../pages/NotFoundPage";
import PrivateRoute from "./PrivateRoute";

const PublicLayout = () => {
  return (
    <>
      <PublicNavbar />
      <Container>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
      </Container>
    </>
  );
};

export default PublicLayout;
`,
      },
      // routes/PrivateLayout.js
      {
        type: "file",
        name: "PrivateRoute.js",
        template: `import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ ...rest }) => {
  const isAuthenticated = true;
  if (isAuthenticated) return <Route {...rest} />;
  delete rest.component;
  return <Route {...rest} render={(props) => <Redirect to="/login" />} />;
};

export default PrivateRoute;
`,
      },
    ],
  },
  // Folder: pages
  {
    type: "folder",
    name: "pages",
    template: [
      // pages/Homepage.js
      {
        type: "file",
        name: "HomePage.js",
        template: `import React from "react";

import { Container } from "react-bootstrap";

const HomePage = () => {
  return (
    <Container>
      <h1>Home Page</h1>
    </Container>
  );
};

export default HomePage;
`,
      },
      // pages/NotFoundPage.js
      {
        type: "file",
        name: "NotFoundPage.js",
        template: `import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const NotFoundPage = () => {
  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <h1>404</h1>
          <p>The page you are looking for does not exist.</p>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundPage;
`,
      },
    ],
  },
];

// Structure: redux
const reduxStructure = [
  // Folder: redux
  {
    type: "folder",
    name: "redux",
    template: [
      // Folder: actions
      { type: "folder", name: "actions", template: [] },
      // Folder: constatns
      { type: "folder", name: "constants", template: [] },
      // Folder: reducers
      {
        type: "folder",
        name: "reducers",
        template: [
          // redux/reducers/index.js
          {
            type: "file",
            name: "index.js",
            template: `import { combineReducers } from 'redux'
export default combineReducers({});`,
          },
        ],
      },
      // redux/store.js
      {
        type: "file",
        name: "store.js",
        template: `import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;`,
      },
    ],
  },
];

// Structure: toastify
const toastifyStructure = [
  // components/AlertMsg.js
  {
    type: "folder",
    name: "components",
    template: [
      {
        type: "file",
        name: "AlertMsg.js",
        template: `import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AlertMsg = () => {
  return (
    <ToastContainer
      position="top-right"
      hideProgressBar={false}
      newestOnTop={true}
      pauseOnHover
    />
  );
};

export default AlertMsg;`,
      },
    ],
  },
];

/**
 *Function to generate folder structure
 * @param {String} currentPath Root path for the current template
 * @param {Array} template Template to generate folder structure
 */

const createStructure = (currentPath, template) => {
  template.forEach((item) => {
    if (item.type === "file") {
      const fileName = path.join(currentPath, item.name);
      fs.writeFileSync(fileName, item.template);

      console.log(`Create File ${fileName}`);
    } else {
      const nextPath = path.join(currentPath, item.name);
      try {
        fs.accessSync(nextPath);
      } catch {
        fs.mkdirSync(nextPath);
        console.log(`Create Folder ${nextPath}`);
      }

      createStructure(nextPath, item.template);
    }
  });
};

/**
 * Function to initialize new react app
 * 1. Create new react app
 * 2. Change directory to new react app folder
 * 3. Remove src folder
 * 4. Create empty src folder
 */
const createReactApp = () => {
  execSync(`npx create-react-app ${rootPath}`, {
    stdio: "inherit",
    shell: true,
  });
  process.chdir(rootPath);
  fs.rmdirSync("src", { recursive: true });
  fs.mkdirSync("src");
};

/**
 * Function to install React dependencies
Default: bootstrap, axios, react-router
Optional: redux, toastify
 */
const installDependencies = () => {
  const commands = ["bootstrap react-bootstrap", "axios", "react-router-dom"];

  commands.forEach((command) => {
    execSync(`npm install ${command}`, {
      stdio: "inherit",
      shell: true,
    });
  });

  if (redux)
    execSync(
      "npm install redux react-redux redux-thunk redux-devtools-extension",
      {
        stdio: "inherit",
        shell: true,
      }
    );
  if (toastify)
    execSync("npm install react-toastify", {
      stdio: "inherit",
      shell: true,
    });
};

/**
 * Function to setup project structures
 */
const setupProject = () => {
  const currentPath = path.join("src"); // Create project structures inside src folder

  console.log("--- Baseline ---");
  createStructure(currentPath, baselineStructure);

  if (redux) {
    console.log("--- Redux --- ");
    createStructure(currentPath, reduxStructure);
  }

  if (toastify) {
    console.log("--- Toastify ---");
    createStructure(currentPath, toastifyStructure);
  }
};

/**
 * Function to start React app
 * Start app when argument --start is given
 */
const startApp = () => {
  if (start)
    execSync("npm start", {
      stdio: "inherit",
      shell: true,
    });
};

/**
 * Function to run boilerplate generator
 */
const run = () => {
  createReactApp();
  installDependencies();
  setupProject();
  startApp();
};

run(); // Execute boilerplate generator
