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
GET    api/chat-messages     - Get all chat messages
POST   api/chat-messages     - Post a chat message with BODY: { author: string, message: string }
DELETE api/chat-messages     - Delete all chat messages
```

Connected users:

```
GET    api/connected-users   - Get all connected users
```

Channels:

```
GET    api/channels          - Get all channels
```

The entire documentation can be found on Postman:
`https://documenter.getpostman.com/view/2240400/SWLiaRoD

## Websocket

Connect to the websocket on `localhost:${WEBSOCKET_PORT}`. By default this is `3001`.

The Websocket listens to the following messages:

```
{ "topic": "login", "data": { "name": "string" }}
{ "topic": "join channel", "data": { "id": "string" }}
```

The Websocket emits the following messages:
```
{ "topic": "chat", "data": { "author": "string", "message": "string" }} // Chat message sent to channel
{ "topic": "user connected", "data": { "_id": "string", "name": "string", "websocketSession": "string" }} // User connected to channel
{ topic: "user disconnected", "data": { "id": "string" }} // User disconnected from channel

```

Initialising Websocket on Angular is simple by using Rxjs Websocket which is natively included with Rxjs.

Here's an example service:

```ts
@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  websocket: WebSocketSubject<WebSocketMessage> = webSocket('ws://localhost:3001');

  constructor() { }

  sendMessage<T extends WebSocketDataType>(topic: WebSocketTopic, data: T) {
    this.websocket.next({
      topic,
      data
    });
  }

  listenToMessages<T extends WebSocketDataType>(filterTopic?: WebSocketTopic): Observable<T> {
    return this.websocket.asObservable().pipe(
      filter(message => filterTopic ? message.topic === filterTopic : true),
      map(message => message.data as T)
    );
  }
}
```
