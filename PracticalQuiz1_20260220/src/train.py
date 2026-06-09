import pandas as pd
import joblib
import os
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score

# Paths
PROCESSED_DIR = "data/processed"
MODELS_DIR = "models"
os.makedirs(MODELS_DIR, exist_ok=True)

# Load processed data
print("[TRAIN] Loading processed data...")
X_train = pd.read_csv(f"{PROCESSED_DIR}/X_train.csv")
y_train = pd.read_csv(f"{PROCESSED_DIR}/y_train.csv").squeeze()

# Train Logistic Regression
print("[TRAIN] Training Logistic Regression model...")
model = LogisticRegression(max_iter=200, random_state=42)
model.fit(X_train, y_train)

# Quick train accuracy
train_acc = accuracy_score(y_train, model.predict(X_train))
print(f"[TRAIN] Training Accuracy: {train_acc * 100:.2f}%")

# Save model
model_path = f"{MODELS_DIR}/logistic_model.pkl"
joblib.dump(model, model_path)
print(f"[TRAIN] Model saved to {model_path}")
