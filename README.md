# Aplicación de notas (backend)
Este es el repositorio encargado de la parte del __backend__ de la aplicación de notas. Esta aplicación permite iniciar sesión con un usuario válido, y guardar notas que son procesadas y almacenadas en una base de datos.
La aplicación está desarrollada con [NodeJS](https://nodejs.org/es/), con la ayuda de [ExpressJS](https://expressjs.com/es/).

## Estructura de carpetas
~~~
├── index.js
├── app.js
├── build
│   └── ...
├── controllers
│   └── ...
├── models
│   └── ...
├── utils
│   ├── config.js
│   ├── logger.js
│   └── middleware.js
└── tests
    ├── test_helper.js
    └── ...
~~~

## Testing
Los test unitarios y de integración se realizan con [JEST](https://jestjs.io/) y [SuperTest](https://www.npmjs.com/package/supertest). Los test end to end realizados con [Cypress](https://www.cypress.io/) se encuentran en el repositorio del [frontend](https://github.com/cristiannd/notes-frontend).

## MongoDB
La base de datos que se utiliza para guardar la información es [MongoDB](https://www.mongodb.com/). Con la ayuda de la biblioteca [Mongoose](https://mongoosejs.com/) se realizan todas las interacciones con la base de de datos. También se utiliza [mongoose-unique-validator](https://www.npmjs.com/package/mongoose-unique-validator) para realizar validaciones de datos que evitan que se almacene información incompleta o no deseada.

## Interactuando con la aplicación
Para utilizar la aplicación es necesario tener un usuario válido. Ese usuario tendrá almacenada la contraseña encriptada en la base de datos con la ayuda de la biblioteca [bcrypt](https://www.npmjs.com/package/bcrypt).
De esta manera, una vez iniciado sesión, el usuario obtendrá un token único generado con [jsonwebtoken](https://jwt.io/), el cual le dará permisos para crear una nueva nota y editarla.
