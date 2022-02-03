quiz-app

A simple app for quiz.

<br>

<h1>Demo by Docker (recommend):</h1>

prerequisite: Docker

run the following command at root folder:
```
docker-compose up
```
wait for few minuites, then access the app by http://localhost:3000

<br>

<h1>Development:</h1>

<h2>frontend</h2>

install packages:
```
npm install
```

run by development mode
```
npm start
```

<h2>backend:</h2>
install packages:
```
npm install
```

run server (mongodb is required, change database host by changing variable DB_HOST in .env file):
```
npm start
```

<br>

<h1>production build:</h1>

production build:
```
npm build
```

<h2>frontend:</h2>

install packages:
```
npm install
```

build:
```
npm build
```
  
<br>

<h2>backend:</h2>
 
install packages:
```
npm install
```

run server (mongodb is required):
```
npm start
```
  
<br>

OR

<br>
  
build production by docker (local mongodb is required)
in "backend" folder, run the following command:
```
docker build . -t [username]/[appname]
```

then put image to any cloud container
