# Movie API Database Schema

## Database Name

- movie_api

## Collections

### users

Stores application users and authorization metadata.

Required fields:

- githubId (string, unique)
- displayName (string)
- email (string, unique)
- role (string: admin or editor)
- createdAt (date)
- updatedAt (date)

Example document:

```json
{
  "_id": "ObjectId",
  "githubId": "12345678",
  "displayName": "Francesco Bostler",
  "email": "francesco@example.com",
  "role": "admin",
  "createdAt": "2026-04-01T00:00:00.000Z",
  "updatedAt": "2026-04-01T00:00:00.000Z"
}
```

Indexes:

- unique index on githubId
- unique index on email

### directors

Stores movie directors.

Required fields:

- firstName (string)
- lastName (string)
- birthDate (date)
- nationality (string)
- createdBy (ObjectId -> users.\_id)
- createdAt (date)
- updatedAt (date)

Optional fields:

- awards (array of strings)

Example document:

```json
{
  "_id": "ObjectId",
  "firstName": "Christopher",
  "lastName": "Nolan",
  "birthDate": "1970-07-30T00:00:00.000Z",
  "nationality": "British-American",
  "awards": ["Academy Award"],
  "createdBy": "ObjectId",
  "createdAt": "2026-04-01T00:00:00.000Z",
  "updatedAt": "2026-04-01T00:00:00.000Z"
}
```

Indexes:

- compound index on lastName + firstName

### actors

Stores movie actors.

Required fields:

- firstName (string)
- lastName (string)
- birthDate (date)
- nationality (string)
- createdAt (date)
- updatedAt (date)

Optional fields:

- awards (array of strings)

Indexes:

- compound index on lastName + firstName

### movies

Stores movie metadata and references to directors/actors.

Required fields:

- title (string)
- releaseYear (number)
- genre (string)
- rating (string)
- runtimeMinutes (number)
- directorId (ObjectId -> directors.\_id)
- actorIds (array of ObjectId -> actors.\_id)
- createdAt (date)
- updatedAt (date)

Optional fields:

- synopsis (string)

Example document:

```json
{
  "_id": "ObjectId",
  "title": "Inception",
  "releaseYear": 2010,
  "genre": "Sci-Fi",
  "rating": "PG-13",
  "runtimeMinutes": 148,
  "directorId": "ObjectId",
  "actorIds": ["ObjectId", "ObjectId"],
  "synopsis": "A thief enters dreams to steal secrets.",
  "createdAt": "2026-04-01T00:00:00.000Z",
  "updatedAt": "2026-04-01T00:00:00.000Z"
}
```

Indexes:

- unique compound index on title + releaseYear
- index on directorId
- index on actorIds

## Data Rules

- Use MongoDB ObjectId for all \_id and foreign key references.
- Store all timestamps as UTC ISO dates.
- Keep string fields trimmed.
- Enforce required fields at validation middleware level for API routes.
