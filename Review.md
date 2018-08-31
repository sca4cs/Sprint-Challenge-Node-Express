# Review Questions

## What is Node.js?
    Node.js is a program used to run Javascript outside of the browser. Before Node.js, Javascript was only used for web applications. Now its use has been extended to other applications (like servers).
## What is Express?
    Express is a program that is used to extend the functionality of Node.js and make it easier to use. Express for Node.js is like React for JS.
## Mention two parts of Express that you learned about this week.
    routing and middleware
## What is Middleware?
    Almost all functions in Node-Express applications can be considered Middleware. When a client makes a request to a server, the request goes through a series of middleware until a response gets sent back to the client or an error occurs. Middleware can be pre-baked into Express, third-party, or custom.
## What is a Resource?
    A resource is any data that exists on the server, and is accessible via a unique url.
## What can the API return to help clients know if a request was successful?
    The API can return a message either saying the request was successful or that there was an error. There may also be instructions on what to do next in the case of an error.
## How can we partition our application into sub-applications?
    You can break down your code into different files using Express Routers, just like having different components in a React application.
## What is express.json() and why do we need it?
    It is a type of built-in middleware that tells express to parse json information from req.body. It lets us read information from req.body.