API Reference:

Sessions: Prizeout uses sessions to ensure secure information exchange and proper idempotency on requests. You should make sure that you are properly checking session IDs where required and returning the appropriate information/validation related to a session.
Balance: Partners typically hold a user’s balance in an internal wallet. You may implement any transaction types you need to ensure proper wallet operation.
Checkout: A “checkout” represents a users attempt to purchase a card on Prizeout. Each checkout can succeed or fail.
Database Reference:
A database with a prepopulated schema has been attached to this question with connection data already in place for you.
All users are initialized with $10.00 (1000 cents) in their wallet. Multiple runs of working code may exhaust their funds. Feel free to add more money to a given user or remove it to test various cases. Please leave all functions you use for this in place if you add them (even if they are commented out).
You can create tables in the DB if you like but please make sure to leave the code in the test for us to take a look at. (Hint: use CREATE TABLE IF NOT EXISTS to make multiple runs easier)
Implementations:

createSession(email): should start a user session for a given email
onSession(sessionId): should return the user information for the session (name, current balance, email, session Id). Please make sure this object has a top level field “id”.
balanceCheck(sessionId, amount_cents): confirms the user has sufficient balance and creates a witholding for the amount
checkoutSuccess(sessionId): closes out the witholding, finises the session
checkoutFailure(sessionId): closes out the witholding, finshes the session
A few notes:

The code will run some mock data through the method stubs but will not run any formal tests, you are free to implement these functions as you see fit
There is no right answer
The data layer connection will be provided but you are free to access the db in any way that TypeORM supports


docker run \
      --name postgres \
      -e POSTGRES_PASSWORD=yourpassword \
      -p 5432:5432 \
      -d postgres

docker run -p 80:80 --env PGADMIN_DEFAULT_EMAIL=josephedwardwork@gmail.com --env PGADMIN_DEFAULT_PASSWORD=yourpassword dpage/pgadmin4



[
  { id: 1, name: 'Tester', email: 'tester@test.com' },
  { id: 2, name: 'Dustin', email: 'bigTruck@dustin.com' },
  { id: 3, name: 'John', email: 'john@buffalobills.com' },
  { id: 4, name: 'Dave', email: 'dave@airplane.com' }
]
>  []
[
  {
    id: 1,
    type: 'CREDIT',
    create_date: 2022-08-17T00:00:00.000Z,
    amount_cents: 1000,
    wallet_id: 1,
    session_id: null
  },
  {
    id: 2,
    type: 'CREDIT',
    create_date: 2022-08-17T00:00:00.000Z,
    amount_cents: 1000,
    wallet_id: 2,
    session_id: null
  },
  {
    id: 3,
    type: 'CREDIT',
    create_date: 2022-08-17T00:00:00.000Z,
    amount_cents: 1000,
    wallet_id: 3,
    session_id: null
  },
  {
    id: 4,
    type: 'CREDIT',
    create_date: 2022-08-17T00:00:00.000Z,
    amount_cents: 1000,
    wallet_id: 4,
    session_id: null
  }
]
[
  { id: 1, user_id: 1 },
  { id: 2, user_id: 2 },
  { id: 3, user_id: 3 },
  { id: 4, user_id: 4 }
]