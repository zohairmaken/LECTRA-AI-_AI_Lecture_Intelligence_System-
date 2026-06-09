import sqlite3
import json

def check_db():
    conn = sqlite3.connect('lectra_ai.db')
    cursor = conn.cursor()
    
    print("--- LECTURES ---")
    try:
        cursor.execute("SELECT id, title, status, upload_date FROM lectures")
        lectures = cursor.fetchall()
        for l in lectures:
            print(f"ID: {l[0]}, Title: {l[1]}, Status: {l[2]}, Date: {l[3]}")
    except Exception as e:
        print(f"Error reading lectures: {e}")

    print("\n--- QUIZZES ---")
    try:
        cursor.execute("SELECT id, title, lecture_id FROM quizzes")
        quizzes = cursor.fetchall()
        for q in quizzes:
            print(f"ID: {q[0]}, Title: {q[1]}, Lecture ID: {q[2]}")
    except Exception as e:
        print(f"Error reading quizzes: {e}")
    
    conn.close()

if __name__ == "__main__":
    check_db()
