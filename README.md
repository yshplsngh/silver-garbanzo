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

### Installation

Follow these steps to install the application locally:

1. Clone the repo:
   ```sh
   git clone https://github.com/yshplsngh/Feature-Focus.git

2. Configure environment variables:

    - Navigate to the /server directory.
    - Rename the .env.example file to .env.
    - Fill in the values for each key. Below is a guideline for filling the .env values:

   Key           | What To Fill         
      ------------------|---------------------- 
   EMAIL_ID      | Your Google Email ID 
   EMAIL_ID_PASS | Email ID Password    
   PRIVATE_KEY   | Private Key For JWT  
   PUBLIC_KEY    | Public Key for JWT   

3. Open your terminal, navigate to the root directory, and run the following commands:

   ```sh 
     docker-compose build
   ```
   ```sh
   docker-compose up
   ```
4. Alternatively, you can manually start the project:
    - Navigate to the server directory and run:
      ```sh
         npm install
         npm run dev
         ```
    - Navigate to the client directory and run:

       ```sh 
       npm install
       npm run dev
      ```

   Open your browser and go to http://localhost:5173.

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