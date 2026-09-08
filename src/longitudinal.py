import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import os

RESULTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'results')

def generate_mock_longitudinal_data(num_students=5, num_weeks=8):
    """Generates synthetic weekly sentiment averages for students."""
    np.random.seed(42)
    
    data = []
    # Sentiment scale: 0.0 (very negative) to 2.0 (very positive)
    # 1.0 is neutral
    
    for i in range(num_students):
        student_id = f"Student_{i+1}"
        
        if i == 0:
            # Inject clear downward trend for Student 1
            # Starts neutral/positive, drops steadily
            scores = np.linspace(1.5, 0.2, num_weeks) + np.random.normal(0, 0.1, num_weeks)
        else:
            # Stable or noisy patterns
            base = np.random.uniform(0.8, 1.8)
            scores = base + np.random.normal(0, 0.2, num_weeks)
            
        scores = np.clip(scores, 0.0, 2.0)
        
        for week in range(num_weeks):
            data.append({
                'student_id': student_id,
                'week': week + 1,
                'sentiment_score': scores[week]
            })
            
    return pd.DataFrame(data)

def detect_trends(df, threshold=0.8, consecutive_weeks=3):
    """
    Detects students showing a sustained decline crossing a critical threshold.
    """
    escalations = []
    
    for student_id, group in df.groupby('student_id'):
        scores = group.sort_values('week')['sentiment_score'].values
        
        # Check for consecutive weeks below threshold
        below_thresh_count = 0
        for score in scores:
            if score < threshold:
                below_thresh_count += 1
                if below_thresh_count >= consecutive_weeks:
                    escalations.append(student_id)
                    break
            else:
                below_thresh_count = 0
                
    return escalations

def run_longitudinal_simulation():
    print("\nRunning Mock Longitudinal Trend Aggregation...")
    os.makedirs(RESULTS_DIR, exist_ok=True)
    
    df = generate_mock_longitudinal_data()
    escalations = detect_trends(df)
    
    print(f"Trend Detection Output -> Students flagged for escalation: {escalations}")
    
    # Plotting
    plt.figure(figsize=(10, 6))
    
    for student_id, group in df.groupby('student_id'):
        scores = group.sort_values('week')['sentiment_score'].values
        weeks = group.sort_values('week')['week'].values
        
        if student_id in escalations:
            plt.plot(weeks, scores, marker='o', linewidth=3, label=f"{student_id} (Flagged)", color='red')
        else:
            plt.plot(weeks, scores, marker='x', linestyle='--', alpha=0.6, label=student_id)
            
    plt.axhline(y=0.8, color='k', linestyle=':', label='Escalation Threshold')
    plt.title('Longitudinal Sentiment Trends (Simulated)')
    plt.xlabel('Week')
    plt.ylabel('Average Sentiment Score (0=Neg, 2=Pos)')
    plt.legend()
    plt.grid(True)
    
    plot_path = os.path.join(RESULTS_DIR, 'longitudinal_trends.png')
    plt.savefig(plot_path)
    print(f"Saved trend plot to {plot_path}\n")
