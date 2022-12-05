const typeorm = require("typeorm");

typeorm.Entity("Users");
class User {
  constructor(id, name, email) {
    typeorm.PrimaryGeneratedColumn("increment");
    this.id = id;
    typeorm.Column("varchar");
    this.name = name;
    typeorm.Column("varchar");
    this.email = email;
  }
}

typeorm.Entity("Sessions");
class Session {
  constructor(id, session_token, created_on, user_id) {
    typeorm.PrimaryGeneratedColumn("increment");
    this.id = id;
    typeorm.Column();
    this.session_token = session_token;
    typeorm.Column();
    this.user_id = user_id;
    typeorm.CreateDateColumn();
    this.created_on = created_on;
    typeorm.Column();
    this.is_active = true;
  }
}

typeorm.Entity("Transactions");
class Transaction {
  constructor(id, create_date, amount_cents, wallet_id, session_id) {
    typeorm.PrimaryGeneratedColumn("increment");
    this.id = id;
    typeorm.Column();
    this.create_date = create_date;
    typeorm.Column();
    this.amount_cents = amount_cents;
    typeorm.Column();
    this.wallet_id = wallet_id;
    typeorm.Column();
    this.session_id = session_id;
  }
}

typeorm.Entity("Wallets");
class Wallet {
  constructor(id, user_id) {
    typeorm.PrimaryGeneratedColumn("increment");
    this.id = id;
    typeorm.Column();
    this.user_id = user_id;
    typeorm.Column();
    this.balance = 0;
    typeorm.Column();
    this.witholding = 0;
  }
}

/*
  Datalayer connection 
*/
const connection = typeorm.getConnectionManager().create({
  type: "postgres",
  username: "coderpad",
  database: "coderpad",
  synchronize: false, // Preserve columns of existing tables.
  extra: { host: "/tmp/postgresql/socket" },
  entities: [this.User, this.Session, this.Transaction, this.Wallet],
});
const manager = connection.manager;

/**
 * createSession(email): should start a user session for a given email
 * @param {*} email
 * @returns session
 *
 */
async function createSession(email) {
  // Check if user exists
  let user = await getUserByEmail(email);
  // Create a session
  const session = new Session(
    null,
    Math.random().toString(36).substring(2, 15),
    new Date().toISOString(),
    user.id
  );
  // console.log(session);
  // Insert session into database
  await insertSession(session);
  return session;
}

/**
 * @param {*} sessionId
 * @returns should return the user information for the session
 * (name, current balance, email, session Id).
 * Please make sure this object has a top level field “id”.
 */
async function onSession(sessionId) {
  let sessionData = {};
  sessionData.id = sessionId;
  const state = await getSessionState(sessionId);
  sessionData.name = state.user.name;
  sessionData.email = state.user.email;
  sessionData.balance = state.balance;
  return sessionData;
}

/**
 * @param {*} sessionId - session id
 * @param {*} amount_cents - amount needed to be witheld
 * @returns should return whether the user has enough balance to withold the amount
 * and create a new witholding transaction.
 */
async function balanceCheck(sessionId, amount_cents) {
  let state = await getSessionState(sessionId);
  // console.log(state);
  updateWitholding(state.wallet.user_id, amount_cents);
  updateBalance(state.wallet.user_id, state.balance);

  state = await getSessionState(sessionId);
  if (state.balance >= amount_cents) {
    console.log("Balance Check : Funds Available");
    console.log("Your balance is currently : ", state.balance);
    return true;
  } else {
    console.log("Balance Check : Funds Unavailable");
    console.log("Your balance is currently : ", state.balance);
    return false;
  }
}

async function checkoutSuccess(sessionId) {
  const state = await getSessionState(sessionId);
  console.log("Balance before transaction: ", state.balance);
  console.log("Witholding before transaction: ", state.wallet.witholding);

  // Create transaction
  const transaction = new Transaction(
    null,
    new Date().toISOString(),
    -state.wallet.witholding,
    state.wallet.id,
    state.session.id
  );

  // Insert transaction into database
  await createTransaction(transaction);
  //update balance with difference
  updateBalance(
    state.wallet.id,
    state.wallet.balance - state.wallet.witholding
  );
  // Update witholding
  await updateWitholding(state.wallet.id, 0);
  console.log("Checkout Success : Funds Withheld");
  console.log(
    "Your balance is currently : ",
    state.wallet.balance - state.wallet.witholding
  );

  // Update session
  await killSession(sessionId);
  console.log("Session Ended");
  return state.wallet.balance - state.wallet.witholding;
}

async function checkoutFailure(sessionId) {
  const state = await getSessionState(sessionId);
  console.log("Balance before transaction: ", state.balance);
  console.log("Witholding before transaction: ", state.wallet.witholding);
  console.log("Checkout Failure : Insufficient Funds");
  console.log("Your balance is currently : ", state.wallet.balance);
  // Update witholding
  await updateWitholding(state.wallet.id, 0);
  // Update session
  await killSession(sessionId);
  console.log("Session Ended");
  return state.balance;
}

async function main() {
  // Connect to the database
  await connection.connect();
  //add columns to db if they don't exist
  await addColumns();
  //check data in database
  // logDbState(manager)

  // First test (Success)
  const session = await createSession("tester@test.com");
  const sessionInfo = await onSession(1);
  const balanceGood = await balanceCheck(1, 500);
  const checkout = await checkoutSuccess(sessionInfo.id);
  // console.log("Create Session : ", session);
  // console.log("Session Info : ", sessionInfo);
  // console.log("Balance Good : ", balanceGood);
  // console.log("Balance after transaction: ", checkout);

  // // Second Test (Fail)
  const failSession = await createSession("tester@test.com");
  const failSessionInfo = await onSession(1);
  const failBalanceCheck = await balanceCheck(failSessionInfo.id, 500);
  const checkoutFail = await checkoutFailure(failSessionInfo.id);
  // console.log("Session: ", failSession);
  // console.log("Session Info: ", failSessionInfo);
  // console.log("Balance Good: ", failBalanceCheck);
  // console.log("Checkout Fail: ", checkoutFail);
}

// Run!
main();

async function logDbState(manager) {
  console.log("...Logging Current Data Tables to Console...");
  const userData = await manager.query(`SELECT * FROM USERS`);
  console.log(userData);
  const sessionData = await manager.query(`SELECT * FROM SESSIONS`);
  console.log(sessionData);
  const transactionData = await manager.query(`SELECT * FROM TRANSACTIONS`);
  console.log(transactionData);
  const walletData = await manager.query(`SELECT * FROM WALLETS`);
  console.log(walletData);
}

async function getSessionState(sessionId) {
  // Get session info
  const session = await getSession(sessionId);
  // Get user info
  const user = await getUserById(session.user_id);
  // Get wallet info
  const wallet = await getWallet(user.id);
  // Calculate balance
  const balance = await calculateBalance(wallet.id);
  return {
    session: session,
    user: user,
    wallet: wallet,
    balance: balance,
  };
}

async function getUserByEmail(email) {
  return await manager
    .query(`SELECT * FROM USERS where email='${email}'`)
    .then((users) => {
      if (!users) {
        throw new Error("User does not exist");
      } else {
        // console.log(user);
        return users[0];
      }
    });
}

async function getUserById(id) {
  return await manager
    .query(`SELECT * FROM USERS where id='${id}'`)
    .then((users) => {
      if (!users) {
        throw new Error("User does not exist");
      } else {
        // console.log(user);
        return users[0];
      }
    });
}

async function getWallet(user_id) {
  return await manager
    .query(`SELECT * FROM WALLETS where user_id=${user_id}`)
    .then((wallets) => {
      if (!wallets) {
        throw new Error("Wallet does not exist");
      } else {
        // console.log(wallet);
        return wallets[0];
      }
    });
}
async function getSession(id) {
  return await manager
    .query(`SELECT * FROM SESSIONS where id=${id}`)
    .then((sessions) => {
      if (!sessions) {
        throw new Error("Session does not exist");
      } else {
        // console.log(sessions);
        return sessions[0];
      }
    });
}

async function getTransactions(wallet_id) {
  return await manager
    .query(`SELECT * FROM TRANSACTIONS where wallet_id=${wallet_id}`)
    .then((transactions) => {
      if (!transactions) {
        throw new Error("Transaction does not exist");
      } else {
        // console.log(transaction);
        return transactions;
      }
    });
}

async function insertSession(session) {
  return await manager
    .query(
      `INSERT INTO SESSIONS (session_token,created_on,user_id) VALUES ('${session.session_token}', '${session.created_on}', ${session.user_id})`
    )
    .then((session) => {
      if (!session) {
        throw new Error("Session not created");
      } else {
        // console.log(session);
        return session;
      }
    });
}

async function calculateBalance(wallet_id) {
  return await manager
    .query(`SELECT * FROM TRANSACTIONS where wallet_id=${wallet_id}`)
    .then((transactions) => {
      if (!transactions) {
        throw new Error("Transaction does not exist");
      } else {
        // console.log(transactions);
        // Calculate the balance
        let balance = 0;
        transactions.forEach((transaction) => {
          balance += transaction.amount_cents;
        });
        // console.log("Balance : ", balance);
        return balance;
      }
    });
}

async function killSession(id) {
  return await manager
    .query(`UPDATE SESSIONS SET is_active = false WHERE id = ${id}`)
    .then((session) => {
      if (!session) {
        throw new Error("Session not updated");
      } else {
        // console.log(session);
        return session;
      }
    });
}

async function createTransaction(transaction) {
  return await manager
    .query(
      `INSERT INTO TRANSACTIONS (wallet_id,amount_cents,create_date, session_id) 
      VALUES (${transaction.wallet_id}, ${transaction.amount_cents}, 
        '${transaction.create_date}', ${transaction.session_id})`
    )
    .then((transaction) => {
      if (!transaction) {
        throw new Error("Transaction not created");
      } else {
        // console.log(transaction);
        return transaction;
      }
    });
}
async function updateWitholding(user_id, witholding) {
  return await manager
    .query(
      `UPDATE WALLETS SET witholding = ${witholding} WHERE id = ${user_id}`
    )
    .then((wallet) => {
      if (!wallet) {
        throw new Error("Wallet not updated");
      } else {
        // console.log(wallet);
        return wallet;
      }
    });
}
async function updateBalance(user_id, balance) {
  return await manager
    .query(`UPDATE WALLETS SET balance = ${balance} WHERE user_id = ${user_id}`)
    .then((wallet) => {
      if (!wallet) {
        throw new Error("Wallet not updated");
      } else {
        // console.log(wallet);
        return wallet;
      }
    });
}

async function addColumns() {
  try {
    await manager.query(
      `ALTER TABLE WALLETS ADD COLUMN witholding INT DEFAULT 0`
    );
  } catch (error) {
    // console.log(error);
  }
  try {
    await manager.query(`ALTER TABLE WALLETS ADD COLUMN balance INT DEFAULT 0`);
  } catch (error) {
    // console.log(error);
  }

  try {
    await manager.query(
      `ALTER TABLE SESSIONS ADD COLUMN is_active BOOLEAN DEFAULT true`
    );
  } catch (error) {
    // console.log(error);
  }
}
