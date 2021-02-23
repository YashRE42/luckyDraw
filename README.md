An app for Lucky Draw made as an assignment for Grofers.

## important routes

`/` - user flow
`/events` - events list, creation and pick winner routes
`/upcoming` - upcoming events
`/recent` - winners in the past week

## Build Setup

### Requirements:

- NodeJS

  - [guide](https://nodejs.org/en/download/)

- npm

  - [guide](https://docs.npmjs.com/cli/install)

- Mongodb
  - The database used in the app is MongoDB, so it must be configured on you local machine. Follow the [guide](https://docs.mongodb.com/manual/administration/install-on-linux/) if you dont have MongoDB installed \
- App hosted at https://thawing-beyond-97440.herokuapp.com/
  - 
1. Make Directory

```bash
mkdir project
cd project
```

2. Clone the Repository

```bash

git clone https://github.com/YashRE42/luckyDraw.git
```

3. Change directory

```bash
cd Lucky_draw
```

4. Start MongoDB

```bash
sudo service mongod start
```

5. Check Status

```bash
sudo service mongod status
```

6. install node modules

```bash
npm install
```

7. Launch App by

```bash
node app.js
```


