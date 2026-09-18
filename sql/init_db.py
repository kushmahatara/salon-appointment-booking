import sqlite3
import os

def init_db():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    backend_dir = os.path.join(base_dir, 'backend')
    db_path = os.path.join(backend_dir, 'db.sqlite3')
    schema_path = os.path.join(base_dir, 'sql', 'schema.sql')
    seed_path = os.path.join(base_dir, 'sql', 'seed.sql')

    # Ensure backend directory exists
    os.makedirs(backend_dir, exist_ok=True)

    print(f"Initializing database at: {db_path}")

    # Connect to SQLite database
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Read and execute schema.sql
    with open(schema_path, 'r', encoding='utf-8') as f:
        schema_sql = f.read()
    cursor.executescript(schema_sql)
    print("Schema created successfully.")

    # Read and execute seed.sql
    with open(seed_path, 'r', encoding='utf-8') as f:
        seed_sql = f.read()
    cursor.executescript(seed_sql)
    print("Seed data inserted successfully.")

    conn.commit()
    conn.close()
    print("Database initialization complete!")

if __name__ == '__main__':
    init_db()
