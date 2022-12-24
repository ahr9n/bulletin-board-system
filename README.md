# Bulletin Board System (BBS)
Welcome to the BBS, a powerful and feature-rich web-based application built with Django and React (TypeScript) that allows users to engage in discussions and share their thoughts and ideas with others. The BBS is designed to be a community-driven platform with a range of user roles and customizable profiles, making it easy for users to participate in discussions and connect with others.

## Features
- User registration and login: Users can create their own account and log in to access the BBS. The system supports three user roles – administrators, moderators, and posters – each with their own set of permissions. Posters can create threads and post replies to existing threads, moderators can do what posters do, plus the ability to lock threads and ban users, and administrators can do what moderators do, plus the ability to create and remove boards. All users who sign up will be posters by default.
- User profiles: Each user has a profile that contains information about themselves, including their about myself, date of birth, hometown, present location, website (optional), gender (optional), and interests (optional).
- Banning users: Moderators and administrators have the ability to ban other users, preventing them from creating boards, threads, and posts. Users cannot ban themselves.
- Home page: The home page lists all available boards and provides a link to the registration form, a login/logout form, and a list of boards that can be grouped by topic by administrators.
- Board index page: Clicking on the name of a board in the home page takes the user to the board index page, which lists all threads within that board, sorted by date of the most recent post. Threads can be sticky and will be listed before non-sticky threads. The page also displays the name of the board, the number of threads, and the number of posts.
- Thread index page: Clicking on the title of a thread in the board index page takes the user to the thread index page, which lists all posts within that thread, sorted by date of posting, least recent first. The page also displays the name of the thread and the name of the board.
- User profile page: Clicking on a user's name takes the user to their profile page, which displays their profile details and a list of their posts, sorted by date of posting, most recent first. Moderators and administrators also have the ability to ban or unban a user from this page.
- Markdown parsing for posts: The BBS supports Markdown syntax for formatting posts, making it easy for users to add emphasis, links, lists, and more to their messages.
- Extra features: The BBS includes a range of extra features, including board thread count, post count, and description as a card that appears on hover, completeness and elegance of implementation, and code readability.

## Installation
Before you start, consider that I implemented the project with [poetry@1.2.2](https://github.com/ahr9n/common-scripts/blob/main/python-poetry.sh), [nvm@0.39.2, node@18.12.1 and npm@9.1.2](https://github.com/ahr9n/common-scripts/blob/main/react.sh), so if you need any troubleshooting; address the problem and [start an issue on this repository](https://github.com/ahr9n/bulletin-board-system/issues/new). Here we go!

1. Clone the repository and head to the folder:
```sh
git clone https://github.com/ahr9n/bulletin-board-system.git
cd bulletin-board-system
```

2. Install the backend dependencies using Poetry and the frontend dependencies using npm:
```sh
cd backend
poetry install
cd ../frontend
npm install
```

3. Set up the database, using [this](https://github.com/ahr9n/bulletin-board-system/blob/main/backend/backend/README.md) and update the `DATABASE` values in the `.env.example` file with the details of the database you just created, and rename the file to `.env`.

4. Head to the backend folder and run the following commands to create and apply the database migrations and to start the server:
```sh
poetry shell
python3 manage.py makemigrations
python3 manage.py migrate
python3 manage.py createsuperuser # optional to create an admin user
python3 manage.py runserver
```

5. Head to the frontend folder and run the following command to run the app in the development mode:
```sh
npm start
```

The BBS will be available at http://localhost:3000.

## Contributions

We welcome contributions from the community! If you have any ideas for new features or find any bugs, please feel free to submit an issue or pull request.

## License
This project is licensed under the [MIT License](https://github.com/ahr9n/bulletin-board-system/blob/main/LICENSE).