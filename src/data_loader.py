import os
import pandas as pd
import numpy as np
from datasets import load_dataset
from huggingface_hub import HfApi
from sklearn.feature_extraction.text import TfidfVectorizer

DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data')

def generate_synthetic_data(n_samples=800):
    """Generates a synthetic Hinglish sentiment dataset."""
    np.random.seed(42)
    # Examples of positive, negative, and neutral Hinglish text with overlapping vocabulary
    # Overlapping words: bhai, yaar, aaj, kya, experience
    pos = [
        "bhai tu best hai yaar", "this experience is amazing ekdum jhakaas", 
        "great work aaj bohot badiya", "I love this so much kya baat hai",
        "aaj ka experience best tha bhai", "yaar yeh toh ekdum perfect hai",
        "kya maza aaya bhai good job", "yaar you are doing good"
    ]
    neg = [
        "yeh kya bakwas hai yaar", "terrible experience bhai", 
        "mood kharab kar diya aaj", "not good at all kya bekar hai",
        "bhai yeh experience bilkul theek nahi", "yaar kya faaltu kaam kiya",
        "aaj bahut bura laga bhai", "kya yaar not working"
    ]
    neu = [
        "main kal jaunga bhai", "okay theek hai yaar", 
        "let's see kya hota hai aaj", "kuch nahi just chilling experience",
        "bhai kya plan hai", "yaar aaj meeting hai",
        "experience normal tha bhai", "kya kar raha hai yaar"
    ]
    
    data = []
    labels = []
    for _ in range(n_samples):
        # Base logic
        label = np.random.choice([0, 1, 2])
        if label == 0:
            text = np.random.choice(neg)
        elif label == 1:
            text = np.random.choice(neu)
        else:
            text = np.random.choice(pos)
            
        # Add random overlapping words to confuse TF-IDF
        filler = np.random.choice(["", " bhai", " yaar", " kya", " experience", " aaj", " theek", " good", " bad"])
        text += filler
        
        # 10% chance to flip label to simulate human annotation noise
        if np.random.rand() < 0.10:
            label = np.random.choice([0, 1, 2])
            
        data.append(text)
        labels.append(label)
        
    df = pd.DataFrame({'text': data, 'label': labels})
    
    # Shuffle
    df = df.sample(frac=1, random_state=42).reset_index(drop=True)
    
    # Split into train, val, test
    train = df.iloc[:int(n_samples*0.7)]
    val = df.iloc[int(n_samples*0.7):int(n_samples*0.85)]
    test = df.iloc[int(n_samples*0.85):]
    
    return train, val, test

def map_labels(label_str):
    if label_str == 'positive': return 2
    if label_str == 'neutral': return 1
    return 0

def load_and_prepare_data():
    """Loads dataset from HF or generates synthetic, saves to CSV."""
    os.makedirs(DATA_DIR, exist_ok=True)
    
    train_path = os.path.join(DATA_DIR, 'train.csv')
    val_path = os.path.join(DATA_DIR, 'val.csv')
    test_path = os.path.join(DATA_DIR, 'test.csv')
    
    if os.path.exists(train_path) and os.path.exists(test_path):
        print("Loading existing dataset from data/ directory...")
        train = pd.read_csv(train_path)
        val = pd.read_csv(val_path) if os.path.exists(val_path) else None
        test = pd.read_csv(test_path)
        return train, val, test

    print("Attempting to load 'lince' 'sa_hineng' from HuggingFace...")
    try:
        # Instead of HuggingFace, we now use the real SemEval-2020 Task 9 SentiMix Hinglish dataset
        print("Using the real SemEval-2020 Task 9 SentiMix Hinglish dataset...")
        dataset_path = os.path.join(DATA_DIR, 'FinalTrainingOnly.tsv')
        
        if not os.path.exists(dataset_path):
            raise FileNotFoundError(f"Dataset not found at {dataset_path}")
            
        # Read the TSV file
        df = pd.read_csv(dataset_path, sep='\t', names=['tweet_id', 'text', 'label'])
        
        # Drop rows with NaN text
        df = df.dropna(subset=['text'])
        
        # Map labels: assuming 0, 1, 2 exist, keep them as integer
        df['label'] = df['label'].astype(int)
        
        # Shuffle
        df = df.sample(frac=1, random_state=42).reset_index(drop=True)
        
        n_samples = len(df)
        train = df.iloc[:int(n_samples*0.7)]
        val = df.iloc[int(n_samples*0.7):int(n_samples*0.85)]
        test = df.iloc[int(n_samples*0.85):]
        
    except Exception as e:
        print(f"Failed to load real dataset: {e}")
        print("Falling back to synthetic data generation (Simulated Hinglish corpus)...")
        train, val, test = generate_synthetic_data()

    train.to_csv(train_path, index=False)
    if val is not None:
        val.to_csv(val_path, index=False)
    test.to_csv(test_path, index=False)
    print("Dataset saved to data/ directory.")
    return train, val, test

def prepare_federated_data(num_clients):
    """
    Loads data, fits TF-IDF centrally (IMPORTANT constraint), 
    and partitions data for clients.
    """
    train, val, test = load_and_prepare_data()
    
    # 1. Fit TF-IDF on the full centralized training set
    vectorizer = TfidfVectorizer(max_features=5000)
    X_train_full = vectorizer.fit_transform(train['text'].fillna(''))
    y_train_full = train['label'].values
    
    X_test_full = vectorizer.transform(test['text'].fillna(''))
    y_test_full = test['label'].values
    
    # Extract unique classes to pass to clients (IMPORTANT constraint)
    classes = np.unique(y_train_full)
    
    # Partition data among clients
    # Non-IID split: sort by labels to create skewed client shards
    num_samples = X_train_full.shape[0]
    sorted_indices = np.argsort(y_train_full)
    
    partitions = []
    chunk_size = num_samples // num_clients
    for i in range(num_clients):
        start = i * chunk_size
        end = start + chunk_size if i < num_clients - 1 else num_samples
        client_indices = sorted_indices[start:end]
        
        # Shuffle the chunk internally
        client_indices = np.random.permutation(client_indices)
        
        X_client = X_train_full[client_indices]
        y_client = y_train_full[client_indices]
        partitions.append((X_client, y_client))
        
    return vectorizer, partitions, (X_test_full, y_test_full), classes
