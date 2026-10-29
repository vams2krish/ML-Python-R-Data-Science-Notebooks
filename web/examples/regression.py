import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error

rng = np.random.default_rng(42)
x = np.arange(50).reshape(-1, 1)
y = 2 * x.ravel() + 1 + rng.normal(0, 4, 50)
x_train, x_test, y_train, y_test = train_test_split(
    x, y, test_size=0.2, random_state=42)
model = LinearRegression().fit(x_train, y_train)
pred = model.predict(x_test)
print("Test RMSE:", np.sqrt(mean_squared_error(y_test, pred)))
