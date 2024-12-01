# Template for ECS639U Individual Coursework

This template should be used as the starting point for your individual coursework in the module ECS639U Web Programming (at Queen Mary University of London). Module leader: Paulo Oliva <[p.oliva@qmul.ac.uk](mailto:p.oliva@qmul.ac.uk)>

## Create conda environment

After cloning this repository, create a conda environment for this project and activate the environment:

```console
$ conda create --name cwindividual python=3.11
$ conda activate cwindividual
```

## Django backend

The `backend` folder contains a [Django project](https://docs.djangoproject.com/en/stable/intro/tutorial01/) and was created with:

```console
(cwindividual)$ django-admin startproject backend
```

### Install backend (Python) dependencies

With the conda environment active, install the backend (Python) dependencies:

```console
(cwindividual)$ cd backend
(cwindividual)$ pip install -r requirements.txt
```

The main backend dependencies (see requirements.txt) are the Django framework itself (Django) and [django-cors-headers](https://pypi.org/project/django-cors-headers/) which is needed for CORS requests (since the request origin address http://localhost:5713 is different from the address that sent the JavaScript code to the browser http://localhost:8000).

### Start backend server

To start the backend server cd into the backend folder where the manage.py file is (if not already there)

```console
(cwindividual)$ cd backend
```

and run

```console
(cwindividual)$ python manage.py runserver
```

The server will start on http://localhost:8000

### API app

An "api" Django app has already been created with the command

```console
$ python manage.py startapp api
```

and can be tested by visiting http://localhost:8000/api/test.json

## Vue frontend

The `frontend` folder contains a [Vue/Vite project](https://vitejs.dev/guide/) and was created with:

```console
(cwindividual)$ npm create vite@latest
```

### Install frontend (JavaScript) dependencies

To install the frontend (JavaScript) dependencies cd into the frontend folder

```console
(cwindividual)$ cd frontend
```

and run:

```console
(cwindividual)$ npm install
```

The main frontend dependencies (see package.json) are [vue](https://vuejs.org/guide/introduction.html) and [bootstrap](https://getbootstrap.com/docs/5.0/getting-started/download/).

### Start frontend server

To start the frontend server run

```console
(cwindividual)$ npm run dev
```

and the server will start on http://localhost:5173
