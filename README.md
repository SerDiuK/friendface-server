# Friendface
Exercise for students of Simplon. The goal is to create a chat application in Angular using Websockets.

## Setup

Create a `.env` file in the server root

```
ENV=dev
API_URL=http://localhost
MONGODB=mongodb://
API_PORT=3000
WEBSOCKET_PORT=3001
```

To run the server locally

```
npm install
npm run build-ts
npm start
```

## API

Chat messages:

```
GET    api/chat        - Get all chat messages
POST   api/cars        - Post a chat message with BODY: { author: string, message: string }
DELETE api/cars        - Delete all chat messages
```

Connected users:

```
GET    api/connected-users      - Get all connected users
```

## Websocket

Connect to the websocket on `localhost:${WEBSOCKET_PORT}`. By default this is `3001`.

The Websocket listens to the following messages:

```
{ topic: 'login', data: { name: string }}
{ topic: 'chat', data: { author: string, message: string }}
```

The Websocket emits the following messages:
```
{ topic: 'chat', data: { author: string, message: string }}
{ topic: 'user connected', data: { _id: string, name: string, websocketSession: string }}
{ topic: 'user disconnected', data: { id: string }}

```
