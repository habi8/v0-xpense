-- Update transaction type constraint to include bank_deposit and bank_withdrawal
ALTER TABLE transactions
DROP CONSTRAINT transactions_type_check;

ALTER TABLE transactions
ADD CONSTRAINT transactions_type_check 
CHECK (type IN ('income', 'expense', 'bank_deposit', 'bank_withdrawal'));

-- Update payment_method constraint to include bank
ALTER TABLE transactions
DROP CONSTRAINT transactions_payment_method_check;

ALTER TABLE transactions
ADD CONSTRAINT transactions_payment_method_check 
CHECK (payment_method IN ('cash', 'bkash', 'bank'));
