# AutoAttend

An automated attendance tracker via facial recognition. Built using react, electron, milvus, supabase, and nodejs!

## Requirements
- Docker
- NodeJS 17 or higher
- An internet connection

## How to Run
Due to the complexity of the project, I have opted to not include binaries as there is a lot of additional background configuration and connections which exist and would require some time to compile into an application for a full "demo". Only the primary electron application is intended to be compiled, but for demo purposes and the sake of space it has been omitted.

- Ensure docker and Node.js is installed
- Open docker
- `cd ./milvus && docker-compose up -d`
- `cd ../server && npm install && npm run start`
- `cd ../electron && npm install && npm run dev`

The application should be fully functional after this. You will have to go into each user's page and click the yellow process button to build face descriptors from source images and store them in milvus. By default, no one is will be recognized otherwise.

## How it works (In a nutshell)

### Client (React & NodeJS)
The client connects to the NodeJS server. The client's primary function from a recognition point of view is to perform real-time facial detection and generate face descriptors for each detected face. This is not to be confused with facial recognition. Rather, the client merely determines if there is a face in the camera frame, and vectorizes each face. These face vectors, known as descriptors, are then sent off to the server. The response from the server will include the facial descriptor tagged with identification info. The client will then match the name to the most similar descriptor in the current frame (By the time the client receives a response, many frames may have passed meaning the descriptors are no longer the exact same). In this way, the client works around latency issues regarding recognition and is able to show live recognitions.

### Server (NodeJS)
The server provides endpoints for the client to interact with Milvus (A vector-based DBMS) & Supabase (PostgreSQL). It can also create facial descriptors with hardware acceleration when needed. When performing facial recognition, the server takes the facial descriptors from the client and sends them to Milvus. Milvus then returns a list of user ID's which have been successfully matched. The server then takes this result and compiles some additional user data from supabase before finally sending them off to the client. The server also ensures that the data stored in milvus and the data stored in supabase are coherent with each other.

### Milvus
A vector-based DBMS specialized in carrying out high-performance nearest-vector searches over large datasets. Since faces can be broken down into vectors, Milvus can be used to perform facial recognition by finding the most similar vectors using algorithms such as Euclidean Distance

### Supabase
An open-sourced wrapper around a postgresql database which also provides API endpoints.

### ML Libraries
Both the client and server utilize face-api.js, which itself utilizes tensorflow and an open-source mobile called ssdv1mobile_net for the detection and creation of face descriptors.