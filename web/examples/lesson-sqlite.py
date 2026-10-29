import sqlite3

with sqlite3.connect(":memory:") as conn:
    conn.execute("CREATE TABLE lessons (name TEXT, minutes INTEGER)")
    conn.execute("INSERT INTO lessons VALUES (?, ?)", ("NumPy", 25))
    rows = conn.execute("SELECT name, minutes FROM lessons").fetchall()
    print(rows)  # [("NumPy", 25)]
