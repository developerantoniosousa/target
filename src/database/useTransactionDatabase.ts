import { useSQLiteContext } from "expo-sqlite";

export type TransactionCreate = {
  target_id: number;
  amount: number;
  observation?: string;
};

export type TransactionResponse = {
  id: number;
  target_id: number;
  amount: number;
  observation: string;
  created_at: Date;
  updated_at: Date;
}

export type SummaryResponse = {
  input: number;
  output: number;
}

export function useTransactionDatabase() {
  const database = useSQLiteContext();

  async function create(data: TransactionCreate) {
    const statement = await database.prepareAsync(`
      INSERT INTO transactions 
        (target_id, amount, observation) 
      VALUES 
        ($target_id, $amount, $observation)
    `);
    statement.executeAsync({
      $target_id: data.target_id,
      $amount: data.amount,
      $observation: data?.observation || ''
    });
  }

  function listByTargetId(id: number) {
    return database.getAllAsync<TransactionResponse>(`
      SELECT * FROM transactions WHERE target_id = ${id}
      ORDER BY created_at DESC
    `);
  }

  async function remove(id: number) {
    await database.runAsync(`
      DELETE FROM transactions WHERE id = ${id}
    `);
  }

  function summary() {
    return database.getFirstAsync<SummaryResponse>(`
      SELECT
        COALESCE(SUM(CASE WHEN amount > 0 THEN amount ELSE 0 END), 0) AS input,
        COALESCE(SUM(CASE WHEN amount < 0 THEN amount ELSE 0 END), 0) AS output
      FROM transactions
    `);
  }

  return {
    create,
    listByTargetId,
    remove,
    summary
  }
}