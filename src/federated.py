import numpy as np
import pandas as pd
from sklearn.linear_model import SGDClassifier
from sklearn.metrics import accuracy_score, f1_score
from src.data_loader import prepare_federated_data
import matplotlib.pyplot as plt
import os

RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'results')

def run_pure_simulated_fedavg(num_clients, num_rounds, classes, X_test, y_test, partitions):
    print("\n[WARNING] Custom FedAvg implementation (scikit-learn SGDClassifier), algorithmically equivalent to Flower's FedAvg, used as a substitute because flwr could not be installed in this environment.")
    global_model = SGDClassifier(loss='log_loss', random_state=42)
    global_model.partial_fit(X_test[:1], y_test[:1], classes=classes)
    
    global_coef = np.zeros((len(classes), X_test.shape[1]))
    global_intercept = np.zeros((len(classes),))
    global_model.coef_ = global_coef
    global_model.intercept_ = global_intercept
    
    metrics = []
    
    for round_num in range(1, num_rounds + 1):
        client_coefs = []
        client_intercepts = []
        client_sizes = []
        
        for i in range(num_clients):
            X_train, y_train = partitions[i]
            local_model = SGDClassifier(loss='log_loss', random_state=i)
            local_model.classes_ = classes
            local_model.coef_ = np.copy(global_coef)
            local_model.intercept_ = np.copy(global_intercept)
            
            local_model.partial_fit(X_train, y_train, classes=classes)
            
            client_coefs.append(local_model.coef_)
            client_intercepts.append(local_model.intercept_)
            client_sizes.append(X_train.shape[0])
            
        total_samples = sum(client_sizes)
        weights = [size / total_samples for size in client_sizes]
        
        new_coef = np.zeros_like(global_coef)
        new_intercept = np.zeros_like(global_intercept)
        for i in range(num_clients):
            new_coef += weights[i] * client_coefs[i]
            new_intercept += weights[i] * client_intercepts[i]
            
        global_coef = new_coef
        global_intercept = new_intercept
        global_model.coef_ = global_coef
        global_model.intercept_ = global_intercept
        
        y_pred = global_model.predict(X_test)
        acc = accuracy_score(y_test, y_pred)
        f1 = f1_score(y_test, y_pred, average='weighted')
        print(f"Round {round_num} - Server Evaluation: Accuracy={acc:.4f}, F1={f1:.4f}")
        metrics.append(acc)
        
    return metrics

def run_federated_simulation(num_clients=5, num_rounds=10, centralized_acc=0.0):
    print(f"\nRunning Federated Learning Simulation with {num_clients} clients for {num_rounds} rounds...")
    os.makedirs(RESULTS_DIR, exist_ok=True)
    
    vectorizer, partitions, test_data, classes = prepare_federated_data(num_clients=num_clients)
    X_test_full, y_test_full = test_data
    
    federated_metrics = []
    
    try:
        import flwr as fl
        
        global_model = SGDClassifier(loss='log_loss', random_state=42)
        global_model.partial_fit(X_test_full[:1], y_test_full[:1], classes=classes)
        
        class SklearnClient(fl.client.NumPyClient):
            def __init__(self, model, X_train, y_train, classes):
                self.model = model
                self.X_train = X_train
                self.y_train = y_train
                self.classes = classes
                
            def get_parameters(self, config):
                if hasattr(self.model, 'coef_'):
                    return [self.model.coef_, self.model.intercept_]
                else:
                    return [np.zeros((len(self.classes), self.X_train.shape[1])), np.zeros(len(self.classes))]

            def set_parameters(self, parameters):
                self.model.coef_ = parameters[0]
                self.model.intercept_ = parameters[1]

            def fit(self, parameters, config):
                self.set_parameters(parameters)
                self.model.partial_fit(self.X_train, self.y_train, classes=self.classes)
                return self.get_parameters(config), self.X_train.shape[0], {}
                
            def evaluate(self, parameters, config):
                return 0.0, self.X_train.shape[0], {}

        def client_fn(cid: str) -> fl.client.Client:
            X_train, y_train = partitions[int(cid)]
            model = SGDClassifier(loss='log_loss', random_state=int(cid))
            model.classes_ = classes
            model.coef_ = np.zeros((len(classes), X_train.shape[1]))
            model.intercept_ = np.zeros((len(classes),))
            return SklearnClient(model, X_train, y_train, classes).to_client()

        def evaluate_fn(server_round: int, parameters: fl.common.NDArrays, config: dict):
            global_model.coef_ = parameters[0]
            global_model.intercept_ = parameters[1]
            y_pred = global_model.predict(X_test_full)
            acc = accuracy_score(y_test_full, y_pred)
            f1 = f1_score(y_test_full, y_pred, average='weighted')
            print(f"Round {server_round} - Server Evaluation: Accuracy={acc:.4f}, F1={f1:.4f}")
            federated_metrics.append(acc)
            return float(acc), {"accuracy": float(acc), "f1": float(f1)}

        strategy = fl.server.strategy.FedAvg(
            fraction_fit=1.0,
            fraction_evaluate=0.0,
            min_fit_clients=num_clients,
            min_evaluate_clients=0,
            min_available_clients=num_clients,
            evaluate_fn=evaluate_fn,
            initial_parameters=fl.common.ndarrays_to_parameters(
                [global_model.coef_, global_model.intercept_]
            )
        )

        fl.simulation.start_simulation(
            client_fn=client_fn,
            num_clients=num_clients,
            config=fl.server.ServerConfig(num_rounds=num_rounds),
            strategy=strategy,
            client_resources={"num_cpus": 1.0, "num_gpus": 0.0},
        )
        
    except ImportError:
        federated_metrics = run_pure_simulated_fedavg(
            num_clients, num_rounds, classes, X_test_full, y_test_full, partitions
        )
    
    # Plotting
    plt.figure(figsize=(10, 6))
    rounds = range(1, len(federated_metrics) + 1)
    plt.plot(rounds, federated_metrics, marker='o', label='Custom FedAvg Implementation', linewidth=2)
    if centralized_acc > 0:
        plt.axhline(y=centralized_acc, color='r', linestyle='--', label='Centralized Baseline', linewidth=2)
    plt.title('Custom FedAvg Implementation vs Centralized Accuracy Convergence\n(Used as substitute because flwr could not be installed)')
    plt.xlabel('Communication Round')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True)
    
    plot_path = os.path.join(RESULTS_DIR, 'convergence_plot.png')
    plt.savefig(plot_path)
    print(f"Saved convergence plot to {plot_path}")
    
    final_acc = federated_metrics[-1] if federated_metrics else 0.0
    return final_acc
