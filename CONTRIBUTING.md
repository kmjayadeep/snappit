# Contributing to Snappit

:+1::tada: First off, thanks for taking the time to contribute! :tada::+1:

The following is a set of useful informations before you start contributing to Snappit. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Introduction to tech stack

TL;DR If you are comfortable with (or want to lean and experiment with) any of node.js, express.js, mongodb, preact, unistore, webpack, babel, css etc. then read below to understand the basic code structure. Otherwise you can skip this section.

Client side is written using Preact and Unistore (they are alternatives to React and Redux). Webpack is used to bundle the code and babel is used for transpiling. You can find the components in common/components folder. We chose preact/unistore instead of the more popular react/redux stack because it is simple, lightweight and easy to mainitain without any major breaking changes. Please visit [Preact official website](https://preactjs.com/) for more details and documentation.

Server side is written using node.js and express. The database used is mongodb with mongoose orm. The code is transpiled using babel. The client side code is also pre-rendered from server before sending to client. It helps to reduce the loading time on front-end and make the site more SEO friendly.

## Folder Structure

* client - Assets and client specific code for bootstrapping preact code
* common - Shared components to be used in client side as well as needs to be rendered from server side. It contains components, services, styles and store
* node_modules - no need to explain this :smiley:
* server - server side code - includes routes, SSR logic, models, services etc

## Issues

If you are interested in contributing to code, then Github issues are the place to start. Choose unassigned issue or create an issue for any bugfix/enhancement you want to make. Comment in the issue that you are interested in working on it. If you need any help in getting started or need suggestion on how to proceed, feel free to ask in the issue. While creating new issue, please explain the issue/enhancement clearly and include steps to reproduce if any or screenshots if possible.

## Pull Requests

Pull requests are always welcome :smiley:, But please note the following before you raise the PR

* Fork the code, create new branch from dev and raise PR from your branch to main repository dev branch
* Make sure there are no linting issues, run `npm run lint` to make sure that everything is passed
* Raise an issue before you raise PR for any major or breaking changes
* If the PR closes an issue or makes progress towards an issue, mention it as **Closed No#** or **Progress towards #No** in the PR title
* Feel free to raise PR even if it is working in progress. The title should be prefixed with **[WIP]** so other contributers can review and suggest changes while you work on it.

## Other Contributions

Of course, coding is not the only thing which is considered as a contribution. For example, this document itself is very poorly written and not very beginner friendly. Feel free to raise Pull requests for anything you would like to improve. Treat the app as yours and think about any enhancements you want to make in it, whether it be a change in documentation, readme or a change in color for one of the texts in front-end, let the contributors know by raising an issue.
