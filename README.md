# INT Fullstack Course June 2023 Starter Project

## Getting started

Clone the repo, detach from origin and run npm install:
```
git clone https://github.com/dolevoper/int-fullstack-starter.git your-app-name
cd your-app-name
git remote rm origin
npm install
```

It's advised to update the package name in the `package.json` file.

## Setting up mongo

It's expected to have a valid connection string to a mongo db cluster in the environment variable `MONGO_CONNECTION_STRING`.
You can setup a `.env` file in the root of the project and provide it there.
If you don't need mongo, you can comment out or delete the relevant lines in the `init` function in `src/index.ts`.
