import numpy as np
import matplotlib.pyplot as plt

x = np.arange(6)
y = 2 * x + 1
fig, ax = plt.subplots()
ax.plot(x, y, marker="o", color="#73903e")
ax.set(xlabel="x", ylabel="y", title="A simple relationship")
fig.tight_layout()
plt.show()
