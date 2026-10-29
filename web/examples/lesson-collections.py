values = [2, 4, 4, 8]
unique = sorted(set(values))
squares = {x: x ** 2 for x in unique}
print(unique)   # [2, 4, 8]
print(squares)  # {2: 4, 4: 16, 8: 64}
