import pandas as pd

df = pd.DataFrame({
    "topic": ["Python", "R", "Python", "R"],
    "minutes": [25, 20, 35, 30]
})
print(df.groupby("topic")["minutes"].mean())
# Python: 30.0, R: 25.0
print(df.loc[df["minutes"] >= 30])
