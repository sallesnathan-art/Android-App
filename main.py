from flask import Flask, jsonify, request
import threading
import time
import signal

app = Flask(__name__)

# Placeholder for cellular signal data
cellular_signals = []

# Function to simulate signal scanning
def scan_signals():
    while True:
        # Simulate getting new signal data
        new_signal = {
            'carrier': 'CarrierName',
            'signal_strength': -70,
            'timestamp': time.strftime('%Y-%m-%d %H:%M:%S')
        }
        cellular_signals.append(new_signal)
        time.sleep(5)  # Scan every 5 seconds

@app.route('/signals', methods=['GET'])
def get_signals():
    return jsonify(cellular_signals), 200

@app.route('/compare_carriers', methods=['POST'])
def compare_carriers():
    data = request.json
    if 'carriers' not in data:
        return jsonify({'error': 'No carriers provided'}), 400
    # Placeholder for carrier comparison logic
    comparison_result = {carrier: 'Data for ' + carrier for carrier in data['carriers']}
    return jsonify(comparison_result), 200

# Function to handle graceful shutdown
def shutdown(signal_received, frame):
    print('Shutting down gracefully...')
    exit(0)

# Start the background scanning thread
signal.signal(signal.SIGINT, shutdown)
scan_thread = threading.Thread(target=scan_signals)
scan_thread.start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)