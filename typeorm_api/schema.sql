

Schema
 Table "public.users"
 Column | Type | Collation | Nullable | Default 
--------+------------------------+-----------+----------+-----------------------------------
 id | integer | | not null | nextval('users_id_seq'::regclass)
 name | character varying(255) | | | 
 email | character varying(500) | | | 
Indexes:
 "users_pkey" PRIMARY KEY, btree (id)
 "users_email_key" UNIQUE CONSTRAINT, btree (email)
Referenced by:
 TABLE "sessions" CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
 TABLE "wallets" CONSTRAINT "wallets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)

 Table "public.sessions"
 Column | Type | Collation | Nullable | Default 
---------------+------------------------+-----------+----------+--------------------------------------
 id | integer | | not null | nextval('sessions_id_seq'::regclass)
 session_token | character varying(255) | | | 
 created_on | date | | | 
 user_id | integer | | | 
Indexes:
 "sessions_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
 "sessions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
Referenced by:
 TABLE "transactions" CONSTRAINT "transactions_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id)

 Table "public.transactions"
 Column | Type | Collation | Nullable | Default 
--------------+------------------------+-----------+----------+------------------------------------------
 id | integer | | not null | nextval('transactions_id_seq'::regclass)
 type | character varying(255) | | | 
 create_date | date | | | 
 amount_cents | integer | | | 
 wallet_id | integer | | | 
 session_id | integer | | | 
Indexes:
 "transactions_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
 "transactions_session_id_fkey" FOREIGN KEY (session_id) REFERENCES sessions(id)
 "transactions_wallet_id_fkey" FOREIGN KEY (wallet_id) REFERENCES wallets(id)

 Table "public.wallets"
 Column | Type | Collation | Nullable | Default 
---------+---------+-----------+----------+-------------------------------------
 id | integer | | not null | nextval('wallets_id_seq'::regclass)
 user_id | integer | | | 
Indexes:
 "wallets_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
 "wallets_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id)
Referenced by:
 TABLE "transactions" CONSTRAINT "transactions_wallet_id_fkey" FOREIGN KEY (wallet_id) REFERENCES wallets(id)
Time elapsed: 2911 minutes
