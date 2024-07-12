<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

Welcome to the **Feature-Focus** GitHub repository! Here, you'll find the source code for our sleek and sophisticated
infinite post application, built with modern technologies and a focus on user experience.

### [See Features List In Project](https://github.com/yshplsngh/Feature-Focus/blob/main/Feature.md)

<p align="right"><a href="#top">back to top</a></p>

### Built With

The main technologies used to build this application are listed below:

* [TypeScript](https://www.typescriptlang.org/)
* [React.js](https://reactjs.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Node.js](https://nodejs.org/)
* [Express.js](https://expressjs.com/)
* [PostgreSQL](https://www.postgresql.org/)
* [Prisma](https://www.prisma.io/)
* [Docker](https://www.docker.com/)

<p align="right"><a href="#top">back to top</a></p>

## Getting Started

To get started with this project locally, follow the steps below:

### Prerequisites

Make sure you have Docker, Node.js, and a package manager (either npm or yarn) installed.

> **FYI**: This project uses **npm** as the package manager, but you're free to use **yarn** too.

## Development Installation

### Manual Installation

1. Install Node.js. The recommended way is to Node through [nvm](https://github.com/nvm-sh/nvm).
2. Clone the repo:
   ```sh
   git clone https://github.com/yshplsngh/Feature-Focus.git
3. If you are using nvm, run `$ nvm use 22.4.0` to set your Node version to 22.4.0
4. Navigate into the client folder and install all its necessary dependencies with npm.
   ```sh
   npm install
   ```
5. Navigate into the server folder and install all its necessary dependencies with npm.
   ```sh
   npm install
   ```
6. Install PostgreSql and make sure it is running.
   * For Fedora: [PostgreSql Installation](https://docs.fedoraproject.org/en-US/quick-docs/postgresql/)
   
7. Configure environment variables:

    - Navigate to the /server directory.
    - Rename the .env.example file to .env.
    - Fill in the values for each key. Below is a guideline for filling the .env values:

   Key           | What To Fill         
      ------------------|---------------------- 
   EMAIL_ID      | Your Google Email ID 
   EMAIL_ID_PASS | Email ID Password    
   PRIVATE_KEY   | Private Key For JWT  
   PUBLIC_KEY    | Public Key for JWT   

8. Navigate to the server directory and run:
   ```sh
   npm run dev
   ```
9. Navigate to the client directory and run:
   ```sh
   npm run dev
   ```
10. Navigate to [http://localhost:5173](http://localhost:5173) in your browser
Follow these steps to install the application locally:

11. Install the [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en)


### Docker Installation
Using Docker, you can have a complete, consistent development environment without having to manually install dependencies such as Node, Mongo, etc. It also helps isolate these dependencies and their data from other projects that you may have on the same computer that use different/conflicting versions, etc.

Note that this takes up a significant amount of space on your machine. Make sure you have at least 4GB free.

1. Install Docker for your operating system
   * [Fedora](https://docs.docker.com/engine/install/fedora/)
   * [Windows](https://www.docker.com/docker-windows)
2. Clone this repository and cd into it
3. Configure environment variables(Same as Manual Installation).
4. Open your terminal, navigate to the root directory, and run the following commands:

   ```sh 
   docker-compose build
   ```
   ```sh
   docker-compose up
   ```

<p align="right"><a href="#top">back to top</a></p>

## Contributing

If you have a suggestion that would make this project better, please fork the repo and create a pull request. You can
also simply open an issue with the tag "enhancement". Don't forget to give the project a star! Thanks again!

    Fork the Project
    Create your Feature Branch (git checkout -b feature/AmazingFeature)
    Commit your Changes (git commit -m 'Add some AmazingFeature')
    Push to the Branch (git push origin feature/AmazingFeature)
    Open a Pull Request

<p align="right"><a href="#top">back to top</a></p>

## License

Distributed under the MIT License. See LICENSE.txt for more information.
<p align="right"><a href="#top">back to top</a></p>
```
