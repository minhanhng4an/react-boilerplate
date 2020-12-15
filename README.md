# CoderSchool FTW - Cheetah - React Boilerplate Generator

Boilerplate Generator for React projects during CoderSchool FTW - Cheetah.

## Usage

```
node script.js --path <app-name>
```

### Arguments

```
  Required:
  --path <app-name>: Destination Folder of the React App (Folder must be empty).

  Optional:
  --redux: (Default: false) whether to install and setup redux.
  --toastitfy: (Default: false)  whether to install toastify.
  --start: (Default: false) wheter to start the app after installations.
```

## Boilerplate Structure

**Baseline**: bootstrap, axios, react-router

**Optional**: redux, toastify

```
<app-name>
├── src
│   ├── components
│   │   ├── PublicNavbar.js
│   │   ├── SideMenu.js
│   ├── pages
│   │   ├── HomePage.js
│   │   ├── NotFoundPage.js
│   ├── redux
│   │   ├── actions
│   │   ├── constants
│   │   ├── reducers
│   │   ├── store.js
│   ├── redux
│   │   ├── AdminLayout.js
│   │   ├── PrivateRoute.js
│   │   ├── PublicLayout.js
│   ├── apiService.js
│   ├── App.css
│   ├── App.js
│   └── index.js
└── ...

```
