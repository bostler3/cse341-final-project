const swaggerAutogen = require('swagger-autogen')();
const fs = require('fs');

const doc = {
  info: {
    title: 'Movies API',
    description: 'Team 09 CSE341 Movies API',
  },
  host: 'localhost:8080',
};

const outputFile = './swagger.json';
// const routes = ['./path/userRoutes.js', './path/bookRoutes.js'];
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc).then(() => {
  const generatedSpec = JSON.parse(fs.readFileSync(outputFile, 'utf8'));

  generatedSpec.securityDefinitions = {
    ...(generatedSpec.securityDefinitions || {}),
    sessionAuth: {
      type: 'apiKey',
      in: 'header',
      name: 'Cookie',
      description:
        'Session-based auth. Login via /auth/github in the browser; Swagger requests use the session cookie automatically.',
    },
  };

  generatedSpec.definitions = {
    ...(generatedSpec.definitions || {}),
    MoviePostInput: {
      type: 'object',
      required: [
        'title',
        'releaseYear',
        'genre',
        'rating',
        'runtimeMinutes',
        'directorId',
        'actorIds',
        'synopsis',
      ],
      properties: {
        title: { type: 'string', example: 'The Dark Knight Rises' },
        releaseYear: { type: 'integer', example: 2012 },
        genre: { type: 'array', items: { type: 'string' }, example: ['Action'] },
        rating: { type: 'string', example: 'PG-13' },
        runtimeMinutes: { type: 'integer', example: 165 },
        directorId: { type: 'string', example: '67f0c3e0a1b2c3d4e5f60789' },
        actorIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
        },
        synopsis: {
          type: 'string',
          example:
            'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace.',
        },
      },
      example: {
        title: 'The Dark Knight Rises',
        releaseYear: 2012,
        genre: ['Action'],
        rating: 'PG-13',
        runtimeMinutes: 165,
        directorId: '67f0c3e0a1b2c3d4e5f60789',
        actorIds: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
        synopsis:
          'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace.',
      },
    },
    MoviePutInput: {
      type: 'object',
      required: [
        'title',
        'releaseYear',
        'genre',
        'rating',
        'runtimeMinutes',
        'directorId',
        'actorIds',
        'synopsis',
      ],
      properties: {
        title: { type: 'string', example: 'The Dark Knight Rises' },
        releaseYear: { type: 'integer', example: 2012 },
        genre: { type: 'array', items: { type: 'string' }, example: ['Action', 'Crime'] },
        rating: { type: 'string', example: 'PG-13' },
        runtimeMinutes: { type: 'integer', example: 165 },
        directorId: { type: 'string', example: '67f0c3e0a1b2c3d4e5f60789' },
        actorIds: {
          type: 'array',
          items: { type: 'string' },
          example: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
        },
        synopsis: {
          type: 'string',
          example:
            'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace. This forces Bruce Wayne to come out of hiding and don the cape and cowl of Batman again.',
        },
      },
      example: {
        title: 'The Dark Knight Rises',
        releaseYear: 2012,
        genre: ['Action', 'Crime'],
        rating: 'PG-13',
        runtimeMinutes: 165,
        directorId: '67f0c3e0a1b2c3d4e5f60789',
        actorIds: ['67f0c3e0a1b2c3d4e5f60790', '67f0c3e0a1b2c3d4e5f60791'],
        synopsis:
          'Bane, an imposing terrorist, attacks Gotham City and disrupts its eight-year-long period of peace. This forces Bruce Wayne to come out of hiding and don the cape and cowl of Batman again.',
      },
    },
    ActorPostInput: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthDate', 'nationality', 'awards'],
      properties: {
        firstName: { type: 'string', example: 'Christian' },
        lastName: { type: 'string', example: 'Bale' },
        birthDate: { type: 'string', format: 'date', example: '1975-01-30' },
        nationality: { type: 'string', example: 'British' },
        awards: { type: 'array', items: { type: 'string' }, example: ['Academy Award'] },
      },
      example: {
        firstName: 'Christian',
        lastName: 'Bale',
        birthDate: '1975-01-30',
        nationality: 'British',
        awards: ['Academy Award'],
      },
    },
    ActorPutInput: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthDate', 'nationality', 'awards'],
      properties: {
        firstName: { type: 'string', example: 'Christian' },
        lastName: { type: 'string', example: 'Bale' },
        birthDate: { type: 'string', format: 'date', example: '1974-01-30' },
        nationality: { type: 'string', example: 'British' },
        awards: { type: 'array', items: { type: 'string' }, example: ['Academy Award'] },
      },
      example: {
        firstName: 'Christian',
        lastName: 'Bale',
        birthDate: '1974-01-30',
        nationality: 'British',
        awards: ['Academy Award'],
      },
    },
    DirectorPostInput: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthDate', 'nationality'],
      properties: {
        firstName: { type: 'string', example: 'Robert' },
        lastName: { type: 'string', example: 'Zemeckis' },
        birthDate: { type: 'string', format: 'date', example: '1950-05-14' },
        nationality: { type: 'string', example: 'American' },
        awards: {
          type: 'array',
          items: { type: 'string' },
          example: ['Academy Award Best Director'],
        },
      },
      example: {
        firstName: 'Robert',
        lastName: 'Zemeckis',
        birthDate: '1950-05-14',
        nationality: 'American',
        awards: ['Academy Award Best Director'],
      },
    },
    DirectorPutInput: {
      type: 'object',
      required: ['firstName', 'lastName', 'birthDate', 'nationality'],
      properties: {
        firstName: { type: 'string', example: 'Robert' },
        lastName: { type: 'string', example: 'Zemeckis' },
        birthDate: { type: 'string', format: 'date', example: '1951-05-14' },
        nationality: { type: 'string', example: 'American' },
        awards: {
          type: 'array',
          items: { type: 'string' },
          example: ['Academy Award Best Director'],
        },
      },
      example: {
        firstName: 'Robert',
        lastName: 'Zemeckis',
        birthDate: '1951-05-14',
        nationality: 'American',
        awards: ['Academy Award Best Director'],
      },
    },
    UserPostInput: {
      type: 'object',
      required: ['displayName', 'role', 'email'],
      properties: {
        displayName: { type: 'string', example: 'John.Doe' },
        role: { type: 'string', example: 'editor' },
        email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        githubId: { type: 'string', example: '12345' },
      },
      example: {
        displayName: 'John.Doe',
        role: 'editor',
        email: 'john.doe@example.com',
        githubId: '12345',
      },
    },
    UserPutInput: {
      type: 'object',
      required: ['displayName', 'role', 'email'],
      properties: {
        displayName: { type: 'string', example: 'John.Smith' },
        role: { type: 'string', example: 'editor' },
        email: { type: 'string', format: 'email', example: 'john.smith@example.com' },
        githubId: { type: 'string', example: '12345' },
      },
      example: {
        displayName: 'John.Smith',
        role: 'editor',
        email: 'john.smith@example.com',
        githubId: '12345',
      },
    },
  };

  const addBodyParam = (operation, definitionName) => {
    if (!operation) return;

    const existingParameters = Array.isArray(operation.parameters) ? operation.parameters : [];
    const nonBodyParameters = existingParameters.filter((parameter) => parameter.in !== 'body');

    operation.parameters = [
      ...nonBodyParameters,
      {
        name: 'body',
        in: 'body',
        required: true,
        schema: { $ref: `#/definitions/${definitionName}` },
      },
    ];
  };

  const addSecurity = (operation) => {
    if (!operation) return;

    operation.security = [{ sessionAuth: [] }];
  };

  addBodyParam(generatedSpec.paths?.['/movies/']?.post, 'MoviePostInput');
  addBodyParam(generatedSpec.paths?.['/movies/{id}']?.put, 'MoviePutInput');
  addBodyParam(generatedSpec.paths?.['/actors/']?.post, 'ActorPostInput');
  addBodyParam(generatedSpec.paths?.['/actors/{id}']?.put, 'ActorPutInput');
  addBodyParam(generatedSpec.paths?.['/directors/']?.post, 'DirectorPostInput');
  addBodyParam(generatedSpec.paths?.['/directors/{id}']?.put, 'DirectorPutInput');
  addBodyParam(generatedSpec.paths?.['/users/']?.post, 'UserPostInput');
  addBodyParam(generatedSpec.paths?.['/users/{id}']?.put, 'UserPutInput');

  addSecurity(generatedSpec.paths?.['/movies/']?.post);
  addSecurity(generatedSpec.paths?.['/movies/{id}']?.put);
  addSecurity(generatedSpec.paths?.['/movies/{id}']?.delete);
  addSecurity(generatedSpec.paths?.['/actors/']?.post);
  addSecurity(generatedSpec.paths?.['/actors/{id}']?.put);
  addSecurity(generatedSpec.paths?.['/actors/{id}']?.delete);
  addSecurity(generatedSpec.paths?.['/directors/']?.post);
  addSecurity(generatedSpec.paths?.['/directors/{id}']?.put);
  addSecurity(generatedSpec.paths?.['/directors/{id}']?.delete);
  addSecurity(generatedSpec.paths?.['/users/']?.post);
  addSecurity(generatedSpec.paths?.['/users/{id}']?.put);
  addSecurity(generatedSpec.paths?.['/users/{id}']?.delete);

  if (generatedSpec.paths && generatedSpec.paths['/']) {
    delete generatedSpec.paths['/'];
  }

  fs.writeFileSync(outputFile, JSON.stringify(generatedSpec, null, 2));
});
