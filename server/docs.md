# API Documentation

## GET

### `/events`
Grabs all events

### `/events/{id}`
Grabs a given event with matching ID

### `/events/{id}/participants`
Grabs all participants of an event

### `/events/{id}/participants/{id}`
Grabs a given participant in an event

### `/events/{id}/identifications`
Grabs all identified faces in an event

### `/events/{id}/identifications/{id}`
Grabs a given identification in an event

### `/users`
Grabs all users

### `/users/{id}`
Grabs a given user with matching ID

## POST

### `/events`
Creates an event

### `/events/{id}`
Allows for overwiting an event

### `/events/{id}/participants`
Adds participants to an event

### `/events/{id}/identifications`
Adds identifications to an event

### `/users`
Creates a user

## PATCH

### `/events/{id}`
Modifies a given event

### `/events/{id}/participants/{id}`
Modifies a given participant

### `/events/{id}/identifications/{id}`
Modifies a given identification

### `/users/{id}`
Modifies a given user

## DELETE

### `/events/{id}`
Deletes a given event

### `/events/{id}/participants`
Deletes all participants of an event

### `/events/{id}/participants/{id}`
Deletes a given participant from an event

### `/events/{id}/identifications`
Deletes all identifications from an event

### `/events/{id}/identifications/{id}`
Deletes a given identification from an event

### `/users/{id}`
Deletes a given user