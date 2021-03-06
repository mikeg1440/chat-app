const io = require("socket.io-client");
const logger = require("../utils/logger");

// initSocket returns a promise
// success: resolve a new socket object
// fail: reject a error
const initSocket = () => {
  return new Promise((resolve, reject) => {
    // create socket for communication
    const port = process.env.PORT || 3000;
    const socket = io(`localhost:${port}`, {
      "reconnection delay": 0,
      "reopen delay": 0,
      "force new connection": true,
    });

    // define event handler for sucessfull connection
    socket.on("connect", () => {
      logger.info("connected");
      resolve(socket);
    });

    // if connection takes longer than 5 seconds throw error
    setTimeout(() => {
      reject(new Error("Failed to connect wihtin 5 seconds."));
    }, 5000);
  });
};

// destroySocket returns a promise
// success: resolve true
// fail: resolve false
const destroySocket = (socket) => {
  return new Promise((resolve, reject) => {
    // check if socket connected
    if (socket.connected) {
      // disconnect socket
      logger.info("disconnecting...");
      socket.disconnect();
      resolve(true);
    } else {
      // not connected
      logger.info("no connection to break...");
      resolve(false);
    }
    logger.info("---------------------------------");
  });
};

test('Test: Example', (resolve) => {
  resolve();
})

describe("test suite: Initial Connection", () => {
  test("test: joinRoom", async () => {
    const clientSocket = await initSocket();
    console.log(`initialized socket`)

    const serverResponse = new Promise((resolve, reject) => {
      console.log(`inside serverResponse promise`)
      clientSocket.on("joinRoom", (data4Client) => {
        const { message } = data4Client;
        logger.info("Server says: " + message);

        destroySocket(clientSocket);
        resolve(data4Client);
      })

      setTimeout(() => {
        reject(new Error("Failed to get response, connection timed out..."));
      }, 5000);
    })
  });
})

// describe("test suit: Echo & Bello", () => {
//   test("test: ECHO", async () => {
//     // create socket for communication
//     const socketClient = await initSocket();
//
//     // create new promise for server response
//     const serverResponse = new Promise((resolve, reject) => {
//       // define a handler for the test event
//       socketClient.on("@echo", (data4Client) => {
//         //process data received from server
//         const { message } = data4Client;
//         logger.info("Server says: " + message);
//
//         // destroy socket after server responds
//         destroySocket(socketClient);
//
//         // return data for testing
//         resolve(data4Client);
//       });
//
//       // if response takes longer than 5 seconds throw error
//       setTimeout(() => {
//         reject(new Error("Failed to get reponse, connection timed out..."));
//       }, 5000);
//     });
//
//     // define data 4 server
//     const data4Server = { message: "CLIENT ECHO" };
//
//     // emit event with data to server
//     logger.info("Emitting ECHO event");
//     socketClient.emit("#echo", data4Server);
//
//     // wait for server to respond
//     const { status, message } = await serverResponse;
//
//     // check the response data
//     expect(status).toBe(200);
//     expect(message).toBe("SERVER ECHO");
//   });
//
//
//   test("test BELLO", async () => {
//     const socketClient = await initSocket();
//     const serverResponse = new Promise((resolve, reject) => {
//       socketClient.on("@bello", (data4Client) => {
//         const { message } = data4Client;
//         logger.info("Server says: " + message);
//         destroySocket(socketClient);
//         resolve(data4Client);
//       });
//
//       setTimeout(() => {
//         reject(new Error("Failed to get reponse, connection timed out..."));
//       }, 5000);
//     });
//
//     const data4Server = { message: "CLIENT BELLO" };
//     logger.info("Emitting BELLO event");
//     socketClient.emit("#bello", data4Server);
//
//     const { status, message } = await serverResponse;
//     expect(status).toBe(200);
//     expect(message).toBe("SERVER BELLO");
//   });
//
//
//   test("test HELLO", async () => {
//     const socketClient = await initSocket();
//     const serverResponse = new Promise((resolve, reject) => {
//       socketClient.on("@hello", (data4Client) => {
//         const { message } = data4Client;
//         logger.info("Server says: " + message);
//         destroySocket(socketClient);
//         resolve(data4Client);
//       });
//
//       setTimeout(() => {
//         reject(new Error("Failed to get reponse, connection timed out..."));
//       }, 5000);
//     });
//
//     const data4Server = { message: "CLIENT HELLO" };
//     logger.info("Emitting HELLO event");
//     socketClient.emit("#hello", data4Server);
//
//     const { status, message } = await serverResponse;
//     expect(status).toBe(200);
//     expect(message).toBe("SERVER HELLO");
//   });
// });
