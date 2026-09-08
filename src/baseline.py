from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score, f1_score
from src.data_loader import prepare_federated_data

def run_centralized_baseline():
    """Runs a centralized baseline on the full dataset."""
    print("Running Centralized Baseline...")
    
    # We use num_clients=1 just to get the full data partitioned into one, 
    # but we can also just use the partitions returned.
    vectorizer, partitions, test_data, classes = prepare_federated_data(num_clients=1)
    
    X_train_full, y_train_full = partitions[0]
    X_test_full, y_test_full = test_data
    
    # Using SGDClassifier with log_loss (Logistic Regression equivalent)
    model = SGDClassifier(loss='log_loss', random_state=42)
    
    # Train
    model.fit(X_train_full, y_train_full)
    
    # Evaluate
    y_pred = model.predict(X_test_full)
    acc = accuracy_score(y_test_full, y_pred)
    f1 = f1_score(y_test_full, y_pred, average='weighted')
    
    print(f"Centralized Baseline -> Accuracy: {acc:.4f}, F1-Score: {f1:.4f}\n")
    return acc, f1
