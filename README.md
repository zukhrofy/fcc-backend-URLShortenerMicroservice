# URL Shortener Microservice

This is a URL Shortener Microservice project, part of the FreeCodeCamp Back End Development and APIs certification. this service allowing users to input a URL via a `POST` request from the frontend. The backend checks if the URL is not yet in the database, creates a short URL (sequentially numbered), and responds with the original URL and its corresponding short URL. If the same link is entered again, the server responds with the original URL and its existing short URL. The short URL can be accessed by appending it to the project's homepage, e.g., `/api/shorturl/<shorturl>`.

The main implementation for this task can be found in the index.js file.
