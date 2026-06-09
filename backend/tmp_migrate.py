import sqlite3
import os

db_path = 'backend/lectra.db'
if not os.path.exists(db_path):
    print(f"Error: {db_path} not found")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    print("Checking current columns...")
    cursor.execute('PRAGMA table_info(lectures)')
    columns = [row[1] for row in cursor.fetchall()]
    print(f"Current columns: {columns}")

    needed = ['status_audio', 'status_transcript', 'status_diarization']
    for col in needed:
        if col not in columns:
            print(f"Adding column: {col}")
            cursor.execute(f'ALTER TABLE lectures ADD COLUMN {col} VARCHAR DEFAULT "Pending"')
        else:
            print(f"Column {col} already exists.")
            
    conn.commit()
    print("Migration successful.")
except Exception as e:
    print(f"Migration failed: {e}")
finally:
    conn.close()
