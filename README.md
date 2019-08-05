# Snappit - Simple note sharing platform

## Development Setup

### Using Docker-compose

```bash
docker-compose up
```

Now, visit http://localhost:3000

### Manual

Prerequisites:
- mongodb
- nodejs
- nodemon (OPTIONAL: For development)

```bash
npm install
npm start
```

or

```bash
npm install
npm run dev #For running dev server
```

Visit http://localhost:3000 to access the application

## ESLint Setup
- Install ESLint globally on your computer system via command: "npm install -g eslint"
- Navigate to your project directory and run the command: "ESLint --init"
- When you run the above command, it'll prompt for the following questions-
     - How would you like to use ESLint?
	 - Answer: To check syntax, find problems, and enforce code style

	 - What type of modules does your project use?
	 - Answer: CommonJS (require/exports) 

	 - Which framework does your project use?
	 - Answer:  None of these

	 - Where does your code run?
	 - Answer: Node

	 - How would you like to define a style for your project?
	 - Answer:  Use a popular style guide

	 - Which style guide do you want to follow?
	 - Answer: Airbnb (https://github.com/airbnb/javascript)

	 - What format do you want your config file to be in?
	 - Answer: JSON

After doing all the necessary configurations, ESLint setup will be done

## TODO
- [ ] Remove dependency on jquery
- [ ] Complete lock functionality
- [ ] Enhance UI
- [ ] Add Licence
- [ ] Make the code ready for production
- [x] Enhance security using helmet


Feel free to create issues, raise PR and support <3
