import sqlite3

conn = sqlite3.connect('lectra.db')
cursor = conn.cursor()

try:
    cursor.execute('ALTER TABLE lectures ADD COLUMN diarization_json TEXT')
    conn.commit()
    print('diarization_json column added successfully')
except Exception as e:
    print(f'Column may already exist: {e}')

conn.close()
