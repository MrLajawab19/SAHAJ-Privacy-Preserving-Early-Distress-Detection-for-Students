import urllib.request
import base64
import os

out_dir = r"d:\Sahaj Major project\Sahaj\Conference-LaTeX-template_10-17-19"

def generate(filename, mmd):
    b64 = base64.urlsafe_b64encode(mmd.encode('utf-8')).decode('ascii')
    url = f"https://mermaid.ink/img/{b64}?type=png&bgColor=white"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req) as response, open(os.path.join(out_dir, filename), 'wb') as out_file:
            out_file.write(response.read())
        print(f"Downloaded {filename}")
    except Exception as e:
        print(f"Error downloading {filename}: {e}")

arch = """graph LR
    subgraph Edge Device [Local On-Device Processing]
        direction TB
        L1[1. User Device Layer <br/> Secure input stream capture]
        L2[2. Data Processing Layer <br/> Non-alphanumeric filtration]
        L3[3. Hinglish NLP Layer <br/> Code-mixed syntax parser]
        L4[4. Feature Extraction Layer <br/> On-device TF-IDF vectorization]
        L5[5. Distress Scoring Layer <br/> Local SGD Inference]
        L6[6. Federated Learning Layer <br/> Local Gradient Compute]
        
        L1 --> L2 --> L3 --> L4 --> L5 --> L6
    end
    
    subgraph Cloud Server [Aggregation & Tracking]
        direction TB
        L7[7. Aggregation Server Layer <br/> Secure FedAvg Global Update]
        L8[8. Longitudinal Monitoring Layer <br/> Multi-week moving avg tracking]
        L9[9. Recommendation Layer <br/> Consent-gated intervention trigger]
        
        L7 --> L8 --> L9
    end
    
    L6 -- "Encrypted Weights (dw) <br/> No raw data transmitted" --> L7
"""

fed = """sequenceDiagram
    participant C1 as Edge Client 1
    participant C2 as Edge Client 2
    participant S as Aggregation Server
    
    Note over S: Initialize Global Model W_0
    
    loop Communication Round t
        S->>C1: Broadcast Global Model W_t
        S->>C2: Broadcast Global Model W_t
        
        Note over C1: Local SGD over D_1<br/>Compute W_{t+1}^1
        Note over C2: Local SGD over D_2<br/>Compute W_{t+1}^2
        
        C1-->>S: Upload Weights W_{t+1}^1
        C2-->>S: Upload Weights W_{t+1}^2
        
        Note over S: Global FedAvg Aggregation<br/>W_{t+1} = sum (n_k/n) W_{t+1}^k
    end
"""

generate("04_architecture_diagram.png", arch)
generate("05_federated_workflow.png", fed)
