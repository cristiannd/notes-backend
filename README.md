<a name="readme-top"></a>
<div align="center">
    <h1>postIT</h1>
</div>
 
The app is a small social media, inspired by [Twitter](https://twitter.com/), where the tweets are replaced with short notes. You can give a _favorite_ to other users’ notes and even your own. As well you have the possibility to filter your notes or your favorite ones.
<br>
 
<details>
  <summary>Index</summary>
  <ol>
    <li>
      <a href="#about-the-project">About the project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#features">Features</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#folder-structure">Folder structure</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>
 
<br>
 
## About the project
The purpose of the creation of the application was learning and improving the use of different technologies for the frontend and the backend.
<br>
This is the repository of the _backend_. Here you can access the repository of the frontend -> [frontend][frontend-url].
 
### Built With
- NodeJS
- Express
- MongoDB
- Mongoose
- JWT
 
### Features
- Create a user’s account.
- Log in with a validated account.
- Create a note.
- Give a _favorite_ to a note.
- See all the notes from different users.
- See the created notes.
- See your favorite notes.
 
<br>
 
## Getting started
### Installation
1. Clone the repo
    ```sh
    git clone https://github.com/cristiannd/notes-backend.git
    ```
2. Change the current working directory to the folder
    ```sh
    cd notes-backend
    ```
3. Install NPM packages
    ```sh
    npm install
    ```
4. Enter your MONGO key in `utils/config.js`
    ```js
    let MONGODB_URI='ENTER YOUR MONGO API KEY'
    ```
5. Start API
    ```sh
    npm start
    ```
 
<br>
 
## Folder structure
~~~
.
├── index.js
├── app.js
├── controllers
│   └── ...
├── models
│   └── ...
├── utils
│   └── ...
└── tests
    ├── test_helper.js
    └── ...
~~~
 
<br>
 
## Contact
- LinkedIn: [/in/cristian-donalicio](https://www.linkedin.com/in/cristian-donalicio/)
- Email: cristian.donalicio@gmail.com
 
<p align="right"><a href="#readme-top">↑ back to the top</a></p>
 
<!-- LINKS -->
[frontend-url]: https://github.com/cristiannd/notes-frontend
