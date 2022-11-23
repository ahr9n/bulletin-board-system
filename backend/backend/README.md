# To Use PostgreSQL with your Django Application on Ubuntu

## Step 1 – Installing the Components from the Ubuntu Repositories

```sh
$ sudo apt update
$ sudo apt install python3-pip python3-dev libpq-dev postgresql postgresql-contrib
```

## Step 2 – Creating a Database and Database User

First, log into an interactive Postgres session by typing:

```sh
$ sudo -u postgres psql
```

We can use the same configurations as in `settings.py`:

```sql
postgres=# CREATE DATABASE board;
postgres=# CREATE USER radwan WITH PASSWORD 'Ar2399';
```

Afterwards, you will modify a few of the connection parameters to speed up database operations so that the correct values do not have to be queried and set each time a connection is established:

```sql
postgres=# ALTER ROLE radwan SET client_encoding TO 'utf8';
postgres=# ALTER ROLE radwan SET default_transaction_isolation TO 'read committed';
postgres=# ALTER ROLE radwan SET timezone TO 'UTC';
postgres=# GRANT ALL PRIVILEGES ON DATABASE board TO radwan;
postgres=# \q
```

## Step 3 – Use poetry and run

---

Thanks for reading!