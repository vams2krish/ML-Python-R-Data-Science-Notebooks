import numpy as np

a = np.arange(12).reshape(3, 4)
print(a[:, 1])       # [1 5 9]
print(a.mean(axis=0)) # [4. 5. 6. 7.]

# Slices are views; copy when you need independence.
b = a[:, 1].copy()
b[0] = 99
print(a[0, 1])       # 1
