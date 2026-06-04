import psycopg2, bcrypt
conn = psycopg2.connect(host='postgres', dbname='smartmail', user='smartmail_user', password='smartmail_pass')
cur = conn.cursor()
h = bcrypt.hashpw(b'123456', bcrypt.gensalt()).decode()
cur.execute("UPDATE usuarios SET password_hash = %s WHERE email = %s", (h, 'corina@test.com'))
conn.commit()
print('Listo:', h)
conn.close()