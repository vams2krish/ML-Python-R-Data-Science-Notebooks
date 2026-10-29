lessons <- data.frame(
  topic = c("Python", "R", "NumPy"),
  minutes = c(25, 20, 35)
)
str(lessons)
subset(lessons, minutes >= 25)
mean(lessons$minutes) # 26.66667
