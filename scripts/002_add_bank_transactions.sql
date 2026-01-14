-- Update the transactions table to support bank deposits and withdrawals
ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check;
ALTER TABLE transactions ADD CONSTRAINT transactions_type_check 
  CHECK (type IN ('income', 'expense', 'bank_deposit', 'bank_withdrawal'));
