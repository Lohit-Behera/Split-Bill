# Split Bill

Split-Bill is a web application designed to simplify the process of splitting bills among friends, family, or roommates. This project aims to provide an easy and intuitive way to manage shared expenses and ensure that everyone pays their fair share.

## Features

- **Create Groups:** Users can create groups for different events or activities.
- **Add Members:** Invite friends or family members to join groups.
- **Add Expenses:** Record expenses and assign them to group members.
- **Split Bills:** Automatically calculate how much each member owes.
- **Settle Debts:** Track payments and settle debts within the group.
- **Light/dark** mode toggle

## Tech Stack

**Client:** React, Redux, TailwindCSS, shadcn/ui, shadergradient

**Server:** Django, Django REST Framework

**DataBase:** PostgreSQL

**Hosting:** Vercel

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

In frontend folder

`VITE_PROXY`
this is for django server url

In backend folder

`SECRET_KEY`

`PGHOST`
`PGDATABASE`
`PGUSER`
`PGPASSWORD`

## Installation

Clone the repository:

```bash
git clone https://github.com/Lohit-Behera/Split-Bill.git
cd Split-Bill
```

Installing using [Docker](https://www.docker.com/)

in root directory

```bash
  docker compose up
```

Then go to [localhost:5173](http://localhost:5173/) and [localhost:8000](http://localhost:8000/)

Installation without Docker

In root directory
Create Python virtual environment using [virtualenv](https://virtualenv.pypa.io/en/latest/):

```bash
  pip install virtualenv
```

```bash
  python -m venv myenv
```

```bash
  myenv\Scripts\activate
```

install python libraries

```bash
  cd backend
```

```bash
  pip install -r requirements.txt
```

Start the server

```bash
  python manage.py runserver
```

In another terminal for React js

```bash
  cd Split-Bill
  cd frontend
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## Screenshots

![App Screenshot](https://drive.usercontent.google.com/download?id=1fBNdrxAQ35uiLKHUaLRfc61M9uJPMqde)
![App Screenshot](https://drive.usercontent.google.com/download?id=1ImfeG1AV4rPDQqN4yWmhQ8-OdQXiC8aq)
![App Screenshot](https://drive.usercontent.google.com/download?id=1RWncZkTKwD4RW3dWb5_w1CjvfAPZr30h)
![App Screenshot](https://drive.usercontent.google.com/download?id=1W7ERq8JX79UxbJOYyO0-hfrhoCTQEXD_)
![App Screenshot](https://drive.usercontent.google.com/download?id=1Lmivzk553rSltZjwGsFpzjuGaV7AAt3h)
![App Screenshot](https://drive.usercontent.google.com/download?id=1lXCC1HFrvUlE90niUZF2Z8xAnQZtYFWt)
![App Screenshot](https://drive.usercontent.google.com/download?id=14pQG5HooiLEvpCe61mUV0UTDSfg1du0Q)
![App Screenshot](https://drive.usercontent.google.com/download?id=1814ey4iGsE0OUS22W6KFIufkxdu43N5F)

## License

[MIT](https://choosealicense.com/licenses/mit/)
