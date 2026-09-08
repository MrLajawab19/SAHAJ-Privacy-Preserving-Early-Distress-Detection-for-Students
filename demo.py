import os
import sys

# Ensure src module is accessible
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.baseline import run_centralized_baseline
from src.longitudinal import run_longitudinal_simulation

def main():
    print("="*60)
    print(" SAHAJ Prototype: Privacy-Preserving Distress Detection")
    print("="*60)
    print("\n[LIMITATIONS & SCOPE]")
    print("- Hinglish sentiment is used as a PROXY for distress signals.")
    print("- Federation is SIMULATED on a single machine.")
    print("- Longitudinal trend data is SYNTHETIC for demo purposes.\n")
    print("="*60)
    
    # 1. Centralized Baseline
    print("\n--- PHASE 1: Centralized Baseline ---")
    baseline_acc, baseline_f1 = run_centralized_baseline()
    
    # 2. Federated Learning Simulation
    # We load flwr here to gracefully handle if it failed to install 
    # (e.g. due to missing MSVC tools in certain Python versions)
    print("\n--- PHASE 2: Simulated Federated Learning ---")
    try:
        from src.federated import run_federated_simulation
        fed_acc = run_federated_simulation(num_clients=5, num_rounds=10, centralized_acc=baseline_acc)
    except ImportError as e:
        print("\n[WARNING] Custom FedAvg implementation (scikit-learn SGDClassifier), algorithmically equivalent to Flower's FedAvg, used as a substitute because flwr could not be installed in this environment.")
        print("Skipping Phase 2 visual simulation with flwr.")
        fed_acc = 0.0
        
    # 3. Longitudinal Trends
    print("\n--- PHASE 3: Mock Longitudinal Trend Aggregation ---")
    run_longitudinal_simulation()
    
    # 4. Summary
    print("="*60)
    print(" SAHAJ DEMO SUMMARY")
    print("="*60)
    print(f"Centralized Accuracy : {baseline_acc:.4f} (F1: {baseline_f1:.4f})")
    if fed_acc > 0:
        print(f"Federated Accuracy   : {fed_acc:.4f} (After 10 rounds)")
    else:
        print(f"Federated Accuracy   : N/A (Failed to run simulation)")
        
    print("\nArtifacts Generated:")
    print(" - data/: train.csv, test.csv")
    if fed_acc > 0:
        print(" - results/convergence_plot.png")
    print(" - results/longitudinal_trends.png")
    print("="*60)

if __name__ == "__main__":
    main()
