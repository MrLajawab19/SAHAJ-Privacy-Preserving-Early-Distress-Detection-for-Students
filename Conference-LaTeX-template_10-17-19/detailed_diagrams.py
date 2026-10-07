import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

out_dir = r"d:\Sahaj Major project\Sahaj\Conference-LaTeX-template_10-17-19"

def draw_architecture():
    fig, ax = plt.subplots(figsize=(10, 8))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    # Colors
    c_edge = '#e6f2ff'
    c_cloud = '#f9ebea'
    c_line = '#2c3e50'
    c_text = '#17202a'

    # Backgrounds for Edge and Cloud
    ax.add_patch(patches.Rectangle((0.5, 0.5), 4, 9, facecolor=c_edge, edgecolor='gray', linestyle='--', alpha=0.5))
    ax.text(2.5, 9.2, 'EDGE DEVICE (ON-DEVICE PROCESSING)', fontsize=10, ha='center', weight='bold', color=c_line)

    ax.add_patch(patches.Rectangle((5.5, 0.5), 4, 9, facecolor=c_cloud, edgecolor='gray', linestyle='--', alpha=0.5))
    ax.text(7.5, 9.2, 'CLOUD (AGGREGATION & TRACKING)', fontsize=10, ha='center', weight='bold', color=c_line)

    # Function to draw a layer box
    def draw_box(x, y, w, h, title, desc):
        ax.add_patch(patches.FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.1", fc='white', ec=c_line, lw=1.5))
        ax.text(x + w/2, y + h/2 + 0.2, title, ha='center', va='center', weight='bold', fontsize=9, color=c_text)
        ax.text(x + w/2, y + h/2 - 0.2, desc, ha='center', va='center', fontsize=7, color='gray')

    # Edge Layers (Left column)
    draw_box(1, 7.5, 3, 1, '1. User Device Layer', 'Secure input stream capture')
    draw_box(1, 6.0, 3, 1, '2. Data Processing Layer', 'Non-alphanumeric filtration')
    draw_box(1, 4.5, 3, 1, '3. Hinglish NLP Layer', 'Code-mixed syntax parser')
    draw_box(1, 3.0, 3, 1, '4. Feature Extraction', 'On-device TF-IDF vectorization')
    draw_box(1, 1.5, 3, 1, '5. Distress Scoring & FL', r'Local SGD Inference & $\Delta w$ Compute')

    # Cloud Layers (Right column)
    draw_box(6, 6.0, 3, 1, '6. Aggregation Server', 'Secure FedAvg Global Update')
    draw_box(6, 4.5, 3, 1, '7. Longitudinal Layer', 'Multi-week moving average tracking')
    draw_box(6, 3.0, 3, 1, '8. Thresholding Filter', 'Transient spike filtration')
    draw_box(6, 1.5, 3, 1, '9. Recommendation Layer', 'Consent-gated intervention trigger')

    # Arrows Down in Edge
    for y in [7.5, 6.0, 4.5, 3.0]:
        ax.annotate('', xy=(2.5, y), xytext=(2.5, y+0.5), arrowprops=dict(arrowstyle="->", color=c_line, lw=1.5))
    
    # Arrows Down in Cloud
    for y in [6.0, 4.5, 3.0]:
        ax.annotate('', xy=(7.5, y), xytext=(7.5, y+0.5), arrowprops=dict(arrowstyle="->", color=c_line, lw=1.5))

    # Cross Arrow (Edge to Cloud)
    ax.annotate('', xy=(6.0, 6.5), xytext=(4.0, 2.0), arrowprops=dict(connectionstyle="arc3,rad=-0.2", arrowstyle="->", color='#c0392b', lw=2))
    ax.text(5.0, 4.5, r'Encrypted Weights ($\Delta w$)' + '\nNo raw data transmitted', fontsize=8, color='#c0392b', ha='center', weight='bold', rotation=35)

    plt.title("SAHAJ 9-Layer Architecture Diagram", fontsize=14, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, '04_architecture_diagram.png'), dpi=300)
    plt.close()

def draw_federated():
    fig, ax = plt.subplots(figsize=(10, 6))
    ax.set_xlim(0, 10)
    ax.set_ylim(0, 10)
    ax.axis('off')

    c_line = '#2c3e50'
    
    # Server Box
    ax.add_patch(patches.FancyBboxPatch((3.5, 7.5), 3, 1.5, boxstyle="round,pad=0.1", fc='#e8f8f5', ec='#117a65', lw=2))
    ax.text(5, 8.5, 'Central Aggregation Server', ha='center', va='center', weight='bold', fontsize=11)
    ax.text(5, 8.0, r'$W_{t+1} = \sum_{k=1}^K \frac{n_k}{n} W_{t+1}^k$', ha='center', va='center', fontsize=12)

    # Clients
    clients = [
        (1, 2, 'Edge Client 1', r'Local Data $D_1$'),
        (4, 2, 'Edge Client 2', r'Local Data $D_2$'),
        (7, 2, 'Edge Client $K$', r'Local Data $D_K$')
    ]

    for x, y, title, data in clients:
        ax.add_patch(patches.FancyBboxPatch((x, y), 2, 2.5, boxstyle="round,pad=0.1", fc='#fdedec', ec='#a93226', lw=1.5))
        ax.text(x+1, y+2.1, title, ha='center', va='center', weight='bold', fontsize=9)
        ax.text(x+1, y+1.6, data, ha='center', va='center', fontsize=9)
        ax.text(x+1, y+1.1, r'$\nabla \mathcal{L}(W_t; D_k)$', ha='center', va='center', fontsize=9)
        ax.text(x+1, y+0.6, r'$W_{t+1}^k$', ha='center', va='center', fontsize=10, weight='bold')

    # Ellipsis for intermediate clients
    ax.text(6.5, 3.25, '. . .', ha='center', va='center', fontsize=20, weight='bold', color='gray')

    # Download Arrows
    ax.annotate('', xy=(2, 4.5), xytext=(4.5, 7.5), arrowprops=dict(connectionstyle="arc3,rad=0.1", arrowstyle="->", color='#2980b9', lw=2))
    ax.text(2.6, 6.2, 'Broadcast $W_t$', fontsize=9, color='#2980b9', weight='bold', rotation=45)

    ax.annotate('', xy=(5, 4.5), xytext=(5, 7.5), arrowprops=dict(arrowstyle="->", color='#2980b9', lw=2))
    ax.text(5.1, 6.2, 'Broadcast $W_t$', fontsize=9, color='#2980b9', weight='bold')

    ax.annotate('', xy=(8, 4.5), xytext=(5.5, 7.5), arrowprops=dict(connectionstyle="arc3,rad=-0.1", arrowstyle="->", color='#2980b9', lw=2))
    ax.text(7.4, 6.2, 'Broadcast $W_t$', fontsize=9, color='#2980b9', weight='bold', rotation=-45)

    # Upload Arrows
    ax.annotate('', xy=(4.3, 7.5), xytext=(1.5, 4.5), arrowprops=dict(connectionstyle="arc3,rad=0.1", arrowstyle="->", color='#27ae60', lw=2, ls='--'))
    ax.text(1.8, 5.5, 'Upload $W_{t+1}^1$', fontsize=9, color='#27ae60', weight='bold', rotation=45)

    ax.annotate('', xy=(4.8, 7.5), xytext=(4.8, 4.5), arrowprops=dict(arrowstyle="->", color='#27ae60', lw=2, ls='--'))
    ax.text(3.7, 5.5, 'Upload $W_{t+1}^2$', fontsize=9, color='#27ae60', weight='bold')

    ax.annotate('', xy=(5.7, 7.5), xytext=(8.5, 4.5), arrowprops=dict(connectionstyle="arc3,rad=-0.1", arrowstyle="->", color='#27ae60', lw=2, ls='--'))
    ax.text(8.2, 5.5, 'Upload $W_{t+1}^K$', fontsize=9, color='#27ae60', weight='bold', rotation=-45)

    plt.title("Detailed SAHAJ Federated Learning Workflow", fontsize=14, weight='bold', pad=20)
    plt.tight_layout()
    plt.savefig(os.path.join(out_dir, '05_federated_workflow.png'), dpi=300)
    plt.close()

if __name__ == '__main__':
    draw_architecture()
    draw_federated()
    print("Detailed diagrams generated!")
