player = ""
score = 2
ranking = 3
pool = 2
serie = "Miehet"
week = "33"

scores = 20.1 - 0.9*(pool-1)- (ranking-1)+ 0.05*score
scores = round(scores, 2)
new_row = "INSERT INTO viikon_tulokset  VALUES(DEFAULT, '" + player +"',  '" + serie +"', " + week + "," + str(pool) + "," + str(ranking) + "," + str(score) + "," + str(scores) + ",2022);"

print(new_row)
f = open('results.sql', 'a', encoding='utf-8')
f.writelines(new_row + '\n')
f.close()