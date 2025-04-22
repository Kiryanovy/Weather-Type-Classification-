from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import sqlite3
import json
from datetime import datetime
import os

# instância Flask
app = Flask(__name__)
CORS(app)  # Permite requisições cross-origin

# Carrega o modelo e o label encoder
model = joblib.load('weather_type_prediction_model.joblib')
le = joblib.load('weather_type_label_encoder.joblib')

# Configurando o banco de dadosbal
def get_db_connection():
    conn = sqlite3.connect('weather_predictions.db')
    conn.row_factory = sqlite3.Row
    return conn

# Cria tabela no banco de dados se não existir
def init_db():
    conn = get_db_connection()
    conn.execute('''
    CREATE TABLE IF NOT EXISTS predictions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        input_data TEXT NOT NULL,
        prediction TEXT NOT NULL,
        prediction_probability REAL,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    conn.commit()
    conn.close()

# Inicializa o banco de dados na inicialização
init_db()

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Obter dados da requisição
        data = request.json
        
        # Cria DataFrame com os dados recebidos
        input_df = pd.DataFrame({
            'Temperature': [data.get('temperature', 0)],
            'Humidity': [data.get('humidity', 0)],
            'Wind Speed': [data.get('wind_speed', 0)],
            'Precipitation (%)': [data.get('precipitation', 0)],
            'Cloud Cover': [data.get('cloud_cover', '')],
            'Atmospheric Pressure': [data.get('atmospheric_pressure', 0)],
            'UV Index': [data.get('uv_index', 0)],
            'Season': [data.get('season', '')],
            'Visibility (km)': [data.get('visibility', 0)],
            'Location': [data.get('location', '')]
        })
        
        print("Input DataFrame:", input_df)  # Debugging line

        # Faz a predição
        prediction_encoded = model.predict(input_df)
        prediction = le.inverse_transform(prediction_encoded)[0]
        
        # Tenta obter probabilidade (se o modelo suportar)
        try:
            probabilities = model.predict_proba(input_df)[0]
            max_probability = max(probabilities)
        except:
            max_probability = None
        
        # Salva a predição no banco de dados
        conn = get_db_connection()
        conn.execute('''
        INSERT INTO predictions (input_data, prediction, prediction_probability)
        VALUES (?, ?, ?)
        ''', (json.dumps(data), prediction, max_probability))
        conn.commit()
        conn.close()
        
        # Retorna o resultado
        response = {
            'prediction': prediction,
            'probability': max_probability,
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
        
        return jsonify(response)
    
    except Exception as e:
        return jsonify({'error': repr(e)}), 500

@app.route('/predictions', methods=['GET'])
def get_predictions():
    try:
        # Obtem parâmetros de paginação
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        offset = (page - 1) * per_page
        
        # Consulta banco de dados
        conn = get_db_connection()
        predictions = conn.execute('''
        SELECT * FROM predictions
        ORDER BY timestamp DESC
        LIMIT ? OFFSET ?
        ''', (per_page, offset)).fetchall()
        
        # Conta total de registros
        total = conn.execute('SELECT COUNT(*) FROM predictions').fetchone()[0]
        conn.close()
        
        # Formata resultados
        results = []
        for pred in predictions:
            input_data = json.loads(pred['input_data'])
            results.append({
                'id': pred['id'],
                'input_data': input_data,
                'prediction': pred['prediction'],
                'prediction_probability': pred['prediction_probability'],
                'timestamp': pred['timestamp']
            })
        
        return jsonify({
            'predictions': results,
            'total': total,
            'page': page,
            'per_page': per_page,
            'pages': (total + per_page - 1) // per_page
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        conn = get_db_connection()
        
        # Estatísticas por tipo de clima
        weather_stats = conn.execute('''
        SELECT prediction, COUNT(*) as count
        FROM predictions
        GROUP BY prediction
        ORDER BY count DESC
        ''').fetchall()
        
        # Total de predições
        total_predictions = conn.execute('SELECT COUNT(*) FROM predictions').fetchone()[0]
        
        # Predições recentes (últimas 24 horas)
        recent_predictions = conn.execute('''
        SELECT COUNT(*) FROM predictions
        WHERE timestamp > datetime('now', '-1 day')
        ''').fetchone()[0]
        
        conn.close()
        
        # Formata estatísticas
        weather_distribution = []
        for stat in weather_stats:
            weather_distribution.append({
                'weather_type': stat['prediction'],
                'count': stat['count'],
                'percentage': (stat['count'] / total_predictions * 100) if total_predictions > 0 else 0
            })
        
        return jsonify({
            'total_predictions': total_predictions,
            'recent_predictions': recent_predictions,
            'weather_distribution': weather_distribution
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)