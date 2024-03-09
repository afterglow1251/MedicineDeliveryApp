# Instructions for running the server and client

## Running the server

1. Navigate to the `server` directory in your project:
    ```bash
    cd server
    ```

2. Create a `.env` file in the `server` directory with the following parameters:
    ```
    MONGODB=your_mongodb_connection_string
    PORT=your_server_port
    ```

    Please specify the port that will be used in the `client` directory in the `vite.config.js` file.

3. Install dependencies if they have not been installed already:
    ```bash
    npm install
    ```

4. After installing dependencies, start the server using the command:
    ```bash
    npm run dev
    ```

This will start the server and allow it to listen for requests on the specified port.

## Running the client

1. Navigate to the `client` directory in your project:
    ```bash
    cd client
    ```

2. Install dependencies if they have not been installed already:
    ```bash
    npm install
    ```

3. After installing dependencies, start the client using the command:
    ```bash
    npm run dev
    ```

This will start the development server for the client, which will track changes in files and update the page in real time.
