# Plarium Service - Or Harazi

This is Or Harazi's home assignment given by Plarium.

## Table of Contents

-   [Introduction](#introduction)
-   [Features](#features)
-   [Getting Started](#getting-started)
    -   [Prerequisites](#prerequisites)
    -   [Installation](#installation)
    -   [Configuration](#configuration)
-   [Usage](#usage)

## Introduction

This service is a RESTful API written in TypeScript, providing 2 routes as requested in the home assignment file.

## Features

Based on the given data, this service can obtain information about a specific user or all platforms.

## Getting Started

There are 2 ways to run this service, and in the next steps, I will guide you through both methods.
Choose your preferred way to run this service: using Node.js (NPM) or Docker.

### Prerequisites

Using Node.js: Make sure you have Node.js 16 installed on your machine.

Using Docker: Make sure you have Docker installed on your machine.

### Installation

1. Clone the repository: `git clone https://github.com/orharazi/plarium.git`
2. Navigate to the project directory: `cd plarium`

Using Node.js: 3. Install dependencies: `npm install`

Using Docker: 3. Build the image: `docker build -t plarium .`

### Configuration

To run this service, you will need to use global environment variables.
Since this is a home assignment and not a production service,
I have added them to the repository so you don't need to worry about that.

Just in case, I will introduce them here:

-   `PORT`: The port you want to run your app on
-   `PG_HOST`: Postgres DB host
-   `PG_DB`: Postgres DB name
-   `PG_USER`: Postgres DB user
-   `PG_PASS`: Postgres DB password for the above user
-   `PG_PORT`: Postgres DB port (default is 5432)

## Usage

Here are some instructions on how you can use this service.

Using Node.js, start the application: `npm run start`
Using Docker, run a container for the previously created image: `docker run -p 3000:3000 plarium`

Now, the service is running, and you can interact with it on the port you chose before (default port is 3000).
Let's discuss the available routes.
There are 2 routes for this service:

1. `GET /user/:userId`:

This route will return information about a specific user.
You need to provide the `userId` for an existing user from the database.

Let's explain the returned data from this route:

-   `userID`: The userID from the database (should be the same as provided, just for confirmation).
-   `platforms`: An array of the platforms the user is playing on, how much actions he did and how much money he spent on this game.
    Example:

    ```json
    [
        {
            "platform": "ios",
            "totalActions": "Throne",
            "spent": 0.23
        }
    ]
    ```

-   `totalSpent`: A number that represents the total amount the user has spent. Example: `15.65`.
-   `gamesData`: An array of all the games the user has played, how much money he spent and if he is an active player on each game.
    Example:
    ```json
    [
        {
            "gameID": 5,
            "title": "Throne",
            "spent": 0.99,
            "activePlayer": true
        }
    ]
    ```
-   `totalActions`: A number that represents the total actions the user did. Example: `12`.
-   `activePlayer`: Check if the user is still playing in any games. Example: `true`.

2. `GET /platforms`:

This route will return information about all platforms in the given data.

The returned data is an array of objects. Each object contains information about one of the platforms.
Let's explain the data inside each platform object:

-   `platform`: The name of the platform. Example: "ios".
-   `totalPlayers`: The number of unique players on the platform. Example: 19473.
-   `totalEarns`: The total amount of money coming in through this platform. Example: 1425.45.
-   `activePlayers`: The number of active players on this platform
-   `games`: An array of all the games available on the platform, along with the number of unique players ever played, the number of active players and the amount of money each game earned.
    Example:
    ```json
    [
        {
            "gameID": 5,
            "title": "Throne",
            "totalPlayers": 3940,
            "earns": 430.54,
            "activePlayers": 2134
        }
    ]
    ```

That's it. Enjoy!

```

```
