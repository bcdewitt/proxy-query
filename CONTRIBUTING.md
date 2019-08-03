# Contributing


## Docker-based Development Instructions
1. Build image using `docker build -t proxy-query .`
2. Run a container using the new image via `docker run --rm -it -v [cd]:/app proxy-query`, replacing `[cd]` depending on your environment:
    - **CMD**: `%CD%`
    - **PowerShell**: `${PWD}`
    - **Linux/MacOS Terminal**: `$(pwd)`
3. Run any commands as usual
4. Use `exit` to stop the container


## NPM
- Install npm packages using `npm install`
  - **NOTE**: Your `NODE_ENV` environment variable must be set to `development` (default) to pick up the dependencies
- Add new dependencies using `npm i --save-dev [package name]`
- Build using `npm run build`
- Test using `npm test`
- Publishing with `npm publish` will build and test before pushing to the registry
  - To ensure we are including all the correct files, we can fake a publish using `--dryRun`
  - To avoid logging in for every publish, add a `.npmrc` file to the project's root directory and include:
    - `email=[your npm email]`
    - `_auth=[copy/paste results of ``echo -n 'username:password' | base64``]`


## Other Notes/Ramblings
- I followed a TDD approach with this project (i.e. write failing tests first, then write the code to make them pass)
- The integrations between `babel`, `rollup`, `jest`, `eslint`, etc are not easy to follow. Now that I have them functioning together, I'm considering moving the configuration details into a separate package, where possible
- At very least, `rollup/transform.js` should be moved out, possibly merged into the original npm package code or forked as a new one...I feel like I missed something there still, but it would provide better functionality than the original, at least.
- I started using the `prettier` package for separation of formatting rules, but found it to be a bit too intrusive with my coding style.
- Also considering `eslint-to-editorconfig` as a way to align `.editorconfig` settings like tabs/spaces with `.eslintrc.js`...but I like the idea of using a pre-existing `.editorconfig` file and overriding certain eslint settings with that file (look at how prettier uses the `.editorconfig`)
